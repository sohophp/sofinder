<?php
declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;

final class ChunkUploadConcurrencyTest extends TestCase
{
    private string $directory;
    private array $workers = [];

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-chunk-concurrency-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0700);
    }

    protected function tearDown(): void
    {
        foreach ($this->workers as [$process, $pipes]) {
            if (proc_get_status($process)['running']) proc_terminate($process);
            foreach ($pipes as $pipe) if (is_resource($pipe)) fclose($pipe);
            proc_close($process);
        }
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $file) $file->isDir() ? rmdir($file->getPathname()) : unlink($file->getPathname());
        rmdir($this->directory);
    }

    private function worker(string $operation): array
    {
        $process = proc_open([PHP_BINARY, __DIR__ . '/Fixtures/chunk-concurrency-worker.php', $this->directory, $operation],
            [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
        self::assertIsResource($process);
        $this->workers[] = [$process, $pipes];
        return $pipes;
    }

    private function line($pipe): string
    {
        $read = [$pipe]; $write = $except = [];
        self::assertSame(1, stream_select($read, $write, $except, 5), 'Worker did not reach its barrier.');
        return trim((string) fgets($pipe));
    }

    private function assertWaiting($pipe): void
    {
        $read = [$pipe]; $write = $except = [];
        self::assertSame(0, stream_select($read, $write, $except, 0, 200_000), 'A concurrent operation bypassed the active writer.');
    }

    public function testCancellationWaitsForActiveWriter(): void
    {
        $writer = $this->worker('accept'); self::assertSame('reading', $this->line($writer[1]));
        $cancel = $this->worker('discard'); self::assertSame('starting', $this->line($cancel[1]));
        $this->assertWaiting($cancel[1]);
        fwrite($writer[0], "continue\n");
        self::assertSame('accepted', $this->line($writer[1]));
        self::assertSame('discarded', $this->line($cancel[1]));
        self::assertDirectoryDoesNotExist($this->directory . '/' . hash('sha256', 'actor') . '/concurrent-session-01');
    }

    public function testStatusWaitsForAConsistentAcceptedPart(): void
    {
        $writer = $this->worker('accept'); self::assertSame('reading', $this->line($writer[1]));
        $reader = $this->worker('status'); self::assertSame('starting', $this->line($reader[1]));
        $this->assertWaiting($reader[1]);
        fwrite($writer[0], "continue\n"); self::assertSame('accepted', $this->line($writer[1]));
        $status = json_decode($this->line($reader[1]), true, 32, JSON_THROW_ON_ERROR);
        self::assertSame([0], $status['received']);
        self::assertFalse($status['complete']);
    }

    public function testExpiryCleanupSkipsBusySession(): void
    {
        $writer = $this->worker('accept'); self::assertSame('reading', $this->line($writer[1]));
        $session = $this->directory . '/' . hash('sha256', 'actor') . '/concurrent-session-01';
        touch($session, time() - 90_000);
        $cleaner = $this->worker('cleanup'); self::assertSame('starting', $this->line($cleaner[1]));
        self::assertSame('purged:0', $this->line($cleaner[1]));
        self::assertDirectoryExists($session);
        fwrite($writer[0], "continue\n"); self::assertSame('accepted', $this->line($writer[1]));
        self::assertSame('abc', file_get_contents($session . '/part-0'));
    }

    public function testCancellationCannotDeleteAssemblyDuringPublication(): void
    {
        $writer = $this->worker('publish'); self::assertSame('publishing', $this->line($writer[1]));
        $cancel = $this->worker('cancel'); self::assertSame('starting', $this->line($cancel[1]));
        $this->assertWaiting($cancel[1]);
        fwrite($writer[0], "continue\n");
        self::assertSame('published', $this->line($writer[1]));
        self::assertSame('error:upload_session_not_found', $this->line($cancel[1]));
        self::assertSame('abc', file_get_contents($this->directory . '/files/published.txt'));
        self::assertDirectoryDoesNotExist($this->directory . '/' . hash('sha256', 'actor') . '/concurrent-session-01');
    }

    public function testPublicationFailureReleasesLockAndDoesNotPublishTarget(): void
    {
        $writer = $this->worker('reject'); self::assertSame('publishing', $this->line($writer[1]));
        $reader = $this->worker('status'); self::assertSame('starting', $this->line($reader[1]));
        $this->assertWaiting($reader[1]);
        fwrite($writer[0], "continue\n");
        self::assertSame('error:test_rejected', $this->line($writer[1]));
        self::assertSame('error:upload_session_not_found', $this->line($reader[1]));
        self::assertFileDoesNotExist($this->directory . '/files/published.txt');
        self::assertSame([], glob($this->directory . '/quarantine/.sofinder-quarantine-*'));
    }
}
