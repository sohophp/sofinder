<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

final readonly class DocumentPreviewController
{
    public function __construct(private DocumentPreviewManager $previews, private ?FeaturePolicy $features = null) {}

    public function __invoke(Request $request): BinaryFileResponse
    {
        ($this->features ?? new FeaturePolicy())->assertEnabled('document_preview');
        $preview = $this->previews->preview($request->query->getString('resource', 'Files'), $request->query->getString('path'));
        $response = new BinaryFileResponse($preview['file']);
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', ContentDisposition::make(ResponseHeaderBag::DISPOSITION_INLINE, $preview['name']));
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Content-Security-Policy', "default-src 'none'; sandbox");
        $response->setPrivate();

        return $response;
    }
}
