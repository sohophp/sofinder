<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Http\Action\CreateFolderAction;
use SohoPHP\SoFinder\Http\Action\BatchAction;
use SohoPHP\SoFinder\Http\Action\BatchRenameAction;
use SohoPHP\SoFinder\Http\Action\DeleteAction;
use SohoPHP\SoFinder\Http\Action\DeleteTrashAction;
use SohoPHP\SoFinder\Http\Action\RenameAction;
use SohoPHP\SoFinder\Http\Action\RestoreTrashAction;
use SohoPHP\SoFinder\Http\Action\TrashListAction;
use SohoPHP\SoFinder\Http\Action\TransferAction;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\FileMutationActions;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Trash\TrashManager;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class SharedMutationActionTest extends TestCase
{
    public function testCreateFolderHasSymfonyAndPsrParity(): void
    {
        $symfonyRoot = $this->directory();
        $psrRoot = $this->directory();
        try {
            $symfonyActions = $this->actions($this->files($symfonyRoot));
            $psrActions = $this->actions($this->files($psrRoot));
            $csrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();
            $controller = new ApiController($this->files($symfonyRoot), $csrf, new PluginRegistry([]), mutationActions: $symfonyActions);
            $body = json_encode(['resource' => 'Files', 'path' => '', 'name' => 'Documents'], JSON_THROW_ON_ERROR);
            $symfony = $controller->createFolder(Request::create('/api/folders', 'POST', server: [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_CSRF_TOKEN' => 'valid',
            ], content: $body));

            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($psrActions->createFolder, $factory, $factory)]);
            $psr = $dispatcher->dispatch('sofinder_api_folder', new ServerRequest('POST', '/api/folders', [
                'Content-Type' => 'application/json',
                'X-CSRF-TOKEN' => 'valid',
            ], $body));

            self::assertSame(201, $symfony->getStatusCode());
            self::assertSame(201, $psr->getStatusCode());
            self::assertSame(
                json_decode((string) $symfony->getContent(), true, 32, JSON_THROW_ON_ERROR),
                json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR),
            );
            self::assertDirectoryExists($symfonyRoot . '/Documents');
            self::assertDirectoryExists($psrRoot . '/Documents');
        } finally {
            $this->remove($symfonyRoot);
            $this->remove($psrRoot);
        }
    }

    public function testPsrMutationChainCoversRenameCopyMoveAndDelete(): void
    {
        $root = $this->directory();
        file_put_contents($root . '/source.txt', 'content');
        mkdir($root . '/copies');
        mkdir($root . '/moved');
        try {
            $actions = $this->actions($this->files($root));
            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [
                new PsrEndpointHandler($actions->rename, $factory, $factory),
                new PsrEndpointHandler($actions->copy, $factory, $factory),
                new PsrEndpointHandler($actions->move, $factory, $factory),
                new PsrEndpointHandler($actions->delete, $factory, $factory),
            ]);

            self::assertSame(200, $this->dispatch($dispatcher, 'sofinder_api_rename', 'PATCH', ['path' => 'source.txt', 'name' => 'renamed.txt'])->getStatusCode());
            self::assertSame(200, $this->dispatch($dispatcher, 'sofinder_api_copy', 'POST', ['path' => 'renamed.txt', 'destination' => 'copies'])->getStatusCode());
            self::assertSame(200, $this->dispatch($dispatcher, 'sofinder_api_move', 'POST', ['path' => 'renamed.txt', 'destination' => 'moved'])->getStatusCode());
            self::assertSame(200, $this->dispatch($dispatcher, 'sofinder_api_delete', 'DELETE', ['path' => 'copies/renamed.txt'])->getStatusCode());

            self::assertFileExists($root . '/moved/renamed.txt');
            self::assertFileDoesNotExist($root . '/source.txt');
            self::assertFileDoesNotExist($root . '/copies/renamed.txt');
        } finally {
            $this->remove($root);
        }
    }

    public function testPsrMutationRejectsUnauthenticatedInvalidJsonBeforeParsing(): void
    {
        $root = $this->directory();
        try {
            $authorization = $this->authorization(false);
            $action = new CreateFolderAction($this->files($root, $authorization), $this->guard($authorization));
            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($action, $factory, $factory)]);

            $response = $dispatcher->dispatch($action->endpoint(), new ServerRequest('POST', '/api/folders', [
                'Content-Type' => 'application/json',
            ], '{invalid'));
            $payload = json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR);

            self::assertSame(403, $response->getStatusCode());
            self::assertSame('access_denied', $payload['error']['code']);
        } finally {
            $this->remove($root);
        }
    }

    public function testPsrMutationMapsInvalidJsonAfterCsrfValidation(): void
    {
        $root = $this->directory();
        try {
            $action = $this->actions($this->files($root))->createFolder;
            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($action, $factory, $factory)]);

            $response = $dispatcher->dispatch($action->endpoint(), new ServerRequest('POST', '/api/folders', [
                'Content-Type' => 'application/json',
                'X-CSRF-TOKEN' => 'valid',
            ], '{invalid'));
            $payload = json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR);

            self::assertSame(400, $response->getStatusCode());
            self::assertSame('invalid_json', $payload['error']['code']);
        } finally {
            $this->remove($root);
        }
    }

    public function testPsrBatchAndBatchRenameUseSharedValidationAndResults(): void
    {
        $root = $this->directory();
        file_put_contents($root . '/one.txt', 'one');
        file_put_contents($root . '/two.txt', 'two');
        try {
            $authorization = $this->authorization();
            $files = $this->files($root, $authorization);
            $guard = $this->guard($authorization);
            $batch = new BatchAction($files, $guard);
            $rename = new BatchRenameAction($files, $guard, new FeaturePolicy());
            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [
                new PsrEndpointHandler($batch, $factory, $factory),
                new PsrEndpointHandler($rename, $factory, $factory),
            ]);

            $renamed = $this->dispatch($dispatcher, $rename->endpoint(), 'POST', ['renames' => [
                ['path' => 'one.txt', 'name' => 'first.txt'],
                ['path' => 'two.txt', 'name' => 'second.txt'],
            ]]);
            $deleted = $this->dispatch($dispatcher, $batch->endpoint(), 'POST', [
                'operation' => 'delete',
                'paths' => ['first.txt', 'second.txt'],
            ]);

            self::assertSame(2, json_decode((string) $renamed->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['succeeded']);
            self::assertSame(2, json_decode((string) $deleted->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['succeeded']);
            self::assertFileDoesNotExist($root . '/first.txt');
            self::assertFileDoesNotExist($root . '/second.txt');
        } finally {
            $this->remove($root);
        }
    }

    public function testPsrTrashListRestoreAndPermanentDeleteUseRouteAttributes(): void
    {
        $root = $this->directory();
        $trashRoot = $this->directory();
        file_put_contents($root . '/restore.txt', 'restore');
        try {
            $authorization = $this->authorization();
            $guard = $this->guard($authorization);
            $paths = new PathGuard();
            $actors = new class implements ActorProviderInterface {
                public function actorId(): string { return 'actor'; }
            };
            $resource = new ResourceType('Files', $root, '/files', ['txt']);
            $files = new FileManager(
                new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]),
                $authorization,
                new EventDispatcher(),
                $paths,
                trash: new TrashManager($trashRoot, $actors, $paths),
            );
            $deleteEntry = new DeleteAction($files, $guard);
            $list = new TrashListAction($files, new FeaturePolicy());
            $restore = new RestoreTrashAction($files, $guard, new FeaturePolicy());
            $deleteTrash = new DeleteTrashAction($files, $guard, new FeaturePolicy());
            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [
                new PsrEndpointHandler($deleteEntry, $factory, $factory),
                new PsrEndpointHandler($list, $factory, $factory),
                new PsrEndpointHandler($restore, $factory, $factory),
                new PsrEndpointHandler($deleteTrash, $factory, $factory),
            ]);

            $trashed = $this->dispatch($dispatcher, $deleteEntry->endpoint(), 'DELETE', ['path' => 'restore.txt']);
            $id = json_decode((string) $trashed->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['trash']['item']['id'];
            $listed = $dispatcher->dispatch($list->endpoint(), (new ServerRequest('GET', '/api/trash'))->withQueryParams(['resource' => 'Files']));
            self::assertSame($id, json_decode((string) $listed->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['items'][0]['id']);

            $restoreRequest = new ServerRequest('POST', '/api/trash/' . $id . '/restore', ['Content-Type' => 'application/json', 'X-CSRF-TOKEN' => 'valid'], '{}');
            self::assertSame(200, $dispatcher->dispatch($restore->endpoint(), $restoreRequest->withAttribute('id', $id))->getStatusCode());
            self::assertFileExists($root . '/restore.txt');

            $trashedAgain = $this->dispatch($dispatcher, $deleteEntry->endpoint(), 'DELETE', ['path' => 'restore.txt']);
            $secondId = json_decode((string) $trashedAgain->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['trash']['item']['id'];
            $deleteRequest = new ServerRequest('DELETE', '/api/trash/' . $secondId, ['Content-Type' => 'application/json', 'X-CSRF-TOKEN' => 'valid'], '{}');
            self::assertSame(200, $dispatcher->dispatch($deleteTrash->endpoint(), $deleteRequest->withAttribute('id', $secondId))->getStatusCode());
            self::assertSame(0, json_decode((string) $dispatcher->dispatch($list->endpoint(), new ServerRequest('GET', '/api/trash'))->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['total']);
        } finally {
            $this->remove($root);
            $this->remove($trashRoot);
        }
    }

    /** @param array<string, mixed> $input */
    private function dispatch(EndpointDispatcher $dispatcher, string $endpoint, string $method, array $input): \Psr\Http\Message\ResponseInterface
    {
        $body = json_encode(['resource' => 'Files'] + $input, JSON_THROW_ON_ERROR);

        return $dispatcher->dispatch($endpoint, new ServerRequest($method, '/', [
            'Content-Type' => 'application/json',
            'X-CSRF-TOKEN' => 'valid',
        ], $body));
    }

    private function actions(FileManager $files): FileMutationActions
    {
        $authorization = $this->authorization();
        $guard = $this->guard($authorization);

        return new FileMutationActions(
            new CreateFolderAction($files, $guard),
            new RenameAction($files, $guard),
            new TransferAction($files, $guard, 'copy'),
            new TransferAction($files, $guard, 'move'),
            new DeleteAction($files, $guard),
        );
    }

    private function files(string $root, ?AuthorizationInterface $authorization = null): FileManager
    {
        $resource = new ResourceType('Files', $root, '/files', ['txt']);

        return new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($root, '/files'))]),
            $authorization ?? $this->authorization(),
            new EventDispatcher(),
        );
    }

    private function guard(AuthorizationInterface $authorization): MutationGuard
    {
        return new MutationGuard($authorization, new CallbackCsrfTokenProvider(
            static fn (RequestContext $context): string => 'valid',
            static fn (RequestContext $context, string $token): bool => $token === 'valid',
        ));
    }

    private function authorization(bool $authenticated = true): AuthorizationInterface
    {
        return new class($authenticated) implements AuthorizationInterface {
            public function __construct(private bool $authenticated) {}
            public function isAuthenticated(): bool { return $this->authenticated; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return $this->authenticated; }
        };
    }

    private function directory(): string
    {
        $directory = sys_get_temp_dir() . '/sofinder-mutation-action-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);

        return $directory;
    }

    private function remove(string $path): void
    {
        if (is_file($path) || is_link($path)) { @unlink($path); return; }
        if (!is_dir($path)) return;
        foreach (new \FilesystemIterator($path, \FilesystemIterator::SKIP_DOTS) as $entry) {
            if ($entry instanceof \SplFileInfo) {
                $this->remove($entry->getPathname());
            }
        }
        @rmdir($path);
    }
}
