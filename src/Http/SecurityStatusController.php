<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Contract\MalwareScanStatusStoreInterface;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final readonly class SecurityStatusController
{
    public function __construct(
        private bool $enabled,
        private MalwareScanStatusStoreInterface $scans,
        private ?ClamAvScanner $scanner = null,
        private ?AuthorizationCheckerInterface $authorization = null,
        /** @var list<string> */ private array $roles = [],
        private ?FeaturePolicy $features = null,
    ) {
    }

    public function __invoke(): JsonResponse
    {
        ($this->features ?? new FeaturePolicy())->assertEnabled('security_status');
        if ($this->roles !== [] && ($this->authorization === null || !array_filter($this->roles, $this->authorization->isGranted(...)))) {
            throw new AccessDeniedHttpException('The security status requires an administrator role.');
        }
        $health = $this->scanner?->check();
        $report = $this->scans->report();

        return new JsonResponse(['success' => true, 'data' => [
            'malwareScanning' => [
                'enabled' => $this->enabled,
                'provider' => $this->enabled ? 'clamav' : null,
                'status' => !$this->enabled ? 'disabled' : ($health === null ? 'down' : $health->status),
                'message' => !$this->enabled ? 'Malware scanning is not enabled.' : ($health === null ? 'ClamAV is unavailable.' : $health->message),
                'counts' => $report['counts'],
                'recent' => $report['recent'],
                'mode' => $report['mode'],
                'lastSuccessfulAt' => $report['lastSuccessfulAt'],
            ],
        ]]);
    }
}
