<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Routing\SymfonyRouteCollectionFactory;

final class EndpointCatalogTest extends TestCase
{
    public function testCatalogMatchesEveryPublishedSymfonyRoute(): void
    {
        $published = SymfonyRouteCollectionFactory::create();
        $catalog = [];
        foreach (EndpointCatalog::all() as $endpoint) {
            self::assertArrayNotHasKey($endpoint->name, $catalog, 'Endpoint names must be unique.');
            $catalog[$endpoint->name] = [$endpoint->path, $endpoint->methods, $endpoint->requirements];
        }

        self::assertCount(52, $catalog);
        self::assertCount(52, $published);
        foreach ($catalog as $name => $definition) {
            $route = $published->get($name);
            self::assertNotNull($route);
            self::assertSame($definition, [$route->getPath(), $route->getMethods(), $route->getRequirements()]);
            self::assertTrue($route->getDefault('_sofinder'));
            self::assertIsString($route->getDefault('_controller'));
        }
        self::assertSame('copy', $published->get('sofinder_api_copy')?->getDefault('operation'));
        self::assertSame('move', $published->get('sofinder_api_move')?->getDefault('operation'));
        self::assertTrue($published->get('sofinder_signed_content')?->getDefault('_sofinder_signed_public'));
        self::assertTrue(EndpointCatalog::get('sofinder_liveness')->public);
        self::assertFalse(EndpointCatalog::get('sofinder_api_entries')->public);
    }
}
