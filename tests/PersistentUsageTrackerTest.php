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
