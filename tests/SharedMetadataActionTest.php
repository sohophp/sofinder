<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\Action\MetadataGetAction;
use SohoPHP\SoFinder\Http\Action\MetadataUpdateAction;
use SohoPHP\SoFinder\Http\MetadataActions;
use SohoPHP\SoFinder\Http\MetadataPayload;
use SohoPHP\SoFinder\Http\MetadataController;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Metadata\JsonMetadataStore;
use SohoPHP\SoFinder\Metadata\MetadataManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SharedMetadataActionTest extends TestCase
{
    /** @var list<string> */
    private array $temporaryPaths = [];

    protected function tearDown(): void
    {
        foreach (array_reverse($this->temporaryPaths) as $path) {
            is_dir($path) ? @rmdir($path) : @unlink($path);
        }
    }

    public function testSymfonyAndPsrMetadataUpdatesHaveIdenticalContracts(): void
    {
        [$symfonyManager, $symfonyAuthorization, $symfonyActions] = $this->environment();
        [, , $psrActions] = $this->environment();
        $body = json_encode(['resource' => 'Files', 'path' => 'one.txt', 'action' => 'tags', 'tags' => ['Docs']], JSON_THROW_ON_ERROR);
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $controller = new MetadataController($symfonyManager, new CsrfGuard($tokens, $symfonyAuthorization), new FeaturePolicy(), $symfonyActions);
        $symfonyResponse = $controller->update(Request::create('/sofinder/metadata', 'PATCH', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: $body));

        $factory = new Psr17Factory();
        $request = (new ServerRequest('PATCH', '/sofinder/metadata'))
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('X-CSRF-TOKEN', 'valid')
            ->withBody($factory->createStream($body));
        $psrResponse = (new PsrEndpointHandler($psrActions->update, $factory, $factory))->handle($request);

        self::assertSame($symfonyResponse->getStatusCode(), $psrResponse->getStatusCode());
        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
        self::assertSame(['Docs'], $symfonyActions->get->execute(new RequestContext(query: ['resource' => 'Files']))->payload['data']['tags']['one.txt']);
    }

    public function testSharedGetFiltersDisabledMetadataSections(): void
    {
        [, , $actions] = $this->environment(new FeaturePolicy(['recent' => false, 'tags' => false]));

        $payload = $actions->get->execute(new RequestContext(query: ['resource' => 'Files']))->payload;

        self::assertSame([], $payload['data']['recent']);
        self::assertSame([], $payload['data']['tags']);
        self::assertArrayHasKey('quickAccessEntries', $payload['data']);
    }

    public function testMutationRejectsCsrfBeforeInspectingInput(): void
    {
        [, , $actions] = $this->environment();

        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('security token');
        $actions->update->execute(new RequestContext(headers: ['X-CSRF-TOKEN' => 'invalid']), ['action' => 'unknown']);
    }

    public function testInvalidTagsRetainStableErrorCode(): void
    {
        [, , $actions] = $this->environment();

        try {
            $actions->update->execute(
                new RequestContext(headers: ['X-CSRF-TOKEN' => 'valid']),
                ['resource' => 'Files', 'path' => 'one.txt', 'action' => 'tags', 'tags' => 'Docs'],
            );
            self::fail('Invalid tags must be rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('invalid_tags', $exception->errorCode);
            self::assertSame(422, $exception->httpStatus);
        }
    }

    /** @return array{MetadataManager, AuthorizationInterface, MetadataActions} */
    private function environment(?FeaturePolicy $features = null): array
    {
        $suffix = bin2hex(random_bytes(8));
        $directory = sys_get_temp_dir() . '/sofinder-shared-metadata-' . $suffix;
        $metadataFile = sys_get_temp_dir() . '/sofinder-shared-metadata-' . $suffix . '.json';
        mkdir($directory, 0775, true);
        file_put_contents($directory . '/one.txt', 'one');
        $this->temporaryPaths[] = $directory . '/one.txt';
        $this->temporaryPaths[] = $directory;
        $this->temporaryPaths[] = $metadataFile . '.lock';
        $this->temporaryPaths[] = $metadataFile;

        $guard = new PathGuard();
        $resource = new ResourceType('Files', $directory, '/files', ['txt'], [], []);
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($directory, '/files', $guard))]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $actors = new class implements ActorProviderInterface {
            public function actorId(): string { return 'actor'; }
        };
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'valid'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'valid'; }
        };
        $manager = new MetadataManager(
            new FileManager($registry, $authorization, new EventDispatcher(), $guard),
            new JsonMetadataStore($metadataFile),
            $actors,
        );
        $payload = new MetadataPayload($manager, $features ?? new FeaturePolicy());
        $actions = new MetadataActions(
            new MetadataGetAction($payload),
            new MetadataUpdateAction($manager, $payload, new MutationGuard($authorization, $csrf)),
        );

        return [$manager, $authorization, $actions];
    }
}
