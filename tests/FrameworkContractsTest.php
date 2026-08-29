<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Framework\CallbackRequestContextProvider;
use SohoPHP\SoFinder\Value\RequestContext;

final class FrameworkContractsTest extends TestCase
{
    public function testCallbackPortsFailClosedAndPreserveTrustedRequestFacts(): void
    {
        $context = new RequestContext(['X-Tenant' => 'site-a'], ['page' => 2], ['actor' => '42'], '/admin', 'https://example.test');
        $requests = new CallbackRequestContextProvider(static fn (): RequestContext => $context);
        $csrf = new CallbackCsrfTokenProvider(
            static fn (RequestContext $request): string => 'token-' . $request->attribute('actor'),
            static fn (RequestContext $request, string $token): bool => hash_equals('token-' . $request->attribute('actor'), $token),
        );

        self::assertSame('site-a', $requests->current()?->header('x-tenant'));
        self::assertSame(2, $context->query('page'));
        self::assertSame('token-42', $csrf->token($context));
        self::assertTrue($csrf->isValid($context, 'token-42'));
        self::assertFalse($csrf->isValid($context, ''));
    }
}
