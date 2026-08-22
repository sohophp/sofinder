<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Security;

use SohoPHP\SoFinder\Exception\InvalidPathException;

final class PathGuard
{
    public function normalize(string $path): string
    {
        if (str_contains($path, "\0") || preg_match('/[\x00-\x1F\x7F]/u', $path) === 1) {
            throw new InvalidPathException();
        }

        $path = str_replace('\\', '/', trim($path));
        $segments = [];
        foreach (explode('/', $path) as $segment) {
            if ($segment === '') {
                continue;
            }
            if ($segment === '.' || $segment === '..') {
                throw new InvalidPathException();
            }
            $this->assertName($segment);
            $segments[] = $segment;
        }

        return implode('/', $segments);
    }

    public function join(string $directory, string $name): string
    {
        $this->assertName($name);
        $directory = $this->normalize($directory);

        return $directory === '' ? $name : $directory . '/' . $name;
    }

    public function assertName(string $name): void
    {
        $name = trim($name);
        if (
            $name === ''
            || $name === '.'
            || $name === '..'
            || str_starts_with($name, '.')
            || str_contains($name, '/')
            || str_contains($name, '\\')
            || str_contains($name, "\0")
            || preg_match('/[\x00-\x1F\x7F]/u', $name) === 1
        ) {
            throw new InvalidPathException('The file or folder name is invalid.');
        }
    }
}
