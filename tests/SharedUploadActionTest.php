<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use Nyholm\Psr7\UploadedFile as PsrUploadedFile;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Http\Action\UploadAction;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;

final class SharedUploadActionTest extends TestCase
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

    public function testSymfonyAndPsrMultipartUploadsHaveMatchingContracts(): void
    {
        [$controller] = $this->stack();
        [, $action, $psrRoot] = $this->stack();
        $symfonyFile = $this->uploadFile('Report.TXT', 'shared-upload');
        $symfony = $controller->upload(Request::create('/api/uploads', 'POST', [
            'resource' => 'Files',
            'path' => '',
            'autoRename' => 'true',
        ], files: ['upload' => new UploadedFile($symfonyFile, 'Report.TXT', 'text/plain', UPLOAD_ERR_OK, true)], server: ['HTTP_X_CSRF_TOKEN' => 'valid']));

        $factory = new Psr17Factory();
        $psrFile = $this->uploadFile('Report.TXT', 'shared-upload');
        $psrRequest = (new ServerRequest('POST', '/api/uploads', ['X-CSRF-TOKEN' => 'valid']))
            ->withParsedBody(['resource' => 'Files', 'path' => '', 'autoRename' => 'true'])
            ->withUploadedFiles(['upload' => new PsrUploadedFile($factory->createStreamFromFile($psrFile), 13, UPLOAD_ERR_OK, 'Report.TXT', 'text/plain')]);
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle($psrRequest);

        self::assertSame(201, $symfony->getStatusCode());
        self::assertSame(201, $psr->getStatusCode());
        self::assertSame($this->stablePayload((string) $symfony->getContent()), $this->stablePayload((string) $psr->getBody()));
        self::assertSame('shared-upload', file_get_contents($psrRoot . '/Report.txt'));
    }

    /** @return array{ApiController,UploadAction,string} */
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
        $action = new UploadAction($files, new MutationGuard($authorization, $csrf), new UploadNamePolicy(lowercaseExtensions: true));
        $unusedCsrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();

        return [new ApiController($files, $unusedCsrf, new PluginRegistry([]), uploadAction: $action), $action, $root];
    }

    private function uploadFile(string $name, string $contents): string
    {
        $directory = $this->directory('incoming');
        $file = $directory . '/' . $name;
        file_put_contents($file, $contents);

        return $file;
    }

    private function directory(string $name): string
    {
        $directory = sys_get_temp_dir() . '/sofinder-shared-upload-' . $name . '-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        $this->directories[] = $directory;

        return $directory;
    }

    /** @return array<string,mixed> */
    private function stablePayload(string $json): array
    {
        $payload = json_decode($json, true, 32, JSON_THROW_ON_ERROR);
        unset($payload['data']['entry']['modifiedAt']);

        return $payload;
    }
}
