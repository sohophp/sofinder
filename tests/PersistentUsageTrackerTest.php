<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Usage\PersistentUsageTracker;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;

final class PersistentUsageTrackerTest extends TestCase
{
    private string $root;
    private string $state;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/sofinder-usage-files-' . bin2hex(random_bytes(5));
        $this->state = sys_get_temp_dir() . '/sofinder-usage-state-' . bin2hex(random_bytes(5));
        mkdir($this->root, 0777, true);
    }

    protected function tearDown(): void
    {
        $this->remove($this->root);
        $this->remove($this->state);
    }

    public function testItPersistsAndUpdatesUsageByActualDelta(): void
    {
        file_put_contents($this->root . '/existing.txt', '1234');
        $resource = $this->resource();
        $tracker = new PersistentUsageTracker($this->state);

        self::assertSame(4, $tracker->usage($resource));
        self::assertSame('written', $tracker->mutate($resource, static fn (int $current): array => [
            'value' => 'written',
            'delta' => 6,
        ]));
        self::assertSame(10, $tracker->usage($resource));

        $reloaded = new PersistentUsageTracker($this->state);
        self::assertSame(10, $reloaded->usage($resource));
    }

    public function testFailedMutationIsMarkedDirtyAndRecalibratedOnNextRead(): void
    {
        file_put_contents($this->root . '/existing.txt', '1234');
        $resource = $this->resource();
        $tracker = new PersistentUsageTracker($this->state);
        self::assertSame(4, $tracker->usage($resource));

        try {
            $tracker->mutate($resource, function (): array {
                file_put_contents($this->root . '/interrupted.txt', '123456');
                throw new \RuntimeException('interrupted');
            });
            self::fail('The simulated interruption must be propagated.');
        } catch (\RuntimeException $exception) {
            self::assertSame('interrupted', $exception->getMessage());
        }

        self::assertSame(10, (new PersistentUsageTracker($this->state))->usage($resource));
    }

    public function testUsageLockCoordinatesIndependentProcesses(): void
    {
        file_put_contents($this->root . '/existing.txt', '1234');
        $resource = $this->resource();
        $tracker = new PersistentUsageTracker($this->state);
        self::assertSame(4, $tracker->usage($resource));
        $marker = $this->state . '/child-entered';
        $readerStarted = $this->state . '/reader-started';
        $readerFinished = $this->state . '/reader-finished';
        $autoload = dirname((new \ReflectionClass(\Composer\Autoload\ClassLoader::class))->getFileName()) . '/../autoload.php';
        $bootstrap = sprintf(
            'require %s; $resource=new SohoPHP\\SoFinder\\Value\\ResourceStorage(new SohoPHP\\SoFinder\\Value\\ResourceType("Files",%s,"/files",["txt"]),new SohoPHP\\SoFinder\\Storage\\LocalStorageAdapter(%s,"/files")); $tracker=new SohoPHP\\SoFinder\\Usage\\PersistentUsageTracker(%s); ',
            var_export($autoload, true),
            var_export($this->root, true),
            var_export($this->root, true),
            var_export($this->state, true),
        );
        $holderCode = $bootstrap . sprintf(
            '$tracker->mutate($resource,static function(int $current):array{file_put_contents(%s,"1");if(fgets(STDIN)===false){throw new RuntimeException("Missing lock release signal.");}return ["value"=>null,"delta"=>0];});',
            var_export($marker, true),
        );
        $readerCode = $bootstrap . sprintf(
            'file_put_contents(%s,"1");if($tracker->usage($resource)!==4){throw new RuntimeException("Unexpected usage.");}file_put_contents(%s,"1");',
            var_export($readerStarted, true),
            var_export($readerFinished, true),
        );
        $processes = [];
        $statuses = [];
        $holderPipes = [];
        try {
            $holder = proc_open([PHP_BINARY, '-r', $holderCode], [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $holderPipes);
            self::assertIsResource($holder);
            $processes[] = [$holder, $holderPipes];
            $this->awaitMarker($marker);
            $reader = proc_open([PHP_BINARY, '-r', $readerCode], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $readerPipes);
            self::assertIsResource($reader);
            $processes[] = [$reader, $readerPipes];
            $this->awaitMarker($readerStarted);
            // The holder keeps the lock until explicitly released, regardless of startup time.
            usleep(100_000);
            clearstatcache(true, $readerFinished);
            self::assertFileDoesNotExist($readerFinished);
            fwrite($holderPipes[0], "release\n");
            fflush($holderPipes[0]);
            $this->awaitMarker($readerFinished);
        } finally {
            // Closing stdin also releases a holder if an assertion failed.
            foreach ($processes as [$process, $pipes]) {
                foreach ($pipes as $pipe) fclose($pipe);
                $statuses[] = proc_close($process);
            }
        }
        foreach ($statuses as $status) self::assertSame(0, $status);
    }

    private function awaitMarker(string $path): void
    {
        $deadline = microtime(true) + 10;
        do {
            clearstatcache(true, $path);
            if (is_file($path)) break;
            usleep(10_000);
        } while (microtime(true) < $deadline);
        self::assertFileExists($path);
    }

    private function resource(): ResourceStorage
    {
        return new ResourceStorage(
            new ResourceType('Files', $this->root, '/files', ['txt']),
            new LocalStorageAdapter($this->root, '/files'),
        );
    }

    private function remove(string $directory): void
    {
        if (!is_dir($directory)) {
            return;
        }
        foreach (new \FilesystemIterator($directory, \FilesystemIterator::SKIP_DOTS) as $entry) {
            if ($entry->isDir() && !$entry->isLink()) {
                $this->remove($entry->getPathname());
            } else {
                unlink($entry->getPathname());
            }
        }
        rmdir($directory);
    }
}
