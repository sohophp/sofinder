<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Queue;

use Illuminate\Contracts\Bus\Dispatcher;
use SohoPHP\SoFinder\Contract\DocumentPreviewDispatcherInterface;
use SohoPHP\SoFinder\Preview\DocumentPreviewMessage;

/** Translates the shared preview message into a self-handling Laravel queue job. */
final class LaravelDocumentPreviewDispatcher implements DocumentPreviewDispatcherInterface
{
    public function __construct(private readonly Dispatcher $bus)
    {
    }

    public function available(): bool
    {
        return true;
    }

    public function dispatch(DocumentPreviewMessage $message): void
    {
        $this->bus->dispatch(new LaravelDocumentPreviewJob($message->jobId));
    }
}
