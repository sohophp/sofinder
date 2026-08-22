<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;

final class ImageFormatRegistryTest extends TestCase
{
    #[DataProvider('formatAliases')]
    public function testExtensionAndMimeAliasesResolveToOneFormat(string $extension, string $mime, string $format): void
    {
        $registry = new ImageFormatRegistry();

        self::assertSame($format, $registry->formatForExtension($extension));
        self::assertSame($format, $registry->formatForMime($mime));
        self::assertTrue($registry->mimeMatches($format, $mime));
    }

    /** @return iterable<string, array{string, string, string}> */
    public static function formatAliases(): iterable
    {
        yield 'JPEG extension alias' => ['.jpg', 'image/jpeg', 'jpeg'];
        yield 'BMP MIME alias' => ['bmp', 'image/x-bmp', 'bmp'];
        yield 'ICO MIME alias' => ['ico', 'image/x-icon', 'ico'];
    }

    public function testOnlyBrowserSafeFormatsAreWebEmbeddable(): void
    {
        $registry = new ImageFormatRegistry();

        self::assertTrue($registry->isWebEmbeddableMime('image/png'));
        self::assertTrue($registry->isWebEmbeddableMime('image/vnd.microsoft.icon'));
        self::assertFalse($registry->isWebEmbeddableMime('image/heic'));
        self::assertFalse($registry->isWebEmbeddableMime('image/tiff'));
        self::assertFalse($registry->isWebEmbeddableMime('image/svg+xml'));
    }

    public function testNonWebImageFormatsAreNotRegisteredForImageProcessing(): void
    {
        $registry = new ImageFormatRegistry();

        foreach (['heic', 'heif', 'tif', 'tiff'] as $extension) {
            self::assertNull($registry->formatForExtension($extension));
        }
        foreach (['image/heic', 'image/heif', 'image/tiff', 'image/x-tiff'] as $mime) {
            self::assertNull($registry->formatForMime($mime));
        }
    }
}
