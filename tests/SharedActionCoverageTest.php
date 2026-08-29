<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Http\EndpointCatalog;

final class SharedActionCoverageTest extends TestCase
{
    public function testEveryEndpointHasExactlyOneSharedAction(): void
    {
        $actions = [];
        $files = glob(dirname(__DIR__) . '/packages/sofinder-http/src/Action/*.php');
        self::assertIsArray($files);
        foreach ($files as $file) {
            $source = file_get_contents($file);
            self::assertIsString($source);
            if (preg_match("/function\\s+endpoint\\s*\\(\\s*\\)\\s*:\\s*string\\s*\\{\\s*return\\s+'(sofinder_[a-z_]+)'\s*;/s", $source, $match) !== 1) {
                if (basename($file) === 'TransferAction.php') {
                    $actions['sofinder_api_copy'] = basename($file);
                    $actions['sofinder_api_move'] = basename($file);
                }
                continue;
            }
            self::assertArrayNotHasKey($match[1], $actions, 'Duplicate shared action for ' . $match[1]);
            $actions[$match[1]] = basename($file);
        }
        $expected = array_map(static fn ($endpoint): string => $endpoint->name, EndpointCatalog::all());
        sort($expected);
        $actual = array_keys($actions);
        sort($actual);

        self::assertCount(52, $actual);
        self::assertSame($expected, $actual);
    }
}
