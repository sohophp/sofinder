<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use SohoPHP\SoFinder\Contract\RequestContextProviderInterface;
use SohoPHP\SoFinder\Http\BrowserPage;

final readonly class LaravelBrowserController
{
    public function __construct(private BrowserPage $page, private RequestContextProviderInterface $contexts)
    {
    }

    public function __invoke(Request $request): Response
    {
        $context = $this->contexts->current();
        if ($context === null) throw new \RuntimeException('A Laravel request context is required.');

        return new Response($this->page->render($context), 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-store, private',
            'X-Frame-Options' => 'SAMEORIGIN',
            'X-Content-Type-Options' => 'nosniff',
            'Referrer-Policy' => 'same-origin',
        ]);
    }
}
