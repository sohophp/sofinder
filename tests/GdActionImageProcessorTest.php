<?php
declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdActionImageProcessor;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageActionOptions;

final class GdActionImageProcessorTest extends TestCase
{
    private string $directory;
    protected function setUp(): void { $this->directory = sys_get_temp_dir() . '/sofinder-actions-' . bin2hex(random_bytes(8)); mkdir($this->directory, 0700); }
    protected function tearDown(): void { foreach (glob($this->directory . '/*') as $file) unlink($file); rmdir($this->directory); }

    #[DataProvider('formats')]
    public function testConfiguredGdFormatsRoundTripOrReportUnavailable(string $format, string $mime): void
    {
        $processor = new GdActionImageProcessor();
        $capability = array_values(array_filter($processor->capabilities(), static fn (array $item): bool => $item['format'] === $format))[0];
        self::assertSame($processor->supports($mime), $capability['read']);
        if (!$processor->supports($mime)) { self::assertFalse($capability['edit']); return; }
        $source = $this->directory . '/source.' . $format; $output = $this->directory . '/output.' . $format;
        $image = imagecreatetruecolor(4, 2); imagefill($image, 0, 0, imagecolorallocate($image, 90, 130, 190));
        $saved = match ($format) { 'jpeg' => imagejpeg($image, $source), 'png' => imagepng($image, $source), 'gif' => imagegif($image, $source),
            'webp' => imagewebp($image, $source), 'avif' => imageavif($image, $source), 'bmp' => imagebmp($image, $source), default => false };
        self::assertTrue($saved);
        $before = hash_file('sha256', $source);
        $processor->applyActions($source, $output, [['type' => 'resize', 'width' => 2, 'height' => 1]]);
        self::assertSame(['width' => 2, 'height' => 1], $processor->validate($output));
        self::assertSame($mime, getimagesize($output)['mime']);
        self::assertSame($before, hash_file('sha256', $source));
    }

    /** @return list<array{string,string}> */
    public static function formats(): array { return [['jpeg','image/jpeg'],['png','image/png'],['gif','image/gif'],['webp','image/webp'],['avif','image/avif'],['bmp','image/bmp']]; }

    public function testOrientationCanBeConfiguredWithoutHostImageCode(): void
    {
        $source = $this->directory . '/exif.jpg';
        $image = imagecreatetruecolor(4, 2); imagejpeg($image, $source);
        $jpeg = file_get_contents($source);
        $tiff = "II\x2a\x00" . pack('V', 8) . pack('v', 1) . pack('vvVv', 0x0112, 3, 1, 6) . "\x00\x00" . pack('V', 0);
        $exif = "Exif\x00\x00" . $tiff;
        file_put_contents($source, substr($jpeg, 0, 2) . "\xff\xe1" . pack('n', strlen($exif) + 2) . $exif . substr($jpeg, 2));
        self::assertSame(6, exif_read_data($source)['Orientation']);
        $raw = new GdActionImageProcessor(new ImageActionOptions(['auto_orientation' => false]));
        $oriented = new GdActionImageProcessor();
        self::assertSame(['width' => 4, 'height' => 2], $raw->validate($source));
        self::assertSame(['width' => 2, 'height' => 4], $oriented->validate($source));
        self::assertSame($oriented->validate($source), (new GdImageProcessor())->validate($source));
        $oriented->applyActions($source, $this->directory . '/oriented.jpg', [['type' => 'rotate', 'degrees' => 0]]);
        self::assertSame([2, 4], array_slice(getimagesize($this->directory . '/oriented.jpg'), 0, 2));
        self::assertNotSame($raw->cacheVersion(), $oriented->cacheVersion());
    }

    public function testAnimationRequiresExplicitPolicyAndLeavesSourceUnchanged(): void
    {
        $source = $this->directory . '/animated.gif'; $output = $this->directory . '/edited.gif';
        $single = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', true);
        $animated = substr($single, 0, 19) . str_repeat(substr($single, 19, -1), 2) . "\x3b";
        file_put_contents($source, $animated);
        try { (new GdActionImageProcessor())->applyActions($source, $output, [['type' => 'rotate', 'degrees' => 90]]); self::fail('Animation was implicitly accepted.'); }
        catch (SoFinderException $error) { self::assertSame('animated_image_edit_unsupported', $error->errorCode); }
        self::assertFileDoesNotExist($output);
        $processor = new GdActionImageProcessor(new ImageActionOptions(['animated_editing' => 'first_frame']));
        $processor->applyActions($source, $output, [['type' => 'rotate', 'degrees' => 90]]);
        self::assertFalse($processor->isAnimated($output));
        self::assertSame($animated, file_get_contents($source));
    }

