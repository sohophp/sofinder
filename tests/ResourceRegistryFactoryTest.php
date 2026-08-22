<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Symfony\ResourceRegistryFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final class ResourceRegistryFactoryTest extends TestCase
{
    /** @return iterable<string, array{string, string, string}> */
    public static function publicUrlProvider(): iterable
    {
        yield 'application in a subdirectory' => [
            '/uploads/editor/files',
            '/winstar2024/index.php',
            '/winstar2024/uploads/editor/files',
        ];
        yield 'application at domain root' => [
            '/uploads/editor/files',
            '/index.php',
            '/uploads/editor/files',
        ];
        yield 'already prefixed path' => [
            '/winstar2024/uploads/editor/files',
            '/winstar2024/index.php',
            '/winstar2024/uploads/editor/files',
        ];
        yield 'absolute CDN URL' => [
            'https://cdn.example.test/editor/files',
            '/winstar2024/index.php',
            'https://cdn.example.test/editor/files',
        ];
    }

    /** @dataProvider publicUrlProvider */
    public function testPublicUrlRespectsTheRequestBasePath(
        string $configuredUrl,
        string $scriptName,
        string $expectedUrl,
    ): void {
        $root = sys_get_temp_dir() . '/sofinder-registry-' . bin2hex(random_bytes(8));
        mkdir($root, 0775, true);

        try {
            $request = Request::create('https://example.test' . dirname($scriptName) . '/sofinder/api/config');
            $request->server->set('SCRIPT_NAME', $scriptName);
            $request->server->set('SCRIPT_FILENAME', '/var/www/public' . $scriptName);
            $request->initialize(
                $request->query->all(),
                $request->request->all(),
                $request->attributes->all(),
                $request->cookies->all(),
                $request->files->all(),
                $request->server->all(),
                $request->getContent(),
            );

            $requestStack = new RequestStack();
            $requestStack->push($request);
            $registry = (new ResourceRegistryFactory(new PathGuard(), $requestStack))->create([
                'Files' => [
                    'root' => $root,
                    'public_url' => $configuredUrl,
                    'allowed_extensions' => [],
                    'denied_extensions' => [],
                    'allowed_mime_types' => [],
                    'max_size' => 1024,
                    'read_only' => false,
                ],
            ]);

            self::assertSame($expectedUrl, $registry->get('Files')->resource->publicUrl);
        } finally {
            rmdir($root);
        }
    }
}
