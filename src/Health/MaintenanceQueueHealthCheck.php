<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Health;

use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Value\HealthCheckResult;

final readonly class MaintenanceQueueHealthCheck implements HealthCheckInterface
{
    public function __construct(private string $mode, private bool $dispatcherAvailable) {}

    public function check(): HealthCheckResult
    {
        if ($this->mode === 'messenger' && !$this->dispatcherAvailable) {
            return new HealthCheckResult('maintenance-queue', 'down', 'Messenger maintenance is enabled but its dispatcher is unavailable.');
        }

        return new HealthCheckResult('maintenance-queue', 'ready', sprintf('Maintenance mode is %s%s.', $this->mode, $this->mode === 'messenger' ? ' and the dispatcher is registered' : ''));
    }
}
