<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Contract;

/**
 * Public extension point for advertising host-provided SoFinder plugins.
 *
 * Plugins should use events and the replaceable service contracts for their
 * behaviour. This descriptor is intentionally data-only and safe to expose to
 * the browser.
 */
interface PluginInterface
{
    /**
     * @return array{name: string, version: string, capabilities: list<string>}
     */
    public function descriptor(): array;
}
