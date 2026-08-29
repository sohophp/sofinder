<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\EventDispatcher\EventDispatcherInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;

/** Required host-owned security and identity services for a PSR-15 runtime. */
final readonly class HostServices
{
    public function __construct(
        public AuthorizationInterface $authorization,
        public ActorProviderInterface $actor,
        public CsrfTokenProviderInterface $csrf,
        public EventDispatcherInterface $events,
    ) {
    }
}
