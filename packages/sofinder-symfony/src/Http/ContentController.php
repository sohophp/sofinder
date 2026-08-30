<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use SohoPHP\SoFinder\Value\Entry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Streams authenticated file content without exposing storage internals. */
final class ContentController
{
    private const MAX_TEXT_PREVIEW_BYTES = 262_144;
    private const MAX_CHECKSUM_BYTES = 536_870_912;

    public function __construct(
        private readonly FileManager $files,
        private readonly ImageFormatRegistry $imageFormats = new ImageFormatRegistry(),
        private readonly ?FeaturePolicy $features = null,
        private readonly ?ContentReadActions $actions = null,
        private readonly ?ContentStreamActions $streamActions = null,
    ) {
    }

    public function download(Request $request): Response
    {
        if ($this->streamActions !== null) {
            return SymfonyStreamResponseFactory::create($this->streamActions->download->execute(SymfonyRequestContextProvider::fromRequest($request)));
        }
        $resource = $this->resource($request);
        $path = (string) $request->query->get('path', '');
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory) {
            throw new SoFinderException('Folders cannot be downloaded directly.', 'invalid_type', 400);
        }
        $stream = $this->files->read($resource, $path);
        $response = new StreamedResponse(static function () use ($stream): void {
            try {
                fpassthru($stream);
            } finally {
                fclose($stream);
            }
        });
        $response->headers->set('Content-Type', $entry->mimeType ?? 'application/octet-stream');
        $response->headers->set('Content-Disposition', ContentDisposition::make(ResponseHeaderBag::DISPOSITION_ATTACHMENT, $entry->name));
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }

    public function content(Request $request): Response
    {
        if ($this->streamActions !== null) {
            return SymfonyStreamResponseFactory::create($this->streamActions->content->execute(SymfonyRequestContextProvider::fromRequest($request)));
        }
        $resource = $this->resource($request);
        $path = (string) $request->query->get('path', '');
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory) {
            throw new SoFinderException('Folders have no readable content.', 'invalid_type', 400);
        }

        $stream = $this->files->read($resource, $path);

        return $this->stream($request, $resource, $entry, $stream);
    }

    /** @param resource $stream */
    public function stream(Request $request, string $resource, Entry $entry, mixed $stream, ?string $disposition = null): Response
    {
        $etag = hash('sha256', $resource . "\0" . $entry->path . "\0" . $entry->size . "\0" . $entry->modifiedAt);
        $response = new StreamedResponse();
        $response->setEtag($etag);
        $response->setLastModified((new \DateTimeImmutable())->setTimestamp($entry->modifiedAt));
        $response->setPrivate();
        $response->headers->set('Cache-Control', 'private, no-cache, must-revalidate');
        $response->headers->set('Accept-Ranges', 'bytes');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Content-Security-Policy', "default-src 'none'; sandbox");

        if ($response->isNotModified($request)) {
            fclose($stream);

            return $response;
        }

        $mime = $entry->mimeType ?? 'application/octet-stream';
        $safeInline = $this->imageFormats->isWebEmbeddableMime($mime);
        $requestedInline = strtolower($disposition ?? (string) $request->query->get('disposition', 'inline')) === 'inline';
        $response->headers->set('Content-Type', $mime);
        $response->headers->set('Content-Disposition', ContentDisposition::make(
            $requestedInline && $safeInline ? ResponseHeaderBag::DISPOSITION_INLINE : ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $entry->name,
        ));

        $start = 0;
        $end = max(0, $entry->size - 1);
        $range = $request->headers->get('Range');
        if ($range !== null && $range !== '') {
            try {
                [$start, $end] = $this->parseRange($range, $entry->size);
            } catch (\Throwable $exception) {
                fclose($stream);
                throw $exception;
            }
            $response->setStatusCode(Response::HTTP_PARTIAL_CONTENT);
            $response->headers->set('Content-Range', sprintf('bytes %d-%d/%d', $start, $end, $entry->size));
        }
        $length = $entry->size === 0 ? 0 : $end - $start + 1;
        $response->headers->set('Content-Length', (string) $length);
        $response->setCallback(static function () use ($stream, $start, $length): void {
            try {
                if ($start > 0 && fseek($stream, $start) !== 0) {
                    $remainingSkip = $start;
                    while ($remainingSkip > 0 && !feof($stream)) {
                        $chunk = fread($stream, min(8192, $remainingSkip));
                        if ($chunk === false || $chunk === '') {
                            break;
                        }
                        $remainingSkip -= strlen($chunk);
                    }
                }
                $remaining = $length;
                while ($remaining > 0 && !feof($stream)) {
                    $chunk = fread($stream, min(65_536, $remaining));
                    if ($chunk === false || $chunk === '') {
                        break;
                    }
                    echo $chunk;
                    $remaining -= strlen($chunk);
                }
            } finally {
                fclose($stream);
            }
        });

        return $response;
    }

    public function checksum(Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $result = $this->actions->checksum->execute(SymfonyRequestContextProvider::fromRequest($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('checksum');
        $resource = $this->resource($request);
        $path = (string) $request->query->get('path', '');
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory) throw new SoFinderException('Folders do not have a file checksum.', 'invalid_type', 400);
        if ($entry->size > self::MAX_CHECKSUM_BYTES) throw new SoFinderException('The file is too large for an interactive checksum.', 'checksum_too_large', 413);
        $stream = $this->files->read($resource, $path);
        try {
            $context = hash_init('sha256');
            hash_update_stream($context, $stream, self::MAX_CHECKSUM_BYTES + 1);
            $checksum = hash_final($context);
        } finally {
            fclose($stream);
        }

        return new JsonResponse(['success' => true, 'data' => ['algorithm' => 'sha256', 'checksum' => $checksum, 'size' => $entry->size]]);
    }

    public function textPreview(Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $result = $this->actions->textPreview->execute(SymfonyRequestContextProvider::fromRequest($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('text_preview');
        $resource = $this->resource($request);
        $path = (string) $request->query->get('path', '');
        $entry = $this->files->entry($resource, $path);
        $mime = strtolower($entry->mimeType ?? '');
        if ($entry->directory || !$this->isTextMime($mime)) {
            throw new SoFinderException('This file type does not support a text preview.', 'preview_unsupported', 415);
        }
        $stream = $this->files->read($resource, $path);
        try {
            $content = stream_get_contents($stream, self::MAX_TEXT_PREVIEW_BYTES + 1);
            if ($content === false) throw new SoFinderException('Unable to read the text preview.', 'preview_failed', 500);
        } finally {
            fclose($stream);
        }
        $truncated = strlen($content) > self::MAX_TEXT_PREVIEW_BYTES;
        if ($truncated) $content = substr($content, 0, self::MAX_TEXT_PREVIEW_BYTES);
        if (str_starts_with($content, "\xEF\xBB\xBF")) $content = substr($content, 3);
        if (!mb_check_encoding($content, 'UTF-8')) {
            throw new SoFinderException('Only UTF-8 text files can be previewed.', 'preview_encoding_unsupported', 415);
        }

        return new JsonResponse(['success' => true, 'data' => ['content' => $content, 'truncated' => $truncated, 'mimeType' => $mime, 'size' => $entry->size]]);
    }

    /** @return array{int,int} */
    private function parseRange(string $range, int $size): array
    {
        if ($size < 1 || preg_match('/^bytes=(\d*)-(\d*)$/D', trim($range), $matches) !== 1 || ($matches[1] === '' && $matches[2] === '')) {
            throw new SoFinderException('The requested byte range is not satisfiable.', 'invalid_range', 416);
        }
        if ($matches[1] === '') {
            $suffix = (int) $matches[2];
            if ($suffix < 1) {
                throw new SoFinderException('The requested byte range is not satisfiable.', 'invalid_range', 416);
            }
            $start = max(0, $size - $suffix);
            $end = $size - 1;
        } else {
            $start = (int) $matches[1];
            $end = $matches[2] === '' ? $size - 1 : min((int) $matches[2], $size - 1);
        }
        if ($start >= $size || $end < $start) {
            throw new SoFinderException('The requested byte range is not satisfiable.', 'invalid_range', 416);
        }

        return [$start, $end];
    }

    private function resource(Request $request): string
    {
        return (string) $request->query->get('resource', $request->request->get('resource', 'Files'));
    }

    private function isTextMime(string $mime): bool
    {
        return str_starts_with($mime, 'text/') || in_array($mime, [
            'application/json', 'application/ld+json', 'application/xml', 'application/x-yaml', 'application/yaml',
        ], true) || str_ends_with($mime, '+json') || str_ends_with($mime, '+xml');
    }
}
