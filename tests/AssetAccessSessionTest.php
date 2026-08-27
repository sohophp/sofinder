<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\AssetAccessSessionManager;
use SohoPHP\SoFinder\Asset\JsonAssetAccessSessionStore;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final class AssetAccessSessionTest extends TestCase
{
    public function testPrivateSessionIsRevisionBoundAndRevocable(): void
    {
        $directory = sys_get_temp_dir() . '/sofinder-access-session-' . bin2hex(random_bytes(5)); mkdir($directory, 0777, true); file_put_contents($directory . '/private.txt', 'secret');
        try {
            $requestStack = new RequestStack(); $requestStack->push(new Request());
            $resolver = new class implements WorkspaceResolverInterface { public function resolve(Request $request): WorkspaceContext { return new WorkspaceContext('main', 'actor', ['Private']); } };
            $workspaces = new WorkspaceProvider($resolver, $requestStack);
            $authorization = new class implements AuthorizationInterface { public function isAuthenticated(): bool { return true; } public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; } };
            $type = new ResourceType('Private', $directory, '', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain'], deliveryMode: 'proxy');
            $registry = new ResourceRegistry([new ResourceStorage($type, new LocalStorageAdapter($directory, ''))]);
            $files = new FileManager($registry, $authorization, new EventDispatcher(), workspaces: $workspaces);
            $catalog = new JsonAssetCatalog($directory . '/catalog.json'); $asset = $catalog->register('main', 'Private', $files->entry('Private', 'private.txt'));
            $now = 1000; $manager = new AssetAccessSessionManager($catalog, new JsonAssetAccessSessionStore($directory . '/sessions'), $workspaces, $files, $registry, true, 300, 3600, 10, static function () use (&$now): int { return $now; });
            $session = $manager->create([$asset->id]); self::assertSame(1300, $session['expiresAt']);
            $opened = $manager->open($session['token'], $asset->id); self::assertSame('private.txt', $opened['entry']->path); fclose($opened['stream']);
            $manager->revoke($session['id']);
            $this->expectException(SoFinderException::class); $manager->open($session['token'], $asset->id);
        } finally {
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($iterator as $item) $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname()); @rmdir($directory);
        }
    }
}
