<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

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
        foreach (glob($this->directory . '/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->directory);
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

    private function manager(): ImageManager
    {
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $type = new ResourceType('Images', $this->directory, '/images', allowedExtensions: ['png', 'gif'], allowedMimeTypes: ['image/png', 'image/gif']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/images'))]), $authorization, new EventDispatcher());

        return new ImageManager($files, new GdImageProcessor(), $this->directory . '/cache', ['thumb' => ['width' => 80, 'height' => 80, 'quality' => 82]]);
    }
}
