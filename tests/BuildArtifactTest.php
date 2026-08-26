<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;

final class BuildArtifactTest extends TestCase
{
    public function testBrowserBundleDoesNotReferenceNodeEnvironmentVariables(): void
    {
        $bundle = file_get_contents(dirname(__DIR__) . '/dist/sofinder.js');
        self::assertIsString($bundle);
        self::assertStringNotContainsString('process.env', $bundle);
    }

    public function testPickerSdkIsShippedAsAnIndependentModule(): void
    {
        $bundle = file_get_contents(dirname(__DIR__) . '/dist/sofinder-picker.js');
        self::assertIsString($bundle);
        self::assertStringContainsString('sofinder:select', $bundle);
        self::assertStringContainsString('openPicker', $bundle);
    }
}
