<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Plugin\PluginContractValidator;
use SohoPHP\SoFinder\Event\AssetOperationEvent;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use Symfony\Component\HttpFoundation\Response;

final class PluginRegistryTest extends TestCase
{
    public function testDescriptorsAreNormalizedAndSorted(): void
    {
        $registry = new PluginRegistry([
            $this->plugin('zeta-plugin', '2.0.0', ['audit', 'audit']),
            $this->plugin('alpha-plugin', '1.0.0', ['virus-scan']),
        ]);

        self::assertSame([
            ['descriptorVersion' => '1.0', 'name' => 'alpha-plugin', 'version' => '1.0.0', 'capabilities' => ['virus-scan']],
            ['descriptorVersion' => '1.0', 'name' => 'zeta-plugin', 'version' => '2.0.0', 'capabilities' => ['audit']],
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

    public function testNormalizesSafeSameOriginPreviewersAndDetailsActions(): void
    {
        $plugin = new class implements PluginInterface {
            public function descriptor(): array
            {
                return ['name' => 'document-preview', 'version' => '1.0.0', 'capabilities' => ['preview.pdf'],
                    'uiActions' => [['id' => 'properties', 'label' => ['en' => 'Properties'], 'slot' => 'details', 'url' => '/documents/properties']],
                    'previewers' => [['id' => 'pdf', 'mimeTypes' => ['application/pdf'], 'extensions' => ['PDF'], 'url' => '/sofinder/api/preview/document']],
                ];
            }
        };
        $descriptor = (new PluginRegistry([$plugin]))->descriptors()[0];

        self::assertSame('details', $descriptor['uiActions'][0]['slot']);
        self::assertSame(['pdf'], $descriptor['previewers'][0]['extensions']);
        self::assertSame(['application/pdf'], $descriptor['previewers'][0]['mimeTypes']);
    }

    public function testRejectsCrossOriginPreviewers(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $plugin = new class implements PluginInterface {
            public function descriptor(): array
            {
                return ['name' => 'unsafe-preview', 'version' => '1.0.0', 'capabilities' => [], 'previewers' => [['id' => 'pdf', 'extensions' => ['pdf'], 'url' => '//attacker.invalid/render']]];
            }
        };
        new PluginRegistry([$plugin]);
    }

    public function testRejectsEncodedPathTraversalAndUnknownDescriptorFields(): void
    {
        foreach ([
            ['name' => 'unsafe-path', 'version' => '1.0.0', 'capabilities' => [], 'previewers' => [['id' => 'pdf', 'extensions' => ['pdf'], 'url' => '/preview/%2e%2e/secret']]],
            ['name' => 'unknown-field', 'version' => '1.0.0', 'capabilities' => [], 'script' => '/plugin.js'],
        ] as $descriptor) {
            $plugin = new class($descriptor) implements PluginInterface {
                /** @param array<string,mixed> $descriptor */
                public function __construct(private readonly array $descriptor) {}
                public function descriptor(): array { return $this->descriptor; }
            };
            try {
                new PluginRegistry([$plugin]);
                self::fail('An unsafe plugin descriptor must be rejected.');
            } catch (\InvalidArgumentException) {
                self::addToAssertionCount(1);
            }
        }
    }

    public function testRejectsDuplicateUiActionIds(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $action = ['id' => 'inspect', 'label' => ['en' => 'Inspect'], 'slot' => 'context', 'url' => '/inspect'];
        $plugin = new class($action) implements PluginInterface {
            /** @param array<string,mixed> $action */
            public function __construct(private readonly array $action) {}
            public function descriptor(): array { return ['name' => 'duplicate-action', 'version' => '1.0.0', 'capabilities' => [], 'uiActions' => [$this->action, $this->action]]; }
        };
        new PluginRegistry([$plugin]);
    }

    public function testRejectsUnknownNestedDescriptorFields(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $plugin = new class implements PluginInterface {
            public function descriptor(): array { return ['name' => 'nested-field', 'version' => '1.0.0', 'capabilities' => [], 'uiActions' => [[
                'id' => 'inspect', 'label' => ['en' => 'Inspect'], 'slot' => 'context', 'url' => '/inspect', 'javascript' => 'alert(1)',
            ]]]; }
        };
        new PluginRegistry([$plugin]);
    }

    public function testNormalizesPluginRequirementsWithoutPublishingConfigurationValues(): void
    {
        $plugin = new class implements PluginInterface {
            public function descriptor(): array
            {
                return [
                    'name' => 'safe-requirements', 'version' => '1.0.0', 'capabilities' => ['inspect'],
                    'resourceTypes' => ['file', 'image', 'file'],
                    'requiredOperations' => ['read'],
                    'configurationKeys' => ['scanner.endpoint'],
                ];
            }
        };
        $descriptor = (new PluginRegistry([$plugin]))->descriptors()[0];
        self::assertSame(['file', 'image'], $descriptor['resourceTypes']);
        self::assertSame(['read'], $descriptor['requiredOperations']);
        self::assertSame(['scanner.endpoint'], $descriptor['configurationKeys']);
    }

    public function testPublishedContractValidatorUsesTheRuntimeRules(): void
    {
        $plugin = new class implements PluginInterface {
            public function descriptor(): array { return [
                'name' => 'third-party-preview', 'version' => '1.0.0', 'capabilities' => ['preview.pdf'],
                'previewers' => [['id' => 'pdf', 'mimeTypes' => ['application/pdf'], 'url' => '/plugin/preview']],
            ]; }
        };
        $descriptor = (new PluginContractValidator())->validate($plugin);
        self::assertSame('third-party-preview', $descriptor['name']);
        self::assertSame('/plugin/preview', $descriptor['previewers'][0]['url']);
    }

    public function testPublishedContractValidatorChecksPreviewHeadersAndEvents(): void
    {
        $validator = new PluginContractValidator();
        $response = new Response('preview', headers: [
            'Content-Security-Policy' => "default-src 'none'; frame-ancestors 'self'",
            'X-Content-Type-Options' => 'nosniff',
            'Referrer-Policy' => 'no-referrer',
        ]);
        $validator->validatePreviewResponse($response);
        $event = new AssetOperationEvent(str_repeat('a', 32), 'upload', 'after', new WorkspaceContext('main', 'actor'), new ResourceType('Files', '/files', '/files'), 'a.txt', null, null);
        self::assertSame('1.0', $validator->validateEvent($event)['schemaVersion']);
        foreach ([
            [],
            ['Content-Security-Policy' => "default-src 'none'; frame-ancestors 'self'"],
            ['Content-Security-Policy' => "default-src 'none'; frame-ancestors 'self'", 'X-Content-Type-Options' => 'nosniff'],
        ] as $headers) {
            try { $validator->validatePreviewResponse(new Response('unsafe', headers: $headers)); self::fail('Incomplete preview security headers must be rejected.'); }
            catch (\InvalidArgumentException) { self::addToAssertionCount(1); }
        }
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
