<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Value\Theme;

final class ThemeTest extends TestCase
{
    /** @var array<string, string> */
    private array $validTheme = [
        'accent' => '#276ef1',
        'background' => '#f4f6f9',
        'panel' => '#fff',
        'text' => '#1c2735',
        'muted' => '#6d7887',
        'danger' => '#c13a43',
        'radius' => '10px',
    ];

    public function testReturnsValidatedTheme(): void
    {
        self::assertSame($this->validTheme, (new Theme($this->validTheme))->values());
    }

    public function testRejectsCssInjection(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new Theme([...$this->validTheme, 'accent' => 'red;display:none']);
    }

    public function testRejectsExcessiveRadius(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new Theme([...$this->validTheme, 'radius' => '100px']);
    }
}
