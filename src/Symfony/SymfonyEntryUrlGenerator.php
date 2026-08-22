<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final readonly class SymfonyEntryUrlGenerator implements EntryUrlGeneratorInterface
{
    public function __construct(private UrlGeneratorInterface $router)
    {
    }

    public function generate(ResourceType $resource, Entry $entry): ?string
    {
        if ($entry->directory) {
            return null;
        }
        if ($resource->deliveryMode === 'public') {
            return $entry->url;
        }

        return $this->router->generate('sofinder_api_content', [
            'resource' => $resource->name,
            'path' => $entry->path,
            'disposition' => 'inline',
        ]);
    }
}
