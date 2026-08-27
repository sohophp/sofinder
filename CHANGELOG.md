# Changelog

## Unreleased

- Restrict the Symfony reference file-inspector action and host route to the
  development demo so production and consuming applications never expose it.
- Make every visible list header a server-backed sort control, toggle direction
  on repeated clicks, add MIME-type sorting and use distinct ascending and
  descending icons in both the header and utility menu.
- Close the top-right utility menu when the user clicks outside it, preserve
  interaction with controls inside the menu and support Escape with focus
  restoration.

## 0.1.0-beta.19 - 2026-08-27

- Expand the Symfony demo and quick-start file-resource allowlists to include
  common Microsoft Office/OpenDocument, text, image, archive, audio and video
  formats while retaining the default active/executable extension denylist.

## 0.1.0-beta.18 - 2026-08-27

- Keep the normal Symfony `s3` demo bootable with one configured provider by
  moving the optional second provider to an explicit `s3_dual` environment.
- Add safe defaults for optional S3 prefix, public URL, session token and
  path-style settings while keeping endpoint, bucket and credentials required.
- Add CI coverage that warms the single-provider S3 demo without any provider-2
  variables, preventing optional integrations from breaking the file browser.

## 0.1.0-beta.17 - 2026-08-27

- Isolate the example `Private` resource in a new empty proxy-only root and make
  the security audit reject public/proxy resources sharing a physical root.
- Add automatic inline/Messenger Office preview jobs with idempotent queueing,
  explicit lifecycle states, retries, expiry, shared state, cache cleanup and a
  progress UI that creates the PDF frame only after conversion is ready.
- Share malware scan status across cluster nodes, recover abandoned pending
  scans, add `/live`, pluggable storage/queue probes and Office, queue and
  ClamAV timeout metrics.
- Split optional browser panels into manifest-allowlisted lazy chunks and enforce
  a 100 KiB gzip initial-entry budget while retaining the lightweight Picker.
- Complete typed Office job/OpenAPI/plugin descriptor contracts, pin CI actions
  and service images, enforce coverage, and produce SBOM, SHA-256 and provenance
  evidence for tag-triggered prereleases.

- Add host-enforced gates for batch rename, image editing/processing, document
  preview and security status, covering browser discovery and HTTP routes.
- Add a Markdown picker adapter and exact allowlisted cross-origin popup
  handshakes without wildcard `postMessage` targets.
- Add shared Redis/PDO metrics, maintenance leases/status and official shared
  chunk-session coordination for multi-node deployments with shared staging.
- Add domain-level concurrent upload, overwrite, quota, trash and resumable
  chunk tests, plus atomic trash restore/permanent-delete locking.
- Add image and maintenance health checks, storage latency observations,
  dedicated upload/limiter metrics and a versioned capability endpoint.
- Add runtime config Schema checks and reviewed API snapshots; freeze the 1.0
  plugin UI contract to declaration-only same-origin actions and previewers.
- Pin local development to `.php-version`, route PHP and Composer commands
  through repository launchers, and retain `PHP_BIN` for compatibility runs.

## 0.1.0-beta.16 - 2026-08-26

- Add authenticated PDF previews and optional LibreOffice-backed Office previews
  with private versioned caches, health checks and safe inline responses.
- Add visible malware-scanning status and history, fail-closed ClamAV integration
  and upload states for passed, quarantined, failed and pending scans.
- Add short-lived signed private URLs, configurable stable host-controller URLs,
  hardened Unicode download headers and browser security response policies.
- Add bounded batch image compression, format conversion, text watermarks and
  image watermarks with runtime capability reporting.
- Add lightweight type-specific file icons, independent persistent grid-item and
  list-row sizes, and make batch rename plus optimize/watermark user opt-in tools.
- Add maintenance status, cache cleanup and metadata repair commands with JSON,
  dry-run and machine-readable failure behavior.
- Expand plugin preview and UI extension contracts, API schemas, error catalogs,
  fuzz coverage and release validation for the new public behavior.

## 0.1.0-beta.15 - 2026-08-26

- Add a versioned popup Picker SDK with deep links and adapters for CKEditor 5,
  TinyMCE, TipTap, Quill and ordinary form fields, plus a runnable local matrix.
- Add folder uploads, deterministic batch rename, bounded UTF-8 text previews
  and SHA-256 checksums to the authenticated manager and HTTP API.
- Recover stale or deleted deep-link folders to the resource root without making
  the optional folder tree repeat the missing-path request.
