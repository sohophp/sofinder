# SoFinder PSR-15 hosts

This executable example exercises the same shared endpoint dispatcher through
Slim 4, Mezzio 3 and a framework-free PSR-15 front controller. It builds all
51 shared non-browser handlers, while deliberately denying protected operations;
real hosts must replace the four explicit services in `RuntimeFactory` with
their authorization, actor, CSRF and event-dispatcher implementations.

Install once:

```bash
../../scripts/composer.sh install --no-interaction --prefer-dist
```

Start one host and request `http://127.0.0.1:8080/sofinder/live`:

```bash
../../scripts/php-bin.sh -S 127.0.0.1:8080 public/slim.php
../../scripts/php-bin.sh -S 127.0.0.1:8081 public/mezzio.php
../../scripts/php-bin.sh -S 127.0.0.1:8082 public/plain.php
```

Each successful response uses the shared JSON contract and security headers.
`/sofinder/api/capabilities` and `/sofinder/health` also exercise non-liveness
handlers; protected endpoints return `403 access_denied`, never an anonymous
allow default.

`SOFINDER_EXAMPLE_AUTHORIZED=1` enables only the repository's isolated
cross-host fixture with a fixed CSRF token. It is not an authentication mode
and must never be enabled in deployment.
