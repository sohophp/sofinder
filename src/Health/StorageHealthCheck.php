<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Health;

use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Value\HealthCheckResult;
use SohoPHP\SoFinder\Value\ListQuery;

final readonly class StorageHealthCheck implements HealthCheckInterface
{
    public function __construct(private ResourceRegistry $resources)
    {
    }

    public function check(): HealthCheckResult
    {
        $count = 0;
        foreach ($this->resources->all() as $resource) {
            ++$count;
            try {
                $resource->storage->list(new ListQuery(limit: 1));
            } catch (\Throwable) {
                return new HealthCheckResult('storage', 'down', sprintf('Storage resource %s is unavailable.', $resource->resource->name));
            }
        }

        return new HealthCheckResult('storage', 'ready', sprintf('%d storage resource(s) responded.', $count));
    }
}
