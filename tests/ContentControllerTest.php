<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class ContentControllerTest extends TestCase
{
    private string $directory;
    private ContentController $controller;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-content-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/sample.txt', '0123456789');
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $manager = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $authorization,
            new EventDispatcher(),
        );
        $this->controller = new ContentController($manager);
    }

    protected function tearDown(): void
    {
        @unlink($this->directory . '/sample.txt');
        @rmdir($this->directory);
    }

    public function testContentSupportsRangesAndForcesUnsafeMimeTypesToDownload(): void
    {
        $request = Request::create('/api/content?resource=Files&path=sample.txt', server: ['HTTP_RANGE' => 'bytes=2-5']);
        $response = $this->controller->content($request);

        self::assertSame(Response::HTTP_PARTIAL_CONTENT, $response->getStatusCode());
        self::assertSame('bytes 2-5/10', $response->headers->get('Content-Range'));
        self::assertSame('4', $response->headers->get('Content-Length'));
        self::assertStringStartsWith('attachment;', (string) $response->headers->get('Content-Disposition'));
        ob_start();
        $response->sendContent();
        self::assertSame('2345', ob_get_clean());
    }

    public function testContentReturnsEtagAndHonorsConditionalRequests(): void
    {
        $first = $this->controller->content(Request::create('/api/content?resource=Files&path=sample.txt'));
        $etag = $first->getEtag();
        self::assertNotNull($etag);

        $conditional = Request::create('/api/content?resource=Files&path=sample.txt', server: ['HTTP_IF_NONE_MATCH' => $etag]);
        $response = $this->controller->content($conditional);

        self::assertSame(Response::HTTP_NOT_MODIFIED, $response->getStatusCode());
        self::assertSame($etag, $response->getEtag());
    }

    public function testInvalidRangeUsesTheStableDomainError(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('not satisfiable');
        $this->controller->content(Request::create('/api/content?resource=Files&path=sample.txt', server: ['HTTP_RANGE' => 'bytes=50-60']));
    }
}
