<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Events\Dispatcher as IlluminateDispatcher;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Nyholm\Psr7\Factory\Psr17Factory;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Http\Action\LivenessAction;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;

final class SoFinderServiceProvider extends ServiceProvider
{
    private const HANDLER_TAG = 'sofinder.endpoint_handlers';

    public function register(): void
    {
        $this->mergeConfigFrom(dirname(__DIR__) . '/config/sofinder.php', 'sofinder');
        $this->app->singleton(Psr17Factory::class);
        $this->app->alias(Psr17Factory::class, ResponseFactoryInterface::class);
        $this->app->alias(Psr17Factory::class, StreamFactoryInterface::class);
        $this->app->singleton(PsrHttpFactory::class, static fn ($app): PsrHttpFactory => new PsrHttpFactory(
            $app->make(Psr17Factory::class),
            $app->make(Psr17Factory::class),
            $app->make(Psr17Factory::class),
            $app->make(Psr17Factory::class),
        ));
        $this->app->singleton(HttpFoundationFactory::class);
        $this->app->singleton(AuthorizationInterface::class, static fn ($app): LaravelAuthorization => new LaravelAuthorization(
            $app->make(AuthFactory::class),
            $app->make(\Illuminate\Contracts\Auth\Access\Gate::class),
        ));
        $this->app->singleton(ActorProviderInterface::class, static fn ($app): LaravelActorProvider => new LaravelActorProvider($app->make(AuthFactory::class)));
        $this->app->singleton(CsrfTokenProviderInterface::class, static fn ($app): LaravelCsrfTokenProvider => new LaravelCsrfTokenProvider(static fn (): \Illuminate\Http\Request => $app->make('request')));
        $this->app->singleton(EventDispatcherInterface::class, static fn ($app): LaravelEventDispatcher => new LaravelEventDispatcher($app->make(IlluminateDispatcher::class)));
        $this->app->singleton(LaravelConfiguration::class, static function ($app): LaravelConfiguration {
            $prefix = trim((string) $app->make('config')->get('sofinder.prefix', 'sofinder'), '/');
            $storage = rtrim($app->storagePath(), '/');
            $secret = (string) $app->make('config')->get('app.key', '');

            return new LaravelConfiguration(
                (array) $app->make('config')->get('sofinder.core', []),
                [
                    'route_prefix' => $prefix === '' ? '/' : '/' . $prefix,
                    'cache_dir' => $storage . '/framework/cache/sofinder',
                    'metadata_file' => $storage . '/app/sofinder/metadata.json',
                    'quarantine_dir' => $storage . '/framework/cache/sofinder/quarantine',
                    'chunk_dir' => $storage . '/framework/cache/sofinder/chunks',
                    'usage_dir' => $storage . '/app/sofinder/usage',
                    'trash_dir' => $storage . '/app/sofinder/trash',
                    'signed_urls' => ['secret' => $secret],
                    'resources' => [
                        'Files' => [
                            'root' => $storage . '/app/sofinder/files',
                            'delivery_mode' => 'proxy',
                        ],
                    ],
                ],
            );
        });
        $this->app->singleton(LivenessAction::class);
        $this->app->singleton('sofinder.endpoint_handler.liveness', static fn ($app): PsrEndpointHandler => new PsrEndpointHandler(
            $app->make(LivenessAction::class),
            $app->make(ResponseFactoryInterface::class),
            $app->make(StreamFactoryInterface::class),
        ));
        $this->app->tag(['sofinder.endpoint_handler.liveness'], self::HANDLER_TAG);
        $this->app->singleton(EndpointDispatcher::class, static fn ($app): EndpointDispatcher => new EndpointDispatcher(
            $app->make(ResponseFactoryInterface::class),
            $app->make(StreamFactoryInterface::class),
            $app->tagged(self::HANDLER_TAG),
        ));
        $this->app->singleton(LaravelRouteRegistrar::class, static fn ($app): LaravelRouteRegistrar => new LaravelRouteRegistrar(
            $app->make(Router::class),
            (array) $app->make('config')->get('sofinder', []),
        ));
    }

    public function boot(LaravelRouteRegistrar $routes): void
    {
        if ((bool) $this->app->make('config')->get('sofinder.enabled', true)) {
            $routes->register();
        }
        if ($this->app->runningInConsole()) {
            $this->publishes([
                dirname(__DIR__) . '/config/sofinder.php' => config_path('sofinder.php'),
            ], 'sofinder-config');
        }
    }
}
