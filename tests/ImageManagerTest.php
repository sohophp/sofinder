<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Group;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\HybridImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Image\ImagickImageProcessor;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Filesystem\Filesystem;

final class ImageManagerTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        if (!extension_loaded('gd')) {
            self::markTestSkipped('GD is not installed.');
        }
        $this->directory = sys_get_temp_dir() . '/sofinder-image-manager-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        $image = imagecreatetruecolor(400, 200);
        imagepng($image, $this->directory . '/source.png');
        unset($image);
    }

    protected function tearDown(): void
    {
        (new Filesystem())->remove($this->directory);
    }

    public function testActionSequenceSavesCopyAndPreservesOriginal(): void
    {
        $images = $this->manager();
        $result = $images->applyActions('Images', 'source.png', [
            ['type' => 'crop', 'x' => 0, 'y' => 0, 'width' => 200, 'height' => 100],
            ['type' => 'resize', 'width' => 100, 'height' => 100, 'quality' => 80],
        ]);

        self::assertSame('source-edited.png', $result['entry']->name);
        self::assertSame(['width' => 400, 'height' => 200], $images->info('Images', 'source.png'));
        self::assertSame(['width' => 100, 'height' => 50], $images->info('Images', 'source-edited.png'));
        self::assertFileExists($this->directory . '/source.png');
    }

    public function testConfiguredPresetCreatesDerivedImage(): void
    {
        $result = $this->manager()->applyActions('Images', 'source.png', [['type' => 'preset', 'name' => 'thumb']]);
        self::assertSame(80, $result['result']['width']);
        self::assertSame(40, $result['result']['height']);
    }

    public function testThumbnailUsesConfiguredSharedFilesystemPermissions(): void
    {
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $type = new ResourceType('Images', $this->directory, '/images', allowedExtensions: ['png'], allowedMimeTypes: ['image/png']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/images'))]), $authorization, new EventDispatcher());
        $images = new ImageManager($files, new GdImageProcessor(), $this->directory . '/cache', formats: new ImageFormatRegistry(), directoryMode: 02775, fileMode: 0664);

        $thumbnail = $images->thumbnail('Images', 'source.png', 100, 100);

        self::assertSame(02775, fileperms($this->directory . '/cache/thumbnails') & 07777);
        self::assertSame(0664, fileperms($thumbnail['path']) & 07777);
    }

    #[Group('performance')]
    public function testConcurrentThumbnailRequestsProduceOneValidCacheObject(): void
    {
        if (!function_exists('pcntl_fork') || !function_exists('pcntl_waitpid')) self::markTestSkipped('pcntl is required.');
        $children = [];
        for ($worker = 0; $worker < 8; ++$worker) {
            $pid = pcntl_fork();
            self::assertNotSame(-1, $pid);
            if ($pid === 0) {
                try { $this->manager()->thumbnail('Images', 'source.png', 160, 120); exit(0); }
                catch (\Throwable) { exit(1); }
            }
            $children[] = $pid;
        }
        foreach ($children as $pid) { pcntl_waitpid($pid, $status); self::assertTrue(pcntl_wifexited($status) && pcntl_wexitstatus($status) === 0); }
        $files = glob($this->directory . '/cache/thumbnails/*.png') ?: [];
        self::assertCount(1, $files);
        self::assertSame('image/png', mime_content_type($files[0]));
    }

    public function testRepeatedImplicitCopyUsesConflictSafeName(): void
    {
        $images = $this->manager();
        $action = [['type' => 'crop', 'x' => 0, 'y' => 0, 'width' => 200, 'height' => 100]];

        self::assertSame('source-edited.png', $images->applyActions('Images', 'source.png', $action)['entry']->name);
        self::assertSame('source-edited-1.png', $images->applyActions('Images', 'source.png', $action)['entry']->name);
    }

    public function testCopyOfLegacyExtensionlessImageGetsAValidImageExtension(): void
    {
        copy($this->directory . '/source.png', $this->directory . '/legacy-image');

        $result = $this->manager()->applyActions('Images', 'legacy-image', [
            ['type' => 'crop', 'x' => 0, 'y' => 0, 'width' => 200, 'height' => 100],
        ]);

        self::assertSame('legacy-image-edited.png', $result['entry']->name);
        self::assertFileExists($this->directory . '/legacy-image-edited.png');
    }

    public function testCustomCopyNameWithoutExtensionKeepsTheImageFormat(): void
    {
        $result = $this->manager()->applyActions('Images', 'source.png', [
            ['type' => 'crop', 'x' => 0, 'y' => 0, 'width' => 200, 'height' => 100],
        ], ['mode' => 'copy', 'name' => 'custom-copy']);

        self::assertSame('custom-copy.png', $result['entry']->name);
    }

    public function testEditedCopyCannotChangeItsFileExtension(): void
    {
        try {
            $this->manager()->applyActions('Images', 'source.png', [
                ['type' => 'crop', 'x' => 0, 'y' => 0, 'width' => 200, 'height' => 100],
            ], ['mode' => 'copy', 'name' => 'custom-copy.jpg']);
            self::fail('An edited image must not change its extension.');
        } catch (SoFinderException $exception) {
            self::assertSame('image_extension_change_not_allowed', $exception->errorCode);
            self::assertStringContainsString('.png', $exception->getMessage());
        }
    }

    public function testEditedCopyCannotChangeExtensionCase(): void
    {
        try {
            $this->manager()->applyActions('Images', 'source.png', [
                ['type' => 'crop', 'x' => 0, 'y' => 0, 'width' => 200, 'height' => 100],
            ], ['mode' => 'copy', 'name' => 'custom-copy.PNG']);
            self::fail('An edited image must preserve the exact extension.');
        } catch (SoFinderException $exception) {
            self::assertSame('image_extension_change_not_allowed', $exception->errorCode);
        }
    }

    public function testAnimatedImageEditingIsRejectedExplicitly(): void
    {
        $gif = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', true);
        self::assertIsString($gif);
        file_put_contents($this->directory . '/animated.gif', $gif . "\x00\x21\xF9\x04\x00\x21\xF9\x04");

        try {
            $this->manager()->applyActions('Images', 'animated.gif', [['type' => 'resize', 'width' => 1, 'height' => 1]]);
            self::fail('Animated image editing should be rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('animated_image_edit_unsupported', $exception->errorCode);
        }
    }

    public function testNonWebFileCannotEnterImageEndpoints(): void
    {
        file_put_contents($this->directory . '/scan.tiff', "II*\0\x08\0\0\0ordinary-file");
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $type = new ResourceType('Files', $this->directory, '/files', allowedExtensions: ['tiff']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $formats = new ImageFormatRegistry();
        $images = new ImageManager(
            $files,
            new HybridImageProcessor($formats, new GdImageProcessor(), new ImagickImageProcessor($formats)),
            $this->directory . '/cache',
        );

        try {
            $images->info('Files', 'scan.tiff');
            self::fail('A non-web file must not enter the image pipeline.');
        } catch (SoFinderException $exception) {
            self::assertSame('unsupported_image', $exception->errorCode);
        }
    }

    public function testOptimizationCanConvertFormatAndReportsSize(): void
    {
        $result = $this->manager()->applyActions('Images', 'source.png', [
            ['type' => 'optimize', 'format' => 'jpeg', 'quality' => 72],
        ]);

        self::assertSame('source-edited.jpg', $result['entry']->name);
        self::assertSame('image/jpeg', $result['entry']->mimeType);
        self::assertGreaterThan(0, $result['result']['size']);
    }

    public function testTextAndImageWatermarksCreateValidImages(): void
    {
        $images = $this->manager();
        $text = $images->applyActions('Images', 'source.png', [[
            'type' => 'watermarkText', 'text' => 'SoFinder', 'position' => 'bottom-right', 'opacity' => 55, 'scale' => 30, 'color' => '#ffffff',
        ]]);
        $mark = $images->applyActions('Images', 'source.png', [[
            'type' => 'watermarkImage', 'resource' => 'Images', 'path' => 'source.png', 'position' => 'center', 'opacity' => 35, 'scale' => 20,
        ]]);

        self::assertSame(['width' => 400, 'height' => 200], $images->info('Images', $text['entry']->path));
        self::assertSame(['width' => 400, 'height' => 200], $images->info('Images', $mark['entry']->path));
    }

    public function testBatchOptimizationReportsPartialResults(): void
    {
        $result = $this->manager()->applyBatch('Images', ['source.png', 'missing.png'], [
            ['type' => 'optimize', 'format' => 'original', 'quality' => 75],
        ]);

        self::assertSame(2, $result['total']);
        self::assertSame(1, $result['succeeded']);
        self::assertSame(1, $result['failed']);
        self::assertFalse($result['items'][1]['success']);
    }

    public function testUnicodeWatermarkRequiresConfiguredFont(): void
    {
        try {
            $this->manager()->applyActions('Images', 'source.png', [[
                'type' => 'watermarkText', 'text' => '内部资料', 'position' => 'center', 'opacity' => 60, 'scale' => 25,
            ]]);
            self::fail('Unicode text must not be rendered with the GD bitmap font.');
        } catch (SoFinderException $exception) {
            self::assertSame('watermark_font_unavailable', $exception->errorCode);
        }
    }

    private function manager(): ImageManager
    {
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $type = new ResourceType('Images', $this->directory, '/images', allowedExtensions: ['png', 'gif', 'jpg', 'jpeg'], allowedMimeTypes: ['image/png', 'image/gif', 'image/jpeg']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/images'))]), $authorization, new EventDispatcher());

        return new ImageManager($files, new GdImageProcessor(), $this->directory . '/cache', ['thumb' => ['width' => 80, 'height' => 80, 'quality' => 82]]);
    }
}
