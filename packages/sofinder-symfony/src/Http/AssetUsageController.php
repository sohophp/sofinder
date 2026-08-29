<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Contract\AssetUsageStoreInterface;
use SohoPHP\SoFinder\Exception\NotFoundException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Value\AssetRecord;
use SohoPHP\SoFinder\Value\OperationResult;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class AssetUsageController
{
    public function __construct(
        private AssetCatalogInterface $catalog,
        private AssetUsageStoreInterface $usages,
        private WorkspaceProvider $workspaces,
        private FileManager $files,
        private CsrfGuard $csrf,
        private bool $enabled,
        private ?AssetUsageActions $actions = null,
    ) {
    }

    public function list(string $id, ?Request $request = null): JsonResponse
    {
        if ($this->actions !== null) {
            $context = $request === null ? new \SohoPHP\SoFinder\Value\RequestContext(attributes: ['id' => $id]) : SymfonyRequestContextProvider::fromRequest($request);
            $result = $this->actions->list->execute($context, ['id' => $id]);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $record = $this->record($id); $this->files->assertOperation($record->resource, 'read', $record->path);
        $items = $this->usages->list($record->workspace, $id);
        return new JsonResponse(OperationResult::success(['items' => $items, 'total' => count($items)]));
    }

    public function put(Request $request, string $id, string $referenceId): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->put->assertAllowed($context, $request->request->all());
            $result = $this->actions->put->execute($context, $this->json($request) + ['id' => $id, 'referenceId' => $referenceId]);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request); $record = $this->record($id); $this->files->assertOperation($record->resource, 'read', $record->path);
        $data = $this->json($request); $referenceId = trim($referenceId); $label = trim((string) ($data['label'] ?? ''));
        $url = isset($data['url']) ? trim((string) $data['url']) : null; $context = isset($data['context']) ? trim((string) $data['context']) : null;
        if (preg_match('/^[A-Za-z0-9._:-]{1,160}$/D', $referenceId) !== 1 || $label === '' || mb_strlen($label) > 200 || ($url !== null && mb_strlen($url) > 2000) || ($context !== null && mb_strlen($context) > 100)) throw new SoFinderException('The asset usage reference is invalid.', 'invalid_asset_usage', 422);
        return new JsonResponse(OperationResult::success(['usage' => $this->usages->put($record->workspace, $id, $referenceId, $label, $url ?: null, $context ?: null)]));
    }

    public function remove(Request $request, string $id, string $referenceId): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->remove->assertAllowed($context, $request->request->all());
            $result = $this->actions->remove->execute($context, ['id' => $id, 'referenceId' => $referenceId]);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request); $record = $this->record($id); $this->files->assertOperation($record->resource, 'read', $record->path);
        $this->usages->remove($record->workspace, $id, $referenceId);
        return new JsonResponse(OperationResult::success([]));
    }

    public function deleteCheck(Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->deleteCheck->assertAllowed($context, $request->request->all());
            $result = $this->actions->deleteCheck->execute($context, $this->json($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request); $this->assertEnabled(); $data = $this->json($request); $resource = trim((string) ($data['resource'] ?? ''));
        $workspace = $this->workspaces->assertResource($resource); $paths = array_values(array_unique(array_filter(is_array($data['paths'] ?? null) ? $data['paths'] : [], 'is_string')));
        if ($paths === [] || count($paths) > 1000) throw new SoFinderException('One to 1000 paths are required.', 'invalid_paths', 422);
        $assets = []; $total = 0; $complete = true; $scanned = 0;
        foreach ($paths as $path) {
            $this->files->assertOperation($resource, 'delete', $path, true); $entry = $this->files->entry($resource, $path); $candidatePaths = [$path];
            if ($entry->directory) {
                $directories = [$path];
                while ($directories !== [] && $complete) {
                    $directory = array_shift($directories); if (!is_string($directory)) continue; $offset = 0; $cursor = null;
                    do {
                        $page = $this->files->list($resource, $directory, '', 'name', 'asc', $offset, 500, cursor: $cursor);
                        foreach ($page['entries'] as $child) { if (++$scanned > 10000) { $complete = false; break 2; } if ($child->directory) $directories[] = $child->path; else $candidatePaths[] = $child->path; }
                        $offset += count($page['entries']); $cursor = $page['nextCursor'];
                    } while ($cursor !== null || ($page['total'] !== null && $offset < $page['total']));
                }
            }
            foreach ($candidatePaths as $candidatePath) { $record = $this->catalog->resolve($workspace->id, $resource, $candidatePath); if ($record === null) continue; $items = $this->usages->list($workspace->id, $record->id); if ($items === []) continue; $assets[] = ['assetId' => $record->id, 'path' => $candidatePath, 'usages' => $items, 'total' => count($items)]; $total += count($items); }
        }
        return new JsonResponse(OperationResult::success(['safe' => $total === 0 && $complete, 'complete' => $complete, 'total' => $total, 'assets' => $assets]));
    }

    private function record(string $id): AssetRecord
    {
        $this->assertEnabled(); if (preg_match('/^[a-f0-9-]{36}$/D', $id) !== 1) throw new NotFoundException();
        $record = $this->catalog->find($id); if ($record === null || $record->deleted || $record->workspace !== $this->workspaces->assertResource($record->resource)->id) throw new NotFoundException();
        return $record;
    }

    /** @return array<string,mixed> */
    private function json(Request $request): array
    {
        try { $data = json_decode($request->getContent(), true, 32, JSON_THROW_ON_ERROR); } catch (\JsonException $error) { throw new SoFinderException('The request body must be valid JSON.', 'invalid_json', 400, $error); }
        if (!is_array($data)) throw new SoFinderException('The request body must be an object.', 'invalid_json', 400); return $data;
    }

    private function assertEnabled(): void { if (!$this->enabled) throw new NotFoundException('Asset usage tracking is disabled.'); }
}
