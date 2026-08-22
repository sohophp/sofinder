# Changelog

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
