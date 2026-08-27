<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\ArchiveController;
use SohoPHP\SoFinder\Http\MetadataController;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use Symfony\Component\HttpFoundation\Request;
use SohoPHP\SoFinder\Image\ImageManager;

final class ControllerFeaturePolicyTest extends TestCase
{
    public function testArchiveEndpointStopsBeforeInvokingItsServicesWhenDisabled(): void
    {
        $controller = new ArchiveController(
            $this->withoutConstructor(ArchiveManager::class),
            $this->withoutConstructor(CsrfGuard::class),
            new FeaturePolicy(['archive' => false]),
        );

        $this->expectDisabled(static fn () => $controller(Request::create('/archive', 'POST')));
    }

    public function testTrashEndpointStopsBeforeInvokingFileManagerWhenDisabled(): void
    {
        $controller = new ApiController(
            $this->withoutConstructor(FileManager::class),
            $this->withoutConstructor(CsrfGuard::class),
            $this->withoutConstructor(PluginRegistry::class),
            features: new FeaturePolicy(['trash' => false]),
        );

        $this->expectDisabled(static fn () => $controller->trash(Request::create('/trash')));
    }

    public function testTagSearchCannotBypassDisabledMetadataFeature(): void
    {
        $controller = new ApiController(
            $this->withoutConstructor(FileManager::class),
            $this->withoutConstructor(CsrfGuard::class),
            $this->withoutConstructor(PluginRegistry::class),
            features: new FeaturePolicy(['tags' => false]),
        );

        $this->expectDisabled(static fn () => $controller->entries(Request::create('/entries?searchMode=tags&search=private')));
    }

    public function testMetadataEndpointStopsWhenEveryMetadataFeatureIsDisabled(): void
    {
        $controller = new MetadataController(
            $this->withoutConstructor(MetadataManager::class),
            $this->withoutConstructor(CsrfGuard::class),
            new FeaturePolicy(['recent' => false, 'favorites' => false, 'quick_access' => false, 'tags' => false]),
        );

        $this->expectDisabled(static fn () => $controller->get(Request::create('/metadata')));
    }

    public function testBatchRenameAndImageProcessingCannotBypassHostPolicy(): void
    {
        $api = new ApiController(
            $this->withoutConstructor(FileManager::class),
            $this->withoutConstructor(CsrfGuard::class),
            $this->withoutConstructor(PluginRegistry::class),
            features: new FeaturePolicy(['batch_rename' => false]),
        );
        $this->expectDisabled(static fn () => $api->batchRename(Request::create('/batch-rename', 'POST')));

        $images = new ImageController(
            $this->withoutConstructor(ImageManager::class),
            $this->withoutConstructor(CsrfGuard::class),
            new FeaturePolicy(['image_processing' => false]),
        );
        $this->expectDisabled(static fn () => $images->batch(Request::create('/images/batch', 'POST')));
    }

    public function testPreviewAndChecksumCannotBypassHostPolicy(): void
    {
        $content = new ContentController(
            $this->withoutConstructor(FileManager::class),
            new ImageFormatRegistry(),
            new FeaturePolicy(['text_preview' => false, 'checksum' => false]),
        );
        $this->expectDisabled(static fn () => $content->textPreview(Request::create('/preview/text')));
        $this->expectDisabled(static fn () => $content->checksum(Request::create('/checksum')));
    }

    /** @param callable():mixed $operation */
    private function expectDisabled(callable $operation): void
    {
        try {
            $operation();
            self::fail('The disabled controller feature was invoked.');
        } catch (SoFinderException $exception) {
            self::assertSame('feature_disabled', $exception->errorCode);
            self::assertSame(404, $exception->httpStatus);
        }
    }

    /** @template T of object @param class-string<T> $class @return T */
    private function withoutConstructor(string $class): object
    {
        return (new \ReflectionClass($class))->newInstanceWithoutConstructor();
    }
}
