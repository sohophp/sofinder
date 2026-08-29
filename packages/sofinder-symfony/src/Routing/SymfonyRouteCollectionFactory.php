<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Routing;

use SohoPHP\SoFinder\Http\EndpointCatalog;
use SohoPHP\SoFinder\Http\BrowserController;
use SohoPHP\SoFinder\Symfony\SymfonyEndpointController;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/** Builds the Symfony route surface from the framework-neutral endpoint catalog. */
final class SymfonyRouteCollectionFactory
{
    public static function create(): RouteCollection
    {
        $endpoints = EndpointCatalog::all();
        $routes = new RouteCollection();
        foreach ($endpoints as $endpoint) {
            $defaults = [
                '_controller' => $endpoint->name === 'sofinder_browser' ? BrowserController::class : SymfonyEndpointController::class,
                '_sofinder' => true,
                '_sofinder_endpoint' => $endpoint->name,
            ];
            if ($endpoint->name === 'sofinder_api_copy' || $endpoint->name === 'sofinder_api_move') {
                $defaults['operation'] = substr($endpoint->name, strlen('sofinder_api_'));
            }
            if ($endpoint->name === 'sofinder_signed_content') {
                $defaults['_sofinder_signed_public'] = true;
            }

            $routes->add($endpoint->name, new Route(
                path: $endpoint->path,
                defaults: $defaults,
                requirements: $endpoint->requirements,
                methods: $endpoint->methods,
            ));
        }

        return $routes;
    }
}
