<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Http\Request;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;
use Symfony\Component\HttpFoundation\Response;

final class LaravelEndpointController
{
    public function __construct(
        private readonly EndpointDispatcher $dispatcher,
        private readonly PsrHttpFactory $requests,
        private readonly HttpFoundationFactory $responses,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $route = $request->route();
        if (!is_object($route) || !is_callable([$route, 'getAction'])) {
            throw new \LogicException('The SoFinder Laravel controller requires a resolved route.');
        }
        $endpoint = $route->getAction('_sofinder_endpoint');
        $basePath = $route->getAction('_sofinder_base_path');
        if (!is_string($endpoint) || $endpoint === '' || !is_string($basePath)) {
            throw new \LogicException('The SoFinder endpoint route metadata is missing.');
        }
        $psrRequest = $this->requests->createRequest($request)
            ->withAttribute('sofinder.endpoint', $endpoint)
            ->withAttribute('sofinder.base_path', $basePath);
        foreach ($route->parameters() as $name => $value) {
            if (is_string($name) && is_scalar($value)) {
                $psrRequest = $psrRequest->withAttribute($name, (string) $value);
            }
        }
        $psrResponse = $this->dispatcher->handle($psrRequest);
        $contentType = strtolower($psrResponse->getHeaderLine('Content-Type'));

        return $this->responses->createResponse($psrResponse, !str_starts_with($contentType, 'application/json'));
    }
}
