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
    }
}
