---
title: Framework support
description: Support levels, headless bootstrap seam and the order for adding PHP framework bridges.
---

# Framework support

SoFinder separates the file-management domain from delivery concerns. The
current release line supports PHP 8.2–8.5. Its full browser, HTTP API, console,
security and dependency-injection integration is supported on Symfony 6.4 LTS
and 7.4 LTS.

| Host | Current level | Release gate |
| --- | --- | --- |
| Symfony 6.4/7.4 | Full, stable target | Complete PHP 8.2–8.5 CI matrix |
| Plain PHP / any container | Full browser/API runtime | Host supplies explicit authorization, CSRF, actor, events and PSR factories |
| Laravel 12/13 | Full-stack supported: browser, 51 shared handlers, Artisan/Queue, Auth/Gate and session CSRF | Complete compatibility and black-box parity matrices |
| Slim / Mezzio | Full-stack supported through PSR-15 with all 52 shared handlers | Complete compatibility and black-box parity matrices |
| Other frameworks | Headless core only | Implement the same public contracts; do not subclass internal controllers |

The supported PSR-15 package supplies middleware, a `RouteRegistrar` and a
local runtime factory for the complete 52-route browser/API surface. Real Slim
4, Mezzio 3 and plain PHP front controllers serve the shared `/browser` shell
and frontend assets, and execute all 51 non-presentation routes plus liveness,
capabilities, health, denial and mutation paths on PHP 8.2 and 8.5. Chromium
boots the React UI against each real host without runtime errors. The shared API
inventory compares status/error contracts and security headers against Symfony.
The complete black-box suite runs before every synchronized release.

The gated Laravel package now boots through package discovery in real Laravel
12 and 13 applications, registers the canonical 51 non-browser routes, and
wires all of them to shared HTTP actions through the PSR dispatcher. Its
Laravel Auth/Gate, session CSRF, event dispatcher, request context, route URL
and normalized configuration adapters are present. Laravel Cache with atomic
locks owns operational shared state for chunk sessions, maintenance, metrics,
malware status and preview jobs; unsupported cache drivers fail bootstrap. The shared browser bootstrap,
four Artisan maintenance commands, framework-neutral security audit exposed as
an Artisan command, Laravel Queue dispatchers for maintenance and asynchronous
document previews, and synchronized release assets are
also wired. Enabling malware scanning attaches the shared fail-closed ClamAV
scanner to Laravel uploads and the audit. A runnable Laravel 12/13 application
now verifies every supported PHP/framework pair (Laravel 12 on PHP 8.2–8.5;
Laravel 13 on PHP 8.3–8.5), including auto-discovery, configuration and route caches, browser boot, CSRF, upload,
download, Range and frontend assets. Chromium also loads the real Laravel 12
and 13 browser shell and verifies its shared API bootstrap without runtime
errors. Its real-host suite also executes all 51
non-presentation routes against the Symfony status/error and security-header
contract. The same suite runs a real multipart upload through full/range content,
ETag revalidation, range download, rename, copy, move, recycle-bin restore and
permanent deletion on all five hosts. It additionally verifies Symfony's native
unauthenticated 401 challenge and compares the shared 403 `access_denied`
contract for unauthenticated and authenticated-but-unauthorized actors across
Laravel, Slim, Mezzio and plain PHP.

The gate is recorded in `config/framework-support.json` and validated in CI.
The default policy requires the recorded main release to be at least `1.0.0`,
30 stable days and zero open or closed P0/P1 defects. The maintainer explicitly
approved an immediate-promotion waiver after the complete compatibility,
security, split-publication and clean-consumer matrices passed. The waiver date,
approver and reason are recorded in the policy rather than presenting the
observation period as complete. Stable patch releases satisfy the version
floor; the recorded stable line is `1.0.2`, anchored to the immutable `1.0.0`
release.
Eligibility also requires the final Symfony matrix commit and workflow URL,
observation start/completion dates, and a secure priority-defect audit link.
After `1.0.0` exists, the scheduled `Symfony 1.0 observation` workflow records
all issues carrying the exact `priority:p0` or `priority:p1` labels that were
created during the period. Closed defects remain in the evidence, so closing an
issue cannot manufacture an uninterrupted defect-free observation window.

