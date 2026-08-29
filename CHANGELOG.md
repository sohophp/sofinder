# Changelog

## Unreleased

- Verify promotion evidence against live successful GitHub Actions runs before
  a gated bridge release, matching the Symfony matrix commit, workflow paths,
  main branch and post-observation execution dates instead of trusting URLs.
- Treat the framework promotion version as a stable minimum rather than an
  exact tag, recording 1.0.1 truthfully without resetting the observation
  clock anchored to the immutable 1.0.0 release.
- Replace retired beta install commands across the three documentation locales
  and repository READMEs with the stable Symfony Bridge 1.x package, while
  retaining the original package name as an explicit compatibility option.
- Continuously install all five immutable stable 1.0.0 packages from Packagist
  into cache-isolated clean projects on PHP 8.2 and 8.5, verifying repository
  provenance, framework boundaries and dependency audit status throughout the
  30-day observation period.
- Install the future PSR-15 split package in a framework-free clean consumer,
  assert that it pulls neither Symfony nor Laravel, and boot the complete
  browser/asset runtime independently with Nyholm and Guzzle PSR-7 factories.
- Install the future Laravel split repository into clean Laravel 12/PHP 8.2
  and Laravel 13/PHP 8.5 applications during publication rehearsal and execute package discovery,
  config/route caches, all 52 routes, Artisan, browser, CSRF, upload, download,
  Range and frontend-asset checks against the installed package.
- Let the PSR-15 local application factory discover its packaged frontend
  distribution automatically, and boot `/browser` plus a real asset from a
  clean Composer consumer of the future split repository.
- Add the framework-neutral browser action to the PSR-15 local runtime, register
  all 52 catalog routes by default, and boot the real React UI in Chromium
  against Slim 4, Mezzio 3 and plain PHP on both PHP matrix boundaries.
- Make `sohophp/sofinder-s3` a framework-neutral Core adapter library and move
  its backward-compatible Bundle and DI extension into the Symfony bridge, so
  headless S3 installs no longer pull in or expose Symfony integration.
- Generate the Symfony route collection directly from the framework-neutral
  endpoint catalog while preserving the existing Bundle YAML import,
  route names, requirements and host prefix behavior. Keep Symfony's `/browser`
  host rendered while routing all 51 HTTP operations through the shared PSR
  dispatcher instead of legacy per-feature Controller parsing.
- Validate the canonical endpoint catalog and OpenAPI document in both
  directions, rejecting undocumented runtime routes and phantom documented
  operations before any framework bridge is released.
- Preflight the still-gated Laravel and PSR-15 synchronized release path with
  seven immutable archives, six split repositories, atomic local publication
  and a clean consumer that installs all PHP 8 packages at one RC version.
- Expand both monorepo and future split-package Laravel CI from boundary-only
  checks to every supported pair: Laravel 12 on PHP 8.2–8.5 and Laravel 13 on
  PHP 8.3–8.5, with executable example coverage for the same seven pairs.
- Exercise real authentication and authorization boundaries across every host:
  Symfony retains its native Basic 401 challenge, while authenticated-but-denied
  uploads and framework-neutral unauthenticated requests share the stable 403
  `access_denied` body and security-header contract.
- Move deploy-time storage and private-directory auditing into the
  framework-neutral Core `SecurityAuditor`, retain the Symfony Console surface,
  expose the identical JSON contract through Laravel Artisan, and wire Laravel's
  malware-scanning configuration into the shared fail-closed ClamAV pipeline.
- Run one real upload-to-purge lifecycle through Symfony, Laravel, Slim, Mezzio
  and plain PHP, comparing multipart upload, content/download Range streams,
  ETag revalidation, rename, copy, move, recycle-bin restore and permanent delete.
- Preserve selected-representation type, disposition and length metadata on
  conditional 304 stream responses so Slim does not substitute `text/html`.
- Execute the canonical 51-route inventory against real Symfony, Laravel,
  Slim, Mezzio and plain PHP hosts, comparing status/error envelopes, response
  shape and security headers while retaining lifecycle tests for mutations and
  streams.
- Run a real Chromium UI smoke against the Laravel 12 and 13 boundary examples,
  covering browser bootstrap, session CSRF configuration, shared API discovery,
  security headers and frontend runtime errors.
- Give Laravel and framework-neutral PSR runtimes the same runtime, storage,
  image, document-preview and maintenance readiness probes as Symfony instead
  of returning readiness from an empty check collection.
- Make every PHP 8 package conflict with `sohophp/sofinder-legacy`, preventing
  Composer from mixing the independent PHP 7 and PHP 8 product lines.
- Add the framework-neutral `ConfigurationNormalizer`, make Symfony pass its
  resolved YAML configuration through it, and verify equivalent plain PHP array
  defaults, list replacement, legacy aliases and security limit validation.
