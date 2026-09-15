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
use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Http\FailureAuditSubscriber;

final class HttpContractTest extends TestCase
{
    public function testFailedBatchAuditIncludesBoundedFileNamesAndErrorCode(): void
    {
        $request = Request::create('/sofinder/api/batch', 'POST', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'resource' => 'Files', 'operation' => 'move', 'destination' => 'archive', 'paths' => ['private/folder/one.txt', "two\n.pdf"],
        ], JSON_THROW_ON_ERROR));
        $request->attributes->set('_sofinder', true);
        $request->attributes->set('_route', 'sofinder_api_batch');
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects(self::once())->method('warning')->with('SoFinder request failed.', self::callback(static fn (array $context): bool =>
            $context['error_code'] === 'not_found'
            && $context['operation_context']['item_names'] === ['one.txt', 'two.pdf']
            && $context['operation_context']['item_count'] === 2
            && $context['operation_context']['destination'] === 'archive'
        ));
        $event = new ExceptionEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST, new SoFinderException('Missing.', 'not_found', 404));
        (new FailureAuditSubscriber($logger))->onException($event);
    }

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
        self::assertSame('SAMEORIGIN', $response->headers->get('X-Frame-Options'));
        self::assertSame('1.0', $response->headers->get('X-SoFinder-API-Version'));
        self::assertSame('same-origin', $response->headers->get('Cross-Origin-Resource-Policy'));
        self::assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        self::assertStringContainsString("default-src 'none'", (string) $response->headers->get('Content-Security-Policy'));
        self::assertStringContainsString("frame-src 'self'", (string) $response->headers->get('Content-Security-Policy'));
    }

    public function testPendingDocumentPreviewProvidesARetryHint(): void
    {
        $request = Request::create('/sofinder/api/preview/document');
        $request->attributes->set('_sofinder', true);
        $event = new ExceptionEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST, new SoFinderException('Pending.', 'document_preview_pending', 202));
        (new ExceptionSubscriber())->onException($event);

        self::assertSame(202, $event->getResponse()?->getStatusCode());
        self::assertSame('1', $event->getResponse()?->headers->get('Retry-After'));
    }

    public function testStrictImagePolicyUsesOnlyConfiguredOrigins(): void
    {
        $request = Request::create('/sofinder/browser');
        $request->attributes->set('_sofinder', true);
        $response = new Response();
        $event = new ResponseEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST, $response);

        (new SecurityResponseSubscriber(true, ['https://cdn.example.test']))->onResponse($event);

        $policy = (string) $response->headers->get('Content-Security-Policy');
        self::assertStringContainsString("img-src 'self' data: blob: https://cdn.example.test", $policy);
        self::assertStringNotContainsString('http:', $policy);
    }

    public function testLegacyFieldsReceiveMachineReadableDeprecationHeaders(): void
    {
        $request = Request::create('/sofinder/api/images/edit');
        $request->attributes->set('_sofinder', true);
        $request->attributes->set('_sofinder_deprecated_fields', 'operation,rotation,width,height,x,y');
        $response = new JsonResponse(['success' => true, 'data' => []]);
        $event = new ResponseEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST, $response);

        (new SecurityResponseSubscriber())->onResponse($event);

        self::assertSame('true', $response->headers->get('Deprecation'));
        self::assertSame('Wed, 30 Jun 2027 23:59:59 GMT', $response->headers->get('Sunset'));
        self::assertSame('operation,rotation,width,height,x,y', $response->headers->get('X-SoFinder-Deprecated-Fields'));
        self::assertStringContainsString('rel="deprecation"', (string) $response->headers->get('Link'));
    }
}
