---
title: Package architecture
description: Enforced package boundaries and the staged Composer split for framework bridges.
---

# Package architecture

SoFinder is migrating from the pre-1.0 Symfony bundle to synchronized Composer
packages. The migration is deliberately staged: a package is not advertised as
installable until all files it needs live below its publishable subtree and its
isolated install test passes.

| Package | Responsibility | Current release state |
| --- | --- | --- |
| `sohophp/sofinder-core` | Domain, storage, values and host contracts | Physical subtree and isolated install complete |
| `sohophp/sofinder-http` | Endpoint catalog, PSR dispatcher and shared handlers | All 51 non-presentation endpoints have shared actions; `/browser` remains a host bridge page |
| `sohophp/sofinder-symfony` | Bundle and HttpFoundation/Console/Messenger adapters | Physical subtree, release assets and isolated install complete |
| `sohophp/sofinder-laravel` | Laravel 12/13 provider, auth, CSRF, routes and commands | All shared handlers, maintenance commands and security audit pass real-app tests; release remains gated |
| `sohophp/sofinder-psr15` | Slim, Mezzio and plain PSR-15 middleware | Isolated install, real-host smoke and route/action coverage complete; full endpoint parity remains gated |

The source-level `FrameworkBoundaryTest` rejects Symfony, Illuminate, Slim or
Mezzio imports from the physical Core package. Symfony now builds its 52-route
collection directly from the framework-neutral catalog; its compatibility YAML
file only imports that generated collection. `EndpointCatalogTest` verifies the
resulting path, method, requirement, adapter and special-default contract. The
host-rendered `/browser` page retains its Symfony controller; every other route
uses one HttpFoundation-to-PSR adapter and the same `EndpointDispatcher` as
Laravel, Slim, Mezzio and plain PHP.
These gates stay active while files are physically moved into package subtrees.

The compatibility matrix keeps the committed Composer platform at PHP 8.2 for
minimum resolution, adds a PHP 8.2/Symfony 6.4 `prefer-lowest` run, and uses a
temporary manifest without that platform override for the PHP 8.5/Symfony 7.4
latest-dependency run. The committed minimum is never rewritten.

Core, HTTP and PSR-15 now pass isolated Composer installation without installing
Symfony. The Symfony bridge also passes an isolated install from its physical
subtree and carries its own release assets. `sohophp/sofinder` is now a compatibility
meta package that installs `sohophp/sofinder-symfony`, preserving the existing
package name and `SohoPHP\\SoFinder` namespace without retaining duplicate root source.
Every split repository carries package-local PHP/Composer wrappers and pinned CI
for PHP 8.2 lowest plus PHP 8.5 stable dependencies. Those development files are
export-ignored from consumer distribution archives.

Executable Slim 4, Mezzio 3 and plain PHP front controllers exercise the real
host routers and emitters on PHP 8.2 and 8.5. Their official entry point requires
authorization, actor, CSRF and event-dispatcher services at construction time;
the example denies protected operations instead of supplying an anonymous
allow-all default. Together with Symfony and Laravel, these hosts run the same
real upload, Range/ETag stream, mutation and recycle-bin lifecycle in CI.

`ConfigurationNormalizer` lives in Core and is the canonical array entry point
for framework defaults, list replacement, the legacy upload-naming alias and
security-sensitive ranges. Symfony sends its resolved YAML through the same
normalizer; Laravel and plain PHP adapters can supply host path/secret defaults
without importing Symfony Config.

Mutation actions require both an `AuthorizationInterface` and a
`CsrfTokenProviderInterface`. Authentication and CSRF are checked before a JSON
body is decoded; a host cannot construct a permissive mutation stack by omitting
either dependency.

All 51 non-presentation endpoints now execute through framework-neutral actions, including
metadata, bounded content reads, Range/ETag streaming, image thumbnail/variant
delivery, document previews, Prometheus metrics, uploads, access sessions, archives,
chunk status/cancellation and image dimensions. The remaining `/browser` route is the host-rendered
HTML shell and intentionally belongs to each full-stack bridge.
Asset references, details, metadata, search and the complete usage lifecycle are
included, together with document-preview jobs, signed URL issuance and security
status. Endpoint URLs and role authorization use Core contracts implemented by
the Symfony adapter. Feature filtering, workspace isolation and mutation
validation are shared instead of being reimplemented by a bridge.
