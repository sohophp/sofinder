<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Queue;

use Illuminate\Contracts\Bus\Dispatcher;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;

final readonly class LaravelMaintenanceDispatcher implements MaintenanceDispatcherInterface
{
    public function __construct(private Dispatcher $bus)
    {
    }

    public function dispatch(MaintenanceTask $task): void
    {
        $this->bus->dispatch(new LaravelMaintenanceJob($task->value));
    }
}