- Add host-enforced feature policy, stale recent-entry cleanup, resilient
  destination browsing and a folder-upload confirmation preview.
- Add safe plugin UI actions and tagged upload-scanner and health-check contracts,
  including a runnable authorized reference plugin and fail-closed clamd
  `INSTREAM` scanner.
- Add PDO and Redis atomic state backends for shared metadata, quota and request
  gates, with multi-process SQLite, Redis, MySQL and PostgreSQL integration coverage.
- Add authenticated readiness and Prometheus endpoints, request correlation,
  machine-readable security audits and a route-checked OpenAPI 3.1 contract.
- Expand and verify the English, Simplified Chinese and Traditional Chinese
  documentation for editor integration, plugins and multi-node production use.

## 0.1.0-beta.14 - 2026-08-26

- Add validated `filesystem_permissions.directory_mode` and `file_mode`
  configuration for local storage and generated thumbnail caches.
- Normalize published thumbnail cache files after atomic `tempnam()` promotion,
  preventing private `0600` work-file permissions from leaking into shared
  deployment directories.

## 0.1.0-beta.13 - 2026-08-25

- Auto-rename CKEditor 4 quick-upload conflicts with CKFinder-style suffixes,
  return the actual URL plus a success warning, and require explicit configuration
  together with independent overwrite authorization before replacing a file.

## 0.1.0-beta.12 - 2026-08-25

- Allow picker integrations to opt into the complete ACL-controlled management, detail and image toolbar with `uiTools=full`, without changing picker selection callbacks.
- Move breadcrumbs into the former brand slot when the logo is disabled, shifting search right on wide layouts while keeping a compact two-row mobile command bar.
- Apply portable-name, length, immutable-extension and resource-extension checks to rename, crop copies, copy/move destinations and auto-renamed trash restores, with actionable browser validation.
- Allow the browser page size to be typed or selected from common values, persist the choice locally, and enforce a 10–500 HTTP limit.
- Show the compact SoFinder logo by default inside the command bar instead of
  adding a separate branded header; `ui.header` now adds the adjacent brand name.
- Keep common create-folder and upload tools, including drop and paste upload,
  available in picker mode; management actions remain hidden unless the host explicitly requests `uiTools=full`.
- Preserve or infer the raster extension for edited copies, avoid binary-image
  script-signature false positives, and present crop-save errors in the editor.
- Lock the crop-copy extension in both the editor and server contract, explain
  the validation performed on save, and reject tampered format changes clearly.
- Restore the default Logo and SoFinder wordmark at a readable size, with the
  centered search and right-aligned controls in the responsive command bar;
  keep the breadcrumb directly above the file list or grid.
- Add comprehensive English, Simplified Chinese and Traditional Chinese user,
  image, CKEditor 4, developer-integration and HTTP API documentation.

## 0.1.0-beta.11 - 2026-08-24

- Keep the live-source Symfony example usable in production mode by defining
  its local `Files` resource in shared configuration.

## 0.1.0-beta.10 - 2026-08-24

- Clear stale directory entries when switching to a resource that fails to
  load, and ignore superseded asynchronous list responses.
- Use configured public/CDN entry URLs for copied links and single-file
  downloads, while private resources continue to use authenticated API URLs.
- Allow each resource to generate entry URLs through a configured Symfony
  route and parameter templates, with optional host-provided database context.
- Expand the live-source Symfony example for direct local and multi-resource
  S3 browser testing without publishing intermediate package versions.
- Render a single subtle panel divider at rest and reveal the wider two-line
  resize affordance only on hover, keyboard focus, or active dragging.

## 0.1.0-beta.9 - 2026-08-24

- Keep image thumbnails fully contained within fixed-height list rows.
- Keep portrait and unusually tall thumbnails contained within fixed-height grid preview cells.
- Keep portrait detail thumbnails fully contained instead of clipping them to the preview panel.
- Allow switching between name and tag search without enabling the optional tag-management UI.
- Consolidate the frontend stylesheet entry and add narrow manager/picker, keyboard, image-ratio and accessibility regressions.
- Use the intended 270px details-panel width when no saved preference exists.
- Replace the custom crop overlay with CropperJS 1.6.2 for aligned handles, reliable corner/edge resizing, and smoother selection drawing.
- Let the server choose a conflict-safe name when saving a crop with the unchanged default copy name.
- Document local frontend and Symfony integration testing without publishing a release.

## 0.1.0-beta.8 - 2026-08-24

