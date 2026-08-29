<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\AssetReferenceBuilder;
use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackRequestContextProvider;
use SohoPHP\SoFinder\Http\Action\AssetGetAction;
use SohoPHP\SoFinder\Http\Action\AssetResolveAction;
use SohoPHP\SoFinder\Http\Action\AssetUpdateAction;
use SohoPHP\SoFinder\Http\AssetActions;
use SohoPHP\SoFinder\Http\AssetApiController;
use SohoPHP\SoFinder\Http\AssetService;
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

final class SharedAssetActionTest extends TestCase
{
    private string $directory;
    private AssetActions $actions;
    private AssetApiController $controller;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-assets-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/manual.txt', 'manual');
        $resource = new ResourceType('Files', $this->directory, '/files', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $catalog = new JsonAssetCatalog($this->directory . '/assets.json');
        $workspaces = new WorkspaceProvider(
            new class implements WorkspaceResolverInterface {
                public function resolve(RequestContext $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Files']); }
            },
            new CallbackRequestContextProvider(static fn (): ?RequestContext => null),
        );
        $urls = new class implements EndpointUrlGeneratorInterface {
            public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
            {
                return '/' . $endpoint . '?' . http_build_query($parameters);
            }
        };
        $references = new AssetReferenceBuilder($urls, $workspaces, $catalog, catalogEnabled: true);
        $service = new AssetService($files, $references, $catalog, $workspaces, true);
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'valid'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'valid'; }
        };
        $this->actions = new AssetActions(new AssetResolveAction($service), new AssetGetAction($service), new AssetUpdateAction($service, new MutationGuard($authorization, $csrf)));
        $compatibilityFactory = (new \ReflectionClass(AssetReferenceFactory::class))->newInstanceWithoutConstructor();
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $this->controller = new AssetApiController($files, $compatibilityFactory, $catalog, $workspaces, new CsrfGuard($tokens, $authorization), true, actions: $this->actions);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $path) {
            @unlink($path);
        }
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrAssetResolveAndGetHaveIdenticalContracts(): void
    {
        $uri = '/api/assets/resolve?resource=Files&path=manual.txt';
        $symfonyResponse = $this->controller->resolve(Request::create($uri));
        $factory = new Psr17Factory();
        $psrResponse = (new PsrEndpointHandler($this->actions->resolve, $factory, $factory))->handle(new ServerRequest('GET', $uri));
        $symfonyPayload = json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR);
        self::assertSame($symfonyPayload, json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR));

        $id = $symfonyPayload['data']['asset']['assetId'];
        self::assertIsString($id);
        $getUri = '/api/assets/' . $id;
        $symfonyGet = $this->controller->get($id, Request::create($getUri));
        $psrGet = (new PsrEndpointHandler($this->actions->get, $factory, $factory))->handle((new ServerRequest('GET', $getUri))->withAttribute('id', $id));
        self::assertSame(
            json_decode((string) $symfonyGet->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrGet->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
    }

    public function testPsrAssetMetadataUpdateUsesSharedSecurityAndValidation(): void
    {
        $resolved = $this->actions->resolve->execute(new RequestContext(query: ['resource' => 'Files', 'path' => 'manual.txt']))->payload;
        $id = $resolved['data']['asset']['assetId'];
        self::assertIsString($id);
        $factory = new Psr17Factory();
        $body = json_encode(['alt' => 'Manual', 'title' => 'Guide', 'tags' => ['docs'], 'version' => 1], JSON_THROW_ON_ERROR);
        $request = (new ServerRequest('PATCH', '/api/assets/' . $id . '/metadata'))
            ->withAttribute('id', $id)
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('X-CSRF-TOKEN', 'valid')
            ->withBody($factory->createStream($body));
        $response = (new PsrEndpointHandler($this->actions->update, $factory, $factory))->handle($request);
        $metadata = json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['metadata'];

        self::assertSame('Manual', $metadata['alt']);
        self::assertSame(['docs'], $metadata['tags']);
        self::assertSame(2, $metadata['version']);
    }
}
