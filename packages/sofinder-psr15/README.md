# SoFinder PSR-15 Bridge

PSR-15 middleware and canonical route registration for Slim 4, Mezzio 3 and
plain PSR applications. It exposes the complete 52-route UI/API surface,
including the framework-neutral `/browser` shell and versioned frontend assets.
Hosts that render their own page can construct `RouteRegistrar` with
`includeBrowser: false` to register only the 51 non-presentation routes.

```bash
composer require sohophp/sofinder-psr15:^1.0
```

The bridge supports PHP 8.2–8.5 and remains experimental until the Symfony 1.0
observation gate and executable host parity suites pass. Do not describe an
installation as full-stack support merely because this package can be installed.

Construct `SoFinderApplication` with an `EndpointDispatcher` and `HostServices`,
or use `LocalApplicationFactory` to build the complete 52-action local-storage
runtime from normalized configuration and explicit host services.
`HostServices` requires explicit authorization, actor, CSRF and event-dispatcher
implementations, so the official runtime cannot silently start with anonymous
access. `NativeSessionCsrfTokenProvider` is available for framework-free PHP.
The factory discovers the packaged `dist` directory automatically; consumers
only need to pass `packageDirectory` when deliberately serving a custom build.
Install a PSR-7/PSR-17 implementation such as `nyholm/psr7` or
`guzzlehttp/psr7` for a framework-free host. Publication checks install this
bridge by itself (without Symfony or Laravel) and boot the complete browser and
asset runtime with both implementations.

Runnable Slim, Mezzio and plain PHP front controllers live in
`examples/psr15`. Each host serves the real React browser and every API action;
HTTP and Chromium smoke tests verify the browser bootstrap, assets and shared
configuration API. The example deliberately denies protected operations until
a real host supplies its services.

Documentation: <https://sofinder.sohophp.app/framework-support>

License: MIT.
