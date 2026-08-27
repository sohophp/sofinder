<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Symfony\Component\HttpFoundation\JsonResponse;

final readonly class LivenessController
{
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['success' => true, 'data' => ['status' => 'ready']]);
    }
}
