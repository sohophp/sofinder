<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;

final class JsonMetadataStoreTest extends TestCase
{
    private string $directory;
    private string $file;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-metadata-' . bin2hex(random_bytes(8));
        $this->file = $this->directory . '/metadata.json';
    }

    protected function tearDown(): void
    {
        foreach ([$this->file, $this->file . '.lock'] as $file) {
            @unlink($file);
        }
        @rmdir($this->directory);
    }

    public function testPersistsAndIsolatesUserMetadata(): void
    {
        $store = new JsonMetadataStore($this->file);
        $store->setFavorite('actor-a', 'Files', 'one.txt', true);
        $store->setTags('actor-a', 'Files', 'one.txt', ['Important', 'News']);
        $store->touch('actor-a', 'Files', 'one.txt', 123);

        $metadata = (new JsonMetadataStore($this->file))->get('actor-a', 'Files');
        self::assertSame(['one.txt'], $metadata['favorites']);
        self::assertSame(['Important', 'News'], $metadata['tags']['one.txt']);
        self::assertSame([['path' => 'one.txt', 'touchedAt' => 123]], $metadata['recent']);
        self::assertSame(['favorites' => [], 'tags' => [], 'recent' => []], $store->get('actor-b', 'Files'));
    }

    public function testFavoriteAndTagsCanBeRemoved(): void
    {
        $store = new JsonMetadataStore($this->file);
        $store->setFavorite('actor', 'Files', 'one.txt', true);
        $store->setFavorite('actor', 'Files', 'one.txt', false);
        $store->setTags('actor', 'Files', 'one.txt', ['Tag']);
        $store->setTags('actor', 'Files', 'one.txt', []);

        self::assertSame(['favorites' => [], 'tags' => [], 'recent' => []], $store->get('actor', 'Files'));
    }

    public function testRecentEntriesAreDeduplicatedAndBounded(): void
    {
        $store = new JsonMetadataStore($this->file);
        foreach (range(1, 55) as $index) {
            $store->touch('actor', 'Files', sprintf('file-%d.txt', $index), $index);
        }
        $store->touch('actor', 'Files', 'file-50.txt', 100);

        $recent = $store->get('actor', 'Files')['recent'];
        self::assertCount(50, $recent);
        self::assertSame(['path' => 'file-50.txt', 'touchedAt' => 100], $recent[0]);
        self::assertCount(1, array_filter($recent, static fn (array $item): bool => $item['path'] === 'file-50.txt'));
    }

    public function testMetadataFollowsRenameAndIsRemovedWithFolder(): void
    {
        $store = new JsonMetadataStore($this->file);
        $store->setFavorite('actor', 'Files', 'folder/one.txt', true);
        $store->setTags('actor', 'Files', 'folder/one.txt', ['Tag']);
        $store->touch('actor', 'Files', 'folder/one.txt', 123);

        $store->movePath('actor', 'Files', 'folder', 'renamed');
        $moved = $store->get('actor', 'Files');
        self::assertSame(['renamed/one.txt'], $moved['favorites']);
        self::assertSame(['Tag'], $moved['tags']['renamed/one.txt']);
        self::assertSame('renamed/one.txt', $moved['recent'][0]['path']);

        $store->deletePath('actor', 'Files', 'renamed');
        self::assertSame(['favorites' => [], 'tags' => [], 'recent' => []], $store->get('actor', 'Files'));
    }
}
