# SoFinder

SoFinder is an original MIT-licensed file manager for PHP 8.5. It provides a
framework-independent core, a Symfony 7.4 bundle, and a React user interface.

The project is independently designed and does not contain code, artwork,
translations, styles, or other assets from proprietary file managers.
Runtime dependency notices are recorded in `THIRD_PARTY_NOTICES.md`.

## Symfony installation

Register `SohoPHP\SoFinder\SoFinderBundle`, import
`@SoFinderBundle/Resources/config/routes.yaml`, and configure one or more
resource types under `so_finder.resources`. See `docs/symfony.md`.

Implemented capabilities include authenticated browsing, search, upload,
download, folder creation, rename, recoverable deletion, copy/move with automatic
conflict names, server-bounded pagination, name/size/date sorting, grid/list
views, multi-select and bounded batch copy/move/delete with per-entry results,
folder-tree navigation, context/long-press menus, clipboard and targeted drag
and drop, per-file/chunked upload progress, cancellation, explicit conflict
replacement, cached thumbnails, EXIF-aware image rotation and proportional
resize, Canvas-based cropping, derived-image presets, bounded ZIP downloads,
responsive layout, English and
Simplified Chinese, and CKEditor 4 browse/upload adapters.

Resources may define byte quotas, required Symfony roles and operation-specific
role overrides. Completed mutations emit structured PSR-3 audit log entries.
Per-user favorites, tags, and 50 recent entries are stored atomically through a
replaceable metadata store interface.
The Symfony integration also includes a validated theme configuration, a
tagged plugin descriptor registry, keyboard file navigation, visible focus,
and screen-reader selection announcements. See `docs/plugins.md` for the
public extension contract.

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
`sofinder:trash:cleanup`; see `docs/security.md`.

Image processing uses GD when available. Decoded images are limited to 50
million pixels and edits preserve the original file format and extension.
Thumbnail cache entries expire after 30 days and are capped at 5,000 files.
ZIP downloads accept at most 100 selected roots, 1,000 total entries and 512 MB.

## Development

```bash
composer install
vendor/bin/phpunit
cd frontend
corepack pnpm install
corepack pnpm build
```
