<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Observability\LocalMetricsStore;
use SohoPHP\SoFinder\State\PdoAtomicStateStore;
use SohoPHP\SoFinder\State\RedisAtomicStateStore;

final class SharedStateConcurrencyTest extends TestCase
{
    /** @var list<string> */
    private array $paths = [];

    protected function tearDown(): void
    {
        foreach ($this->paths as $path) {
            @unlink($path);
        }
    }

    public function testSqliteMutationsFromFourProcessesDoNotLoseUpdates(): void
    {
        $this->requireForking();
        if (!in_array('sqlite', \PDO::getAvailableDrivers(), true)) {
            self::markTestSkipped('pdo_sqlite is not installed.');
        }
        $database = sys_get_temp_dir() . '/sofinder-concurrency-' . bin2hex(random_bytes(8)) . '.sqlite';
        $this->paths[] = $database;
        $this->paths[] = $database . '-shm';
        $this->paths[] = $database . '-wal';
        $this->pdoStore($database)->install();

        $this->forkWorkers(4, function () use ($database): void {
            $store = $this->pdoStore($database);
            for ($index = 0; $index < 25; ++$index) {
                $store->mutate('concurrency', 'counter', static fn (array $state): array => ['count' => (int) ($state['count'] ?? 0) + 1]);
            }
        });

        self::assertSame(100, $this->pdoStore($database)->get('concurrency', 'counter')['count'] ?? null);
    }

    public function testRedisMutationsFromFourProcessesDoNotLoseUpdates(): void
    {
        $this->requireForking();
        if (!class_exists(\Redis::class)) {
            self::markTestSkipped('ext-redis is not installed.');
        }
        $prefix = 'sofinder-concurrency-' . bin2hex(random_bytes(8)) . ':';
        $redis = $this->redis();
        if ($redis === null) {
            self::markTestSkipped('A local Redis server is not available.');
        }

        try {
            $this->forkWorkers(4, function () use ($prefix): void {
                $connection = $this->redis() ?? throw new \RuntimeException('Redis disappeared during the test.');
                $store = new RedisAtomicStateStore($connection, $prefix, waitMilliseconds: 10_000);
                for ($index = 0; $index < 25; ++$index) {
                    $store->mutate('concurrency', 'counter', static fn (array $state): array => ['count' => (int) ($state['count'] ?? 0) + 1]);
                }
                $connection->close();
            });
            $store = new RedisAtomicStateStore($redis, $prefix);
            self::assertSame(100, $store->get('concurrency', 'counter')['count'] ?? null);
        } finally {
            $key = $prefix . 'concurrency:' . hash('sha256', 'counter');
            $redis->del($key, $key . ':lock');
            $redis->close();
        }
    }

    public function testFileMetricsFromFourProcessesDoNotLoseUpdates(): void
    {
        $this->requireForking();
        $file = sys_get_temp_dir() . '/sofinder-metrics-concurrency-' . bin2hex(random_bytes(8)) . '.json';
        $this->paths[] = $file;
        $this->forkWorkers(4, static function () use ($file): void {
            $metrics = new LocalMetricsStore($file);
            for ($index = 0; $index < 25; ++$index) {
                $metrics->increment('sofinder_operations_total', ['operation' => 'upload']);
            }
        });

        self::assertSame(100, (new LocalMetricsStore($file))->snapshot()[0]['value'] ?? null);
    }

    private function pdoStore(string $database): PdoAtomicStateStore
    {
        $pdo = new \PDO('sqlite:' . $database);
        $pdo->exec('PRAGMA busy_timeout = 10000');

        return new PdoAtomicStateStore($pdo);
    }

    private function redis(): ?\Redis
    {
        try {
            $redis = new \Redis();
            return $redis->connect('127.0.0.1', 6379, 0.2) ? $redis : null;
        } catch (\RedisException) {
            return null;
        }
    }

    private function requireForking(): void
    {
        if (!function_exists('pcntl_fork') || !function_exists('pcntl_waitpid')) {
            self::markTestSkipped('pcntl is required for multi-process integration tests.');
        }
    }

    /** @param callable():void $worker */
    private function forkWorkers(int $count, callable $worker): void
    {
        $children = [];
        for ($index = 0; $index < $count; ++$index) {
            $pid = pcntl_fork();
            if ($pid === -1) {
                self::fail('Unable to fork an integration-test worker.');
            }
            if ($pid === 0) {
                try {
                    $worker();
                    exit(0);
                } catch (\Throwable $exception) {
                    fwrite(STDERR, $exception->getMessage() . "\n");
                    exit(1);
                }
            }
            $children[] = $pid;
        }
        foreach ($children as $pid) {
            pcntl_waitpid($pid, $status);
            self::assertTrue(pcntl_wifexited($status) && pcntl_wexitstatus($status) === 0, sprintf('Worker %d failed.', $pid));
        }
    }
}
