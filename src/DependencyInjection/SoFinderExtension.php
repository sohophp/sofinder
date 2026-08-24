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
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Contract\FileInspectorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Contract\RecycleBinInterface;
use SohoPHP\SoFinder\Contract\RequestGateStoreInterface;
use SohoPHP\SoFinder\Contract\StorageAdapterFactoryInterface;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\ArchiveController;
use SohoPHP\SoFinder\Http\AssetController;
use SohoPHP\SoFinder\Http\BrowserController;
use SohoPHP\SoFinder\Http\ChunkUploadController;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\ExceptionSubscriber;
use SohoPHP\SoFinder\Http\FailureAuditSubscriber;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\MetadataController;
use SohoPHP\SoFinder\Http\QuickUploadController;
use SohoPHP\SoFinder\Http\SecurityResponseSubscriber;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\HybridImageProcessor;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Maintenance\MaintenanceCoordinator;
use SohoPHP\SoFinder\Maintenance\MaintenanceMessageHandler;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MessengerMaintenanceDispatcher;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\UploadPipeline;
use SohoPHP\SoFinder\Security\RequestGate;
use SohoPHP\SoFinder\Security\LocalRequestGateStore;
use SohoPHP\SoFinder\Storage\LocalStorageAdapterFactory;
use SohoPHP\SoFinder\Storage\StoragePaginator;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\OperationAuditSubscriber;
use SohoPHP\SoFinder\Symfony\MetadataOperationSubscriber;
use SohoPHP\SoFinder\Symfony\SymfonyActorProvider;
use SohoPHP\SoFinder\Symfony\ResourceRegistryFactory;
use SohoPHP\SoFinder\Symfony\SymfonyAuthorization;
use SohoPHP\SoFinder\Symfony\SymfonyEntryUrlGenerator;
use SohoPHP\SoFinder\Trash\TrashManager;
use SohoPHP\SoFinder\Usage\PersistentUsageTracker;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;
use SohoPHP\SoFinder\Value\Theme;
use SohoPHP\SoFinder\Value\ImageProcessingLimits;
use Symfony\Component\DependencyInjection\Alias;
use Symfony\Component\DependencyInjection\ContainerBuilder;
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
        $maintenanceConfig = $config['maintenance'];
        if ($maintenanceConfig['mode'] === 'messenger' && !interface_exists('Symfony\\Component\\Messenger\\MessageBusInterface')) {
            throw new \InvalidArgumentException('SoFinder maintenance.mode is messenger, but symfony/messenger is not installed.');
        }
        $container->registerForAutoconfiguration(PluginInterface::class)->addTag('sofinder.plugin');
        $container->registerForAutoconfiguration(StorageAdapterFactoryInterface::class)->addTag('sofinder.storage_factory');
        $container->registerForAutoconfiguration(EntryUrlContextProviderInterface::class)->addTag('sofinder.entry_url_context_provider');
        $packageDir = dirname(__DIR__, 2);
        $container->setParameter('so_finder.package_dir', $packageDir);
        $assetFiles = [$packageDir . '/dist/sofinder.js', $packageDir . '/dist/sofinder.css'];
        $assetFingerprint = hash_init('sha256');
        foreach ($assetFiles as $assetFile) {
            if (is_file($assetFile)) {
                hash_update_file($assetFingerprint, $assetFile);
            }
        }
        $container->setParameter('so_finder.asset_version', substr(hash_final($assetFingerprint), 0, 12));

        $container->setDefinition(PathGuard::class, new Definition(PathGuard::class));
        $container->setDefinition(LocalStorageAdapterFactory::class, (new Definition(LocalStorageAdapterFactory::class))
            ->setArgument('$pathGuard', new Reference(PathGuard::class))
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
        $container->setDefinition(PersistentUsageTracker::class, (new Definition(PersistentUsageTracker::class))
            ->setArgument('$directory', $config['usage_dir']));
        $container->setAlias(UsageTrackerInterface::class, new Alias(PersistentUsageTracker::class));
        $container->setDefinition(JsonMetadataStore::class, (new Definition(JsonMetadataStore::class))
            ->setArgument('$file', $config['metadata_file']));
        $container->setAlias(MetadataStoreInterface::class, new Alias(JsonMetadataStore::class));
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
            ->setArgument('$formats', new Reference(ImageFormatRegistry::class)));
        $container->setDefinition(ImagickImageProcessor::class, (new Definition(ImagickImageProcessor::class))
            ->setArguments([new Reference(ImageFormatRegistry::class), new Reference(ImageProcessingLimits::class)]));
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
            ]));
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
            ]));
        $container->setDefinition(ImageManager::class, (new Definition(ImageManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                new Reference(ImageProcessorInterface::class),
                $config['cache_dir'],
                $config['image_presets'],
                new Reference(ImageFormatRegistry::class),
            ]));
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
            ]));
        $container->setDefinition(Theme::class, (new Definition(Theme::class))->setArgument('$values', $config['theme']));
        $container->setDefinition(PluginRegistry::class, (new Definition(PluginRegistry::class))
            ->setArgument('$plugins', new TaggedIteratorArgument('sofinder.plugin')));

        $this->controller($container, BrowserController::class, [
            new Reference(FileManager::class),
            new Reference(RouterInterface::class),
            new Reference(CsrfTokenManagerInterface::class),
            $container->getParameter('so_finder.asset_version'),
            new Reference(Theme::class),
            $config['ui'],
        ]);
        $this->controller($container, ApiController::class, [
            new Reference(FileManager::class),
            new Reference(CsrfGuard::class),
            new Reference(PluginRegistry::class),
            $config['image_presets'],
            new Reference(MetadataManager::class),
            new Reference(ImageCapabilityProviderInterface::class),
            $config['ui'],
        ]);
        $this->controller($container, ContentController::class, [
            new Reference(FileManager::class),
            new Reference(ImageFormatRegistry::class),
        ]);
        $this->controller($container, QuickUploadController::class, [
            new Reference(FileManager::class),
            new Reference(CsrfGuard::class),
            new Reference(ImageCapabilityProviderInterface::class),
        ]);
        $this->controller($container, ChunkUploadController::class, [
            new Reference(FileManager::class),
            new Reference(ChunkUploadStoreInterface::class),
            new Reference(CsrfGuard::class),
            new Reference(MaintenanceCoordinator::class),
        ]);
        $this->controller($container, ImageController::class, [
            new Reference(ImageManager::class),
            new Reference(CsrfGuard::class),
        ]);
        $this->controller($container, ArchiveController::class, [
            new Reference(ArchiveManager::class),
            new Reference(CsrfGuard::class),
        ]);
        $this->controller($container, MetadataController::class, [
            new Reference(MetadataManager::class),
            new Reference(CsrfGuard::class),
        ]);
        $this->controller($container, AssetController::class, [$container->getParameter('so_finder.package_dir')]);

        $container->setDefinition(ExceptionSubscriber::class, (new Definition(ExceptionSubscriber::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(SecurityResponseSubscriber::class, (new Definition(SecurityResponseSubscriber::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(LocalRequestGateStore::class, (new Definition(LocalRequestGateStore::class))
            ->setArgument('$directory', rtrim((string) $config['cache_dir'], '/') . '/rate-limit'));
        $container->setAlias(RequestGateStoreInterface::class, new Alias(LocalRequestGateStore::class));
        $container->setDefinition(RequestGate::class, (new Definition(RequestGate::class))
            ->setArguments([
                new Reference(RequestGateStoreInterface::class),
                new Reference(ActorProviderInterface::class),
                $config['limits'],
            ])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(FailureAuditSubscriber::class, (new Definition(FailureAuditSubscriber::class))
            ->setArgument('$logger', new Reference(LoggerInterface::class))
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(OperationAuditSubscriber::class, (new Definition(OperationAuditSubscriber::class))
            ->setArguments([
                new Reference(LoggerInterface::class),
                new Reference(RequestStack::class),
            ])
            ->addTag('kernel.event_subscriber'));
        $container->setDefinition(MetadataOperationSubscriber::class, (new Definition(MetadataOperationSubscriber::class))
            ->setArguments([
                new Reference(MetadataStoreInterface::class),
                new Reference(ActorProviderInterface::class),
                new Reference(LoggerInterface::class),
            ])
            ->addTag('kernel.event_subscriber'));
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
