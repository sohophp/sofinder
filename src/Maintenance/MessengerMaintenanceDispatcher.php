<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Maintenance;

use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;

final readonly class MessengerMaintenanceDispatcher implements MaintenanceDispatcherInterface
{
    public function __construct(private object $bus)
    {
    }

    public function dispatch(MaintenanceTask $task): void
    {
        if (!method_exists($this->bus, 'dispatch')) {
            throw new \LogicException('The configured Symfony Messenger bus cannot dispatch messages.');
        }
        $this->bus->dispatch(new MaintenanceMessage($task->value));
    }
}
