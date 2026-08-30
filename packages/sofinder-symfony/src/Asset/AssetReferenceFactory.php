<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Asset;

use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Symfony\SymfonyEndpointUrlGenerator;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\Routing\RouterInterface;

final class AssetReferenceFactory
{
    private readonly AssetReferenceBuilder $builder;

    /**
     * @param list<int> $variantWidths
     * @param list<string> $variantFormats
     */
    public function __construct(
        RouterInterface $router,
        WorkspaceProvider $workspaces,
        ?AssetCatalogInterface $catalog = null,
        ?ImageManager $images = null,
        bool $catalogEnabled = false,
        bool $variantsEnabled = false,
        array $variantWidths = [],
        array $variantFormats = [],
    ) {
        $this->builder = new AssetReferenceBuilder(
            new SymfonyEndpointUrlGenerator($router),
            $workspaces,
            $catalog,
            $images,
            $catalogEnabled,
            $variantsEnabled,
            $variantWidths,
            $variantFormats,
        );
    }

    /**
     * @param array{width:int,height:int}|null $dimensions
     * @return array<string,mixed>
     */
    public function create(string $resource, Entry $entry, ?array $dimensions = null): array
    {
        return $this->builder->create($resource, $entry, $dimensions);
    }
}
