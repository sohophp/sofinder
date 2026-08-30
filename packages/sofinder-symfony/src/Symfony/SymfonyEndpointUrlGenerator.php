<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class SymfonyEndpointUrlGenerator implements EndpointUrlGeneratorInterface
{
    public function __construct(private readonly UrlGeneratorInterface $router) {}

    public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
    {
        return $this->router->generate($endpoint, $parameters, $absolute ? UrlGeneratorInterface::ABSOLUTE_URL : UrlGeneratorInterface::ABSOLUTE_PATH);
    }
}
