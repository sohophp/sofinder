<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Framework\RoutingEntryUrlGenerator;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;

final readonly class CatalogEntryUrlGenerator implements EntryUrlGeneratorInterface
{
    private RoutingEntryUrlGenerator $entries;

    public function __construct(CatalogUrlGenerator $urls)
    {
        $this->entries = new RoutingEntryUrlGenerator($urls->generate(...));
    }

    public function generate(ResourceType $resource, Entry $entry): ?string
    {
        return $this->entries->generate($resource, $entry);
    }
}
