<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\EventDispatcher\EventDispatcherInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;

/** Required host-owned security and identity services for a PSR-15 runtime. */
final class HostServices
{
    public function __construct(
        public readonly AuthorizationInterface $authorization,
        public readonly ActorProviderInterface $actor,
        public readonly CsrfTokenProviderInterface $csrf,
        public readonly EventDispatcherInterface $events,
        public readonly ?RoleAuthorizationInterface $roles = null,
    ) {
    }
}
