<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Image\WatermarkFontResolver;
use Symfony\Component\Filesystem\Filesystem;

final class WatermarkFontResolverTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-font-resolver-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        (new Filesystem())->remove($this->directory);
    }

    public function testConfiguredReadableFontTakesPriorityWithoutDownloading(): void
    {
        $font = $this->directory . '/configured.ttf';
        file_put_contents($font, "\x00\x01\x00\x00fixture");
        $downloads = 0;
        $resolver = new WatermarkFontResolver($font, $this->directory, true, static function () use (&$downloads): string {
            ++$downloads;
            return '';
        }, ['interface' => []]);

        self::assertSame($font, $resolver->resolve());
        self::assertSame($font, $resolver->resolve());
        self::assertSame(0, $downloads);
    }

    public function testAutoDownloadCanBeDisabled(): void
    {
        $downloads = 0;
        $resolver = new WatermarkFontResolver(null, $this->directory, false, static function () use (&$downloads): string {
            ++$downloads;
            return '';
        }, ['interface' => []]);

        self::assertNull($resolver->resolve());
        self::assertSame(0, $downloads);
    }

    public function testRejectsDownloadedContentThatIsNotThePinnedFont(): void
    {
        $resolver = new WatermarkFontResolver(null, $this->directory, true, static fn (): string => 'not a font', ['interface' => []]);

        self::assertNull($resolver->resolve());
        self::assertFileDoesNotExist($this->directory . '/fonts/NotoSansCJKsc-Bold.otf');
    }

    public function testSelectedSerifUsesItsOwnPinnedSource(): void
    {
        $requested = '';
        $resolver = new WatermarkFontResolver(null, $this->directory, true, static function (string $url) use (&$requested): string {
            $requested = $url;
            return 'not a font';
        }, ['serif' => []]);

        self::assertNull($resolver->resolve('serif'));
        self::assertStringContainsString('NotoSerifCJKsc-SemiBold.otf', $requested);
    }
}
