# SoFinder Laravel Bridge

Laravel 12/13 service provider and HTTP adapter for the shared SoFinder Core
and HTTP packages. This package is under development and must not be published
until the Symfony 1.0 observation gate is complete.

The bridge registers the canonical endpoint catalog below `/sofinder`, uses
Laravel Auth/Gate and session CSRF services, and converts Illuminate requests
and responses at the PSR-7 boundary. Protected routes deny access unless the
host application defines the corresponding `sofinder.*` Gate abilities.

License: MIT.
