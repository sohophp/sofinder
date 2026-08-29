<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Routing\UrlGenerator;
use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Framework\RoutingEntryUrlGenerator;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;

final readonly class LaravelEntryUrlGenerator implements EntryUrlGeneratorInterface
{
    private RoutingEntryUrlGenerator $generator;

    /** @param iterable<EntryUrlContextProviderInterface> $contextProviders */
    public function __construct(UrlGenerator $urls, iterable $contextProviders = [])
    {
        $this->generator = new RoutingEntryUrlGenerator(
            static fn (string $route, array $parameters, bool $absolute): string => $urls->route(
                str_starts_with($route, 'sofinder_') ? LaravelRouteName::fromEndpoint($route) : $route,
                $parameters,
                $absolute,
            ),
            $contextProviders,
        );
    }

    public function generate(ResourceType $resource, Entry $entry): ?string
    {
        return $this->generator->generate($resource, $entry);
    }
}
