<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Plugin;

use SohoPHP\SoFinder\Contract\PluginInterface;

final readonly class PluginRegistry
{
    /** @var list<array<string,mixed>> */
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

    /** @return list<array<string,mixed>> */
    public function descriptors(): array
    {
        return $this->descriptors;
    }

    /**
     * @param array<string,mixed> $descriptor
     * @return array<string,mixed>
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

        $result = ['name' => $name, 'version' => $version, 'capabilities' => array_keys($normalized)];
        if (array_key_exists('uiActions', $descriptor)) {
            $result['uiActions'] = $this->normalizeUiActions($name, $descriptor['uiActions']);
        }

        return $result;
    }

    /** @return list<array<string,mixed>> */
    private function normalizeUiActions(string $plugin, mixed $actions): array
    {
        if (!is_array($actions) || count($actions) > 20) {
            throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" uiActions must be an array of at most 20 actions.', $plugin));
        }
        $result = [];
        $ids = [];
        foreach ($actions as $action) {
            if (!is_array($action)) {
                throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" contains an invalid UI action.', $plugin));
            }
            $id = $action['id'] ?? null;
            $labels = $action['label'] ?? null;
            $slot = $action['slot'] ?? null;
            $url = $action['url'] ?? null;
            $selection = $action['selection'] ?? 'any';
            $requires = $action['requires'] ?? 'read';
            if (!is_string($id) || preg_match('/^[a-z][a-z0-9_-]{1,31}$/D', $id) !== 1 || isset($ids[$id])) {
                throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" UI action IDs must be unique safe identifiers.', $plugin));
            }
            if (!is_array($labels) || !isset($labels['en']) || !is_string($labels['en'])) {
                throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" UI actions require an English label.', $plugin));
            }
            $normalizedLabels = [];
            foreach (['en', 'zh-cn', 'zh-tw'] as $locale) {
                if (!isset($labels[$locale])) continue;
                if (!is_string($labels[$locale]) || trim($labels[$locale]) === '' || mb_strlen($labels[$locale]) > 48 || preg_match('/[\x00-\x1F\x7F]/u', $labels[$locale]) === 1) {
                    throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" contains an invalid UI action label.', $plugin));
                }
                $normalizedLabels[$locale] = trim($labels[$locale]);
            }
            if (!is_string($slot) || !in_array($slot, ['utility', 'toolbar', 'context'], true)
                || !is_string($selection) || !in_array($selection, ['none', 'any', 'file', 'image'], true)
                || !is_string($requires) || preg_match('/^[a-z][a-z0-9_-]{0,31}$/D', $requires) !== 1
                || !is_string($url) || !str_starts_with($url, '/') || str_starts_with($url, '//') || strlen($url) > 512 || preg_match('/[\x00-\x20\x7F]/', $url) === 1) {
                throw new \InvalidArgumentException(sprintf('SoFinder plugin "%s" contains an unsafe UI action.', $plugin));
            }
            $ids[$id] = true;
            $result[] = ['id' => $id, 'label' => $normalizedLabels, 'slot' => $slot, 'url' => $url, 'selection' => $selection, 'requires' => $requires];
        }

        return $result;
    }
}
