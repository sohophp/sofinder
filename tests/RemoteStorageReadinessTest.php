<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\RecycleBinInterface;
use SohoPHP\SoFinder\Contract\StorageAdapterInterface;
use SohoPHP\SoFinder\Contract\StorageUsageProviderInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ListQuery;
use SohoPHP\SoFinder\Value\ListingPage;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\StorageCapabilities;
use SohoPHP\SoFinder\Value\TrashItem;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class RemoteStorageReadinessTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-remote-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->directory);
    }

    public function testUnknownTotalsAndOpaqueCursorsRemainIntact(): void
    {
        $storage = new RemoteAdapter($this->directory, unknownTotal: true);
        file_put_contents($this->directory . '/one.txt', '1');

        $result = $this->manager($storage)->list('Files', limit: 1);

        self::assertNull($result['total']);
        self::assertSame('next-opaque-token', $result['nextCursor']);
    }

    public function testNonRecoverableStorageBypassesConfiguredRecycleBin(): void
    {
        $storage = new RemoteAdapter($this->directory);
        $trash = new RejectingRecycleBin();
        file_put_contents($this->directory . '/one.txt', '1');

        self::assertNull($this->manager($storage, $trash)->delete('Files', 'one.txt'));
        self::assertFalse($trash->called);
        self::assertFileDoesNotExist($this->directory . '/one.txt');
    }

    private function manager(StorageAdapterInterface $storage, ?RecycleBinInterface $trash = null): FileManager
    {
        $resource = new ResourceType('Files', 'remote-prefix', '');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };

        return new FileManager(new ResourceRegistry([new ResourceStorage($resource, $storage)]), $authorization, new EventDispatcher(), trash: $trash);
    }
}

final class RemoteAdapter implements StorageAdapterInterface, StorageUsageProviderInterface
{
    private LocalStorageAdapter $local;

    public function __construct(string $directory, private readonly bool $unknownTotal = false)
    {
        $this->local = new LocalStorageAdapter($directory);
    }

    public function list(ListQuery $query): ListingPage
    {
        $page = $this->local->list($query);
        return new ListingPage($page->entries, $this->unknownTotal ? null : $page->total, $page->offset, $page->limit, $this->unknownTotal ? 'next-opaque-token' : $page->nextCursor);
    }
    public function capabilities(): StorageCapabilities { return new StorageCapabilities(cursorPagination: $this->unknownTotal); }
    public function entry(string $path): Entry { return $this->local->entry($path); }
    public function createDirectory(string $path): Entry { return $this->local->createDirectory($path); }
    public function writeStream(string $path, mixed $stream, bool $overwrite = false): Entry { return $this->local->writeStream($path, $stream, $overwrite); }
    public function readStream(string $path): mixed { return $this->local->readStream($path); }
    public function move(string $source, string $destination, bool $overwrite = false): Entry { return $this->local->move($source, $destination, $overwrite); }
    public function copy(string $source, string $destination, bool $overwrite = false): Entry { return $this->local->copy($source, $destination, $overwrite); }
    public function delete(string $path): void { $this->local->delete($path); }
    public function publicUrl(string $path): ?string { return null; }
    public function size(string $path): int { return $this->local->size($path); }
    public function usage(): int { return $this->local->usage(); }
}

final class RejectingRecycleBin implements RecycleBinInterface
{
    public bool $called = false;
    public function put(ResourceStorage $resource, string $path): array { $this->called = true; throw new \LogicException('Remote trash must not be called.'); }
    public function list(?string $resource = null): array { return []; }
    public function statistics(): array { return ['usedItems' => 0, 'usedBytes' => 0, 'maxItems' => 0, 'maxBytes' => 0]; }
    public function get(string $id): TrashItem { throw new \LogicException(); }
    public function restore(ResourceStorage $resource, string $id, string $conflict = 'cancel'): Entry { throw new \LogicException(); }
    public function permanentlyDelete(string $id): void { throw new \LogicException(); }
    public function purgeExpired(?int $limit = null): int { return 0; }
}
