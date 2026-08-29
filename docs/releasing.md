---
title: Release procedure
description: Maintainer checklist for testing, tagging and publishing SoFinder packages.
---

# Release procedure

Run the complete local gate from the repository root. `.php-version` selects
the development interpreter through `scripts/php-bin.sh`; use `PHP_BIN` only
for an intentional compatibility run:

```bash
./scripts/release-check.sh
```

1. Confirm `composer validate --strict`, PHPUnit, frontend type checking/build,
   browser tests, accessibility checks and the originality scan all pass.
2. Review dependency audits and `THIRD_PARTY_NOTICES.md`.
3. Complete the trademark gate in `trademark-clearance.md`.
4. Push `main`, create an annotated immutable tag, then create the matching
   GitHub Release.
5. Submit `https://github.com/sohophp/sofinder` to Packagist and configure its
   GitHub update hook.
6. Install the exact version into an empty Symfony project and run the security
   audit before announcing the release.

The current stable Symfony Bridge's exact Composer constraint is
`sohophp/sofinder-symfony:1.0.1`; existing applications may use the compatible
`sohophp/sofinder:1.0.1` Meta Package. Published tags must never be moved.

## Synchronized 1.x packages

For 1.x, split each publishable subtree from the exact release commit and tag
every package participating in that release with the identical version. Internal
dependencies use `self.version`, so publish/index in dependency order: Core,
HTTP, Symfony, S3, then the compatibility Meta Package. PSR-15 and Laravel join
the synchronized minor only after `config/framework-support.json` reports that
the 1.0 observation gate is eligible.

Before tagging, run `scripts/check-package-install.sh`; it installs mirrored
copies rather than symlinks and checks every archive's README, license, runtime
autoload boundary and Symfony frontend notices. Never publish a subtree that
only works because files remain available in the monorepo root.

`scripts/build-release-archives.sh 1.0.0-rc.1 WORKTREE <output>` previews the
five archives locally. On a tag, the release workflow rebuilds them from the
immutable Git object rather than the checkout, verifies their package identity
and runtime contents, then publishes one sorted `SHA256SUMS` file. A hyphenated
tag such as `v1.0.0-rc.1` becomes a prerelease; `v1.0.0` becomes the latest
stable release.

Before the first 1.x tag, create the `sohophp/sofinder-core`,
`sohophp/sofinder-http`, `sohophp/sofinder-symfony` and
`sohophp/sofinder-s3` repositories, register each Composer package with
Packagist, and configure the `SOFINDER_PACKAGE_PUSH_TOKEN` Actions secret with
write access to those repositories. The release job builds reproducible
subdirectory-history bundles, verifies their package identity and checksum,
then atomically pushes `main` and the immutable version tag without force. A
missing repository/token or a non-fast-forward branch stops the release before
the GitHub Release is created. PSR-15 and Laravel repositories are included only
after the promotion gate is eligible.

CI also runs `scripts/check-gated-bridge-release-artifacts.sh` with an isolated
test-only eligible policy. It builds the future Laravel and PSR-15 archives and
split repositories, publishes all six package repositories to local bare
remotes, and installs the synchronized RC into a clean consumer. The policy
override is rejected unless explicit test mode is enabled and is never used by
the tag release workflow, so this rehearsal cannot open the production gate.

This split is a publishing boundary, not a departure from monorepo development:
[Packagist requires each package's `composer.json` at the top of the submitted
VCS repository](https://packagist.org/about), while authoritative development
continues in this monorepo.

An RC consumer must allow RC transitive dependencies because synchronized
packages use `self.version`; use a root `minimum-stability` of `RC` together
with `prefer-stable: true`, or wait for the stable tag. Stable 1.x consumers do
not need this override.

The daily `Symfony 1.0 observation` workflow starts only after the immutable
`1.0.0` GitHub Release exists. In addition to collecting defect evidence, it
installs the exact Core, HTTP, Symfony, compatibility Meta and S3 versions from
Packagist into empty projects on PHP 8.2 and 8.5, verifies their repository
provenance and runtime boundaries, and audits the resulting Symfony and S3
dependency locks.
Maintainers must apply the exact `priority:p0` or `priority:p1` label to
qualifying issues. Each run uploads a 90-day JSON artifact with the release
timestamp, covered days, open count and every P0/P1 issue created during
observation; any such issue fails the run, even when it is already closed. Use
the final successful workflow run, including both published-package jobs, as
the defect-audit URL when opening the framework promotion gate. Run
`scripts/check-published-package-install.sh` locally to repeat the registry
check with an isolated Composer cache.

The S3 adapter is maintained in `packages/sofinder-s3` and released to its
independent repository by the synchronized workflow. Its historical prerelease
is `v0.1.0-beta.2`; the 1.x line uses the same version as Core. Before enabling
a host resource, confirm its Packagist tag and clean-project installation, and
never copy credentials into either repository or release logs.
