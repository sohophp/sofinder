<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Http\Action\ArchiveDownloadAction;
use SohoPHP\SoFinder\Http\ArchiveController;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class SharedArchiveActionTest extends TestCase
{
    /** @var list<string> */
    private array $directories = [];

    protected function setUp(): void
    {
        if (!class_exists(\ZipArchive::class)) {
            self::markTestSkipped('ZIP is not installed.');
        }
    }

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

    public function testSymfonyAndPsrArchiveStreamsMatchAndCleanTemporaryFiles(): void
    {
        [$controller, , $symfonyCache] = $this->stack();
        [, $action, $psrCache] = $this->stack();
        $payload = json_encode(['resource' => 'Files', 'paths' => ['one.txt', 'folder']], JSON_THROW_ON_ERROR);
        $symfony = $controller(Request::create('/api/archive', 'POST', server: [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_CSRF_TOKEN' => 'valid',
        ], content: $payload));
        ob_start();
        $symfony->sendContent();
        $captured = ob_get_clean();
        if ($captured === false) {
            self::fail('Unable to capture the Symfony archive response.');
        }
        $symfonyBody = $captured;

        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('POST', '/api/archive', [
            'Content-Type' => 'application/json',
            'X-CSRF-TOKEN' => 'valid',
        ], $payload));
        $psrBody = (string) $psr->getBody();
        $psr->getBody()->close();

        self::assertSame(200, $psr->getStatusCode());
        self::assertSame('application/zip', $psr->getHeaderLine('Content-Type'));
        self::assertSame($symfony->headers->get('Content-Disposition'), $psr->getHeaderLine('Content-Disposition'));
        self::assertSame(['folder/two.txt' => 'two', 'one.txt' => 'one'], $this->contents($symfonyBody));
        self::assertSame($this->contents($symfonyBody), $this->contents($psrBody));
        self::assertSame([], glob($symfonyCache . '/archives/*') ?: []);
        self::assertSame([], glob($psrCache . '/archives/*') ?: []);
    }

    /** @return array{ArchiveController,ArchiveDownloadAction,string} */
    private function stack(): array
    {
        $root = $this->directory('files');
        $cache = $this->directory('cache');
        file_put_contents($root . '/one.txt', 'one');
        mkdir($root . '/folder');
        file_put_contents($root . '/folder/two.txt', 'two');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $resource = new ResourceType('Files', $root, '/files', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]), $authorization, new EventDispatcher());
        $manager = new ArchiveManager($files, new PathGuard(), $cache);
        $csrf = new CallbackCsrfTokenProvider(static fn (): string => 'valid', static fn ($context, string $token): bool => $token === 'valid');
        $action = new ArchiveDownloadAction($manager, new MutationGuard($authorization, $csrf), new FeaturePolicy());
        $unusedCsrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();

        return [new ArchiveController($manager, $unusedCsrf, action: $action), $action, $cache];
    }

    /** @return array<string,string> */
    private function contents(string $body): array
    {
        $file = tempnam(sys_get_temp_dir(), 'sofinder-archive-contract-');
        if ($file === false) {
            self::fail('Unable to create an archive contract fixture.');
        }
        file_put_contents($file, $body);
        $archive = new \ZipArchive();
        self::assertTrue($archive->open($file) === true);
        $contents = [];
        for ($index = 0; $index < $archive->numFiles; ++$index) {
            $name = $archive->getNameIndex($index);
            if (is_string($name) && !str_ends_with($name, '/')) {
                $value = $archive->getFromIndex($index);
                $contents[$name] = is_string($value) ? $value : '';
            }
        }
        $archive->close();
        @unlink($file);
        ksort($contents);

        return $contents;
    }

    private function directory(string $name): string
    {
        $directory = sys_get_temp_dir() . '/sofinder-shared-archive-' . $name . '-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        $this->directories[] = $directory;

        return $directory;
    }
}
