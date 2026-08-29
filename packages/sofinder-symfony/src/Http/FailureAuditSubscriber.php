<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class FailureAuditSubscriber implements EventSubscriberInterface
{
    public function __construct(private LoggerInterface $logger, private ?MetricsStoreInterface $metrics = null)
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
            'request_id' => (string) $request->attributes->get('_sofinder_request_id', ''),
            'exception' => $exception,
        ]);
        $this->metrics?->increment('sofinder_failures_total', [
            'route' => (string) $request->attributes->get('_route', 'unknown'),
            'code' => $exception instanceof SoFinderException ? $exception->errorCode : 'internal_error',
        ]);
        $route = (string) $request->attributes->get('_route', 'unknown');
        $code = $exception instanceof SoFinderException ? $exception->errorCode : 'internal_error';
        if (str_contains($route, 'upload')) {
            $this->metrics?->increment('sofinder_upload_failures_total', ['route' => $route, 'code' => $code]);
        }
        if (in_array($code, ['rate_limit_exceeded', 'concurrency_limit_exceeded'], true)) {
            $this->metrics?->increment('sofinder_rate_limit_rejections_total', ['route' => $route, 'code' => $code]);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => ['onException', 64]];
    }
}
