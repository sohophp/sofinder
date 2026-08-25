<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\QuickUploadController;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\ResourceRegistryFactory;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class QuickUploadControllerTest extends TestCase
{
    private string $directory;
    private string $upload;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-quick-upload-' . bin2hex(random_bytes(8));
        $this->upload = tempnam(sys_get_temp_dir(), 'sofinder-upload-') ?: throw new \RuntimeException('Unable to create a temporary upload.');
        mkdir($this->directory, 0775, true);
        file_put_contents($this->upload, 'hello');
    }

    protected function tearDown(): void
    {
        @unlink($this->upload);
        @unlink($this->directory . '/hello.txt');
        @unlink($this->directory . '/hello(1).txt');
        @rmdir($this->directory);
    }

    #[DataProvider('responseTypeProvider')]
    public function testResponseContainsTheApplicationBasePath(string $query, bool $jsonResponse): void
    {
        $csrfTokens = $this->createMock(CsrfTokenManagerInterface::class);
        $csrfTokens->method('isTokenValid')->willReturnCallback(
            static fn (CsrfToken $token): bool => $token->getId() === 'sofinder' && $token->getValue() === 'valid-token',
        );
        $query .= '&_token=valid-token';
        $request = Request::create(
            'https://example.test/winstar2024/sofinder/quick-upload?' . $query,
            'POST',
            files: ['upload' => new UploadedFile($this->upload, 'hello.txt', 'text/plain', UPLOAD_ERR_OK, true)],
            server: [
                'SCRIPT_NAME' => '/winstar2024/index.php',
                'SCRIPT_FILENAME' => '/var/www/public/index.php',
                'HTTP_ORIGIN' => 'https://example.test',
            ],
        );
        $requestStack = new RequestStack();
        $requestStack->push($request);
        $pathGuard = new PathGuard();
        $registry = (new ResourceRegistryFactory($pathGuard, $requestStack))->create([
            'Files' => [
                'root' => $this->directory,
                'public_url' => '/uploads/editor/files',
                'allowed_extensions' => ['txt'],
                'denied_extensions' => [],
                'allowed_mime_types' => [],
                'max_size' => 1024,
                'read_only' => false,
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
        $manager = new FileManager($registry, $authorization, new EventDispatcher(), $pathGuard);
        $controller = new QuickUploadController(
            $manager,
            new CsrfGuard($csrfTokens, $authorization),
        );

        $response = $controller($request);
        self::assertSame(200, $response->getStatusCode());
        if ($jsonResponse) {
            $payload = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR);
            self::assertSame(1, $payload['uploaded']);
            self::assertSame('/winstar2024/uploads/editor/files/hello.txt', $payload['url']);

            return;
        }

        self::assertSame(1, preg_match('/var p=(\[.*?\]);window/', (string) $response->getContent(), $matches));
        self::assertMatchesRegularExpression("/script-src 'nonce-[A-Za-z0-9_-]+';/", (string) $response->headers->get('Content-Security-Policy'));
        self::assertMatchesRegularExpression('/<script nonce="[A-Za-z0-9_-]+">/', (string) $response->getContent());
        $payload = json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);
        self::assertSame(42, $payload[0]);
        self::assertSame('/winstar2024/uploads/editor/files/hello.txt', $payload[1]);
    }

    /** @return iterable<string, array{string, bool}> */
    public static function responseTypeProvider(): iterable
    {
        yield 'JSON upload protocol' => ['type=Files&responseType=json', true];
        yield 'CKEditor XHR without callback number' => ['type=Files', true];
        yield 'CKEditor 4 callback protocol' => ['type=Files&CKEditorFuncNum=42', false];
    }

    #[DataProvider('renamedResponseTypeProvider')]
    public function testNameConflictIsSuccessfulAndReportsTheActualRenamedFile(string $query, bool $jsonResponse): void
    {
        file_put_contents($this->directory . '/hello.txt', 'existing');
        $csrfTokens = $this->createMock(CsrfTokenManagerInterface::class);
        $csrfTokens->method('isTokenValid')->willReturn(true);
        $request = Request::create(
            'https://example.test/sofinder/quick-upload?' . $query . '&_token=valid-token',
            'POST',
            files: ['upload' => new UploadedFile($this->upload, 'hello.txt', 'text/plain', UPLOAD_ERR_OK, true)],
            server: ['HTTP_ORIGIN' => 'https://example.test'],
        );
        $requestStack = new RequestStack();
        $requestStack->push($request);
        $pathGuard = new PathGuard();
        $registry = (new ResourceRegistryFactory($pathGuard, $requestStack))->create([
            'Files' => [
                'root' => $this->directory,
                'public_url' => '/files',
                'allowed_extensions' => ['txt'],
                'denied_extensions' => [],
                'allowed_mime_types' => [],
                'max_size' => 1024,
                'read_only' => false,
            ],
        ]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $controller = new QuickUploadController(
            new FileManager($registry, $authorization, new EventDispatcher(), $pathGuard),
            new CsrfGuard($csrfTokens, $authorization),
        );

        $response = $controller($request);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame('existing', file_get_contents($this->directory . '/hello.txt'));
        self::assertSame('hello', file_get_contents($this->directory . '/hello(1).txt'));
        if ($jsonResponse) {
            $payload = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR);
            self::assertSame(1, $payload['uploaded']);
            self::assertSame('hello(1).txt', $payload['fileName']);
            self::assertSame('/files/hello%281%29.txt', $payload['url']);
            self::assertStringContainsString('renamed to "hello(1).txt"', $payload['error']['message']);

            return;
        }

        self::assertSame(1, preg_match('/var p=(\[.*?\]);window/', (string) $response->getContent(), $matches));
        $payload = json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('/files/hello%281%29.txt', $payload[1]);
        self::assertStringContainsString('renamed to "hello(1).txt"', $payload[2]);
    }

    /** @return iterable<string, array{string, bool}> */
    public static function renamedResponseTypeProvider(): iterable
    {
        yield 'JSON upload protocol' => ['type=Files&responseType=json', true];
        yield 'CKEditor 4 callback protocol' => ['type=Files&CKEditorFuncNum=42', false];
    }

    public function testImageSelectionRejectsNonWebFormatBeforeWriting(): void
    {
        $csrfTokens = $this->createMock(CsrfTokenManagerInterface::class);
        $csrfTokens->method('isTokenValid')->willReturn(true);
        $request = Request::create(
            'https://example.test/sofinder/quick-upload?type=Images&selection=image&responseType=json&_token=valid-token',
            'POST',
            files: ['upload' => new UploadedFile($this->upload, 'camera.heic', 'image/heic', UPLOAD_ERR_OK, true)],
            server: ['HTTP_ORIGIN' => 'https://example.test'],
        );
        $requestStack = new RequestStack();
        $requestStack->push($request);
        $pathGuard = new PathGuard();
        $registry = (new ResourceRegistryFactory($pathGuard, $requestStack))->create([
            'Images' => [
                'root' => $this->directory,
                'public_url' => '/images',
                'allowed_extensions' => ['heic'],
                'denied_extensions' => [],
                'allowed_mime_types' => [],
                'max_size' => 1024,
                'read_only' => false,
            ],
        ]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $capabilities = new class implements ImageCapabilityProviderInterface {
            public function capabilities(): array { return []; }
            public function isWebEmbeddable(string $mimeType): bool { return false; }
            public function supportsExtension(string $extension): bool { return false; }
            public function driver(): string { return 'auto'; }
            public function cacheVersion(): string { return 'test'; }
        };
        $controller = new QuickUploadController(
            new FileManager($registry, $authorization, new EventDispatcher(), $pathGuard),
            new CsrfGuard($csrfTokens, $authorization),
            $capabilities,
        );

        $response = $controller($request);
        $payload = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(415, $response->getStatusCode());
        self::assertSame(0, $payload['uploaded']);
        self::assertSame('image_not_web_embeddable', $payload['error']['code']);
        self::assertFileDoesNotExist($this->directory . '/camera.heic');
    }
}
