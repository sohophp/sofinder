<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Nyholm\Psr7\Factory\Psr17Factory;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\Action\LivenessAction;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Laravel\LaravelCsrfTokenProvider;
use SohoPHP\SoFinder\Laravel\LaravelConfiguration;
use SohoPHP\SoFinder\Laravel\LaravelEndpointController;
use SohoPHP\SoFinder\Laravel\LaravelRouteName;
use SohoPHP\SoFinder\Laravel\LaravelRouteRegistrar;
use SohoPHP\SoFinder\Laravel\SoFinderServiceProvider;
use SohoPHP\SoFinder\Laravel\Queue\LaravelMaintenanceDispatcher;
use SohoPHP\SoFinder\Laravel\Queue\LaravelMaintenanceJob;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use SohoPHP\SoFinder\Value\RequestContext;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;

final class LaravelBridgeTest extends TestCase
{
    public function testLaravelQueueDispatcherUsesTheSharedMaintenanceTask(): void
    {
        $bus = $this->createMock(\Illuminate\Contracts\Bus\Dispatcher::class);
        $bus->expects(self::once())->method('dispatch')->with(self::callback(
            static fn (mixed $job): bool => $job instanceof LaravelMaintenanceJob && $job->task === 'uploads',
        ));

        (new LaravelMaintenanceDispatcher($bus))->dispatch(MaintenanceTask::Uploads);
    }

    public function testRegistrarCreatesCanonicalLaravelRoutesAndMiddleware(): void
    {
        $router = $this->router();
        (new LaravelRouteRegistrar($router, [
            'prefix' => '/manager/',
            'domain' => 'files.example.test',
            'middleware' => ['web', 'tenant'],
            'auth_middleware' => ['auth'],
        ]))->register();
        $router->getRoutes()->refreshNameLookups();

        self::assertCount(52, $router->getRoutes());
        $browser = $router->getRoutes()->getByName('sofinder.browser');
        self::assertNotNull($browser);
        self::assertSame(\SohoPHP\SoFinder\Laravel\LaravelBrowserController::class, $browser->getActionName());
        self::assertContains(
            'Illuminate\\Foundation\\Http\\Middleware\\ValidateCsrfToken',
            $browser->excludedMiddleware(),
        );
        self::assertContains(
            'Illuminate\\Foundation\\Http\\Middleware\\PreventRequestForgery',
            $browser->excludedMiddleware(),
        );
        self::assertSame(['web', 'tenant', 'auth'], $browser->getAction('middleware'));
        $config = $router->getRoutes()->getByName('sofinder.api.config');
        self::assertNotNull($config);
        self::assertSame('manager/api/config', $config->uri());
        self::assertSame('files.example.test', $config->getDomain());
        self::assertSame(['web', 'tenant', 'auth'], $config->getAction('middleware'));
        self::assertSame('sofinder_api_config', $config->getAction('_sofinder_endpoint'));
        self::assertSame('/manager', $config->getAction('_sofinder_base_path'));

        $live = $router->getRoutes()->getByName('sofinder.liveness');
        self::assertNotNull($live);
        self::assertSame(['web', 'tenant'], $live->getAction('middleware'));
    }

    public function testLaravelControllerDispatchesTheSharedPsrAction(): void
    {
        $router = $this->router();
        (new LaravelRouteRegistrar($router, ['prefix' => 'sofinder', 'middleware' => [], 'auth_middleware' => []]))->register();
        $request = Request::create('https://example.test/sofinder/live', 'GET');
        $route = $router->getRoutes()->match($request);
        $request->setRouteResolver(static fn () => $route);
        $factory = new Psr17Factory();
        $action = new LivenessAction();
        $dispatcher = new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($action, $factory, $factory)]);
        $controller = new LaravelEndpointController(
            $dispatcher,
            new PsrHttpFactory($factory, $factory, $factory, $factory),
            new HttpFoundationFactory(),
        );

        $response = $controller($request);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['success' => true, 'data' => ['status' => 'ready']], json_decode((string) $response->getContent(), true, 32, JSON_THROW_ON_ERROR));
        self::assertSame('nosniff', $response->headers->get('X-Content-Type-Options'));
    }

    public function testLaravelSessionCsrfProviderUsesOpaqueSessionToken(): void
    {
        $request = Request::create('/sofinder/api/folders', 'POST');
        $session = new Store('sofinder-test', new ArraySessionHandler(120));
        $session->start();
        $session->regenerateToken();
        $request->setLaravelSession($session);
        $provider = new LaravelCsrfTokenProvider(static fn (): Request => $request);
        $token = $provider->token(new RequestContext());

        self::assertNotSame('', $token);
        self::assertTrue($provider->isValid(new RequestContext(), $token));
        self::assertFalse($provider->isValid(new RequestContext(), $token . '-invalid'));
    }

    public function testRouteNamesAndPackageDiscoveryAreStable(): void
    {
        self::assertSame('sofinder.api.asset.usage.put', LaravelRouteName::fromEndpoint('sofinder_api_asset_usage_put'));
        $composer = json_decode((string) file_get_contents(__DIR__ . '/../packages/sofinder-laravel/composer.json'), true, 32, JSON_THROW_ON_ERROR);
        self::assertSame([SoFinderServiceProvider::class], $composer['extra']['laravel']['providers']);
        self::assertSame('^12.0 || ^13.0', $composer['require']['illuminate/support']);
        self::assertSame('^8.2', $composer['require']['php']);
    }

    public function testLaravelArraysUseTheSharedConfigurationNormalizer(): void
    {
        $configuration = new LaravelConfiguration(
            ['uploads' => ['naming' => ['lowercase_extensions' => false]]],
            [
                'route_prefix' => '/sofinder',
                'cache_dir' => '/tmp/cache',
                'metadata_file' => '/tmp/metadata.json',
                'quarantine_dir' => '/tmp/quarantine',
                'chunk_dir' => '/tmp/chunks',
                'usage_dir' => '/tmp/usage',
                'trash_dir' => '/tmp/trash',
                'signed_urls' => ['secret' => str_repeat('s', 32)],
                'resources' => ['Files' => ['root' => '/tmp/files', 'delivery_mode' => 'proxy']],
            ],
        );

        self::assertFalse($configuration->get('uploads.naming.lowercase_extensions'));
        self::assertSame('/tmp/files', $configuration->get('resources.Files.root'));
        self::assertSame(5242880, $configuration->get('chunk_size'));
    }

    private function router(): Router
    {
        $container = new Container();

        return new Router(new Dispatcher($container), $container);
    }
}
