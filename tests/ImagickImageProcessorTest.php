<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Value\ImageProcessingLimits;
use SohoPHP\SoFinder\Value\ResourceType;

final class ImagickImageProcessorTest extends TestCase
{
    private string $source;
    private string $destination;

    protected function setUp(): void
    {
        if (!extension_loaded('imagick') || \Imagick::queryFormats('TIFF') === []) {
            self::markTestSkipped('Imagick TIFF support is not installed.');
        }
        $this->source = tempnam(sys_get_temp_dir(), 'sofinder-tiff-') ?: throw new \RuntimeException('Unable to create TIFF fixture.');
        $this->destination = tempnam(sys_get_temp_dir(), 'sofinder-image-output-') ?: throw new \RuntimeException('Unable to create image output.');
        $image = new \Imagick();
        $image->newImage(80, 40, new \ImagickPixel('#195ab4'), 'TIFF');
        $image->writeImage($this->source);
        $image->clear();
        $image->destroy();
    }

    protected function tearDown(): void
    {
        @unlink($this->source);
        @unlink($this->destination);
    }

    public function testTiffCanBeValidatedAndPreviewedAsPng(): void
    {
        $processor = new ImagickImageProcessor();
        self::assertTrue($processor->supports('image/tiff'));
        self::assertSame(['width' => 80, 'height' => 40], $processor->validate($this->source));

        $processor->thumbnail($this->source, $this->destination, 40, 40);
        $info = getimagesize($this->destination);
        self::assertIsArray($info);
        self::assertSame([40, 20], [$info[0], $info[1]]);
        self::assertSame('image/png', $info['mime']);
    }

    public function testTiffEditingPreservesItsFormat(): void
    {
        (new ImagickImageProcessor())->transform($this->source, $this->destination, 0, 20, 20, 85);
        $result = new \Imagick($this->destination);
        try {
            self::assertSame('TIFF', $result->getImageFormat());
            self::assertSame([20, 10], [$result->getImageWidth(), $result->getImageHeight()]);
        } finally {
            $result->clear();
            $result->destroy();
        }
    }

    public function testTiffUploadInspectorRequiresARealDecodableImage(): void
    {
        $inspected = (new DefaultFileInspector(new ImagickImageProcessor()))->inspect(
            $this->source,
            'scan.tiff',
            new ResourceType('Images', '/tmp', '/images', ['tiff'], allowedMimeTypes: ['image/tiff']),
        );

        self::assertSame('image/tiff', $inspected->mimeType);
        self::assertSame([80, 40], [$inspected->imageWidth, $inspected->imageHeight]);
    }

    public function testMultiPageTiffCanPreviewButCannotBeEdited(): void
    {
        $sequence = new \Imagick();
        foreach (['#195ab4', '#c73545'] as $colour) {
            $frame = new \Imagick();
            $frame->newImage(30, 20, new \ImagickPixel($colour), 'TIFF');
            $sequence->addImage($frame);
            $frame->clear();
            $frame->destroy();
        }
        $sequence->writeImages($this->source, true);
        $sequence->clear();
        $sequence->destroy();

        $processor = new ImagickImageProcessor();
        self::assertTrue($processor->isAnimated($this->source));
        $processor->thumbnail($this->source, $this->destination, 15, 15);
        self::assertSame('image/png', getimagesize($this->destination)['mime'] ?? null);

        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('multi-page');
        $processor->transform($this->source, $this->destination, 0, 10, 10);
    }

    public function testFrameAndTotalPixelLimitsAreEnforcedBeforeFullDecode(): void
    {
        $sequence = new \Imagick();
        foreach (['#111111', '#222222'] as $colour) {
            $frame = new \Imagick();
            $frame->newImage(20, 20, new \ImagickPixel($colour), 'TIFF');
            $sequence->addImage($frame);
            $frame->clear();
            $frame->destroy();
        }
        $sequence->writeImages($this->source, true);
        $sequence->clear();
        $sequence->destroy();

        $processor = new ImagickImageProcessor(
            new ImageFormatRegistry(),
            new ImageProcessingLimits(maxFrames: 1, maxTotalPixels: 10_000),
        );
        try {
            $processor->validate($this->source);
            self::fail('The frame limit should have rejected the image.');
        } catch (SoFinderException $exception) {
            self::assertSame('image_frame_limit_exceeded', $exception->errorCode);
        }

        $processor = new ImagickImageProcessor(
            new ImageFormatRegistry(),
            new ImageProcessingLimits(maxFrames: 10, maxTotalPixels: 700),
        );
        try {
            $processor->validate($this->source);
            self::fail('The cumulative pixel limit should have rejected the image.');
        } catch (SoFinderException $exception) {
            self::assertSame('image_pixel_limit_exceeded', $exception->errorCode);
        }
    }

