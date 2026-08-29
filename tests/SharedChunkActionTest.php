<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\Action\CancelChunkAction;
use SohoPHP\SoFinder\Http\Action\ChunkStatusAction;
use SohoPHP\SoFinder\Http\ChunkUploadActions;
use SohoPHP\SoFinder\Http\ChunkUploadController;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SharedChunkActionTest extends TestCase
{
    private string $directory;
    private FileManager $files;
    private AuthorizationInterface $authorization;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-chunk-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $this->authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $this->files = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $this->authorization,
            new EventDispatcher(),
        );
    }

    protected function tearDown(): void
    {
        @rmdir($this->directory);
    }

    public function testSymfonyAndPsrChunkStatusHaveIdenticalContracts(): void
    {
        $store = $this->store();
        $actions = $this->actions($store);
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $controller = new ChunkUploadController($this->files, $store, new CsrfGuard($tokens, $this->authorization), actions: $actions);
        $symfonyResponse = $controller->status('upload-session-01');

        $factory = new Psr17Factory();
        $request = (new ServerRequest('GET', '/api/uploads/chunks/upload-session-01'))->withAttribute('id', 'upload-session-01');
        $psrResponse = (new PsrEndpointHandler($actions->status, $factory, $factory))->handle($request);

        self::assertSame($symfonyResponse->getStatusCode(), $psrResponse->getStatusCode());
        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
    }

    public function testSharedCancelRequiresCsrfAndDiscardsTheSession(): void
    {
        $store = $this->store();
        $action = $this->actions($store)->cancel;

        $action->execute(new RequestContext(headers: ['X-CSRF-TOKEN' => 'valid'], attributes: ['id' => 'upload-session-01']));

        self::assertTrue($store->discarded);
        self::assertSame('upload-session-01', $store->discardedId);
    }

    public function testSharedStatusRejectsAnotherWorkspace(): void
    {
        $store = $this->store('another-workspace');

        $this->expectException(\SohoPHP\SoFinder\Exception\SoFinderException::class);
        $this->expectExceptionMessage('current workspace');
        $this->actions($store)->status->execute(new RequestContext(attributes: ['id' => 'upload-session-01']));
    }

    private function actions(ChunkUploadStoreInterface $store): ChunkUploadActions
    {
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'valid'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'valid'; }
        };

        return new ChunkUploadActions(
            new ChunkStatusAction($this->files, $store),
            new CancelChunkAction($store, new MutationGuard($this->authorization, $csrf)),
        );
    }

    /** @return ChunkUploadStoreInterface&object{discarded: bool, discardedId: string} */
    private function store(string $workspace = ''): ChunkUploadStoreInterface
    {
        return new class($workspace) implements ChunkUploadStoreInterface {
            public bool $discarded = false;
            public string $discardedId = '';

            public function __construct(private string $workspace) {}
            public function accept(string $id, int $index, int $total, mixed $stream, int $maximumFileBytes, array $context = []): array { return ['complete' => false]; }
            public function status(string $id): array
            {
                return ['id' => $id, 'total' => 3, 'received' => [0, 1], 'complete' => false, 'resource' => 'Files', 'path' => '', 'name' => 'upload.txt', 'overwrite' => false, 'autoRename' => false, 'workspace' => $this->workspace, 'updatedAt' => 123];
            }
            public function discard(string $id): void { $this->discarded = true; $this->discardedId = $id; }
            public function cleanupExpired(bool $allActors = false, ?int $limit = null): int { return 0; }
        };
    }
}
