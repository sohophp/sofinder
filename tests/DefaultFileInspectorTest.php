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
    public function testBinaryPdfMarkerCanBeExplicitlyAllowedWhileDefaultStillRejects(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'sofinder-pdf-marker-');
        self::assertIsString($path);
        // Model the reported JPEG stream: the short tag crosses a read boundary.
        $contents = "%PDF-1.3\n1 0 obj\n<< /Subtype /Image /Filter /DCTDecode >>\nstream\n";
        $contents = str_pad($contents, 65_535, "\xff") . "<?=\xfe\x98\x91\nendstream\nendobj\n%%EOF\n";
        file_put_contents($path, $contents);
        $resource = new ResourceType('Files', dirname($path), '/files', ['pdf']);
        try {
            $allowed = (new DefaultFileInspector(new GdImageProcessor(), activeContentDetection: false))
                ->inspect($path, 'scan.pdf', $resource);
            self::assertSame('application/pdf', $allowed->mimeType);
            self::assertSame(strlen($contents), $allowed->size);
            self::assertSame($contents, file_get_contents($path));
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('active script content');
            (new DefaultFileInspector(new GdImageProcessor()))->inspect($path, 'scan.pdf', $resource);
        } finally {
            unlink($path);
        }
    }

    public function testDisabledDetectionStillEnforcesMimeAndSizeLimits(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'sofinder-disabled-detection-');
        self::assertIsString($path);
        file_put_contents($path, '%PDF-1.3 <?=');
        $inspector = new DefaultFileInspector(new GdImageProcessor(), activeContentDetection: false);
        try {
            foreach ([
                [new ResourceType('Files', '/tmp', '', maxSize: 1), 'size limit'],
                [new ResourceType('Files', '/tmp', '', allowedMimeTypes: ['text/plain']), 'allowed media type'],
            ] as [$resource, $message]) {
                try {
                    $inspector->inspect($path, 'scan.pdf', $resource);
                    self::fail('The remaining upload constraint must reject the file.');
                } catch (SoFinderException $error) {
                    self::assertStringContainsString($message, $error->getMessage());
                }
            }
            file_put_contents($path, '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
            $this->expectException(SoFinderException::class);
            $inspector->inspect($path, 'image.svg', new ResourceType('Images', '/tmp', ''));
        } finally {
            unlink($path);
        }
    }

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
