<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

final readonly class AssetController
{
    public function __construct(private string $packageDir)
    {
    }

    public function __invoke(string $file): Response
    {
        $allowed = [
            'sofinder.js' => 'text/javascript; charset=UTF-8',
            'sofinder-picker.js' => 'text/javascript; charset=UTF-8',
            'sofinder.css' => 'text/css; charset=UTF-8',
        ];
        if (!isset($allowed[$file])) {
            return new Response('Not found', 404);
        }
        $path = $this->packageDir . '/dist/' . $file;
        if (!is_file($path)) {
            return new Response('SoFinder assets have not been built.', 503);
        }
        $response = new BinaryFileResponse($path);
        $response->headers->set('Content-Type', $allowed[$file]);
        $response->setPublic()->setMaxAge(31536000)->setImmutable();

        return $response;
    }
}
