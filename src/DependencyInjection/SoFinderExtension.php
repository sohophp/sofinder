<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\DependencyInjection;

use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Command\SecurityAuditCommand;
use SohoPHP\SoFinder\Command\TrashCleanupCommand;
use SohoPHP\SoFinder\Command\UsageRecalculateCommand;
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Contract\FileInspectorInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\ArchiveController;
use SohoPHP\SoFinder\Http\AssetController;
use SohoPHP\SoFinder\Http\BrowserController;
use SohoPHP\SoFinder\Http\ChunkUploadController;
use SohoPHP\SoFinder\Http\ExceptionSubscriber;
use SohoPHP\SoFinder\Http\FailureAuditSubscriber;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\MetadataController;
use SohoPHP\SoFinder\Http\QuickUploadController;
use SohoPHP\SoFinder\Http\SecurityResponseSubscriber;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\UploadPipeline;
use SohoPHP\SoFinder\Security\RequestGate;
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
        $container->setParameter('so_finder.resources', $config['resources']);
        $container->setParameter('so_finder.cache_dir', $config['cache_dir']);
        $container->setParameter('so_finder.metadata_file', $config['metadata_file']);
        $container->setParameter('so_finder.quarantine_dir', $config['quarantine_dir']);
        $container->setParameter('so_finder.chunk_dir', $config['chunk_dir']);
        $container->setParameter('so_finder.usage_dir', $config['usage_dir']);
        $container->setParameter('so_finder.trash_dir', $config['trash_dir']);
        $container->registerForAutoconfiguration(PluginInterface::class)->addTag('sofinder.plugin');
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
        $container->setDefinition(ResourceRegistryFactory::class, (new Definition(ResourceRegistryFactory::class))
            ->setArgument('$pathGuard', new Reference(PathGuard::class))
            ->setArgument('$requestStack', new Reference(RequestStack::class)));
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
        $container->setDefinition(GdImageProcessor::class, new Definition(GdImageProcessor::class));
        $container->setAlias(ImageProcessorInterface::class, new Alias(GdImageProcessor::class));
        $container->setDefinition(DefaultFileInspector::class, (new Definition(DefaultFileInspector::class))
            ->setArgument('$images', new Reference(ImageProcessorInterface::class)));
        $container->setAlias(FileInspectorInterface::class, new Alias(DefaultFileInspector::class));
        $container->setDefinition(SymfonyEntryUrlGenerator::class, (new Definition(SymfonyEntryUrlGenerator::class))
            ->setArgument('$router', new Reference(RouterInterface::class)));
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
        $container->setDefinition(ChunkUploadManager::class, (new Definition(ChunkUploadManager::class))
            ->setArguments([
                $config['chunk_dir'],
                new Reference(ActorProviderInterface::class),
                $config['chunk_size'],
                $config['max_upload_chunks'],
            ]));
        $container->setDefinition(FileManager::class, (new Definition(FileManager::class))
            ->setArguments([
                new Reference(ResourceRegistry::class),
                new Reference(AuthorizationInterface::class),
                new Reference(EventDispatcherInterface::class),
                new Reference(PathGuard::class),
                new Reference(UploadPipeline::class),
                new Reference(EntryUrlGeneratorInterface::class),
                new Reference(TrashManager::class),
                new Reference(UsageTrackerInterface::class),
            ]));
        $container->setDefinition(ImageManager::class, (new Definition(ImageManager::class))
            ->setArguments([
                new Reference(FileManager::class),
                new Reference(ImageProcessorInterface::class),
                $config['cache_dir'],
                $config['image_presets'],
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
        ]);
        $this->controller($container, QuickUploadController::class, [
            new Reference(FileManager::class),
            new Reference(CsrfGuard::class),
        ]);
        $this->controller($container, ChunkUploadController::class, [
            new Reference(FileManager::class),
            new Reference(ChunkUploadManager::class),
            new Reference(CsrfGuard::class),
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
        $container->setDefinition(RequestGate::class, (new Definition(RequestGate::class))
            ->setArguments([
                rtrim((string) $config['cache_dir'], '/') . '/rate-limit',
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
            ->setArgument('$trash', new Reference(TrashManager::class))
            ->addTag('console.command'));
        $container->setDefinition(SecurityAuditCommand::class, (new Definition(SecurityAuditCommand::class))
            ->setArguments([
                new Reference(ResourceRegistry::class),
                '%kernel.project_dir%',
                $config['quarantine_dir'],
                $config['chunk_dir'],
                $config['trash_dir'],
            ])
            ->addTag('console.command'));
        $container->setDefinition(UsageRecalculateCommand::class, (new Definition(UsageRecalculateCommand::class))
            ->setArguments([
                new Reference(ResourceRegistry::class),
                new Reference(UsageTrackerInterface::class),
            ])
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
