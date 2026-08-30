<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class SoFinderMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly RequestHandlerInterface $soFinder,
        private readonly string $prefix = '/sofinder',
        private readonly RouteMatcher $routes = new RouteMatcher(),
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $path = $request->getUri()->getPath();
        $prefix = '/' . trim($this->prefix, '/');
        if ($prefix !== '/' && $path !== $prefix && !str_starts_with($path, $prefix . '/')) {
            return $handler->handle($request);
        }
        $relativePath = $prefix === '/' ? $path : substr($path, strlen($prefix));
        $match = $this->routes->match($request->getMethod(), $relativePath === '' ? '/' : $relativePath);
        if ($match === null) {
            return $handler->handle($request);
        }
        $request = $request->withAttribute('sofinder.endpoint', $match['endpoint']->name);
        foreach ($match['attributes'] as $name => $value) {
            $request = $request->withAttribute($name, $value);
        }

        return $this->soFinder->handle($request);
    }
}
