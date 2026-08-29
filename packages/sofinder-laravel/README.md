# SoFinder Laravel Bridge

Laravel 12/13 service provider and HTTP adapter for the shared SoFinder Core
and HTTP packages. This package is under development and must not be published
until the Symfony 1.0 observation gate is complete.

The bridge registers the browser and canonical endpoint catalog below
`/sofinder`, uses Laravel Auth/Gate and session CSRF services, and converts
Illuminate requests and responses at the PSR-7 boundary. Protected routes deny
access unless the host application defines the corresponding `sofinder.*` Gate
abilities. It also registers `sofinder:uploads:cleanup`,
`sofinder:trash:cleanup`, `sofinder:usage:recalculate` and
`sofinder:maintenance:status`. Set the shared `maintenance.mode` to `messenger`
to dispatch maintenance through Laravel's configured queue.

Publish host-editable configuration with
`php artisan vendor:publish --tag=sofinder-config`, or copy the synchronized
frontend distribution with `php artisan vendor:publish --tag=sofinder-assets`.

License: MIT.
