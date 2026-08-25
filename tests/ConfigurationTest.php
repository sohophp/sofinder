<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\DependencyInjection\Configuration;
use Symfony\Component\Config\Definition\Processor;

final class ConfigurationTest extends TestCase
{
    public function testLogoAndBrandNameAreEnabledByDefault(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'resources' => [
                'Files' => ['root' => '/tmp/sofinder'],
            ],
        ]]);

        self::assertTrue($config['ui']['logo']);
        self::assertTrue($config['ui']['header']);
        self::assertFalse($config['ckeditor4']['overwrite_on_upload']);
    }

    public function testCkeditorUploadOverwriteCanBeEnabledExplicitly(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'ckeditor4' => ['overwrite_on_upload' => true],
            'resources' => [
                'Files' => ['root' => '/tmp/sofinder'],
            ],
        ]]);

        self::assertTrue($config['ckeditor4']['overwrite_on_upload']);
    }
}
