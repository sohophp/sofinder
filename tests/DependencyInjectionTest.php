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
}
