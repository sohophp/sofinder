<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class MetadataController
{
    public function __construct(
        private MetadataManager $metadata,
        private CsrfGuard $csrf,
    ) {
    }

    public function get(Request $request): JsonResponse
    {
        return new JsonResponse(OperationResult::success($this->metadata->get((string) $request->query->get('resource', 'Files'))));
    }

    public function update(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        try {
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
        }
        if (!is_array($data)) {
            throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
        }
        $resource = (string) ($data['resource'] ?? 'Files');
        $path = (string) ($data['path'] ?? '');
        match ((string) ($data['action'] ?? '')) {
            'favorite' => $this->metadata->favorite($resource, $path, (bool) ($data['favorite'] ?? false)),
            'tags' => $this->metadata->tags($resource, $path, $this->tags($data['tags'] ?? null)),
            'touch' => $this->metadata->touch($resource, $path),
            default => throw new SoFinderException('The metadata action is invalid.', 'invalid_metadata_action', 400),
        };

        return new JsonResponse(OperationResult::success($this->metadata->get($resource)));
    }

    /** @return list<string> */
    private function tags(mixed $tags): array
    {
        if (!is_array($tags) || array_filter($tags, static fn (mixed $tag): bool => !is_string($tag)) !== []) {
            throw new SoFinderException('Tags must be an array of strings.', 'invalid_tags', 422);
        }

        return array_values($tags);
    }
}
