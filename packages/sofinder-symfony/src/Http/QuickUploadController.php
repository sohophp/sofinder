<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Http\Action\QuickUploadAction;

final readonly class QuickUploadController
{
    public function __construct(
        private FileManager $files,
        private CsrfGuard $csrf,
        private ?ImageCapabilityProviderInterface $imageCapabilities = null,
        private bool $overwriteOnUpload = false,
        private UploadNamePolicy $uploadNames = new UploadNamePolicy(),
        private ?QuickUploadAction $action = null,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        if ($this->action !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $input = $request->request->all();
            $this->action->assertAllowed($context, $input);
            $uploaded = $request->files->get('upload');
            $input['upload'] = $uploaded instanceof UploadedFile && $uploaded->isValid()
                ? UploadedFileInput::fromPath($uploaded->getPathname(), $uploaded->getClientOriginalName(), (int) $uploaded->getSize(), $uploaded->getError())
                : null;
            $result = $this->action->execute($context, $input);

            return $result instanceof StreamEndpointResult
                ? SymfonyStreamResponseFactory::create($result)
                : new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertCompatibleUpload($request);
        $uploaded = $request->files->get('upload');
        if (!$uploaded instanceof UploadedFile || !$uploaded->isValid()) {
            throw new SoFinderException('No valid uploaded file was received.', 'invalid_upload', 400);
        }
        $function = (int) $request->query->get('CKEditorFuncNum', $request->request->get('CKEditorFuncNum', 0));
        $expectsJson = strtolower((string) $request->query->get('responseType', '')) === 'json'
            || $request->isXmlHttpRequest()
            || str_contains(strtolower((string) $request->headers->get('Accept')), 'application/json')
            || $function <= 0;
        $resource = (string) $request->query->get('type', 'Files');
        $selection = strtolower((string) $request->query->get('selection', $resource === 'Images' ? 'image' : 'file'));
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($uploaded->getPathname()) ?: 'application/octet-stream';
        if ($selection === 'image' && ($this->imageCapabilities === null || !$this->imageCapabilities->isWebEmbeddable($mime))) {
            return $this->failure($function, $expectsJson, 'image_not_web_embeddable', 'This image format cannot be embedded directly in a web page.');
        }
        $stream = fopen($uploaded->getPathname(), 'rb');
        if ($stream === false) {
            throw new SoFinderException('Unable to read the uploaded file.', 'invalid_upload', 400);
        }
        try {
            $entry = $this->files->upload(
                $resource,
                (string) $request->query->get('currentFolder', ''),
                $this->uploadNames->normalize($uploaded->getClientOriginalName()),
                (int) $uploaded->getSize(),
                $stream,
                $this->overwriteOnUpload,
                !$this->overwriteOnUpload,
            );
        } finally {
            fclose($stream);
        }
        $url = $entry->url ?? '';
        $renamed = $entry->name !== $this->uploadNames->normalize($uploaded->getClientOriginalName());
        $message = $renamed
            ? sprintf('A file with the same name already exists. The uploaded file was renamed to "%s".', $entry->name)
            : '';
        if ($expectsJson) {
            $payload = ['uploaded' => 1, 'fileName' => $entry->name, 'url' => $url];
            if ($renamed) {
                $payload['error'] = ['message' => $message];
            }

            return new JsonResponse($payload);
        }
        $payload = json_encode([$function, $url, $message], JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        $nonce = rtrim(strtr(base64_encode(random_bytes(18)), '+/', '-_'), '=');
        $html = sprintf('<script nonce="%s">(function(){var p=%s;window.parent.CKEDITOR.tools.callFunction(p[0],p[1],p[2]);})();</script>', $nonce, $payload);

        return new Response($html, headers: [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Security-Policy' => sprintf("default-src 'none'; script-src 'nonce-%s'; frame-ancestors 'self'; base-uri 'none'", $nonce),
        ]);
    }

    private function failure(int $function, bool $expectsJson, string $code, string $message): Response
    {
        if ($expectsJson) {
            return new JsonResponse(['uploaded' => 0, 'error' => ['code' => $code, 'message' => $message]], 415);
        }
        $payload = json_encode([$function, '', $message], JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        $nonce = rtrim(strtr(base64_encode(random_bytes(18)), '+/', '-_'), '=');

        return new Response(
            sprintf('<script nonce="%s">(function(){var p=%s;window.parent.CKEDITOR.tools.callFunction(p[0],p[1],p[2]);})();</script>', $nonce, $payload),
            415,
            [
                'Content-Type' => 'text/html; charset=UTF-8',
                'Content-Security-Policy' => sprintf("default-src 'none'; script-src 'nonce-%s'; frame-ancestors 'self'; base-uri 'none'", $nonce),
            ],
        );
    }
}
