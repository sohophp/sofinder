<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
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
        private ?FeaturePolicy $features = null,
    ) {
    }

    public function get(Request $request): JsonResponse
    {
        $policy = $this->featurePolicy();
        if (!$policy->enabled('recent') && !$policy->enabled('favorites') && !$policy->enabled('tags')) {
            $policy->assertEnabled('recent');
        }
        return new JsonResponse(OperationResult::success($this->filtered((string) $request->query->get('resource', 'Files'))));
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
        $action = (string) ($data['action'] ?? '');
        $this->featurePolicy()->assertEnabled(match ($action) {
            'favorite' => 'favorites',
            'tags' => 'tags',
            'touch', 'forget' => 'recent',
            default => throw new SoFinderException('The metadata action is invalid.', 'invalid_metadata_action', 400),
        });
        if ($action === 'favorite') {
            $this->metadata->favorite($resource, $path, (bool) ($data['favorite'] ?? false));
        } elseif ($action === 'tags') {
            $this->metadata->tags($resource, $path, $this->tags($data['tags'] ?? null));
        } elseif ($action === 'touch') {
            $this->metadata->touch($resource, $path);
        } else {
            $this->metadata->forget($resource, $path);
        }

        return new JsonResponse(OperationResult::success($this->filtered($resource)));
    }

    /** @return list<string> */
    private function tags(mixed $tags): array
    {
        if (!is_array($tags) || array_filter($tags, static fn (mixed $tag): bool => !is_string($tag)) !== []) {
            throw new SoFinderException('Tags must be an array of strings.', 'invalid_tags', 422);
        }

        return array_values($tags);
    }

    private function featurePolicy(): FeaturePolicy
    {
        return $this->features ?? new FeaturePolicy();
    }

    /** @return array{favorites:list<string>,tags:array<string,list<string>>,recent:list<array{path:string,touchedAt:int}>} */
    private function filtered(string $resource): array
    {
        $policy = $this->featurePolicy();
        $metadata = $this->metadata->get($resource);
        if (!$policy->enabled('recent')) {
            $metadata['recent'] = [];
        }
        if (!$policy->enabled('favorites')) {
            $metadata['favorites'] = [];
        }
        if (!$policy->enabled('tags')) {
            $metadata['tags'] = [];
        }

        return $metadata;
    }
}
