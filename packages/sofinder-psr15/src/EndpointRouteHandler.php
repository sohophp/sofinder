<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Http\EndpointDefinition;

final readonly class EndpointRouteHandler implements RequestHandlerInterface
{
    public function __construct(private RequestHandlerInterface $dispatcher, private EndpointDefinition $endpoint)
    {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->dispatcher->handle($request->withAttribute('sofinder.endpoint', $this->endpoint->name));
    }
}
