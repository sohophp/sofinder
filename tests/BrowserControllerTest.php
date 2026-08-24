<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\BrowserController;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\Theme;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class BrowserControllerTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-browser-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        @rmdir($this->directory);
    }

    public function testResolvesPickerModeAndAllowlistedPresentationOverrides(): void
    {
        $config = $this->config(Request::create('/browser?select=1&uiMode=auto&uiTools=full&uiHeader=1&uiLogo=1&uiSearch=0&uiLanguage=0&uiView=0'));

        self::assertTrue($config['selectMode']);
        self::assertSame('picker', $config['uiDefaults']['mode']);
        self::assertTrue($config['uiDefaults']['header']);
        self::assertTrue($config['uiDefaults']['logo']);
        self::assertFalse($config['uiDefaults']['search']);
        self::assertFalse($config['uiDefaults']['languageSwitcher']);
        self::assertFalse($config['uiDefaults']['viewSwitcher']);
        self::assertTrue($config['uiDefaults']['fullTools']);
    }

    public function testInvalidOverridesFallBackToHostDefaults(): void
    {
        $config = $this->config(Request::create('/browser?uiMode=wide&uiHeader=yes&uiSearch=no'));

        self::assertSame('manager', $config['uiDefaults']['mode']);
        self::assertFalse($config['uiDefaults']['header']);
        self::assertTrue($config['uiDefaults']['search']);
        self::assertFalse($config['uiDefaults']['fullTools']);
    }

    /** @return array<string,mixed> */
    private function config(Request $request): array
    {
        $resource = new ResourceType('Files', $this->directory, '/files');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $router = $this->createMock(RouterInterface::class);
        $router->method('generate')->willReturnCallback(static fn (string $name, array $parameters = []): string => $name === 'sofinder_asset' ? '/assets/' . $parameters['file'] : '/api/config');
        $csrf = $this->createMock(CsrfTokenManagerInterface::class);
        $csrf->method('getToken')->willReturn(new CsrfToken('sofinder', 'token'));
        $theme = new Theme(['accent' => '#276ef1', 'background' => '#f4f6f9', 'panel' => '#fff', 'text' => '#1c2735', 'muted' => '#667282', 'danger' => '#c13a43', 'radius' => '10px']);
        $controller = new BrowserController($files, $router, $csrf, 'test', $theme, [
            'mode' => 'auto', 'header' => false, 'logo' => false, 'search' => true,
            'language_switcher' => true, 'view_switcher' => true, 'folder_tree' => false, 'scale' => 'standard',
        ]);
        $html = (string) $controller($request)->getContent();
        self::assertMatchesRegularExpression('/data-config="([^"]+)"/', $html);
        preg_match('/data-config="([^"]+)"/', $html, $matches);

        return json_decode(html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), true, 512, JSON_THROW_ON_ERROR);
    }
}
