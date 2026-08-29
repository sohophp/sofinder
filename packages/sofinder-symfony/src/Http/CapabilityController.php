<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Http\Action\CapabilityAction;
use SohoPHP\SoFinder\Value\CapabilityCatalog;
use Symfony\Component\HttpFoundation\JsonResponse;

final class CapabilityController
{
    private readonly CapabilityAction $action;

    public function __construct(CapabilityAction|CapabilityCatalog $action)
    {
        $this->action = $action instanceof CapabilityAction ? $action : new CapabilityAction($action);
    }

    public function __invoke(): JsonResponse
    {
        $result = $this->action->execute();

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }
}
