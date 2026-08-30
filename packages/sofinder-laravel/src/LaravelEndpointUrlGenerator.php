<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Routing\UrlGenerator;
use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;

final class LaravelEndpointUrlGenerator implements EndpointUrlGeneratorInterface
{
    public function __construct(private readonly UrlGenerator $urls)
    {
    }

    public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
    {
        return $this->urls->route(LaravelRouteName::fromEndpoint($endpoint), $parameters, $absolute);
    }
}
