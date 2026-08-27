<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\BoundedAssetSearchProvider;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\AssetSearchController;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\AssetSearchQuery;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final class AssetSearchTest extends TestCase
{
    private string $directory;
    private FileManager $files;
    private JsonAssetCatalog $catalog;
    private WorkspaceProvider $workspaces;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-asset-search-' . bin2hex(random_bytes(6));
        mkdir($this->directory . '/images', 0775, true);
        file_put_contents($this->directory . '/images/sunset.jpg', 'image');
        file_put_contents($this->directory . '/manual.pdf', 'manual');
        file_put_contents($this->directory . '/notes.txt', 'notes');
        touch($this->directory . '/images/sunset.jpg', 100);
        touch($this->directory . '/manual.pdf', 200);
        touch($this->directory . '/notes.txt', 300);
        $resource = new ResourceType('Files', $this->directory, '/files');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $this->files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $this->catalog = new JsonAssetCatalog($this->directory . '/catalog.json');
        $record = $this->catalog->register('main', 'Files', $this->files->entry('Files', 'images/sunset.jpg'));
        $this->catalog->updateLocalizedMetadata($record->id, 'Orange sky', 'Summer campaign', ['homepage', 'Nature'], 1, ['zh-cn' => '橙色天空']);
        $stack = new RequestStack();
        $stack->push(new Request());
        $resolver = new class implements WorkspaceResolverInterface {
            public function resolve(Request $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Files']); }
        };
        $this->workspaces = new WorkspaceProvider($resolver, $stack);
    }

    protected function tearDown(): void
    {
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $item) { $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname()); }
        rmdir($this->directory);
    }

    public function testSearchesNamesAndLocalizedAssetMetadataAcrossFolders(): void
    {
        $provider = new BoundedAssetSearchProvider($this->files, $this->catalog, 100);
        $byTitle = $provider->search($this->workspaces->current(), new AssetSearchQuery('campaign'));
        self::assertSame(1, $byTitle->total);
        self::assertSame('images/sunset.jpg', $byTitle->items[0]['entry']->path);
        self::assertSame('Summer campaign', $byTitle->items[0]['metadata']['title']);

        $byTranslation = $provider->search($this->workspaces->current(), new AssetSearchQuery('橙色'));
        self::assertSame(1, $byTranslation->total);
        self::assertSame(['image' => 1], $byTranslation->facets['types']);
    }

    public function testCombinesTypeTagSizeAndDateFilters(): void
    {
        $provider = new BoundedAssetSearchProvider($this->files, $this->catalog, 100);
        $result = $provider->search($this->workspaces->current(), new AssetSearchQuery(tags: ['nature'], type: 'image', minimumSize: 5, modifiedBefore: 150));
        self::assertSame(1, $result->total);
        self::assertSame(['Files' => 1], $result->facets['resources']);
        self::assertFalse($result->truncated);

        self::assertSame(0, $provider->search($this->workspaces->current(), new AssetSearchQuery(tags: ['missing']))->total);
    }

    public function testControllerRejectsInvalidRangesAndPublishesBoundedResults(): void
    {
        $controller = new AssetSearchController(new BoundedAssetSearchProvider($this->files, $this->catalog, 100), $this->workspaces);
        $response = $controller(Request::create('/api/assets/search?q=manual&type=document&limit=10'));
        $payload = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('manual.pdf', $payload['data']['items'][0]['entry']['path']);
        self::assertSame(10, $payload['data']['limit']);

        $this->expectExceptionMessage('size range');
        $controller(Request::create('/api/assets/search?minSize=20&maxSize=10'));
    }
}
