<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\State\PdoAtomicStateStore;
use SohoPHP\SoFinder\State\RedisAtomicStateStore;
use SohoPHP\SoFinder\State\SharedMetadataStore;
use SohoPHP\SoFinder\State\SharedRequestGateStore;
use SohoPHP\SoFinder\State\SharedUsageTracker;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;

final class SharedStateTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        if (!in_array('sqlite', \PDO::getAvailableDrivers(), true)) self::markTestSkipped('pdo_sqlite is not installed.');
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-state-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        if (!is_dir($this->directory)) return;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $file) $file->isDir() ? @rmdir($file->getPathname()) : @unlink($file->getPathname());
        @rmdir($this->directory);
    }

    public function testPdoStorePersistsAtomicRequestGateMutations(): void
    {
        $store = new PdoAtomicStateStore(new \PDO('sqlite:' . $this->directory . '/state.sqlite'));
        $gate = new SharedRequestGateStore($store);
        $gate->mutate('upload', 'actor-1', static fn (array $state): array => ['count' => (int) ($state['count'] ?? 0) + 1]);
        $state = $gate->mutate('upload', 'actor-1', static fn (array $state): array => ['count' => (int) ($state['count'] ?? 0) + 1]);

        self::assertSame(2, $state['count']);
    }

    public function testSharedMetadataKeepsActorStateIsolatedAndMovesSubtrees(): void
    {
        $metadata = new SharedMetadataStore(new PdoAtomicStateStore(new \PDO('sqlite:' . $this->directory . '/metadata.sqlite')));
        $metadata->setFavorite('actor-1', 'Files', 'old/report.pdf', true);
        $metadata->setTags('actor-1', 'Files', 'old/report.pdf', ['report']);
        $metadata->touch('actor-1', 'Files', 'old/report.pdf', 123);
        $metadata->movePath('actor-1', 'Files', 'old', 'new');

        self::assertSame(['new/report.pdf'], $metadata->get('actor-1', 'Files')['favorites']);
        self::assertSame(['report'], $metadata->get('actor-1', 'Files')['tags']['new/report.pdf']);
        self::assertSame([], $metadata->get('actor-2', 'Files')['favorites']);
    }

    public function testSharedUsageStoresExactMutationDelta(): void
    {
        $storage = $this->directory . '/storage';
        mkdir($storage, 0775);
        file_put_contents($storage . '/existing.txt', '1234');
        $resource = new ResourceStorage(new ResourceType('Files', $storage, '/files'), new LocalStorageAdapter($storage, '/files'));
        $usage = new SharedUsageTracker(new PdoAtomicStateStore(new \PDO('sqlite:' . $this->directory . '/usage.sqlite')));

        self::assertSame(4, $usage->usage($resource));
        self::assertSame('done', $usage->mutate($resource, static fn (int $current): array => ['value' => 'done', 'delta' => 6]));
        self::assertSame(10, $usage->usage($resource));
        self::assertSame(4, $usage->recalculate($resource));
    }

    public function testRedisStorePersistsLockedMutationsWhenAvailable(): void
    {
        if (!class_exists(\Redis::class)) {
            self::markTestSkipped('ext-redis is not installed.');
        }
        $redis = new \Redis();
        try {
            if (!$redis->connect('127.0.0.1', 6379, 0.2)) {
                self::markTestSkipped('A local Redis server is not available.');
            }
        } catch (\RedisException) {
            self::markTestSkipped('A local Redis server is not available.');
        }

        $prefix = 'sofinder-test-' . bin2hex(random_bytes(8)) . ':';
        $stateKey = $prefix . 'integration:' . hash('sha256', 'actor');
        try {
            $store = new RedisAtomicStateStore($redis, $prefix);
            $store->mutate('integration', 'actor', static fn (array $state): array => ['count' => (int) ($state['count'] ?? 0) + 1]);
            $state = $store->mutate('integration', 'actor', static fn (array $state): array => ['count' => (int) ($state['count'] ?? 0) + 1]);

            self::assertSame(['count' => 2], $state);
            self::assertSame(['count' => 2], $store->get('integration', 'actor'));
        } finally {
            $redis->del($stateKey, $stateKey . ':lock');
            $redis->close();
        }
    }
}
