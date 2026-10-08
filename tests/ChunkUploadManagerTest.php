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
        self::assertFalse($manager->status('abcdefghijklmnop')['autoRename']);
        $second = fopen('php://temp', 'w+b'); fwrite($second, 'def'); rewind($second);
        $complete = $manager->accept('abcdefghijklmnop', 1, 2, $second, 10, ['resource' => 'Files', 'path' => 'docs', 'name' => 'file.txt']); fclose($second);

        self::assertTrue($complete['complete']);
        self::assertSame('abcdef', file_get_contents((string) $complete['path']));
        self::assertTrue($manager->status('abcdefghijklmnop')['complete']);
        $manager->discard('abcdefghijklmnop');
        self::assertDirectoryDoesNotExist(dirname((string) $complete['path']));
    }

    public function testAutoRenameIsImmutableSessionMetadata(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 3);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'a'); rewind($stream);
        $manager->accept('abcdefghijklmnop', 0, 2, $stream, 10, ['resource' => 'Files', 'name' => 'one.txt', 'autoRename' => true]);
        self::assertTrue($manager->status('abcdefghijklmnop')['autoRename']);
        rewind($stream);
        try {
            $manager->accept('abcdefghijklmnop', 1, 2, $stream, 10, ['resource' => 'Files', 'name' => 'one.txt', 'autoRename' => false]);
            self::fail('A resumed upload must preserve its conflict strategy.');
        } catch (SoFinderException $exception) {
            self::assertSame('upload_session_mismatch', $exception->errorCode);
        } finally {
            fclose($stream);
        }
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

    public function testWorkspaceIsImmutableSessionMetadata(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 3);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'a'); rewind($stream);
        $manager->accept('abcdefghijklmnop', 0, 2, $stream, 10, ['resource' => 'Files', 'name' => 'one.txt', 'workspace' => 'site-a']);
        self::assertSame('site-a', $manager->status('abcdefghijklmnop')['workspace']);
        rewind($stream);
        try {
            $manager->accept('abcdefghijklmnop', 1, 2, $stream, 10, ['resource' => 'Files', 'name' => 'one.txt', 'workspace' => 'site-b']);
            self::fail('A resumed upload must not cross a workspace boundary.');
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

    public function testRejectedReplacementKeepsAcceptedPartAndRemovesTemporaryBytes(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 65_536, 2);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'abc'); rewind($stream);
        $manager->accept('abcdefghijklmnop', 0, 2, $stream, 200_000); fclose($stream);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, str_repeat('x', 65_537)); rewind($stream);
        try {
            $manager->accept('abcdefghijklmnop', 0, 2, $stream, 200_000);
            self::fail('Oversized replacement should be rejected.');
        } catch (SoFinderException $error) {
            self::assertSame('upload_chunk_too_large', $error->errorCode);
        } finally { fclose($stream); }
        $directory = $this->directory . '/' . hash('sha256', 'actor') . '/abcdefghijklmnop';
        self::assertSame('abc', file_get_contents($directory . '/part-0'));
        self::assertSame([0], $manager->status('abcdefghijklmnop')['received']);
        self::assertSame([], glob($directory . '/*.tmp-*'));
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'def'); rewind($stream);
        $result = $manager->accept('abcdefghijklmnop', 1, 2, $stream, 200_000); fclose($stream);
        self::assertTrue($result['complete']);
        self::assertSame('abcdef', file_get_contents($result['path']));
    }

    public function testOversizedAssemblyCanResumeWithCorrectedPart(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 2);
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'abcdef'); rewind($stream);
        $manager->accept('abcdefghijklmnop', 0, 2, $stream, 10); rewind($stream);
        try {
            $manager->accept('abcdefghijklmnop', 1, 2, $stream, 10);
            self::fail('Oversized assembly should be rejected.');
        } catch (SoFinderException $error) {
            self::assertSame('file_too_large', $error->errorCode);
        } finally { fclose($stream); }
        self::assertFalse($manager->status('abcdefghijklmnop')['complete']);
        self::assertSame([0, 1], $manager->status('abcdefghijklmnop')['received']);
        $directory = $this->directory . '/' . hash('sha256', 'actor') . '/abcdefghijklmnop';
        self::assertFileDoesNotExist($directory . '/assembled');
        $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'ghij'); rewind($stream);
        $result = $manager->accept('abcdefghijklmnop', 1, 2, $stream, 10); fclose($stream);
        self::assertTrue($result['complete']);
        self::assertSame('abcdefghij', file_get_contents($result['path']));
    }

    private function actor(): ActorProviderInterface
    {
        return new class implements ActorProviderInterface { public function actorId(): string { return 'actor'; } };
    }

    public function testSessionGuardIsReentrantAndLockStateIsBounded(): void
    {
        $manager = new ChunkUploadManager($this->directory, $this->actor(), 10, 2);
        for ($index = 0; $index < 100; ++$index) {
            $id = 'bounded-session-' . $index;
            $manager->withSessionLock($id, function () use ($manager, $id): void {
                $stream = fopen('php://temp', 'w+b'); fwrite($stream, 'abc'); rewind($stream);
                $manager->accept($id, 0, 2, $stream, 20); fclose($stream);
                self::assertSame([0], $manager->status($id)['received']);
                $manager->discard($id);
            });
        }
        $actor = $this->directory . '/' . hash('sha256', 'actor');
        self::assertLessThanOrEqual(64, count(glob($actor . '/.session-lock-*')));
        self::assertSame([], glob($actor . '/bounded-session-*'));
    }

    private function remove(string $path): void
    {
        if (is_file($path) || is_link($path)) { @unlink($path); return; }
        if (!is_dir($path)) return;
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) $this->remove($entry->getPathname());
        @rmdir($path);
    }
}