- Add a daily, read-only Symfony 1.0 observation workflow that records all P0/P1
  issues created after release, including already closed defects, as promotion
  evidence instead of relying on a one-time open-issue count.
- Build deterministic subtree Git bundles for every synchronized package and
  publish their `main` branch plus immutable tag atomically, so Packagist can
  index real package repositories instead of relying on root release archives.
- Test mirrored package installation on PHP 8.2 with lowest dependencies and
  PHP 8.5 with preferred stable dependencies, including the Legacy conflict.
- Ship package-local PHP/Composer wrappers and pinned independent CI workflows
  in every split repository; development automation remains excluded from
  Composer distribution archives.
- Extract framework-independent resource registry construction and keep the
  Symfony bridge as a thin mount-path adapter, establishing the first tested
  headless integration seam for Laravel, Slim, Mezzio and plain PHP hosts.
- Document the framework support levels and keep any possible PHP 7.2 port on
  a separate compatibility release line after the PHP 8.2–8.5 Symfony baseline.
- Remove Symfony Request types from Workspace extension contracts, add trusted
  framework-neutral request and CSRF ports, and adapt the Symfony bridge.
- Publish the canonical 52-endpoint catalog plus experimental PSR-15 routing
  and a PSR-7 dispatcher with stable error envelopes and security headers.
- Add independently valid experimental `sofinder-http` and `sofinder-psr15`
  subtrees, two-implementation PSR-7 tests and machine-readable framework and
  legacy release policy. Full handler parity remains gated on the 1.0 baseline.
- Physically extract `sofinder-core`, make HTTP depend directly on it, and add
  isolated Composer checks proving Core and PSR-15 installs do not pull Symfony.
- Make the S3 adapter depend on Core instead of the Symfony compatibility package;
  Symfony service registration remains available when the Symfony bridge exists.
- Route liveness, readiness and capability responses through shared HTTP actions,
  with verified Symfony/PSR-7 parity and matching retry headers for domain errors.
- Make the compatibility package consume Core and HTTP through real Composer
  dependencies, retaining PSR-15 only as an experimental development dependency.
- Convert PSR-7 requests into the shared RequestContext and migrate entry listing
  and runtime configuration discovery to shared actions, including black-box
  Symfony/PSR parity for query, pagination and published config payloads.
- Migrate folder creation, rename, copy, move and delete to shared mutation
  actions with fail-closed host authorization, CSRF validation before JSON
  parsing, stable error envelopes and Symfony/PSR filesystem parity tests.
- Migrate batch operations, batch rename and the complete recycle-bin lifecycle
  to shared actions, including route-attribute IDs, FeaturePolicy gates and PSR
  tests for listing, restoring and permanently deleting private trash entries.
- Migrate metadata reads and mutations to shared actions, preserving feature
  filtering, authorization-before-parse, CSRF and Symfony/PSR response parity.
- Migrate bounded SHA-256 checksums and UTF-8 text previews to shared read
  actions with identical Symfony/PSR payloads and FeaturePolicy enforcement.
- Migrate chunk-upload status/cancellation and image-dimension discovery to
  shared actions, retaining workspace isolation, CSRF and upload authorization.
- Pass RequestContext explicitly through workspace resolution and migrate asset
  search plus the complete asset-usage lifecycle to shared Symfony/PSR actions.
- Replace the asset-reference Router dependency with a Core endpoint URL contract
  and migrate asset resolve, detail and metadata update to shared actions.
- Use the URL contract for document-preview jobs and signed URL issuance, add a
  framework-neutral role authorization port, and share the security status API.
- Share content/download, image thumbnail/variant, document preview and signed
  content streams across Symfony and PSR-15, including Range, ETag, cache and
  Unicode Content-Disposition behavior.
- Render Prometheus metrics through the same framework-neutral streaming action
  in Symfony and PSR-15 hosts.
- Complete shared actions for every non-presentation endpoint, including image
  mutations, archives with deterministic temporary-file cleanup, private asset
  sessions, manifest assets, standard/chunk uploads and CKEditor compatibility
  uploads with origin checks and nonce-protected script responses.
- Add dependency-free Slim and Mezzio route registration from the canonical
  endpoint catalog, with optional API-only registration for hosts that supply
  their own browser page.
- Physically extract the Symfony Bundle, adapters, routes and release assets to
  `sofinder-symfony`; turn `sohophp/sofinder` into a compatibility meta package,
  and verify isolated bridge/meta installs plus the real Symfony example.
- Add real Symfony HTTP and Chromium browser smoke tests for authentication,
  session CSRF, uploads, ETag/Range downloads, security headers and compiled
  assets; exercise optional Messenger routing without making it mandatory.
- Give every publishable package its own README, license and support metadata,
  including third-party frontend notices in the Symfony release subtree.
