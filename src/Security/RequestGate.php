<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Security;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class RequestGate implements EventSubscriberInterface
{
    /** @param array<string, array{max_requests:int,interval:int,max_concurrent:int}> $limits */
    public function __construct(
        private string $directory,
        private ActorProviderInterface $actors,
        private array $limits,
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
        if (!is_dir($this->directory) && !@mkdir($this->directory, 0770, true) && !is_dir($this->directory)) {
            throw new SoFinderException('The request limiter is unavailable.', 'rate_limiter_unavailable', 503);
        }
        $actor = hash('sha256', $this->actors->actorId());
        $file = rtrim($this->directory, '/') . '/' . $group . '-' . $actor . '.json';
        $lease = bin2hex(random_bytes(12));
        $now = time();
        $this->update($file, function (array $state) use ($limit, $lease, $now): array {
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
        $request->attributes->set('_sofinder_gate', [$file, $lease]);
    }

    public function release(ResponseEvent $event): void
    {
        $lease = $event->getRequest()->attributes->get('_sofinder_gate');
        if (!is_array($lease) || !isset($lease[0], $lease[1]) || !is_string($lease[0]) || !is_string($lease[1])) {
            return;
        }
        $this->update($lease[0], static function (array $state) use ($lease): array {
            $active = is_array($state['active'] ?? null) ? $state['active'] : [];
            unset($active[$lease[1]]);
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
            'sofinder_image_edit', 'sofinder_image_thumbnail' => 'image',
            'sofinder_archive_download' => 'archive',
            'sofinder_api_copy', 'sofinder_api_move', 'sofinder_api_batch' => 'transfer',
            default => str_starts_with($route, 'sofinder_api_') ? 'normal' : null,
        };
    }

    /**
     * @param callable(array<string,mixed>):array<string,mixed> $callback
     */
    private function update(string $file, callable $callback): void
    {
        $stream = @fopen($file, 'c+b');
        if ($stream === false || !flock($stream, LOCK_EX)) {
            if (is_resource($stream)) {
                fclose($stream);
            }
            throw new SoFinderException('The request limiter is unavailable.', 'rate_limiter_unavailable', 503);
        }
        try {
            $json = stream_get_contents($stream);
            $decoded = $json === false || $json === '' ? [] : json_decode($json, true);
            $state = is_array($decoded) ? $decoded : [];
            $state = $callback($state);
            rewind($stream);
            if (!ftruncate($stream, 0) || fwrite($stream, json_encode($state, JSON_THROW_ON_ERROR)) === false || !fflush($stream)) {
                throw new SoFinderException('The request limiter state could not be saved.', 'rate_limiter_unavailable', 503);
            }
        } finally {
            flock($stream, LOCK_UN);
            fclose($stream);
        }
    }
}
