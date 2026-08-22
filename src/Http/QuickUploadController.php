<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final readonly class QuickUploadController
{
    public function __construct(
        private FileManager $files,
        private CsrfGuard $csrf,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $this->csrf->assertCompatibleUpload($request);
        $uploaded = $request->files->get('upload');
        if (!$uploaded instanceof UploadedFile || !$uploaded->isValid()) {
            throw new SoFinderException('No valid uploaded file was received.', 'invalid_upload', 400);
        }
        $stream = fopen($uploaded->getPathname(), 'rb');
        if ($stream === false) {
            throw new SoFinderException('Unable to read the uploaded file.', 'invalid_upload', 400);
        }
        try {
            $entry = $this->files->upload(
                (string) $request->query->get('type', 'Files'),
                (string) $request->query->get('currentFolder', ''),
                $uploaded->getClientOriginalName(),
                (int) $uploaded->getSize(),
                $stream,
            );
        } finally {
            fclose($stream);
        }
        $url = $entry->url ?? '';
        $function = (int) $request->query->get('CKEditorFuncNum', $request->request->get('CKEditorFuncNum', 0));
        $expectsJson = strtolower((string) $request->query->get('responseType', '')) === 'json'
            || $request->isXmlHttpRequest()
            || str_contains(strtolower((string) $request->headers->get('Accept')), 'application/json')
            || $function <= 0;
        if ($expectsJson) {
            return new JsonResponse(['uploaded' => 1, 'fileName' => $entry->name, 'url' => $url]);
        }
        $payload = json_encode([$function, $url, ''], JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        $nonce = rtrim(strtr(base64_encode(random_bytes(18)), '+/', '-_'), '=');
        $html = sprintf('<script nonce="%s">(function(){var p=%s;window.parent.CKEDITOR.tools.callFunction(p[0],p[1],p[2]);})();</script>', $nonce, $payload);

        return new Response($html, headers: [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Security-Policy' => sprintf("default-src 'none'; script-src 'nonce-%s'; frame-ancestors 'self'; base-uri 'none'", $nonce),
        ]);
    }
}
