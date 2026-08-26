<?php

declare(strict_types=1);

namespace App\Controller;

use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\ContentDisposition;
use SohoPHP\SoFinder\ResourceRegistry;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class HostFileController
{
    public function __construct(private FileManager $files, private ResourceRegistry $resources) {}

    public function output(Request $request, string $resource, string $name): Response
    {
        $path = (string) $request->query->get('path', '');
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory || $entry->name !== $name) {
            throw new NotFoundHttpException();
        }

        if ($request->query->getBoolean('redirect')) {
            $storageEntry = $this->resources->get($resource)->storage->entry($path);
            if ($storageEntry->url !== null && $storageEntry->url !== '') {
                return new RedirectResponse($storageEntry->url);
            }
        }

        $stream = $this->files->read($resource, $path);
        $disposition = $request->query->getString('disposition', 'inline') === 'attachment'
            ? ResponseHeaderBag::DISPOSITION_ATTACHMENT
            : ResponseHeaderBag::DISPOSITION_INLINE;
        $response = new StreamedResponse(static function () use ($stream): void {
            try {
                fpassthru($stream);
            } finally {
                fclose($stream);
            }
        });
        $response->headers->set('Content-Type', $entry->mimeType ?? 'application/octet-stream');
        $response->headers->set('Content-Length', (string) $entry->size);
        $response->headers->set('Content-Disposition', ContentDisposition::make($disposition, $entry->name));
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}
