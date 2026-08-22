# Versioning and compatibility

SoFinder follows semantic versioning. Releases before 1.0 may change PHP
extension interfaces when the changelog and `UPGRADING.md` provide a migration.
The beta.3 storage-contract change is the final planned breaking change before
1.0.

Starting with 1.0:

- HTTP routes, documented JSON fields and public PHP contracts remain backward
  compatible throughout 1.x.
- New optional fields, capability flags, events and interfaces may be added in
  minor releases. Clients must ignore unknown JSON fields.
- Deprecations remain available for at least one minor release and are listed
  in the changelog before removal in the next major version.
- Security fixes and data-integrity fixes may tighten validation without a
  deprecation period.
- Published Composer tags are immutable.

The 1.0 support matrix is PHP 8.2–8.5 with Symfony 6.4 LTS or 7.4 LTS. The
bundled local adapter is the only storage backend covered by the 1.0 support
promise. The React application remains a private build input shipped in the
Composer package; no npm package is published for 1.0.
