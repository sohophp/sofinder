<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\ChunkUploadController;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\ResourceRegistryFactory;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class UploadControllerNamingTest extends TestCase
{
    private string $directory;
    private string $temporaryUpload;
    private AuthorizationInterface $authorization;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-upload-controller-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        $this->temporaryUpload = tempnam(sys_get_temp_dir(), 'sofinder-upload-') ?: throw new \RuntimeException('Unable to create upload fixture.');
        file_put_contents($this->temporaryUpload, 'office');
        $this->authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
        @unlink($this->temporaryUpload);
    }

    public function testRegularUploadNormalizesTheExtensionOnTheServer(): void
    {
        $request = Request::create('/api/upload', 'POST', ['resource' => 'Files'], files: [
            'upload' => new UploadedFile($this->temporaryUpload, 'Quarterly.Report.XLSX', 'application/octet-stream', UPLOAD_ERR_OK, true),
        ], server: ['HTTP_X_CSRF_TOKEN' => 'valid']);
        $controller = new ApiController($this->files($request), $this->csrf(), new PluginRegistry([]));

        $response = $controller->upload($request);

        self::assertSame(201, $response->getStatusCode());
        self::assertFileExists($this->directory . '/Quarterly.Report.xlsx');
    }

    public function testChunkUploadPersistsTheNormalizedNameInItsSession(): void
    {
        $request = Request::create('/api/uploads/chunks', 'POST', [
            'resource' => 'Files', 'path' => '', 'name' => 'Archive.ZIP', 'uploadId' => 'abcdefghijklmnop',
            'index' => 0, 'total' => 1,
        ], files: ['chunk' => new UploadedFile($this->temporaryUpload, 'chunk', 'application/octet-stream', UPLOAD_ERR_OK, true)], server: ['HTTP_X_CSRF_TOKEN' => 'valid']);
        $chunks = new ChunkUploadManager($this->directory . '/.chunks', new class implements ActorProviderInterface {
            public function actorId(): string { return 'test'; }
        });
        $controller = new ChunkUploadController($this->files($request), $chunks, $this->csrf());

        $response = $controller->upload($request);

        self::assertSame(201, $response->getStatusCode());
        self::assertFileExists($this->directory . '/Archive.zip');
    }

    private function files(Request $request): FileManager
    {
        $stack = new RequestStack();
        $stack->push($request);
        $guard = new PathGuard();
        $registry = (new ResourceRegistryFactory($guard, $stack))->create(['Files' => [
            'root' => $this->directory,
            'public_url' => '/files',
            'allowed_extensions' => ['xlsx', 'zip'],
            'denied_extensions' => [],
            'allowed_mime_types' => [],
            'max_size' => 1024,
            'read_only' => false,
        ]]);

        return new FileManager($registry, $this->authorization, new EventDispatcher(), $guard);
    }

    private function csrf(): CsrfGuard
    {
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $tokens->method('isTokenValid')->willReturn(true);

        return new CsrfGuard($tokens, $this->authorization);
    }

    private function remove(string $path): void
    {
        if (is_file($path) || is_link($path)) { @unlink($path); return; }
        if (!is_dir($path)) return;
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) $this->remove($entry->getPathname());
        @rmdir($path);
    }
}
