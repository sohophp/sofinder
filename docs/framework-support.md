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
| Plain PHP / any container | Experimental complete headless HTTP runtime | Host supplies explicit authorization, CSRF, actor, events and PSR factories |
| Laravel 12/13 | Experimental full-stack bridge: browser, 51 shared handlers, Artisan/Queue, Auth/Gate and session CSRF | Full black-box parity and the Symfony observation gate |
| Slim / Mezzio | Experimental PSR-15 bridge with all 51 shared handlers and executable hosts | Full black-box parity and the Symfony 1.0 observation gate |
| Other frameworks | Headless core only | Implement the same public contracts; do not subclass internal controllers |

The experimental PSR-15 package supplies middleware, a `RouteRegistrar` and a
local runtime factory for all 51 non-presentation endpoints. Real Slim 4,
Mezzio 3 and plain PHP front controllers execute liveness, capabilities, health,
denial and mutation paths on PHP 8.2 and 8.5. `/browser` remains host-rendered.
Only the Symfony row is supported today; the PSR row does not become supported
until the complete black-box suite and release gate pass.

The gated Laravel package now boots through package discovery in real Laravel
12 and 13 applications, registers the canonical 51 non-browser routes, and
wires all of them to shared HTTP actions through the PSR dispatcher. Its
Laravel Auth/Gate, session CSRF, event dispatcher, request context, route URL
and normalized configuration adapters are present. The shared browser bootstrap,
four Artisan maintenance commands, Laravel Queue dispatcher and synchronized
release assets are also wired. A runnable Laravel 12/13 application now verifies
auto-discovery, configuration and route caches, browser boot, CSRF, upload,
download, Range and frontend assets. The package remains experimental while its
full cross-host black-box contract suite is being completed.

The gate is recorded in `config/framework-support.json` and validated in CI.
It cannot become eligible until the recorded main release is `1.0.0`, its UTC
release date is at least 30 days old, and the open P0/P1 defect count is zero.
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
4. Promote the shared PSR-7/PSR-15 bridge from experimental after executable
   Slim and Mezzio examples pass the same contract suite.
5. Accept other framework bridges only when they run the same HTTP, security
   and storage contract tests.

## PHP 7.2 is a separate product line

PHP 7.2 is end-of-life and cannot be added to `main` or to the 1.x package
constraint. The current code intentionally uses PHP 8.1/8.2 language features,
and current Symfony, PHPUnit and PSR dependency versions do not form a safe
drop-in PHP 7.2 matrix.

After the Symfony/PHP 8.2–8.5 line is stable, feasibility may be assessed in a
separate repository and Composer package (for example,
`sohophp/sofinder-legacy`), with its own version namespace, lock file, CI and
security policy. It must not share release tags or dependency resolution with
`sohophp/sofinder` 1.x. A port is released only if supported dependencies and a
maintainable security-update path can be demonstrated. Every PHP 8 package
declares a Composer conflict with `sohophp/sofinder-legacy`, so Composer rejects
mixed PHP 7/PHP 8 installations before dependency resolution can install them.
