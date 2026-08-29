<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\DefaultWorkspaceResolver;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final class WorkspaceTest extends TestCase
{
    public function testDefaultResolverIgnoresForgedWorkspaceQuery(): void
    {
        $root = sys_get_temp_dir();
        $registry = new ResourceRegistry([new ResourceStorage(new ResourceType('Files', $root, '/files'), new LocalStorageAdapter($root, '/files'))]);
        $actors = new class implements ActorProviderInterface { public function actorId(): string { return 'actor-a'; } };
        $workspace = (new DefaultWorkspaceResolver($actors, $registry, 'main'))->resolve(new RequestContext(query: ['workspace' => 'forged']));

        self::assertSame('main', $workspace->id);
        self::assertSame('actor-a', $workspace->actor);
        self::assertSame(['Files'], $workspace->resources);
    }

    public function testFileManagerEnforcesWorkspaceResourceBoundaryBeforeStorageAccess(): void
    {
        $root = sys_get_temp_dir();
        $resource = new ResourceType('Files', $root, '/files');
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $resolver = new class implements WorkspaceResolverInterface {
            public function resolve(RequestContext $request): WorkspaceContext { return new WorkspaceContext('restricted', 'actor', ['Images']); }
        };
        $requests = new RequestStack(); $requests->push(new Request());
        $files = new FileManager($registry, $authorization, new EventDispatcher(), workspaces: new WorkspaceProvider($resolver, new SymfonyRequestContextProvider($requests)));

        $this->expectException(AccessDeniedException::class);
        $files->entry('Files', 'anything.txt');
    }
}
