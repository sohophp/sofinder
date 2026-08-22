<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\HybridImageProcessor;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;

final class HybridImageProcessorTest extends TestCase
{
    public function testAutoUsesGdFirstAndImagickOnlyForMissingFormats(): void
    {
        $registry = new ImageFormatRegistry();
        $processor = new HybridImageProcessor($registry, new GdImageProcessor(), new ImagickImageProcessor(), 'auto');
        $capabilities = [];
        foreach ($processor->capabilities() as $capability) {
            $capabilities[$capability['format']] = $capability;
        }

        if (extension_loaded('gd')) {
            self::assertSame('gd', $capabilities['jpeg']['processor']);
        }
        if (extension_loaded('imagick') && \Imagick::queryFormats('TIFF') !== []) {
            self::assertSame('imagick', $capabilities['tiff']['processor']);
            self::assertSame((new ImagickImageProcessor())->canEncode('image/tiff'), $capabilities['tiff']['edit']);
        }
        self::assertFalse($capabilities['tiff']['webEmbeddable']);
        self::assertSame($processor->cacheVersion(), $processor->cacheVersion());
        self::assertSame(16, strlen($processor->cacheVersion()));
    }

    public function testForcedGdDoesNotClaimTiffSupport(): void
    {
        if (!extension_loaded('gd')) {
            self::markTestSkipped('GD is not installed.');
        }
        $registry = new ImageFormatRegistry();
        $processor = new HybridImageProcessor($registry, new GdImageProcessor(), new ImagickImageProcessor(), 'gd');

        self::assertTrue($processor->supports('image/jpeg'));
        self::assertFalse($processor->supports('image/tiff'));
        self::assertFalse($processor->supportsExtension('tiff'));
    }
}
