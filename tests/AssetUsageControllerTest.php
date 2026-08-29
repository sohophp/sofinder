<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Asset\JsonAssetUsageStore;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\AssetUsageController;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class AssetUsageControllerTest extends TestCase
{
    public function testFolderDeleteCheckFindsNestedAssetUsages(): void
    {
        $directory = sys_get_temp_dir() . '/sofinder-usage-controller-' . bin2hex(random_bytes(5)); mkdir($directory . '/folder', 0777, true); file_put_contents($directory . '/folder/image.jpg', 'image');
        try {
            $requests = new RequestStack(); $requests->push(new Request()); $resolver = new class implements WorkspaceResolverInterface { public function resolve(RequestContext $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Files']); } }; $workspaces = new WorkspaceProvider($resolver, new SymfonyRequestContextProvider($requests));
            $authorization = new class implements AuthorizationInterface { public function isAuthenticated(): bool { return true; } public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; } };
            $resource = new ResourceStorage(new ResourceType('Files', $directory, '/files'), new LocalStorageAdapter($directory, '/files')); $files = new FileManager(new ResourceRegistry([$resource]), $authorization, new EventDispatcher(), workspaces: $workspaces);
            $catalog = new JsonAssetCatalog($directory . '/../catalog-' . basename($directory) . '.json'); $record = $catalog->register('main', 'Files', $files->entry('Files', 'folder/image.jpg')); $usages = new JsonAssetUsageStore($directory . '/../usage-' . basename($directory) . '.json'); $usages->put('main', $record->id, 'page:1', 'Home page', '/admin/pages/1', 'hero');
            $tokens = $this->createMock(CsrfTokenManagerInterface::class); $tokens->method('isTokenValid')->willReturn(true); $controller = new AssetUsageController($catalog, $usages, $workspaces, $files, new CsrfGuard($tokens, $authorization), true);
            $response = $controller->deleteCheck(Request::create('/api/assets/delete-check', 'POST', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: json_encode(['resource' => 'Files', 'paths' => ['folder']], JSON_THROW_ON_ERROR))); $payload = json_decode((string) $response->getContent(), true, 32, JSON_THROW_ON_ERROR)['data'];
            self::assertFalse($payload['safe']); self::assertTrue($payload['complete']); self::assertSame(1, $payload['total']); self::assertSame('folder/image.jpg', $payload['assets'][0]['path']);
            @unlink($directory . '/../catalog-' . basename($directory) . '.json'); @unlink($directory . '/../usage-' . basename($directory) . '.json');
        } finally {
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST); foreach ($iterator as $item) $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname()); @rmdir($directory);
        }
    }
}
