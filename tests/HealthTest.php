<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Contract\QueueHealthProviderInterface;
use SohoPHP\SoFinder\Contract\QueueTelemetryProviderInterface;
use SohoPHP\SoFinder\Observability\LocalMetricsStore;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\HealthController;
use SohoPHP\SoFinder\Http\LivenessController;
use SohoPHP\SoFinder\Value\HealthCheckResult;
use SohoPHP\SoFinder\Health\MaintenanceQueueHealthCheck;

final class HealthTest extends TestCase
{
    public function testAggregatesReadinessWithoutExposingExceptions(): void
    {
        $checks = [
            new class implements HealthCheckInterface { public function check(): HealthCheckResult { return new HealthCheckResult('runtime', 'ready', 'Ready.'); } },
            new class implements HealthCheckInterface { public function check(): HealthCheckResult { throw new \RuntimeException('/secret/path'); } },
        ];
        $response = (new HealthController(new HealthManager($checks)))();
        $payload = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(503, $response->getStatusCode());
        self::assertFalse($payload['success']);
        self::assertSame('down', $payload['data']['status']);
        self::assertStringNotContainsString('/secret/path', (string) $response->getContent());
    }

    public function testDegradedHealthRemainsAvailable(): void
    {
        $check = new class implements HealthCheckInterface { public function check(): HealthCheckResult { return new HealthCheckResult('scanner', 'degraded', 'Scanner is optional.'); } };
        $response = (new HealthController(new HealthManager([$check])))();

        self::assertSame(200, $response->getStatusCode());
        self::assertSame('degraded', json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR)['data']['status']);
    }

    public function testMessengerModeReportsAMissingDispatcher(): void
    {
        $result = (new MaintenanceQueueHealthCheck('messenger', false))->check();
        self::assertSame('maintenance-queue', $result->name);
        self::assertSame('down', $result->status);
    }

    public function testLivenessOnlyReportsTheInitializedRuntime(): void
    {
        $response = (new LivenessController())();
        $payload = json_decode((string) $response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(200, $response->getStatusCode());
        self::assertTrue($payload['success']);
        self::assertSame('ready', $payload['data']['status']);
        self::assertSame(['status'], array_keys($payload['data']));
    }

    public function testMessengerWithoutAProviderIsDegradedAndProviderResultIsUsed(): void
    {
        self::assertSame('degraded', (new MaintenanceQueueHealthCheck('messenger', true))->check()->status);
        $provider = new class implements QueueHealthProviderInterface {
            public function checkQueue(): HealthCheckResult { return new HealthCheckResult('maintenance-queue', 'ready', 'Connected; backlog 3, failed 0.'); }
        };
        $result = (new MaintenanceQueueHealthCheck('messenger', true, [$provider]))->check();
        self::assertSame('ready', $result->status);
        self::assertStringContainsString('backlog 3', $result->message);
    }

    public function testQueueProviderExportsBacklogAndFailedTaskGauges(): void
    {
        $file = sys_get_temp_dir() . '/sofinder-queue-metrics-' . bin2hex(random_bytes(8)) . '.json';
        $metrics = new LocalMetricsStore($file);
        $provider = new class implements QueueTelemetryProviderInterface {
            public function checkQueue(): HealthCheckResult { return new HealthCheckResult('maintenance-queue', 'degraded', 'Queue has failures.'); }
            public function queueTelemetry(): array { return ['backlog' => 12, 'failed' => 2]; }
        };
        try {
            (new MaintenanceQueueHealthCheck('messenger', true, [$provider], $metrics))->check();
            $values = array_column($metrics->snapshot(), 'value', 'name');
            self::assertSame(12, $values['sofinder_queue_backlog']);
            self::assertSame(2, $values['sofinder_queue_failed']);
        } finally { @unlink($file); }
    }
}
