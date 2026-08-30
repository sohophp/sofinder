<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Observability;

use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Event\OperationEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class OperationMetricsSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly MetricsStoreInterface $metrics) {}
    public function onOperation(OperationEvent $event): void
    {
        if (!str_starts_with($event->operation, 'after.')) return;
        $this->metrics->increment('sofinder_operations_total', ['operation' => substr($event->operation, 6), 'resource' => $event->resource->name]);
    }
    public static function getSubscribedEvents(): array { return [OperationEvent::class => 'onOperation']; }
}
