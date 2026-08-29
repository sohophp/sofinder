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

The application must provide compatible PSR-7 and PSR-17 factories plus explicit
authorization, actor, workspace, CSRF and event-dispatcher services.

Documentation: <https://sofinder.sohophp.app/framework-support>

License: MIT.