    public function testDisallowedCoderIsNeverAutoDetected(): void
    {
        file_put_contents($this->source, '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"/>');

        try {
            (new ImagickImageProcessor())->validate($this->source);
            self::fail('SVG must not be delegated to ImageMagick.');
        } catch (SoFinderException $exception) {
            self::assertSame('unsupported_image', $exception->errorCode);
        }
    }

    #[DataProvider('orientationProvider')]
    public function testExifOrientationsAreAppliedToDimensions(int $orientation, int $expectedWidth, int $expectedHeight): void
    {
        if (\Imagick::queryFormats('JPEG') === []) {
            self::markTestSkipped('Imagick JPEG support is not installed.');
        }
        $image = imagecreatetruecolor(40, 20);
        self::assertInstanceOf(\GdImage::class, $image);
        imagejpeg($image, $this->source, 90);
        unset($image);
        $jpeg = file_get_contents($this->source);
        self::assertIsString($jpeg);
        $tiff = 'II' . pack('v', 42) . pack('V', 8) . pack('v', 1)
            . pack('v', 0x0112) . pack('v', 3) . pack('V', 1)
            . pack('v', $orientation) . "\0\0" . pack('V', 0);
        $app1 = "Exif\0\0" . $tiff;
        file_put_contents($this->source, substr($jpeg, 0, 2) . "\xFF\xE1" . pack('n', strlen($app1) + 2) . $app1 . substr($jpeg, 2));

        self::assertSame(
            ['width' => $expectedWidth, 'height' => $expectedHeight],
            (new ImagickImageProcessor())->dimensions($this->source),
        );
    }

    /** @return iterable<string, array{int, int, int}> */
    public static function orientationProvider(): iterable
    {
        yield 'normal' => [1, 40, 20];
        yield 'mirror horizontal' => [2, 40, 20];
        yield 'rotate 180' => [3, 40, 20];
        yield 'mirror vertical' => [4, 40, 20];
        yield 'transpose' => [5, 20, 40];
        yield 'rotate 90' => [6, 20, 40];
        yield 'transverse' => [7, 20, 40];
        yield 'rotate 270' => [8, 20, 40];
    }

    public function testOptionalRasterCodersAreReallyDecodedAndThumbnailed(): void
    {
        $processor = new ImagickImageProcessor();
        foreach (['HEIC', 'HEIF', 'ICO'] as $coder) {
            if (\Imagick::queryFormats($coder) === []) {
                continue;
            }
            $mime = (new ImageFormatRegistry())->canonicalMime(strtolower($coder));
            if ($mime === null || !$processor->canEncode($mime)) {
                continue;
            }
            $image = new \Imagick();
            $image->newImage(128, 64, new \ImagickPixel('rgba(30,100,180,0.5)'), $coder);
            $image->setImageFormat($coder);
            self::assertTrue($image->writeImage($this->source), $coder);
            $image->clear();
            $image->destroy();

            $detectedMime = (new \finfo(FILEINFO_MIME_TYPE))->file($this->source);
            self::assertIsString($detectedMime, $coder);
            self::assertTrue($processor->supports($detectedMime), $coder . ': ' . $detectedMime);
            self::assertSame(['width' => 128, 'height' => 64], $processor->validate($this->source), $coder);
            $processor->thumbnail($this->source, $this->destination, 16, 16);
            self::assertSame('image/png', getimagesize($this->destination)['mime'] ?? null, $coder);
        }
    }

    public function testCorruptedAllowlistedImageIsRejected(): void
    {
        file_put_contents($this->source, "II*\0\x08\0\0\0broken-tiff");

        try {
            (new ImagickImageProcessor())->validate($this->source);
            self::fail('A corrupt TIFF must not pass validation.');
        } catch (SoFinderException $exception) {
            self::assertContains($exception->errorCode, ['invalid_image', 'unsupported_image']);
        }
    }
}
