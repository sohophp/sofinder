<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Framework\RoutingEntryUrlGenerator;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class SymfonyEntryUrlGenerator implements EntryUrlGeneratorInterface
{
    private readonly RoutingEntryUrlGenerator $generator;

    /** @param iterable<EntryUrlContextProviderInterface> $contextProviders */
    public function __construct(UrlGeneratorInterface $router, iterable $contextProviders = [])
    {
        $this->generator = new RoutingEntryUrlGenerator(
            static fn (string $route, array $parameters, bool $absolute): string => $router->generate(
                $route,
                $parameters,
                $absolute ? UrlGeneratorInterface::ABSOLUTE_URL : UrlGeneratorInterface::ABSOLUTE_PATH,
            ),
            $contextProviders,
        );
    }

    public function generate(ResourceType $resource, Entry $entry): ?string
    {
        return $this->generator->generate($resource, $entry);
    }
}
