<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Event\OperationEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class MetadataOperationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly MetadataStoreInterface $metadata,
        private readonly ActorProviderInterface $actors,
        private readonly LoggerInterface $logger,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [OperationEvent::class => 'onOperation'];
    }

    public function onOperation(OperationEvent $event): void
    {
        if (!in_array($event->operation, ['after.rename', 'after.move', 'after.delete'], true)) {
            return;
        }
        try {
            $actor = $this->actors->actorId();
            if ($event->operation === 'after.delete') {
                $this->metadata->deletePath($actor, $event->resource->name, $event->path);
                return;
            }
            $source = $event->context['source'] ?? null;
            if (is_string($source)) {
                $this->metadata->movePath($actor, $event->resource->name, $source, $event->path);
            }
        } catch (\Throwable $exception) {
            $this->logger->warning('SoFinder metadata could not follow a completed file operation.', [
                'operation' => $event->operation,
                'resource' => $event->resource->name,
                'path' => $event->path,
                'exception' => $exception,
            ]);
        }
    }
}
