<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\State\PdoAtomicStateStore;

final class PdoSharedStateDatabaseTest extends TestCase
{
    public function testConfiguredDatabaseSerializesMutationsAcrossProcesses(): void
    {
        $dsn = getenv('SOFINDER_STATE_DSN');
        if (!is_string($dsn) || $dsn === '') {
            self::markTestSkipped('SOFINDER_STATE_DSN is not configured.');
        }
        if (!function_exists('pcntl_fork') || !function_exists('pcntl_waitpid')) {
            self::markTestSkipped('pcntl is required for multi-process integration tests.');
        }

        $user = (string) (getenv('SOFINDER_STATE_USER') ?: '');
        $password = (string) (getenv('SOFINDER_STATE_PASSWORD') ?: '');
        $table = 'sofinder_test_' . bin2hex(random_bytes(6));
        $this->connection($dsn, $user, $password, $table)->install();

        try {
            $children = [];
            for ($worker = 0; $worker < 4; ++$worker) {
                $pid = pcntl_fork();
                if ($pid === -1) {
                    self::fail('Unable to fork a database integration-test worker.');
                }
                if ($pid === 0) {
                    try {
                        $store = $this->connection($dsn, $user, $password, $table);
                        for ($index = 0; $index < 25; ++$index) {
                            $store->mutate('concurrency', 'counter', static fn (array $state): array => [
                                'count' => (int) ($state['count'] ?? 0) + 1,
                            ]);
                        }
                        exit(0);
                    } catch (\Throwable $exception) {
                        fwrite(STDERR, $exception->getMessage() . "\n");
                        exit(1);
                    }
                }
                $children[] = $pid;
            }
            foreach ($children as $pid) {
                pcntl_waitpid($pid, $status);
                self::assertTrue(
                    pcntl_wifexited($status) && pcntl_wexitstatus($status) === 0,
                    sprintf('Database worker %d failed.', $pid),
                );
            }

            self::assertSame(
                100,
                $this->connection($dsn, $user, $password, $table)->get('concurrency', 'counter')['count'] ?? null,
            );
        } finally {
            $pdo = new \PDO($dsn, $user, $password, [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]);
            $pdo->exec('DROP TABLE IF EXISTS ' . $table);
        }
    }

    private function connection(string $dsn, string $user, string $password, string $table): PdoAtomicStateStore
    {
        return new PdoAtomicStateStore(new \PDO($dsn, $user, $password, [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        ]), $table);
    }
}
