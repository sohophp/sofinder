<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\State\PdoAtomicStateStore;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Trash\TrashManager;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;
use SohoPHP\SoFinder\Upload\SharedChunkUploadStore;
use SohoPHP\SoFinder\Usage\PersistentUsageTracker;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class DomainConcurrencyTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        if (!function_exists('pcntl_fork') || !function_exists('pcntl_waitpid')) self::markTestSkipped('pcntl is required.');
        $this->root = sys_get_temp_dir() . '/sofinder-domain-concurrency-' . bin2hex(random_bytes(8));
        mkdir($this->root . '/files', 0775, true);
    }

    protected function tearDown(): void { $this->remove($this->root); }

    public function testSameNameUploadsAndOverwritesAreAtomic(): void
    {
        $this->fork(4, function (int $worker): void {
            $stream = $this->stream('worker-' . $worker);
            try { $this->files()->upload('Files', '', 'report.txt', 8, $stream, false, true); }
            finally { fclose($stream); }
        });
        self::assertCount(4, glob($this->root . '/files/report*.txt') ?: []);

        $this->fork(4, function (int $worker): void {
            $payload = 'replacement-' . $worker;
            $stream = $this->stream($payload);
            try { $this->files()->upload('Files', '', 'report.txt', strlen($payload), $stream, true); }
            finally { fclose($stream); }
        });
        self::assertMatchesRegularExpression('/^replacement-[0-3]$/', (string) file_get_contents($this->root . '/files/report.txt'));
    }

    public function testQuotaReservationAllowsOnlyOneCompetingUpload(): void
    {
        $this->fork(2, function (int $worker): void {
            $stream = $this->stream('12');
            try {
                $this->files(3)->upload('Files', '', 'quota-' . $worker . '.txt', 2, $stream);
                file_put_contents($this->root . '/result-' . $worker, 'accepted');
            } catch (\Throwable) {
                file_put_contents($this->root . '/result-' . $worker, 'rejected');
            } finally { fclose($stream); }
        });
        $results = [file_get_contents($this->root . '/result-0'), file_get_contents($this->root . '/result-1')];
        self::assertSame(1, count(array_filter($results, static fn ($result): bool => $result === 'accepted')));
        self::assertSame(2, array_sum(array_map('filesize', glob($this->root . '/files/*.txt') ?: [])));
    }

    public function testRestoreAndPermanentDeleteCannotCorruptTheSameTrashItem(): void
    {
        file_put_contents($this->root . '/files/deleted.txt', 'recoverable');
        $trash = $this->trash();
        $resource = $this->resource();
        $item = $trash->put($resource, 'deleted.txt')['item'];
        $this->fork(2, function (int $worker) use ($trash, $resource, $item): void {
            try {
                if ($worker === 0) $trash->restore($resource, $item->id);
                else $trash->permanentlyDelete($item->id);
            } catch (\Throwable) {
            }
        });
        $restored = is_file($this->root . '/files/deleted.txt');
        if ($restored) self::assertSame('recoverable', file_get_contents($this->root . '/files/deleted.txt'));
        self::assertSame([], $trash->list('Files'));
    }

    public function testSharedChunkSessionResumesAcrossProcesses(): void
    {
        if (!in_array('sqlite', \PDO::getAvailableDrivers(), true)) self::markTestSkipped('pdo_sqlite is required.');
        $database = $this->root . '/state.sqlite';
        $this->state($database)->install();
        $this->fork(2, function (int $worker) use ($database): void {
            $store = new SharedChunkUploadStore(new ChunkUploadManager($this->root . '/chunks', $this->actor(), 10, 3), $this->state($database), $this->actor());
            $stream = $this->stream($worker === 0 ? 'abc' : 'def');
            try { $store->accept('abcdefghijklmnop', $worker, 2, $stream, 10, ['resource' => 'Files', 'name' => 'joined.txt']); }
            finally { fclose($stream); }
        });
        $store = new SharedChunkUploadStore(new ChunkUploadManager($this->root . '/chunks', $this->actor(), 10, 3), $this->state($database), $this->actor());
        $status = $store->status('abcdefghijklmnop');
        self::assertTrue($status['complete']);
        self::assertSame('abcdef', file_get_contents($this->root . '/chunks/' . hash('sha256', 'actor') . '/abcdefghijklmnop/assembled'));
    }

    private function files(int $quota = 0): FileManager
    {
        return new FileManager(
            new ResourceRegistry([$this->resource($quota)]),
            new class implements AuthorizationInterface {
                public function isAuthenticated(): bool { return true; }
                public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
            },
            new EventDispatcher(),
            usage: new PersistentUsageTracker($this->root . '/usage'),
        );
    }

    private function resource(int $quota = 0): ResourceStorage
    {
        $type = new ResourceType('Files', $this->root . '/files', '/files', ['txt'], quotaBytes: $quota);
        return new ResourceStorage($type, new LocalStorageAdapter($this->root . '/files', '/files'));
    }

    private function trash(): TrashManager { return new TrashManager($this->root . '/trash', $this->actor(), new PathGuard()); }
    private function actor(): ActorProviderInterface { return new class implements ActorProviderInterface { public function actorId(): string { return 'actor'; } }; }
    private function state(string $file): PdoAtomicStateStore { $pdo = new \PDO('sqlite:' . $file); $pdo->exec('PRAGMA busy_timeout = 10000'); return new PdoAtomicStateStore($pdo); }
    /** @return resource */
    private function stream(string $contents): mixed { $stream = fopen('php://temp', 'w+b'); fwrite($stream, $contents); rewind($stream); return $stream; }

    /** @param callable(int):void $worker */
    private function fork(int $count, callable $worker): void
    {
        $children = [];
        for ($index = 0; $index < $count; ++$index) {
            $pid = pcntl_fork();
            if ($pid === 0) { try { $worker($index); exit(0); } catch (\Throwable $exception) { fwrite(STDERR, $exception->getMessage() . "\n"); exit(1); } }
            if ($pid < 0) self::fail('Unable to fork test worker.');
            $children[] = $pid;
        }
        foreach ($children as $pid) { pcntl_waitpid($pid, $status); self::assertSame(0, pcntl_wexitstatus($status)); }
    }

    private function remove(string $path): void
    {
        if (is_file($path) || is_link($path)) { @unlink($path); return; }
        if (!is_dir($path)) return;
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) $this->remove($entry->getPathname());
        @rmdir($path);
    }
}
