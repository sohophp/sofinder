<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

final readonly class SignedUrlController
{
    public function __construct(
        private SignedUrlManager $signedUrls,
        private ContentController $content,
        private RouterInterface $router,
    ) {
    }

    public function issue(Request $request): JsonResponse
    {
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
        $opened = $this->signedUrls->open($token);
        $response = $this->content->stream($request, $opened['resource'], $opened['entry'], $opened['stream'], $opened['disposition']);
        $response->setPublic();
        $response->setMaxAge(max(0, $opened['expiresAt'] - time()));
        $response->headers->set('Referrer-Policy', 'no-referrer');

        return $response;
    }
}
