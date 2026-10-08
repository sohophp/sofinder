<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Value\ResourceType;

final class ResourceTypeTest extends TestCase
{
    private ResourceType $resource;

    protected function setUp(): void
    {
        $this->resource = new ResourceType('Images', '/tmp/images', '/images', ['jpg', 'png'], ['php', 'phtml'], ['image/jpeg', 'image/png'], 100);
    }

    public function testAcceptsAllowedUpload(): void
    {
        $this->expectNotToPerformAssertions();
        $this->resource->assertUploadAllowed('photo.JPG', 100);
    }

    public function testUsesConservativeDefaultFolderLimits(): void
    {
        self::assertSame(50, $this->resource->maxFolderNameLength);
        self::assertSame(5, $this->resource->maxFolderDepth);
    }

    public function testExplicitDeepFolderLimitIsEnforcedBeyondOneHundredLevels(): void
    {
        $resource = new ResourceType('Files', '/tmp/files', '/files', maxFolderDepth: 101);
        $path = implode('/', array_fill(0, 101, 'd'));
        $resource->assertEntryPathAllowed($path, true);
        self::assertSame(101, $resource->jsonSerialize()['maxFolderDepth']);

        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('101');
        $resource->assertEntryPathAllowed($path . '/child', true);
    }

    public function testRejectsDepthOutsideThePortableIntegerRange(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new ResourceType('Files', '/tmp/files', '/files', maxFolderDepth: ResourceType::MAX_FOLDER_DEPTH + 1);
    }

    public function testDiscoveryDeclaresWhetherAHostEntryRouteIsConfigured(): void
    {
        self::assertFalse($this->resource->jsonSerialize()['entryUrlConfigured']);
        $resource = new ResourceType('Private', '/tmp/private', '', deliveryMode: 'proxy', entryUrlRoute: 'file.output');
        self::assertTrue($resource->jsonSerialize()['entryUrlConfigured']);
    }

    public function testRejectsDoubleExtension(): void
    {
        $this->expectException(SoFinderException::class);
        $this->resource->assertUploadAllowed('payload.php.jpg', 20);
    }

    public function testRejectsOversizedUpload(): void
    {
        $this->expectException(SoFinderException::class);
        $this->resource->assertUploadAllowed('photo.jpg', 101);
    }

    public function testRejectsUnexpectedMimeType(): void
    {
        $this->expectException(SoFinderException::class);
        $this->resource->assertMimeAllowed('text/x-php');
    }

    public function testCountsUnicodeNameCharacters(): void
    {
        $resource = new ResourceType('Files', '/tmp/files', '/files', ['txt'], maxFileNameLength: 6);

        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('6 character');
        $resource->assertFileNameAllowed('中文名字.txt');
    }

    public function testRejectsFolderNameAndDepthLimits(): void
    {
        $resource = new ResourceType('Files', '/tmp/files', '/files', maxFolderNameLength: 4, maxFolderDepth: 2);

        try {
            $resource->assertEntryPathAllowed('one/12345', true);
            self::fail('The folder name limit should be enforced.');
        } catch (SoFinderException $exception) {
            self::assertSame('folder_name_too_long', $exception->errorCode);
        }

        try {
            $resource->assertEntryPathAllowed('one/two/tri/file.txt', false);
            self::fail('The folder depth limit should be enforced.');
        } catch (SoFinderException $exception) {
            self::assertSame('folder_depth_exceeded', $exception->errorCode);
        }
    }
}
