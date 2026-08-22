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
        self::assertFalse($manager->accept('abcdefghijklmnop', 0, 2, $first, 10, ['resource' => 'Files', 'path' => 'docs', 'name' => 'file.txt'])['complete']); fclose($first);
        self::assertSame([0], $manager->status('abcdefghijklmnop')['received']);
        $second = fopen('php://temp', 'w+b'); fwrite($second, 'def'); rewind($second);
        $complete = $manager->accept('abcdefghijklmnop', 1, 2, $second, 10, ['resource' => 'Files', 'path' => 'docs', 'name' => 'file.txt']); fclose($second);

        self::assertTrue($complete['complete']);
        self::assertSame('abcdef', file_get_contents((string) $complete['path']));
        self::assertTrue($manager->status('abcdefghijklmnop')['complete']);
        $manager->discard('abcdefghijklmnop');
        self::assertDirectoryDoesNotExist(dirname((string) $complete['path']));
    }

    public function testRejectsChangingUploadSessionMetadata(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 3);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'a'); rewind($stream);
        $manager->accept('abcdefghijklmnop', 0, 2, $stream, 10, ['resource' => 'Files', 'name' => 'one.txt']);
        rewind($stream);
        try {
            $manager->accept('abcdefghijklmnop', 1, 2, $stream, 10, ['resource' => 'Files', 'name' => 'two.txt']);
            self::fail('A resumed upload must preserve its original metadata.');
        } catch (SoFinderException $exception) {
            self::assertSame('upload_session_mismatch', $exception->errorCode);
        } finally {
            fclose($stream);
        }
    }

    public function testExpiredSessionsCanBeCleanedAcrossActorDirectories(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 3);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'a'); rewind($stream);
        $manager->accept('abcdefghijklmnop', 0, 2, $stream, 10);
        fclose($stream);
        $sessionDirectory = $this->directory . '/' . hash('sha256', 'actor') . '/abcdefghijklmnop';
        touch($sessionDirectory, time() - 90_000);

        self::assertSame(1, $manager->cleanupExpired(true));
        self::assertDirectoryDoesNotExist($sessionDirectory);
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
