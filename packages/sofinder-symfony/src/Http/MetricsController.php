<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\Action\MetricsAction;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use Symfony\Component\HttpFoundation\Response;

final class MetricsController
{
    public function __construct(
        private readonly MetricsStoreInterface $metrics,
        private readonly HealthManager $health,
        private readonly ?MetricsAction $action = null,
    ) {
    }

    public function __invoke(): Response
    {
        if ($this->action !== null) {
            return SymfonyStreamResponseFactory::create($this->action->execute());
        }
        $lines = ['# TYPE sofinder_ready gauge', 'sofinder_ready ' . ($this->health->report()['status'] === 'down' ? '0' : '1')];
        $types = [];
        foreach ($this->metrics->snapshot() as $metric) {
            if (!isset($types[$metric['name']])) { $lines[] = '# TYPE ' . $metric['name'] . (in_array($metric['name'], ['sofinder_queue_backlog', 'sofinder_queue_failed'], true) ? ' gauge' : ' counter'); $types[$metric['name']] = true; }
            $labels = [];
            foreach ($metric['labels'] as $name => $value) $labels[] = $name . '="' . addcslashes($value, "\\\n\r\"") . '"';
            $lines[] = $metric['name'] . ($labels === [] ? '' : '{' . implode(',', $labels) . '}') . ' ' . $metric['value'];
        }
        return new Response(implode("\n", $lines) . "\n", headers: ['Content-Type' => 'text/plain; version=0.0.4; charset=UTF-8', 'Cache-Control' => 'no-store, private']);
    }
}
