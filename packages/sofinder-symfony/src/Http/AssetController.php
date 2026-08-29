<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Http\Action\FrontendAssetAction;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final readonly class AssetController
{
    public function __construct(private string $packageDir, private ?FrontendAssetAction $action = null)
    {
    }

    public function __invoke(string $file, ?Request $request = null): Response
    {
        if ($this->action !== null) {
            $context = $request === null ? new \SohoPHP\SoFinder\Value\RequestContext() : SymfonyRequestContextProvider::fromRequest($request);

            return SymfonyStreamResponseFactory::create($this->action->execute($context, ['file' => $file]));
        }
        $allowed = [];
        foreach ($this->manifestAssets() as $asset) {
            $allowed[$asset] = str_ends_with($asset, '.css') ? 'text/css; charset=UTF-8' : 'text/javascript; charset=UTF-8';
        }
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

    /** @return list<string> */
    private function manifestAssets(): array
    {
        $manifest = $this->packageDir . '/dist/manifest.json';
        if (!is_file($manifest) || !is_readable($manifest)) return [];
        try { $decoded = json_decode((string) file_get_contents($manifest), true, 512, JSON_THROW_ON_ERROR); } catch (\JsonException) { return []; }
        if (!is_array($decoded)) return [];
        $assets = [];
        foreach ($decoded as $entry) {
            if (!is_array($entry)) continue;
            $candidates = [$entry['file'] ?? null, ...(is_array($entry['css'] ?? null) ? $entry['css'] : [])];
            foreach ($candidates as $candidate) {
                if (!is_string($candidate) || basename($candidate) !== $candidate || preg_match('/^[A-Za-z0-9._-]+\.(?:js|css)$/D', $candidate) !== 1) continue;
                $assets[$candidate] = true;
            }
        }
        return array_keys($assets);
    }
}
