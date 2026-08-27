<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Contract;

use SohoPHP\SoFinder\Value\WorkspaceContext;
use Symfony\Component\HttpFoundation\Request;

/** Supplies trusted host navigation targets for users who can access multiple Workspaces. */
interface WorkspaceOptionProviderInterface
{
    /** @return list<array{id:string,label:string,url:string}> */
    public function options(Request $request, WorkspaceContext $current): array;
}
