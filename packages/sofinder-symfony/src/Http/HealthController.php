<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\Action\HealthAction;
use Symfony\Component\HttpFoundation\JsonResponse;

final class HealthController
{
    private readonly HealthAction $action;

    public function __construct(HealthAction|HealthManager $action)
    {
        $this->action = $action instanceof HealthAction ? $action : new HealthAction($action);
    }

    public function __invoke(): JsonResponse
    {
        $result = $this->action->execute();

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }
}
