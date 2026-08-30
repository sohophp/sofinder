<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Server\RequestHandlerInterface;

/**
 * Secure entry point for Slim, Mezzio and framework-free PSR applications.
 *
 * Requiring HostServices here makes omission of authorization, actor, CSRF or
 * event dispatching a construction-time error instead of an anonymous default.
 */
final class SoFinderApplication
{
    public function __construct(
        private readonly RequestHandlerInterface $dispatcher,
        private readonly HostServices $services,
        private readonly string $prefix = '/sofinder',
    ) {
    }

    public function middleware(): SoFinderMiddleware
    {
        return new SoFinderMiddleware($this->dispatcher, $this->prefix);
    }

    public function routes(): RouteRegistrar
    {
        return new RouteRegistrar($this->dispatcher, $this->prefix);
    }

    public function services(): HostServices
    {
        return $this->services;
    }
}
