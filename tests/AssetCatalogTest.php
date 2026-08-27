<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Asset\SharedAssetCatalog;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\State\PdoAtomicStateStore;
use SohoPHP\SoFinder\Value\Entry;

final class AssetCatalogTest extends TestCase
{
    private string $directory;
    protected function setUp(): void { $this->directory = sys_get_temp_dir() . '/sofinder-assets-' . bin2hex(random_bytes(8)); mkdir($this->directory, 0770, true); }
    protected function tearDown(): void { foreach (glob($this->directory . '/*') ?: [] as $file) @unlink($file); @rmdir($this->directory); }

    public function testLocalCatalogPreservesIdentityAcrossOverwriteAndMove(): void
    {
        $catalog = new JsonAssetCatalog($this->directory . '/assets.json'); $entry = new Entry('old/photo.jpg', 'photo.jpg', false, 100, 10, 'image/jpeg', '/files/old/photo.jpg');
        $first = $catalog->register('main', 'Files', $entry); $overwritten = $catalog->register('main', 'Files', new Entry('old/photo.jpg', 'photo.jpg', false, 120, 11, 'image/jpeg', '/files/old/photo.jpg'));
        self::assertSame($first->id, $overwritten->id); self::assertSame('11-120', $overwritten->version);
        $catalog->move('main', 'Files', 'old', 'new'); self::assertSame($first->id, $catalog->resolve('main', 'Files', 'new/photo.jpg')?->id);
        $catalog->delete('main', 'Files', 'new', true); self::assertTrue($catalog->find($first->id)?->deleted);
        $catalog->restore('main', 'Files', 'new'); self::assertFalse($catalog->find($first->id)?->deleted); self::assertSame($first->id, $catalog->resolve('main', 'Files', 'new/photo.jpg')?->id);
        $catalog->delete('main', 'Files', 'new'); $replacement = $catalog->register('main', 'Files', new Entry('new/photo.jpg', 'photo.jpg', false, 2, 20)); self::assertNotSame($first->id, $replacement->id);
    }

    public function testMetadataDistinguishesUnsetAndDecorativeAltAndUsesOptimisticVersion(): void
    {
        $catalog = new JsonAssetCatalog($this->directory . '/assets.json'); $asset = $catalog->register('main', 'Files', new Entry('photo.jpg', 'photo.jpg', false, 1, 1));
        $updated = $catalog->updateLocalizedMetadata($asset->id, '', null, ['hero'], 1, ['en' => 'Hero image']); self::assertSame('', $updated->alt); self::assertSame(['en' => 'Hero image'], $updated->altTranslations); self::assertSame(2, $updated->metadataVersion);
        $this->expectException(SoFinderException::class); $this->expectExceptionMessage('changed by another request'); $catalog->updateMetadata($asset->id, null, null, [], 1);
    }

    public function testSharedCatalogSeparatesWorkspaces(): void
    {
        if (!extension_loaded('pdo_sqlite')) self::markTestSkipped('pdo_sqlite is unavailable.');
        $catalog = new SharedAssetCatalog(new PdoAtomicStateStore(new \PDO('sqlite:' . $this->directory . '/state.sqlite'))); $entry = new Entry('same.txt', 'same.txt', false, 1, 1);
        $left = $catalog->register('left', 'Files', $entry); $right = $catalog->register('right', 'Files', $entry);
        self::assertNotSame($left->id, $right->id); self::assertSame($left->id, $catalog->resolve('left', 'Files', 'same.txt')?->id);
        $catalog->move('left', 'Files', 'same.txt', 'folder/same.txt'); self::assertSame($left->id, $catalog->resolve('left', 'Files', 'folder/same.txt')?->id);
        $metadata = $catalog->updateMetadata($left->id, 'Alternative', 'Title', ['shared'], 1); self::assertSame(2, $metadata->metadataVersion); self::assertSame($left->id, $catalog->find($left->id)?->id);
        $catalog->delete('left', 'Files', 'folder', true); self::assertTrue($catalog->find($left->id)?->deleted);
        $catalog->restore('left', 'Files', 'folder'); self::assertFalse($catalog->find($left->id)?->deleted);
        $catalog->delete('left', 'Files', 'folder'); self::assertNull($catalog->resolve('left', 'Files', 'folder/same.txt'));

        $this->expectException(SoFinderException::class);
        $catalog->updateMetadata($left->id, null, null, [], 1);
    }
}
