<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Contracts\Auth\Access\Gate;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;

final readonly class LaravelRoleAuthorization implements RoleAuthorizationInterface
{
    public function __construct(private Gate $gate)
    {
    }

    public function isGranted(string $role): bool
    {
        return $this->gate->allows($role);
    }
}
