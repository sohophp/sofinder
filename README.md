# SoFinder

> **Documentation:** [English](https://sofinder.sohophp.app/) · [简体中文](https://sofinder.sohophp.app/zh-CN/) · [繁體中文](https://sofinder.sohophp.app/zh-TW/) · Repository: [简中](README.zh-CN.md) / [繁中](README.zh-TW.md)

SoFinder is an original MIT-licensed file manager for PHP 8.2 through 8.5. It
provides a framework-independent core, a Symfony 6.4/7.4 bundle, and a React
user interface.

The project is independently designed and does not contain code, artwork,
translations, styles, or other assets from proprietary file managers.
Runtime dependency notices are recorded in `THIRD_PARTY_NOTICES.md`.

Users can start with the [file manager guide](https://sofinder.sohophp.app/user-guide), [image guide](https://sofinder.sohophp.app/image-guide) and [editor integration guide](https://sofinder.sohophp.app/editor-integrations). Developers should use the [integration guide](https://sofinder.sohophp.app/developer-guide) and [HTTP API reference](https://sofinder.sohophp.app/api-reference).

## Symfony installation

Register `SohoPHP\SoFinder\SoFinderBundle`, import
`@SoFinderBundle/Resources/config/routes.yaml`, and configure one or more
resource types under `so_finder.resources`. Follow the
[installation guide](https://sofinder.sohophp.app/getting-started) or see
[`docs/symfony.md`](docs/symfony.md) for the complete Symfony reference.

Implemented capabilities include authenticated browsing, search, upload,
download, folder creation, rename, recoverable deletion, copy/move with automatic
conflict names, server-bounded pagination, name/size/date sorting, grid/list
views, multi-select and bounded batch copy/move/delete with per-entry results,
folder-tree navigation, context/long-press menus, clipboard and targeted drag
and drop, per-file/chunked upload progress, cancellation, explicit conflict
replacement, cached thumbnails, EXIF-aware image rotation and proportional
resize, Canvas-based cropping, derived-image presets, bounded ZIP downloads,
responsive layout, English, Simplified Chinese, Traditional Chinese, CKEditor 4
browse/upload adapters, and a popup SDK for CKEditor 5, TinyMCE, TipTap, Quill, wangEditor
and ordinary form fields. Folder upload, deterministic batch rename, bounded
text preview and SHA-256 checksums are available in the standalone manager.

Resources may define byte quotas, required Symfony roles and operation-specific
role overrides. Completed mutations emit structured PSR-3 audit log entries.
Per-user favorites, tags, and 50 recent entries are stored atomically through a
replaceable metadata store interface.
The optional asset catalog adds stable IDs, localized alternative text, titles,
shared tags and responsive variants. Beta.24 adds bounded cross-folder asset
search, editable asset properties, host-registered usage references with delete
preflight, revocable private access sessions and an explicit migration command.
The Symfony integration also includes a validated theme configuration, a
tagged plugin descriptor registry, keyboard file navigation, visible focus,
and screen-reader selection announcements. See `docs/plugins.md` for the
public extension contract.

Production integrations can add same-origin plugin UI actions and tagged upload
scanners without weakening core authorization. Optional PDO/Redis atomic state,
readiness and Prometheus endpoints, request IDs and JSON security audits support
multi-node operation; see `docs/production.md` and the OpenAPI document at
`docs/public/openapi.json`.

Image details report decoded pixel dimensions. Image edits default to an
automatically named copy; overwrite is explicit. Cropping supports zoom, pan,
eight handles, ratios, keyboard/numeric tuning, undo/redo and comparison. A
per-browser gear menu controls optional
image tools; rotation and preset sizes are hidden by default. Copy and move use
a folder picker that can navigate the complete configured resource while the
server continues to enforce its path sandbox and ACLs.
Each resource can independently limit Unicode file-name length, folder-name
length, and folder depth. These limits are enforced for upload, folder
creation, rename, copy, and move, including the descendants of transferred
folder trees.

Uploads use a private quarantine, actual-byte limits, active-content inspection
and full image decoding before atomic publication. SoFinder also provides
inherited path ACLs, public/proxy delivery, Range/ETag responses, operation
gates, structured failure audits and a private 30-day recycle bin. Run
`sofinder:security:audit` during deployment and schedule
`sofinder:trash:cleanup` and `sofinder:uploads:cleanup` when using an external
scheduler. Bounded inline maintenance is the default; see
`docs/maintenance.md` and `docs/security.md`.

Image processing supports web-embeddable JPEG, PNG, GIF, WebP, AVIF, BMP and
ICO, using GD when available and an optional Imagick ICO fallback. Decoded
images are limited to 50 million pixels and edits preserve the original file
format and extension. HEIC, HEIF and TIFF may be stored in a general file
resource but are not decoded, previewed or edited.
Thumbnail cache entries expire after 30 days and are capped at 5,000 files.
ZIP downloads accept at most 100 selected roots, 1,000 total entries and 512 MB.

## Development

```bash
./scripts/composer.sh install
./scripts/php-bin.sh vendor/bin/phpunit
./scripts/composer.sh phpstan
cd frontend
corepack pnpm install
corepack pnpm build
corepack pnpm test:unit
cd ../docs
corepack pnpm install
corepack pnpm build
```

The supported storage extension contract is documented in
`docs/storage-adapters.md`; public PHP contracts, HTTP compatibility and
versioning are documented in `docs/php-contracts.md`, `docs/http-api.md` and
`docs/versioning.md`. Supported raster codecs and their runtime requirements
are listed in `docs/image-formats.md`. Runnable Symfony 6.4 and 7.4
installation variants are under `examples/symfony`.

S3-compatible object storage is available as the optional
`sohophp/sofinder-s3` Composer package. It keeps AWS SDK dependencies out of the
core install and supports private proxy delivery or an explicitly configured
public/CDN URL. See `packages/sofinder-s3/README.md` in the source distribution.
