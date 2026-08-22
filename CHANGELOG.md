# Changelog

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
