<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;

final class FrameworkBoundaryTest extends TestCase
{
    public function testCorePackageDoesNotImportFrameworkNamespaces(): void
    {
        $root = dirname(__DIR__);
        $source = $root . '/packages/sofinder-core/src';
        $violations = [];
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($source, \FilesystemIterator::SKIP_DOTS));
        foreach ($files as $file) {
            if (!$file instanceof \SplFileInfo || $file->getExtension() !== 'php') {
                continue;
            }
            $contents = (string) file_get_contents($file->getPathname());
            if (preg_match('/(?:^|\\\\)(?:Symfony|Illuminate|Slim|Mezzio)(?:\\\\|;)/m', $contents) === 1) {
                $violations[] = str_replace($root . '/', '', $file->getPathname());
            }
        }

        self::assertSame([], $violations, 'The Core package must remain independent of every supported framework.');
    }

    public function testCoreContractsDoNotDependOnSymfonyHttpFoundation(): void
    {
        foreach (glob(dirname(__DIR__) . '/packages/sofinder-core/src/Contract/*.php') ?: [] as $file) {
            self::assertStringNotContainsString('Symfony\\Component\\HttpFoundation', (string) file_get_contents($file), basename($file));
        }
    }

    public function testSymfonyBridgeDoesNotImportOtherFrameworks(): void
    {
        $root = dirname(__DIR__);
        $source = $root . '/packages/sofinder-symfony/src';
        $violations = [];
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($source, \FilesystemIterator::SKIP_DOTS));
        foreach ($files as $file) {
            if (!$file instanceof \SplFileInfo || $file->getExtension() !== 'php') {
                continue;
            }
            $contents = (string) file_get_contents($file->getPathname());
            if (preg_match('/(?:^|\\\\)(?:Illuminate|Slim|Mezzio)(?:\\\\|;)/m', $contents) === 1) {
                $violations[] = str_replace($root . '/', '', $file->getPathname());
            }
        }

        self::assertSame([], $violations, 'The Symfony bridge must not depend on Laravel, Slim, or Mezzio.');
    }

    public function testCompatibilityPackageLoadsBridgeFromPhysicalPackage(): void
    {
        $class = new \ReflectionClass(\SohoPHP\SoFinder\SoFinderBundle::class);
        $file = (string) $class->getFileName();

        self::assertStringContainsString('/packages/sofinder-symfony/src/', $file);
        self::assertDirectoryDoesNotExist(dirname(__DIR__) . '/src');
    }

    public function testSymfonyPackageContainsReleaseAssets(): void
    {
        $root = dirname(__DIR__);
        self::assertFileExists($root . '/packages/sofinder-symfony/dist/manifest.json');
        self::assertSame(
            hash_file('sha256', $root . '/dist/manifest.json'),
            hash_file('sha256', $root . '/packages/sofinder-symfony/dist/manifest.json'),
        );
    }
}
