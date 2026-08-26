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

    public function testNormalizesSafeSameOriginUiActions(): void
    {
        $plugin = new class implements PluginInterface {
            public function descriptor(): array
            {
                return [
                    'name' => 'document-tools',
                    'version' => '1.2.0',
                    'capabilities' => ['preview'],
                    'uiActions' => [[
                        'id' => 'inspect',
                        'label' => ['en' => 'Inspect', 'zh-cn' => '检查'],
                        'slot' => 'context',
                        'url' => '/admin/documents/inspect',
                        'selection' => 'file',
                        'requires' => 'read',
                    ]],
                ];
            }
        };

        self::assertSame('/admin/documents/inspect', (new PluginRegistry([$plugin]))->descriptors()[0]['uiActions'][0]['url']);
    }

    public function testRejectsCrossOriginUiActions(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $plugin = new class implements PluginInterface {
            public function descriptor(): array
            {
                return ['name' => 'unsafe-actions', 'version' => '1.0.0', 'capabilities' => [], 'uiActions' => [[
                    'id' => 'leave', 'label' => ['en' => 'Leave'], 'slot' => 'utility', 'url' => '//attacker.invalid/x',
                ]]];
            }
        };
        new PluginRegistry([$plugin]);
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
