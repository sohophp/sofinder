<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

final class LaravelRouteName
{
    public static function fromEndpoint(string $endpoint): string
    {
        if (!str_starts_with($endpoint, 'sofinder_')) {
            throw new \InvalidArgumentException(sprintf('Invalid SoFinder endpoint name "%s".', $endpoint));
        }

        return 'sofinder.' . str_replace('_', '.', substr($endpoint, 9));
    }
}
