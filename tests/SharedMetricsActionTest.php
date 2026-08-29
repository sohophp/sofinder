<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\Action\MetricsAction;
use SohoPHP\SoFinder\Http\MetricsController;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;

final class SharedMetricsActionTest extends TestCase
{
    public function testSymfonyAndPsrMetricsResponsesMatch(): void
    {
        $metrics = new class implements MetricsStoreInterface {
            public function increment(string $name, array $labels = [], int $amount = 1): void
            {
            }

            public function snapshot(): array
            {
                return [
                    ['name' => 'sofinder_requests_total', 'labels' => ['route' => 'files"list'], 'value' => 7],
                    ['name' => 'sofinder_queue_backlog', 'labels' => [], 'value' => 2],
                ];
            }
        };
        $health = new HealthManager([]);
        $action = new MetricsAction($metrics, $health);
        $symfony = (new MetricsController($metrics, $health, $action))();
        ob_start();
        $symfony->sendContent();
        $body = ob_get_clean();

        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', '/metrics'));

        self::assertSame($body, (string) $psr->getBody());
        self::assertSame($symfony->headers->get('Content-Type'), $psr->getHeaderLine('Content-Type'));
        self::assertSame('no-store, private', $psr->getHeaderLine('Cache-Control'));
        self::assertStringContainsString('sofinder_ready 1', (string) $body);
        self::assertStringContainsString('route="files\\"list"', (string) $body);
        self::assertStringContainsString('# TYPE sofinder_queue_backlog gauge', (string) $body);
    }
}
