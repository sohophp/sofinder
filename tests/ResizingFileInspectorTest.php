<?php
declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageUploadResizeOptions;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\ResizingFileInspector;
use SohoPHP\SoFinder\Value\ResourceType;

final class ResizingFileInspectorTest extends TestCase
{
    private string $directory;
    private string $path;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-resizing-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0700);
        $this->path = $this->directory . '/quarantine.png';
        imagepng(imagecreatetruecolor(16, 2), $this->path);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') as $file) unlink($file);
        foreach (glob($this->directory . '/.sofinder-image-*') as $file) unlink($file);
        rmdir($this->directory);
    }

    private function inspector(string $fallback = 'reject'): ResizingFileInspector
    {
        $images = new GdImageProcessor();
        return new ResizingFileInspector(new DefaultFileInspector($images), $images,
            new ImageUploadResizeOptions(['formats' => ['png'], 'max_width' => 8, 'max_height' => 8, 'other_formats' => $fallback]));
    }

    public function testResizePolicyAppliesEvenWhenResourceAcceptsOriginalDimensions(): void
    {
        $resource = new ResourceType('Images', $this->directory, '/images', ['png'], maxImageWidth: 32, maxImageHeight: 32);
        $result = $this->inspector()->inspect($this->path, 'image.png', $resource);
        self::assertSame([8, 1], array_slice(getimagesize($this->path), 0, 2));
        self::assertSame(8, $result->imageWidth);
        self::assertSame(0600, fileperms($this->path) & 0777);
        self::assertSame([], glob($this->directory . '/.sofinder-image-*'));
    }

    public function testResourcePixelLimitCannotBeRelaxedByResize(): void
    {
        $resource = new ResourceType('Images', $this->directory, '/images', ['png'], maxImageWidth: 8, maxImageHeight: 8, maxImagePixels: 16);
        $before = hash_file('sha256', $this->path);
        try { $this->inspector()->inspect($this->path, 'image.png', $resource); self::fail('Pixel limit was bypassed.'); }
        catch (SoFinderException $error) { self::assertSame('image_too_large', $error->errorCode); }
        self::assertSame($before, hash_file('sha256', $this->path));
        self::assertSame([], glob($this->directory . '/.sofinder-image-*'));
    }

    public function testUnselectedFormatNeedsExplicitPreservationOutsideDimensionLimits(): void
    {
        imagebmp(imagecreatetruecolor(16, 2), $this->path);
        $resource = new ResourceType('Images', $this->directory, '/images', ['bmp'], maxImageWidth: 8, maxImageHeight: 8);
        $before = hash_file('sha256', $this->path);
        try { $this->inspector()->inspect($this->path, 'image.bmp', $resource); self::fail('Unselected oversized format was accepted.'); }
        catch (SoFinderException $error) { self::assertSame('image_too_large', $error->errorCode); }
        self::assertSame(16, $this->inspector('preserve')->inspect($this->path, 'image.bmp', $resource)->imageWidth);
        self::assertSame($before, hash_file('sha256', $this->path));
        self::assertSame([], glob($this->directory . '/.sofinder-image-*'));
    }
}
