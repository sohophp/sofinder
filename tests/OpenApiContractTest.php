<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;

final class OpenApiContractTest extends TestCase
{
    public function testPublishedOpenApiCoversEveryPublicHttpOperation(): void
    {
        $root = dirname(__DIR__);
        $spec = json_decode((string) file_get_contents($root . '/docs/public/openapi.json'), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('3.1.0', $spec['openapi']);
        $yaml = (string) file_get_contents($root . '/src/Resources/config/routes.yaml');
        preg_match_all('/\n[^\s][^\n]*:\n\s+path: ([^\n]+)\n\s+controller:[^\n]+\n\s+methods: \[([A-Z]+)\]/', $yaml, $matches, PREG_SET_ORDER);
        foreach ($matches as $route) {
            if (!str_starts_with($route[1], '/api/') && !str_starts_with($route[1], '/compat/') && !in_array($route[1], ['/health', '/metrics'], true)) continue;
            self::assertArrayHasKey($route[1], $spec['paths'], $route[2] . ' ' . $route[1] . ' is missing from OpenAPI.');
            self::assertArrayHasKey(strtolower($route[2]), $spec['paths'][$route[1]], $route[2] . ' ' . $route[1] . ' is missing from OpenAPI.');
        }
    }
}
