<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use Psr\EventDispatcher\EventDispatcherInterface;
use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\Event\AssetOperationEvent;
use SohoPHP\SoFinder\Event\OperationEvent;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use SohoPHP\SoFinder\Exception\SoFinderException;

final readonly class VersionedOperationSubscriber implements EventSubscriberInterface
{
    private const OPERATIONS = ['upload', 'overwrite', 'rename', 'copy', 'move', 'delete', 'trash_restore', 'trash_delete'];

    public function __construct(private EventDispatcherInterface $events, private WorkspaceProvider $workspaces, private AssetCatalogInterface $assets, private RequestStack $requests, private bool $assetsEnabled)
    {
    }

    public static function getSubscribedEvents(): array { return [OperationEvent::class => ['onOperation', -100], KernelEvents::EXCEPTION => ['onException', 20]]; }

    public function onOperation(OperationEvent $legacy): void
    {
        [$phase, $operation] = array_pad(explode('.', $legacy->operation, 2), 2, '');
        if (!in_array($phase, ['before', 'after'], true) || !in_array($operation, self::OPERATIONS, true)) return;
        $request = $this->requests->getCurrentRequest(); if ($request === null) return;
        $workspace = $this->workspaces->assertResource($legacy->resource->name); $key = '_sofinder_asset_operation_' . $legacy->resource->name . '_' . $operation;
        $id = $phase === 'before' ? bin2hex(random_bytes(16)) : (string) $request->attributes->get($key, bin2hex(random_bytes(16)));
        if ($phase === 'before') {
            $request->attributes->set($key, $id);
            $request->attributes->set('_sofinder_asset_operation_current', ['id' => $id, 'operation' => $operation, 'workspace' => $workspace, 'resource' => $legacy->resource, 'path' => $legacy->path]);
        } else { $request->attributes->remove($key); $request->attributes->remove('_sofinder_asset_operation_current'); }
        $source = is_string($legacy->context['source'] ?? null) ? $legacy->context['source'] : ($phase === 'before' ? $legacy->path : null);
        $record = $this->assetsEnabled ? $this->assets->resolve($workspace->id, $legacy->resource->name, $legacy->path) : null;
        $attributes = array_filter($legacy->context, static fn (mixed $value): bool => is_null($value) || is_scalar($value));
        $this->events->dispatch(new AssetOperationEvent($id, str_replace('trash_', '', $operation), $phase, $workspace, $legacy->resource, $legacy->path, $source, $record?->id, $attributes));
    }

    public function onException(ExceptionEvent $event): void
    {
        $request = $event->getRequest(); $current = $request->attributes->get('_sofinder_asset_operation_current');
        if (!is_array($current) || !$current['workspace'] instanceof \SohoPHP\SoFinder\Value\WorkspaceContext || !$current['resource'] instanceof \SohoPHP\SoFinder\Value\ResourceType) return;
        $exception = $event->getThrowable(); $code = $exception instanceof SoFinderException ? $exception->errorCode : 'operation_failed';
        $this->events->dispatch(new AssetOperationEvent((string) $current['id'], str_replace('trash_', '', (string) $current['operation']), 'failed', $current['workspace'], $current['resource'], (string) $current['path'], (string) $current['path'], null, ['errorCode' => $code]));
        $request->attributes->remove('_sofinder_asset_operation_current');
    }
}
