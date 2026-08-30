<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use Psr\EventDispatcher\EventDispatcherInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\BrowserPage;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\Theme;

final class BrowserPageTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-browser-' . bin2hex(random_bytes(6));
        mkdir($this->directory, 0770, true);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->directory)) rmdir($this->directory);
    }

    public function testRendersAHostNeutralSafeBootstrapDocument(): void
    {
        $page = $this->page();
        $html = $page->render(new RequestContext(
            ['Accept-Language' => ['zh-TW,zh;q=0.9']],
            ['path' => "folder\\image.jpg", 'uiMode' => 'picker', 'uiHeader' => '0'],
            [],
            '/sofinder',
            'https://example.test',
        ));

        self::assertStringContainsString('<html lang="zh-tw">', $html);
        self::assertStringContainsString('/sofinder/assets/sofinder.css?v=abc123', $html);
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        $config = json_decode(html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), true, 32, JSON_THROW_ON_ERROR);
        self::assertSame('/sofinder/api/config', $config['apiBase']);
        self::assertSame('folder/image.jpg', $config['initialPath']);
        self::assertSame('csrf-token', $config['csrfToken']);
        self::assertSame('picker', $config['uiDefaults']['mode']);
        self::assertFalse($config['uiDefaults']['header']);
        self::assertNull($config['pickerResource']);
    }

    public function testLocksAnExplicitPickerResource(): void
    {
        $html = $this->page()->render(new RequestContext(query: ['select' => '1', 'type' => 'Files']));
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        $config = json_decode(html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame('Files', $config['pickerResource']);
    }

    public function testRejectsAnUnknownPickerResourceDuringBootstrap(): void
    {
        $this->expectException(\SohoPHP\SoFinder\Exception\NotFoundException::class);

        $this->page()->render(new RequestContext(query: ['select' => '1', 'type' => 'Images']));
    }

    public function testPickerResourceLockCanBeDisabledPerInvocation(): void
    {
        $html = $this->page()->render(new RequestContext(query: ['select' => '1', 'type' => 'Files', 'resourceLock' => '0']));
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        $config = json_decode(html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), true, 32, JSON_THROW_ON_ERROR);

        self::assertNull($config['pickerResource']);
    }

    public function testHostCanDisableTheDefaultPickerResourceLock(): void
    {
        $html = $this->page(false)->render(new RequestContext(query: ['select' => '1', 'type' => 'Files']));
        preg_match('/data-config="([^"]+)"/', $html, $matches);
        $config = json_decode(html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), true, 32, JSON_THROW_ON_ERROR);

        self::assertNull($config['pickerResource']);
    }

    public function testRejectsAnUntrustedPickerOrigin(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('picker origin');
        $this->page()->render(new RequestContext(
            query: ['pickerRequestId' => 'abcdefghijklmnop', 'pickerOrigin' => 'https://evil.example'],
            schemeAndHost: 'https://example.test',
        ));
    }

    private function page(bool $pickerLockResource = true): BrowserPage
    {
        $resource = new ResourceType('Files', $this->directory, '/files');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $events = new class implements EventDispatcherInterface {
            public function dispatch(object $event): object { return $event; }
        };
        $urls = new class implements EndpointUrlGeneratorInterface {
            public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
            {
                $path = match ($endpoint) {
                    'sofinder_api_config' => '/sofinder/api/config',
                    'sofinder_asset' => '/sofinder/assets/' . ($parameters['file'] ?? ''),
                    default => '/sofinder',
                };
                return $absolute ? 'https://example.test' . $path : $path;
            }
        };
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'csrf-token'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'csrf-token'; }
        };

        return new BrowserPage(
            new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($resource->root, $resource->publicUrl))]), $authorization, $events),
            $urls,
            $csrf,
            'abc123',
            new Theme(\SohoPHP\SoFinder\Configuration\ConfigurationNormalizer::DEFAULTS['theme']),
            ['mode' => 'auto', 'header' => true, 'logo' => true, 'search' => true, 'language_switcher' => true, 'view_switcher' => true, 'folder_tree' => false, 'scale' => 'standard'],
            pickerLockResource: $pickerLockResource,
        );
    }
}
