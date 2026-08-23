<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Maintenance;

use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\RecycleBinInterface;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\ResourceRegistry;

final readonly class MaintenanceRunner
{
    public function __construct(
        private string $directory,
        private ChunkUploadStoreInterface $chunks,
        private RecycleBinInterface $trash,
        private UsageTrackerInterface $usage,
        private ResourceRegistry $resources,
    ) {
    }

    public function run(MaintenanceTask $task, ?int $limit = null): MaintenanceResult
    {
        $this->ensureDirectory();
        $lock = @fopen($this->directory . '/' . $task->value . '.lock', 'c+b');
        if ($lock === false || !flock($lock, LOCK_EX | LOCK_NB)) {
            if (is_resource($lock)) fclose($lock);
            return new MaintenanceResult($task, false, 0);
        }

        try {
            return match ($task) {
                MaintenanceTask::Uploads => $this->count($task, $this->chunks->cleanupExpired(true, $limit)),
                MaintenanceTask::Trash => $this->count($task, $this->trash->purgeExpired($limit)),
                MaintenanceTask::Usage => $this->recalculateUsage(),
            };
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    private function count(MaintenanceTask $task, int $processed): MaintenanceResult
    {
        return new MaintenanceResult($task, true, $processed);
    }

    private function recalculateUsage(): MaintenanceResult
    {
        $details = [];
        foreach ($this->resources->all() as $resource) {
            $details[$resource->resource->name] = $this->usage->recalculate($resource);
        }

        return new MaintenanceResult(MaintenanceTask::Usage, true, count($details), $details);
    }

    private function ensureDirectory(): void
    {
        if (!is_dir($this->directory) && !@mkdir($this->directory, 0770, true) && !is_dir($this->directory)) {
            throw new \RuntimeException('Unable to create the SoFinder maintenance state directory.');
        }
    }
}