    public function testFormatsAndActionsAreIndependentConfigurationBounds(): void
    {
        $processor = new GdActionImageProcessor(new ImageActionOptions(['formats' => ['png', 'bmp'], 'editable_formats' => ['png'], 'actions' => ['crop']]));
        self::assertTrue($processor->supports('image/x-ms-bmp'));
        self::assertFalse($processor->supports('image/jpeg'));
        self::assertSame(['crop'], $processor->supportedActions());
        $bmp = array_values(array_filter($processor->capabilities(), static fn (array $item): bool => $item['format'] === 'bmp'))[0];
        self::assertTrue($bmp['read']); self::assertFalse($bmp['edit']);
        $source = $this->directory . '/source.png'; imagepng(imagecreatetruecolor(4, 2), $source);
        $before = hash_file('sha256', $source);
        try { $processor->applyActions($source, $this->directory . '/output.png', [['type' => 'resize', 'width' => 2, 'height' => 1]]); self::fail('Disabled resize was accepted.'); }
        catch (SoFinderException $error) { self::assertSame('invalid_image_action', $error->errorCode); }
        self::assertSame($before, hash_file('sha256', $source));
        self::assertFileDoesNotExist($this->directory . '/output.png');
    }

    public function testUploadQualityArgumentIsIndependentOfActionEncodingPolicy(): void
    {
        $source = $this->directory . '/source.jpg';
        imagejpeg(imagecreatetruecolor(4, 2), $source);
        $expected = $this->directory . '/expected.jpg';
        imagejpeg(imagecreatefromjpeg($source), $expected, 100);
        $processor = new GdActionImageProcessor(new ImageActionOptions(['quality' => 20, 'resize_quality' => 30]));
        $processor->transform($source, $this->directory . '/upload.jpg', 0, 4, 2, 100);
        self::assertSame(hash_file('sha256', $expected), hash_file('sha256', $this->directory . '/upload.jpg'));
        $processor->applyActions($source, $this->directory . '/action.jpg', [['type' => 'resize', 'width' => 4, 'height' => 2]]);
        self::assertNotSame(hash_file('sha256', $expected), hash_file('sha256', $this->directory . '/action.jpg'));
    }

    public function testPngCropAndRotationRetainRgbaAndLeaveSourceUnchanged(): void
    {
        $source = $this->directory . '/transparent.png';
        $image = imagecreatetruecolor(4, 3);
        imagealphablending($image, false); imagesavealpha($image, true);
        for ($x = 0; $x < 4; ++$x) for ($y = 0; $y < 3; ++$y) {
            imagesetpixel($image, $x, $y, imagecolorallocatealpha($image, $x * 50, $y * 70, 90, [0, 64, 127][($x + $y) % 3]));
        }
        imagepng($image, $source);
        $before = hash_file('sha256', $source);
        $output = $this->directory . '/edited.png';
        (new GdActionImageProcessor())->applyActions($source, $output,
            [['type' => 'crop', 'x' => 1, 'y' => 0, 'width' => 3, 'height' => 3], ['type' => 'rotate', 'degrees' => 90]]);
        $result = imagecreatefrompng($output);
        self::assertSame([3, 3], [imagesx($result), imagesy($result)]);
        for ($x = 0; $x < 3; ++$x) for ($y = 0; $y < 3; ++$y) {
            self::assertSame(imagecolorsforindex($image, imagecolorat($image, $y + 1, 2 - $x)),
                imagecolorsforindex($result, imagecolorat($result, $x, $y)));
        }
        self::assertSame($before, hash_file('sha256', $source));
    }

    public function testInvalidPolicyCannotSilentlyExpandCapabilities(): void
    {
        foreach ([['formats' => ['svg']], ['formats' => []], ['formats' => ['png', 'png']],
            ['formats' => ['png'], 'editable_formats' => ['jpeg']], ['actions' => ['optimize']],
            ['animated_editing' => 'allow'], ['auto_orientation' => 'false'], ['max_width' => 0],
            ['quality' => 101], ['unexpected' => true]] as $configuration) {
            try { new ImageActionOptions($configuration); self::fail('Invalid policy was accepted.'); }
            catch (\InvalidArgumentException) { self::addToAssertionCount(1); }
        }
    }
}
