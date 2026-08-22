<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Http\ExceptionSubscriber;
use SohoPHP\SoFinder\Http\SecurityResponseSubscriber;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;

final class HttpContractTest extends TestCase
{
    public function testSoFinderFailuresUseTheStableEnvelopeAndRetryHeader(): void
    {
        $request = Request::create('/sofinder/api/entries');
        $request->attributes->set('_sofinder', true);
        $event = new ExceptionEvent(
            $this->createMock(HttpKernelInterface::class),
            $request,
            HttpKernelInterface::MAIN_REQUEST,
            new SoFinderException('Slow down.', 'rate_limit_exceeded', 429),
        );

        (new ExceptionSubscriber())->onException($event);

        $response = $event->getResponse();
        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertSame('2', $response->headers->get('Retry-After'));
        self::assertSame([
            'success' => false,
            'error' => ['code' => 'rate_limit_exceeded', 'message' => 'Slow down.'],
        ], json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR));
    }

    public function testAllSoFinderJsonResponsesReceivePrivateSecurityHeaders(): void
    {
        $request = Request::create('/sofinder/api/config');
        $request->attributes->set('_sofinder', true);
        $response = new JsonResponse(['success' => true, 'data' => []]);
        $event = new ResponseEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST, $response);

        (new SecurityResponseSubscriber())->onResponse($event);

        self::assertSame('nosniff', $response->headers->get('X-Content-Type-Options'));
        self::assertSame('same-origin', $response->headers->get('Cross-Origin-Resource-Policy'));
        self::assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        self::assertStringContainsString("default-src 'none'", (string) $response->headers->get('Content-Security-Policy'));
    }
}
