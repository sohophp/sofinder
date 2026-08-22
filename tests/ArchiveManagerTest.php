<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class ArchiveManagerTest extends TestCase
{
    private string $directory;
    private string $cache;

    protected function setUp(): void
    {
        if (!class_exists(\ZipArchive::class)) {
            self::markTestSkipped('ZIP is not installed.');
        }
        $suffix = bin2hex(random_bytes(8));
        $this->directory = sys_get_temp_dir() . '/sofinder-archive-files-' . $suffix;
        $this->cache = sys_get_temp_dir() . '/sofinder-archive-cache-' . $suffix;
        mkdir($this->directory . '/folder', 0775, true);
        mkdir($this->cache, 0775, true);
        file_put_contents($this->directory . '/one.txt', 'one');
        file_put_contents($this->directory . '/folder/two.txt', 'two');
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
        $this->remove($this->cache);
    }

    public function testCreatesArchiveForFilesAndFolders(): void
    {
        $archivePath = $this->manager()->create('Files', ['one.txt', 'folder']);
        $archive = new \ZipArchive();
        self::assertTrue($archive->open($archivePath) === true);
        self::assertSame('one', $archive->getFromName('one.txt'));
        self::assertSame('two', $archive->getFromName('folder/two.txt'));
        $archive->close();
        @unlink($archivePath);
    }

    public function testRejectsOversizedSelectionBeforeReadingFiles(): void
    {
        $paths = array_map(static fn (int $index): string => sprintf('file-%d.txt', $index), range(1, 101));
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('no more than 100');
        $this->manager()->create('Files', $paths);
    }

    private function manager(): ArchiveManager
    {
        $pathGuard = new PathGuard();
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt'], [], []);
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files', $pathGuard))]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager($registry, $authorization, new EventDispatcher(), $pathGuard);

        return new ArchiveManager($files, $pathGuard, $this->cache);
    }

    private function remove(string $path): void
    {
        if (is_file($path) || is_link($path)) {
            @unlink($path);
            return;
        }
        if (!is_dir($path)) {
            return;
        }
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) {
            $this->remove($entry->getPathname());
        }
        @rmdir($path);
    }
}
