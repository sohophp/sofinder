<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Http\EndpointDefinition;

/** Registers the canonical endpoint catalog without taking a Slim or Mezzio dependency. */
final class RouteRegistrar
{
    public function __construct(
        private readonly RequestHandlerInterface $dispatcher,
        private readonly string $prefix = '/sofinder',
        private readonly bool $includeBrowser = true,
    ) {
    }

    /**
     * @param callable(list<string>,string,RequestHandlerInterface,string,array<string,string>):void $register
     */
    public function register(callable $register): void
    {
        foreach ($this->endpoints() as $endpoint) {
            $register(
                $endpoint->methods,
                $this->path($endpoint),
                new EndpointRouteHandler($this->dispatcher, $endpoint),
                $endpoint->name,
                $endpoint->requirements,
            );
        }
    }

    /** @param object $application A Slim 4 App or RouteCollectorProxy. */
    public function registerSlim(object $application): void
    {
        if (!is_callable([$application, 'map'])) {
            throw new \InvalidArgumentException('The Slim application must expose map().');
        }
        $map = \Closure::fromCallable([$application, 'map']);
        $this->register(function (array $methods, string $path, RequestHandlerInterface $handler, string $name, array $requirements) use ($map): void {
            $route = $map($methods, $this->routePattern($path, $requirements), static function (ServerRequestInterface $request, ResponseInterface $response, array $arguments = []) use ($handler): ResponseInterface {
                foreach ($arguments as $attribute => $value) {
                    if (is_string($attribute) && is_scalar($value)) {
                        $request = $request->withAttribute($attribute, (string) $value);
                    }
                }

                return $handler->handle($request);
            });
            if (is_object($route) && is_callable([$route, 'setName'])) {
                \Closure::fromCallable([$route, 'setName'])($name);
            }
        });
    }

    /** @param object $application A Mezzio Application. */
    public function registerMezzio(object $application): void
    {
        if (!is_callable([$application, 'route'])) {
            throw new \InvalidArgumentException('The Mezzio application must expose route().');
        }
        $route = \Closure::fromCallable([$application, 'route']);
        $this->register(function (array $methods, string $path, RequestHandlerInterface $handler, string $name, array $requirements) use ($route): void {
            $route($this->routePattern($path, $requirements), $handler, $methods, $name);
        });
    }

    /** @return list<EndpointDefinition> */
    private function endpoints(): array
    {
        return array_values(array_filter(
            EndpointCatalog::all(),
            fn (EndpointDefinition $endpoint): bool => $this->includeBrowser || $endpoint->name !== 'sofinder_browser',
        ));
    }

    private function path(EndpointDefinition $endpoint): string
    {
        $prefix = '/' . trim($this->prefix, '/');
        if ($prefix === '/') {
            $prefix = '';
        }

        return $prefix . $endpoint->path;
    }

    /** @param array<string,string> $requirements */
    private function routePattern(string $path, array $requirements): string
    {
        return preg_replace_callback('/\{([A-Za-z][A-Za-z0-9_]*)}/', static function (array $match) use ($requirements): string {
            $requirement = $requirements[$match[1]] ?? null;

            return $requirement === null ? $match[0] : '{' . $match[1] . ':' . $requirement . '}';
        }, $path) ?? $path;
    }
}
