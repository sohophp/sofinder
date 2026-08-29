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
        foreach (SecurityHeaders::defaults() as $name => $value) {
            if (!$headers->has($name)) $headers->set($name, $value);
        }
        $deprecatedFields = $event->getRequest()->attributes->get('_sofinder_deprecated_fields');
        if (is_string($deprecatedFields) && $deprecatedFields !== '') {
            $headers->set('Deprecation', 'true');
            $headers->set('Sunset', 'Wed, 30 Jun 2027 23:59:59 GMT');
            $headers->set('X-SoFinder-Deprecated-Fields', $deprecatedFields);
            $headers->set('Link', '</docs/upgrading>; rel="deprecation"');
        }
        if (str_starts_with((string) $response->headers->get('Content-Type'), 'application/json')) {
            $headers->remove('Cache-Control');
            $headers->set('Cache-Control', 'no-store, private');
        }
    }

    public static function getSubscribedEvents(): array
    {
        // Run after Symfony's session listener so its cache directives cannot
        // weaken or change the cross-host no-store contract.
        return [KernelEvents::RESPONSE => ['onResponse', -2048]];
    }
}