- Build and verify synchronized Meta/Core/HTTP/Symfony/S3 archives from an
  immutable tag, publish shared checksums and provenance, and distinguish RC
  prereleases from stable GitHub releases automatically.
- Require auditable matrix, observation-window and priority-defect evidence
  before the Laravel/PSR-15 promotion gate can become eligible.

## 0.1.0-beta.31 - 2026-08-29

- Add Jodit 4 picker and native uploader adapters, declarations, bundle-size
  checks, tests, documentation and a runnable Symfony demo pane.

## 0.1.0-beta.30 - 2026-08-28

- Add wangEditor 5 picker and upload adapters, declarations, bundle-size checks,
  integration tests, documentation and a runnable Symfony demo pane.

## 0.1.0-beta.29 - 2026-08-28

- Route desktop watermark dragging through mouse events while retaining pointer
  events for touch and pen input, making free placement consistent across
  Chromium, Firefox and WebKit.

## 0.1.0-beta.28 - 2026-08-28

- Keep free watermark dragging active at the window level so Firefox continues
  tracking the pointer after it leaves the watermark element.

## 0.1.0-beta.27 - 2026-08-28

- Make pinned folders, favorite files, recent items and folder navigation
  draggable between the left and right sidebars and sortable within each side,
  with persistent layout and keyboard arrow-key controls.
- Separate saved navigation by purpose: Favorites now accepts files only, while
  Quick access is presented as pinned sidebar folders and accepts folders only.
  Legacy configuration and removable stale metadata remain compatible.
- Consolidate single-image crop, rotation, resize, preset, optimization and
  watermark actions in a responsive editor with accurate image-watermark
  previews and freely draggable percentage-based placement.
- Add compact Interface Sans, Clean Sans and Elegant Serif watermark choices,
  resolving each from explicit configuration or installed CJK fonts with an
  optional locked and SHA-256-verified, on-demand Noto CJK cache download.
- Refresh the editor source after image changes and on every reopen so an
  overwritten watermarked image cannot be replaced by a stale browser copy.
- Encode watermark-only output at quality 100; lower quality is now applied
  only when image optimization is explicitly enabled.
- Open grouping choices in a compact right-side fly-out, automatically moving
  it to the left when the available viewport space is insufficient.
- Restore the batch-rename dialog's structured form and bordered preview table,
  with full-width pattern input, readable guidance and responsive spacing.
- Align right-side folder navigation with the left sidebar using the same
  outlined folder icons, compact rows, indentation and selection feedback.
- Match adaptive image-watermark previews to the server's aspect-ratio and
  height-cap calculations, and avoid unnecessary quality loss across chained
  image actions by encoding intermediate results at maximum quality.
- Consolidate Windows-inspired large, medium and small icon layouts, list,
  details and content rows, compact density, panes and list columns into one
  accessible, persistent View menu.
- Move the supported name, modified-time, type and size ordering controls,
  direction choices and local grouping into an accessible Windows-inspired
  Sort menu while omitting metadata the file API does not provide.

## 0.1.0-beta.26 - 2026-08-28

- Return a constructible CKEditor 5 upload plugin compatible with current
  `plugins` and `extraPlugins` initialization while keeping CKEditor itself in
  the host application's self-hosted build.

## 0.1.0-beta.25 - 2026-08-28

- Redesign the documentation site with a focused landing page, structured guides, localized navigation, responsive dark/mobile layouts, accessibility checks and visual regression coverage.
- Keep Simplified and Traditional Chinese navigation, sidebars and pagination within their active locale, with build-time checks that reject accidental cross-locale links.
- Remove nested horizontal scrollbars from narrow home-page code panels while preserving scrolling for full documentation code blocks.
- Render the manager selection-actions menu outside the horizontally scrollable toolbar so Select all, Clear and Invert selection remain visible and operable at bounded desktop and mobile widths.

## 0.1.0-beta.24 - 2026-08-28

- Add bounded cross-folder/workspace asset search with field/type/tag/extension/size/date filters, URL state, recent searches and an editable asset-properties sidebar.
- Add optional local/shared asset usage tracking, authorized usage APIs and recursive deletion preflight warnings, plus CKEditor stable-ID replacement support and configurable upload resource routing.
- Add opt-in revocable, revision-bound private asset access sessions and the idempotent `sofinder:assets:migrate` dry-run/JSON migration command.
- Publish opt-in `AssetVersionProviderInterface` and suggestion-only `AssetEnrichmentProviderInterface` contracts without enabling version retention or AI processing in core.
- Keep optional tag chips compact and horizontally aligned at every interface scale, including bounded ellipsis for long suggestions.
- Refine asset metadata actions with compact accessible icons and use a host-controlled language selector for localized alternative text while retaining saved locales removed from configuration.
- Complete asset alternative-text delivery across picker/upload integrations, expose metadata editing from details, preview and context menus, and add an independent `metadata.update` write capability.
- Bind resumable upload sessions to the trusted Workspace and add an extensible audit for writable storage roots shared across Workspaces.
- Enable the asset catalog and responsive variants in the Symfony demo, tighten their OpenAPI responses and keep the Picker build self-contained.
- Add a host-controlled Workspace switcher, wrap CKEditor responsive URLs according to its public upload contract, and pin the documentation build to the security-fixed Vite 6.4.3.

