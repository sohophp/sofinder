<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Contract\LocalizedAssetMetadataCatalogInterface;
use SohoPHP\SoFinder\Exception\NotFoundException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
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
        private ?AssetActions $actions = null,
    ) {
    }

    public function resolve(Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $result = $this->actions->resolve->execute(SymfonyRequestContextProvider::fromRequest($request));
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->assertEnabled(); $resource = $request->query->getString('resource'); $path = $request->query->getString('path');
        return new JsonResponse(OperationResult::success(['asset' => $this->references->create($resource, $this->files->entry($resource, $path))]));
    }

    public function get(string $id, ?Request $request = null): JsonResponse
    {
        if ($this->actions !== null) {
            $context = $request === null ? new \SohoPHP\SoFinder\Value\RequestContext(attributes: ['id' => $id]) : SymfonyRequestContextProvider::fromRequest($request);
            $result = $this->actions->get->execute($context, ['id' => $id]);
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $record = $this->record($id); $entry = $this->files->entry($record->resource, $record->path);
        return new JsonResponse(OperationResult::success(['asset' => $this->references->create($record->resource, $entry), 'metadata' => $record->metadata()]));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->update->assertAllowed($context, $request->request->all());
            try { $data = json_decode($request->getContent(), true, 32, JSON_THROW_ON_ERROR); } catch (\JsonException $e) { throw new SoFinderException('The request body must be valid JSON.', 'invalid_json', 400, $e); }
            if (!is_array($data)) throw new SoFinderException('The request body must be an object.', 'invalid_json', 400);
            $result = $this->actions->update->execute($context, $data + ['id' => $id]);
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request); $record = $this->record($id);
        $this->files->assertOperation($record->resource, 'metadata.update', $record->path, true);
        try { $data = json_decode($request->getContent(), true, 32, JSON_THROW_ON_ERROR); } catch (\JsonException $e) { throw new SoFinderException('The request body must be valid JSON.', 'invalid_json', 400, $e); }
        if (!is_array($data)) throw new SoFinderException('The request body must be an object.', 'invalid_json', 400);
        $alt = array_key_exists('alt', $data) && $data['alt'] !== null ? trim((string) $data['alt']) : null;
        $altTranslations = array_key_exists('altTranslations', $data) ? $this->altTranslations($data['altTranslations']) : null;
        $title = array_key_exists('title', $data) && $data['title'] !== null ? trim((string) $data['title']) : null;
        $tags = array_values(array_unique(array_map('trim', array_filter(is_array($data['tags'] ?? null) ? $data['tags'] : [], 'is_string'))));
        if (($alt !== null && mb_strlen($alt) > 1000) || ($title !== null && mb_strlen($title) > 200) || count($tags) > 20 || array_filter($tags, static fn (string $tag): bool => $tag === '' || mb_strlen($tag) > 50) !== []) throw new SoFinderException('The asset metadata is invalid.', 'invalid_asset_metadata', 422);
        $operationId = $this->events?->operationId();
        if ($operationId !== null) $this->events?->dispatch($operationId, 'metadata.update', 'before', $record->resource, $record->path, assetId: $id, attributes: ['metadataVersion' => (int) ($data['version'] ?? 0)]);
        try {
            if ($altTranslations !== null) {
                if (!$this->catalog instanceof LocalizedAssetMetadataCatalogInterface) throw new SoFinderException('The configured asset catalog does not support translated alternative text.', 'asset_metadata_translation_unsupported', 422);
                $updated = $this->catalog->updateLocalizedMetadata($id, $alt, $title, $tags, (int) ($data['version'] ?? 0), $altTranslations);
            } else {
                $updated = $this->catalog->updateMetadata($id, $alt, $title, $tags, (int) ($data['version'] ?? 0));
            }
        }
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

    /** @return array<string,string> */
    private function altTranslations(mixed $value): array
    {
        if (!is_array($value) || count($value) > 20) throw new SoFinderException('The translated alternative text is invalid.', 'invalid_asset_metadata', 422);
        $translations = [];
        foreach ($value as $locale => $translation) {
            if (!is_string($locale) || !is_string($translation)) throw new SoFinderException('The translated alternative text is invalid.', 'invalid_asset_metadata', 422);
            $locale = strtolower(trim($locale)); $translation = trim($translation);
            if (preg_match('/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/D', $locale) !== 1 || mb_strlen($translation) > 1000) throw new SoFinderException('The translated alternative text is invalid.', 'invalid_asset_metadata', 422);
            $translations[$locale] = $translation;
        }
        ksort($translations);
        return $translations;
    }

    private function assertEnabled(): void { if (!$this->enabled) throw new NotFoundException('The asset catalog is disabled.'); }
}
