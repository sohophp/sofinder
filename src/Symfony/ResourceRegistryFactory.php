<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class ResourceRegistryFactory
{
    public function __construct(
        private PathGuard $pathGuard,
        private RequestStack $requestStack,
    ) {
    }

    /** @param array<string, array<string, mixed>> $configuration */
    public function create(array $configuration): ResourceRegistry
    {
        $items = [];
        foreach ($configuration as $name => $values) {
            $publicUrl = $this->resolvePublicUrl((string) $values['public_url']);
            $resource = new ResourceType(
                (string) $name,
                (string) $values['root'],
                $publicUrl,
                array_values((array) $values['allowed_extensions']),
                array_values((array) $values['denied_extensions']),
                array_values((array) $values['allowed_mime_types']),
                (int) $values['max_size'],
                (bool) $values['read_only'],
                (int) ($values['quota'] ?? 0),
                array_values((array) ($values['roles'] ?? [])),
                array_map(static fn (mixed $roles): array => array_values((array) $roles), (array) ($values['operation_roles'] ?? [])),
                (int) ($values['max_file_name_length'] ?? 120),
                (int) ($values['max_folder_name_length'] ?? 50),
                (int) ($values['max_folder_depth'] ?? 5),
                (int) ($values['max_image_pixels'] ?? 50_000_000),
                array_map(fn (mixed $rule): array => [
                    'path' => $this->pathGuard->normalize((string) ((array) $rule)['path']),
                    'operations' => array_values(array_map('strval', (array) ((array) $rule)['operations'])),
                    'roles' => array_values(array_map('strval', (array) (((array) $rule)['roles'] ?? []))),
                    'allow' => (bool) (((array) $rule)['allow'] ?? true),
                ], (array) ($values['path_acl'] ?? [])),
                (string) ($values['delivery_mode'] ?? 'public'),
                (int) ($values['max_batch_items'] ?? 100),
                (int) ($values['max_recursive_items'] ?? 10_000),
                (int) ($values['max_archive_items'] ?? 1_000),
                (int) ($values['max_archive_bytes'] ?? 536_870_912),
                (int) ($values['max_image_width'] ?? 12_000),
                (int) ($values['max_image_height'] ?? 12_000),
                (string) ($values['animated_image_policy'] ?? 'preserve'),
            );
            $items[] = new ResourceStorage(
                $resource,
                new LocalStorageAdapter($resource->root, $resource->publicUrl, $this->pathGuard),
            );
        }

        return new ResourceRegistry($items);
    }

    private function resolvePublicUrl(string $publicUrl): string
    {
        if ($publicUrl === '' || str_starts_with($publicUrl, '//') || preg_match('#^[a-z][a-z0-9+.-]*://#i', $publicUrl) === 1) {
            return $publicUrl;
        }

        $publicPath = '/' . ltrim($publicUrl, '/');
        $basePath = rtrim($this->requestStack->getCurrentRequest()?->getBasePath() ?? '', '/');

        if ($basePath === '' || $publicPath === $basePath || str_starts_with($publicPath, $basePath . '/')) {
            return $publicPath;
        }

        return $basePath . $publicPath;
    }
}
