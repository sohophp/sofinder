<?php

declare(strict_types=1);

use Laminas\Diactoros\ResponseFactory;
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\Diactoros\StreamFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;
use Laminas\HttpHandlerRunner\RequestHandlerRunnerInterface;
use Laminas\Stratigility\MiddlewarePipe;
use Mezzio\Application;
use Mezzio\Handler\NotFoundHandler;
use Mezzio\MiddlewareContainer;
use Mezzio\MiddlewareFactory;
use Mezzio\Router\FastRouteRouter;
use Mezzio\Router\Middleware\DispatchMiddleware;
use Mezzio\Router\Middleware\RouteMiddleware;
use Mezzio\Router\RouteCollector;
use Psr\Container\ContainerInterface;
use SoFinderExample\RuntimeFactory;

require dirname(__DIR__) . '/vendor/autoload.php';

$container = new class implements ContainerInterface {
    public function get(string $id): mixed { throw new RuntimeException(sprintf('Service "%s" is not configured.', $id)); }
    public function has(string $id): bool { return false; }
};
$router = new FastRouteRouter();
$responses = new ResponseFactory();
$application = new Application(
    new MiddlewareFactory(new MiddlewareContainer($container)),
    new MiddlewarePipe(),
    new RouteCollector($router),
    new class implements RequestHandlerRunnerInterface { public function run(): void {} },
);
RuntimeFactory::create($responses, new StreamFactory())->routes()->registerMezzio($application);
$application->pipe(new RouteMiddleware($router));
$application->pipe(new DispatchMiddleware());
$application->pipe(new NotFoundHandler($responses));

(new SapiEmitter())->emit($application->handle(ServerRequestFactory::fromGlobals()));
