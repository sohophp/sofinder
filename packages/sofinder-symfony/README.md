# SoFinder Symfony Bridge

The supported Symfony 6.4/7.4 full-stack bridge for SoFinder on PHP 8.2–8.5.
It contains the Bundle, dependency-injection extension, HttpFoundation adapters,
routes, security/CSRF integration, console commands, optional Messenger support
and the compiled React browser assets.

Existing applications should keep the compatibility package:

```bash
composer require sohophp/sofinder:^1.0
```

Direct bridge installation is also supported:

```bash
composer require sohophp/sofinder-symfony:^1.0
```

Both package names expose the existing `SohoPHP\\SoFinder` namespace. Import
`@SoFinderBundle/Resources/config/routes.yaml` under the desired prefix and
configure authorization and CSRF through the host Symfony application.

Documentation: <https://sofinder.sohophp.app/symfony>

License: MIT. Bundled frontend dependency notices are in
`THIRD_PARTY_NOTICES.md`.
