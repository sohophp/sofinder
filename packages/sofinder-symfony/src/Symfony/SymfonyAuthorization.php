<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final readonly class SymfonyAuthorization implements AuthorizationInterface
{
    public function __construct(private AuthorizationCheckerInterface $authorizationChecker)
    {
    }

    public function isAuthenticated(): bool
    {
        return $this->authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY');
    }

    public function isGranted(string $operation, ResourceType $resource, string $path): bool
    {
        if (!$this->isAuthenticated()) {
            return false;
        }
        $roles = $resource->operationRoles[$operation] ?? $resource->requiredRoles;

        if ($roles !== [] && !$this->anyRoleGranted($roles)) {
            return false;
        }

        $matches = array_values(array_filter(
            $resource->pathAcl,
            static fn (array $rule): bool => (in_array('*', $rule['operations'], true) || in_array($operation, $rule['operations'], true))
                && ($rule['path'] === '' || $path === $rule['path'] || str_starts_with($path, $rule['path'] . '/')),
        ));
        if ($matches === []) {
            return true;
        }
        $specificity = max(array_map(static fn (array $rule): int => strlen($rule['path']), $matches));
        $matches = array_filter($matches, static fn (array $rule): bool => strlen($rule['path']) === $specificity);
        $allowed = false;
        foreach ($matches as $rule) {
            $applies = $rule['roles'] === [] || $this->anyRoleGranted($rule['roles']);
            if (!$applies) {
                continue;
            }
            if (!$rule['allow']) {
                return false;
            }
            $allowed = true;
        }

        return $allowed;
    }

    /** @param list<string> $roles */
    private function anyRoleGranted(array $roles): bool
    {
        foreach ($roles as $role) {
            if ($this->authorizationChecker->isGranted($role)) {
                return true;
            }
        }

        return false;
    }
}
