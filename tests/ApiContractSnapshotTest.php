<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\Action\ConfigAction;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class ApiContractSnapshotTest extends TestCase
{
    public function testRuntimeDiscoveryResponseMatchesPublishedSchemaAndSnapshot(): void
    {
        $root = sys_get_temp_dir() . '/sofinder-api-contract-' . bin2hex(random_bytes(8));
        mkdir($root, 0775, true);
        try {
            $resource = new ResourceType('Files', $root, '/files', ['txt']);
            $authorization = new class implements AuthorizationInterface {
                public function isAuthenticated(): bool { return true; }
                public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
            };
            $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]), $authorization, new EventDispatcher());
            $images = new class implements ImageCapabilityProviderInterface {
                public function capabilities(): array { return []; }
                public function isWebEmbeddable(string $mimeType): bool { return false; }
                public function supportsExtension(string $extension): bool { return false; }
                public function driver(): string { return ''; }
                public function cacheVersion(): string { return 'test'; }
            };
            $plugins = new PluginRegistry([]);
            $action = new ConfigAction($files, $plugins, imageCapabilities: $images);
            $controller = new ApiController($files, (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor(), $plugins, imageCapabilities: $images, configAction: $action);
            $payload = json_decode((string) $controller->config()->getContent(), true, 512, JSON_THROW_ON_ERROR);
            $factory = new Psr17Factory();
            $psr = (new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($action, $factory, $factory)]))
                ->dispatch($action->endpoint(), new ServerRequest('GET', '/api/config'));
            self::assertSame($payload, json_decode((string) $psr->getBody(), true, 512, JSON_THROW_ON_ERROR));
            $schema = json_decode((string) file_get_contents(__DIR__ . '/../docs/public/schema/config-data.schema.json'), true, 512, JSON_THROW_ON_ERROR);
            foreach ($schema['required'] as $field) self::assertArrayHasKey($field, $payload['data']);
            foreach ($schema['properties']['featureAvailability']['required'] as $field) {
                self::assertIsBool($payload['data']['featureAvailability'][$field] ?? null, 'Feature capability ' . $field . ' must be a boolean.');
            }
            self::assertSame(['en', 'zh-cn', 'zh-tw'], $payload['data']['assetCatalog']['altLocales']);
            $snapshot = [
                'envelope' => array_keys($payload),
                'data' => array_keys($payload['data']),
                'resource' => array_keys($payload['data']['resources'][0]),
                'storageCapabilities' => array_keys($payload['data']['resources'][0]['storageCapabilities']),
                'featureAvailability' => array_keys($payload['data']['featureAvailability']),
                'imageCapabilities' => array_keys($payload['data']['imageCapabilities']),
                'signedUrls' => array_keys($payload['data']['signedUrls']),
            ];
            $expected = json_decode((string) file_get_contents(__DIR__ . '/fixtures/config-contract.snapshot.json'), true, 512, JSON_THROW_ON_ERROR);
            self::assertSame($expected, $snapshot, 'The public config response changed; review and update the versioned snapshot intentionally.');
        } finally {
            @unlink($root . '/.gitkeep');
            @rmdir($root);
        }
    }
}