## 0.1.0-beta.23 - 2026-08-27

- Add optional host-resolved Workspace contexts and enforce their resource boundary throughout file, asset and user-metadata operations.
- Add schema-versioned asset operation events alongside the legacy event, including safe failure events with operation IDs and error codes.
- Freeze plugin descriptors at schema 1.0, reject unknown fields and traversal URLs, and add `sofinder:plugin:validate --json`.

## 0.1.0-beta.22 - 2026-08-27

- Add an opt-in lazy asset catalog with local and shared-state stores, stable UUIDs across overwrite/move/restore, and optimistic shared metadata updates.
- Add default alternative text, asset titles and shared tags with a lazy details-panel editor that distinguishes unset and decorative alternative text.
- Add bounded, authorization-preserving responsive image variants with configured widths/formats, atomic cache generation and cache maintenance.

## 0.1.0-beta.21 - 2026-08-27

- Add the additive Asset Reference 1.0 response contract while retaining legacy Entry and Picker 1.0 messages.
- Add a framework-independent upload task SDK with progress, cancellation, retry, resumable chunks and all four conflict strategies.
- Add separate CKEditor 5, TinyMCE, TipTap, Quill and generic editor upload modules, declarations, size gates and an expanded integration demo.

- Add a lazy original-image preview with fit, 25/50/100/200% zoom, centering,
  keyboard and Ctrl/Command-wheel controls, retry states and large-image memory
  confirmation while retaining a lightweight thumbnail by default.
- Add a host-controlled upload extension case policy, defaulting to lowercase
  while preserving the base file name and enforcing the same rule for regular,
  chunked and editor uploads; users cannot override it.
- Remove stale Quick access links only after confirmed not-found responses, use
  metadata existence hints, retain links when metadata mutation fails, suppress
  stale responses, refresh active links and synchronize browser tabs.
- Harden local listings against concurrent deletion, replacement, permission and
  symbolic-link races with stable not-found, conflict and unavailable errors.
- Run the complete Chromium, Firefox and WebKit regression suite in the tag
  release workflow as well as CI.
- Prevent settings sections from shrinking to their headings at large interface
  scales; the dialog now owns scrolling while every section keeps its content height.

## 0.1.0-beta.20 - 2026-08-27

- Make LibreOffice-converted Office previews fill the available content area in
  full-screen mode instead of retaining the normal preview-frame height.
- Clarify Office preview submission, queue, conversion and PDF-loading phases,
  suppress cache-hit flicker, and expose converter, cache and job diagnostics in
  the administrator security status view.
- Make Quick access independent from Favorites, preserve backward-compatible
  path metadata while adding file/folder/stale descriptors, and remove missing
  entries safely when opened.
- Reorganize preferences by task, add a separate Restore system defaults action,
  and keep host-disabled capabilities authoritative over saved user profiles.
- Load language packs on demand, lower the initial application budget to 95 KiB
  gzip, and pin the browser regression runner to an exact version.
- Keep `/live` anonymous and deliberately minimal while leaving deep `/health`
  readiness details protected; cover the release UI in Chromium, Firefox and
  WebKit, including dark, mobile, long-name and Windows scaling layouts.
- Keep Quick access visible across storage-root switches by default, add an
  all-roots/current-root preference, and support right-click unpinning.
- Add browser-scoped named preference profiles for saving and immediately
  applying complete UI setting combinations, with overwrite and deletion.
- Rename the folder-tree option to Folder navigation and let each user place it
  in the left or right sidebar.
- Simplify single-file delivery to Download and Share: downloads open in a new
  browsing context, while Share groups Copy URL and the optional locally
  generated QR Code without weakening login or signed-link expiration rules.
- Show a bounded Favorites section in the sidebar, link its heading to a
  dedicated searchable Favorites page, and let each user pin up to 12 folders
  to Quick access through an optional, backward-compatible metadata extension.
- Group Select all, Clear and Invert selection in one menu, and add current-page
  grouping by name, type, size, date or tag plus bounded type filtering.
- Refine list-cell padding, width bounds and ellipsis behavior, and lazy-load
  optional panels and locale packs to retain the 95 KiB gzip entry budget.
- Persist bounded per-user grid/list sizes and list-column widths; list header
  dividers now support pointer dragging, keyboard resizing and double-click
  content fitting.
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
