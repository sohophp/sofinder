<?php

declare(strict_types=1);

namespace App\Controller;

use SohoPHP\SoFinder\FileManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final readonly class PluginInspectorController
{
    public function __construct(private FileManager $files) {}

    public function __invoke(Request $request): Response
    {
        $resource = $request->query->getString('resource', 'Files');
        $path = $request->query->getString('path');

        // Browser capability flags are advisory. Every plugin route must authorize again.
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory) {
            return new Response('A file selection is required.', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $escape = static fn (?string $value): string => htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $html = sprintf(
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SoFinder plugin inspector</title><style>body{font:16px/1.55 system-ui;max-width:48rem;margin:3rem auto;padding:0 1.25rem;color:#172033}dl{display:grid;grid-template-columns:9rem 1fr;gap:.65rem 1rem;padding:1.25rem;border:1px solid #dce2eb;border-radius:12px}dt{font-weight:650}dd{margin:0;overflow-wrap:anywhere}</style><h1>File inspector plugin</h1><p>This host route resolved and authorized the selected entry through <code>FileManager</code>.</p><dl><dt>Resource</dt><dd>%s</dd><dt>Path</dt><dd>%s</dd><dt>MIME type</dt><dd>%s</dd><dt>Size</dt><dd>%d bytes</dd></dl></html>',
            $escape($resource),
            $escape($entry->path),
            $escape($entry->mimeType),
            $entry->size,
        );
        $response = new Response($html);
        $response->headers->set('Content-Type', 'text/html; charset=UTF-8');
        $response->headers->set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}
