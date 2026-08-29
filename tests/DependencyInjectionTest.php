<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\DependencyInjection\SoFinderExtension;
use SohoPHP\SoFinder\Contract\AtomicStateStoreInterface;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Contract\RequestGateStoreInterface;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Health\SharedStateHealthCheck;
use SohoPHP\SoFinder\Http\Action\CreateFolderAction;
use SohoPHP\SoFinder\Http\Action\ChecksumAction;
use SohoPHP\SoFinder\Http\Action\CancelChunkAction;
use SohoPHP\SoFinder\Http\Action\ChunkStatusAction;
use SohoPHP\SoFinder\Http\Action\ChunkUploadAction;
use SohoPHP\SoFinder\Http\Action\BatchAction;
use SohoPHP\SoFinder\Http\Action\BatchRenameAction;
use SohoPHP\SoFinder\Http\Action\AssetSearchAction;
use SohoPHP\SoFinder\Http\Action\ArchiveDownloadAction;
use SohoPHP\SoFinder\Http\Action\AssetDeleteCheckAction;
use SohoPHP\SoFinder\Http\Action\AssetGetAction;
use SohoPHP\SoFinder\Http\Action\AssetResolveAction;
use SohoPHP\SoFinder\Http\Action\AssetUpdateAction;
use SohoPHP\SoFinder\Http\Action\AssetUsageListAction;
use SohoPHP\SoFinder\Http\Action\AssetUsagePutAction;
use SohoPHP\SoFinder\Http\Action\AssetUsageRemoveAction;
use SohoPHP\SoFinder\Http\Action\AssetSessionContentAction;
use SohoPHP\SoFinder\Http\Action\AssetSessionCreateAction;
use SohoPHP\SoFinder\Http\Action\AssetSessionRevokeAction;
use SohoPHP\SoFinder\Http\Action\DeleteAction;
use SohoPHP\SoFinder\Http\Action\DownloadAction;
use SohoPHP\SoFinder\Http\Action\ContentAction;
use SohoPHP\SoFinder\Http\Action\DeleteTrashAction;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewJobCreateAction;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewJobStatusAction;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewAction;
use SohoPHP\SoFinder\Http\Action\ImageInfoAction;
use SohoPHP\SoFinder\Http\Action\FrontendAssetAction;
use SohoPHP\SoFinder\Http\Action\ImageBatchAction;
use SohoPHP\SoFinder\Http\Action\ImageEditAction;
use SohoPHP\SoFinder\Http\Action\ImageThumbnailAction;
use SohoPHP\SoFinder\Http\Action\ImageVariantAction;
use SohoPHP\SoFinder\Http\Action\MetadataGetAction;
use SohoPHP\SoFinder\Http\Action\MetadataUpdateAction;
use SohoPHP\SoFinder\Http\Action\MetricsAction;
use SohoPHP\SoFinder\Http\Action\RenameAction;
use SohoPHP\SoFinder\Http\Action\QuickUploadAction;
use SohoPHP\SoFinder\Http\Action\RestoreTrashAction;
use SohoPHP\SoFinder\Http\Action\SignedUrlIssueAction;
use SohoPHP\SoFinder\Http\Action\SignedContentAction;
use SohoPHP\SoFinder\Http\Action\SecurityStatusAction;
use SohoPHP\SoFinder\Http\Action\TrashListAction;
use SohoPHP\SoFinder\Http\Action\TextPreviewAction;
use SohoPHP\SoFinder\Http\Action\UploadAction;
use SohoPHP\SoFinder\Http\BatchMutationActions;
use SohoPHP\SoFinder\Http\AssetUsageActions;
use SohoPHP\SoFinder\Http\AssetUsageService;
use SohoPHP\SoFinder\Http\AssetActions;
use SohoPHP\SoFinder\Http\AssetAccessSessionActions;
use SohoPHP\SoFinder\Http\AssetService;
use SohoPHP\SoFinder\Asset\AssetReferenceBuilder;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Http\ContentReadActions;
use SohoPHP\SoFinder\Http\ContentStreamActions;
use SohoPHP\SoFinder\Http\EntryStreamResponseBuilder;
use SohoPHP\SoFinder\Http\CachedFileResponseBuilder;
use SohoPHP\SoFinder\Http\ImageStreamActions;
use SohoPHP\SoFinder\Http\ImageMutationActions;
use SohoPHP\SoFinder\Http\ImageMutationService;
use SohoPHP\SoFinder\Http\DocumentPreviewJobActions;
use SohoPHP\SoFinder\Http\DocumentPreviewJobService;
use SohoPHP\SoFinder\Http\ChunkUploadActions;
use SohoPHP\SoFinder\Http\FileMutationActions;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\CompatibleUploadGuard;
use SohoPHP\SoFinder\Http\MetadataActions;
use SohoPHP\SoFinder\Http\MetadataPayload;
use SohoPHP\SoFinder\Http\TrashActions;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use SohoPHP\SoFinder\State\SharedMetadataStore;
use SohoPHP\SoFinder\State\SharedRequestGateStore;
use SohoPHP\SoFinder\State\SharedUsageTracker;
use SohoPHP\SoFinder\Observability\SharedMetricsStore;
use SohoPHP\SoFinder\Upload\SharedChunkUploadStore;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Asset\SharedAssetCatalog;
use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Contract\AssetSearchProviderInterface;
use SohoPHP\SoFinder\Contract\AssetUsageStoreInterface;
use SohoPHP\SoFinder\Contract\AssetAccessSessionStoreInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use SohoPHP\SoFinder\Image\WatermarkFontResolver;

