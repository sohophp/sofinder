<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use SohoPHP\SoFinder\Exception\InvalidPathException;
use SohoPHP\SoFinder\Security\PathGuard;

final class PathGuardTest extends TestCase
{
    public function testNormalizesSafePaths(): void
    {
        self::assertSame('images/产品', (new PathGuard())->normalize('/images//产品/'));
    }

    #[DataProvider('invalidPaths')]
    public function testRejectsUnsafePaths(string $path): void
    {
        $this->expectException(InvalidPathException::class);
        (new PathGuard())->normalize($path);
    }

    /** @return iterable<string, array{string}> */
    public static function invalidPaths(): iterable
    {
        yield 'parent traversal' => ['../secret'];
        yield 'embedded traversal' => ['safe/../secret'];
        yield 'windows traversal' => ['safe\\..\\secret'];
        yield 'control character' => ["safe\nname"];
        yield 'null byte' => ["safe\0name"];
        yield 'hidden entry' => ['folder/.private'];
    }
}
