<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Preview;

final readonly class DocumentPreviewMessageHandler
{
    public function __construct(private DocumentPreviewJobManager $jobs) {}

    public function __invoke(DocumentPreviewMessage $message): void
    {
        $this->jobs->run($message->jobId);
    }
}
