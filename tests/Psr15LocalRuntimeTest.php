<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;
use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\LocalApplicationFactory;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceType;

final class Psr15LocalRuntimeTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-psr-runtime-' . bin2hex(random_bytes(6));
        mkdir($this->directory . '/files', 0770, true);
    }

    protected function tearDown(): void
    {
        if (!is_dir($this->directory)) return;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $item) {
            if ($item->isDir()) rmdir($item->getPathname()); else unlink($item->getPathname());
        }
        rmdir($this->directory);
    }

    public function testFactoryBuildsTheCompleteCatalogAndExecutesMutations(): void
    {
        $psr17 = new Psr17Factory();
        $factory = new LocalApplicationFactory(
            $psr17,
            $psr17,
            $this->services(),
            [],
            $this->directory . '/state',
            $this->directory . '/files',
        );
        $implemented = array_map(static fn ($action): string => $action->endpoint(), $factory->actions());
        $expected = array_map(static fn ($endpoint): string => $endpoint->name, EndpointCatalog::all());
        sort($implemented);
        sort($expected);
        self::assertCount(52, $implemented);
        self::assertSame($expected, $implemented);

        $application = $factory->create();
        $fallback = new class($psr17) implements RequestHandlerInterface {
            public function __construct(private Psr17Factory $responses) {}
            public function handle(ServerRequestInterface $request): ResponseInterface { return $this->responses->createResponse(404); }
        };
        $middleware = $application->middleware();

        $browser = $middleware->process(new ServerRequest('GET', '/sofinder/browser?lang=zh-CN&path=documents'), $fallback);
        self::assertSame(200, $browser->getStatusCode(), (string) $browser->getBody());
        self::assertSame('text/html; charset=UTF-8', $browser->getHeaderLine('Content-Type'));
        self::assertSame('no-store, private', $browser->getHeaderLine('Cache-Control'));
        self::assertSame('SAMEORIGIN', $browser->getHeaderLine('X-Frame-Options'));
        self::assertStringContainsString('<html lang="zh-cn">', (string) $browser->getBody());
        self::assertStringContainsString('&quot;apiBase&quot;:&quot;/sofinder/api/config&quot;', (string) $browser->getBody());
        self::assertStringContainsString('&quot;csrfToken&quot;:&quot;csrf&quot;', (string) $browser->getBody());
        self::assertStringContainsString('/sofinder/assets/sofinder.js?v=', (string) $browser->getBody());

        $asset = $middleware->process(new ServerRequest('GET', '/sofinder/assets/sofinder.css'), $fallback);
        self::assertSame(200, $asset->getStatusCode(), (string) $asset->getBody());
        self::assertSame('text/css; charset=UTF-8', $asset->getHeaderLine('Content-Type'));

        $live = $middleware->process(new ServerRequest('GET', '/sofinder/live'), $fallback);
        self::assertSame(200, $live->getStatusCode());
        self::assertSame('ready', json_decode((string) $live->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['status']);
        self::assertSame('1.0', $live->getHeaderLine('X-SoFinder-API-Version'));
        self::assertSame('same-origin', $live->getHeaderLine('Cross-Origin-Resource-Policy'));

        $created = $middleware->process(
            (new ServerRequest('POST', '/sofinder/api/folders'))->withParsedBody(['resource' => 'Files', 'path' => '', 'name' => 'documents', '_token' => 'csrf']),
            $fallback,
        );
        self::assertSame(201, $created->getStatusCode(), (string) $created->getBody());
        self::assertDirectoryExists($this->directory . '/files/documents');

        $rawJson = (new ServerRequest(
            'POST',
            '/sofinder/api/folders',
            ['Content-Type' => 'application/json', 'X-CSRF-TOKEN' => 'csrf'],
            json_encode(['resource' => 'Files', 'path' => '', 'name' => 'raw-json'], JSON_THROW_ON_ERROR),
        ))->withParsedBody([]);
        $rawCreated = $middleware->process($rawJson, $fallback);
        self::assertSame(201, $rawCreated->getStatusCode(), (string) $rawCreated->getBody());
        self::assertDirectoryExists($this->directory . '/files/raw-json');

        $health = $middleware->process(new ServerRequest('GET', '/sofinder/health'), $fallback);
        self::assertSame(200, $health->getStatusCode());
        $healthPayload = json_decode((string) $health->getBody(), true, 32, JSON_THROW_ON_ERROR);
        self::assertNotSame('endpoint_not_implemented', $healthPayload['error']['code'] ?? null);
        self::assertSame([
            'document-preview',
            'image',
            'maintenance-queue',
            'runtime',
            'storage',
        ], array_column($healthPayload['data']['checks'], 'name'));
    }

    private function services(): HostServices
    {
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $actor = new class implements ActorProviderInterface { public function actorId(): string { return 'psr-test'; } };
        $csrf = new class implements CsrfTokenProviderInterface {
            public function token(RequestContext $context): string { return 'csrf'; }
            public function isValid(RequestContext $context, string $token): bool { return $token === 'csrf'; }
        };
        $events = new class implements EventDispatcherInterface { public function dispatch(object $event): object { return $event; } };
        $roles = new class implements RoleAuthorizationInterface { public function isGranted(string $role): bool { return true; } };

        return new HostServices($authorization, $actor, $csrf, $events, $roles);
    }
}
