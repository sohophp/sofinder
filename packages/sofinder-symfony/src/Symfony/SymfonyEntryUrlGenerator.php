<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Contract\EntryUrlGeneratorInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final readonly class SymfonyEntryUrlGenerator implements EntryUrlGeneratorInterface
{
    /** @param iterable<EntryUrlContextProviderInterface> $contextProviders */
    public function __construct(private UrlGeneratorInterface $router, private iterable $contextProviders = []) {}

    public function generate(ResourceType $resource, Entry $entry): ?string
    {
        if ($entry->directory) {
            return null;
        }
        if ($resource->entryUrlRoute !== '') {
            return $this->routeUrl($resource, $entry);
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

    private function routeUrl(ResourceType $resource, Entry $entry): string
    {
        $extension = strtolower((string) pathinfo($entry->name, PATHINFO_EXTENSION));
        $context = [
            'resource' => $resource->name,
            'path' => $entry->path,
            'name' => $entry->name,
            'stem' => (string) pathinfo($entry->name, PATHINFO_FILENAME),
            'extension' => $extension,
            'storage_url' => $entry->url,
        ];
        foreach ($this->contextProviders as $provider) {
            $context = array_replace($context, $provider->context($resource, $entry));
        }
        $parameters = [];
        foreach ($resource->entryUrlParameters as $name => $template) {
            $parameters[$name] = $this->renderParameter($template, $context);
        }

        return $this->router->generate(
            $resource->entryUrlRoute,
            $parameters,
            $resource->entryUrlAbsolute ? UrlGeneratorInterface::ABSOLUTE_URL : UrlGeneratorInterface::ABSOLUTE_PATH,
        );
    }

    /** @param array<string, string|int|float|bool|null> $context */
    private function renderParameter(string $template, array $context): string|int|float|bool
    {
        if (preg_match('/^\{([a-zA-Z][a-zA-Z0-9_]*)\}$/', $template, $matches) === 1) {
            return $this->contextValue($matches[1], $context);
        }

        return (string) preg_replace_callback(
            '/\{([a-zA-Z][a-zA-Z0-9_]*)\}/',
            fn (array $matches): string => (string) $this->contextValue($matches[1], $context),
            $template,
        );
    }

    /** @param array<string, string|int|float|bool|null> $context */
    private function contextValue(string $name, array $context): string|int|float|bool
    {
        $value = $context[$name] ?? null;
        if (!is_string($value) && !is_int($value) && !is_float($value) && !is_bool($value)) {
            throw new SoFinderException(sprintf('Entry URL context value "%s" is unavailable.', $name), 'entry_url_context_missing', 500);
        }

        return $value;
    }
}
