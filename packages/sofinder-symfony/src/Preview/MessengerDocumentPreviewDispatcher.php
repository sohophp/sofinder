<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Preview;

use SohoPHP\SoFinder\Contract\DocumentPreviewDispatcherInterface;

final readonly class MessengerDocumentPreviewDispatcher implements DocumentPreviewDispatcherInterface
{
    public function __construct(private ?object $bus)
    {
    }

    public function available(): bool
    {
        return $this->bus !== null && is_callable([$this->bus, 'dispatch']);
    }

    public function dispatch(DocumentPreviewMessage $message): void
    {
        $dispatch = $this->bus === null ? null : [$this->bus, 'dispatch'];
        if (!is_callable($dispatch)) {
            throw new \LogicException('The configured Symfony Messenger bus cannot dispatch document preview messages.');
        }

        $dispatch($message);
    }
}
