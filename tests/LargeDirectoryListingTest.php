<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Group;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ListQuery;

final class LargeDirectoryListingTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-large-list-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        foreach (new \FilesystemIterator($this->directory, \FilesystemIterator::SKIP_DOTS) as $file) {
            @unlink($file->getPathname());
        }
        @rmdir($this->directory);
    }

    #[Group('performance')]
    public function testTenThousandEntryDirectoryReturnsStableBoundedPages(): void
    {
        for ($index = 0; $index < 10_000; ++$index) {
            touch($this->directory . '/file-' . str_pad((string) $index, 5, '0', STR_PAD_LEFT) . '.txt');
        }
        $storage = new LocalStorageAdapter($this->directory);
        $before = memory_get_usage(true);

        $first = $storage->list(new ListQuery(limit: 137));
        $second = $storage->list(new ListQuery(offset: 137, limit: 137));

        self::assertSame(10_000, $first->total);
        self::assertCount(137, $first->entries);
        self::assertCount(137, $second->entries);
        self::assertSame([], array_intersect(array_column($first->entries, 'path'), array_column($second->entries, 'path')));
        self::assertLessThan(128 * 1024 * 1024, memory_get_peak_usage(true) - $before);
    }
}
