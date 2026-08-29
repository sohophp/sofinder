# SoFinder PSR-15 Bridge

PSR-15 middleware and canonical route registration for Slim 4, Mezzio 3 and
plain PSR applications. It exposes all shared non-presentation endpoints; the
host-rendered `/browser` page is intentionally outside this package.

```bash
composer require sohophp/sofinder-psr15:^1.0
```

The bridge supports PHP 8.2–8.5 and remains experimental until the Symfony 1.0
observation gate and executable host parity suites pass. Do not describe an
installation as full-stack support merely because this package can be installed.

Construct `SoFinderApplication` with an `EndpointDispatcher` and `HostServices`.
`HostServices` requires explicit authorization, actor, CSRF and event-dispatcher
implementations, so the official runtime cannot silently start with anonymous
access. `NativeSessionCsrfTokenProvider` is available for framework-free PHP.

Runnable Slim, Mezzio and plain PHP front controllers live in
`examples/psr15`. The example deliberately exposes only the public liveness
action and denies protected operations until a real host supplies its services.

Documentation: <https://sofinder.sohophp.app/framework-support>

License: MIT.
