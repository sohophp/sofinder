<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;

final class DenyRoleAuthorization implements RoleAuthorizationInterface
{
    public function isGranted(string $role): bool { return false; }
}
