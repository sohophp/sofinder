<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
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
        @rmdir($this->directory);
    }

    public function testForgetRemovesStalePathAfterItsParentWasExternallyDeleted(): void
    {
        $store = new JsonMetadataStore($this->metadataFile);
        $store->touch('actor', 'Files', 'missing/deep/file.txt', 123);

        $this->manager($store)->forget('Files', 'missing/deep/file.txt');

        self::assertSame([], $store->get('actor', 'Files')['recent']);
    }

    private function manager(JsonMetadataStore $store): MetadataManager
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
