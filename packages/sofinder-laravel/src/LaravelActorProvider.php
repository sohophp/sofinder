<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Contracts\Auth\Factory as AuthFactory;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;

final readonly class LaravelActorProvider implements ActorProviderInterface
{
    public function __construct(private AuthFactory $auth)
    {
    }

    public function actorId(): string
    {
        $identifier = $this->auth->guard()->id();
        if (!is_int($identifier) && !is_string($identifier)) {
            throw new \RuntimeException('SoFinder requires an authenticated Laravel actor.');
        }

        return (string) $identifier;
    }
}
