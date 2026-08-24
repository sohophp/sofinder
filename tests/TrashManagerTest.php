<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Trash\TrashManager;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;

final class TrashManagerTest extends TestCase
{
    private string $directory;
    private string $trash;

    protected function setUp(): void
    {
        $base = sys_get_temp_dir() . '/sofinder-trash-test-' . bin2hex(random_bytes(8));
        $this->directory = $base . '/files';
        $this->trash = $base . '/private-trash';
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
        $this->remove(dirname($this->directory));
    }

    public function testDeleteIsRecoverableAndRestoreRenamePreservesConflict(): void
    {
        file_put_contents($this->directory . '/report.txt', 'original');
        $manager = $this->manager('actor-one');
        $resource = $this->resource();

        $result = $manager->put($resource, 'report.txt');
        $item = $result['item'];
        self::assertFileDoesNotExist($this->directory . '/report.txt');
        self::assertSame([$item->id], array_map(static fn ($entry): string => $entry->id, $manager->list('Files')));

        file_put_contents($this->directory . '/report.txt', 'new');
        $restored = $manager->restore($resource, $item->id, 'rename');
        self::assertSame('report (1).txt', $restored->path);
        self::assertSame('new', file_get_contents($this->directory . '/report.txt'));
        self::assertSame('original', file_get_contents($this->directory . '/report (1).txt'));
        self::assertSame([], $manager->list('Files'));
    }

    public function testRestoreAutoRenameRechecksGeneratedFileNameLength(): void
    {
        file_put_contents($this->directory . '/report.txt', 'original');
        $manager = $this->manager('actor-one');
        $type = new ResourceType('Files', $this->directory, '/files', allowedExtensions: ['txt'], maxFileNameLength: 10);
        $resource = new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/files'));
        $item = $manager->put($resource, 'report.txt')['item'];
        file_put_contents($this->directory . '/report.txt', 'new');

        try {
            $manager->restore($resource, $item->id, 'rename');
            self::fail('An auto-renamed restore must enforce the generated name length.');
        } catch (\SohoPHP\SoFinder\Exception\SoFinderException $exception) {
            self::assertSame('file_name_too_long', $exception->errorCode);
        }

        self::assertSame('new', file_get_contents($this->directory . '/report.txt'));
        self::assertSame([$item->id], array_map(static fn ($entry): string => $entry->id, $manager->list('Files')));
    }

    public function testTrashIsActorIsolatedAndCanBePermanentlyDeleted(): void
    {
        file_put_contents($this->directory . '/secret.txt', 'secret');
        $first = $this->manager('actor-one');
        $item = $first->put($this->resource(), 'secret.txt')['item'];

        self::assertSame([], $this->manager('actor-two')->list('Files'));
        $first->permanentlyDelete($item->id);
        self::assertSame([], $first->list('Files'));
    }

    public function testTrashLimitsUseActualRecursiveBytes(): void
    {
        mkdir($this->directory . '/album');
        file_put_contents($this->directory . '/album/photo.txt', '12345');
        $manager = $this->manager('actor-one', 1, 5);

        $item = $manager->put($this->resource(), 'album')['item'];
        self::assertSame(5, $item->size);
        self::assertSame(['usedItems' => 1, 'usedBytes' => 5, 'maxItems' => 1, 'maxBytes' => 5], $manager->statistics());

        file_put_contents($this->directory . '/second.txt', 'x');
        $second = $manager->put($this->resource(), 'second.txt');
        self::assertSame(1, $second['purgedItems']);
        self::assertSame(5, $second['purgedBytes']);
        self::assertSame(['second.txt'], array_map(static fn ($entry): string => $entry->path, $manager->list('Files')));
    }

    public function testOversizedEntryDoesNotPurgeExistingTrashOrMoveSource(): void
    {
        file_put_contents($this->directory . '/existing.txt', '123');
        file_put_contents($this->directory . '/oversized.txt', '123456');
        $manager = $this->manager('actor-one', 10, 5);
        $manager->put($this->resource(), 'existing.txt');

        try {
            $manager->put($this->resource(), 'oversized.txt');
            self::fail('An entry larger than the recycle bin capacity must be rejected.');
        } catch (\SohoPHP\SoFinder\Exception\SoFinderException $exception) {
            self::assertSame('trash_entry_too_large', $exception->errorCode);
        }

        self::assertFileExists($this->directory . '/oversized.txt');
        self::assertSame(['existing.txt'], array_map(static fn ($entry): string => $entry->path, $manager->list('Files')));
    }

    private function manager(string $actor, int $maxItems = 1000, int $maxBytes = 1073741824): TrashManager
    {
        $provider = new class($actor) implements ActorProviderInterface {
            public function __construct(private readonly string $actor)
            {
            }

            public function actorId(): string
            {
                return $this->actor;
            }
        };

        return new TrashManager($this->trash, $provider, new PathGuard(), 30, $maxItems, $maxBytes);
    }

    private function resource(): ResourceStorage
    {
        $type = new ResourceType('Files', $this->directory, '/files', allowedExtensions: ['txt']);

        return new ResourceStorage($type, new LocalStorageAdapter($this->directory, '/files'));
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
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) {
            $this->remove($entry->getPathname());
        }
        @rmdir($path);
    }
}
