<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Cache\Repository as CacheRepository;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Cache\Factory as CacheFactory;
use Illuminate\Contracts\Events\Dispatcher as IlluminateDispatcher;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Nyholm\Psr7\Factory\Psr17Factory;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AtomicStateStoreInterface;
use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Contract\AssetSearchProviderInterface;
use SohoPHP\SoFinder\Contract\AssetUsageStoreInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\GaugeMetricsStoreInterface;
use SohoPHP\SoFinder\Contract\RequestContextProviderInterface;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Contract\MalwareScanStatusStoreInterface;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Asset\AssetAccessSessionManager;
use SohoPHP\SoFinder\Asset\AssetOperationPublisher;
use SohoPHP\SoFinder\Asset\AssetReferenceBuilder;
use SohoPHP\SoFinder\Asset\BoundedAssetSearchProvider;
use SohoPHP\SoFinder\Asset\JsonAssetAccessSessionStore;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Asset\JsonAssetUsageStore;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\LocalHealthManagerFactory;
use SohoPHP\SoFinder\Http\AdvancedEndpointActions;
use SohoPHP\SoFinder\Http\EndpointActionInterface;
use SohoPHP\SoFinder\Http\BrowserPage;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Http\StandardEndpointActions;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\HybridImageProcessor;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Maintenance\MaintenanceCoordinator;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Laravel\Console\CleanupTrashCommand;
use SohoPHP\SoFinder\Laravel\Console\CleanupUploadsCommand;
use SohoPHP\SoFinder\Laravel\Console\MaintenanceStatusCommand;
use SohoPHP\SoFinder\Laravel\Console\RecalculateUsageCommand;
use SohoPHP\SoFinder\Laravel\Console\SecurityAuditCommand;
use SohoPHP\SoFinder\Laravel\Queue\LaravelDocumentPreviewDispatcher;
use SohoPHP\SoFinder\Laravel\Queue\LaravelMaintenanceDispatcher;
use SohoPHP\SoFinder\Observability\SharedMetricsStore;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\SharedMalwareScanStatusStore;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use SohoPHP\SoFinder\Security\SecurityAuditor;
use SohoPHP\SoFinder\Security\UploadPipeline;
use SohoPHP\SoFinder\Storage\ResourceRegistryFactory;
use SohoPHP\SoFinder\Storage\StoragePaginator;
use SohoPHP\SoFinder\Trash\TrashManager;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;
use SohoPHP\SoFinder\Upload\SharedChunkUploadStore;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Usage\PersistentUsageTracker;
use SohoPHP\SoFinder\Value\Theme;
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
        $this->app->singleton(LaravelCacheAtomicStateStore::class, static function ($app): LaravelCacheAtomicStateStore {
            $store = $app->make('config')->get('sofinder.cache_store');
            if ($store !== null && (!is_string($store) || $store === '')) {
                throw new \InvalidArgumentException('sofinder.cache_store must be null or a non-empty Laravel cache store name.');
            }
            $cache = $app->make(CacheFactory::class)->store($store);
            if (!$cache instanceof CacheRepository) {
                throw new \LogicException('Laravel cache.store must resolve to an Illuminate cache repository.');
            }

            return new LaravelCacheAtomicStateStore(
                $cache,
                (string) $app->make('config')->get('sofinder.cache_prefix', 'sofinder:'),
                (int) $app->make('config')->get('sofinder.cache_lock_seconds', 60),
                (int) $app->make('config')->get('sofinder.cache_lock_wait_seconds', 2),
            );
        });
        $this->app->alias(LaravelCacheAtomicStateStore::class, AtomicStateStoreInterface::class);
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
        $this->app->singleton(ChunkUploadManager::class, static fn ($app): ChunkUploadManager => new ChunkUploadManager(
            (string) $app->make(LaravelConfiguration::class)->get('chunk_dir'),
            $app->make(ActorProviderInterface::class),
            (int) $app->make(LaravelConfiguration::class)->get('chunk_size'),
            (int) $app->make(LaravelConfiguration::class)->get('max_upload_chunks'),
        ));
        $this->app->singleton(SharedChunkUploadStore::class, static fn ($app): SharedChunkUploadStore => new SharedChunkUploadStore(
            $app->make(ChunkUploadManager::class),
            $app->make(AtomicStateStoreInterface::class),
            $app->make(ActorProviderInterface::class),
        ));
        $this->app->alias(SharedChunkUploadStore::class, ChunkUploadStoreInterface::class);
        $this->app->singleton(LaravelMaintenanceDispatcher::class);
        $this->app->alias(LaravelMaintenanceDispatcher::class, MaintenanceDispatcherInterface::class);
        $this->app->singleton(LaravelDocumentPreviewDispatcher::class);
        $this->app->singleton(MaintenanceRunner::class, static fn ($app): MaintenanceRunner => new MaintenanceRunner(
            rtrim((string) $app->make(LaravelConfiguration::class)->get('cache_dir'), '/') . '/maintenance',
            $app->make(ChunkUploadStoreInterface::class),
            $app->make(TrashManager::class),
            $app->make(PersistentUsageTracker::class),
            $app->make(ResourceRegistry::class),
            $app->make(AtomicStateStoreInterface::class),
        ));
        $this->app->singleton(MaintenanceCoordinator::class, static function ($app): MaintenanceCoordinator {
            $mode = (string) $app->make(LaravelConfiguration::class)->get('maintenance.mode');
            return new MaintenanceCoordinator(
                rtrim((string) $app->make(LaravelConfiguration::class)->get('cache_dir'), '/') . '/maintenance',
                $mode,
                (int) $app->make(LaravelConfiguration::class)->get('maintenance.min_interval_seconds'),
                (int) $app->make(LaravelConfiguration::class)->get('maintenance.max_items_per_run'),
                $app->make(MaintenanceRunner::class),
                $mode === 'messenger' ? $app->make(MaintenanceDispatcherInterface::class) : null,
                $app->make(AtomicStateStoreInterface::class),
            );
        });
        $this->app->singleton(UploadPipeline::class, static fn ($app): UploadPipeline => new UploadPipeline(
            new DefaultFileInspector($app->make(HybridImageProcessor::class), $app->make(ImageFormatRegistry::class)),
            (string) $app->make(LaravelConfiguration::class)->get('quarantine_dir'),
            [$app->make(ClamAvScanner::class)],
        ));
        $this->app->singleton(ClamAvScanner::class, static function ($app): ClamAvScanner {
            $configuration = $app->make(LaravelConfiguration::class);

            return new ClamAvScanner(
                (string) $configuration->get('malware_scanning.endpoint'),
                (float) $configuration->get('malware_scanning.timeout_seconds'),
                metrics: $app->make(MetricsStoreInterface::class),
                statusStore: $app->make(MalwareScanStatusStoreInterface::class),
                logger: $app->make(LoggerInterface::class),
                enabled: (bool) $configuration->get('malware_scanning.enabled'),
            );
        });
        $this->app->singleton(SecurityAuditor::class, static function ($app): SecurityAuditor {
            $configuration = $app->make(LaravelConfiguration::class);

            return new SecurityAuditor(
                $app->make(ResourceRegistry::class),
                $app->basePath(),
                (string) $configuration->get('quarantine_dir'),
                (string) $configuration->get('chunk_dir'),
                (string) $configuration->get('trash_dir'),
                $app->make(ImageCapabilityProviderInterface::class),
                $app->make(ImageFormatRegistry::class),
                (bool) $configuration->get('malware_scanning.enabled'),
                $app->make(ClamAvScanner::class),
                $configuration->get('cluster.state_service') !== null,
                (bool) $configuration->get('cluster.shared_preview_cache'),
                (string) $configuration->get('document_preview.mode'),
                (bool) $configuration->get('document_preview.office'),
            );
        });
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
            $app->make(MaintenanceCoordinator::class),
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
        $this->app->singleton(\SohoPHP\SoFinder\Image\ImageManager::class, static fn ($app): \SohoPHP\SoFinder\Image\ImageManager => new \SohoPHP\SoFinder\Image\ImageManager(
            $app->make(FileManager::class),
            $app->make(HybridImageProcessor::class),
            (string) $app->make(LaravelConfiguration::class)->get('cache_dir'),
            (array) $app->make(LaravelConfiguration::class)->get('image_presets'),
            $app->make(ImageFormatRegistry::class),
            octdec((string) $app->make(LaravelConfiguration::class)->get('filesystem_permissions.directory_mode')),
            octdec((string) $app->make(LaravelConfiguration::class)->get('filesystem_permissions.file_mode')),
            (bool) $app->make(LaravelConfiguration::class)->get('image_variants.enabled'),
            (array) $app->make(LaravelConfiguration::class)->get('image_variants.widths'),
            (array) $app->make(LaravelConfiguration::class)->get('image_variants.formats'),
            (int) $app->make(LaravelConfiguration::class)->get('image_variants.quality'),
            (int) $app->make(LaravelConfiguration::class)->get('image_variants.cache_ttl_seconds'),
        ));
        $this->app->singleton(JsonAssetCatalog::class, static fn ($app): JsonAssetCatalog => new JsonAssetCatalog(rtrim((string) $app->make(LaravelConfiguration::class)->get('cache_dir'), '/') . '/assets.json'));
        $this->app->alias(JsonAssetCatalog::class, AssetCatalogInterface::class);
        $this->app->singleton(JsonAssetUsageStore::class, static fn ($app): JsonAssetUsageStore => new JsonAssetUsageStore(rtrim((string) $app->make(LaravelConfiguration::class)->get('cache_dir'), '/') . '/asset-usages.json'));
        $this->app->alias(JsonAssetUsageStore::class, AssetUsageStoreInterface::class);
        $this->app->singleton(JsonAssetAccessSessionStore::class, static fn ($app): JsonAssetAccessSessionStore => new JsonAssetAccessSessionStore(rtrim((string) $app->make(LaravelConfiguration::class)->get('cache_dir'), '/') . '/asset-access-sessions'));
        $this->app->singleton(BoundedAssetSearchProvider::class, static fn ($app): BoundedAssetSearchProvider => new BoundedAssetSearchProvider($app->make(FileManager::class), $app->make(AssetCatalogInterface::class), (int) $app->make(LaravelConfiguration::class)->get('asset_search.max_scanned_entries')));
        $this->app->alias(BoundedAssetSearchProvider::class, AssetSearchProviderInterface::class);
        $this->app->singleton(AssetReferenceBuilder::class, static fn ($app): AssetReferenceBuilder => new AssetReferenceBuilder(
            $app->make(EndpointUrlGeneratorInterface::class), $app->make(WorkspaceProvider::class), $app->make(AssetCatalogInterface::class), $app->make(\SohoPHP\SoFinder\Image\ImageManager::class),
            (bool) $app->make(LaravelConfiguration::class)->get('asset_catalog.enabled'), (bool) $app->make(LaravelConfiguration::class)->get('image_variants.enabled'),
            (array) $app->make(LaravelConfiguration::class)->get('image_variants.widths'), (array) $app->make(LaravelConfiguration::class)->get('image_variants.formats'),
        ));
        $this->app->singleton(AssetOperationPublisher::class, static fn ($app): AssetOperationPublisher => new AssetOperationPublisher($app->make(EventDispatcherInterface::class), $app->make(WorkspaceProvider::class), $app->make(ResourceRegistry::class), $app->make(AssetCatalogInterface::class), (bool) $app->make(LaravelConfiguration::class)->get('asset_catalog.enabled')));
        $this->app->singleton(ArchiveManager::class, static fn ($app): ArchiveManager => new ArchiveManager($app->make(FileManager::class), $app->make(PathGuard::class), (string) $app->make(LaravelConfiguration::class)->get('cache_dir')));
        $this->app->singleton(SharedMetricsStore::class, static fn ($app): SharedMetricsStore => new SharedMetricsStore($app->make(AtomicStateStoreInterface::class)));
        $this->app->alias(SharedMetricsStore::class, MetricsStoreInterface::class);
        $this->app->alias(SharedMetricsStore::class, GaugeMetricsStoreInterface::class);
        $this->app->singleton(DocumentPreviewManager::class, static fn ($app): DocumentPreviewManager => new DocumentPreviewManager(
            $app->make(FileManager::class), (string) $app->make(LaravelConfiguration::class)->get('cache_dir'),
            (bool) $app->make(LaravelConfiguration::class)->get('document_preview.pdf'), (bool) $app->make(LaravelConfiguration::class)->get('document_preview.office'),
            (string) $app->make(LaravelConfiguration::class)->get('document_preview.office_binary'), (int) $app->make(LaravelConfiguration::class)->get('document_preview.timeout_seconds'),
            (int) $app->make(LaravelConfiguration::class)->get('document_preview.max_bytes'), $app->make(MetricsStoreInterface::class),
        ));
        $this->app->singleton(DocumentPreviewJobManager::class, static fn ($app): DocumentPreviewJobManager => new DocumentPreviewJobManager(
            $app->make(DocumentPreviewManager::class), $app->make(ActorProviderInterface::class), rtrim((string) $app->make(LaravelConfiguration::class)->get('cache_dir'), '/') . '/document-preview-jobs.json',
            (string) $app->make(LaravelConfiguration::class)->get('document_preview.mode'), (int) $app->make(LaravelConfiguration::class)->get('document_preview.job_ttl_seconds'),
            (int) $app->make(LaravelConfiguration::class)->get('document_preview.cache_ttl_seconds'), dispatcher: $app->make(LaravelDocumentPreviewDispatcher::class),
            state: $app->make(AtomicStateStoreInterface::class), metrics: $app->make(MetricsStoreInterface::class),
        ));
        $this->app->singleton(SignedUrlManager::class, static fn ($app): SignedUrlManager => new SignedUrlManager(
            $app->make(FileManager::class), $app->make(ResourceRegistry::class), $app->make(PathGuard::class), (bool) $app->make(LaravelConfiguration::class)->get('signed_urls.enabled'),
            (string) $app->make(LaravelConfiguration::class)->get('signed_urls.secret'), (int) $app->make(LaravelConfiguration::class)->get('signed_urls.default_ttl_seconds'), (int) $app->make(LaravelConfiguration::class)->get('signed_urls.max_ttl_seconds'),
        ));
        $this->app->singleton(AssetAccessSessionManager::class, static fn ($app): AssetAccessSessionManager => new AssetAccessSessionManager(
            $app->make(AssetCatalogInterface::class), $app->make(JsonAssetAccessSessionStore::class), $app->make(WorkspaceProvider::class), $app->make(FileManager::class), $app->make(ResourceRegistry::class),
            (bool) $app->make(LaravelConfiguration::class)->get('asset_access_sessions.enabled'), (int) $app->make(LaravelConfiguration::class)->get('asset_access_sessions.default_ttl_seconds'),
            (int) $app->make(LaravelConfiguration::class)->get('asset_access_sessions.max_ttl_seconds'), (int) $app->make(LaravelConfiguration::class)->get('asset_access_sessions.max_assets'),
        ));
        $this->app->singleton(HealthManager::class, static function ($app): HealthManager {
            $packageDirectory = dirname(__DIR__);
            if (!is_dir($packageDirectory . '/dist')) {
                $packageDirectory = dirname(__DIR__, 3);
            }

            return (new LocalHealthManagerFactory())->create(
                $app->make(LaravelConfiguration::class)->all(),
                $app->make(ResourceRegistry::class),
                $app->make(ImageCapabilityProviderInterface::class),
                $app->make(ImageFormatRegistry::class),
                $app->make(GaugeMetricsStoreInterface::class),
                $packageDirectory,
                true,
            );
        });
        $this->app->singleton(SharedMalwareScanStatusStore::class, static fn ($app): SharedMalwareScanStatusStore => new SharedMalwareScanStatusStore(
            $app->make(AtomicStateStoreInterface::class),
            (int) $app->make(LaravelConfiguration::class)->get('malware_scanning.history_limit'),
        ));
        $this->app->alias(SharedMalwareScanStatusStore::class, MalwareScanStatusStoreInterface::class);
        $this->app->singleton(StandardEndpointActions::class, static fn ($app): StandardEndpointActions => new StandardEndpointActions(
            $app->make(FileManager::class),
            $app->make(MetadataManager::class),
            $app->make(AuthorizationInterface::class),
            $app->make(CsrfTokenProviderInterface::class),
            $app->make(UploadNamePolicy::class),
            $app->make(LaravelConfiguration::class)->all(),
            $app->make(ImageCapabilityProviderInterface::class),
        ));
        $this->app->singleton(AdvancedEndpointActions::class, static function ($app): AdvancedEndpointActions {
            $packageDirectory = dirname(__DIR__);
            if (!is_dir($packageDirectory . '/dist')) {
                $packageDirectory = dirname(__DIR__, 3);
            }
            return new AdvancedEndpointActions(
                $app->make(FileManager::class), $app->make(AuthorizationInterface::class), $app->make(CsrfTokenProviderInterface::class), $app->make(RoleAuthorizationInterface::class),
                $app->make(ChunkUploadStoreInterface::class), $app->make(MaintenanceCoordinator::class), $app->make(UploadNamePolicy::class), $app->make(WorkspaceProvider::class),
                $app->make(\SohoPHP\SoFinder\Image\ImageManager::class), $app->make(AssetReferenceBuilder::class), $app->make(AssetOperationPublisher::class), $app->make(ArchiveManager::class),
                $app->make(AssetSearchProviderInterface::class), $app->make(AssetCatalogInterface::class), $app->make(AssetUsageStoreInterface::class), $app->make(AssetAccessSessionManager::class),
                $app->make(DocumentPreviewManager::class), $app->make(DocumentPreviewJobManager::class), $app->make(SignedUrlManager::class), $app->make(EndpointUrlGeneratorInterface::class),
                $app->make(HealthManager::class), $app->make(MetricsStoreInterface::class), $app->make(MalwareScanStatusStoreInterface::class), $packageDirectory, $app->make(LaravelConfiguration::class)->all(),
            );
        });
        $this->app->singleton(BrowserPage::class, static function ($app): BrowserPage {
            $configuration = $app->make(LaravelConfiguration::class)->all();
            $packageDirectory = dirname(__DIR__);
            if (!is_dir($packageDirectory . '/dist')) {
                $packageDirectory = dirname(__DIR__, 3);
            }
            $fingerprint = hash_init('sha256');
            foreach (['sofinder.js', 'sofinder-picker.js', 'sofinder.css'] as $file) {
                $path = $packageDirectory . '/dist/' . $file;
                if (is_file($path)) hash_update_file($fingerprint, $path);
            }

            return new BrowserPage(
                $app->make(FileManager::class),
                $app->make(EndpointUrlGeneratorInterface::class),
                $app->make(CsrfTokenProviderInterface::class),
                substr(hash_final($fingerprint), 0, 12),
                new Theme((array) ($configuration['theme'] ?? [])),
                (array) ($configuration['ui'] ?? []),
                new FeaturePolicy((array) ($configuration['features'] ?? [])),
                $app->make(RoleAuthorizationInterface::class),
                array_values(array_filter((array) ($configuration['malware_scanning']['status_roles'] ?? []), 'is_string')),
                array_values(array_filter((array) ($configuration['picker']['allowed_origins'] ?? []), 'is_string')),
                $app->make(WorkspaceProvider::class),
                pickerLockResource: (bool) ($configuration['picker']['lock_resource'] ?? true),
            );
        });
        $this->app->singleton(EndpointDispatcher::class, static function ($app): EndpointDispatcher {
            $responses = $app->make(ResponseFactoryInterface::class);
            $streams = $app->make(StreamFactoryInterface::class);
            $actions = [...$app->make(StandardEndpointActions::class)->all(), ...$app->make(AdvancedEndpointActions::class)->all(), ...$app->tagged(self::ACTION_TAG)];

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
            $assetDirectory = dirname(__DIR__) . '/dist';
            if (!is_dir($assetDirectory)) {
                $assetDirectory = dirname(__DIR__, 3) . '/dist';
            }
            $this->commands([
                CleanupUploadsCommand::class,
                CleanupTrashCommand::class,
                RecalculateUsageCommand::class,
                MaintenanceStatusCommand::class,
                SecurityAuditCommand::class,
            ]);
            $this->publishes([
                dirname(__DIR__) . '/config/sofinder.php' => config_path('sofinder.php'),
            ], 'sofinder-config');
            $this->publishes([
                $assetDirectory => public_path('vendor/sofinder'),
            ], 'sofinder-assets');
        }
    }
}
