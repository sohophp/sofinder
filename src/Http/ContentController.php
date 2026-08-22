<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Streams authenticated file content without exposing storage internals. */
final readonly class ContentController
{
    public function __construct(
        private FileManager $files,
        private ImageFormatRegistry $imageFormats = new ImageFormatRegistry(),
    ) {
    }

    public function download(Request $request): Response
    {
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
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, $entry->name));
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }

    public function content(Request $request): Response
    {
        $resource = $this->resource($request);
        $path = (string) $request->query->get('path', '');
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory) {
            throw new SoFinderException('Folders have no readable content.', 'invalid_type', 400);
        }

        $stream = $this->files->read($resource, $path);
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
        $requestedInline = strtolower((string) $request->query->get('disposition', 'inline')) === 'inline';
        $response->headers->set('Content-Type', $mime);
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition(
            $requestedInline && $safeInline ? ResponseHeaderBag::DISPOSITION_INLINE : ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $entry->name,
        ));

        $start = 0;
        $end = max(0, $entry->size - 1);
        $range = $request->headers->get('Range');
        if ($range !== null && $range !== '') {
            [$start, $end] = $this->parseRange($range, $entry->size);
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
}
