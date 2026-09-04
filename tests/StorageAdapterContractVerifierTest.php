<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Testing\StorageAdapterContractVerifier;

final class StorageAdapterContractVerifierTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/sofinder-contract-verifier-' . bin2hex(random_bytes(6));
    }

    protected function tearDown(): void
    {
        if (is_dir($this->root)) {
            @rmdir($this->root);
        }
    }

    public function testPublicVerifierExercisesAndCleansAnAdapter(): void
    {
        $adapter = new LocalStorageAdapter($this->root);

        StorageAdapterContractVerifier::verify($adapter, 'sofinder-contract-0123456789abcdef');

        self::assertSame([], array_values(array_diff(scandir($this->root) ?: [], ['.', '..'])));
    }

    public function testVerifierRejectsAnUnsafeSharedNamespace(): void
    {
        $adapter = new LocalStorageAdapter($this->root);

        $this->expectException(\InvalidArgumentException::class);
        StorageAdapterContractVerifier::verify($adapter, 'uploads');
    }
}
