<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\DependencyInjection;

use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Command\SecurityAuditCommand;
use SohoPHP\SoFinder\Command\TrashCleanupCommand;
use SohoPHP\SoFinder\Command\UsageRecalculateCommand;
use SohoPHP\SoFinder\Command\UploadCleanupCommand;
use SohoPHP\SoFinder\Command\ImageCapabilitiesCommand;
use SohoPHP\SoFinder\Command\MaintenanceStatusCommand;
use SohoPHP\SoFinder\Command\CacheCleanupCommand;
use SohoPHP\SoFinder\Command\MetadataRepairCommand;
use SohoPHP\SoFinder\Command\PluginValidateCommand;
use SohoPHP\SoFinder\Command\AssetMigrateCommand;
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\AtomicStateStoreInterface;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Contract\AssetSearchProviderInterface;
use SohoPHP\SoFinder\Contract\AssetUsageStoreInterface;
use SohoPHP\SoFinder\Contract\AssetAccessSessionStoreInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Contract\WorkspaceStorageAuditProviderInterface;
use SohoPHP\SoFinder\Contract\WorkspaceOptionProviderInterface;
use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Contract\FileInspectorInterface;
use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Contract\UploadScannerInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Contract\MalwareScanStatusStoreInterface;
use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Contract\GaugeMetricsStoreInterface;
use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Contract\QueueHealthProviderInterface;
use SohoPHP\SoFinder\Contract\RecycleBinInterface;
use SohoPHP\SoFinder\Contract\RequestGateStoreInterface;
use SohoPHP\SoFinder\Contract\StorageAdapterFactoryInterface;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\CapabilityController;
use SohoPHP\SoFinder\Http\ArchiveController;
use SohoPHP\SoFinder\Http\AssetController;
use SohoPHP\SoFinder\Http\AssetApiController;
use SohoPHP\SoFinder\Http\AssetSearchController;
use SohoPHP\SoFinder\Http\AssetUsageController;
use SohoPHP\SoFinder\Http\AssetAccessSessionController;
use SohoPHP\SoFinder\Http\BrowserController;
use SohoPHP\SoFinder\Http\ChunkUploadController;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\ExceptionSubscriber;
use SohoPHP\SoFinder\Http\FailureAuditSubscriber;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\HealthController;
use SohoPHP\SoFinder\Http\LivenessController;
use SohoPHP\SoFinder\Http\MetricsController;
use SohoPHP\SoFinder\Http\RequestIdSubscriber;
use SohoPHP\SoFinder\Http\MetadataController;
use SohoPHP\SoFinder\Http\QuickUploadController;
use SohoPHP\SoFinder\Http\SecurityResponseSubscriber;
use SohoPHP\SoFinder\Http\SecurityStatusController;
use SohoPHP\SoFinder\Http\SignedUrlController;
use SohoPHP\SoFinder\Http\DocumentPreviewController;
use SohoPHP\SoFinder\Http\DocumentPreviewJobController;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\HybridImageProcessor;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Health\RuntimeHealthCheck;
use SohoPHP\SoFinder\Health\StorageHealthCheck;
use SohoPHP\SoFinder\Health\DocumentPreviewHealthCheck;
use SohoPHP\SoFinder\Health\SharedStateHealthCheck;
use SohoPHP\SoFinder\Health\ImageHealthCheck;
use SohoPHP\SoFinder\Health\MaintenanceQueueHealthCheck;
use SohoPHP\SoFinder\Observability\LocalMetricsStore;
use SohoPHP\SoFinder\Observability\SharedMetricsStore;
use SohoPHP\SoFinder\Observability\OperationMetricsSubscriber;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Maintenance\MaintenanceCoordinator;
use SohoPHP\SoFinder\Maintenance\MaintenanceMessageHandler;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MessengerMaintenanceDispatcher;
use SohoPHP\SoFinder\Maintenance\CacheCleaner;
use SohoPHP\SoFinder\Maintenance\MetadataRepairer;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewPlugin;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewMessageHandler;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\UploadPipeline;
use SohoPHP\SoFinder\Security\RequestGate;
use SohoPHP\SoFinder\Security\LocalRequestGateStore;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use SohoPHP\SoFinder\Security\MalwareScanStatusStore;
use SohoPHP\SoFinder\Security\SharedMalwareScanStatusStore;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use SohoPHP\SoFinder\State\SharedMetadataStore;
use SohoPHP\SoFinder\State\SharedRequestGateStore;
use SohoPHP\SoFinder\State\SharedUsageTracker;
use SohoPHP\SoFinder\Storage\LocalStorageAdapterFactory;
use SohoPHP\SoFinder\Storage\StoragePaginator;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\OperationAuditSubscriber;
use SohoPHP\SoFinder\Symfony\MetadataOperationSubscriber;
use SohoPHP\SoFinder\Symfony\SymfonyActorProvider;
use SohoPHP\SoFinder\Symfony\DefaultWorkspaceResolver;
use SohoPHP\SoFinder\Symfony\AssetCatalogSubscriber;
use SohoPHP\SoFinder\Symfony\VersionedOperationSubscriber;
use SohoPHP\SoFinder\Symfony\ResourceRegistryFactory;
use SohoPHP\SoFinder\Symfony\SymfonyAuthorization;
use SohoPHP\SoFinder\Symfony\SymfonyEntryUrlGenerator;
use SohoPHP\SoFinder\Trash\TrashManager;
use SohoPHP\SoFinder\Usage\PersistentUsageTracker;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;
use SohoPHP\SoFinder\Upload\SharedChunkUploadStore;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Asset\SharedAssetCatalog;
use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use SohoPHP\SoFinder\Asset\AssetOperationPublisher;
use SohoPHP\SoFinder\Asset\BoundedAssetSearchProvider;
use SohoPHP\SoFinder\Asset\JsonAssetUsageStore;
use SohoPHP\SoFinder\Asset\SharedAssetUsageStore;
use SohoPHP\SoFinder\Asset\JsonAssetAccessSessionStore;
use SohoPHP\SoFinder\Asset\SharedAssetAccessSessionStore;
use SohoPHP\SoFinder\Asset\AssetAccessSessionManager;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use SohoPHP\SoFinder\Value\Theme;
use SohoPHP\SoFinder\Value\ImageProcessingLimits;
use SohoPHP\SoFinder\Value\CapabilityCatalog;
use Symfony\Component\DependencyInjection\Alias;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\DependencyInjection\Argument\TaggedIteratorArgument;
use Symfony\Component\EventDispatcher\EventDispatcherInterface as SymfonyEventDispatcherInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SoFinderExtension extends Extension
{
    /** @param array<int, array<string, mixed>> $configs */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $config = $this->processConfiguration(new Configuration(), $configs);
        $lowercaseUploadExtensions = (bool) $config['uploads']['naming']['lowercase_extensions'];
        foreach ($configs as $source) {
            if (isset($source['ui']) && is_array($source['ui']) && array_key_exists('lowercase_upload_extensions', $source['ui'])) {
                $lowercaseUploadExtensions = (bool) $source['ui']['lowercase_upload_extensions'];
            }
        }
        $config['ui']['lowercase_upload_extensions'] = $lowercaseUploadExtensions;
        $imageDriver = (string) $config['image_processing']['driver'];
        if ($imageDriver === 'gd' && !extension_loaded('gd')) {
            throw new \InvalidArgumentException('SoFinder image_processing.driver is gd, but ext-gd is not installed.');
        }
        if ($imageDriver === 'imagick' && !extension_loaded('imagick')) {
            throw new \InvalidArgumentException('SoFinder image_processing.driver is imagick, but ext-imagick is not installed.');
        }
        $container->setParameter('so_finder.resources', $config['resources']);
        $container->setParameter('so_finder.cache_dir', $config['cache_dir']);
        $container->setParameter('so_finder.metadata_file', $config['metadata_file']);
        $container->setParameter('so_finder.quarantine_dir', $config['quarantine_dir']);
        $container->setParameter('so_finder.chunk_dir', $config['chunk_dir']);
        $container->setParameter('so_finder.usage_dir', $config['usage_dir']);
        $container->setParameter('so_finder.trash_dir', $config['trash_dir']);
        $directoryMode = octdec($config['filesystem_permissions']['directory_mode']);
        $fileMode = octdec($config['filesystem_permissions']['file_mode']);
        $maintenanceConfig = $config['maintenance'];
        $malwareConfig = $config['malware_scanning'];
        $documentPreviewConfig = $config['document_preview'];
        $clusterConfig = $config['cluster'];
        $sharedState = $clusterConfig['state_service'] === null ? null : new Reference((string) $clusterConfig['state_service']);
        $signedUrlConfig = $config['signed_urls'];
        $assetCatalogConfig = $config['asset_catalog'];
        $assetSearchConfig = $config['asset_search'];
        $assetUsageConfig = $config['asset_usage'];
        $assetAccessConfig = $config['asset_access_sessions'];
        $workspaceConfig = $config['workspaces'];
        $variantConfig = $config['image_variants'];
        if ($maintenanceConfig['mode'] === 'messenger' && !interface_exists('Symfony\\Component\\Messenger\\MessageBusInterface')) {
            throw new \InvalidArgumentException('SoFinder maintenance.mode is messenger, but symfony/messenger is not installed.');
        }
        $container->registerForAutoconfiguration(PluginInterface::class)->addTag('sofinder.plugin');
        $container->registerForAutoconfiguration(UploadScannerInterface::class)->addTag('sofinder.upload_scanner');
        $container->registerForAutoconfiguration(HealthCheckInterface::class)->addTag('sofinder.health_check');
        $container->registerForAutoconfiguration(QueueHealthProviderInterface::class)->addTag('sofinder.queue_health_provider');
        $container->registerForAutoconfiguration(StorageAdapterFactoryInterface::class)->addTag('sofinder.storage_factory');
        $container->registerForAutoconfiguration(EntryUrlContextProviderInterface::class)->addTag('sofinder.entry_url_context_provider');
        $container->registerForAutoconfiguration(WorkspaceStorageAuditProviderInterface::class)->addTag('sofinder.workspace_storage_audit_provider');
        $packageDir = dirname(__DIR__, 2);
        $container->setParameter('so_finder.package_dir', $packageDir);
        $assetFiles = [$packageDir . '/dist/sofinder.js', $packageDir . '/dist/sofinder-picker.js', $packageDir . '/dist/sofinder.css'];
        $assetFingerprint = hash_init('sha256');
        foreach ($assetFiles as $assetFile) {
            if (is_file($assetFile)) {
                hash_update_file($assetFingerprint, $assetFile);
            }
        }
        $container->setParameter('so_finder.asset_version', substr(hash_final($assetFingerprint), 0, 12));

        $container->setDefinition(PathGuard::class, new Definition(PathGuard::class));
        $container->setDefinition(BoundedAssetSearchProvider::class, (new Definition(BoundedAssetSearchProvider::class))
            ->setArguments([new Reference(FileManager::class), new Reference(AssetCatalogInterface::class), $assetSearchConfig['max_scanned_entries']]));
        $container->setAlias(AssetSearchProviderInterface::class, new Alias(
            $assetSearchConfig['provider_service'] !== null ? (string) $assetSearchConfig['provider_service'] : BoundedAssetSearchProvider::class,
        ));
        $container->setDefinition(JsonAssetUsageStore::class, (new Definition(JsonAssetUsageStore::class))
            ->setArgument('$file', rtrim((string) $config['cache_dir'], '/') . '/asset-usages.json'));
        $container->setAlias(AssetUsageStoreInterface::class, new Alias(JsonAssetUsageStore::class));
        $container->setDefinition(JsonAssetAccessSessionStore::class, (new Definition(JsonAssetAccessSessionStore::class))->setArgument('$directory', rtrim((string) $config['cache_dir'], '/') . '/asset-access-sessions'));
        $container->setAlias(AssetAccessSessionStoreInterface::class, new Alias(JsonAssetAccessSessionStore::class));
        $container->setDefinition(UploadNamePolicy::class, new Definition(UploadNamePolicy::class, [$lowercaseUploadExtensions]));
        $container->setDefinition(LocalStorageAdapterFactory::class, (new Definition(LocalStorageAdapterFactory::class))
            ->setArgument('$pathGuard', new Reference(PathGuard::class))
            ->setArgument('$directoryMode', $directoryMode)
            ->setArgument('$fileMode', $fileMode)
            ->addTag('sofinder.storage_factory'));
        $container->setDefinition(StoragePaginator::class, new Definition(StoragePaginator::class));
        $container->setDefinition(ResourceRegistryFactory::class, (new Definition(ResourceRegistryFactory::class))
            ->setArgument('$pathGuard', new Reference(PathGuard::class))
            ->setArgument('$requestStack', new Reference(RequestStack::class))
            ->setArgument('$factories', new TaggedIteratorArgument('sofinder.storage_factory')));
        $container->setDefinition(ResourceRegistry::class, (new Definition(ResourceRegistry::class))
            ->setFactory([new Reference(ResourceRegistryFactory::class), 'create'])
            ->setArguments([$config['resources']]));
        $container->setDefinition(SymfonyAuthorization::class, (new Definition(SymfonyAuthorization::class))
            ->setArgument('$authorizationChecker', new Reference(AuthorizationCheckerInterface::class)));
        $container->setAlias(AuthorizationInterface::class, new Alias(SymfonyAuthorization::class));
        $container->setDefinition(SymfonyActorProvider::class, (new Definition(SymfonyActorProvider::class))
            ->setArguments([
                new Reference(TokenStorageInterface::class),
                new Reference(RequestStack::class),
            ]));
        $container->setAlias(ActorProviderInterface::class, new Alias(SymfonyActorProvider::class));
        $container->setDefinition(DefaultWorkspaceResolver::class, (new Definition(DefaultWorkspaceResolver::class))
            ->setArguments([new Reference(ActorProviderInterface::class), new Reference(ResourceRegistry::class), $workspaceConfig['default']]));
        $container->setAlias(WorkspaceResolverInterface::class, new Alias(
            $workspaceConfig['resolver_service'] !== null ? (string) $workspaceConfig['resolver_service'] : DefaultWorkspaceResolver::class,
        ));
        $container->setDefinition(WorkspaceProvider::class, (new Definition(WorkspaceProvider::class))
            ->setArguments([new Reference(WorkspaceResolverInterface::class), new Reference(RequestStack::class)]));
        $container->setDefinition(PersistentUsageTracker::class, (new Definition(PersistentUsageTracker::class))
            ->setArgument('$directory', $config['usage_dir']));
        $container->setAlias(UsageTrackerInterface::class, new Alias(PersistentUsageTracker::class));
        $container->setDefinition(JsonMetadataStore::class, (new Definition(JsonMetadataStore::class))
            ->setArgument('$file', $config['metadata_file']));
        $container->setAlias(MetadataStoreInterface::class, new Alias(JsonMetadataStore::class));
        $container->setDefinition(JsonAssetCatalog::class, (new Definition(JsonAssetCatalog::class))
            ->setArgument('$file', rtrim((string) $config['cache_dir'], '/') . '/assets.json'));
        $container->setAlias(AssetCatalogInterface::class, new Alias(JsonAssetCatalog::class));
        $container->setAlias(EventDispatcherInterface::class, new Alias(SymfonyEventDispatcherInterface::class));
        $container->setDefinition(CsrfGuard::class, (new Definition(CsrfGuard::class))
            ->setArguments([
                new Reference(CsrfTokenManagerInterface::class),
                new Reference(AuthorizationInterface::class),
            ]));
        $imageConfig = $config['image_processing'];
        $container->setDefinition(ImageFormatRegistry::class, new Definition(ImageFormatRegistry::class));
        $container->setDefinition(ImageProcessingLimits::class, (new Definition(ImageProcessingLimits::class))->setArguments([
            $imageConfig['max_width'],
            $imageConfig['max_height'],
            $imageConfig['max_single_frame_pixels'],
            $imageConfig['max_frames'],
            $imageConfig['max_total_pixels'],
            $imageConfig['memory_bytes'],
            $imageConfig['map_bytes'],
            $imageConfig['disk_bytes'],
            $imageConfig['threads'],
            $imageConfig['timeout_seconds'],
        ]));
        $container->setDefinition(GdImageProcessor::class, (new Definition(GdImageProcessor::class))
            ->setArgument('$maximumPixels', $imageConfig['max_single_frame_pixels'])
            ->setArgument('$formats', new Reference(ImageFormatRegistry::class))
            ->setArgument('$watermarkFont', $imageConfig['watermark_font']));
        $container->setDefinition(ImagickImageProcessor::class, (new Definition(ImagickImageProcessor::class))
            ->setArguments([new Reference(ImageFormatRegistry::class), new Reference(ImageProcessingLimits::class), $imageConfig['watermark_font']]));
        $container->setDefinition(HybridImageProcessor::class, (new Definition(HybridImageProcessor::class))
            ->setArguments([
                new Reference(ImageFormatRegistry::class),
                new Reference(GdImageProcessor::class),
                new Reference(ImagickImageProcessor::class),
                $imageDriver,
            ]));
        $container->setAlias(ImageProcessorInterface::class, new Alias(HybridImageProcessor::class));
        $container->setAlias(ImageCapabilityProviderInterface::class, new Alias(HybridImageProcessor::class));
        $container->setDefinition(DefaultFileInspector::class, (new Definition(DefaultFileInspector::class))
            ->setArguments([new Reference(ImageProcessorInterface::class), new Reference(ImageFormatRegistry::class)]));
        $container->setAlias(FileInspectorInterface::class, new Alias(DefaultFileInspector::class));
        $container->setDefinition(SymfonyEntryUrlGenerator::class, (new Definition(SymfonyEntryUrlGenerator::class))
            ->setArgument('$router', new Reference(RouterInterface::class))
            ->setArgument('$contextProviders', new TaggedIteratorArgument('sofinder.entry_url_context_provider')));
        $container->setAlias(EntryUrlGeneratorInterface::class, new Alias(SymfonyEntryUrlGenerator::class));
        $container->setDefinition(UploadPipeline::class, (new Definition(UploadPipeline::class))
            ->setArguments([
                new Reference(FileInspectorInterface::class),
                $config['quarantine_dir'],
                new TaggedIteratorArgument('sofinder.upload_scanner'),
            ]));
        $container->setDefinition(TrashManager::class, (new Definition(TrashManager::class))
            ->setArguments([
                $config['trash_dir'],
                new Reference(ActorProviderInterface::class),
                new Reference(PathGuard::class),
                $config['trash_retention_days'],
                $config['trash_max_items'],
                $config['trash_max_bytes'],
            ]));
        $container->setAlias(RecycleBinInterface::class, new Alias(TrashManager::class));
        $container->setDefinition(ChunkUploadManager::class, (new Definition(ChunkUploadManager::class))
            ->setArguments([
                $config['chunk_dir'],
                new Reference(ActorProviderInterface::class),
                $config['chunk_size'],
                $config['max_upload_chunks'],
            ]));
        $container->setAlias(ChunkUploadStoreInterface::class, new Alias(ChunkUploadManager::class));
        $maintenanceDirectory = rtrim((string) $config['cache_dir'], '/') . '/maintenance';
        $container->setDefinition(MaintenanceRunner::class, (new Definition(MaintenanceRunner::class))
            ->setArguments([
                $maintenanceDirectory,
                new Reference(ChunkUploadStoreInterface::class),
                new Reference(RecycleBinInterface::class),
                new Reference(UsageTrackerInterface::class),
                new Reference(ResourceRegistry::class),
                $sharedState,
            ]));
        $dispatcher = null;
        if ($maintenanceConfig['mode'] === 'messenger') {
            $container->setDefinition(MessengerMaintenanceDispatcher::class, (new Definition(MessengerMaintenanceDispatcher::class))
                ->setArgument('$bus', new Reference('messenger.default_bus')));
            $container->setAlias(MaintenanceDispatcherInterface::class, new Alias(MessengerMaintenanceDispatcher::class));
            $container->setDefinition(MaintenanceMessageHandler::class, (new Definition(MaintenanceMessageHandler::class))
                ->setArgument('$runner', new Reference(MaintenanceRunner::class))
                ->addTag('messenger.message_handler'));
            $dispatcher = new Reference(MaintenanceDispatcherInterface::class);
        }
        $container->setDefinition(MaintenanceCoordinator::class, (new Definition(MaintenanceCoordinator::class))
            ->setArguments([
                $maintenanceDirectory,
                $maintenanceConfig['mode'],
                $maintenanceConfig['min_interval_seconds'],
                $maintenanceConfig['max_items_per_run'],
                new Reference(MaintenanceRunner::class),
                $dispatcher,
                $sharedState,
            ]));
        $container->setDefinition(CacheCleaner::class, (new Definition(CacheCleaner::class))
            ->setArguments([$config['cache_dir'], new Reference(DocumentPreviewJobManager::class)]));
        $container->setDefinition(MetadataRepairer::class, (new Definition(MetadataRepairer::class))
            ->setArguments([$config['metadata_file'], new Reference(ResourceRegistry::class), $clusterConfig['state_service'] === null]));
        $container->setDefinition(FileManager::class, (new Definition(FileManager::class))
            ->setArguments([
                new Reference(ResourceRegistry::class),
                new Reference(AuthorizationInterface::class),
                new Reference(EventDispatcherInterface::class),
                new Reference(PathGuard::class),
                new Reference(UploadPipeline::class),
                new Reference(EntryUrlGeneratorInterface::class),
                new Reference(RecycleBinInterface::class),
                new Reference(UsageTrackerInterface::class),
                new Reference(StoragePaginator::class),
                new Reference(MaintenanceCoordinator::class),
                $workspaceConfig['enabled'] ? new Reference(WorkspaceProvider::class) : null,
            ]));
        $container->setDefinition(ImageManager::class, (new Definition(ImageManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                new Reference(ImageProcessorInterface::class),
                $config['cache_dir'],
                $config['image_presets'],
                new Reference(ImageFormatRegistry::class),
                $directoryMode,
                $fileMode,
                $variantConfig['enabled'],
                array_values(array_unique($variantConfig['widths'])),
                $variantConfig['formats'],
                $variantConfig['quality'],
                $variantConfig['cache_ttl_seconds'],
            ]));
        $container->setDefinition(AssetReferenceFactory::class, (new Definition(AssetReferenceFactory::class))
            ->setArguments([
                new Reference(RouterInterface::class),
                new Reference(WorkspaceProvider::class),
                new Reference(AssetCatalogInterface::class),
                new Reference(ImageManager::class),
                $assetCatalogConfig['enabled'],
                $variantConfig['enabled'],
                array_slice(array_values(array_unique($variantConfig['widths'])), 0, $variantConfig['max_variants_per_asset']),
                $variantConfig['formats'],
            ]));
        $container->setDefinition(AssetOperationPublisher::class, (new Definition(AssetOperationPublisher::class))
            ->setArguments([new Reference(EventDispatcherInterface::class), new Reference(WorkspaceProvider::class), new Reference(ResourceRegistry::class), new Reference(AssetCatalogInterface::class), $assetCatalogConfig['enabled']]));
        $container->setDefinition(ArchiveManager::class, (new Definition(ArchiveManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                new Reference(PathGuard::class),
                $config['cache_dir'],
            ]));
        $container->setDefinition(MetadataManager::class, (new Definition(MetadataManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                new Reference(MetadataStoreInterface::class),
                new Reference(ActorProviderInterface::class),
                $config['features']['quick_access_files'],
                $workspaceConfig['enabled'] ? new Reference(WorkspaceProvider::class) : null,
            ]));
        $container->setDefinition(Theme::class, (new Definition(Theme::class))->setArgument('$values', $config['theme']));
        $container->setDefinition(CapabilityCatalog::class, new Definition(CapabilityCatalog::class));
        $container->setDefinition(DocumentPreviewManager::class, (new Definition(DocumentPreviewManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                $config['cache_dir'],
                $documentPreviewConfig['pdf'],
                $documentPreviewConfig['office'],
                $documentPreviewConfig['office_binary'],
                $documentPreviewConfig['timeout_seconds'],
                $documentPreviewConfig['max_bytes'],
                new Reference(MetricsStoreInterface::class),
            ]));
        $container->setDefinition(DocumentPreviewJobManager::class, (new Definition(DocumentPreviewJobManager::class))
            ->setArguments([
                new Reference(DocumentPreviewManager::class),
                new Reference(ActorProviderInterface::class),
                rtrim((string) $config['cache_dir'], '/') . '/document-preview-jobs.json',
                $documentPreviewConfig['mode'],
                $documentPreviewConfig['job_ttl_seconds'],
                $documentPreviewConfig['cache_ttl_seconds'],
                new Reference('messenger.default_bus', ContainerInterface::NULL_ON_INVALID_REFERENCE),
                $sharedState,
                new Reference(MetricsStoreInterface::class),
            ]));
        $container->setDefinition(DocumentPreviewMessageHandler::class, (new Definition(DocumentPreviewMessageHandler::class))
            ->setArgument('$jobs', new Reference(DocumentPreviewJobManager::class))
            ->addTag('messenger.message_handler'));
        if ($config['features']['document_preview'] && ($documentPreviewConfig['pdf'] || $documentPreviewConfig['office'])) {
            $container->setDefinition(DocumentPreviewPlugin::class, (new Definition(DocumentPreviewPlugin::class))
                ->setArguments([new Reference(RouterInterface::class), $documentPreviewConfig['pdf'], $documentPreviewConfig['office']])
                ->addTag('sofinder.plugin'));
            $container->setDefinition(DocumentPreviewHealthCheck::class, (new Definition(DocumentPreviewHealthCheck::class))
                ->setArguments([$documentPreviewConfig['pdf'], $documentPreviewConfig['office'], $documentPreviewConfig['office_binary']])
                ->addTag('sofinder.health_check', ['priority' => 70]));
        }
        $container->setDefinition(PluginRegistry::class, (new Definition(PluginRegistry::class))
            ->setArgument('$plugins', new TaggedIteratorArgument('sofinder.plugin')));
        $container->setDefinition(FeaturePolicy::class, (new Definition(FeaturePolicy::class))
            ->setArgument('$features', $config['features']));
        $container->setDefinition(RuntimeHealthCheck::class, (new Definition(RuntimeHealthCheck::class))
            ->setArguments([
                [$config['cache_dir'], $config['quarantine_dir'], $config['chunk_dir'], $config['trash_dir'], $config['usage_dir'], dirname((string) $config['metadata_file'])],
                $assetFiles,
            ])
            ->addTag('sofinder.health_check', ['priority' => 100]));
        $container->setDefinition(StorageHealthCheck::class, (new Definition(StorageHealthCheck::class))
            ->setArguments([new Reference(ResourceRegistry::class), new Reference(MetricsStoreInterface::class)])
            ->addTag('sofinder.health_check', ['priority' => 90]));
        $container->setDefinition(ImageHealthCheck::class, (new Definition(ImageHealthCheck::class))
            ->setArguments([
                new Reference(ImageCapabilityProviderInterface::class),
                new Reference(ImageFormatRegistry::class),
                new Reference(ResourceRegistry::class),
            ])
            ->addTag('sofinder.health_check', ['priority' => 75]));
        $container->setDefinition(MaintenanceQueueHealthCheck::class, (new Definition(MaintenanceQueueHealthCheck::class))
            ->setArguments([$maintenanceConfig['mode'], $maintenanceConfig['mode'] !== 'messenger' || $dispatcher !== null, new TaggedIteratorArgument('sofinder.queue_health_provider'), new Reference(GaugeMetricsStoreInterface::class)])
            ->addTag('sofinder.health_check', ['priority' => 65]));
        $container->setDefinition(HealthManager::class, (new Definition(HealthManager::class))
            ->setArgument('$checks', new TaggedIteratorArgument('sofinder.health_check')));
        $container->setDefinition(LocalMetricsStore::class, (new Definition(LocalMetricsStore::class))
            ->setArgument('$file', rtrim((string) $config['cache_dir'], '/') . '/metrics.json'));
        $container->setAlias(MetricsStoreInterface::class, new Alias(LocalMetricsStore::class));
        $container->setAlias(GaugeMetricsStoreInterface::class, new Alias(LocalMetricsStore::class));
        $container->setDefinition(MalwareScanStatusStore::class, (new Definition(MalwareScanStatusStore::class))
            ->setArguments([
                rtrim((string) $config['cache_dir'], '/') . '/malware-scans.json',
                $malwareConfig['history_limit'],
            ]));
        $container->setAlias(MalwareScanStatusStoreInterface::class, new Alias(MalwareScanStatusStore::class));
        // Always register the adapter so runtime-resolved env(bool:...) values can
        // enable or disable scanning without making a compile-time branch on an
        // unresolved environment placeholder. Disabled adapters are no-op scanners
        // and report a ready/disabled health result.
        $container->setDefinition(ClamAvScanner::class, (new Definition(ClamAvScanner::class))
            ->setArgument('$endpoint', $malwareConfig['endpoint'])
            ->setArgument('$timeoutSeconds', $malwareConfig['timeout_seconds'])
            ->setArgument('$metrics', new Reference(MetricsStoreInterface::class))
            ->setArgument('$statusStore', new Reference(MalwareScanStatusStoreInterface::class))
            ->setArgument('$logger', new Reference(LoggerInterface::class))
            ->setArgument('$enabled', $malwareConfig['enabled'])
            ->addTag('sofinder.upload_scanner')
            ->addTag('sofinder.health_check', ['priority' => 80]));
        $clamAvReference = new Reference(ClamAvScanner::class);
        $container->setDefinition(SignedUrlManager::class, (new Definition(SignedUrlManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                new Reference(ResourceRegistry::class),
                new Reference(PathGuard::class),
                $signedUrlConfig['enabled'],
                $signedUrlConfig['secret'],
                $signedUrlConfig['default_ttl_seconds'],
                $signedUrlConfig['max_ttl_seconds'],
            ]));

        $this->controller($container, BrowserController::class, [
            new Reference(FileManager::class),
            new Reference(RouterInterface::class),
            new Reference(CsrfTokenManagerInterface::class),
            $container->getParameter('so_finder.asset_version'),
            new Reference(Theme::class),
            $config['ui'],
            new Reference(FeaturePolicy::class),
            new Reference(AuthorizationCheckerInterface::class),
            $malwareConfig['status_roles'],
            $config['picker']['allowed_origins'],
            $workspaceConfig['enabled'] ? new Reference(WorkspaceProvider::class) : null,
            $workspaceConfig['enabled'] && $workspaceConfig['option_provider_service'] !== null ? new Reference((string) $workspaceConfig['option_provider_service']) : null,
        ]);
        $this->controller($container, ApiController::class, [
            new Reference(FileManager::class),
            new Reference(CsrfGuard::class),
            new Reference(PluginRegistry::class),
            $config['image_presets'],
            new Reference(MetadataManager::class),
            new Reference(ImageCapabilityProviderInterface::class),
            $config['ui'],
            new Reference(FeaturePolicy::class),
            $signedUrlConfig['enabled'],
            $signedUrlConfig['default_ttl_seconds'],
            $signedUrlConfig['max_ttl_seconds'],
            new Reference(UploadNamePolicy::class),
            new Reference(AssetReferenceFactory::class),
            $assetCatalogConfig['enabled'],
            $variantConfig['enabled'],
            $assetCatalogConfig['alt_locales'],
            $assetSearchConfig['enabled'],
            $assetUsageConfig['enabled'],
            $assetAccessConfig['enabled'],
        ]);
        $this->controller($container, CapabilityController::class, [new Reference(CapabilityCatalog::class)]);
        $this->controller($container, ContentController::class, [
            new Reference(FileManager::class),
            new Reference(ImageFormatRegistry::class),
            new Reference(FeaturePolicy::class),
        ]);
        $this->controller($container, QuickUploadController::class, [
            new Reference(FileManager::class),
            new Reference(CsrfGuard::class),
            new Reference(ImageCapabilityProviderInterface::class),
            $config['ckeditor4']['overwrite_on_upload'],
            new Reference(UploadNamePolicy::class),
        ]);
        $this->controller($container, ChunkUploadController::class, [
            new Reference(FileManager::class),
            new Reference(ChunkUploadStoreInterface::class),
            new Reference(CsrfGuard::class),
            new Reference(MaintenanceCoordinator::class),
            new Reference(UploadNamePolicy::class),
            new Reference(AssetReferenceFactory::class),
            $workspaceConfig['enabled'] ? new Reference(WorkspaceProvider::class) : null,
        ]);
        $this->controller($container, ImageController::class, [
            new Reference(ImageManager::class),
            new Reference(CsrfGuard::class),
            new Reference(FeaturePolicy::class),
            new Reference(AssetOperationPublisher::class),
        ]);
        $this->controller($container, ArchiveController::class, [
            new Reference(ArchiveManager::class),
            new Reference(CsrfGuard::class),
            new Reference(FeaturePolicy::class),
        ]);
        $this->controller($container, MetadataController::class, [
            new Reference(MetadataManager::class),
            new Reference(CsrfGuard::class),
            new Reference(FeaturePolicy::class),
        ]);
        $this->controller($container, HealthController::class, [new Reference(HealthManager::class)]);
        $this->controller($container, LivenessController::class, []);
        $this->controller($container, MetricsController::class, [new Reference(MetricsStoreInterface::class), new Reference(HealthManager::class)]);
        $this->controller($container, SecurityStatusController::class, [
            $malwareConfig['enabled'],
            new Reference(MalwareScanStatusStoreInterface::class),
            $clamAvReference,
            new Reference(AuthorizationCheckerInterface::class),
            $malwareConfig['status_roles'],
            new Reference(FeaturePolicy::class),
            new Reference(DocumentPreviewManager::class),
            new Reference(DocumentPreviewJobManager::class),
        ]);
        $this->controller($container, DocumentPreviewController::class, [new Reference(DocumentPreviewManager::class), new Reference(FeaturePolicy::class), new Reference(DocumentPreviewJobManager::class)]);
        $this->controller($container, DocumentPreviewJobController::class, [new Reference(DocumentPreviewJobManager::class), new Reference(CsrfGuard::class), new Reference(RouterInterface::class), new Reference(FeaturePolicy::class)]);
        $this->controller($container, SignedUrlController::class, [
            new Reference(SignedUrlManager::class),
            new Reference(ContentController::class),
            new Reference(RouterInterface::class),
        ]);
        $this->controller($container, AssetController::class, [$container->getParameter('so_finder.package_dir')]);
        $this->controller($container, AssetApiController::class, [
            new Reference(FileManager::class),
            new Reference(AssetReferenceFactory::class),
            new Reference(AssetCatalogInterface::class),
            new Reference(WorkspaceProvider::class),
            new Reference(CsrfGuard::class),
            $assetCatalogConfig['enabled'],
            new Reference(AssetOperationPublisher::class),
        ]);
        $this->controller($container, AssetSearchController::class, [
            new Reference(AssetSearchProviderInterface::class),
            new Reference(WorkspaceProvider::class),
            $assetSearchConfig['enabled'],
        ]);
        $this->controller($container, AssetUsageController::class, [
            new Reference(AssetCatalogInterface::class),
            new Reference(AssetUsageStoreInterface::class),
            new Reference(WorkspaceProvider::class),
            new Reference(FileManager::class),
            new Reference(CsrfGuard::class),
            $assetUsageConfig['enabled'],
        ]);
        $container->setDefinition(AssetAccessSessionManager::class, (new Definition(AssetAccessSessionManager::class))->setArguments([
            new Reference(AssetCatalogInterface::class), new Reference(AssetAccessSessionStoreInterface::class), new Reference(WorkspaceProvider::class), new Reference(FileManager::class), new Reference(ResourceRegistry::class), $assetAccessConfig['enabled'], $assetAccessConfig['default_ttl_seconds'], $assetAccessConfig['max_ttl_seconds'], $assetAccessConfig['max_assets'],
        ]));
        $this->controller($container, AssetAccessSessionController::class, [new Reference(AssetAccessSessionManager::class), new Reference(CsrfGuard::class), new Reference(RouterInterface::class), new Reference(ContentController::class)]);

        $container->setDefinition(ExceptionSubscriber::class, (new Definition(ExceptionSubscriber::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(SecurityResponseSubscriber::class, (new Definition(SecurityResponseSubscriber::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(RequestIdSubscriber::class, (new Definition(RequestIdSubscriber::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(LocalRequestGateStore::class, (new Definition(LocalRequestGateStore::class))
            ->setArgument('$directory', rtrim((string) $config['cache_dir'], '/') . '/rate-limit'));
        $container->setAlias(RequestGateStoreInterface::class, new Alias(LocalRequestGateStore::class));
        if ($clusterConfig['state_service'] !== null) {
            $container->setAlias(AtomicStateStoreInterface::class, new Alias((string) $clusterConfig['state_service']));
            $container->setDefinition(SharedMetadataStore::class, (new Definition(SharedMetadataStore::class))
                ->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
            $container->setDefinition(SharedRequestGateStore::class, (new Definition(SharedRequestGateStore::class))
                ->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
            $container->setDefinition(SharedUsageTracker::class, (new Definition(SharedUsageTracker::class))
                ->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
            $container->setDefinition(SharedMetricsStore::class, (new Definition(SharedMetricsStore::class))
                ->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
            $container->setDefinition(SharedMalwareScanStatusStore::class, (new Definition(SharedMalwareScanStatusStore::class))
                ->setArguments([new Reference(AtomicStateStoreInterface::class), $malwareConfig['history_limit']]));
            $container->setDefinition(SharedChunkUploadStore::class, (new Definition(SharedChunkUploadStore::class))
                ->setArguments([
                    new Reference(ChunkUploadManager::class),
                    new Reference(AtomicStateStoreInterface::class),
                    new Reference(ActorProviderInterface::class),
                ]));
            $container->setDefinition(SharedAssetCatalog::class, (new Definition(SharedAssetCatalog::class))
                ->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
            $container->setAlias(MetadataStoreInterface::class, new Alias(SharedMetadataStore::class));
            $container->setAlias(RequestGateStoreInterface::class, new Alias(SharedRequestGateStore::class));
            $container->setAlias(UsageTrackerInterface::class, new Alias(SharedUsageTracker::class));
            $container->setAlias(MetricsStoreInterface::class, new Alias(SharedMetricsStore::class));
            $container->setAlias(GaugeMetricsStoreInterface::class, new Alias(SharedMetricsStore::class));
            $container->setAlias(MalwareScanStatusStoreInterface::class, new Alias(SharedMalwareScanStatusStore::class));
            if ($assetCatalogConfig['store_service'] === null) {
                $container->setAlias(AssetCatalogInterface::class, new Alias(SharedAssetCatalog::class));
            }
            if ($assetUsageConfig['store_service'] === null) {
                $container->setDefinition(SharedAssetUsageStore::class, (new Definition(SharedAssetUsageStore::class))->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
                $container->setAlias(AssetUsageStoreInterface::class, new Alias(SharedAssetUsageStore::class));
            }
            if ($assetAccessConfig['store_service'] === null) {
                $container->setDefinition(SharedAssetAccessSessionStore::class, (new Definition(SharedAssetAccessSessionStore::class))->setArgument('$state', new Reference(AtomicStateStoreInterface::class)));
                $container->setAlias(AssetAccessSessionStoreInterface::class, new Alias(SharedAssetAccessSessionStore::class));
            }
            if ($clusterConfig['chunk_upload_store_service'] === null) {
                $container->setAlias(ChunkUploadStoreInterface::class, new Alias(SharedChunkUploadStore::class));
            }
            $container->setDefinition(SharedStateHealthCheck::class, (new Definition(SharedStateHealthCheck::class))
                ->setArgument('$state', new Reference(AtomicStateStoreInterface::class))
                ->addTag('sofinder.health_check', ['priority' => 85]));
        }
        if ($assetCatalogConfig['store_service'] !== null) {
            $container->setAlias(AssetCatalogInterface::class, new Alias((string) $assetCatalogConfig['store_service']));
        }
        if ($assetUsageConfig['store_service'] !== null) {
            $container->setAlias(AssetUsageStoreInterface::class, new Alias((string) $assetUsageConfig['store_service']));
        }
        if ($assetAccessConfig['store_service'] !== null) {
            $container->setAlias(AssetAccessSessionStoreInterface::class, new Alias((string) $assetAccessConfig['store_service']));
        }
        if ($clusterConfig['chunk_upload_store_service'] !== null) {
            $container->setAlias(ChunkUploadStoreInterface::class, new Alias((string) $clusterConfig['chunk_upload_store_service']));
        }
        $container->setDefinition(RequestGate::class, (new Definition(RequestGate::class))
            ->setArguments([
                new Reference(RequestGateStoreInterface::class),
                new Reference(ActorProviderInterface::class),
                $config['limits'],
            ])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(FailureAuditSubscriber::class, (new Definition(FailureAuditSubscriber::class))
            ->setArguments([new Reference(LoggerInterface::class), new Reference(MetricsStoreInterface::class)])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(OperationAuditSubscriber::class, (new Definition(OperationAuditSubscriber::class))
            ->setArguments([
                new Reference(LoggerInterface::class),
                new Reference(RequestStack::class),
            ])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(OperationMetricsSubscriber::class, (new Definition(OperationMetricsSubscriber::class))
            ->setArgument('$metrics', new Reference(MetricsStoreInterface::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(MetadataOperationSubscriber::class, (new Definition(MetadataOperationSubscriber::class))
            ->setArguments([
                new Reference(MetadataStoreInterface::class),
                new Reference(ActorProviderInterface::class),
                new Reference(LoggerInterface::class),
            ])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(AssetCatalogSubscriber::class, (new Definition(AssetCatalogSubscriber::class))
            ->setArguments([new Reference(AssetCatalogInterface::class), new Reference(WorkspaceProvider::class), $assetCatalogConfig['enabled']])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(VersionedOperationSubscriber::class, (new Definition(VersionedOperationSubscriber::class))
            ->setArguments([new Reference(EventDispatcherInterface::class), new Reference(WorkspaceProvider::class), new Reference(AssetCatalogInterface::class), new Reference(RequestStack::class), $assetCatalogConfig['enabled']])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(PluginValidateCommand::class, (new Definition(PluginValidateCommand::class))
            ->setArgument('$plugins', new Reference(PluginRegistry::class))
            ->addTag('console.command'));
        $container->setDefinition(AssetMigrateCommand::class, (new Definition(AssetMigrateCommand::class))->setArguments([new Reference(ResourceRegistry::class), new Reference(AssetCatalogInterface::class)])->addTag('console.command'));
        $container->setDefinition(TrashCleanupCommand::class, (new Definition(TrashCleanupCommand::class))
            ->setArgument('$runner', new Reference(MaintenanceRunner::class))
            ->addTag('console.command'));
        $container->setDefinition(SecurityAuditCommand::class, (new Definition(SecurityAuditCommand::class))
            ->setArguments([
                new Reference(ResourceRegistry::class),
                '%kernel.project_dir%',
                $config['quarantine_dir'],
                $config['chunk_dir'],
                $config['trash_dir'],
                new Reference(ImageCapabilityProviderInterface::class),
                new Reference(ImageFormatRegistry::class),
                $malwareConfig['enabled'],
                $clamAvReference,
                $clusterConfig['state_service'] !== null,
                $clusterConfig['shared_preview_cache'],
                $documentPreviewConfig['mode'],
                $documentPreviewConfig['office'],
                new TaggedIteratorArgument('sofinder.workspace_storage_audit_provider'),
            ])
            ->addTag('console.command'));
        $container->setDefinition(ImageCapabilitiesCommand::class, (new Definition(ImageCapabilitiesCommand::class))
            ->setArguments([
                new Reference(ImageCapabilityProviderInterface::class),
                new Reference(ImageFormatRegistry::class),
                new Reference(ResourceRegistry::class),
            ])
            ->addTag('console.command'));
        $container->setDefinition(UsageRecalculateCommand::class, (new Definition(UsageRecalculateCommand::class))
            ->setArguments([
                new Reference(ResourceRegistry::class),
                new Reference(UsageTrackerInterface::class),
                new Reference(MaintenanceRunner::class),
            ])
            ->addTag('console.command'));
        $container->setDefinition(UploadCleanupCommand::class, (new Definition(UploadCleanupCommand::class))
            ->setArgument('$runner', new Reference(MaintenanceRunner::class))
            ->addTag('console.command'));
        $container->setDefinition(MaintenanceStatusCommand::class, (new Definition(MaintenanceStatusCommand::class))
            ->setArgument('$runner', new Reference(MaintenanceRunner::class))
            ->addTag('console.command'));
        $container->setDefinition(CacheCleanupCommand::class, (new Definition(CacheCleanupCommand::class))
            ->setArgument('$cleaner', new Reference(CacheCleaner::class))
            ->addTag('console.command'));
        $container->setDefinition(MetadataRepairCommand::class, (new Definition(MetadataRepairCommand::class))
            ->setArgument('$repairer', new Reference(MetadataRepairer::class))
            ->addTag('console.command'));
    }

    /** @param list<mixed> $arguments */
    private function controller(ContainerBuilder $container, string $class, array $arguments): void
    {
        $container->setDefinition($class, (new Definition($class))
            ->setArguments($arguments)
            ->setPublic(true)
            ->addTag('controller.service_arguments'));
    }
}
