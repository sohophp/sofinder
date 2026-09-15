<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Contract\MetricsStoreInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class FailureAuditSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly LoggerInterface $logger, private readonly ?MetricsStoreInterface $metrics = null)
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
            'operation_context' => $this->operationContext($request),
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

    /** @return array<string, mixed> */
    private function operationContext(\Symfony\Component\HttpFoundation\Request $request): array
    {
        $input = $request->request->all();
        if (str_contains((string) $request->headers->get('Content-Type'), 'application/json')) {
            try {
                $decoded = json_decode($request->getContent(), true, 32, JSON_THROW_ON_ERROR);
                if (is_array($decoded)) $input = $decoded;
            } catch (\JsonException) {
                // The response handler reports invalid JSON; audit only safe request metadata.
            }
        }
        $context = [];
        foreach (['resource', 'operation', 'destination'] as $key) {
            if (isset($input[$key]) && is_scalar($input[$key])) $context[$key] = mb_substr((string) $input[$key], 0, 160);
        }
        $paths = isset($input['paths']) && is_array($input['paths']) ? $input['paths'] : (isset($input['path']) ? [$input['path']] : []);
        $names = array_values(array_filter(array_map(fn (mixed $path): ?string => is_scalar($path) ? $this->safeName((string) $path) : null, array_slice($paths, 0, 20))));
        foreach ($request->files->all() as $file) {
            foreach (is_array($file) ? $file : [$file] as $upload) {
                if ($upload instanceof UploadedFile) $names[] = $this->safeName($upload->getClientOriginalName());
            }
        }
        if ($names !== []) {
            $context['item_count'] = count($paths) ?: count($names);
            $context['item_names'] = array_values(array_unique(array_slice($names, 0, 20)));
        }
        return $context;
    }

    private function safeName(string $path): string
    {
        $name = basename(str_replace('\\', '/', $path));
        return mb_substr(preg_replace('/[\x00-\x1F\x7F]/u', '', $name) ?? '', 0, 180);
    }
}
