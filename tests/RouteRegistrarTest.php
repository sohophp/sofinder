<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Psr15\RouteRegistrar;

final class RouteRegistrarTest extends TestCase
{
    public function testGenericRegistrarCoversTheBrowserAndEverySharedEndpoint(): void
    {
        $routes = [];
        (new RouteRegistrar($this->dispatcher()))->register(static function (array $methods, string $path, RequestHandlerInterface $handler, string $name, array $requirements) use (&$routes): void {
            $routes[$name] = compact('methods', 'path', 'handler', 'requirements');
        });

        self::assertCount(52, $routes);
        self::assertSame('/sofinder/browser', $routes['sofinder_browser']['path']);
        self::assertSame('/sofinder/api/uploads', $routes['sofinder_api_upload']['path']);
        self::assertSame(['POST'], $routes['sofinder_api_upload']['methods']);
    }

    public function testSlimRegistrationCompilesRequirementsAndForwardsRouteArguments(): void
    {
        $application = new FakeSlimApplication();
        (new RouteRegistrar($this->dispatcher(), '/manager'))->registerSlim($application);

        self::assertCount(52, $application->routes);
        $route = $application->routes['sofinder_api_trash_restore'];
        self::assertSame('/manager/api/trash/{id:[a-f0-9]{32}}/restore', $route['path']);
        $factory = new Psr17Factory();
        $response = ($route['handler'])(
            new ServerRequest('POST', '/manager/api/trash/id/restore'),
            $factory->createResponse(),
            ['id' => '0123456789abcdef0123456789abcdef'],
        );

        self::assertSame('sofinder_api_trash_restore:0123456789abcdef0123456789abcdef', (string) $response->getBody());
    }

    public function testMezzioRegistrationUsesNamedCanonicalRoutes(): void
    {
        $application = new FakeMezzioApplication();
        (new RouteRegistrar($this->dispatcher(), '/'))->registerMezzio($application);

        self::assertCount(52, $application->routes);
        self::assertSame('/api/assets/{id:[a-f0-9-]{36}}', $application->routes['sofinder_api_asset_get']['path']);
        self::assertInstanceOf(RequestHandlerInterface::class, $application->routes['sofinder_api_asset_get']['handler']);
    }

    public function testGenericRegistrarCanBeLimitedToApiRoutes(): void
    {
        $routes = [];
        (new RouteRegistrar($this->dispatcher(), '/sofinder', false))->register(static function (array $methods, string $path, RequestHandlerInterface $handler, string $name, array $requirements) use (&$routes): void {
            $routes[$name] = compact('methods', 'path', 'handler', 'requirements');
        });

        self::assertCount(51, $routes);
        self::assertArrayNotHasKey('sofinder_browser', $routes);
    }

    private function dispatcher(): RequestHandlerInterface
    {
        $factory = new Psr17Factory();

        return new class($factory) implements RequestHandlerInterface {
            public function __construct(private Psr17Factory $factory) {}
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                $value = (string) $request->getAttribute('sofinder.endpoint') . ':' . (string) $request->getAttribute('id');

                return $this->factory->createResponse()->withBody($this->factory->createStream($value));
            }
        };
    }
}

final class FakeSlimApplication
{
    /** @var array<string,array{methods:list<string>,path:string,handler:callable}> */
    public array $routes = [];

    /** @param list<string> $methods */
    public function map(array $methods, string $path, callable $handler): FakeSlimRoute
    {
        return new FakeSlimRoute(function (string $name) use ($methods, $path, $handler): void {
            $this->routes[$name] = ['methods' => $methods, 'path' => $path, 'handler' => $handler];
        });
    }
}

final readonly class FakeSlimRoute
{
    private \Closure $namer;

    /** @param callable(string):void $namer */
    public function __construct(callable $namer)
    {
        $this->namer = \Closure::fromCallable($namer);
    }

    public function setName(string $name): self
    {
        ($this->namer)($name);

        return $this;
    }
}

final class FakeMezzioApplication
{
    /** @var array<string,array{path:string,handler:RequestHandlerInterface,methods:list<string>}> */
    public array $routes = [];

    /** @param list<string> $methods */
    public function route(string $path, RequestHandlerInterface $handler, array $methods, string $name): void
    {
        $this->routes[$name] = compact('path', 'handler', 'methods');
    }
}
