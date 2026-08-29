<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Laminas\Diactoros\ResponseFactory as DiactorosResponseFactory;
use Laminas\Diactoros\ServerRequest;
use Laminas\Diactoros\StreamFactory as DiactorosStreamFactory;
use Laminas\HttpHandlerRunner\RequestHandlerRunnerInterface;
use Laminas\Stratigility\MiddlewarePipe;
use Mezzio\Application as MezzioApplication;
use Mezzio\Handler\NotFoundHandler;
use Mezzio\MiddlewareContainer;
use Mezzio\MiddlewareFactory;
use Mezzio\Router\FastRouteRouter;
use Mezzio\Router\Middleware\DispatchMiddleware;
use Mezzio\Router\Middleware\RouteMiddleware;
use Mezzio\Router\RouteCollector;
use PHPUnit\Framework\TestCase;
use Psr\Container\ContainerInterface;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ResponseFactory as SlimResponseFactory;
use Slim\Psr7\Factory\ServerRequestFactory as SlimServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory as SlimStreamFactory;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Http\Action\LivenessAction;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\NativeSessionCsrfTokenProvider;
use SohoPHP\SoFinder\Psr15\SoFinderApplication;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceType;

final class Psr15HostIntegrationTest extends TestCase
{
    public function testRealSlimApplicationDispatchesSharedEndpoint(): void
    {
        $responses = new SlimResponseFactory();
        $streams = new SlimStreamFactory();
        $runtime = $this->runtime($responses, $streams);
        $app = AppFactory::create($responses);
        $runtime->routes()->registerSlim($app);

        $response = $app->handle((new SlimServerRequestFactory())->createServerRequest('GET', '/sofinder/live'));

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['success' => true, 'data' => ['status' => 'ready']], json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR));
        self::assertSame('nosniff', $response->getHeaderLine('X-Content-Type-Options'));
    }

    public function testRealMezzioApplicationDispatchesSharedEndpoint(): void
    {
        $responses = new DiactorosResponseFactory();
        $streams = new DiactorosStreamFactory();
        $runtime = $this->runtime($responses, $streams, '/manager');
        $container = new class implements ContainerInterface {
            public function get(string $id): mixed { throw new \RuntimeException('No services are resolved by name.'); }
            public function has(string $id): bool { return false; }
        };
        $router = new FastRouteRouter();
        $routes = new RouteCollector($router);
        $app = new MezzioApplication(
            new MiddlewareFactory(new MiddlewareContainer($container)),
            new MiddlewarePipe(),
            $routes,
            new class implements RequestHandlerRunnerInterface { public function run(): void {} },
        );
        $runtime->routes()->registerMezzio($app);
        $app->pipe(new RouteMiddleware($router));
        $app->pipe(new DispatchMiddleware());
        $app->pipe(new NotFoundHandler($responses));

        $response = $app->handle(new ServerRequest(uri: '/manager/live', method: 'GET'));

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['success' => true, 'data' => ['status' => 'ready']], json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR));
        self::assertSame('nosniff', $response->getHeaderLine('X-Content-Type-Options'));
    }

    public function testOfficialRuntimeRetainsAllRequiredHostServices(): void
    {
        $runtime = $this->runtime(new DiactorosResponseFactory(), new DiactorosStreamFactory());

        self::assertInstanceOf(AuthorizationInterface::class, $runtime->services()->authorization);
        self::assertInstanceOf(ActorProviderInterface::class, $runtime->services()->actor);
        self::assertInstanceOf(CsrfTokenProviderInterface::class, $runtime->services()->csrf);
        self::assertInstanceOf(EventDispatcherInterface::class, $runtime->services()->events);
    }

    public function testNativeSessionCsrfProviderGeneratesAndValidatesOpaqueTokens(): void
    {
        $hadSession = isset($_SESSION);
        $original = $_SESSION ?? null;
        $_SESSION = [];
        try {
            $provider = new NativeSessionCsrfTokenProvider(startSession: false);
            $token = $provider->token(new RequestContext());

            self::assertMatchesRegularExpression('/^[a-f0-9]{64}$/D', $token);
            self::assertTrue($provider->isValid(new RequestContext(), $token));
            self::assertFalse($provider->isValid(new RequestContext(), str_repeat('0', 64)));
        } finally {
            if ($hadSession) {
                $_SESSION = $original;
            } else {
                unset($_SESSION);
            }
        }
    }

    private function runtime(ResponseFactoryInterface $responses, StreamFactoryInterface $streams, string $prefix = '/sofinder'): SoFinderApplication
    {
        $action = new LivenessAction();
        $dispatcher = new EndpointDispatcher($responses, $streams, [new PsrEndpointHandler($action, $responses, $streams)]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return false; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return false; }
        };
        $actor = new class implements ActorProviderInterface { public function actorId(): string { return 'host-test'; } };
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'host-token'; }
            public function isValid(RequestContext $context, string $token): bool { return hash_equals('host-token', $token); }
        };
        $events = new class implements EventDispatcherInterface { public function dispatch(object $event): object { return $event; } };

        return new SoFinderApplication($dispatcher, new HostServices($authorization, $actor, $csrf, $events), $prefix);
    }
}
