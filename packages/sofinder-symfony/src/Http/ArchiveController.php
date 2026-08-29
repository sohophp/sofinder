<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Archive\ArchiveManager;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Http\Action\ArchiveDownloadAction;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

final readonly class ArchiveController
{
    public function __construct(
        private ArchiveManager $archives,
        private CsrfGuard $csrf,
        private ?FeaturePolicy $features = null,
        private ?ArchiveDownloadAction $action = null,
    ) {
    }

    public function __invoke(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        if ($this->action !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->action->assertAllowed($context, $request->request->all());
            try {
                $input = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
            } catch (\JsonException) {
                throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
            }
            if (!is_array($input)) {
                throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
            }

            return SymfonyStreamResponseFactory::create($this->action->execute($context, $input));
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('archive');
        $this->csrf->assertMutation($request);
        try {
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
        }
        $paths = is_array($data) ? ($data['paths'] ?? null) : null;
        if (!is_array($paths) || array_filter($paths, static fn (mixed $path): bool => !is_string($path)) !== []) {
            throw new SoFinderException('Archive paths must be an array of strings.', 'invalid_archive_selection', 400);
        }
        $archive = $this->archives->create((string) ($data['resource'] ?? 'Files'), array_values($paths));
        $response = new BinaryFileResponse($archive);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'sofinder-download.zip');
        $response->headers->set('Content-Type', 'application/zip');
        $response->headers->set('Cache-Control', 'private, no-store');
        $response->deleteFileAfterSend(true);

        return $response;
    }
}
