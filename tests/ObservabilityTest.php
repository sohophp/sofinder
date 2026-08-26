<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\MetricsController;
use SohoPHP\SoFinder\Http\RequestIdSubscriber;
use SohoPHP\SoFinder\Observability\LocalMetricsStore;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;

final class ObservabilityTest extends TestCase
{
    private string $file;
    protected function setUp(): void { $this->file = sys_get_temp_dir() . '/sofinder-metrics-' . bin2hex(random_bytes(8)) . '.json'; }
    protected function tearDown(): void { @unlink($this->file); }

    public function testExportsBoundedPrometheusCounters(): void
    {
        $metrics = new LocalMetricsStore($this->file);
        $metrics->increment('sofinder_operations_total', ['operation' => 'upload', 'resource' => 'Files']);
        $metrics->increment('sofinder_operations_total', ['resource' => 'Files', 'operation' => 'upload']);
        $response = (new MetricsController($metrics, new HealthManager([])))();

        self::assertStringContainsString('sofinder_ready 1', (string) $response->getContent());
        self::assertStringContainsString('sofinder_operations_total{operation="upload",resource="Files"} 2', (string) $response->getContent());
        self::assertStringStartsWith('text/plain;', (string) $response->headers->get('Content-Type'));
    }

    public function testAcceptsOnlySafeRequestIdsAndReturnsOneOnResponse(): void
    {
        $kernel = $this->createMock(HttpKernelInterface::class);
        $request = Request::create('/sofinder/api/config', server: ['HTTP_X_REQUEST_ID' => "unsafe\nvalue"]);
        $request->attributes->set('_sofinder', true);
        $subscriber = new RequestIdSubscriber();
        $subscriber->onRequest(new RequestEvent($kernel, $request, HttpKernelInterface::MAIN_REQUEST));
        $response = new Response();
        $subscriber->onResponse(new ResponseEvent($kernel, $request, HttpKernelInterface::MAIN_REQUEST, $response));

        self::assertMatchesRegularExpression('/^[a-f0-9]{32}$/', (string) $response->headers->get('X-Request-ID'));
    }
}
