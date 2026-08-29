<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Value\ResourceType;

final readonly class LaravelAuthorization implements AuthorizationInterface
{
    public function __construct(private AuthFactory $auth, private Gate $gate)
    {
    }

    public function isAuthenticated(): bool
    {
        return $this->auth->guard()->check();
    }

    public function isGranted(string $operation, ResourceType $resource, string $path): bool
    {
        return $this->isAuthenticated()
            && $this->gate->allows('sofinder.' . $operation, [$resource, $path]);
    }
}
