<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdImageProcessor;

final class GdImageProcessorTest extends TestCase
{
    private string $source;
    private string $destination;

    protected function setUp(): void
    {
        if (!extension_loaded('gd')) {
            self::markTestSkipped('GD is not installed.');
        }
        $this->source = tempnam(sys_get_temp_dir(), 'sofinder-image-source-') ?: throw new \RuntimeException('Unable to create image fixture.');
        $this->destination = tempnam(sys_get_temp_dir(), 'sofinder-image-destination-') ?: throw new \RuntimeException('Unable to create image output.');
        $image = imagecreatetruecolor(400, 200);
        imagealphablending($image, false);
        imagesavealpha($image, true);
        imagefill($image, 0, 0, imagecolorallocatealpha($image, 20, 80, 160, 40));
        imagepng($image, $this->source);
        unset($image);
    }

    protected function tearDown(): void
    {
        @unlink($this->source);
        @unlink($this->destination);
    }

    public function testCreatesProportionalThumbnail(): void
    {
        (new GdImageProcessor())->thumbnail($this->source, $this->destination, 100, 100);

        $size = getimagesize($this->destination);
        self::assertIsArray($size);
        self::assertSame(100, $size[0]);
        self::assertSame(50, $size[1]);
        self::assertSame('image/png', $size['mime']);
    }

    public function testReportsImageDimensions(): void
    {
        self::assertSame(['width' => 400, 'height' => 200], (new GdImageProcessor())->dimensions($this->source));
    }

    public function testRotatesWithoutChangingTheImageFormat(): void
    {
        (new GdImageProcessor())->transform($this->source, $this->destination, 90, 0, 0);

        $size = getimagesize($this->destination);
        self::assertIsArray($size);
        self::assertSame(200, $size[0]);
        self::assertSame(400, $size[1]);
        self::assertSame('image/png', $size['mime']);
    }

    public function testRejectsImageOverConfiguredPixelLimit(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('format or dimensions');
        (new GdImageProcessor(100))->thumbnail($this->source, $this->destination, 50, 50);
    }

    public function testCropsRequestedRectangle(): void
    {
        (new GdImageProcessor())->crop($this->source, $this->destination, 20, 30, 120, 80);

        $size = getimagesize($this->destination);
        self::assertIsArray($size);
        self::assertSame(120, $size[0]);
        self::assertSame(80, $size[1]);
        self::assertSame('image/png', $size['mime']);
    }

    public function testPlacesImageWatermarkAtCustomPercentageCoordinates(): void
    {
        $watermark = tempnam(sys_get_temp_dir(), 'sofinder-watermark-') ?: throw new \RuntimeException('Unable to create watermark fixture.');
        $mark = imagecreatetruecolor(20, 10);
        imagefill($mark, 0, 0, imagecolorallocate($mark, 240, 20, 20));
        imagepng($mark, $watermark);
        unset($mark);

        try {
            (new GdImageProcessor())->imageWatermark($this->source, $watermark, $this->destination, 'custom', 100, 10, 88, 100, 100);
            $result = imagecreatefrompng($this->destination);
            self::assertInstanceOf(\GdImage::class, $result);
            $bottomRight = imagecolorsforindex($result, imagecolorat($result, 399, 199));
            $topLeft = imagecolorsforindex($result, imagecolorat($result, 0, 0));
            self::assertGreaterThan($bottomRight['blue'], $bottomRight['red']);
            self::assertGreaterThan($topLeft['red'], $topLeft['blue']);
            unset($result);
        } finally {
            @unlink($watermark);
        }
    }

