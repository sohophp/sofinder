<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Contract;

use SohoPHP\SoFinder\Value\WorkspaceContext;
use Symfony\Component\HttpFoundation\Request;

interface WorkspaceResolverInterface
{
    public function resolve(Request $request): WorkspaceContext;
}
