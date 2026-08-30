<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Plugin;

use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Event\AssetOperationEvent;
use Symfony\Component\HttpFoundation\Response;

/** Public contract helper for third-party plugin CI and installation checks. */
final class PluginContractValidator
{
    /** @return array<string,mixed> */
    public function validate(PluginInterface $plugin): array
    {
        return (new PluginRegistry([$plugin]))->descriptors()[0];
    }

    public function validatePreviewResponse(Response $response): void
    {
        $csp = strtolower((string) $response->headers->get('Content-Security-Policy'));
        if (!str_contains($csp, "frame-ancestors 'self'") || !str_contains($csp, "default-src 'none'")) {
            throw new \InvalidArgumentException('Plugin preview responses require a restrictive same-origin Content-Security-Policy.');
        }
        if (strtolower((string) $response->headers->get('X-Content-Type-Options')) !== 'nosniff') {
            throw new \InvalidArgumentException('Plugin preview responses require X-Content-Type-Options: nosniff.');
        }
        if ($response->headers->get('Referrer-Policy') === null) {
            throw new \InvalidArgumentException('Plugin preview responses require an explicit Referrer-Policy.');
        }
    }

    /** @return array<string,mixed> */
    public function validateEvent(AssetOperationEvent $event): array
    {
        json_encode($event, JSON_THROW_ON_ERROR);
        return $event->jsonSerialize();
    }
}
