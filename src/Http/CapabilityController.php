<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Value\CapabilityCatalog;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\JsonResponse;

final readonly class CapabilityController
{
    public function __construct(private CapabilityCatalog $catalog) {}

    public function __invoke(): JsonResponse
    {
        return new JsonResponse(OperationResult::success($this->catalog->jsonSerialize()));
    }
}
