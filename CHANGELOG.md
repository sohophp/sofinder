# Changelog

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
