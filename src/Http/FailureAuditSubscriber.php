<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class FailureAuditSubscriber implements EventSubscriberInterface
{
    public function __construct(private LoggerInterface $logger)
    {
    }

    public function onException(ExceptionEvent $event): void
    {
        $request = $event->getRequest();
        if (!$request->attributes->getBoolean('_sofinder')) {
            return;
        }
        $exception = $event->getThrowable();
        $this->logger->warning('SoFinder request failed.', [
            'route' => (string) $request->attributes->get('_route', ''),
            'method' => $request->getMethod(),
            'status' => $exception instanceof SoFinderException ? $exception->httpStatus : 500,
            'error_code' => $exception instanceof SoFinderException ? $exception->errorCode : 'internal_error',
            'request_ip' => $request->getClientIp(),
            'exception' => $exception,
        ]);
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => ['onException', 64]];
    }
}
