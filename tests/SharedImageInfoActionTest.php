<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\Action\ImageInfoAction;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SharedImageInfoActionTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        if (!extension_loaded('gd')) {
            self::markTestSkipped('GD is not installed.');
        }
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-image-info-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        $image = imagecreatetruecolor(37, 19);
        imagepng($image, $this->directory . '/sample.png');
    }

    protected function tearDown(): void
    {
        @unlink($this->directory . '/sample.png');
        @rmdir($this->directory . '/cache');
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrImageInfoHaveIdenticalContracts(): void
    {
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $resource = new ResourceType('Images', $this->directory, '/images', allowedExtensions: ['png'], allowedMimeTypes: ['image/png']);
        $files = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/images'))]),
            $authorization,
            new EventDispatcher(),
        );
        $images = new ImageManager($files, new GdImageProcessor(), $this->directory . '/cache');
        $action = new ImageInfoAction($images);
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $controller = new ImageController($images, new CsrfGuard($tokens, $authorization), infoAction: $action);
        $uri = '/api/images/info?resource=Images&path=sample.png';
        $symfonyResponse = $controller->info(Request::create($uri));

        $factory = new Psr17Factory();
        $psrResponse = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', $uri));

        self::assertSame($symfonyResponse->getStatusCode(), $psrResponse->getStatusCode());
        self::assertSame(
            ['success' => true, 'data' => ['width' => 37, 'height' => 19]],
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
    }
}
