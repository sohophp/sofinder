<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Health\HealthManager;
use Symfony\Component\HttpFoundation\JsonResponse;

final readonly class HealthController
{
    public function __construct(private HealthManager $health)
    {
    }

    public function __invoke(): JsonResponse
    {
        $report = $this->health->report();

        return new JsonResponse([
            'success' => $report['status'] !== 'down',
            'data' => $report,
        ], $report['status'] === 'down' ? 503 : 200);
    }
}
