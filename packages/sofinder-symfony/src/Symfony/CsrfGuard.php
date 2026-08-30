<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use SohoPHP\SoFinder\Value\RequestContext;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class CsrfGuard implements CsrfTokenProviderInterface
{
    public function __construct(
        private readonly CsrfTokenManagerInterface $tokens,
        private readonly AuthorizationInterface $authorization,
    ) {
    }

    public function assertMutation(Request $request): void
    {
        if (!$this->authorization->isAuthenticated()) {
            throw new AccessDeniedException('Authentication is required.');
        }
        $value = $request->headers->get('X-CSRF-TOKEN', (string) $request->request->get('_token', ''));
        if (!$this->isValid(SymfonyRequestContextProvider::fromRequest($request), $value ?? '')) {
            throw new AccessDeniedException('The security token is invalid or expired.');
        }
    }

    public function assertCompatibleUpload(Request $request): void
    {
        if (!$this->authorization->isAuthenticated()) {
            throw new AccessDeniedException('Authentication is required.');
        }
        $value = $request->headers->get(
            'X-CSRF-TOKEN',
            (string) $request->request->get('_token', $request->query->get('_token', '')),
        );
        if (!$this->isValid(SymfonyRequestContextProvider::fromRequest($request), $value ?? '')) {
            throw new AccessDeniedException('The security token is invalid or expired.');
        }
        $origin = $request->headers->get('Origin');
        $referer = $request->headers->get('Referer');
        $expected = strtolower($request->getSchemeAndHttpHost());
        if ($origin !== null && strtolower(rtrim($origin, '/')) !== $expected) {
            throw new AccessDeniedException('The upload origin is not allowed.');
        }
        if ($referer !== null && !str_starts_with(strtolower($referer), $expected . '/')) {
            throw new AccessDeniedException('The upload referrer is not allowed.');
        }
    }

    public function token(RequestContext $context): string
    {
        return $this->tokens->getToken('sofinder')->getValue();
    }

    public function isValid(RequestContext $context, string $token): bool
    {
        return $token !== '' && $this->tokens->isTokenValid(new CsrfToken('sofinder', $token));
    }
}
