<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Framework\RoutingEntryUrlGenerator;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;

final class RoutingEntryUrlGeneratorTest extends TestCase
{
    public function testProxyAndCustomRoutesUseTheSameHostNeutralPolicy(): void
    {
        $calls = [];
        $generator = new RoutingEntryUrlGenerator(static function (string $route, array $parameters, bool $absolute) use (&$calls): string {
            $calls[] = [$route, $parameters, $absolute];

            return ($absolute ? 'https://example.test/' : '/') . $route;
        });
        $entry = new Entry('reports/annual.pdf', 'annual.pdf', false, 10, 1, 'application/pdf');

        self::assertSame('/sofinder_api_content', $generator->generate(
            new ResourceType('Files', '/tmp/files', '', deliveryMode: 'proxy'),
            $entry,
        ));
        self::assertSame('https://example.test/document.download', $generator->generate(
            new ResourceType(
                'Files',
                '/tmp/files',
                '',
                deliveryMode: 'proxy',
                entryUrlRoute: 'document.download',
                entryUrlParameters: ['source' => '{resource}/{path}', 'name' => '{name}'],
                entryUrlAbsolute: true,
            ),
            $entry,
        ));

        self::assertSame('sofinder_api_content', $calls[0][0]);
        self::assertSame(['resource' => 'Files', 'path' => 'reports/annual.pdf', 'disposition' => 'inline'], $calls[0][1]);
        self::assertSame(['source' => 'Files/reports/annual.pdf', 'name' => 'annual.pdf'], $calls[1][1]);
        self::assertTrue($calls[1][2]);
    }
}
