<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\HealthController;
use SohoPHP\SoFinder\Value\HealthCheckResult;

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
}
