<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;

final class DocumentPreviewJobController
{
    public function __construct(private readonly DocumentPreviewJobManager $jobs, private readonly CsrfGuard $csrf, private readonly RouterInterface $router, private readonly ?FeaturePolicy $features = null, private readonly ?DocumentPreviewJobActions $actions = null) {}

    public function create(Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->create->assertAllowed($context, $request->request->all());
            try { $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR); } catch (\JsonException) { throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400); }
            if (!is_array($data)) throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
            $result = $this->actions->create->execute($context, $data);
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('document_preview'); $this->csrf->assertMutation($request);
        try { $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR); } catch (\JsonException) { throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400); }
        if (!is_array($data)) throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
        $job = $this->withUrl($this->jobs->prepare((string) ($data['resource'] ?? 'Files'), (string) ($data['path'] ?? ''), ($data['retry'] ?? false) === true));
        return new JsonResponse(OperationResult::success($job), in_array($job['status'], ['ready', 'failed', 'expired'], true) ? 200 : 202, $job['retryAfter'] > 0 ? ['Retry-After' => (string) $job['retryAfter']] : []);
    }

    public function status(string $id, Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $result = $this->actions->status->execute(SymfonyRequestContextProvider::fromRequest($request), ['id' => $id]);
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('document_preview');
        $job = $this->withUrl($this->jobs->status($id));
        return new JsonResponse(OperationResult::success($job), in_array($job['status'], ['ready', 'failed', 'expired'], true) ? 200 : 202, $job['retryAfter'] > 0 ? ['Retry-After' => (string) $job['retryAfter']] : []);
    }

    /**
     * @param array<string,mixed> $job
     * @return array<string,mixed>
     */
    private function withUrl(array $job): array
    {
        $job['previewUrl'] = $job['status'] === 'ready' ? $this->router->generate('sofinder_document_preview', ['resource' => $job['resource'], 'path' => $job['path']]) : null;
        return $job;
    }
}
