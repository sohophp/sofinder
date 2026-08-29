<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Contract\AssetSearchProviderInterface;
use SohoPHP\SoFinder\Http\Action\AssetSearchAction;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Exception\NotFoundException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Value\AssetSearchQuery;
use SohoPHP\SoFinder\Value\OperationResult;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class AssetSearchController
{
    public function __construct(
        private AssetSearchProviderInterface $search,
        private WorkspaceProvider $workspaces,
        private bool $enabled = true,
        private ?AssetSearchAction $action = null,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        if ($this->action !== null) {
            $result = $this->action->execute(SymfonyRequestContextProvider::fromRequest($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        if (!$this->enabled) throw new NotFoundException('Asset search is disabled.');
        $keyword = trim($request->query->getString('q'));
        if (mb_strlen($keyword) > 200) throw new SoFinderException('The search query is too long.', 'invalid_asset_search', 422);
        $resources = $this->list($request, 'resources', '/^[A-Za-z][A-Za-z0-9_-]{0,63}$/D');
        $fields = $this->list($request, 'fields', '/^(?:name|title|alt|tags)$/D') ?: ['name', 'title', 'alt', 'tags'];
        $tags = $this->list($request, 'tags', '/^[^\x00-\x1F\x7F]{1,50}$/uD', 20);
        $extensions = array_map('strtolower', $this->list($request, 'extensions', '/^[A-Za-z0-9]{1,16}$/D', 30));
        $type = strtolower($request->query->getString('type', 'all'));
        if (!in_array($type, ['all', 'image', 'document', 'audio', 'video', 'archive', 'other'], true)) throw new SoFinderException('The asset type filter is invalid.', 'invalid_asset_search', 422);
        $minimumSize = $this->nullableInteger($request, 'minSize', 0);
        $maximumSize = $this->nullableInteger($request, 'maxSize', 0);
        $modifiedAfter = $this->nullableInteger($request, 'modifiedAfter', 0);
        $modifiedBefore = $this->nullableInteger($request, 'modifiedBefore', 0);
        if ($minimumSize !== null && $maximumSize !== null && $minimumSize > $maximumSize) throw new SoFinderException('The asset size range is invalid.', 'invalid_asset_search', 422);
        if ($modifiedAfter !== null && $modifiedBefore !== null && $modifiedAfter > $modifiedBefore) throw new SoFinderException('The asset date range is invalid.', 'invalid_asset_search', 422);
        $query = new AssetSearchQuery($keyword, $resources, trim($request->query->getString('path'), '/'), $fields, $tags, $extensions, $type, $minimumSize, $maximumSize, $modifiedAfter, $modifiedBefore, max(0, $request->query->getInt('offset')), max(1, min(200, $request->query->getInt('limit', 50))));
        return new JsonResponse(OperationResult::success($this->search->search($this->workspaces->current(), $query)->jsonSerialize()));
    }

    /** @return list<string> */
    private function list(Request $request, string $name, string $pattern, int $maximum = 50): array
    {
        $value = $request->query->all()[$name] ?? null;
        $raw = is_array($value) ? $value : (is_string($value) && $value !== '' ? explode(',', $value) : []);
        $values = array_values(array_unique(array_map('trim', array_filter($raw, 'is_string'))));
        if (count($values) > $maximum) throw new SoFinderException('Too many asset search filters were supplied.', 'invalid_asset_search', 422);
        foreach ($values as $value) if (preg_match($pattern, $value) !== 1) throw new SoFinderException('An asset search filter is invalid.', 'invalid_asset_search', 422);
        return $values;
    }

    private function nullableInteger(Request $request, string $name, int $minimum): ?int
    {
        $value = $request->query->get($name);
        if ($value === null || $value === '') return null;
        if (filter_var($value, FILTER_VALIDATE_INT) === false || (int) $value < $minimum) throw new SoFinderException('An asset search range is invalid.', 'invalid_asset_search', 422);
        return (int) $value;
    }
}
