<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use SohoPHP\SoFinder\Exception\ConflictException;
use SohoPHP\SoFinder\Exception\InvalidPathException;
use SohoPHP\SoFinder\Exception\NotFoundException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\Entry;
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

    public function testConfiguredFilesystemPermissionsApplyToNewEntries(): void
    {
        $root = $this->directory . '/shared';
        $storage = new LocalStorageAdapter($root, directoryMode: 02775, fileMode: 0660);
        $storage->createDirectory('documents');
        $stream = fopen('php://temp', 'w+b');
        if ($stream === false) {
            self::fail('Unable to create the test stream.');
        }
        fwrite($stream, 'shared');
        rewind($stream);
        $storage->writeStream('documents/shared.txt', $stream);
        fclose($stream);

        self::assertSame(02775, fileperms($root) & 07777);
        self::assertSame(02775, fileperms($root . '/documents') & 07777);
        self::assertSame(0660, fileperms($root . '/documents/shared.txt') & 07777);
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

    public function testListingNeverExposesSymlinkChildren(): void
    {
        file_put_contents($this->directory . '/target.txt', 'target');
        symlink($this->directory . '/target.txt', $this->directory . '/alias.txt');

        $names = array_map(static fn (Entry $entry): string => $entry->name, $this->storage->list(new ListQuery())->entries);

        self::assertContains('target.txt', $names);
        self::assertNotContains('alias.txt', $names);
    }

    public function testMissingDirectoryUsesAStableNotFoundError(): void
    {
        mkdir($this->directory . '/gone');
        rmdir($this->directory . '/gone');

        $this->expectException(NotFoundException::class);
        $this->storage->list(new ListQuery('gone'));
    }

    public function testUnreadableDirectoryUsesAStableUnavailableError(): void
    {
        if (DIRECTORY_SEPARATOR === '\\') self::markTestSkipped('POSIX permissions are required.');
        mkdir($this->directory . '/locked');
        chmod($this->directory . '/locked', 0000);
        if (is_readable($this->directory . '/locked')) {
            chmod($this->directory . '/locked', 0775);
            self::markTestSkipped('The current user bypasses directory permission checks.');
        }
        try {
            $this->storage->list(new ListQuery('locked'));
            self::fail('Unreadable directories must not leak an internal iterator error.');
        } catch (SoFinderException $exception) {
            self::assertSame('storage_unavailable', $exception->errorCode);
            self::assertSame(503, $exception->httpStatus);
        } finally {
            chmod($this->directory . '/locked', 0775);
        }
    }

    public function testEntryObservesAnAtomicFileReplacement(): void
    {
        file_put_contents($this->directory . '/report.txt', 'old');
        self::assertSame(3, $this->storage->entry('report.txt')->size);
        file_put_contents($this->directory . '/replacement', 'replacement');
        rename($this->directory . '/replacement', $this->directory . '/report.txt');

        self::assertSame(11, $this->storage->entry('report.txt')->size);
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

    public function testSortsFilesByTheirDisplayedMimeType(): void
    {
        file_put_contents($this->directory . '/notes.txt', 'plain text');
        file_put_contents($this->directory . '/data.json', '{"value":1}');

        $ascending = $this->storage->list(new ListQuery(sort: 'type'));
        $descending = $this->storage->list(new ListQuery(sort: 'type', direction: 'desc'));

        self::assertSame(['data.json', 'notes.txt'], array_column($ascending->entries, 'name'));
        self::assertSame(['notes.txt', 'data.json'], array_column($descending->entries, 'name'));
        self::assertSame('type', (new ListQuery(sort: 'type'))->sort);
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
