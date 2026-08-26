<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class ApiController
{
    private const MIN_PAGE_SIZE = 10;
    private const MAX_PAGE_SIZE = 500;

    public function __construct(
        private FileManager $files,
        private CsrfGuard $csrf,
        private PluginRegistry $plugins,
        /** @var array<string, array{width:int,height:int,quality:int}> */
        private array $imagePresets = [],
        private ?MetadataManager $metadata = null,
        private ?ImageCapabilityProviderInterface $imageCapabilities = null,
        /** @var array{mode?:string,header?:bool,logo?:bool,search?:bool,language_switcher?:bool,view_switcher?:bool,folder_tree?:bool,scale?:string} */
        private array $ui = [],
        private ?FeaturePolicy $features = null,
        private bool $signedUrlsEnabled = false,
        private int $signedUrlDefaultTtl = 300,
        private int $signedUrlMaxTtl = 3600,
    ) {
    }

    public function config(): JsonResponse
    {
        return $this->success([
            'apiVersion' => '1.0',
            'resources' => $this->files->resources(),
            'plugins' => $this->plugins->descriptors(),
            'imagePresets' => $this->imagePresets,
            'imageCapabilities' => [
                'driver' => $this->imageCapabilities?->driver() ?? '',
                'formats' => $this->imageCapabilities?->capabilities() ?? [],
            ],
            'uiDefaults' => [
                'scale' => (string) ($this->ui['scale'] ?? 'standard'),
                'mode' => (string) ($this->ui['mode'] ?? 'auto'),
                'header' => (bool) ($this->ui['header'] ?? true),
                'logo' => (bool) ($this->ui['logo'] ?? true),
                'search' => (bool) ($this->ui['search'] ?? true),
                'languageSwitcher' => (bool) ($this->ui['language_switcher'] ?? true),
                'viewSwitcher' => (bool) ($this->ui['view_switcher'] ?? true),
            ],
            'featureAvailability' => $this->featurePolicy()->browserAvailability(),
            'signedUrls' => [
                'enabled' => $this->signedUrlsEnabled,
                'defaultTtlSeconds' => $this->signedUrlDefaultTtl,
                'maxTtlSeconds' => $this->signedUrlMaxTtl,
            ],
        ]);
    }

    public function entries(Request $request): JsonResponse
    {
        $resource = $this->resource($request);
        $search = (string) $request->query->get('search', '');
        $searchMode = strtolower((string) $request->query->get('searchMode', 'name'));
        $onlyPaths = null;
        if ($searchMode === 'tags') {
            $this->featurePolicy()->assertEnabled('tags');
            if (trim($search) !== '') {
                $onlyPaths = $this->taggedPaths($resource, $search);
                $search = '';
            }
        }
        return $this->success($this->files->list(
            $resource,
            (string) $request->query->get('path', ''),
            $search,
            (string) $request->query->get('sort', 'name'),
            (string) $request->query->get('direction', 'asc'),
            $request->query->getInt('offset'),
            max(self::MIN_PAGE_SIZE, min(self::MAX_PAGE_SIZE, $request->query->getInt('limit', 100))),
            $onlyPaths,
            $request->query->get('cursor') !== null ? (string) $request->query->get('cursor') : null,
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
                $request->request->getBoolean('autoRename'),
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
        $this->featurePolicy()->assertEnabled('trash');

        return $this->success($this->files->trash(
            $this->resource($request),
            $request->query->getInt('offset'),
            $request->query->getInt('limit', 50),
            (string) $request->query->get('search', ''),
        ));
    }

    public function restoreTrash(Request $request, string $id): JsonResponse
    {
        $this->featurePolicy()->assertEnabled('trash');
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
        $this->featurePolicy()->assertEnabled('trash');
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

    public function batchRename(Request $request): JsonResponse
    {
        $this->featurePolicy()->assertEnabled('batch_rename');
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $renames = $data['renames'] ?? null;
        if (!is_array($renames)) throw new SoFinderException('Batch renames must be an array.', 'invalid_batch_paths', 400);
        $normalized = [];
        foreach ($renames as $rename) {
            if (!is_array($rename) || !is_string($rename['path'] ?? null) || !is_string($rename['name'] ?? null)) {
                throw new SoFinderException('Each batch rename requires string path and name fields.', 'invalid_batch_paths', 400);
            }
            $normalized[] = ['path' => $rename['path'], 'name' => $rename['name']];
        }

        return $this->success($this->files->batchRename($this->resource($request, $data), $normalized));
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

    private function featurePolicy(): FeaturePolicy
    {
        return $this->features ?? new FeaturePolicy();
    }

    /** @param array<string, mixed> $data */
    private function success(array $data = [], int $status = 200): JsonResponse
    {
        return new JsonResponse(OperationResult::success($data), $status);
    }
}
