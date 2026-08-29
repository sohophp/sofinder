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
use SohoPHP\SoFinder\Http\StandardEndpointActions;
use SohoPHP\SoFinder\Http\AdvancedEndpointActions;
use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Security\ClamAvScanner;
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
            ->assertHeader('X-SoFinder-API-Version', '1.0')
            ->assertHeader('Cross-Origin-Resource-Policy', 'same-origin')
            ->assertExactJson(['success' => true, 'data' => ['status' => 'ready']]);
        $this->get('/sofinder/api/capabilities')
            ->assertOk()
            ->assertJsonPath('success', true);
        $this->get('/sofinder/api/config')
            ->assertForbidden()
            ->assertJsonPath('error.code', 'access_denied');
        $this->get('/sofinder/health')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.checks.0.name', 'document-preview')
            ->assertJsonCount(5, 'data.checks');

        $routes = $this->app->make(Router::class)->getRoutes();
        $routes->refreshNameLookups();
        self::assertCount(52, array_filter(
            iterator_to_array($routes),
            static fn ($route): bool => is_string($route->getAction('_sofinder_endpoint')),
        ));
        self::assertSame('sofinder/api/config', $routes->getByName('sofinder.api.config')?->uri());
        self::assertSame('sofinder/browser', $routes->getByName('sofinder.browser')?->uri());
    }

    public function testProviderBuildsNormalizedLaravelPaths(): void
    {
        $configuration = $this->app->make(LaravelConfiguration::class);

        self::assertSame('/sofinder', $configuration->get('route_prefix'));
        self::assertStringEndsWith('/storage/app/sofinder/files', (string) $configuration->get('resources.Files.root'));
        self::assertSame('proxy', $configuration->get('resources.Files.delivery_mode'));
    }

    public function testProviderRegistersSharedMaintenanceArtisanCommands(): void
    {
        $this->artisan('sofinder:maintenance:status', ['--json' => true])
            ->expectsOutputToContain('"status":"ready"')
            ->assertExitCode(0);

        $this->artisan('sofinder:security:audit', ['--json' => true])
            ->expectsOutputToContain('"scope":"malware-scanning"')
            ->assertExitCode(0);

        $commands = $this->app->make(\Illuminate\Contracts\Console\Kernel::class)->all();
        foreach (['sofinder:uploads:cleanup', 'sofinder:trash:cleanup', 'sofinder:usage:recalculate', 'sofinder:maintenance:status', 'sofinder:security:audit'] as $name) {
            self::assertArrayHasKey($name, $commands);
        }
    }

    public function testEnabledMalwareScanningIsWiredIntoTheSecurityAudit(): void
    {
        $this->app->make('config')->set('sofinder.core.malware_scanning', [
            'enabled' => true,
            'endpoint' => 'tcp://127.0.0.1:1',
            'timeout_seconds' => 0.1,
        ]);

        self::assertInstanceOf(ClamAvScanner::class, $this->app->make(ClamAvScanner::class));
        $this->artisan('sofinder:security:audit', ['--json' => true])
            ->expectsOutputToContain('"message":"The configured malware scanner is unavailable."')
            ->assertExitCode(1);
    }

    public function testProviderPublishesConfigurationAndFrontendAssets(): void
    {
        $config = SoFinderServiceProvider::pathsToPublish(SoFinderServiceProvider::class, 'sofinder-config');
        self::assertSame(config_path('sofinder.php'), reset($config));

        $assets = SoFinderServiceProvider::pathsToPublish(SoFinderServiceProvider::class, 'sofinder-assets');
        self::assertSame(public_path('vendor/sofinder'), reset($assets));
        self::assertFileExists((string) key($assets) . '/manifest.json');
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
        $endpoints = array_map(static fn ($action): string => $action->endpoint(), $this->app->make(StandardEndpointActions::class)->all());
        self::assertCount(22, $endpoints);
        self::assertSame($endpoints, array_values(array_unique($endpoints)));
        $advanced = array_map(static fn ($action): string => $action->endpoint(), $this->app->make(AdvancedEndpointActions::class)->all());
        self::assertCount(29, $advanced);
        $implemented = [...$endpoints, ...$advanced];
        $expected = array_values(array_map(
            static fn ($endpoint): string => $endpoint->name,
            array_filter(EndpointCatalog::all(), static fn ($endpoint): bool => $endpoint->name !== 'sofinder_browser'),
        ));
        sort($implemented);
        sort($expected);
        self::assertSame($expected, $implemented);
    }
}
