<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use SohoPHP\SoFinder\Workspace\DefaultWorkspaceResolver as CoreDefaultWorkspaceResolver;

/** @deprecated Use the framework-neutral Workspace\DefaultWorkspaceResolver. */
final readonly class DefaultWorkspaceResolver implements WorkspaceResolverInterface
{
    private CoreDefaultWorkspaceResolver $resolver;

    public function __construct(ActorProviderInterface $actors, ResourceRegistry $resources, string $default = 'main')
    {
        $this->resolver = new CoreDefaultWorkspaceResolver($actors, $resources, $default);
    }

    public function resolve(RequestContext $request): WorkspaceContext
    {
        return $this->resolver->resolve($request);
    }
}
