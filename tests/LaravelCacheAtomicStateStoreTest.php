<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Illuminate\Cache\ArrayStore;
use Illuminate\Cache\Repository;
use Illuminate\Contracts\Cache\Store;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Laravel\LaravelCacheAtomicStateStore;

final class LaravelCacheAtomicStateStoreTest extends TestCase
{
    public function testStateIsPersistedThroughTheLaravelRepositoryUnderAnAtomicLock(): void
    {
        $repository = new Repository(new ArrayStore(serializesValues: true));
        $first = new LaravelCacheAtomicStateStore($repository, 'tenant-a:');
        $second = new LaravelCacheAtomicStateStore($repository, 'tenant-a:');

        self::assertSame([], $first->get('metrics', 'global'));
        self::assertSame(['count' => 1], $first->mutate('metrics', 'global', static fn (array $state): array => [
            'count' => (int) ($state['count'] ?? 0) + 1,
        ]));
        self::assertSame(['count' => 2], $second->mutate('metrics', 'global', static fn (array $state): array => [
            'count' => (int) ($state['count'] ?? 0) + 1,
        ]));
        self::assertSame(['count' => 2], $first->get('metrics', 'global'));
    }

    public function testInvalidNamespacesAndCorruptedValuesFailClosed(): void
    {
        $repository = new Repository(new ArrayStore());
        $state = new LaravelCacheAtomicStateStore($repository);

        $this->expectException(\InvalidArgumentException::class);
        $state->get('INVALID', 'key');
    }

    public function testCorruptedCacheValueUsesTheSharedErrorContract(): void
    {
        $repository = new Repository(new ArrayStore());
        $repository->forever('sofinder:metrics:' . hash('sha256', 'global'), 'not-an-array');
        $state = new LaravelCacheAtomicStateStore($repository);

        try {
            $state->get('metrics', 'global');
            self::fail('A corrupted Laravel cache value must not be treated as empty state.');
        } catch (SoFinderException $exception) {
            self::assertSame('shared_state_corrupted', $exception->errorCode);
            self::assertSame(500, $exception->httpStatus);
        }
    }

    public function testCacheDriversWithoutAtomicLocksAreRejectedAtBootstrap(): void
    {
        $store = new class implements Store {
            public function get($key): mixed { return null; }
            public function many(array $keys): array { return []; }
            public function put($key, $value, $seconds): bool { return true; }
            public function putMany(array $values, $seconds): bool { return true; }
            public function increment($key, $value = 1): int|bool { return false; }
            public function decrement($key, $value = 1): int|bool { return false; }
            public function forever($key, $value): bool { return true; }
            public function forget($key): bool { return true; }
            public function flush(): bool { return true; }
            public function getPrefix(): string { return ''; }
        };

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('must support atomic locks');
        new LaravelCacheAtomicStateStore(new Repository($store));
    }
}
