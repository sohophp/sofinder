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
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use Symfony\Component\HttpFoundation\Request;

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
            new FeaturePolicy(['recent' => false, 'favorites' => false, 'tags' => false]),
        );

        $this->expectDisabled(static fn () => $controller->get(Request::create('/metadata')));
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
