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
use Symfony\Component\DependencyInjection\ContainerBuilder;

final class DependencyInjectionTest extends TestCase
{
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
