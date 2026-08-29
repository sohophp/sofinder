<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Queue;

use Illuminate\Contracts\Queue\ShouldQueue;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;

final class LaravelDocumentPreviewJob implements ShouldQueue
{
    public function __construct(public readonly string $jobId)
    {
        if ($jobId === '' || strlen($jobId) > 128) {
            throw new \InvalidArgumentException('The document preview job id is invalid.');
        }
    }

    public function handle(DocumentPreviewJobManager $jobs): void
    {
        $jobs->run($this->jobId);
    }
}
