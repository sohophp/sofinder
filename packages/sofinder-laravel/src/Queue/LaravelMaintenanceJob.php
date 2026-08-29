<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Queue;

use Illuminate\Contracts\Queue\ShouldQueue;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;

final class LaravelMaintenanceJob implements ShouldQueue
{
    public function __construct(public readonly string $task)
    {
        MaintenanceTask::from($task);
    }

    public function handle(MaintenanceRunner $runner): void
    {
        $runner->run(MaintenanceTask::from($this->task));
    }
}
