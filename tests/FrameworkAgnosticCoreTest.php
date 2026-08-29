<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use Psr\EventDispatcher\EventDispatcherInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Storage\ResourceRegistryFactory;
use SohoPHP\SoFinder\Value\ResourceType;

final class FrameworkAgnosticCoreTest extends TestCase
{
    public function testCoreCanBeBootstrappedWithoutAFrameworkContainerOrRequest(): void
    {
        $root = sys_get_temp_dir() . '/sofinder-headless-' . bin2hex(random_bytes(8));
        mkdir($root, 0775, true);

        try {
            $registry = (new ResourceRegistryFactory())->create([
                'Files' => [
                    'root' => $root,
                    'public_url' => '/media',
                    'allowed_extensions' => ['txt'],
                ],
            ]);
            $authorization = new class implements AuthorizationInterface {
                public function isAuthenticated(): bool
                {
                    return true;
                }

                public function isGranted(string $operation, ResourceType $resource, string $path): bool
                {
                    return true;
                }
            };
            $events = new class implements EventDispatcherInterface {
                public function dispatch(object $event): object
                {
                    return $event;
                }
            };

            $files = new FileManager($registry, $authorization, $events);

            self::assertSame('Files', $files->resources()[0]['name']);
            self::assertSame('/media', $registry->get('Files')->resource->publicUrl);
            self::assertSame([], $files->list('Files')['entries']);
        } finally {
            rmdir($root);
        }
    }

    public function testBridgeCanResolvePublicUrlsWithoutChangingCoreConstruction(): void
    {
        $root = sys_get_temp_dir() . '/sofinder-headless-' . bin2hex(random_bytes(8));
        mkdir($root, 0775, true);

        try {
            $registry = (new ResourceRegistryFactory(
                publicUrlResolver: static fn (string $url): string => '/admin' . $url,
            ))->create([
                'Files' => ['root' => $root, 'public_url' => '/media'],
            ]);

            self::assertSame('/admin/media', $registry->get('Files')->resource->publicUrl);
        } finally {
            rmdir($root);
        }
    }
}
