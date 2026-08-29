<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\DocumentPreviewDispatcherInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewJobCreateAction;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewJobStatusAction;
use SohoPHP\SoFinder\Http\Action\SignedUrlIssueAction;
use SohoPHP\SoFinder\Http\Action\SecurityStatusAction;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\DocumentPreviewJobActions;
use SohoPHP\SoFinder\Http\DocumentPreviewJobController;
use SohoPHP\SoFinder\Http\DocumentPreviewJobService;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Http\SignedUrlController;
use SohoPHP\SoFinder\Http\SecurityStatusController;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use SohoPHP\SoFinder\Security\MalwareScanStatusStore;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SharedRoutedActionTest extends TestCase
{
    /** @var list<string> */
    private array $directories = [];

    protected function tearDown(): void
    {
        foreach (array_reverse($this->directories) as $directory) {
            if (!is_dir($directory)) continue;
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($iterator as $entry) $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
            @rmdir($directory);
        }
    }

    public function testSymfonyAndPsrDocumentJobContractsMatch(): void
    {
        $directory = $this->directory('document-source');
        $cache = $this->directory('document-cache');
        file_put_contents($directory . '/report.docx', 'office bytes');
        [$files, $authorization] = $this->files(new ResourceType('Files', $directory, '/files', ['docx']));
        $previews = new DocumentPreviewManager($files, $cache, officeEnabled: true, officeBinary: __DIR__ . '/fixtures/fake-libreoffice');
        $actor = new class implements ActorProviderInterface { public function actorId(): string { return 'actor'; } };
        $bus = new class implements DocumentPreviewDispatcherInterface {
            public function available(): bool { return true; }
            public function dispatch(\SohoPHP\SoFinder\Preview\DocumentPreviewMessage $message): void {}
        };
        $jobs = new DocumentPreviewJobManager($previews, $actor, $cache . '/jobs.json', 'messenger', 60, 60, $bus, clock: static fn (): int => 1000);
        $urls = $this->urls();
        $service = new DocumentPreviewJobService($jobs, $urls, new FeaturePolicy());
        $guard = new MutationGuard($authorization, $this->csrf());
        $actions = new DocumentPreviewJobActions(new DocumentPreviewJobCreateAction($service, $guard), new DocumentPreviewJobStatusAction($service));
        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $router = $this->createMock(RouterInterface::class);
        $controller = new DocumentPreviewJobController($jobs, new CsrfGuard($tokens, $authorization), $router, actions: $actions);
        $body = json_encode(['resource' => 'Files', 'path' => 'report.docx'], JSON_THROW_ON_ERROR);
        $symfony = $controller->create(Request::create('/api/preview/document/jobs', 'POST', server: ['HTTP_X_CSRF_TOKEN' => 'valid'], content: $body));

        $factory = new Psr17Factory();
        $request = (new ServerRequest('POST', '/api/preview/document/jobs'))->withHeader('Content-Type', 'application/json')->withHeader('X-CSRF-TOKEN', 'valid')->withBody($factory->createStream($body));
        $psr = (new PsrEndpointHandler($actions->create, $factory, $factory))->handle($request);
        self::assertSame(202, $psr->getStatusCode());
        self::assertSame('1', $psr->getHeaderLine('Retry-After'));
        self::assertSame(json_decode((string) $symfony->getContent(), true, 32, JSON_THROW_ON_ERROR), json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR));

        $id = json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['id'];
        $status = (new PsrEndpointHandler($actions->status, $factory, $factory))->handle((new ServerRequest('GET', '/jobs/' . $id))->withAttribute('id', $id));
        self::assertSame(202, $status->getStatusCode());
    }

    public function testSymfonyAndPsrSignedUrlIssueContractsMatch(): void
    {
        $directory = $this->directory('signed');
        file_put_contents($directory . '/private.txt', 'private');
        $resource = new ResourceType('Private', $directory, '', ['txt'], deliveryMode: 'proxy');
        [$files, $authorization, $registry] = $this->files($resource);
        $manager = new SignedUrlManager($files, $registry, new PathGuard(), true, str_repeat('s', 32), 60, 300, static fn (): int => 1800000000);
        $action = new SignedUrlIssueAction($manager, $this->urls());
        $router = $this->createMock(RouterInterface::class);
        $controller = new SignedUrlController($manager, new ContentController($files), $router, $action);
        $uri = '/api/signed-url?resource=Private&path=private.txt&ttl=60';
        $symfony = $controller->issue(Request::create($uri));
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', $uri));

        self::assertSame(json_decode((string) $symfony->getContent(), true, 32, JSON_THROW_ON_ERROR), json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR));
        self::assertStringStartsWith('https://example.test/sofinder_signed_content?', json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['url']);
    }

    public function testSymfonyAndPsrSecurityStatusContractsMatch(): void
    {
        $directory = $this->directory('security-status');
        $store = new MalwareScanStatusStore($directory . '/status.json');
        $action = new SecurityStatusAction(false, $store);
        $controller = new SecurityStatusController(false, $store, action: $action);
        $symfony = $controller();
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', '/api/security/status'));

        self::assertSame(
            json_decode((string) $symfony->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
        self::assertSame('disabled', json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['malwareScanning']['status']);
    }

    /** @return array{FileManager,AuthorizationInterface,ResourceRegistry} */
    private function files(ResourceType $resource): array
    {
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($resource->root))]);
        return [new FileManager($registry, $authorization, new EventDispatcher()), $authorization, $registry];
    }

    private function csrf(): CsrfTokenProviderInterface
    {
        return new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'valid'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'valid'; }
        };
    }

    private function urls(): EndpointUrlGeneratorInterface
    {
        return new class implements EndpointUrlGeneratorInterface {
            public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
            {
                return ($absolute ? 'https://example.test/' : '/') . $endpoint . ($parameters === [] ? '' : '?' . http_build_query($parameters));
            }
        };
    }

    private function directory(string $name): string
    {
        $directory = sys_get_temp_dir() . '/sofinder-shared-' . $name . '-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        $this->directories[] = $directory;
        return $directory;
    }
}
