<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Preview;

final readonly class DocumentPreviewMessage
{
    public function __construct(public string $jobId) {}
}
