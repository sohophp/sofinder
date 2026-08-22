<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Value\ResourceType;

final class DefaultFileInspectorTest extends TestCase
{
    public function testNonWebImageExtensionIsInspectedAsAnOrdinaryFile(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'sofinder-generic-tiff-');
        self::assertIsString($path);
        file_put_contents($path, "II*\0\x08\0\0\0ordinary-file");

        $images = $this->createMock(ImageProcessorInterface::class);
        $images->expects(self::never())->method('dimensions');
        $images->expects(self::never())->method('validate');
        $images->expects(self::never())->method('isAnimated');

        try {
            $inspected = (new DefaultFileInspector($images))->inspect(
                $path,
                'scan.tiff',
                new ResourceType('Files', '/tmp', '/files', ['tiff']),
            );

            self::assertGreaterThan(0, $inspected->size);
            self::assertNull($inspected->imageWidth);
            self::assertNull($inspected->imageHeight);
        } finally {
            @unlink($path);
        }
    }
}
