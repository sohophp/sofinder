<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Plugin;

use SohoPHP\SoFinder\Contract\PluginInterface;

final readonly class PluginRegistry
{
    /** @var list<array{name: string, version: string, capabilities: list<string>}> */
    private array $descriptors;

    /** @param iterable<PluginInterface> $plugins */
    public function __construct(iterable $plugins)
    {
        $descriptors = [];
        $names = [];
        foreach ($plugins as $plugin) {
            $descriptor = $this->normalize($plugin->descriptor());
            if (isset($names[$descriptor['name']])) {
                throw new \InvalidArgumentException(sprintf('SoFinder plugin name "%s" is registered more than once.', $descriptor['name']));
            }
            $names[$descriptor['name']] = true;
            $descriptors[] = $descriptor;
        }

        usort($descriptors, static fn (array $left, array $right): int => $left['name'] <=> $right['name']);
        $this->descriptors = $descriptors;
    }

    /** @return list<array{name: string, version: string, capabilities: list<string>}> */
    public function descriptors(): array
    {
        return $this->descriptors;
    }

    /**
     * @param array{name?: mixed, version?: mixed, capabilities?: mixed} $descriptor
     * @return array{name: string, version: string, capabilities: list<string>}
     */
    private function normalize(array $descriptor): array
    {
        $name = $descriptor['name'] ?? null;
        $version = $descriptor['version'] ?? null;
        $capabilities = $descriptor['capabilities'] ?? null;
        if (!is_string($name) || preg_match('/^[a-z][a-z0-9._-]{1,63}$/', $name) !== 1) {
            throw new \InvalidArgumentException('SoFinder plugin names must contain 2-64 lowercase letters, numbers, dots, underscores or hyphens.');
        }
        if (!is_string($version) || $version === '' || strlen($version) > 64 || preg_match('/^[0-9A-Za-z][0-9A-Za-z.+_-]*$/', $version) !== 1) {
            throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" has an invalid version.', $name));
        }
        if (!is_array($capabilities)) {
            throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" capabilities must be an array.', $name));
        }

        $normalized = [];
        foreach ($capabilities as $capability) {
            if (!is_string($capability) || preg_match('/^[a-z][a-z0-9._-]{0,63}$/', $capability) !== 1) {
                throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" has an invalid capability.', $name));
            }
            $normalized[$capability] = true;
        }

        return ['name' => $name, 'version' => $version, 'capabilities' => array_keys($normalized)];
    }
}
