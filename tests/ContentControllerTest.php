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
        file_put_contents($this->directory . '/测试文件.txt', 'unicode');
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
        @unlink($this->directory . '/测试文件.txt');
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

    public function testUnicodeDownloadNameHasASafeFallbackAndUtf8Filename(): void
    {
        $response = $this->controller->download(Request::create('/api/download?resource=Files&path=' . rawurlencode('测试文件.txt')));
        $disposition = (string) $response->headers->get('Content-Disposition');

        self::assertStringStartsWith('attachment;', $disposition);
        self::assertStringContainsString('filename=download.txt', $disposition);
        self::assertStringContainsString("filename*=utf-8''%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6.txt", $disposition);
    }

    public function testInvalidRangeUsesTheStableDomainError(): void
    {
        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('not satisfiable');
        $this->controller->content(Request::create('/api/content?resource=Files&path=sample.txt', server: ['HTTP_RANGE' => 'bytes=50-60']));
    }

    public function testReturnsBoundedUtf8TextPreview(): void
    {
        $response = $this->controller->textPreview(Request::create('/api/preview/text?resource=Files&path=sample.txt'));
        $data = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR)['data'];

        self::assertSame('0123456789', $data['content']);
        self::assertFalse($data['truncated']);
        self::assertSame('text/plain', $data['mimeType']);
    }

    public function testReturnsSha256ChecksumWithoutExposingStoragePath(): void
    {
        $response = $this->controller->checksum(Request::create('/api/checksum?resource=Files&path=sample.txt'));
        $data = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR)['data'];

        self::assertSame(hash('sha256', '0123456789'), $data['checksum']);
        self::assertSame('sha256', $data['algorithm']);
        self::assertStringNotContainsString($this->directory, (string) $response->getContent());
    }
}
