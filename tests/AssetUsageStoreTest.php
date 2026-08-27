<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\JsonAssetUsageStore;
use SohoPHP\SoFinder\Asset\SharedAssetUsageStore;
use SohoPHP\SoFinder\Contract\AssetUsageStoreInterface;
use SohoPHP\SoFinder\Contract\AtomicStateStoreInterface;

final class AssetUsageStoreTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-asset-usage-' . bin2hex(random_bytes(5)); mkdir($this->directory, 0777, true);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $file) if (is_file($file)) unlink($file); @rmdir($this->directory);
    }

    public function testLocalStoreUpsertsListsAndRemovesWorkspaceScopedReferences(): void
    {
        $store = new JsonAssetUsageStore($this->directory . '/usages.json'); $this->exercise($store);
        self::assertSame([], $store->list('another-workspace', 'asset-1'));
    }

    public function testSharedStoreHasTheSameContract(): void
    {
        $state = new class implements AtomicStateStoreInterface {
            /** @var array<string,array<string,mixed>> */ private array $values = [];
            public function get(string $namespace, string $key): array { return $this->values[$namespace . ':' . $key] ?? []; }
            public function mutate(string $namespace, string $key, callable $callback): array { $index = $namespace . ':' . $key; return $this->values[$index] = $callback($this->values[$index] ?? []); }
        };
        $this->exercise(new SharedAssetUsageStore($state));
    }

    private function exercise(AssetUsageStoreInterface $store): void
    {
        $first = $store->put('main', 'asset-1', 'article:42', 'Article 42', '/admin/articles/42', 'body');
        self::assertSame('article:42', $first['referenceId']); self::assertSame('Article 42', $first['label']);
        $updated = $store->put('main', 'asset-1', 'article:42', 'Renamed article', null, 'hero');
        self::assertSame('Renamed article', $updated['label']); self::assertSame('hero', $updated['context']);
        self::assertCount(1, $store->list('main', 'asset-1'));
        $store->remove('main', 'asset-1', 'article:42'); self::assertSame([], $store->list('main', 'asset-1'));
    }
}
