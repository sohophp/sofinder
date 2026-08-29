<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Contract\MalwareScanStatusStoreInterface;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\Http\Action\SecurityStatusAction;
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
        private ?DocumentPreviewManager $documentPreviews = null,
        private ?DocumentPreviewJobManager $documentPreviewJobs = null,
        private ?SecurityStatusAction $action = null,
    ) {
    }

    public function __invoke(): JsonResponse
    {
        if ($this->action !== null) {
            $result = $this->action->execute();
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('security_status');
        if ($this->roles !== [] && ($this->authorization === null || !array_filter($this->roles, $this->authorization->isGranted(...)))) {
            throw new AccessDeniedHttpException('The security status requires an administrator role.');
        }
        $health = $this->scanner?->check();
        $report = $this->scans->report();

        $document = $this->documentPreviews?->diagnostics();
        $jobs = $this->documentPreviewJobs?->diagnostics();
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
            'documentPreview' => $document === null ? null : [...$document, ...($jobs ?? [])],
        ]]);
    }
}
