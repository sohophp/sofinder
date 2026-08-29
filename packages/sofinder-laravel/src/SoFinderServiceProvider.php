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
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\RequestContextProviderInterface;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\EndpointActionInterface;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Http\StandardEndpointActions;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\HybridImageProcessor;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\UploadPipeline;
use SohoPHP\SoFinder\Storage\ResourceRegistryFactory;
use SohoPHP\SoFinder\Storage\StoragePaginator;
use SohoPHP\SoFinder\Trash\TrashManager;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Usage\PersistentUsageTracker;
use SohoPHP\SoFinder\Workspace\DefaultWorkspaceResolver;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;

final class SoFinderServiceProvider extends ServiceProvider
{
    private const ACTION_TAG = 'sofinder.endpoint_actions';

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
        $this->app->singleton(RoleAuthorizationInterface::class, static fn ($app): LaravelRoleAuthorization => new LaravelRoleAuthorization($app->make(\Illuminate\Contracts\Auth\Access\Gate::class)));
        $this->app->singleton(CsrfTokenProviderInterface::class, static fn ($app): LaravelCsrfTokenProvider => new LaravelCsrfTokenProvider(static fn (): \Illuminate\Http\Request => $app->make('request')));
        $this->app->singleton(EventDispatcherInterface::class, static fn ($app): LaravelEventDispatcher => new LaravelEventDispatcher($app->make(IlluminateDispatcher::class)));
        $this->app->singleton(RequestContextProviderInterface::class, static fn ($app): LaravelRequestContextProvider => new LaravelRequestContextProvider(static fn (): \Illuminate\Http\Request => $app->make('request')));
        $this->app->singleton(EndpointUrlGeneratorInterface::class, LaravelEndpointUrlGenerator::class);
        $this->app->singleton(EntryUrlGeneratorInterface::class, LaravelEntryUrlGenerator::class);
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
        $this->app->singleton(PathGuard::class);
        $this->app->singleton(ResourceRegistry::class, static fn ($app): ResourceRegistry => (new ResourceRegistryFactory($app->make(PathGuard::class)))->create(
            (array) $app->make(LaravelConfiguration::class)->get('resources'),
        ));
        $this->app->singleton(WorkspaceResolverInterface::class, static fn ($app): DefaultWorkspaceResolver => new DefaultWorkspaceResolver(
            $app->make(ActorProviderInterface::class),
            $app->make(ResourceRegistry::class),
            (string) $app->make(LaravelConfiguration::class)->get('workspaces.default'),
        ));
        $this->app->singleton(WorkspaceProvider::class, static fn ($app): WorkspaceProvider => new WorkspaceProvider(
            $app->make(WorkspaceResolverInterface::class),
            $app->make(RequestContextProviderInterface::class),
        ));
        $this->app->singleton(ImageFormatRegistry::class);
        $this->app->singleton(GdImageProcessor::class, static fn ($app): GdImageProcessor => new GdImageProcessor(
            formats: $app->make(ImageFormatRegistry::class),
        ));
        $this->app->singleton(ImagickImageProcessor::class, static fn ($app): ImagickImageProcessor => new ImagickImageProcessor(
            formats: $app->make(ImageFormatRegistry::class),
        ));
        $this->app->singleton(HybridImageProcessor::class, static fn ($app): HybridImageProcessor => new HybridImageProcessor(
            $app->make(ImageFormatRegistry::class),
            $app->make(GdImageProcessor::class),
            $app->make(ImagickImageProcessor::class),
            (string) $app->make(LaravelConfiguration::class)->get('image_processing.driver'),
        ));
        $this->app->alias(HybridImageProcessor::class, ImageCapabilityProviderInterface::class);
        $this->app->singleton(PersistentUsageTracker::class, static fn ($app): PersistentUsageTracker => new PersistentUsageTracker(
            (string) $app->make(LaravelConfiguration::class)->get('usage_dir'),
        ));
        $this->app->singleton(TrashManager::class, static fn ($app): TrashManager => new TrashManager(
            (string) $app->make(LaravelConfiguration::class)->get('trash_dir'),
            $app->make(ActorProviderInterface::class),
            $app->make(PathGuard::class),
            (int) $app->make(LaravelConfiguration::class)->get('trash_retention_days'),
            (int) $app->make(LaravelConfiguration::class)->get('trash_max_items'),
            (int) $app->make(LaravelConfiguration::class)->get('trash_max_bytes'),
        ));
        $this->app->singleton(UploadPipeline::class, static fn ($app): UploadPipeline => new UploadPipeline(
            new DefaultFileInspector($app->make(HybridImageProcessor::class), $app->make(ImageFormatRegistry::class)),
            (string) $app->make(LaravelConfiguration::class)->get('quarantine_dir'),
        ));
        $this->app->singleton(FileManager::class, static fn ($app): FileManager => new FileManager(
            $app->make(ResourceRegistry::class),
            $app->make(AuthorizationInterface::class),
            $app->make(EventDispatcherInterface::class),
            $app->make(PathGuard::class),
            $app->make(UploadPipeline::class),
            $app->make(EntryUrlGeneratorInterface::class),
            $app->make(TrashManager::class),
            $app->make(PersistentUsageTracker::class),
            new StoragePaginator(),
            workspaces: $app->make(WorkspaceProvider::class),
        ));
        $this->app->singleton(JsonMetadataStore::class, static fn ($app): JsonMetadataStore => new JsonMetadataStore(
            (string) $app->make(LaravelConfiguration::class)->get('metadata_file'),
        ));
        $this->app->singleton(MetadataManager::class, static fn ($app): MetadataManager => new MetadataManager(
            $app->make(FileManager::class),
            $app->make(JsonMetadataStore::class),
            $app->make(ActorProviderInterface::class),
            (bool) $app->make(LaravelConfiguration::class)->get('features.quick_access_files'),
            $app->make(WorkspaceProvider::class),
        ));
        $this->app->singleton(UploadNamePolicy::class, static fn ($app): UploadNamePolicy => new UploadNamePolicy(
            (bool) $app->make(LaravelConfiguration::class)->get('uploads.naming.lowercase_extensions'),
        ));
        $this->app->singleton(StandardEndpointActions::class, static fn ($app): StandardEndpointActions => new StandardEndpointActions(
            $app->make(FileManager::class),
            $app->make(MetadataManager::class),
            $app->make(AuthorizationInterface::class),
            $app->make(CsrfTokenProviderInterface::class),
            $app->make(UploadNamePolicy::class),
            $app->make(LaravelConfiguration::class)->all(),
            $app->make(ImageCapabilityProviderInterface::class),
        ));
        $this->app->singleton(EndpointDispatcher::class, static function ($app): EndpointDispatcher {
            $responses = $app->make(ResponseFactoryInterface::class);
            $streams = $app->make(StreamFactoryInterface::class);
            $actions = [...$app->make(StandardEndpointActions::class)->all(), ...$app->tagged(self::ACTION_TAG)];

            return new EndpointDispatcher($responses, $streams, array_map(
                static fn (EndpointActionInterface $action): PsrEndpointHandler => new PsrEndpointHandler($action, $responses, $streams),
                $actions,
            ));
        });
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
