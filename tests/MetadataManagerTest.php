<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class MetadataManagerTest extends TestCase
{
    private string $directory;
    private string $metadataFile;

    protected function setUp(): void
    {
        $suffix = bin2hex(random_bytes(8));
        $this->directory = sys_get_temp_dir() . '/sofinder-metadata-manager-' . $suffix;
        $this->metadataFile = sys_get_temp_dir() . '/sofinder-metadata-manager-' . $suffix . '.json';
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        @unlink($this->metadataFile);
        @unlink($this->metadataFile . '.lock');
        foreach (glob($this->directory . '/*') ?: [] as $path) is_dir($path) ? @rmdir($path) : @unlink($path);
        @rmdir($this->directory);
    }

    public function testForgetRemovesStalePathAfterItsParentWasExternallyDeleted(): void
    {
        $store = new JsonMetadataStore($this->metadataFile);
        $store->touch('actor', 'Files', 'missing/deep/file.txt', 123);

        $this->manager($store)->forget('Files', 'missing/deep/file.txt');

        self::assertSame([], $store->get('actor', 'Files')['recent']);
    }

    public function testQuickAccessAcceptsFoldersAndEnforcesItsLimit(): void
    {
        $store = new JsonMetadataStore($this->metadataFile);
        foreach (range(1, 12) as $index) mkdir($this->directory . "/folder-$index");
        foreach (range(1, 12) as $index) $this->manager($store)->quickAccess('Files', "folder-$index", true);
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('limited to 12');
        mkdir($this->directory . '/folder-13');
        $this->manager($store)->quickAccess('Files', 'folder-13', true);
    }

    public function testQuickAccessRejectsAddingButAllowsRemovingLegacyFiles(): void
    {
        $store = new JsonMetadataStore($this->metadataFile);
        file_put_contents($this->directory . '/file.txt', 'x');
        $store->setQuickAccess('actor', 'Files', 'file.txt', true);

        try {
            $this->manager($store)->quickAccess('Files', 'file.txt', true);
            self::fail('Quick access must reject adding a file.');
        } catch (SoFinderException $exception) {
            self::assertSame('quick_access_file_disabled', $exception->errorCode);
        }

        $this->manager($store)->quickAccess('Files', 'file.txt', false);
        self::assertSame([], $store->get('actor', 'Files')['quickAccess']);
    }

    public function testFavoritesAcceptFilesButRejectFolders(): void
    {
        $store = new JsonMetadataStore($this->metadataFile);
        file_put_contents($this->directory . '/file.txt', 'x');
        mkdir($this->directory . '/folder');

        $this->manager($store)->favorite('Files', 'file.txt', true);
        self::assertSame(['file.txt'], $store->get('actor', 'Files')['favorites']);

        try {
            $this->manager($store)->favorite('Files', 'folder', true);
            self::fail('Favorites must reject folders.');
        } catch (SoFinderException $exception) {
            self::assertSame('favorite_folder_unsupported', $exception->errorCode);
        }
    }

    public function testQuickAccessEntriesDescribeFoldersAndStalePathsAndHideLegacyFiles(): void
    {
        $store = new JsonMetadataStore($this->metadataFile);
        file_put_contents($this->directory . '/manual.txt', 'text');
        mkdir($this->directory . '/manuals');
        foreach (['manual.txt', 'manuals', 'missing.txt'] as $path) $store->setQuickAccess('actor', 'Files', $path, true);

        $entries = $this->manager($store)->quickAccessEntries('Files');
        $byPath = array_column($entries, null, 'path');

        self::assertCount(2, $byPath);
        self::assertArrayNotHasKey('manual.txt', $byPath);
        self::assertArrayHasKey('manuals', $byPath);
        self::assertArrayHasKey('missing.txt', $byPath);
        self::assertTrue($byPath['manuals']['directory']);
        self::assertFalse($byPath['missing.txt']['exists']);
        self::assertNull($byPath['missing.txt']['directory']);
    }

    public function testLegacyMetadataStoresRemainReadableWithoutQuickAccessExtension(): void
    {
        $store = new class implements MetadataStoreInterface {
            public function get(string $actor, string $resource): array { return ['favorites' => [], 'tags' => [], 'recent' => []]; }
            public function setFavorite(string $actor, string $resource, string $path, bool $favorite): void {}
            public function setTags(string $actor, string $resource, string $path, array $tags): void {}
            public function touch(string $actor, string $resource, string $path, int $touchedAt): void {}
            public function movePath(string $actor, string $resource, string $source, string $destination): void {}
            public function deletePath(string $actor, string $resource, string $path): void {}
        };
        self::assertSame([], $this->manager($store)->get('Files')['quickAccess']);

        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('does not support quick access');
        $this->manager($store)->quickAccess('Files', 'folder', true);
    }

    private function manager(MetadataStoreInterface $store): MetadataManager
    {
        $guard = new PathGuard();
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt'], [], []);
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files', $guard))]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $actors = new class implements ActorProviderInterface {
            public function actorId(): string { return 'actor'; }
        };

        return new MetadataManager(new FileManager($registry, $authorization, new EventDispatcher(), $guard), $store, $actors);
    }
}
