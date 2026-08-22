<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use SohoPHP\SoFinder\Exception\ConflictException;
use SohoPHP\SoFinder\Exception\InvalidPathException;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ListQuery;

final class LocalStorageAdapterTest extends TestCase
{
    private string $directory;
    private LocalStorageAdapter $storage;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-test-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        $this->storage = new LocalStorageAdapter($this->directory, '/uploads/editor');
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
    }

    public function testFileLifecycle(): void
    {
        $folder = $this->storage->createDirectory('documents');
        self::assertTrue($folder->directory);

        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, 'hello');
        rewind($stream);
        $file = $this->storage->writeStream('documents/hello.txt', $stream);
        fclose($stream);
        self::assertSame(5, $file->size);
        self::assertSame('/uploads/editor/documents/hello.txt', $file->url);

        $copy = $this->storage->copy('documents/hello.txt', 'documents/copy.txt');
        self::assertSame('copy.txt', $copy->name);
        $moved = $this->storage->move('documents/copy.txt', 'moved.txt');
        self::assertSame('moved.txt', $moved->path);
        self::assertCount(1, $this->storage->list(new ListQuery('documents'))->entries);

        $this->storage->delete('moved.txt');
        $this->storage->delete('documents');
        self::assertSame([], $this->storage->list(new ListQuery())->entries);
    }

    public function testDoesNotOverwriteByDefault(): void
    {
        file_put_contents($this->directory . '/one.txt', 'one');
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, 'two');
        rewind($stream);
        $this->expectException(ConflictException::class);
        try {
            $this->storage->writeStream('one.txt', $stream);
        } finally {
            fclose($stream);
        }
    }

    public function testOverwriteCopyAndMoveLeaveNoBackupArtifacts(): void
    {
        file_put_contents($this->directory . '/copy-source.txt', 'new-copy');
        file_put_contents($this->directory . '/move-source.txt', 'new-move');
        file_put_contents($this->directory . '/copy-target.txt', 'old-copy');
        file_put_contents($this->directory . '/move-target.txt', 'old-move');

        $this->storage->copy('copy-source.txt', 'copy-target.txt', true);
        $this->storage->move('move-source.txt', 'move-target.txt', true);

        self::assertSame('new-copy', file_get_contents($this->directory . '/copy-target.txt'));
        self::assertSame('new-move', file_get_contents($this->directory . '/move-target.txt'));
        self::assertFileDoesNotExist($this->directory . '/move-source.txt');
        self::assertSame([], glob($this->directory . '/.sofinder-*') ?: []);
    }

    public function testRejectsSymlinkEvenWhenItPointsInsideRoot(): void
    {
        mkdir($this->directory . '/target');
        symlink($this->directory . '/target', $this->directory . '/link');
        $this->expectException(InvalidPathException::class);
        $this->storage->list(new ListQuery('link'));
    }

    #[DataProvider('recursiveTransferProvider')]
    public function testRejectsTransferringDirectoryIntoItself(string $operation): void
    {
        mkdir($this->directory . '/source/nested', 0775, true);
        file_put_contents($this->directory . '/source/file.txt', 'content');

        $this->expectException(InvalidPathException::class);
        try {
            if ($operation === 'copy') {
                $this->storage->copy('source', 'source/nested/source');
            } else {
                $this->storage->move('source', 'source/nested/source');
            }
        } finally {
            self::assertFileExists($this->directory . '/source/file.txt');
            self::assertDirectoryDoesNotExist($this->directory . '/source/nested/source');
        }
    }

    /** @return iterable<string, array{string}> */
    public static function recursiveTransferProvider(): iterable
    {
        yield 'copy' => ['copy'];
        yield 'move' => ['move'];
    }

    public function testReportsRecursiveStorageUsage(): void
    {
        mkdir($this->directory . '/nested');
        file_put_contents($this->directory . '/one.txt', '123');
        file_put_contents($this->directory . '/nested/two.txt', '12345');

        self::assertSame(8, $this->storage->usage());
        self::assertSame(5, $this->storage->size('nested'));
    }

    public function testListsAFilteredSortedPageThroughTheStableQueryContract(): void
    {
        file_put_contents($this->directory . '/alpha.txt', '1');
        file_put_contents($this->directory . '/beta.txt', '12345');
        file_put_contents($this->directory . '/gamma.txt', '123');

        $page = $this->storage->list(new ListQuery('', 'a', 'size', 'desc', 1, 1));

        self::assertSame(3, $page->total);
        self::assertSame(1, $page->offset);
        self::assertSame('gamma.txt', $page->entries[0]->name);
        self::assertNotNull($page->nextCursor);
        self::assertTrue($this->storage->capabilities()->atomicMove);
        self::assertTrue($this->storage->capabilities()->recoverableDelete);
    }

    private function remove(string $path): void
    {
        if (is_link($path) || is_file($path)) {
            @unlink($path);
            return;
        }
        if (!is_dir($path)) {
            return;
        }
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $child) {
            $this->remove($child->getPathname());
        }
        @rmdir($path);
    }
}
