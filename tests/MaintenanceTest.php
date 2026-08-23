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
        foreach (glob($this->directory . '/*') ?: [] as $file) @unlink($file);
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
        $coordinator = new MaintenanceCoordinator($this->directory, 'messenger', 0, 5, $this->runner($this->chunks()), $dispatcher);

        $coordinator->trigger(MaintenanceTask::Trash);

        self::assertSame([MaintenanceTask::Trash], $dispatcher->tasks);
    }

    public function testDisabledModeDoesNotPerformOpportunityCleanup(): void
    {
        $chunks = $this->chunks();
        (new MaintenanceCoordinator($this->directory, 'disabled', 0, 5, $this->runner($chunks)))->trigger(MaintenanceTask::Uploads);
        self::assertSame([], $chunks->calls);
    }

    private function runner(ChunkUploadStoreInterface $chunks): MaintenanceRunner
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

        return new MaintenanceRunner($this->directory, $chunks, $trash, $usage, new ResourceRegistry());
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
