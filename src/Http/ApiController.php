<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;

final readonly class ApiController
{
    public function __construct(
        private FileManager $files,
        private CsrfGuard $csrf,
        private PluginRegistry $plugins,
        /** @var array<string, array{width:int,height:int,quality:int}> */
        private array $imagePresets = [],
        private ?MetadataManager $metadata = null,
    ) {
    }

    public function config(): JsonResponse
    {
        return $this->success([
            'resources' => $this->files->resources(),
            'plugins' => $this->plugins->descriptors(),
            'imagePresets' => $this->imagePresets,
        ]);
    }

    public function entries(Request $request): JsonResponse
    {
        $resource = $this->resource($request);
        $search = (string) $request->query->get('search', '');
        $searchMode = strtolower((string) $request->query->get('searchMode', 'name'));
        $onlyPaths = null;
        if ($searchMode === 'tags' && trim($search) !== '') {
            $onlyPaths = $this->taggedPaths($resource, $search);
            $search = '';
        }
        return $this->success($this->files->list(
            $resource,
            (string) $request->query->get('path', ''),
            $search,
            (string) $request->query->get('sort', 'name'),
            (string) $request->query->get('direction', 'asc'),
            $request->query->getInt('offset'),
            $request->query->getInt('limit', 100),
            $onlyPaths,
        ));
    }

    /** @return list<string> */
    private function taggedPaths(string $resource, string $search): array
    {
        if ($this->metadata === null) {
            return [];
        }
        $terms = array_values(array_unique(array_filter(array_map(
            static fn (string $term): string => mb_strtolower(trim($term)),
            preg_split('/[,，]+/u', $search) ?: [],
        ))));
        if ($terms === []) {
            return [];
        }
        $paths = [];
        foreach ($this->metadata->get($resource)['tags'] as $path => $tags) {
            $normalized = array_map(static fn (string $tag): string => mb_strtolower($tag), $tags);
            $matches = array_filter($terms, static fn (string $term): bool => array_filter($normalized, static fn (string $tag): bool => str_contains($tag, $term)) !== []);
            if (count($matches) === count($terms)) {
                $paths[] = $path;
            }
        }

        return $paths;
    }

    public function createFolder(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $entry = $this->files->createFolder(
            $this->resource($request, $data),
            (string) ($data['path'] ?? ''),
            (string) ($data['name'] ?? ''),
        );

        return $this->success(['entry' => $entry], 201);
    }

    public function upload(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $uploaded = $request->files->get('upload');
        if (!$uploaded instanceof UploadedFile || !$uploaded->isValid()) {
            throw new SoFinderException('No valid uploaded file was received.', 'invalid_upload', 400);
        }
        $stream = fopen($uploaded->getPathname(), 'rb');
        if ($stream === false) {
            throw new SoFinderException('Unable to read the uploaded file.', 'invalid_upload', 400);
        }
        try {
            $entry = $this->files->upload(
                $this->resource($request),
                (string) $request->request->get('path', ''),
                $uploaded->getClientOriginalName(),
                (int) $uploaded->getSize(),
                $stream,
                $request->request->getBoolean('overwrite'),
            );
        } finally {
            fclose($stream);
        }

        return $this->success(['entry' => $entry], 201);
    }

    public function rename(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $entry = $this->files->rename(
            $this->resource($request, $data),
            (string) ($data['path'] ?? ''),
            (string) ($data['name'] ?? ''),
            (bool) ($data['overwrite'] ?? false),
        );

        return $this->success(['entry' => $entry]);
    }

    public function transfer(Request $request, string $operation): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $entry = $this->files->transfer(
            $operation,
            $this->resource($request, $data),
            (string) ($data['path'] ?? ''),
            (string) ($data['destination'] ?? ''),
            (bool) ($data['overwrite'] ?? false),
            (bool) ($data['autoRename'] ?? false),
        );

        return $this->success(['entry' => $entry]);
    }

    public function delete(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $trashed = $this->files->delete($this->resource($request, $data), (string) ($data['path'] ?? ''));

        return $this->success(['trash' => $trashed]);
    }

    public function trash(Request $request): JsonResponse
    {
        return $this->success($this->files->trash(
            $this->resource($request),
            $request->query->getInt('offset'),
            $request->query->getInt('limit', 50),
            (string) $request->query->get('search', ''),
        ));
    }

    public function restoreTrash(Request $request, string $id): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $entry = $this->files->restoreTrash(
            $this->resource($request, $data),
            $id,
            (string) ($data['conflict'] ?? 'cancel'),
        );

        return $this->success(['entry' => $entry]);
    }

    public function permanentlyDeleteTrash(Request $request, string $id): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $this->files->permanentlyDeleteTrash($this->resource($request, $data), $id);

        return $this->success();
    }

    public function batch(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $paths = $data['paths'] ?? null;
        if (!is_array($paths) || array_filter($paths, static fn (mixed $path): bool => !is_string($path)) !== []) {
            throw new SoFinderException('Batch paths must be an array of strings.', 'invalid_batch_paths', 400);
        }

        return $this->success($this->files->batch(
            (string) ($data['operation'] ?? ''),
            $this->resource($request, $data),
            array_values($paths),
            (string) ($data['destination'] ?? ''),
            (bool) ($data['overwrite'] ?? false),
            (bool) ($data['autoRename'] ?? true),
        ));
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
        $lastModified = (new \DateTimeImmutable())->setTimestamp($entry->modifiedAt);
        $response = new StreamedResponse();
        $response->setEtag($etag);
        $response->setLastModified($lastModified);
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
        $safeInline = in_array(strtolower($mime), ['image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'], true);
        $requestedInline = strtolower((string) $request->query->get('disposition', 'inline')) === 'inline';
        $disposition = $requestedInline && $safeInline
            ? ResponseHeaderBag::DISPOSITION_INLINE
            : ResponseHeaderBag::DISPOSITION_ATTACHMENT;
        $response->headers->set('Content-Type', $mime);
        $response->headers->set('Content-Disposition', $response->headers->makeDisposition($disposition, $entry->name));

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

    /** @param array<string, mixed>|null $data */
    private function resource(Request $request, ?array $data = null): string
    {
        return (string) (($data['resource'] ?? null) ?: $request->query->get('resource', $request->request->get('resource', 'Files')));
    }

    /** @return array<string, mixed> */
    private function json(Request $request): array
    {
        try {
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
        }

        if (!is_array($data)) {
            throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
        }

        return $data;
    }

    /** @param array<string, mixed> $data */
    private function success(array $data = [], int $status = 200): JsonResponse
    {
        return new JsonResponse(OperationResult::success($data), $status);
    }
}
