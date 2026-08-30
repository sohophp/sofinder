<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class SymfonyActorProvider implements ActorProviderInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokens,
        private readonly RequestStack $requests,
    ) {
    }

    public function actorId(): string
    {
        $user = $this->tokens->getToken()?->getUser();
        if ($user !== null) {
            return hash('sha256', 'user:' . $user->getUserIdentifier());
        }
        $request = $this->requests->getCurrentRequest();
        if ($request?->hasSession()) {
            $sessionId = $request->getSession()->getId();
            if ($sessionId !== '') {
                return hash('sha256', 'session:' . $sessionId);
            }
        }

        throw new AccessDeniedException('A stable authenticated identity is required for file metadata.');
    }
}
