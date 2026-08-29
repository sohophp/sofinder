<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\Action\FrontendAssetAction;
use SohoPHP\SoFinder\Http\AssetController;
use SohoPHP\SoFinder\Http\CachedFileResponseBuilder;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use Symfony\Component\HttpFoundation\Request;

final class SharedFrontendAssetActionTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-assets-' . bin2hex(random_bytes(8));
        mkdir($this->directory . '/dist', 0775, true);
        file_put_contents($this->directory . '/dist/app-ABC.js', 'export const ready = true;');
        file_put_contents($this->directory . '/dist/app-ABC.css', '.ready{display:block}');
        file_put_contents($this->directory . '/dist/manifest.json', json_encode([
            'src/app.ts' => ['file' => 'app-ABC.js', 'css' => ['app-ABC.css']],
        ], JSON_THROW_ON_ERROR));
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/dist/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->directory . '/dist');
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrServeOnlyManifestAssetsWithMatchingCacheContract(): void
    {
        $action = new FrontendAssetAction($this->directory, new CachedFileResponseBuilder());
        $controller = new AssetController($this->directory, $action);
        $symfony = $controller('app-ABC.js', Request::create('/assets/app-ABC.js'));
        ob_start();
        $symfony->sendContent();
        $captured = ob_get_clean();
        self::assertIsString($captured);

        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(
            (new ServerRequest('GET', '/assets/app-ABC.js'))->withAttribute('file', 'app-ABC.js'),
        );

        self::assertSame($captured, (string) $psr->getBody());
        self::assertSame('text/javascript; charset=UTF-8', $psr->getHeaderLine('Content-Type'));
        self::assertSame('public, max-age=31536000, immutable', $psr->getHeaderLine('Cache-Control'));
        self::assertSame($symfony->headers->get('ETag'), $psr->getHeaderLine('ETag'));

        $etag = $psr->getHeaderLine('ETag');
        $notModified = (new PsrEndpointHandler($action, $factory, $factory))->handle(
            (new ServerRequest('GET', '/assets/app-ABC.js', ['If-None-Match' => $etag]))->withAttribute('file', 'app-ABC.js'),
        );
        self::assertSame(304, $notModified->getStatusCode());
        self::assertSame('', (string) $notModified->getBody());
    }

    public function testUnknownAssetResponseMatches(): void
    {
        $action = new FrontendAssetAction($this->directory, new CachedFileResponseBuilder());
        $controller = new AssetController($this->directory, $action);
        $symfony = $controller('../manifest.json');
        ob_start();
        $symfony->sendContent();
        $captured = ob_get_clean();
        self::assertIsString($captured);
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(
            (new ServerRequest('GET', '/assets/manifest.json'))->withAttribute('file', '../manifest.json'),
        );

        self::assertSame(404, $symfony->getStatusCode());
        self::assertSame(404, $psr->getStatusCode());
        self::assertSame($captured, (string) $psr->getBody());
    }
}
