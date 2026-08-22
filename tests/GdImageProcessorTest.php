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

    public function testRejectsCropOutsideImage(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('outside the image');
        (new GdImageProcessor())->crop($this->source, $this->destination, 390, 190, 20, 20);
    }
}
