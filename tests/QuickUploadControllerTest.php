<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
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
        @rmdir($this->directory);
    }

    /** @dataProvider responseTypeProvider */
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
}
