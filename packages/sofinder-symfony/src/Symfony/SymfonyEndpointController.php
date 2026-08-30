<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Http\EndpointDispatcher;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/** Thin HttpFoundation adapter for every framework-neutral HTTP action. */
final class SymfonyEndpointController
{
    public function __construct(
        private readonly EndpointDispatcher $dispatcher,
        private readonly PsrHttpFactory $requests,
        private readonly HttpFoundationFactory $responses,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $endpoint = $request->attributes->get('_sofinder_endpoint');
        if (!is_string($endpoint) || $endpoint === '') {
            throw new \LogicException('The SoFinder Symfony endpoint route metadata is missing.');
        }

        $psrRequest = $this->requests->createRequest($request)
            ->withAttribute('sofinder.endpoint', $endpoint)
            ->withAttribute('sofinder.base_path', $request->getBasePath());
        $psrResponse = $this->dispatcher->handle($psrRequest);
        $contentType = strtolower($psrResponse->getHeaderLine('Content-Type'));

        return $this->responses->createResponse(
            $psrResponse,
            !str_starts_with($contentType, 'application/json'),
        );
    }
}
