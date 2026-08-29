<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\AssetAccessSessionManager;
use SohoPHP\SoFinder\Asset\JsonAssetAccessSessionStore;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Framework\CallbackRequestContextProvider;
use SohoPHP\SoFinder\Http\Action\AssetSessionContentAction;
use SohoPHP\SoFinder\Http\Action\AssetSessionCreateAction;
use SohoPHP\SoFinder\Http\Action\AssetSessionRevokeAction;
use SohoPHP\SoFinder\Http\AssetAccessSessionActions;
use SohoPHP\SoFinder\Http\AssetAccessSessionController;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\EntryStreamResponseBuilder;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;

final class SharedAssetSessionActionTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-asset-session-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/private.txt', 'private-content');
    }

    protected function tearDown(): void
    {
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $entry) {
            $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
        }
        @rmdir($this->directory);
    }

    public function testCreateContentAndRevokeWorkAcrossSymfonyAndPsr(): void
    {
        [$controller, $actions, $assetId] = $this->stack();
        $factory = new Psr17Factory();
        $payload = json_encode(['assetIds' => [$assetId], 'ttl' => 300], JSON_THROW_ON_ERROR);
        $symfonyCreate = $controller->create(Request::create('/api/assets/access-sessions', 'POST', server: [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_CSRF_TOKEN' => 'valid',
            'HTTP_HOST' => 'example.test',
            'HTTPS' => 'on',
        ], content: $payload));
        $psrCreate = (new PsrEndpointHandler($actions->create, $factory, $factory))->handle(new ServerRequest('POST', 'https://example.test/api/assets/access-sessions', [
            'Content-Type' => 'application/json',
            'X-CSRF-TOKEN' => 'valid',
        ], $payload));
        $symfonyPayload = json_decode((string) $symfonyCreate->getContent(), true, 32, JSON_THROW_ON_ERROR);
        $psrPayload = json_decode((string) $psrCreate->getBody(), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame(201, $symfonyCreate->getStatusCode());
        self::assertSame(201, $psrCreate->getStatusCode());
        self::assertSame(array_keys($symfonyPayload['data']), array_keys($psrPayload['data']));
        self::assertSame($assetId, $psrPayload['data']['assets'][0]['assetId']);
        self::assertStringStartsWith('https://example.test/asset-session/', $psrPayload['data']['assets'][0]['url']);

        $parts = explode('/', $psrPayload['data']['assets'][0]['url']);
        $token = $parts[count($parts) - 2];
        $symfonyContent = $controller->consume(Request::create('/asset-session/' . $token . '/' . $assetId, server: ['HTTP_RANGE' => 'bytes=0-6']), $token, $assetId);
        ob_start();
        $symfonyContent->sendContent();
        $captured = ob_get_clean();
        self::assertIsString($captured);
        $psrContent = (new PsrEndpointHandler($actions->content, $factory, $factory))->handle(
            (new ServerRequest('GET', '/asset-session/' . $token . '/' . $assetId, ['Range' => 'bytes=0-6']))
                ->withAttribute('token', $token)
                ->withAttribute('assetId', $assetId),
        );
        self::assertSame(206, $psrContent->getStatusCode());
        self::assertSame('private', $captured);
        self::assertSame($captured, (string) $psrContent->getBody());
        self::assertSame('no-referrer', $psrContent->getHeaderLine('Referrer-Policy'));

        $id = $psrPayload['data']['id'];
        $revoke = (new PsrEndpointHandler($actions->revoke, $factory, $factory))->handle(
            (new ServerRequest('DELETE', '/api/assets/access-sessions/' . $id, ['X-CSRF-TOKEN' => 'valid']))->withAttribute('id', $id),
        );
        self::assertSame(200, $revoke->getStatusCode());
    }

    /** @return array{AssetAccessSessionController,AssetAccessSessionActions,string} */
    private function stack(): array
    {
        $context = new RequestContext();
        $resolver = new class implements WorkspaceResolverInterface {
            public function resolve(RequestContext $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Private']); }
        };
        $workspaces = new WorkspaceProvider($resolver, new CallbackRequestContextProvider(static fn (): RequestContext => $context));
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $resource = new ResourceType('Private', $this->directory, '', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain'], deliveryMode: 'proxy');
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, ''))]);
        $files = new FileManager($registry, $authorization, new EventDispatcher(), workspaces: $workspaces);
        $catalog = new JsonAssetCatalog($this->directory . '/catalog.json');
        $asset = $catalog->register('main', 'Private', $files->entry('Private', 'private.txt'));
        $manager = new AssetAccessSessionManager($catalog, new JsonAssetAccessSessionStore($this->directory . '/sessions'), $workspaces, $files, $registry, true, 300, 3600, 10);
        $csrf = new CallbackCsrfTokenProvider(static fn (): string => 'valid', static fn ($request, string $token): bool => $token === 'valid');
        $guard = new MutationGuard($authorization, $csrf);
        $urls = new class implements EndpointUrlGeneratorInterface {
            public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
            {
                return ($absolute ? 'https://example.test' : '') . '/asset-session/' . rawurlencode((string) $parameters['token']) . '/' . rawurlencode((string) $parameters['assetId']);
            }
        };
        $actions = new AssetAccessSessionActions(
            new AssetSessionCreateAction($manager, $guard, $urls),
            new AssetSessionRevokeAction($manager, $guard),
            new AssetSessionContentAction($manager, new EntryStreamResponseBuilder()),
        );
        $unusedCsrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();
        $router = $this->createMock(RouterInterface::class);

        return [new AssetAccessSessionController($manager, $unusedCsrf, $router, new ContentController($files), $actions), $actions, $asset->id];
    }
}
