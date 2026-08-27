<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Workspace;

use SohoPHP\SoFinder\Contract\WorkspaceResolverInterface;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use SohoPHP\SoFinder\Value\WorkspaceContext;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class WorkspaceProvider
{
    public function __construct(private WorkspaceResolverInterface $resolver, private RequestStack $requests)
    {
    }

    public function current(): WorkspaceContext
    {
        $request = $this->requests->getCurrentRequest();
        if ($request === null) throw new AccessDeniedException('A request context is required to resolve the workspace.');

        return $this->resolver->resolve($request);
    }

    public function assertResource(string $resource): WorkspaceContext
    {
        $workspace = $this->current();
        if ($workspace->resources !== [] && !in_array($resource, $workspace->resources, true)) {
            throw new AccessDeniedException('The selected resource is not available in this workspace.');
        }

        return $workspace;
    }
}
