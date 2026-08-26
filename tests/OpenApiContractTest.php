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
            if (!str_starts_with($route[1], '/api/') && !str_starts_with($route[1], '/compat/') && !in_array($route[1], ['/health', '/live', '/metrics'], true)) continue;
            self::assertArrayHasKey($route[1], $spec['paths'], $route[2] . ' ' . $route[1] . ' is missing from OpenAPI.');
            self::assertArrayHasKey(strtolower($route[2]), $spec['paths'][$route[1]], $route[2] . ' ' . $route[1] . ' is missing from OpenAPI.');
        }
    }

    public function testPublishedJsonSchemasDefineThePickerAndImageContracts(): void
    {
        $directory = dirname(__DIR__) . '/docs/public/schema';
        $schemas = [];
        foreach (glob($directory . '/*.json') ?: [] as $file) {
            $schema = json_decode((string) file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
            self::assertSame('https://json-schema.org/draft/2020-12/schema', $schema['$schema']);
            $schemas[basename($file)] = $schema;
        }
        self::assertSame([
            'capability-catalog.schema.json', 'config-data.schema.json', 'error-envelope.schema.json', 'image-actions.schema.json', 'picker-entry.schema.json', 'picker-message.schema.json', 'plugin-descriptor.schema.json',
        ], array_keys($schemas));
        self::assertSame(
            ['resource', 'path', 'name', 'directory', 'size', 'modifiedAt', 'mimeType', 'url', 'width', 'height', 'capabilities'],
            $schemas['picker-entry.schema.json']['required'],
        );
        self::assertSame('1.0', $schemas['picker-message.schema.json']['properties']['version']['const']);
        self::assertCount(7, $schemas['image-actions.schema.json']['items']['oneOf']);
    }

    public function testOpenApiDoesNotPublishUnconstrainedGenericObjects(): void
    {
        $document = (string) file_get_contents(dirname(__DIR__) . '/docs/public/openapi.json');
        self::assertStringNotContainsString('"type": "object"}', $document);
        self::assertStringNotContainsString('"additionalProperties": true', $document);
        self::assertStringContainsString('DocumentPreviewJobData', $document);
        self::assertStringContainsString('MutationRequest', $document);
    }

    public function testMachineErrorCatalogCoversEveryLiteralPublicExceptionCodeAndStatus(): void
    {
        $root = dirname(__DIR__);
        $catalog = json_decode((string) file_get_contents($root . '/docs/public/error-codes.json'), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('1.0', $catalog['apiVersion']);
        $actual = [];
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($root . '/src'));
        foreach ($iterator as $file) {
            if (!$file instanceof \SplFileInfo || !$file->isFile() || $file->getExtension() !== 'php') continue;
            $source = (string) file_get_contents($file->getPathname());
            preg_match_all('/(?:new\s+SoFinderException|parent::__construct)\((?:(?!\);).)*?[\'\"]([a-z][a-z0-9_]+)[\'\"]\s*,\s*(\d{3})/s', $source, $matches, PREG_SET_ORDER);
            foreach ($matches as $match) $actual[$match[1]][(int) $match[2]] = true;
        }
        // These codes are selected by a bounded ternary after request validation.
        $actual['folder_name_too_long'][422] = true;
        $actual['image_extension_mismatch'][422] = true;
        ksort($actual);
        self::assertSame(array_keys($actual), array_keys($catalog['codes']), 'Update error-codes.json whenever a public exception code changes.');
        foreach ($actual as $code => $statuses) {
            $expected = array_map('intval', array_keys($statuses));
            sort($expected);
            $published = $catalog['codes'][$code]['statuses'];
            sort($published);
            self::assertSame($expected, $published, $code . ' status list is stale.');
        }
    }
}
