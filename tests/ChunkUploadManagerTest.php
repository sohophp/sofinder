<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;

final class ChunkUploadManagerTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-chunks-' . bin2hex(random_bytes(8));
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
    }

    public function testChunksAreAssembledInOrderAndDiscarded(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 3);
        $first = fopen('php://temp', 'w+b'); fwrite($first, 'abc'); rewind($first);
        self::assertFalse($manager->accept('abcdefghijklmnop', 0, 2, $first, 10)['complete']); fclose($first);
        $second = fopen('php://temp', 'w+b'); fwrite($second, 'def'); rewind($second);
        $complete = $manager->accept('abcdefghijklmnop', 1, 2, $second, 10); fclose($second);

        self::assertTrue($complete['complete']);
        self::assertSame('abcdef', file_get_contents((string) $complete['path']));
        $manager->discard('abcdefghijklmnop');
        self::assertDirectoryDoesNotExist(dirname((string) $complete['path']));
    }

    public function testActualChunkBytesAreLimited(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 3, 2);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'four'); rewind($stream);
        try {
            $manager->accept('abcdefghijklmnop', 0, 1, $stream, 20);
            self::fail('Oversized chunk should be rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('upload_chunk_too_large', $exception->errorCode);
        } finally { fclose($stream); }
    }

    private function actor(): ActorProviderInterface
    {
        return new class implements ActorProviderInterface { public function actorId(): string { return 'actor'; } };
    }

    private function remove(string $path): void
    {
        if (is_file($path) || is_link($path)) { @unlink($path); return; }
        if (!is_dir($path)) return;
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) $this->remove($entry->getPathname());
        @rmdir($path);
    }
}
