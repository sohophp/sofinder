<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use SohoPHP\SoFinder\Asset\AssetOperationPublisher;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Event\AssetOperationEvent;
use SohoPHP\SoFinder\Event\OperationEvent;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\AssetApiController;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\AssetCatalogSubscriber;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\VersionedOperationSubscriber;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class AssetPlatformTest extends TestCase
{
    private string $directory;
    private RequestStack $requests;
    private WorkspaceProvider $workspaces;
    private AuthorizationInterface $authorization;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-asset-platform-' . bin2hex(random_bytes(8)); mkdir($this->directory, 0770, true); file_put_contents($this->directory . '/manual.txt', 'manual');
        $this->requests = new RequestStack(); $this->requests->push(new Request());
        $resolver = new class implements WorkspaceResolverInterface { public function resolve(Request $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Files']); } };
        $this->workspaces = new WorkspaceProvider($resolver, $this->requests);
        $this->authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $file) @unlink($file); @rmdir($this->directory);
    }

    public function testAssetReferenceAndMetadataApiKeepLegacyDeliveryAndOptimisticMetadata(): void
    {
        $catalog = new JsonAssetCatalog($this->directory . '/assets.json'); $registry = $this->registry(); $files = $this->files($registry);
        $router = $this->createMock(RouterInterface::class);
        $router->method('generate')->willReturnCallback(static fn (string $route, array $parameters = []): string => $route === 'sofinder_api_download' ? '/download/' . rawurlencode((string) ($parameters['path'] ?? '')) : '/variant');
        $factory = new AssetReferenceFactory($router, $this->workspaces, $catalog, catalogEnabled: true);
        $tokens = $this->createMock(CsrfTokenManagerInterface::class); $tokens->method('isTokenValid')->willReturn(true);
        $events = new EventDispatcher(); $published = []; $events->addListener(AssetOperationEvent::class, static function (AssetOperationEvent $event) use (&$published): void { $published[] = $event; });
        $publisher = new AssetOperationPublisher($events, $this->workspaces, $registry, $catalog, true);
        $controller = new AssetApiController($files, $factory, $catalog, $this->workspaces, new CsrfGuard($tokens, $this->authorization), true, $publisher);

        $resolved = $this->data($controller->resolve(new Request(['resource' => 'Files', 'path' => 'manual.txt']))); $asset = $resolved['asset'];
        self::assertSame('1.0', $asset['schemaVersion']); self::assertSame('/files/manual.txt', $asset['url']); self::assertTrue($asset['capabilities']['embeddable']); self::assertIsString($asset['assetId']);
        $responsive = (new AssetReferenceFactory($router, $this->workspaces, variantsEnabled: true, variantWidths: [320, 1200], variantFormats: ['original']))->create('Files', new Entry('photo.jpg', 'photo.jpg', false, 100, 10, 'image/jpeg', '/files/photo.jpg'), ['width' => 1000, 'height' => 500]);
        self::assertSame([320], array_column($responsive['variants'], 'width')); self::assertSame(160, $responsive['variants'][0]['height']);
        $loaded = $this->data($controller->get($asset['assetId'])); self::assertNull($loaded['metadata']['alt']);
        $request = Request::create('/assets/id/metadata', 'PATCH', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: json_encode(['alt' => '', 'title' => 'Manual', 'tags' => ['docs'], 'version' => 1], JSON_THROW_ON_ERROR));
        $updated = $this->data($controller->update($request, $asset['assetId'])); self::assertSame('', $updated['metadata']['alt']); self::assertSame(2, $updated['metadata']['version']);
        self::assertSame(['before', 'after'], array_column(array_map(static fn (AssetOperationEvent $event): array => $event->jsonSerialize(), $published), 'phase')); self::assertSame($published[0]->operationId, $published[1]->operationId);
        self::assertSame('asset_metadata_conflict', $publisher->errorCode(new SoFinderException('conflict', 'asset_metadata_conflict', 409)));

        $this->expectException(SoFinderException::class);
        $controller->update(Request::create('/assets/id/metadata', 'PATCH', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: json_encode(['alt' => str_repeat('x', 1001), 'version' => 2], JSON_THROW_ON_ERROR)), $asset['assetId']);
    }

    public function testAssetMetadataRequiresItsOwnWriteCapability(): void
    {
        $catalog = new JsonAssetCatalog($this->directory . '/denied-assets.json');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return $operation !== 'metadata.update'; }
        };
        $files = new FileManager($this->registry(), $authorization, new EventDispatcher(), workspaces: $this->workspaces);
        $router = $this->createMock(RouterInterface::class); $router->method('generate')->willReturn('/download');
        $factory = new AssetReferenceFactory($router, $this->workspaces, $catalog, catalogEnabled: true);
        $tokens = $this->createMock(CsrfTokenManagerInterface::class); $tokens->method('isTokenValid')->willReturn(true);
        $controller = new AssetApiController($files, $factory, $catalog, $this->workspaces, new CsrfGuard($tokens, $authorization), true);
        $asset = $this->data($controller->resolve(new Request(['resource' => 'Files', 'path' => 'manual.txt'])))['asset'];
        self::assertFalse($asset['capabilities']['assetMetadata']);

        $this->expectException(AccessDeniedException::class);
        $controller->update(Request::create('/assets/id/metadata', 'PATCH', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: json_encode(['alt' => 'Denied', 'version' => 1], JSON_THROW_ON_ERROR)), $asset['assetId']);
    }

    public function testCatalogAndVersionedSubscribersTrackIdentityAndFailureSafely(): void
    {
        $catalog = new JsonAssetCatalog($this->directory . '/assets.json'); $resource = new ResourceType('Files', $this->directory, '/files');
        $catalogSubscriber = new AssetCatalogSubscriber($catalog, $this->workspaces, true);
        $entry = new Entry('manual.txt', 'manual.txt', false, 6, 10, 'text/plain', '/files/manual.txt');
        $catalogSubscriber->onOperation(new OperationEvent('after.upload', $resource, 'manual.txt', ['entry' => $entry]));
        $record = $catalog->resolve('main', 'Files', 'manual.txt'); self::assertNotNull($record);
        $catalogSubscriber->onOperation(new OperationEvent('after.rename', $resource, 'renamed.txt', ['source' => 'manual.txt', 'entry' => new Entry('renamed.txt', 'renamed.txt', false, 6, 10)]));
        self::assertSame($record->id, $catalog->resolve('main', 'Files', 'renamed.txt')?->id);
        $catalogSubscriber->onOperation(new OperationEvent('after.delete', $resource, 'renamed.txt', ['trash' => ['id' => 'trash']])); self::assertTrue($catalog->find($record->id)?->deleted);
        $catalogSubscriber->onOperation(new OperationEvent('after.trash_restore', $resource, 'renamed.txt', ['entry' => new Entry('renamed.txt', 'renamed.txt', false, 6, 10)])); self::assertFalse($catalog->find($record->id)?->deleted);

        $events = new EventDispatcher(); $published = [];
        $events->addListener(AssetOperationEvent::class, static function (AssetOperationEvent $event) use (&$published): void { $published[] = $event; });
        $subscriber = new VersionedOperationSubscriber($events, $this->workspaces, $catalog, $this->requests, true);
        $subscriber->onOperation(new OperationEvent('before.rename', $resource, 'renamed.txt'));
        $subscriber->onOperation(new OperationEvent('after.rename', $resource, 'final.txt', ['source' => 'renamed.txt', 'entry' => new Entry('final.txt', 'final.txt', false, 6, 10)]));
        self::assertCount(2, $published); self::assertSame($published[0]->operationId, $published[1]->operationId); self::assertSame('after', $published[1]->phase);

        $subscriber->onOperation(new OperationEvent('before.delete', $resource, 'final.txt'));
        $kernel = $this->createMock(HttpKernelInterface::class);
        $subscriber->onException(new ExceptionEvent($kernel, $this->requests->getCurrentRequest(), HttpKernelInterface::MAIN_REQUEST, new SoFinderException('Internal detail', 'safe_code', 500)));
        self::assertSame('failed', $published[3]->phase); self::assertSame(['errorCode' => 'safe_code'], $published[3]->attributes);
    }

    public function testImageControllerPublishesSafeFailurePhase(): void
    {
        $resolver = new class implements WorkspaceResolverInterface { public function resolve(Request $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Images']); } };
        $workspaces = new WorkspaceProvider($resolver, $this->requests); $resource = new ResourceType('Images', $this->directory, '/images');
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/images'))]);
        $events = new EventDispatcher(); $published = []; $events->addListener(AssetOperationEvent::class, static function (AssetOperationEvent $event) use (&$published): void { $published[] = $event; });
        $publisher = new AssetOperationPublisher($events, $workspaces, $registry, new JsonAssetCatalog($this->directory . '/unused-assets.json'), false);
        $tokens = $this->createMock(CsrfTokenManagerInterface::class); $tokens->method('isTokenValid')->willReturn(true);
        $images = (new \ReflectionClass(ImageManager::class))->newInstanceWithoutConstructor();
        $controller = new ImageController($images, new CsrfGuard($tokens, $this->authorization), new FeaturePolicy(), $publisher);
        $request = Request::create('/images/edit', 'PATCH', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: json_encode(['resource' => 'Images', 'path' => 'photo.jpg', 'actions' => [['type' => 'resize', 'width' => 20, 'height' => 20]]], JSON_THROW_ON_ERROR));

        try { $controller->edit($request); self::fail('The uninitialized image manager should fail.'); } catch (\Error) { self::addToAssertionCount(1); }
        self::assertSame(['before', 'failed'], array_map(static fn (AssetOperationEvent $event): string => $event->phase, $published));
        self::assertSame('operation_failed', $published[1]->attributes['errorCode']);
    }

    private function registry(): ResourceRegistry
    {
        $type = new ResourceType('Files', $this->directory, '/files', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain']);
        return new ResourceRegistry([new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/files'))]);
    }

    private function files(?ResourceRegistry $registry = null): FileManager
    {
        return new FileManager($registry ?? $this->registry(), $this->authorization, new EventDispatcher(), workspaces: $this->workspaces);
    }

    /** @return array<string,mixed> */
    private function data(\Symfony\Component\HttpFoundation\JsonResponse $response): array
    {
        $payload = json_decode((string) $response->getContent(), true, 32, JSON_THROW_ON_ERROR);
        self::assertIsArray($payload['data'] ?? null);
        return $payload['data'];
    }
}
