<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Http\Request;
use SohoPHP\SoFinder\Contract\RequestContextProviderInterface;
use SohoPHP\SoFinder\Value\RequestContext;

final class LaravelRequestContextProvider implements RequestContextProviderInterface
{
    private readonly \Closure $requests;

    /** @param callable():Request $requests */
    public function __construct(callable $requests)
    {
        $this->requests = \Closure::fromCallable($requests);
    }

    public function current(): ?RequestContext
    {
        $request = ($this->requests)();
        $route = $request->route();
        $attributes = $route === null ? [] : $route->parameters();

        return new RequestContext(
            $request->headers->all(),
            $request->query->all(),
            $attributes,
            '/' . trim((string) ($route?->getAction('_sofinder_base_path') ?? ''), '/'),
            $request->getSchemeAndHttpHost(),
        );
    }
}
