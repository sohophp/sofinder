<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Http\Request;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Value\RequestContext;

final readonly class LaravelCsrfTokenProvider implements CsrfTokenProviderInterface
{
    private \Closure $request;

    /** @param callable():Request $request */
    public function __construct(callable $request)
    {
        $this->request = \Closure::fromCallable($request);
    }

    public function token(RequestContext $context): string
    {
        $request = ($this->request)();
        if (!$request->hasSession()) {
            throw new \RuntimeException('SoFinder Laravel routes require session middleware for CSRF protection.');
        }

        return $request->session()->token();
    }

    public function isValid(RequestContext $context, string $token): bool
    {
        $request = ($this->request)();

        return $request->hasSession()
            && $token !== ''
            && hash_equals($request->session()->token(), $token);
    }
}
