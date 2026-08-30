<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Security;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\RequestGateStoreInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class RequestGate implements EventSubscriberInterface
{
    /** @param array<string, array{max_requests:int,interval:int,max_concurrent:int}> $limits */
    public function __construct(
        private readonly RequestGateStoreInterface $store,
        private readonly ActorProviderInterface $actors,
        private readonly array $limits,
    ) {
    }

    public function acquire(ControllerEvent $event): void
    {
        $request = $event->getRequest();
        if (!$request->attributes->getBoolean('_sofinder')) {
            return;
        }
        $route = (string) $request->attributes->get('_route', '');
        $group = $this->group($route);
        if ($group === null || !isset($this->limits[$group])) {
            return;
        }
        $limit = $this->limits[$group];
        if ($limit['max_requests'] < 1 && $limit['max_concurrent'] < 1) {
            return;
        }
        $lease = bin2hex(random_bytes(12));
        $now = time();
        $this->store->mutate($group, $this->actors->actorId(), function (array $state) use ($limit, $lease, $now): array {
            $windowStart = (int) ($state['window_start'] ?? $now);
            $count = (int) ($state['count'] ?? 0);
            if ($windowStart + $limit['interval'] <= $now) {
                $windowStart = $now;
                $count = 0;
            }
            $active = is_array($state['active'] ?? null) ? $state['active'] : [];
            $active = array_filter($active, static fn (mixed $started): bool => is_int($started) && $started > $now - 900);
            if ($limit['max_requests'] > 0 && $count >= $limit['max_requests']) {
                throw new SoFinderException('Too many SoFinder requests. Please retry later.', 'rate_limit_exceeded', 429);
            }
            if ($limit['max_concurrent'] > 0 && count($active) >= $limit['max_concurrent']) {
                throw new SoFinderException('Too many concurrent SoFinder operations.', 'concurrency_limit_exceeded', 429);
            }
            $active[$lease] = $now;

            return ['window_start' => $windowStart, 'count' => $count + 1, 'active' => $active];
        });
        $request->attributes->set('_sofinder_gate', [$group, $this->actors->actorId(), $lease]);
    }

    public function release(ResponseEvent $event): void
    {
        $lease = $event->getRequest()->attributes->get('_sofinder_gate');
        if (!is_array($lease) || !isset($lease[0], $lease[1], $lease[2]) || !is_string($lease[0]) || !is_string($lease[1]) || !is_string($lease[2])) {
            return;
        }
        $this->store->mutate($lease[0], $lease[1], static function (array $state) use ($lease): array {
            $active = is_array($state['active'] ?? null) ? $state['active'] : [];
            unset($active[$lease[2]]);
            $state['active'] = $active;

            return $state;
        });
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => ['acquire', 64],
            KernelEvents::RESPONSE => ['release', -64],
        ];
    }

    private function group(string $route): ?string
    {
        return match ($route) {
            'sofinder_api_upload', 'sofinder_api_chunk_upload', 'sofinder_api_chunk_cancel', 'sofinder_quick_upload' => 'upload',
            'sofinder_image_edit', 'sofinder_image_batch' => 'image',
            'sofinder_image_thumbnail' => 'thumbnail',
            'sofinder_archive_download' => 'archive',
            'sofinder_api_copy', 'sofinder_api_move', 'sofinder_api_batch' => 'transfer',
            default => str_starts_with($route, 'sofinder_api_') ? 'normal' : null,
        };
    }

}
