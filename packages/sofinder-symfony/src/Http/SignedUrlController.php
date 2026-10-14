<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Http\Action\SignedUrlIssueAction;
use SohoPHP\SoFinder\Http\Action\SignedContentAction;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;

final class SignedUrlController
{
    public function __construct(
        private readonly SignedUrlManager $signedUrls,
        private readonly ContentController $content,
        private readonly RouterInterface $router,
        private readonly ?SignedUrlIssueAction $issueAction = null,
        private readonly ?SignedContentAction $contentAction = null,
        private readonly ?\SohoPHP\SoFinder\Symfony\CsrfGuard $csrf = null,
    ) {
    }

    public function issue(Request $request): JsonResponse
    {
        if ($this->issueAction !== null) {
            $result = $this->issueAction->execute(SymfonyRequestContextProvider::fromRequest($request));
            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        if ($this->csrf === null) throw new \SohoPHP\SoFinder\Exception\AccessDeniedException('A CSRF provider is required to issue a signed URL.');
        $this->csrf->assertMutation($request);
        $ttl = $request->query->get('ttl');
        if ($ttl !== null && (!is_string($ttl) || preg_match('/^\d+$/D', $ttl) !== 1)) {
            throw new SoFinderException('The signed URL lifetime must be an integer.', 'signed_url_ttl_invalid', 422);
        }
        $issued = $this->signedUrls->issue(
            (string) $request->query->get('resource', 'Files'),
            (string) $request->query->get('path', ''),
            is_string($ttl) ? (int) $ttl : null,
            (string) $request->query->get('disposition', 'attachment'),
        );
        $url = $this->router->generate('sofinder_signed_content', ['token' => $issued['token']], UrlGeneratorInterface::ABSOLUTE_URL);

        return new JsonResponse(['success' => true, 'data' => ['url' => $url, 'expiresAt' => $issued['expiresAt']]]);
    }

    public function consume(Request $request, string $token): Response
    {
        if ($this->contentAction !== null) return SymfonyStreamResponseFactory::create($this->contentAction->execute(SymfonyRequestContextProvider::fromRequest($request), ['token' => $token]));
        $opened = $this->signedUrls->open($token);
        $response = $this->content->stream($request, $opened['resource'], $opened['entry'], $opened['stream'], $opened['disposition']);
        $response->headers->set('Cache-Control', 'private, no-store');
        $response->headers->set('Referrer-Policy', 'no-referrer');

        return $response;
    }
}
