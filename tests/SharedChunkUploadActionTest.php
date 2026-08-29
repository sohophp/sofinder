<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use Nyholm\Psr7\UploadedFile as PsrUploadedFile;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Http\Action\CancelChunkAction;
use SohoPHP\SoFinder\Http\Action\ChunkStatusAction;
use SohoPHP\SoFinder\Http\Action\ChunkUploadAction;
use SohoPHP\SoFinder\Http\ChunkUploadActions;
use SohoPHP\SoFinder\Http\ChunkUploadController;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;

final class SharedChunkUploadActionTest extends TestCase
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

    public function testSymfonyAndPsrSingleChunkCompletionMatches(): void
    {
        [$controller, , $symfonyRoot] = $this->stack();
        [, $psrAction, $psrRoot] = $this->stack();
        $parameters = ['uploadId' => 'upload-session-01', 'index' => '0', 'total' => '1', 'resource' => 'Files', 'path' => '', 'name' => 'Report.TXT'];
        $symfonyFile = $this->incoming('chunk-data');
        $symfony = $controller->upload(Request::create('/api/uploads/chunks', 'POST', $parameters, files: [
            'chunk' => new UploadedFile($symfonyFile, 'chunk', 'application/octet-stream', UPLOAD_ERR_OK, true),
        ], server: ['HTTP_X_CSRF_TOKEN' => 'valid']));

        $factory = new Psr17Factory();
        $psrFile = $this->incoming('chunk-data');
        $request = (new ServerRequest('POST', '/api/uploads/chunks', ['X-CSRF-TOKEN' => 'valid']))
            ->withParsedBody($parameters)
            ->withUploadedFiles(['chunk' => new PsrUploadedFile($factory->createStreamFromFile($psrFile), 10, UPLOAD_ERR_OK, 'chunk', 'application/octet-stream')]);
        $psr = (new PsrEndpointHandler($psrAction, $factory, $factory))->handle($request);

        self::assertSame(201, $symfony->getStatusCode());
        self::assertSame(201, $psr->getStatusCode());
        self::assertSame($this->stablePayload((string) $symfony->getContent()), $this->stablePayload((string) $psr->getBody()));
        self::assertSame('chunk-data', file_get_contents($symfonyRoot . '/Report.txt'));
        self::assertSame('chunk-data', file_get_contents($psrRoot . '/Report.txt'));
    }

    /** @return array{ChunkUploadController,ChunkUploadAction,string} */
    private function stack(): array
    {
        $root = $this->directory('root');
        $chunksRoot = $this->directory('chunks');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $actor = new class implements ActorProviderInterface { public function actorId(): string { return 'actor'; } };
        $resource = new ResourceType('Files', $root, '/files', allowedExtensions: ['txt'], allowedMimeTypes: ['text/plain']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]), $authorization, new EventDispatcher());
        $store = new ChunkUploadManager($chunksRoot, $actor);
        $csrf = new CallbackCsrfTokenProvider(static fn (): string => 'valid', static fn ($context, string $token): bool => $token === 'valid');
        $guard = new MutationGuard($authorization, $csrf);
        $action = new ChunkUploadAction($files, $store, $guard, new UploadNamePolicy(lowercaseExtensions: true));
        $actions = new ChunkUploadActions(new ChunkStatusAction($files, $store), new CancelChunkAction($store, $guard), $action);
        $unusedCsrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();

        return [new ChunkUploadController($files, $store, $unusedCsrf, actions: $actions), $action, $root];
    }

    private function incoming(string $contents): string
    {
        $directory = $this->directory('incoming');
        $file = $directory . '/chunk';
        file_put_contents($file, $contents);

        return $file;
    }

    private function directory(string $name): string
    {
        $directory = sys_get_temp_dir() . '/sofinder-shared-chunk-upload-' . $name . '-' . bin2hex(random_bytes(8));
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
