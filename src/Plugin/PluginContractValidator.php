<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Plugin;

use SohoPHP\SoFinder\Contract\PluginInterface;

/** Public contract helper for third-party plugin CI and installation checks. */
final readonly class PluginContractValidator
{
    /** @return array<string,mixed> */
    public function validate(PluginInterface $plugin): array
    {
        return (new PluginRegistry([$plugin]))->descriptors()[0];
    }
}
