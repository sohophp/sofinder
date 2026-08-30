<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Cache\Repository;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Contracts\Cache\LockTimeoutException;
use SohoPHP\SoFinder\Contract\AtomicStateStoreInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;

/** Uses the host's configured Laravel cache store and distributed locks. */
final class LaravelCacheAtomicStateStore implements AtomicStateStoreInterface
{
    private readonly LockProvider $locks;

    public function __construct(
        private readonly Repository $cache,
        private readonly string $prefix = 'sofinder:',
        private readonly int $lockSeconds = 60,
        private readonly int $waitSeconds = 2,
    ) {
        $store = $cache->getStore();
        if (!$store instanceof LockProvider) {
            throw new \InvalidArgumentException('The configured Laravel cache store must support atomic locks.');
        }
        if ($prefix === '' || strlen($prefix) > 128 || $lockSeconds < 1 || $waitSeconds < 0) {
            throw new \InvalidArgumentException('The SoFinder Laravel cache state settings are invalid.');
        }

        $this->locks = $store;
    }

    public function get(string $namespace, string $key): array
    {
        $stateKey = $this->key($namespace, $key);
        try {
            $value = $this->cache->get($stateKey);
        } catch (\Throwable $exception) {
            throw new SoFinderException('The Laravel cache state is unavailable.', 'shared_state_unavailable', 503, $exception);
        }
        if ($value === null) {
            return [];
        }
        if (!is_array($value)) {
            throw new SoFinderException('The Laravel cache state is corrupted.', 'shared_state_corrupted', 500);
        }

        return $value;
    }

    public function mutate(string $namespace, string $key, callable $callback): array
    {
        $stateKey = $this->key($namespace, $key);
        $lock = $this->locks->lock($stateKey . ':lock', $this->lockSeconds);
        try {
            return $lock->block($this->waitSeconds, function () use ($stateKey, $callback): array {
                $current = $this->cache->get($stateKey);
                if ($current !== null && !is_array($current)) {
                    throw new SoFinderException('The Laravel cache state is corrupted.', 'shared_state_corrupted', 500);
                }
                $state = $callback(is_array($current) ? $current : []);
                if (!is_array($state)) {
                    throw new \LogicException('An atomic state mutation must return an array.');
                }
                if (!$this->cache->forever($stateKey, $state)) {
                    throw new SoFinderException('The Laravel cache state could not be saved.', 'shared_state_unavailable', 503);
                }

                return $state;
            });
        } catch (LockTimeoutException $exception) {
            throw new SoFinderException('The Laravel cache state is busy.', 'shared_state_unavailable', 503, $exception);
        } catch (SoFinderException|\InvalidArgumentException|\LogicException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw new SoFinderException('The Laravel cache state is unavailable.', 'shared_state_unavailable', 503, $exception);
        }
    }

    private function key(string $namespace, string $key): string
    {
        if (preg_match('/^[a-z][a-z0-9._-]{1,63}$/D', $namespace) !== 1) {
            throw new \InvalidArgumentException('The shared state namespace is invalid.');
        }

        return $this->prefix . $namespace . ':' . hash('sha256', $key);
    }
}