```php
$registrar = new RouteRegistrar($endpointDispatcher, '/sofinder');
$registrar->registerSlim($slimApp);
// or: $registrar->registerMezzio($mezzioApp);
```

The dispatcher must receive the shared handlers required by the enabled
features. Missing handlers fail with `501 endpoint_not_implemented`; missing
authorization or CSRF providers must fail application bootstrap.
Framework-neutral hosts that select asynchronous document previews must supply
`DocumentPreviewDispatcherInterface`; messenger mode fails bootstrap when that
dispatcher is absent or unavailable.

## Framework-independent bootstrap

`Storage\ResourceRegistryFactory` constructs resources without a framework
request or container. A bridge can optionally resolve public URLs to account
for its mount path:

```php
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Storage\ResourceRegistryFactory;

$registry = (new ResourceRegistryFactory(
    publicUrlResolver: static fn (string $url): string => '/admin' . $url,
))->create([
    'Files' => [
        'root' => __DIR__ . '/storage/files',
        'public_url' => '/files',
        'allowed_extensions' => ['jpg', 'png', 'pdf'],
    ],
]);

$files = new FileManager($registry, $authorization, $eventDispatcher);
```

`$authorization` implements `AuthorizationInterface`, and `$eventDispatcher`
implements PSR-14 `EventDispatcherInterface`. Route handlers must authenticate
before calling the core, validate CSRF on mutations, translate
`SoFinderException` to its status/code JSON form, and stream files without
weakening the configured resource ACL. These are bridge responsibilities, not
optional examples.

The Symfony `ResourceRegistryFactory` delegates to the same builder and adds
only request base-path resolution. This is the reference pattern for future
bridges and prevents configuration/security behavior from drifting by host.

## Implementation order

1. Keep Symfony 6.4/7.4 green across PHP 8.2, 8.3, 8.4 and 8.5, including the
   runnable example.
2. Freeze framework-neutral request, response, upload, actor and workspace
   boundaries and move full-stack-only code behind bridge packages.
3. Add Laravel as the first additional full bridge, with an executable example
   and the shared HTTP contract suite.
4. Keep the shared PSR-7/PSR-15 bridge supported only while executable Slim and
   Mezzio examples pass the same contract suite.
5. Accept other framework bridges only when they run the same HTTP, security
   and storage contract tests.

## PHP 7.2 is a separate product line

PHP 7.2 is end-of-life and cannot be added to `main` or to the 1.x package
constraint. The current code intentionally uses PHP 8.1/8.2 language features,
and current Symfony, PHPUnit and PSR dependency versions do not form a safe
drop-in PHP 7.2 matrix.

The compatibility boundary is non-negotiable: the PHP 8.2–8.5 main line is
never downgraded in syntax, dependencies, architecture or tests to make PHP 7.2
possible. Whether PHP 7.2 runtime development is feasible or worth continuing
is a separate product decision made only inside the Legacy repository. A
Legacy feasibility result cannot require changes that weaken or constrain the
PHP 8 main line.

The independent [`sohophp/sofinder-legacy`](https://github.com/sohophp/sofinder-legacy)
repository now contains a `7.2.x` compatibility baseline, its own lock file,
PHP 7.2.5/7.3/7.4 CI and security policy. Runtime porting is currently paused
and no `7.2.0` release or Packagist package exists. It does not share tags or
dependency resolution with `sohophp/sofinder` 1.x. A port is released only if
supported dependencies and a maintainable security-update path can be
demonstrated. Every PHP 8 package declares a Composer conflict with
`sohophp/sofinder-legacy`, so Composer rejects mixed product lines.
