<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Command\ImageCapabilitiesCommand;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

final class ImageCapabilitiesCommandTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-image-command-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        @rmdir($this->directory);
    }

    public function testJsonCommandFailsForConfiguredImageWithoutDecoder(): void
    {
        $images = new class implements ImageCapabilityProviderInterface {
            public function capabilities(): array { return []; }
            public function isWebEmbeddable(string $mimeType): bool { return false; }
            public function supportsExtension(string $extension): bool { return $extension === 'png'; }
            public function driver(): string { return 'gd'; }
            public function cacheVersion(): string { return 'test'; }
        };
        $resource = new ResourceType('Images', $this->directory, '/images', ['png', 'tiff']);
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/images'))]);
        $tester = new CommandTester(new ImageCapabilitiesCommand($images, new ImageFormatRegistry(), $registry));

        $status = $tester->execute(['--json' => true]);
        $payload = json_decode($tester->getDisplay(), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(Command::FAILURE, $status);
        self::assertSame('gd', $payload['driver']);
        self::assertSame([['resource' => 'Images', 'extension' => 'tiff']], $payload['unsupportedConfiguredFormats']);
    }
}
