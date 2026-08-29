<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\RequestContextProviderInterface;
use SohoPHP\SoFinder\Value\RequestContext;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class SymfonyRequestContextProvider implements RequestContextProviderInterface
{
    public function __construct(private RequestStack $requests)
    {
    }

    public function current(): ?RequestContext
    {
        $request = $this->requests->getCurrentRequest();
        if ($request === null) {
            return null;
        }

        return self::fromRequest($request);
    }

    public static function fromRequest(Request $request): RequestContext
    {
        return new RequestContext(
            array_map(
                static fn (array $values): array => array_values(array_filter($values, 'is_string')),
                $request->headers->all(),
            ),
            $request->query->all(),
            $request->attributes->all(),
            $request->getBasePath(),
            $request->getSchemeAndHttpHost(),
        );
    }
}
