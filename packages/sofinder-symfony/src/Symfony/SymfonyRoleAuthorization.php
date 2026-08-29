<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final readonly class SymfonyRoleAuthorization implements RoleAuthorizationInterface
{
    public function __construct(private AuthorizationCheckerInterface $authorization) {}
    public function isGranted(string $role): bool { return $this->authorization->isGranted($role); }
}
