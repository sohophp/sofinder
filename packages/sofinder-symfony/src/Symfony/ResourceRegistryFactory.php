<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\StorageAdapterFactoryInterface;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\ResourceRegistryFactory as CoreResourceRegistryFactory;
use Symfony\Component\HttpFoundation\RequestStack;

final class ResourceRegistryFactory
{
    private readonly CoreResourceRegistryFactory $factory;

    /** @param iterable<StorageAdapterFactoryInterface> $factories */
    public function __construct(
        PathGuard $pathGuard,
        RequestStack $requestStack,
        iterable $factories = [],
    ) {
        $this->factory = new CoreResourceRegistryFactory(
            $pathGuard,
            $factories,
            static function (string $publicUrl) use ($requestStack): string {
                if ($publicUrl === '' || str_starts_with($publicUrl, '//') || preg_match('#^[a-z][a-z0-9+.-]*://#i', $publicUrl) === 1) {
                    return $publicUrl;
                }

                $publicPath = '/' . ltrim($publicUrl, '/');
                $basePath = rtrim($requestStack->getCurrentRequest()?->getBasePath() ?? '', '/');

                if ($basePath === '' || $publicPath === $basePath || str_starts_with($publicPath, $basePath . '/')) {
                    return $publicPath;
                }

                return $basePath . $publicPath;
            },
        );
    }

    /** @param array<string, array<string, mixed>> $configuration */
    public function create(array $configuration): ResourceRegistry
    {
        return $this->factory->create($configuration);
    }
}
