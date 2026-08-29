<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Queue;

use Illuminate\Contracts\Bus\Dispatcher;
use SohoPHP\SoFinder\Preview\DocumentPreviewMessage;

/** Translates the shared preview message into a self-handling Laravel queue job. */
final readonly class LaravelDocumentPreviewDispatcher
{
    public function __construct(private Dispatcher $bus)
    {
    }

    public function dispatch(object $message): mixed
    {
        if (!$message instanceof DocumentPreviewMessage) {
            throw new \InvalidArgumentException('The Laravel preview dispatcher only accepts document preview messages.');
        }

        return $this->bus->dispatch(new LaravelDocumentPreviewJob($message->jobId));
    }
}
