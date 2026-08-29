<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\Action\ContentAction;
use SohoPHP\SoFinder\Http\Action\DownloadAction;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\ContentStreamActions;
use SohoPHP\SoFinder\Http\EntryStreamResponseBuilder;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class SharedStreamActionTest extends TestCase
{
    private string $directory;
    private ContentStreamActions $actions;
    private ContentController $controller;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-stream-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/sample.txt', '0123456789');
        file_put_contents($this->directory . '/测试文件.txt', 'unicode');
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $formats = new ImageFormatRegistry();
        $this->actions = new ContentStreamActions(new DownloadAction($files), new ContentAction($files, new EntryStreamResponseBuilder($formats)));
        $this->controller = new ContentController($files, $formats, streamActions: $this->actions);
    }

    protected function tearDown(): void
    {
        @unlink($this->directory . '/sample.txt');
        @unlink($this->directory . '/测试文件.txt');
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrRangeResponsesMatch(): void
    {
        $uri = '/api/content?resource=Files&path=sample.txt';
        $symfony = $this->controller->content(Request::create($uri, server: ['HTTP_RANGE' => 'bytes=2-5']));
        ob_start(); $symfony->sendContent(); $symfonyBody = ob_get_clean();
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($this->actions->content, $factory, $factory))->handle((new ServerRequest('GET', $uri))->withHeader('Range', 'bytes=2-5'));

        self::assertSame(206, $symfony->getStatusCode());
        self::assertSame($symfony->getStatusCode(), $psr->getStatusCode());
        self::assertSame($symfony->headers->get('Content-Range'), $psr->getHeaderLine('Content-Range'));
        self::assertSame('2345', $symfonyBody);
        self::assertSame($symfonyBody, (string) $psr->getBody());
    }

    public function testDownloadSupportsTheSameRangeAndCacheContract(): void
    {
        $uri = '/api/download?resource=Files&path=' . rawurlencode('测试文件.txt');
        $symfony = $this->controller->download(Request::create($uri, server: ['HTTP_RANGE' => 'bytes=0-6']));
        ob_start(); $symfony->sendContent(); $symfonyBody = ob_get_clean();
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($this->actions->download, $factory, $factory))->handle(
            (new ServerRequest('GET', $uri))->withHeader('Range', 'bytes=0-6'),
        );

        self::assertSame(206, $symfony->getStatusCode());
        self::assertSame(206, $psr->getStatusCode());
        self::assertSame('bytes 0-6/7', $symfony->headers->get('Content-Range'));
        self::assertSame($symfony->headers->get('Content-Range'), $psr->getHeaderLine('Content-Range'));
        self::assertSame($symfony->headers->get('ETag'), $psr->getHeaderLine('ETag'));
        self::assertStringStartsWith('attachment;', $symfony->headers->get('Content-Disposition', ''));
        self::assertSame('unicode', $symfonyBody);
        self::assertSame($symfonyBody, (string) $psr->getBody());
    }

    public function testConditionalContentReturnsTheSameEtagAnd304(): void
    {
        $uri = '/api/content?resource=Files&path=sample.txt';
        $first = $this->controller->content(Request::create($uri));
        $etag = $first->headers->get('ETag');
        self::assertIsString($etag);
        $symfony = $this->controller->content(Request::create($uri, server: ['HTTP_IF_NONE_MATCH' => $etag]));
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($this->actions->content, $factory, $factory))->handle((new ServerRequest('GET', $uri))->withHeader('If-None-Match', $etag));

        self::assertSame(304, $symfony->getStatusCode());
        self::assertSame(304, $psr->getStatusCode());
        self::assertSame($etag, $psr->getHeaderLine('ETag'));
        self::assertSame('text/plain', $symfony->headers->get('Content-Type'));
        self::assertSame('text/plain', $psr->getHeaderLine('Content-Type'));
        self::assertSame($symfony->headers->get('Content-Disposition'), $psr->getHeaderLine('Content-Disposition'));
        self::assertSame('10', $psr->getHeaderLine('Content-Length'));
    }

    public function testUnicodeDownloadDispositionAndBodyMatch(): void
    {
        $uri = '/api/download?resource=Files&path=' . rawurlencode('测试文件.txt');
        $symfony = $this->controller->download(Request::create($uri));
        ob_start(); $symfony->sendContent(); $symfonyBody = ob_get_clean();
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($this->actions->download, $factory, $factory))->handle(new ServerRequest('GET', $uri));

        self::assertSame($symfony->headers->get('Content-Disposition'), $psr->getHeaderLine('Content-Disposition'));
        self::assertStringContainsString("filename*=utf-8''%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6.txt", $psr->getHeaderLine('Content-Disposition'));
        self::assertSame('unicode', $symfonyBody);
        self::assertSame($symfonyBody, (string) $psr->getBody());
    }
}
