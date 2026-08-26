<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Health\HealthManager;
use Symfony\Component\HttpFoundation\Response;

final readonly class MetricsController
{
    public function __construct(private MetricsStoreInterface $metrics, private HealthManager $health) {}
    public function __invoke(): Response
    {
        $lines = ['# TYPE sofinder_ready gauge', 'sofinder_ready ' . ($this->health->report()['status'] === 'down' ? '0' : '1')];
        $types = [];
        foreach ($this->metrics->snapshot() as $metric) {
            if (!isset($types[$metric['name']])) { $lines[] = '# TYPE ' . $metric['name'] . ' counter'; $types[$metric['name']] = true; }
            $labels = [];
            foreach ($metric['labels'] as $name => $value) $labels[] = $name . '="' . addcslashes($value, "\\\n\r\"") . '"';
            $lines[] = $metric['name'] . ($labels === [] ? '' : '{' . implode(',', $labels) . '}') . ' ' . $metric['value'];
        }
        return new Response(implode("\n", $lines) . "\n", headers: ['Content-Type' => 'text/plain; version=0.0.4; charset=UTF-8', 'Cache-Control' => 'no-store, private']);
    }
}
