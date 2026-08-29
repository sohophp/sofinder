<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\BoundedAssetSearchProvider;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackRequestContextProvider;
use SohoPHP\SoFinder\Http\Action\AssetSearchAction;
use SohoPHP\SoFinder\Http\AssetSearchController;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class SharedAssetSearchActionTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-asset-search-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/manual.pdf', 'manual');
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $path) {
            @unlink($path);
        }
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrAssetSearchHaveIdenticalContracts(): void
    {
        $resource = new ResourceType('Files', $this->directory, '/files');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $authorization,
            new EventDispatcher(),
        );
        $catalog = new JsonAssetCatalog($this->directory . '/catalog.json');
        $workspaces = new WorkspaceProvider(
            new class implements WorkspaceResolverInterface {
                public function resolve(RequestContext $request): WorkspaceContext
                {
                    return new WorkspaceContext((string) $request->header('X-Workspace', 'main'), 'actor', ['Files']);
                }
            },
            new CallbackRequestContextProvider(static fn (): ?RequestContext => null),
        );
        $action = new AssetSearchAction(new BoundedAssetSearchProvider($files, $catalog, 100), $workspaces);
        $controller = new AssetSearchController(new BoundedAssetSearchProvider($files, $catalog, 100), $workspaces, action: $action);
        $uri = '/api/assets/search?q=manual&type=document&limit=10';
        $symfonyRequest = Request::create($uri, server: ['HTTP_X_WORKSPACE' => 'main']);
        $symfonyResponse = $controller($symfonyRequest);

        $factory = new Psr17Factory();
        $psrRequest = (new ServerRequest('GET', $uri))->withHeader('X-Workspace', 'main');
        $psrResponse = (new PsrEndpointHandler($action, $factory, $factory))->handle($psrRequest);

        self::assertSame($symfonyResponse->getStatusCode(), $psrResponse->getStatusCode());
        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
        $payload = json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR);
        self::assertSame('manual.pdf', $payload['data']['items'][0]['entry']['path']);
        self::assertSame(10, $payload['data']['limit']);
    }
}
