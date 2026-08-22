<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Plugin\PluginRegistry;

final class PluginRegistryTest extends TestCase
{
    public function testDescriptorsAreNormalizedAndSorted(): void
    {
        $registry = new PluginRegistry([
            $this->plugin('zeta-plugin', '2.0.0', ['audit', 'audit']),
            $this->plugin('alpha-plugin', '1.0.0', ['virus-scan']),
        ]);

        self::assertSame([
            ['name' => 'alpha-plugin', 'version' => '1.0.0', 'capabilities' => ['virus-scan']],
            ['name' => 'zeta-plugin', 'version' => '2.0.0', 'capabilities' => ['audit']],
        ], $registry->descriptors());
    }

    public function testDuplicateNamesAreRejected(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new PluginRegistry([
            $this->plugin('same-plugin', '1.0.0', []),
            $this->plugin('same-plugin', '2.0.0', []),
        ]);
    }

    public function testUnsafeDescriptorIsRejected(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new PluginRegistry([$this->plugin('<script>', '1.0.0', [])]);
    }

    /** @param list<string> $capabilities */
    private function plugin(string $name, string $version, array $capabilities): PluginInterface
    {
        return new class($name, $version, $capabilities) implements PluginInterface {
            /** @param list<string> $capabilities */
            public function __construct(
                private readonly string $name,
                private readonly string $version,
                private readonly array $capabilities,
            ) {
            }

            public function descriptor(): array
            {
                return ['name' => $this->name, 'version' => $this->version, 'capabilities' => $this->capabilities];
            }
        };
    }
}
