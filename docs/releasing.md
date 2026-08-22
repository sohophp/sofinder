# Release procedure

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
`sohophp/sofinder:0.1.0-beta.4`. Published tags must never be moved.
