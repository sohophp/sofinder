<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Http\EndpointDefinition;

final class EndpointRouteHandler implements RequestHandlerInterface
{
    public function __construct(private readonly RequestHandlerInterface $dispatcher, private readonly EndpointDefinition $endpoint)
    {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->dispatcher->handle($request->withAttribute('sofinder.endpoint', $this->endpoint->name));
    }
}
