---
title: Framework integrations
description: Install and integrate SoFinder with Symfony, Laravel, Slim, Mezzio or framework-free PHP.
---

# Framework integrations

SoFinder 1.1 provides full browser and HTTP API integrations for the following
hosts. All bridges use the same Core, endpoint catalog, validation, security
rules and frontend distribution.

| Host | Package | Supported runtime |
| --- | --- | --- |
| Symfony 6.4/7.4 | `sohophp/sofinder-symfony` | PHP 8.2–8.5 |
| Laravel 12 | `sohophp/sofinder-laravel` | PHP 8.2–8.5 |
| Laravel 13 | `sohophp/sofinder-laravel` | PHP 8.3–8.5 |
| Slim 4, Mezzio 3, plain PHP | `sohophp/sofinder-psr15` | PHP 8.2–8.5 |

For Symfony, follow the dedicated [Symfony integration guide](/symfony). The
sections below cover Laravel and the PSR-15 hosts.

## Laravel 12 and 13

### Install and publish configuration

```bash
composer require sohophp/sofinder-laravel:^1.1
php artisan vendor:publish --tag=sofinder-config
```

Laravel package discovery registers `SoFinderServiceProvider`; no manual
provider entry is required. The default configuration mounts the browser at
`/sofinder/browser`, uses the `web` and `auth` middleware groups, and stores
files below `storage/app/sofinder`.

Edit `config/sofinder.php` when the mount point, middleware or resources need
to change:

```php
return [
    'enabled' => true,
    'prefix' => 'sofinder',
    'domain' => null,
    'middleware' => ['web'],
    'auth_middleware' => ['auth'],
    'cache_store' => null,
    'core' => [
        'resources' => [
            'Files' => [
                'root' => storage_path('app/sofinder/files'),
                'delivery_mode' => 'proxy',
                'allowed_extensions' => ['jpg', 'png', 'pdf', 'docx', 'xlsx'],
            ],
        ],
    ],
];
```

The selected Laravel cache store must support atomic locks. SoFinder refuses
to boot with a store that cannot safely coordinate uploads and maintenance.

### Define authorization

Authentication alone does not grant file access. Every protected operation is
checked as a Laravel Gate ability named `sofinder.<operation>`, with the
resource and path passed as arguments. For an administrator-only installation,
the host can grant the complete SoFinder namespace centrally:

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::before(static function (User $user, string $ability): ?bool {
    if (str_starts_with($ability, 'sofinder.')) {
        return $user->is_file_manager_admin;
    }

    return null;
});

Gate::define('ROLE_ADMIN', static fn (User $user): bool =>
    $user->is_file_manager_admin
);
```

For granular policies, define abilities such as `sofinder.list`,
`sofinder.read`, `sofinder.upload`, `sofinder.overwrite`,
`sofinder.create_folder`, `sofinder.rename`, `sofinder.copy`,
`sofinder.move`, `sofinder.delete` and `sofinder.metadata.update`. Returning
`false` denies the operation. Do not use an unconditional `Gate::before` grant
in production.

SoFinder uses Laravel's authenticated actor, session CSRF token, event
dispatcher, URL generator, cache and queue adapters automatically. Its shared
HTTP layer performs the mutation CSRF check and returns the same JSON error
contract as the other bridges.

### Finish and verify

```bash
php artisan config:cache
php artisan route:cache
php artisan route:list --name=sofinder
php artisan sofinder:security:audit
```

Open `/sofinder/browser` as an authenticated, authorized user. Publishing the
assets is optional because the bridge serves its synchronized distribution;
use `php artisan vendor:publish --tag=sofinder-assets` only when the web server
must serve a copied distribution directly.

The complete executable host is available in
[`examples/laravel`](https://github.com/sohophp/sofinder/tree/main/examples/laravel).

## Shared PSR-15 runtime

Slim, Mezzio and plain PHP use the same application factory. Install the bridge
and one PSR-7/PSR-17 implementation:

```bash
composer require sohophp/sofinder-psr15:^1.1 nyholm/psr7:^1.8
```

Create the four mandatory host services. They must use the application's real
identity, policy and session; omitting them is intentionally a construction-time
error.

```php
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\LocalApplicationFactory;

$services = new HostServices(
    $authorization, // AuthorizationInterface
    $actor,         // ActorProviderInterface
    $csrf,          // CsrfTokenProviderInterface
    $events,        // PSR-14 EventDispatcherInterface
    $roles,         // optional RoleAuthorizationInterface
);

$sofinder = (new LocalApplicationFactory(
    $responseFactory,
    $streamFactory,
    $services,
    [
        'resources' => [
            'Files' => [
                'root' => __DIR__ . '/var/files',
                'delivery_mode' => 'proxy',
            ],
        ],
    ],
    __DIR__ . '/var/state',
    __DIR__ . '/var/files',
    prefix: '/sofinder',
))->create();
```

`NativeSessionCsrfTokenProvider` is available for a framework-free PHP session.
Initialize the session before dispatching requests. A custom provider must bind
tokens to the trusted host session and compare them safely. Do not implement an
anonymous allow fallback. If `document_preview.mode` or `maintenance.mode` is
`messenger`, also pass the corresponding available dispatcher to
`LocalApplicationFactory`.

### Slim 4

Install Slim and its PSR-7 implementation, then register the central route
catalog before running the app:

```bash
composer require slim/slim:^4.15 slim/psr7:^1.7
```

```php
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Psr7\Factory\StreamFactory;

$responses = new ResponseFactory();
$app = AppFactory::create($responses);
$sofinder = createSofinderApplication($responses, new StreamFactory());
$sofinder->routes()->registerSlim($app);
$app->run();
```

`createSofinderApplication()` in this example represents the shared factory
bootstrap shown above. Route names and paths come from the central endpoint
catalog, so they must not be duplicated in application routes.

### Mezzio 3

Install Mezzio and a router, create the shared runtime, then register it before
the normal routing and dispatch middleware run:

```bash
composer require mezzio/mezzio:^3.24 mezzio/mezzio-fastroute:^3.13 laminas/laminas-diactoros:^3.6
```

```php
$sofinder = createSofinderApplication($responseFactory, $streamFactory);
$sofinder->routes()->registerMezzio($app);

$app->pipe(new RouteMiddleware($router));
$app->pipe(new DispatchMiddleware());
```

### Plain PHP

A framework-free front controller can send the request through the supplied
middleware and emit its PSR-7 response:

```php
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;

$sofinder = createSofinderApplication($responseFactory, $streamFactory);
$response = $sofinder->middleware()->process(
    ServerRequestFactory::fromGlobals(),
    $fallbackHandler,
);

(new SapiEmitter())->emit($response);
```

The fallback handler receives every request outside `/sofinder` and every
unmatched path. A ready-to-run implementation of the shared factory and all
three front controllers is in
[`examples/psr15`](https://github.com/sohophp/sofinder/tree/main/examples/psr15).

## Core-only and other frameworks

Install `sohophp/sofinder-core:^1.1` when the application needs only the domain
services and no SoFinder browser/API. To integrate another framework, adapt its
request and response objects at the public PSR boundary and reuse the endpoint
catalog; do not copy controllers or bypass authorization, CSRF, path, upload or
streaming checks. Such a host remains headless-supported until it passes the
shared black-box HTTP contract suite.

Before production, also review the [security guide](/security),
[configuration reference](/configuration) and [production checklist](/production).