- Improve crop-box resizing with diagonal corner handles and directional edge handles.
- Keep the opposite corner fixed while resizing with a locked aspect ratio.
- Prevent crop-box drift and keep resized selections inside image boundaries.
- Add unit tests for crop geometry and rounding behavior.

## 0.1.0-beta.7 - 2026-08-24

- Replace the default branded header with mode-aware manager and picker shells,
  contextual file actions, compact utilities and a picker confirmation bar.
- Add validated host and browser presentation settings without changing ACLs.
- Preserve nullable directory totals and opaque cursor pagination end to end.
- Let non-local adapters opt into security audits and permanent deletion without
  invoking the local recycle bin.
- Add the optional `sohophp/sofinder-s3` package with AWS S3, R2 and MinIO-ready
  endpoint configuration, prefix isolation and bounded recursive operations.

## 0.1.0-beta.6 - 2026-08-23

- Add a Traditional Chinese project README.
- Add Traditional Chinese Symfony integration, maintenance-mode and image-format guides.
- Link each translated guide from its English source document.
- Keep all PHP, HTTP, storage and frontend runtime contracts unchanged.

## 0.1.0-beta.5 - 2026-08-23

- Add bounded `inline`, optional `messenger`, externally scheduled and disabled
  maintenance modes while retaining synchronous recycle-bin capacity safety.
- Serialize cleanup entry points with non-blocking locks and throttle web-request
  cleanup without requiring a daemon or cron service.
- Add compact, standard, large and extra-large interface density settings with
  host defaults and browser-local user preferences.

## 0.1.0-beta.4 - 2026-08-23

- Limit the image pipeline and CKEditor image selection to web-embeddable
  raster formats: JPEG, PNG, GIF, WebP, AVIF, BMP and ICO.
- Treat HEIC, HEIF and TIFF as ordinary files when a `Files` resource allows
  their extensions; they are no longer decoded, previewed or edited.
- Preserve existing non-web files without migration while rejecting new
  HEIC/HEIF/TIFF uploads to Winstar's `Images` resource.
- Clarify the 1.0 support policy, release process and Winstar maintenance
  schedule without changing routes, public URLs or PHP contracts.

## 0.1.0-beta.3 - 2026-08-23

- Support PHP 8.2–8.5 and Symfony 6.4/7.4 with a CI compatibility matrix.
- Add paged storage queries, cursor-ready listing results, storage capability
  declarations and tagged adapter factories.
- Separate local paths, full usage scans, recycle bins, upload sessions and
  request-gate state behind replaceable contracts.
- Add resumable chunk-session status, scheduled stale-session cleanup and an
  explicit restore-conflict dialog.
- Split content delivery and major browser panels into focused modules without
  changing existing HTTP routes or JSON fields.
- Add a central image format registry and per-format GD-first/Imagick-fallback
  capability detection for AVIF, HEIC/HEIF, TIFF and ICO.
- Harden Imagick with fixed allowlisted coders, pre-decode frame/pixel budgets,
  scoped resource limits and browser-safe PNG thumbnails.
- Publish effective image capabilities through the API and console; prevent
  HEIC/HEIF/TIFF selection and QuickUpload insertion in CKEditor image mode.
- Add PHPStan, coverage CI, Range/ETag HTTP contract checks, component tests and
  a 10,000-entry directory regression test.

All notable changes are documented here. This project follows Semantic
Versioning; prereleases may still refine public extension interfaces.

## 0.1.0-beta.2 - 2026-08-22

- Give read-only thumbnails an independent request limit so large image
  directories do not exhaust the stricter image-editing quota.
- Cache versioned thumbnail responses privately and retry transient preview
  failures without leaving broken-image controls in the file browser.
- Make the context-menu preview a dedicated accessible dialog instead of
  invoking the editor file-selection callback.
- Refine the preview layout, move URL copying behind a compact icon and
  click-to-copy dialog, and add a persistent language switch.
- Add consistent responsive padding and localized modification times to file
  details and the preview dialog.
- Add complete Traditional Chinese (`zh-tw`) UI text, locale-aware dates and
  automatic Traditional Chinese browser-language detection.

## 0.1.0-beta.1 - 2026-08-22

- Initial public beta of the framework-independent core and Symfony 7.4 bundle.
- Local storage, secure uploads, ACLs, recycle bin, public/proxy delivery,
  persistent quota accounting and CKEditor 4 integration.
- React file browser with responsive grid/list views, optional tools, tags,
  folder tree, upload queue and Canvas image crop editor.
