<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class SecurityResponseSubscriber implements EventSubscriberInterface
{
    public function onResponse(ResponseEvent $event): void
    {
        if (!$event->getRequest()->attributes->getBoolean('_sofinder')) {
            return;
        }

        $response = $event->getResponse();
        $headers = $response->headers;
        $headers->set('X-Content-Type-Options', 'nosniff');
        $headers->set('X-SoFinder-API-Version', '1.0');
        $headers->set('Referrer-Policy', 'no-referrer');
        $headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
        $headers->set('Cross-Origin-Resource-Policy', 'same-origin');
        $deprecatedFields = $event->getRequest()->attributes->get('_sofinder_deprecated_fields');
        if (is_string($deprecatedFields) && $deprecatedFields !== '') {
            $headers->set('Deprecation', 'true');
            $headers->set('Sunset', 'Wed, 30 Jun 2027 23:59:59 GMT');
            $headers->set('X-SoFinder-Deprecated-Fields', $deprecatedFields);
            $headers->set('Link', '</docs/upgrading>; rel="deprecation"');
        }
        if (!$headers->has('Content-Security-Policy')) {
            $headers->set('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob: http: https:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'self'");
        }
        if (str_starts_with((string) $response->headers->get('Content-Type'), 'application/json')) {
            $response->setPrivate();
            $headers->set('Cache-Control', 'private, no-store');
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::RESPONSE => 'onResponse'];
    }
}
