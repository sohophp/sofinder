<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Exception\InvalidPathException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Value\ResourceType;

final class SecurityFuzzTest extends TestCase
{
    #[DataProvider('ambiguousUnicodePaths')]
    public function testRejectsUnicodeSeparatorAndDirectionAmbiguity(string $path): void
    {
        $this->expectException(InvalidPathException::class);
        (new PathGuard())->normalize($path);
    }

    /** @return iterable<string,array{string}> */
    public static function ambiguousUnicodePaths(): iterable
    {
        $characters = [
            'fraction-slash' => "\u{2044}", 'division-slash' => "\u{2215}",
            'big-solidus' => "\u{29F8}", 'fullwidth-slash' => "\u{FF0F}",
            'fullwidth-backslash' => "\u{FF3C}", 'zero-width-space' => "\u{200B}",
            'bom' => "\u{FEFF}", 'bidi-override' => "\u{202E}", 'noncharacter' => "\u{FDD0}",
        ];
        foreach ($characters as $name => $character) {
            yield $name . '-middle' => ['folder/re' . $character . 'port.txt'];
            yield $name . '-prefix' => [$character . 'report.txt'];
            yield $name . '-suffix' => ['report' . $character];
        }
    }

    public function testCompressedZipBombIsNeverExpandedDuringInspection(): void
    {
        if (!class_exists(\ZipArchive::class)) self::markTestSkipped('ZIP is not installed.');
        $path = tempnam(sys_get_temp_dir(), 'sofinder-zip-bomb-') ?: throw new \RuntimeException();
        $zip = new \ZipArchive();
        self::assertTrue($zip->open($path, \ZipArchive::OVERWRITE) === true);
        self::assertTrue($zip->addFromString('expanded.bin', str_repeat("\0", 8 * 1024 * 1024)));
        $zip->setCompressionName('expanded.bin', \ZipArchive::CM_DEFLATE, 9);
        $zip->close();
        try {
            self::assertLessThan(100_000, filesize($path));
            $images = $this->createMock(ImageProcessorInterface::class);
            $images->expects(self::never())->method('dimensions');
            $inspected = (new DefaultFileInspector($images))->inspect($path, 'payload.zip', new ResourceType('Files', '/tmp', '', ['zip'], maxSize: 1_000_000));
            self::assertSame(filesize($path), $inspected->size);
        } finally { @unlink($path); }
    }

    #[DataProvider('malformedImages')]
    public function testMalformedAndOversizedImageHeadersFailClosed(string $extension, string $bytes): void
    {
        if (!extension_loaded('gd')) self::markTestSkipped('GD is not installed.');
        $path = tempnam(sys_get_temp_dir(), 'sofinder-malformed-image-') ?: throw new \RuntimeException();
        file_put_contents($path, $bytes);
        try {
            $resource = new ResourceType('Images', '/tmp', '', [$extension], maxImagePixels: 1_000_000, maxImageWidth: 2000, maxImageHeight: 2000);
            try {
                (new DefaultFileInspector(new GdImageProcessor(1_000_000)))->inspect($path, 'image.' . $extension, $resource);
                self::fail('Malformed or oversized image data must fail closed.');
            } catch (SoFinderException $exception) {
                self::assertContains($exception->errorCode, ['invalid_image', 'image_too_large', 'unsupported_image']);
            }
        } finally { @unlink($path); }
    }

    /** @return iterable<string,array{string,string}> */
    public static function malformedImages(): iterable
    {
        yield 'oversized gif header' => ['gif', 'GIF89a' . pack('vv', 65535, 65535) . "\x80\0\0"];
        yield 'truncated jpeg' => ['jpg', "\xFF\xD8\xFF\xE0\0\x10JFIF\0\x01\x01"];
        $ihdr = 'IHDR' . pack('NNCCCCC', 50_000, 50_000, 8, 2, 0, 0, 0);
        $chunk = pack('N', 13) . $ihdr . pack('N', crc32($ihdr));
        yield 'oversized png header' => ['png', "\x89PNG\r\n\x1A\n" . $chunk];
    }
}
