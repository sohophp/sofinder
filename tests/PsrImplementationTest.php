<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use GuzzleHttp\Psr7\HttpFactory as GuzzleFactory;
use Nyholm\Psr7\Factory\Psr17Factory;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestFactoryInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\PsrRequestContextFactory;
use SohoPHP\SoFinder\Psr15\SoFinderMiddleware;

final class PsrImplementationTest extends TestCase
{
    /** @return iterable<string, array{ResponseFactoryInterface&StreamFactoryInterface&ServerRequestFactoryInterface}> */
    public static function factories(): iterable
    {
        yield 'Nyholm PSR-7' => [new Psr17Factory()];
        yield 'Guzzle PSR-7' => [new GuzzleFactory()];
    }

    #[DataProvider('factories')]
    public function testMiddlewareIsIndependentOfThePsr7Implementation(
        ResponseFactoryInterface&StreamFactoryInterface&ServerRequestFactoryInterface $factory,
    ): void {
        $fallback = new class($factory) implements RequestHandlerInterface {
            public function __construct(private ResponseFactoryInterface $responses) {}
            public function handle(ServerRequestInterface $request): ResponseInterface { return $this->responses->createResponse(204); }
        };
        $middleware = new SoFinderMiddleware(new EndpointDispatcher($factory, $factory, []));
        $request = $factory->createServerRequest('GET', '/sofinder/api/config');

        $response = $middleware->process($request, $fallback);

        self::assertSame(501, $response->getStatusCode());
        self::assertStringContainsString('endpoint_not_implemented', (string) $response->getBody());
    }

    #[DataProvider('factories')]
    public function testRequestContextConversionIsIndependentOfThePsr7Implementation(
        ResponseFactoryInterface&StreamFactoryInterface&ServerRequestFactoryInterface $factory,
    ): void {
        $request = $factory->createServerRequest('GET', 'https://example.test/manager/api/entries')
            ->withHeader('X-Actor', '42')
            ->withQueryParams(['resource' => 'Images'])
            ->withAttribute('workspace', 'site-a')
            ->withAttribute('sofinder.base_path', '/manager');

        $context = (new PsrRequestContextFactory())->create($request);

        self::assertSame('42', $context->header('x-actor'));
        self::assertSame('Images', $context->query('resource'));
        self::assertSame('site-a', $context->attribute('workspace'));
        self::assertSame('/manager', $context->basePath);
        self::assertSame('https://example.test', $context->schemeAndHost);
    }
}
