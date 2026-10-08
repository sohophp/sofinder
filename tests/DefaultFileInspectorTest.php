<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Value\ResourceType;

final class DefaultFileInspectorTest extends TestCase
{
    public function testBmpUsesDetectedMimeAndStillRejectsAMismatchedExtension(): void
    {
        if (!extension_loaded('gd') || !function_exists('imagebmp')) self::markTestSkipped('GD BMP is not installed.');
        $path = tempnam(sys_get_temp_dir(), 'sofinder-bmp-inspection-');
        if ($path === false) throw new \RuntimeException('Cannot create a BMP fixture.');
        try {
            $image = imagecreatetruecolor(16, 8);
            imagebmp($image, $path); unset($image);
            $inspector = new DefaultFileInspector(new GdImageProcessor());
            $resource = new ResourceType('Images', dirname($path), '/images', ['bmp', 'png']);
            $inspected = $inspector->inspect($path, 'image.bmp', $resource);
            self::assertSame((new \finfo(FILEINFO_MIME_TYPE))->file($path), $inspected->mimeType);
            self::assertSame(16, $inspected->imageWidth);
            self::assertSame(8, $inspected->imageHeight);
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('extension does not match');
            $inspector->inspect($path, 'image.png', $resource);
        } finally {
            unlink($path);
        }
    }

    public function testNonWebImageExtensionIsInspectedAsAnOrdinaryFile(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'sofinder-generic-tiff-');
        self::assertIsString($path);
        file_put_contents($path, "II*\0\x08\0\0\0ordinary-file");

        $images = $this->createMock(ImageProcessorInterface::class);
        $images->expects(self::never())->method('dimensions');
        $images->expects(self::never())->method('validate');
        $images->expects(self::never())->method('isAnimated');

        try {
            $inspected = (new DefaultFileInspector($images))->inspect(
                $path,
                'scan.tiff',
                new ResourceType('Files', '/tmp', '/files', ['tiff']),
            );

            self::assertGreaterThan(0, $inspected->size);
            self::assertNull($inspected->imageWidth);
            self::assertNull($inspected->imageHeight);
        } finally {
            @unlink($path);
        }
    }
}
