<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Event\OperationEvent;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final readonly class AssetCatalogSubscriber implements EventSubscriberInterface
{
    public function __construct(private AssetCatalogInterface $catalog, private WorkspaceProvider $workspaces, private bool $enabled)
    {
    }

    public static function getSubscribedEvents(): array { return [OperationEvent::class => 'onOperation']; }

    public function onOperation(OperationEvent $event): void
    {
        if (!$this->enabled || !str_starts_with($event->operation, 'after.')) return;
        $workspace = $this->workspaces->assertResource($event->resource->name)->id; $operation = substr($event->operation, 6); $entry = $event->context['entry'] ?? null;
        if (in_array($operation, ['upload', 'overwrite'], true) && $entry instanceof Entry && !$entry->directory) $this->catalog->register($workspace, $event->resource->name, $entry);
        elseif ($operation === 'copy' && $entry instanceof Entry && !$entry->directory) $this->catalog->register($workspace, $event->resource->name, $entry);
        elseif ($operation === 'trash_restore' && $entry instanceof Entry) { $this->catalog->restore($workspace, $event->resource->name, $entry->path); if (!$entry->directory) $this->catalog->register($workspace, $event->resource->name, $entry); }
        elseif (in_array($operation, ['move', 'rename'], true) && is_string($event->context['source'] ?? null)) $this->catalog->move($workspace, $event->resource->name, $event->context['source'], $event->path);
        elseif (in_array($operation, ['delete', 'trash_delete'], true)) $this->catalog->delete($workspace, $event->resource->name, $event->path, $operation === 'delete' && ($event->context['trash'] ?? null) !== null);
    }
}
