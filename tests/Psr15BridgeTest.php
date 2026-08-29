<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\EndpointHandlerInterface;
use SohoPHP\SoFinder\Psr15\SoFinderMiddleware;

final class Psr15BridgeTest extends TestCase
{
    public function testMiddlewareMatchesPrefixMethodPathAndArguments(): void
    {
        $factory = new Psr17Factory();
        $endpoint = new class($factory) implements EndpointHandlerInterface {
            public function __construct(private Psr17Factory $factory) {}
            public function endpoint(): string { return 'sofinder_api_trash_restore'; }
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                return $this->factory->createResponse(200)->withBody($this->factory->createStream((string) $request->getAttribute('id')));
            }
        };
        $fallback = new class($factory) implements RequestHandlerInterface {
            public function __construct(private Psr17Factory $factory) {}
            public function handle(ServerRequestInterface $request): ResponseInterface { return $this->factory->createResponse(418); }
        };
        $middleware = new SoFinderMiddleware(new EndpointDispatcher($factory, $factory, [$endpoint]));

        $response = $middleware->process(new ServerRequest('POST', '/sofinder/api/trash/0123456789abcdef0123456789abcdef/restore'), $fallback);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame('0123456789abcdef0123456789abcdef', (string) $response->getBody());
        self::assertSame('nosniff', $response->getHeaderLine('X-Content-Type-Options'));
        self::assertSame(418, $middleware->process(new ServerRequest('GET', '/outside'), $fallback)->getStatusCode());
    }

    public function testDispatcherMapsDomainFailuresToTheStableEnvelope(): void
    {
        $factory = new Psr17Factory();
        $endpoint = new class implements EndpointHandlerInterface {
            public function endpoint(): string { return 'sofinder_api_entries'; }
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                throw new SoFinderException('No access.', 'access_denied', 403);
            }
        };

        $response = (new EndpointDispatcher($factory, $factory, [$endpoint]))->dispatch('sofinder_api_entries', new ServerRequest('GET', '/api/entries'));
        $payload = json_decode((string) $response->getBody(), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame(403, $response->getStatusCode());
        self::assertSame(['success' => false, 'error' => ['code' => 'access_denied', 'message' => 'No access.']], $payload);
        self::assertSame('no-store', $response->getHeaderLine('Cache-Control'));
    }

    public function testDispatcherPreservesStableRetryHeaders(): void
    {
        $factory = new Psr17Factory();
        $rateLimited = new class implements EndpointHandlerInterface {
            public function endpoint(): string { return 'sofinder_api_entries'; }
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                throw new SoFinderException('Try later.', 'rate_limit_exceeded', 429);
            }
        };
        $pending = new class implements EndpointHandlerInterface {
            public function endpoint(): string { return 'sofinder_document_preview'; }
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                throw new SoFinderException('Pending.', 'document_preview_pending', 202);
            }
        };
        $dispatcher = new EndpointDispatcher($factory, $factory, [$rateLimited, $pending]);

        self::assertSame('2', $dispatcher->dispatch('sofinder_api_entries', new ServerRequest('GET', '/'))->getHeaderLine('Retry-After'));
        self::assertSame('1', $dispatcher->dispatch('sofinder_document_preview', new ServerRequest('GET', '/'))->getHeaderLine('Retry-After'));
    }
}
