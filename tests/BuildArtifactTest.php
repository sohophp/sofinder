<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\AssetController;

final class BuildArtifactTest extends TestCase
{
    public function testBrowserBundleDoesNotReferenceNodeEnvironmentVariables(): void
    {
        $bundle = file_get_contents(dirname(__DIR__) . '/dist/sofinder.js');
        self::assertIsString($bundle);
        self::assertStringNotContainsString('process.env', $bundle);
    }

    public function testPickerSdkIsShippedAsAnIndependentModule(): void
    {
        $bundle = file_get_contents(dirname(__DIR__) . '/dist/sofinder-picker.js');
        self::assertIsString($bundle);
        self::assertStringContainsString('sofinder:select', $bundle);
        self::assertStringContainsString('openPicker', $bundle);
        self::assertDoesNotMatchRegularExpression('/\bfrom\s+["\']\.\//', $bundle, 'The picker asset route must remain a self-contained ES module.');
    }

    public function testOnlyManifestChunksCanBeServedWithoutPathTraversal(): void
    {
        $package = dirname(__DIR__);
        $manifest = json_decode((string) file_get_contents($package . '/dist/manifest.json'), true, 512, JSON_THROW_ON_ERROR);
        $chunk = null;
        foreach ($manifest as $entry) if (is_array($entry) && is_string($entry['file'] ?? null) && $entry['file'] !== 'sofinder.js' && $entry['file'] !== 'sofinder-picker.js') { $chunk = $entry['file']; break; }
        self::assertIsString($chunk);
        $controller = new AssetController($package);

        self::assertSame(200, $controller($chunk)->getStatusCode());
        self::assertSame(404, $controller('../sofinder.js')->getStatusCode());
        self::assertSame(404, $controller('manifest.json')->getStatusCode());
    }

    public function testManifestAssetThatIsMissingReturnsServiceUnavailable(): void
    {
        $package = sys_get_temp_dir() . '/sofinder-asset-' . bin2hex(random_bytes(8));
        mkdir($package . '/dist', 0775, true);
        file_put_contents($package . '/dist/manifest.json', json_encode(['src/lazy.ts' => ['file' => 'missing-ABC.js']], JSON_THROW_ON_ERROR));
        try { self::assertSame(503, (new AssetController($package))('missing-ABC.js')->getStatusCode()); }
        finally { @unlink($package . '/dist/manifest.json'); @rmdir($package . '/dist'); @rmdir($package); }
    }
}
