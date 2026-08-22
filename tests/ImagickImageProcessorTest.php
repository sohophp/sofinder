<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;

final class ImagickImageProcessorTest extends TestCase
{
    private string $source;
    private string $destination;

    protected function setUp(): void
    {
        if (!extension_loaded('imagick')) {
            self::markTestSkipped('Imagick is not installed.');
        }
        $this->source = tempnam(sys_get_temp_dir(), 'sofinder-imagick-source-') ?: throw new \RuntimeException('Unable to create image fixture.');
        $this->destination = tempnam(sys_get_temp_dir(), 'sofinder-imagick-output-') ?: throw new \RuntimeException('Unable to create image output.');
    }

    protected function tearDown(): void
    {
        if (isset($this->source)) {
            @unlink($this->source);
        }
        if (isset($this->destination)) {
            @unlink($this->destination);
        }
    }

    public function testIcoCanBeDecodedThumbnailedAndEditedWhenCoderIsAvailable(): void
    {
        if (\Imagick::queryFormats('ICO') === []) {
            self::markTestSkipped('Imagick ICO support is not installed.');
        }
        $processor = new ImagickImageProcessor();
        if (!$processor->canEncode('image/vnd.microsoft.icon')) {
            self::markTestSkipped('The installed ICO coder cannot complete a write round trip.');
        }
        $image = new \Imagick();
        try {
            $image->newImage(80, 40, new \ImagickPixel('rgba(25,90,180,0.5)'), 'ICO');
            $image->setImageFormat('ICO');
            self::assertTrue($image->writeImage($this->source));
        } finally {
            $image->clear();
            $image->destroy();
        }

        self::assertTrue($processor->supports('image/vnd.microsoft.icon'));
        self::assertSame(['width' => 80, 'height' => 40], $processor->validate($this->source));
        $processor->thumbnail($this->source, $this->destination, 40, 40);
        $info = getimagesize($this->destination);
        self::assertIsArray($info);
        self::assertSame([40, 20, 'image/png'], [$info[0], $info[1], $info['mime']]);

        $processor->transform($this->source, $this->destination, 0, 20, 20, 85);
        $result = new \Imagick('ICO:' . $this->destination);
        try {
            self::assertSame('ICO', $result->getImageFormat());
            self::assertSame([20, 10], [$result->getImageWidth(), $result->getImageHeight()]);
        } finally {
            $result->clear();
            $result->destroy();
        }
    }

    #[DataProvider('unsupportedContentProvider')]
    public function testNonWebAndDelegateFormatsAreNeverAutoDetected(string $content): void
    {
        file_put_contents($this->source, $content);

        try {
            (new ImagickImageProcessor())->validate($this->source);
            self::fail('A format outside the web-image registry must not reach ImageMagick.');
        } catch (SoFinderException $exception) {
            self::assertSame('unsupported_image', $exception->errorCode);
        }
    }

    /** @return iterable<string, array{string}> */
    public static function unsupportedContentProvider(): iterable
    {
        yield 'TIFF' => ["II*\0\x08\0\0\0ordinary-file"];
        yield 'SVG' => ['<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"/>'];
        yield 'PDF' => ['%PDF-1.7 unsupported'];
    }

    #[DataProvider('orientationProvider')]
    public function testExifOrientationsAreAppliedToDimensions(int $orientation, int $expectedWidth, int $expectedHeight): void
    {
        if (!extension_loaded('gd') || \Imagick::queryFormats('JPEG') === []) {
            self::markTestSkipped('GD and Imagick JPEG support are required.');
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
}
