<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Event\OperationEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class OperationAuditSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private LoggerInterface $logger,
        private RequestStack $requests,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [OperationEvent::class => 'onOperation'];
    }

    public function onOperation(OperationEvent $event): void
    {
        if (!str_starts_with($event->operation, 'after.')) {
            return;
        }
        $request = $this->requests->getCurrentRequest();
        $context = [];
        foreach ($event->context as $key => $value) {
            if (is_scalar($value) || $value === null) {
                $context[$key] = is_string($value) ? mb_substr($value, 0, 500) : $value;
            }
        }
        $this->logger->info('SoFinder operation completed.', [
            'operation' => substr($event->operation, 6),
            'resource' => $event->resource->name,
            'path' => $event->path,
            'request_ip' => $request?->getClientIp(),
            'request_id' => (string) $request?->attributes->get('_sofinder_request_id', ''),
            'route' => $request?->attributes->get('_route'),
            'operation_context' => $context,
        ]);
    }
}
