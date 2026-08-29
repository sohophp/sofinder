# SoFinder Laravel Bridge

Laravel 12/13 service provider and HTTP adapter for the shared SoFinder Core
and HTTP packages. This package is under development and must not be published
until the Symfony 1.0 observation gate is complete.

The bridge registers the browser and canonical endpoint catalog below
`/sofinder`, uses Laravel Auth/Gate and session CSRF services, and converts
Illuminate requests and responses at the PSR-7 boundary. Protected routes deny
access unless the host application defines the corresponding `sofinder.*` Gate
abilities. Operational state for chunk sessions, maintenance claims, metrics,
malware status and document-preview jobs uses Laravel's configured Cache
repository and atomic locks. The default Cache store is selected unless
`cache_store` names another store; a driver without atomic-lock support fails
application bootstrap. `cache_prefix`, `cache_lock_seconds` and
`cache_lock_wait_seconds` tune isolation and lock behavior.

The bridge also registers `sofinder:uploads:cleanup`,
`sofinder:trash:cleanup`, `sofinder:usage:recalculate` and
`sofinder:maintenance:status`, plus the shared deploy-time
`sofinder:security:audit` (with optional `--json` output). Set the shared
`maintenance.mode` to `messenger` to dispatch maintenance through Laravel's
configured queue. `document_preview.mode=auto` uses the Laravel Bus when Office
preview is enabled, while `messenger` requires it and `inline` remains
synchronous; the shared configuration name stays unchanged across bridges.
Enabling shared `malware_scanning` wires the same fail-closed
ClamAV upload scanner and audit health check used by the Symfony bridge.

Publish host-editable configuration with
`php artisan vendor:publish --tag=sofinder-config`, or copy the synchronized
frontend distribution with `php artisan vendor:publish --tag=sofinder-assets`.

License: MIT.
