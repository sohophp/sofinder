<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Illuminate\Foundation\Application;
use Illuminate\Routing\Router;
use Orchestra\Testbench\TestCase;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\RequestContextProviderInterface;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Laravel\LaravelConfiguration;
use SohoPHP\SoFinder\Laravel\SoFinderServiceProvider;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;

final class LaravelApplicationTest extends TestCase
{
    /** @return list<class-string> */
    protected function getPackageProviders($app): array
    {
        return [SoFinderServiceProvider::class];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('app.key', 'base64:' . base64_encode(str_repeat('s', 32)));
        $app['config']->set('sofinder.prefix', 'sofinder');
        $app['config']->set('sofinder.middleware', []);
        $app['config']->set('sofinder.auth_middleware', []);
    }

    public function testProviderBootsInsideARealLaravelApplication(): void
    {
        self::assertInstanceOf(Application::class, $this->app);

        $this->get('/sofinder/live')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertExactJson(['success' => true, 'data' => ['status' => 'ready']]);

        $routes = $this->app->make(Router::class)->getRoutes();
        $routes->refreshNameLookups();
        self::assertCount(51, array_filter(
            iterator_to_array($routes),
            static fn ($route): bool => is_string($route->getAction('_sofinder_endpoint')),
        ));
        self::assertSame('sofinder/api/config', $routes->getByName('sofinder.api.config')?->uri());
        self::assertNull($routes->getByName('sofinder.browser'));
    }

    public function testProviderBuildsNormalizedLaravelPaths(): void
    {
        $configuration = $this->app->make(LaravelConfiguration::class);

        self::assertSame('/sofinder', $configuration->get('route_prefix'));
        self::assertStringEndsWith('/storage/app/sofinder/files', (string) $configuration->get('resources.Files.root'));
        self::assertSame('proxy', $configuration->get('resources.Files.delivery_mode'));
    }

    public function testProviderRegistersFrameworkNeutralHostContracts(): void
    {
        foreach ([
            EndpointUrlGeneratorInterface::class,
            EntryUrlGeneratorInterface::class,
            RequestContextProviderInterface::class,
            RoleAuthorizationInterface::class,
            WorkspaceResolverInterface::class,
            WorkspaceProvider::class,
            ResourceRegistry::class,
        ] as $contract) {
            self::assertTrue($this->app->bound($contract), $contract);
        }

        self::assertSame('/sofinder/live', $this->app->make(EndpointUrlGeneratorInterface::class)->generate('sofinder_liveness'));
        self::assertSame(['Files'], array_map(
            static fn ($storage): string => $storage->resource->name,
            $this->app->make(ResourceRegistry::class)->all(),
        ));
    }
}
