<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => ['onException', 32]];
    }

    public function onException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        if (!$exception instanceof SoFinderException || !$event->getRequest()->attributes->getBoolean('_sofinder')) {
            return;
        }
        $response = new JsonResponse(
            OperationResult::failure($exception->errorCode, $exception->getMessage()),
            $exception->httpStatus,
        );
        if ($exception->httpStatus === 429) {
            $response->headers->set('Retry-After', '2');
        }
        if ($exception->httpStatus === 202 && $exception->errorCode === 'document_preview_pending') {
            $response->headers->set('Retry-After', '1');
        }
        $event->setResponse($response);
    }
}
