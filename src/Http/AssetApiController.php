<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Exception\NotFoundException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\OperationResult;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use SohoPHP\SoFinder\Asset\AssetOperationPublisher;

final readonly class AssetApiController
{
    public function __construct(
        private FileManager $files,
        private AssetReferenceFactory $references,
        private AssetCatalogInterface $catalog,
        private WorkspaceProvider $workspaces,
        private CsrfGuard $csrf,
        private bool $enabled,
        private ?AssetOperationPublisher $events = null,
    ) {
    }

    public function resolve(Request $request): JsonResponse
    {
        $this->assertEnabled(); $resource = $request->query->getString('resource'); $path = $request->query->getString('path');
        return new JsonResponse(OperationResult::success(['asset' => $this->references->create($resource, $this->files->entry($resource, $path))]));
    }

    public function get(string $id): JsonResponse
    {
        $record = $this->record($id); $entry = $this->files->entry($record->resource, $record->path);
        return new JsonResponse(OperationResult::success(['asset' => $this->references->create($record->resource, $entry), 'metadata' => $record->metadata()]));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $this->csrf->assertMutation($request); $record = $this->record($id); $this->files->entry($record->resource, $record->path);
        try { $data = json_decode($request->getContent(), true, 32, JSON_THROW_ON_ERROR); } catch (\JsonException $e) { throw new SoFinderException('The request body must be valid JSON.', 'invalid_json', 400, $e); }
        if (!is_array($data)) throw new SoFinderException('The request body must be an object.', 'invalid_json', 400);
        $alt = array_key_exists('alt', $data) && $data['alt'] !== null ? trim((string) $data['alt']) : null;
        $title = array_key_exists('title', $data) && $data['title'] !== null ? trim((string) $data['title']) : null;
        $tags = array_values(array_unique(array_map('trim', array_filter(is_array($data['tags'] ?? null) ? $data['tags'] : [], 'is_string'))));
        if (($alt !== null && mb_strlen($alt) > 1000) || ($title !== null && mb_strlen($title) > 200) || count($tags) > 20 || array_filter($tags, static fn (string $tag): bool => $tag === '' || mb_strlen($tag) > 50) !== []) throw new SoFinderException('The asset metadata is invalid.', 'invalid_asset_metadata', 422);
        $operationId = $this->events?->operationId();
        if ($operationId !== null) $this->events?->dispatch($operationId, 'metadata.update', 'before', $record->resource, $record->path, assetId: $id, attributes: ['metadataVersion' => (int) ($data['version'] ?? 0)]);
        try { $updated = $this->catalog->updateMetadata($id, $alt, $title, $tags, (int) ($data['version'] ?? 0)); }
        catch (\Throwable $error) { if ($operationId !== null) $this->events?->dispatch($operationId, 'metadata.update', 'failed', $record->resource, $record->path, assetId: $id, attributes: ['errorCode' => $this->events?->errorCode($error) ?? 'operation_failed']); throw $error; }
        if ($operationId !== null) $this->events?->dispatch($operationId, 'metadata.update', 'after', $record->resource, $record->path, assetId: $id, attributes: ['metadataVersion' => $updated->metadataVersion]);
        return new JsonResponse(OperationResult::success(['metadata' => $updated->metadata()]));
    }

    private function record(string $id): \SohoPHP\SoFinder\Value\AssetRecord
    {
        $this->assertEnabled(); if (preg_match('/^[a-f0-9-]{36}$/D', $id) !== 1) throw new NotFoundException();
        $record = $this->catalog->find($id); if ($record === null || $record->deleted) throw new NotFoundException();
        $workspace = $this->workspaces->assertResource($record->resource); if ($record->workspace !== $workspace->id) throw new NotFoundException();
        return $record;
    }

    private function assertEnabled(): void { if (!$this->enabled) throw new NotFoundException('The asset catalog is disabled.'); }
}
