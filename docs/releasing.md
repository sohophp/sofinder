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

The current beta's exact Composer constraint is
`sohophp/sofinder:0.1.0-beta.19`. Published tags must never be moved.

The S3 adapter is maintained in `packages/sofinder-s3` and released as an
independent repository after the matching core prerelease. The current adapter
release is `v0.1.0-beta.2`:

1. Split the package directory from the exact core release commit with
   `git subtree split --prefix=packages/sofinder-s3 -b release/sofinder-s3-beta.2`.
2. Push that branch to `https://github.com/sohophp/sofinder-s3` as `main`.
3. Run the package's own MinIO CI, then create the immutable
   `v0.1.0-beta.2` tag without moving the core tag.
4. Confirm Packagist has indexed the new adapter tag.
5. Verify installation in a clean Symfony project before enabling a host
   resource. Never copy credentials into either repository or release logs.
