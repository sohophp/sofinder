<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Routing\Router;
use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Http\EndpointDefinition;

final readonly class LaravelRouteRegistrar
{
    /** Shared actions validate the Laravel session token and own the stable JSON error contract. */
    private const FRAMEWORK_CSRF_MIDDLEWARE = [
        'Illuminate\\Foundation\\Http\\Middleware\\PreventRequestForgery',
        'Illuminate\\Foundation\\Http\\Middleware\\ValidateCsrfToken',
    ];

    /** @param array<string,mixed> $config */
    public function __construct(private Router $router, private array $config)
    {
    }

    public function register(): void
    {
        $prefix = trim(is_string($this->config['prefix'] ?? null) ? $this->config['prefix'] : 'sofinder', '/');
        $attributes = ['prefix' => $prefix];
        $domain = $this->config['domain'] ?? null;
        if (is_string($domain) && $domain !== '') {
            $attributes['domain'] = $domain;
        }
        $middleware = $this->middleware('middleware', ['web']);
        $authenticated = array_values(array_unique(array_merge($middleware, $this->middleware('auth_middleware', ['auth']))));
        $basePath = $prefix === '' ? '' : '/' . $prefix;

        $this->router->group($attributes, function (Router $router) use ($middleware, $authenticated, $basePath): void {
            foreach (EndpointCatalog::all() as $endpoint) {
                $controller = $endpoint->name === 'sofinder_browser' ? LaravelBrowserController::class : LaravelEndpointController::class;
                $route = $router->match($endpoint->methods, ltrim($endpoint->path, '/'), $controller)
                    ->name(LaravelRouteName::fromEndpoint($endpoint->name))
                    ->middleware($endpoint->public ? $middleware : $authenticated)
                    ->withoutMiddleware(self::FRAMEWORK_CSRF_MIDDLEWARE);
                foreach ($endpoint->requirements as $parameter => $requirement) {
                    $route->where($parameter, $requirement);
                }
                $route->setAction(array_replace($route->getAction(), [
                    '_sofinder_endpoint' => $endpoint->name,
                    '_sofinder_base_path' => $basePath,
                ]));
            }
        });
    }

    /** @param list<string> $default @return list<string> */
    private function middleware(string $key, array $default): array
    {
        $value = $this->config[$key] ?? $default;
        if (!is_array($value)) {
            throw new \InvalidArgumentException(sprintf('sofinder.%s must be a list of middleware names.', $key));
        }

        return array_values(array_filter($value, static fn (mixed $item): bool => is_string($item) && $item !== ''));
    }
}
