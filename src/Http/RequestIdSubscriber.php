<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class RequestIdSubscriber implements EventSubscriberInterface
{
    public function onRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        if (!$request->attributes->getBoolean('_sofinder')) {
            return;
        }

        $provided = (string) $request->headers->get('X-Request-ID', '');
        $request->attributes->set('_sofinder_request_id', preg_match('/^[A-Za-z0-9._-]{8,80}$/D', $provided) === 1 ? $provided : bin2hex(random_bytes(16)));
    }

    public function onResponse(ResponseEvent $event): void
    {
        $id = $event->getRequest()->attributes->get('_sofinder_request_id');
        if (is_string($id) && $id !== '') {
            $event->getResponse()->headers->set('X-Request-ID', $id);
        }
    }

    public static function getSubscribedEvents(): array
    {
        // Run after Symfony's RouterListener so the route's _sofinder flag exists.
        return [KernelEvents::REQUEST => ['onRequest', 16], KernelEvents::RESPONSE => ['onResponse', -32]];
    }
}
