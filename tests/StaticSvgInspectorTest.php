<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Value\ResourceType;

final class StaticSvgInspectorTest extends TestCase
{
    public function testStaticSvgUsesItsViewBoxWithoutAResizer(): void
    {
        $result = $this->inspect('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24"><rect width="32" height="24" fill="red"/></svg>');
        self::assertSame('image/svg+xml', $result->mimeType);
        self::assertSame(32, $result->imageWidth);
        self::assertSame(24, $result->imageHeight);
    }

    public function testIllustratorStyleClassesAreAccepted(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;">'
            . '<style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#D7000F;}.st1{fill:#FFFFFF;}</style>'
            . '<circle class="st0" cx="50" cy="50" r="50"/></svg>';
        self::assertSame('image/svg+xml', $this->inspect($svg)->mimeType);
    }

    #[DataProvider('unsafeSvg')]
    public function testActiveOrExternalSvgContentIsRejected(string $svg): void
    {
        $this->expectException(SoFinderException::class);
        $this->inspect($svg);
    }

    public static function unsafeSvg(): iterable
    {
        $open = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24">';
        yield 'script' => [$open . '<script>alert(1)</script></svg>'];
        yield 'event handler' => [$open . '<rect onload="alert(1)"/></svg>'];
        yield 'external image' => [$open . '<image href="https://example.com/a.png"/></svg>'];
        yield 'external use' => [$open . '<use href="https://example.com/a.svg#x"/></svg>'];
        yield 'CSS' => [$open . '<style>rect{fill:url(https://example.com/a)}</style></svg>'];
        yield 'CSS import' => [$open . '<style>@import "https://example.com/a.css";</style></svg>'];
        yield 'CSS URL in attribute' => [$open . '<rect style="fill:url(https://example.com/a.svg#x)"/></svg>'];
        yield 'escaped presentation URL' => [$open . '<rect fill="u\\72l(\\2f external.svg#paint)"/></svg>'];
        yield 'external XML base' => ['<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" xml:base="/remote.svg"><use href="#shape"/></svg>'];
        yield 'doctype' => ['<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' . $open . '<text>&x;</text></svg>'];
        yield 'stylesheet instruction' => ['<?xml-stylesheet href="https://example.com/a.css"?>' . $open . '</svg>'];
        yield 'foreign object' => [$open . '<foreignObject><div xmlns="http://www.w3.org/1999/xhtml">Hi</div></foreignObject></svg>'];
    }

    private function inspect(string $svg): \SohoPHP\SoFinder\Value\InspectedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'sofinder-svg-') ?: throw new \RuntimeException();
        file_put_contents($path, $svg);
        try {
            return (new DefaultFileInspector(new GdImageProcessor()))->inspect(
                $path,
                'art.svg',
                new ResourceType('Images', '/tmp', '', ['svg'], allowedMimeTypes: ['image/svg+xml']),
            );
        } finally {
            @unlink($path);
        }
    }
}
