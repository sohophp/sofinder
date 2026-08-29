<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Http\EndpointDefinition;

final class RouteMatcher
{
    /** @return null|array{endpoint:EndpointDefinition,attributes:array<string,string>} */
    public function match(string $method, string $path): ?array
    {
        foreach (EndpointCatalog::all() as $endpoint) {
            if (!in_array(strtoupper($method), $endpoint->methods, true)) {
                continue;
            }
            $names = [];
            $pattern = preg_replace_callback('/\{([A-Za-z][A-Za-z0-9_]*)}/', static function (array $match) use (&$names, $endpoint): string {
                $names[] = $match[1];
                return '(' . ($endpoint->requirements[$match[1]] ?? '[^/]+') . ')';
            }, $endpoint->path);
            if ($pattern === null || preg_match('#^' . $pattern . '$#D', $path, $matches) !== 1) {
                continue;
            }
            array_shift($matches);

            return ['endpoint' => $endpoint, 'attributes' => array_combine($names, $matches) ?: []];
        }

        return null;
    }
}