final class DependencyInjectionTest extends TestCase
{
    public function testWatermarkFontResolverUsesCacheAndAutoDownloadByDefault(): void
    {
        $cache = sys_get_temp_dir() . '/sofinder-di-font-cache';
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'cache_dir' => $cache,
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        $definition = $container->getDefinition(WatermarkFontResolver::class);
        self::assertNull($definition->getArgument(0));
        self::assertSame($cache, $definition->getArgument(1));
        self::assertTrue($definition->getArgument(2));
    }

    public function testEnabledMalwareScanningRegistersUploadAndHealthServices(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'cache_dir' => sys_get_temp_dir() . '/sofinder-di-cache',
            'malware_scanning' => [
                'enabled' => true,
                'endpoint' => 'tcp://127.0.0.1:3310',
                'timeout_seconds' => 3,
            ],
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertTrue($container->hasDefinition(ClamAvScanner::class));
        $definition = $container->getDefinition(ClamAvScanner::class);
        self::assertTrue($definition->hasTag('sofinder.upload_scanner'));
        self::assertSame(80, $definition->getTag('sofinder.health_check')[0]['priority']);
        self::assertSame('tcp://127.0.0.1:3310', $definition->getArgument('$endpoint'));
        self::assertTrue($definition->getArgument('$enabled'));
    }

    public function testDisabledMalwareScanningRegistersANoOpScanner(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertTrue($container->hasDefinition(ClamAvScanner::class));
        self::assertFalse($container->getDefinition(ClamAvScanner::class)->getArgument('$enabled'));
    }

    public function testClusterServicesReplaceLocalStateAndChunkAliases(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'cluster' => [
                'state_service' => 'app.sofinder_state',
                'chunk_upload_store_service' => 'app.sofinder_chunks',
            ],
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertSame('app.sofinder_state', (string) $container->getAlias(AtomicStateStoreInterface::class));
        self::assertSame(SharedMetadataStore::class, (string) $container->getAlias(MetadataStoreInterface::class));
        self::assertSame(SharedRequestGateStore::class, (string) $container->getAlias(RequestGateStoreInterface::class));
        self::assertSame(SharedUsageTracker::class, (string) $container->getAlias(UsageTrackerInterface::class));
        self::assertSame(SharedMetricsStore::class, (string) $container->getAlias(MetricsStoreInterface::class));
        self::assertSame('app.sofinder_chunks', (string) $container->getAlias(ChunkUploadStoreInterface::class));
        self::assertTrue($container->hasDefinition(SharedStateHealthCheck::class));
        self::assertSame(85, $container->getDefinition(SharedStateHealthCheck::class)->getTag('sofinder.health_check')[0]['priority']);
    }

