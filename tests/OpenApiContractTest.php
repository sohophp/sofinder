<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\EndpointCatalog;

final class OpenApiContractTest extends TestCase
{
    public function testPublishedOpenApiExactlyMatchesTheCanonicalHttpCatalog(): void
    {
        $root = dirname(__DIR__);
        $spec = json_decode((string) file_get_contents($root . '/docs/public/openapi.json'), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('3.1.0', $spec['openapi']);

        $expected = [];
        foreach (EndpointCatalog::all() as $endpoint) {
            if (in_array($endpoint->name, ['sofinder_browser', 'sofinder_asset'], true)) {
                continue;
            }
            foreach ($endpoint->methods as $method) {
                $expected[] = $method . ' ' . $endpoint->path;
            }
        }

        $actual = [];
        $httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];
        foreach ($spec['paths'] as $path => $pathItem) {
            foreach (array_keys($pathItem) as $method) {
                if (in_array(strtolower((string) $method), $httpMethods, true)) {
                    $actual[] = strtoupper((string) $method) . ' ' . $path;
                }
            }
        }

        sort($expected);
        sort($actual);
        self::assertSame($expected, $actual, 'OpenAPI and EndpointCatalog must not omit or invent HTTP operations.');
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
            'asset-operation-event.schema.json', 'asset-reference.schema.json', 'capability-catalog.schema.json', 'config-data.schema.json', 'error-envelope.schema.json', 'image-actions.schema.json', 'picker-entry.schema.json', 'picker-message.schema.json', 'plugin-descriptor.schema.json',
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
        $spec = json_decode($document, true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('#/components/responses/AssetMetadata', $spec['paths']['/api/assets/{id}/metadata']['patch']['responses']['200']['$ref']);
        self::assertSame('#/components/responses/ChunkUpload', $spec['paths']['/api/uploads/chunks']['post']['responses']['201']['$ref']);
        self::assertSame('#/components/responses/ChunkStatus', $spec['paths']['/api/uploads/chunks/{id}']['get']['responses']['200']['$ref']);
        self::assertContains('workspace', $spec['components']['schemas']['ChunkStatusData']['required']);
        foreach ($spec['paths'] as $path => $pathItem) {
            foreach ($pathItem as $method => $operation) {
                if (!is_array($operation)) continue;
                self::assertNotSame(
                    '#/components/requestBodies/JsonMutation',
                    $operation['requestBody']['$ref'] ?? null,
                    strtoupper($method) . ' ' . $path . ' must publish a route-specific request body.',
                );
                foreach ($operation['responses'] ?? [] as $status => $response) {
                    self::assertNotSame(
                        '#/components/responses/Success',
                        $response['$ref'] ?? null,
                        strtoupper($method) . ' ' . $path . ' ' . $status . ' must publish a route-specific response.',
                    );
                }
            }
        }
    }

    public function testMachineErrorCatalogCoversEveryLiteralPublicExceptionCodeAndStatus(): void
    {
        $root = dirname(__DIR__);
        $catalog = json_decode((string) file_get_contents($root . '/docs/public/error-codes.json'), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('1.0', $catalog['apiVersion']);
        $actual = [];
        foreach ([$root . '/packages/sofinder-core/src', $root . '/packages/sofinder-symfony/src'] as $sourceDirectory) {
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($sourceDirectory));
            foreach ($iterator as $file) {
                if (!$file instanceof \SplFileInfo || !$file->isFile() || $file->getExtension() !== 'php') continue;
                $source = (string) file_get_contents($file->getPathname());
                preg_match_all('/(?:new\s+SoFinderException|parent::__construct)\((?:(?!\);).)*?[\'\"]([a-z][a-z0-9_]+)[\'\"]\s*,\s*(\d{3})/s', $source, $matches, PREG_SET_ORDER);
                foreach ($matches as $match) $actual[$match[1]][(int) $match[2]] = true;
            }
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
