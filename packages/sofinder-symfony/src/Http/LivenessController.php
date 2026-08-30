<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Http\Action\LivenessAction;
use Symfony\Component\HttpFoundation\JsonResponse;

final class LivenessController
{
    public function __construct(private readonly LivenessAction $action = new LivenessAction())
    {
    }

    public function __invoke(): JsonResponse
    {
        $result = $this->action->execute();

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }
}