    public function testClusterStateProvidesOfficialSharedChunkCoordinationByDefault(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'cluster' => ['state_service' => 'app.sofinder_state'],
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertSame(SharedChunkUploadStore::class, (string) $container->getAlias(ChunkUploadStoreInterface::class));
        self::assertSame(SharedAssetCatalog::class, (string) $container->getAlias(AssetCatalogInterface::class));
    }

    public function testOptionalAssetWorkspaceAndVariantServicesUseConfiguredContracts(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'asset_catalog' => ['enabled' => true, 'store_service' => 'app.asset_catalog'],
            'asset_search' => ['enabled' => true, 'provider_service' => 'app.asset_search'],
            'asset_usage' => ['enabled' => true, 'store_service' => 'app.asset_usage'],
            'asset_access_sessions' => ['enabled' => true, 'store_service' => 'app.asset_access_sessions'],
            'workspaces' => ['enabled' => true, 'default' => 'main', 'resolver_service' => 'app.workspace_resolver'],
            'image_variants' => ['enabled' => true, 'widths' => [320, 640], 'formats' => ['original'], 'quality' => 80],
            'resources' => ['Images' => ['root' => sys_get_temp_dir() . '/sofinder-di-images']],
        ]], $container);

        self::assertSame('app.asset_catalog', (string) $container->getAlias(AssetCatalogInterface::class));
        self::assertSame('app.asset_search', (string) $container->getAlias(AssetSearchProviderInterface::class));
        self::assertSame('app.asset_usage', (string) $container->getAlias(AssetUsageStoreInterface::class));
        self::assertSame('app.asset_access_sessions', (string) $container->getAlias(AssetAccessSessionStoreInterface::class));
        self::assertSame('app.workspace_resolver', (string) $container->getAlias(WorkspaceResolverInterface::class));
        self::assertTrue($container->getDefinition(\SohoPHP\SoFinder\Image\ImageManager::class)->getArgument(7));
        self::assertSame([320, 640], $container->getDefinition(\SohoPHP\SoFinder\Image\ImageManager::class)->getArgument(8));
    }

    public function testUploadNamingPolicyIsSharedByEveryUploadController(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'uploads' => ['naming' => ['lowercase_extensions' => false]],
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertFalse($container->getDefinition(UploadNamePolicy::class)->getArgument(0));
        self::assertSame('Manual.PDF', (new UploadNamePolicy(false))->normalize('Manual.PDF'));
    }

    public function testLegacyUiUploadNamingKeyRemainsCompatible(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'ui' => ['lowercase_upload_extensions' => false],
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertFalse($container->getDefinition(UploadNamePolicy::class)->getArgument(0));
    }

    public function testSymfonyBridgeRegistersSharedMutationActions(): void
    {
        $container = new ContainerBuilder();
        (new SoFinderExtension())->load([[
            'resources' => ['Files' => ['root' => sys_get_temp_dir() . '/sofinder-di-files']],
        ]], $container);

        self::assertTrue($container->hasDefinition(MutationGuard::class));
        self::assertTrue($container->hasDefinition(CompatibleUploadGuard::class));
        self::assertTrue($container->hasDefinition(QuickUploadAction::class));
        self::assertTrue($container->hasDefinition(CreateFolderAction::class));
        self::assertTrue($container->hasDefinition(RenameAction::class));
        self::assertTrue($container->hasDefinition(DeleteAction::class));
        self::assertTrue($container->hasDefinition('sofinder.http.action.copy'));
        self::assertTrue($container->hasDefinition('sofinder.http.action.move'));
        self::assertTrue($container->hasDefinition(FileMutationActions::class));
        self::assertTrue($container->hasDefinition(BatchAction::class));
        self::assertTrue($container->hasDefinition(BatchRenameAction::class));
        self::assertTrue($container->hasDefinition(BatchMutationActions::class));
        self::assertTrue($container->hasDefinition(TrashListAction::class));
        self::assertTrue($container->hasDefinition(RestoreTrashAction::class));
        self::assertTrue($container->hasDefinition(DeleteTrashAction::class));
        self::assertTrue($container->hasDefinition(TrashActions::class));
        self::assertTrue($container->hasDefinition(MetadataPayload::class));
        self::assertTrue($container->hasDefinition(MetadataGetAction::class));
        self::assertTrue($container->hasDefinition(MetadataUpdateAction::class));
        self::assertTrue($container->hasDefinition(MetadataActions::class));
        self::assertTrue($container->hasDefinition(MetricsAction::class));
        self::assertTrue($container->hasDefinition(ArchiveDownloadAction::class));
        self::assertTrue($container->hasDefinition(ChecksumAction::class));
        self::assertTrue($container->hasDefinition(TextPreviewAction::class));
        self::assertTrue($container->hasDefinition(ContentReadActions::class));
        self::assertTrue($container->hasDefinition(DownloadAction::class));
        self::assertTrue($container->hasDefinition(ContentAction::class));
        self::assertTrue($container->hasDefinition(ContentStreamActions::class));
        self::assertTrue($container->hasDefinition(UploadAction::class));
        self::assertTrue($container->hasDefinition(EntryStreamResponseBuilder::class));
        self::assertTrue($container->hasDefinition(CachedFileResponseBuilder::class));
        self::assertTrue($container->hasDefinition(FrontendAssetAction::class));
        self::assertTrue($container->hasDefinition(ChunkStatusAction::class));
        self::assertTrue($container->hasDefinition(ChunkUploadAction::class));
        self::assertTrue($container->hasDefinition(CancelChunkAction::class));
        self::assertTrue($container->hasDefinition(ChunkUploadActions::class));
        self::assertTrue($container->hasDefinition(ImageInfoAction::class));
        self::assertTrue($container->hasDefinition(ImageThumbnailAction::class));
        self::assertTrue($container->hasDefinition(ImageVariantAction::class));
        self::assertTrue($container->hasDefinition(ImageStreamActions::class));
        self::assertTrue($container->hasDefinition(ImageMutationService::class));
        self::assertTrue($container->hasDefinition(ImageEditAction::class));
        self::assertTrue($container->hasDefinition(ImageBatchAction::class));
        self::assertTrue($container->hasDefinition(ImageMutationActions::class));
        self::assertTrue($container->hasDefinition(AssetSearchAction::class));
        self::assertTrue($container->hasDefinition(AssetUsageService::class));
        self::assertTrue($container->hasDefinition(AssetUsageListAction::class));
        self::assertTrue($container->hasDefinition(AssetUsagePutAction::class));
        self::assertTrue($container->hasDefinition(AssetUsageRemoveAction::class));
        self::assertTrue($container->hasDefinition(AssetDeleteCheckAction::class));
        self::assertTrue($container->hasDefinition(AssetUsageActions::class));
        self::assertTrue($container->hasDefinition(AssetReferenceBuilder::class));
        self::assertTrue($container->hasAlias(EndpointUrlGeneratorInterface::class));
        self::assertTrue($container->hasDefinition(AssetService::class));
        self::assertTrue($container->hasDefinition(AssetResolveAction::class));
        self::assertTrue($container->hasDefinition(AssetGetAction::class));
        self::assertTrue($container->hasDefinition(AssetUpdateAction::class));
        self::assertTrue($container->hasDefinition(AssetActions::class));
        self::assertTrue($container->hasDefinition(AssetSessionCreateAction::class));
        self::assertTrue($container->hasDefinition(AssetSessionRevokeAction::class));
        self::assertTrue($container->hasDefinition(AssetSessionContentAction::class));
        self::assertTrue($container->hasDefinition(AssetAccessSessionActions::class));
        self::assertTrue($container->hasDefinition(DocumentPreviewJobService::class));
        self::assertTrue($container->hasDefinition(DocumentPreviewJobCreateAction::class));
        self::assertTrue($container->hasDefinition(DocumentPreviewJobStatusAction::class));
        self::assertTrue($container->hasDefinition(DocumentPreviewJobActions::class));
        self::assertTrue($container->hasDefinition(SignedUrlIssueAction::class));
        self::assertTrue($container->hasDefinition(SignedContentAction::class));
        self::assertTrue($container->hasDefinition(DocumentPreviewAction::class));
        self::assertTrue($container->hasDefinition(SecurityStatusAction::class));
    }
}
