<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use Nyholm\Psr7\UploadedFile as PsrUploadedFile;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Http\Action\QuickUploadAction;
use SohoPHP\SoFinder\Http\CompatibleUploadGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Http\QuickUploadController;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;

final class SharedQuickUploadActionTest extends TestCase
{
    /** @var list<string> */
    private array $directories = [];

    protected function tearDown(): void
    {
        foreach (array_reverse($this->directories) as $directory) {
            if (!is_dir($directory)) {
                continue;
            }
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($iterator as $entry) {
                $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
            }
            @rmdir($directory);
        }
    }

    public function testSymfonyAndPsrJsonCompatibleUploadsMatch(): void
    {
        [$controller] = $this->stack();
        [, $action, $psrRoot] = $this->stack();
        $symfonyFile = $this->incoming('quick-upload');
        $symfony = $controller(Request::create('/compat/ckeditor4/upload?type=Files&responseType=json', 'POST', files: [
            'upload' => new UploadedFile($symfonyFile, 'Note.TXT', 'text/plain', UPLOAD_ERR_OK, true),
        ], server: ['HTTP_X_CSRF_TOKEN' => 'valid', 'HTTP_ORIGIN' => 'https://example.test', 'HTTP_HOST' => 'example.test', 'HTTPS' => 'on']));

        $factory = new Psr17Factory();
        $psrFile = $this->incoming('quick-upload');
        $request = (new ServerRequest('POST', 'https://example.test/compat/ckeditor4/upload?type=Files&responseType=json', [
            'X-CSRF-TOKEN' => 'valid',
            'Origin' => 'https://example.test',
        ]))->withUploadedFiles(['upload' => new PsrUploadedFile($factory->createStreamFromFile($psrFile), 12, UPLOAD_ERR_OK, 'Note.TXT', 'text/plain')]);
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle($request);

        self::assertSame(200, $symfony->getStatusCode());
        self::assertSame(200, $psr->getStatusCode());
        self::assertSame(json_decode((string) $symfony->getContent(), true, 16, JSON_THROW_ON_ERROR), json_decode((string) $psr->getBody(), true, 16, JSON_THROW_ON_ERROR));
        self::assertSame(['uploaded' => 1, 'fileName' => 'Note.txt', 'url' => '/files/Note.txt'], json_decode((string) $psr->getBody(), true, 16, JSON_THROW_ON_ERROR));
        self::assertSame('quick-upload', file_get_contents($psrRoot . '/Note.txt'));
    }

    public function testScriptResponseUsesNonceAndCrossOriginIsRejected(): void
    {
        [, $action] = $this->stack();
        $factory = new Psr17Factory();
        $file = $this->incoming('script-upload');
        $request = (new ServerRequest('POST', 'https://example.test/compat/ckeditor4/upload?type=Files&CKEditorFuncNum=7', [
            'X-CSRF-TOKEN' => 'valid',
            'Origin' => 'https://example.test',
        ]))->withUploadedFiles(['upload' => new PsrUploadedFile($factory->createStreamFromFile($file), 13, UPLOAD_ERR_OK, 'script.txt', 'text/plain')]);
        $response = (new PsrEndpointHandler($action, $factory, $factory))->handle($request);

        self::assertSame('text/html; charset=UTF-8', $response->getHeaderLine('Content-Type'));
        self::assertMatchesRegularExpression('/script-src \'nonce-[A-Za-z0-9_-]+\'/', $response->getHeaderLine('Content-Security-Policy'));
        self::assertStringContainsString('CKEDITOR.tools.callFunction', (string) $response->getBody());

        $this->expectException(AccessDeniedException::class);
        (new PsrEndpointHandler($action, $factory, $factory))->handle(
            (new ServerRequest('POST', 'https://example.test/compat/ckeditor4/upload', ['X-CSRF-TOKEN' => 'valid', 'Origin' => 'https://evil.test']))
                ->withUploadedFiles(['upload' => new PsrUploadedFile($factory->createStream('x'), 1, UPLOAD_ERR_OK, 'x.txt', 'text/plain')]),
        );
    }

    /** @return array{QuickUploadController,QuickUploadAction,string} */
    private function stack(): array
    {
        $root = $this->directory('root');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $resource = new ResourceType('Files', $root, '/files', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]), $authorization, new EventDispatcher());
        $csrf = new CallbackCsrfTokenProvider(static fn (): string => 'valid', static fn ($context, string $token): bool => $token === 'valid');
        $action = new QuickUploadAction($files, new CompatibleUploadGuard($authorization, $csrf), new UploadNamePolicy(lowercaseExtensions: true));
        $unusedCsrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();

        return [new QuickUploadController($files, $unusedCsrf, uploadNames: new UploadNamePolicy(lowercaseExtensions: true), action: $action), $action, $root];
    }

    private function incoming(string $contents): string
    {
        $directory = $this->directory('incoming');
        $file = $directory . '/upload';
        file_put_contents($file, $contents);

        return $file;
    }

    private function directory(string $name): string
    {
        $directory = sys_get_temp_dir() . '/sofinder-shared-quick-upload-' . $name . '-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        $this->directories[] = $directory;

        return $directory;
    }
}
