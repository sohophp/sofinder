<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Contract\RecycleBinInterface;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\Maintenance\MaintenanceCoordinator;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\TrashItem;
use SohoPHP\SoFinder\State\PdoAtomicStateStore;

final class MaintenanceTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-maintenance-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0770, true);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->directory)) {
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($iterator as $file) $file->isDir() ? @rmdir($file->getPathname()) : @unlink($file->getPathname());
        }
        @rmdir($this->directory);
    }

    public function testInlineMaintenanceIsBoundedAndThrottled(): void
    {
        $chunks = $this->chunks();
        $runner = $this->runner($chunks);
        $coordinator = new MaintenanceCoordinator($this->directory, 'inline', 300, 7, $runner);

        $coordinator->trigger(MaintenanceTask::Uploads);
        $coordinator->trigger(MaintenanceTask::Uploads);

        self::assertSame([[true, 7]], $chunks->calls);
    }

    public function testMessengerModeDispatchesOnlyAnAllowlistedTask(): void
    {
        $dispatcher = new class implements MaintenanceDispatcherInterface {
            /** @var list<MaintenanceTask> */
            public array $tasks = [];
            public function dispatch(MaintenanceTask $task): void { $this->tasks[] = $task; }
        };
        $runner = $this->runner($this->chunks());
        $coordinator = new MaintenanceCoordinator($this->directory, 'messenger', 0, 5, $runner, $dispatcher);

        $coordinator->trigger(MaintenanceTask::Trash);

        self::assertSame([MaintenanceTask::Trash], $dispatcher->tasks);
        self::assertSame('queued', $runner->status()['trash']['status']);
    }

    public function testDisabledModeDoesNotPerformOpportunityCleanup(): void
    {
        $chunks = $this->chunks();
        (new MaintenanceCoordinator($this->directory, 'disabled', 0, 5, $this->runner($chunks)))->trigger(MaintenanceTask::Uploads);
        self::assertSame([], $chunks->calls);
    }

    public function testRunnerPersistsSuccessfulAndFailedTaskStatus(): void
    {
        $runner = $this->runner($this->chunks());
        $runner->run(MaintenanceTask::Uploads, 4);
        self::assertSame('succeeded', $runner->status()['uploads']['status']);
        self::assertSame(4, $runner->status()['uploads']['processed']);

        $failing = new class implements ChunkUploadStoreInterface {
            public function accept(string $id, int $index, int $total, mixed $stream, int $maximumFileBytes, array $context = []): array { return ['complete' => false]; }
            public function status(string $id): array { throw new \LogicException(); }
            public function discard(string $id): void {}
            public function cleanupExpired(bool $allActors = false, ?int $limit = null): int { throw new \RuntimeException('queue offline'); }
        };
        $runner = $this->runner($failing);
        try { $runner->run(MaintenanceTask::Uploads); self::fail('The task should fail.'); }
        catch (\RuntimeException) {}
        self::assertSame('failed', $runner->status()['uploads']['status']);
        self::assertSame('maintenance_failed', $runner->status()['uploads']['error']['code']);
    }

    public function testSharedStateCoordinatesIntervalsAndPublishesStatusAcrossNodes(): void
    {
        if (!in_array('sqlite', \PDO::getAvailableDrivers(), true)) self::markTestSkipped('pdo_sqlite is required.');
        $database = $this->directory . '/maintenance.sqlite';
        $stateA = new PdoAtomicStateStore(new \PDO('sqlite:' . $database));
        $stateB = new PdoAtomicStateStore(new \PDO('sqlite:' . $database));
        $chunks = $this->chunks();
        $runnerA = $this->runner($chunks, $stateA);
        $runnerB = $this->runner($chunks, $stateB);
        (new MaintenanceCoordinator($this->directory . '/a', 'inline', 300, 3, $runnerA, state: $stateA))->trigger(MaintenanceTask::Uploads);
        (new MaintenanceCoordinator($this->directory . '/b', 'inline', 300, 3, $runnerB, state: $stateB))->trigger(MaintenanceTask::Uploads);

        self::assertSame([[true, 3]], $chunks->calls);
        self::assertSame('succeeded', $runnerB->status()['uploads']['status']);
    }

    private function runner(ChunkUploadStoreInterface $chunks, ?\SohoPHP\SoFinder\Contract\AtomicStateStoreInterface $state = null): MaintenanceRunner
    {
        $trash = new class implements RecycleBinInterface {
            public function put(ResourceStorage $resource, string $path): array { throw new \LogicException(); }
            public function list(?string $resource = null): array { return []; }
            public function statistics(): array { return ['usedItems' => 0, 'usedBytes' => 0, 'maxItems' => 1, 'maxBytes' => 1]; }
            public function get(string $id): TrashItem { throw new \LogicException(); }
            public function restore(ResourceStorage $resource, string $id, string $conflict = 'cancel'): Entry { throw new \LogicException(); }
            public function permanentlyDelete(string $id): void {}
            public function purgeExpired(?int $limit = null): int { return $limit ?? 2; }
        };
        $usage = new class implements UsageTrackerInterface {
            public function usage(ResourceStorage $resource): int { return 0; }
            public function recalculate(ResourceStorage $resource): int { return 0; }
            public function mutate(ResourceStorage $resource, callable $operation): mixed { return $operation(0)['value']; }
        };

        return new MaintenanceRunner($this->directory, $chunks, $trash, $usage, new ResourceRegistry(), $state);
    }

    private function chunks(): ChunkUploadStoreInterface
    {
        return new class implements ChunkUploadStoreInterface {
            /** @var list<array{bool,?int}> */
            public array $calls = [];
            public function accept(string $id, int $index, int $total, mixed $stream, int $maximumFileBytes, array $context = []): array { return ['complete' => false]; }
            public function status(string $id): array { throw new \LogicException(); }
            public function discard(string $id): void {}
            public function cleanupExpired(bool $allActors = false, ?int $limit = null): int { $this->calls[] = [$allActors, $limit]; return $limit ?? 3; }
        };
    }
}
