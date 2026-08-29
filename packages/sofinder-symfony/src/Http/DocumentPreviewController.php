<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewAction;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

final readonly class DocumentPreviewController
{
    public function __construct(private DocumentPreviewManager $previews, private ?FeaturePolicy $features = null, private ?DocumentPreviewJobManager $jobs = null, private ?DocumentPreviewAction $action = null) {}

    public function __invoke(Request $request): Response
    {
        if ($this->action !== null) return SymfonyStreamResponseFactory::create($this->action->execute(SymfonyRequestContextProvider::fromRequest($request)));
        ($this->features ?? new FeaturePolicy())->assertEnabled('document_preview');
        $resource = $request->query->getString('resource', 'Files'); $path = $request->query->getString('path');
        $description = $this->previews->describe($resource, $path);
        if ($description['source'] === 'office' && !$description['cached'] && $this->jobs?->asynchronous()) throw new SoFinderException('The Office preview is still being prepared.', 'document_preview_pending', 202);
        $preview = $this->previews->preview($resource, $path);
        $response = new BinaryFileResponse($preview['file']);
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', ContentDisposition::make(ResponseHeaderBag::DISPOSITION_INLINE, $preview['name']));
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Content-Security-Policy', "default-src 'none'; sandbox");
        $response->setPrivate();

        return $response;
    }
}
