<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Asset\JsonAssetUsageStore;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackRequestContextProvider;
use SohoPHP\SoFinder\Http\Action\AssetDeleteCheckAction;
use SohoPHP\SoFinder\Http\Action\AssetUsageListAction;
use SohoPHP\SoFinder\Http\Action\AssetUsagePutAction;
use SohoPHP\SoFinder\Http\Action\AssetUsageRemoveAction;
use SohoPHP\SoFinder\Http\AssetUsageActions;
use SohoPHP\SoFinder\Http\AssetUsageController;
use SohoPHP\SoFinder\Http\AssetUsageService;
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
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SharedAssetUsageActionTest extends TestCase
{
    private string $directory;
    private string $assetId;
    private JsonAssetUsageStore $usages;
    private AssetUsageActions $actions;
    private AssetUsageController $controller;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-asset-usage-' . bin2hex(random_bytes(8));
        mkdir($this->directory . '/folder', 0775, true);
        file_put_contents($this->directory . '/folder/image.jpg', 'image');
        $resource = new ResourceType('Files', $this->directory, '/files');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $catalog = new JsonAssetCatalog($this->directory . '/catalog.json');
        $this->assetId = $catalog->register('main', 'Files', $files->entry('Files', 'folder/image.jpg'))->id;
        $this->usages = new JsonAssetUsageStore($this->directory . '/usages.json');
        $this->usages->put('main', $this->assetId, 'page:1', 'Home page', '/pages/1', 'hero');
        $workspaces = new WorkspaceProvider(
            new class implements WorkspaceResolverInterface {
                public function resolve(RequestContext $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Files']); }
            },
            new CallbackRequestContextProvider(static fn (): ?RequestContext => null),
        );
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'valid'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'valid'; }
        };
        $service = new AssetUsageService($catalog, $this->usages, $workspaces, $files, true);
        $guard = new MutationGuard($authorization, $csrf);
        $this->actions = new AssetUsageActions(new AssetUsageListAction($service), new AssetUsagePutAction($service, $guard), new AssetUsageRemoveAction($service, $guard), new AssetDeleteCheckAction($service, $guard));
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $this->controller = new AssetUsageController($catalog, $this->usages, $workspaces, $files, new CsrfGuard($tokens, $authorization), true, $this->actions);
    }

    protected function tearDown(): void
    {
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $item) {
            $item->isDir() ? @rmdir($item->getPathname()) : @unlink($item->getPathname());
        }
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrUsageListHaveIdenticalContracts(): void
    {
        $uri = '/api/assets/' . $this->assetId . '/usages';
        $symfonyResponse = $this->controller->list($this->assetId, Request::create($uri));
        $factory = new Psr17Factory();
        $request = (new ServerRequest('GET', $uri))->withAttribute('id', $this->assetId);
        $psrResponse = (new PsrEndpointHandler($this->actions->list, $factory, $factory))->handle($request);

        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
    }

    public function testPsrPutAndRemoveUseSharedMutationContract(): void
    {
        $factory = new Psr17Factory();
        $body = json_encode(['label' => 'Article', 'url' => '/articles/1'], JSON_THROW_ON_ERROR);
        $request = (new ServerRequest('PUT', '/api/assets/usage'))
            ->withAttribute('id', $this->assetId)
            ->withAttribute('referenceId', 'article:1')
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('X-CSRF-TOKEN', 'valid')
            ->withBody($factory->createStream($body));
        $response = (new PsrEndpointHandler($this->actions->put, $factory, $factory))->handle($request);
        self::assertSame('Article', json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['usage']['label']);

        $this->actions->remove->execute(new RequestContext(headers: ['X-CSRF-TOKEN' => 'valid'], attributes: ['id' => $this->assetId, 'referenceId' => 'article:1']));
        self::assertCount(1, $this->usages->list('main', $this->assetId));
    }

    public function testSymfonyAndPsrDeleteCheckHaveIdenticalContracts(): void
    {
        $body = json_encode(['resource' => 'Files', 'paths' => ['folder']], JSON_THROW_ON_ERROR);
        $symfonyResponse = $this->controller->deleteCheck(Request::create('/api/assets/delete-check', 'POST', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: $body));
        $factory = new Psr17Factory();
        $request = (new ServerRequest('POST', '/api/assets/delete-check'))->withHeader('Content-Type', 'application/json')->withHeader('X-CSRF-TOKEN', 'valid')->withBody($factory->createStream($body));
        $psrResponse = (new PsrEndpointHandler($this->actions->deleteCheck, $factory, $factory))->handle($request);

        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
    }
}