    public function testTallImageWatermarkIsScaledToFitTheImageHeight(): void
    {
        $watermark = tempnam(sys_get_temp_dir(), 'sofinder-watermark-tall-') ?: throw new \RuntimeException('Unable to create watermark fixture.');
        $mark = imagecreatetruecolor(100, 800);
        imagefill($mark, 0, 0, imagecolorallocate($mark, 240, 20, 20));
        imagepng($mark, $watermark);
        unset($mark);

        try {
            (new GdImageProcessor())->imageWatermark($this->source, $watermark, $this->destination, 'custom', 100, 25, 95, 0, 0);
            $result = imagecreatefrompng($this->destination);
            self::assertInstanceOf(\GdImage::class, $result);
            $inside = imagecolorsforindex($result, imagecolorat($result, 24, 100));
            $outside = imagecolorsforindex($result, imagecolorat($result, 25, 100));
            self::assertGreaterThan($inside['blue'], $inside['red']);
            self::assertGreaterThan($outside['red'], $outside['blue']);
            unset($result);
        } finally {
            @unlink($watermark);
        }
    }

    public function testRejectsIncompleteCustomWatermarkCoordinates(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('percentages between 0 and 100');
        (new GdImageProcessor())->textWatermark($this->source, $this->destination, 'mark', 'custom', 60, 25, '#ffffff', 88, 50, null);
    }

    public function testRejectsCropOutsideImage(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('outside the image');
        (new GdImageProcessor())->crop($this->source, $this->destination, 390, 190, 20, 20);
    }

    public function testAvifIsDecodedAndThumbnailIsBrowserSafePngWhenAvailable(): void
    {
        $processor = new GdImageProcessor();
        if (!$processor->supports('image/avif')) {
            self::markTestSkipped('This GD build has no AVIF codec.');
        }
        $avif = tempnam(sys_get_temp_dir(), 'sofinder-avif-') ?: throw new \RuntimeException('Unable to create AVIF fixture.');
        $image = imagecreatetruecolor(64, 32);
        imagefill($image, 0, 0, imagecolorallocate($image, 25, 90, 180));
        imageavif($image, $avif, 80);
        unset($image);
        try {
            self::assertSame(['width' => 64, 'height' => 32], $processor->validate($avif));
            $processor->thumbnail($avif, $this->destination, 32, 32);
            $size = getimagesize($this->destination);
            self::assertIsArray($size);
            self::assertSame([32, 16], [$size[0], $size[1]]);
            self::assertSame('image/png', $size['mime']);
        } finally {
            @unlink($avif);
        }
    }

    public function testBaselineFormatsAreReallyDecoded(): void
    {
        $formats = [
            'image/jpeg' => static fn (\GdImage $image, string $path): bool => imagejpeg($image, $path, 85),
            'image/png' => static fn (\GdImage $image, string $path): bool => imagepng($image, $path),
            'image/gif' => static fn (\GdImage $image, string $path): bool => imagegif($image, $path),
        ];
        if (function_exists('imagewebp')) {
            $formats['image/webp'] = static fn (\GdImage $image, string $path): bool => imagewebp($image, $path, 85);
        }
        if (function_exists('imagebmp')) {
            $formats['image/bmp'] = static fn (\GdImage $image, string $path): bool => imagebmp($image, $path);
        }

        $processor = new GdImageProcessor();
        foreach ($formats as $mime => $write) {
            $path = tempnam(sys_get_temp_dir(), 'sofinder-gd-format-') ?: throw new \RuntimeException('Unable to create image fixture.');
            $image = imagecreatetruecolor(32, 16);
            imagefill($image, 0, 0, imagecolorallocate($image, 30, 100, 180));
            self::assertTrue($write($image, $path), $mime);
            unset($image);
            try {
                self::assertTrue($processor->supports($mime), $mime);
                self::assertSame(['width' => 32, 'height' => 16], $processor->validate($path), $mime);
                $processor->thumbnail($path, $this->destination, 16, 16);
                self::assertSame('image/png', getimagesize($this->destination)['mime'] ?? null, $mime);
            } finally {
                @unlink($path);
            }
        }
    }

    public function testPngThumbnailPreservesTransparency(): void
    {
        (new GdImageProcessor())->thumbnail($this->source, $this->destination, 100, 100);
        $thumbnail = imagecreatefrompng($this->destination);
        self::assertInstanceOf(\GdImage::class, $thumbnail);
        try {
            self::assertGreaterThan(0, (imagecolorat($thumbnail, 0, 0) >> 24) & 0x7F);
        } finally {
            unset($thumbnail);
        }
    }
}
