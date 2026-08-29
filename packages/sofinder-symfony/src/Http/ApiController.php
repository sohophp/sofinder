<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Http\Action\ConfigAction;
use SohoPHP\SoFinder\Http\Action\EntriesAction;
use SohoPHP\SoFinder\Http\Action\UploadAction;
use SohoPHP\SoFinder\Http\FileMutationActions;
use SohoPHP\SoFinder\Http\BatchMutationActions;
use SohoPHP\SoFinder\Http\MutationActionInterface;
use SohoPHP\SoFinder\Http\TrashActions;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Value\OperationResult;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class ApiController
{
    public function __construct(
        private FileManager $files,
        private CsrfGuard $csrf,
        private PluginRegistry $plugins,
        /** @var array<string, array{width:int,height:int,quality:int}> */
        private array $imagePresets = [],
        private ?MetadataManager $metadata = null,
        private ?ImageCapabilityProviderInterface $imageCapabilities = null,
        /** @var array{mode?:string,header?:bool,logo?:bool,search?:bool,language_switcher?:bool,view_switcher?:bool,folder_tree?:bool,scale?:string,upload_conflict_strategy?:string,lowercase_upload_extensions?:bool} */
        private array $ui = [],
        private ?FeaturePolicy $features = null,
        private bool $signedUrlsEnabled = false,
        private int $signedUrlDefaultTtl = 300,
        private int $signedUrlMaxTtl = 3600,
        private UploadNamePolicy $uploadNames = new UploadNamePolicy(),
        private ?AssetReferenceFactory $assetReferences = null,
        private bool $assetCatalogEnabled = false,
        private bool $imageVariantsEnabled = false,
        /** @var list<string> */
        private array $assetAltLocales = ['en', 'zh-cn', 'zh-tw'],
        private bool $assetSearchEnabled = true,
        private bool $assetUsageEnabled = false,
        private bool $assetAccessSessionsEnabled = false,
        private ?EntriesAction $entriesAction = null,
        private ?ConfigAction $configAction = null,
        private ?FileMutationActions $mutationActions = null,
        private ?BatchMutationActions $batchActions = null,
        private ?TrashActions $trashActions = null,
        private ?UploadAction $uploadAction = null,
    ) {
    }

    public function config(): JsonResponse
    {
        $action = $this->configAction ?? new ConfigAction(
            $this->files,
            $this->plugins,
            $this->imagePresets,
            $this->imageCapabilities,
            $this->ui,
            $this->featurePolicy(),
            $this->signedUrlsEnabled,
            $this->signedUrlDefaultTtl,
            $this->signedUrlMaxTtl,
            $this->assetCatalogEnabled,
            $this->imageVariantsEnabled,
            $this->assetAltLocales,
            $this->assetSearchEnabled,
            $this->assetUsageEnabled,
            $this->assetAccessSessionsEnabled,
        );
        $result = $action->execute();

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }

    public function entries(Request $request): JsonResponse
    {
        $action = $this->entriesAction ?? new EntriesAction($this->files, $this->metadata, $this->featurePolicy());
        $result = $action->execute(SymfonyRequestContextProvider::fromRequest($request));

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }

    public function createFolder(Request $request): JsonResponse
    {
        if ($this->mutationActions !== null) {
            return $this->mutation($this->mutationActions->createFolder, $request);
        }
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
        if ($this->uploadAction !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $input = $request->request->all();
            $this->uploadAction->assertAllowed($context, $input);
            $uploaded = $request->files->get('upload');
            $input['upload'] = $uploaded instanceof UploadedFile && $uploaded->isValid()
                ? UploadedFileInput::fromPath($uploaded->getPathname(), $uploaded->getClientOriginalName(), (int) $uploaded->getSize(), $uploaded->getError())
                : null;
            $input['resource'] ??= $request->query->get('resource', 'Files');
            $result = $this->uploadAction->execute($context, $input);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
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
                $this->uploadNames->normalize($uploaded->getClientOriginalName()),
                (int) $uploaded->getSize(),
                $stream,
                $request->request->getBoolean('overwrite'),
                $request->request->getBoolean('autoRename'),
            );
        } finally {
            fclose($stream);
        }

        return $this->success(['entry' => $entry, 'asset' => $this->assetReferences?->create($this->resource($request), $entry)], 201);
    }

    public function rename(Request $request): JsonResponse
    {
        if ($this->mutationActions !== null) {
            return $this->mutation($this->mutationActions->rename, $request);
        }
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
        if ($this->mutationActions !== null) {
            return $this->mutation($operation === 'copy' ? $this->mutationActions->copy : $this->mutationActions->move, $request);
        }
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
        if ($this->mutationActions !== null) {
            return $this->mutation($this->mutationActions->delete, $request);
        }
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $trashed = $this->files->delete($this->resource($request, $data), (string) ($data['path'] ?? ''));

        return $this->success(['trash' => $trashed]);
    }

    public function trash(Request $request): JsonResponse
    {
        if ($this->trashActions !== null) {
            $result = $this->trashActions->list->execute(SymfonyRequestContextProvider::fromRequest($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
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
        if ($this->trashActions !== null) {
            return $this->mutation($this->trashActions->restore, $request, ['id' => $id]);
        }
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
        if ($this->trashActions !== null) {
            return $this->mutation($this->trashActions->delete, $request, ['id' => $id]);
        }
        $this->featurePolicy()->assertEnabled('trash');
        $this->csrf->assertMutation($request);
        $data = $this->json($request);
        $this->files->permanentlyDeleteTrash($this->resource($request, $data), $id);

        return $this->success();
    }

    public function batch(Request $request): JsonResponse
    {
        if ($this->batchActions !== null) {
            return $this->mutation($this->batchActions->batch, $request);
        }
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
        if ($this->batchActions !== null) {
            return $this->mutation($this->batchActions->rename, $request);
        }
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

    /** @param array<string, mixed> $extra */
    private function mutation(MutationActionInterface $action, Request $request, array $extra = []): JsonResponse
    {
        $context = SymfonyRequestContextProvider::fromRequest($request);
        $action->assertAllowed($context, $request->request->all());
        $result = $action->execute($context, $extra + $this->json($request));

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }

    /** @param array<string, mixed> $data */
    private function success(array $data = [], int $status = 200): JsonResponse
    {
        return new JsonResponse(OperationResult::success($data), $status);
    }
}
