<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\EndpointCatalog;

final class EndpointCatalogTest extends TestCase
{
    public function testCatalogMatchesEveryPublishedSymfonyRoute(): void
    {
        $yaml = (string) file_get_contents(__DIR__ . '/../packages/sofinder-symfony/src/Resources/config/routes.yaml');
        preg_match_all('/^(sofinder_[a-z0-9_]+):\R  path: ([^\r\n]+)\R(?:  controller:[^\r\n]+\R)?  methods: \[([A-Z]+)]/m', $yaml, $matches, PREG_SET_ORDER);
        $published = [];
        foreach ($matches as $match) {
            $published[$match[1]] = [$match[2], $match[3]];
        }
        $catalog = [];
        foreach (EndpointCatalog::all() as $endpoint) {
            self::assertArrayNotHasKey($endpoint->name, $catalog, 'Endpoint names must be unique.');
            $catalog[$endpoint->name] = [$endpoint->path, $endpoint->methods[0]];
        }

        self::assertCount(52, $catalog);
        self::assertSame($published, $catalog, 'Every framework bridge must expose the exact Symfony route surface.');
        self::assertTrue(EndpointCatalog::get('sofinder_liveness')->public);
        self::assertFalse(EndpointCatalog::get('sofinder_api_entries')->public);
    }
}
