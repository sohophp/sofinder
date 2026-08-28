# Upgrading SoFinder

## From 0.1.0-beta.25 to 0.1.0-beta.26

Deploy the complete rebuilt `dist/` directory. CKEditor 5 integrations can keep
passing `createCkeditor5UploadPlugin(options)` directly in `plugins` or
`extraPlugins`; the factory now returns the constructible plugin expected by
current CKEditor releases. Remove any host-side wrapper that called the old
adapter function manually. No stored files or backend configuration change.

## From 0.1.0-beta.24 to 0.1.0-beta.25

Deploy the complete rebuilt `dist/` directory so the selection-actions popup
is not clipped by the horizontally scrollable toolbar. No file, metadata,
configuration or public API migration is required. Documentation hosts should
rebuild all locales together so navigation and pagination retain the active
locale.

## From 0.1.0-beta.23 to 0.1.0-beta.24

- Deploy the complete rebuilt `dist/` directory. Existing stored files remain
  compatible and no eager scan is performed.
- `asset_search` is enabled by default and uses a bounded authorized scan. Large
  installations should provide an indexed `AssetSearchProviderInterface`.
- `asset_usage` and `asset_access_sessions` remain disabled until explicitly
  configured. Multi-node deployments automatically use shared atomic state, or
  may provide their own shared stores.
- Existing asset catalogs may be populated incrementally, or explicitly with
  `sofinder:assets:migrate --dry-run` followed by the same command without
  `--dry-run` after reviewing the result.
- Private access-session URLs are short-lived bearer credentials. They must not
  be stored as permanent editor content or logged by the host application.
- Hosts that register asset usage should run deletion preflight and still apply
  their own business authorization before confirming deletion.

## From beta.20 to beta.21–beta.23

- Existing Picker 1.0 messages and upload `entry` responses remain valid. New
  consumers may read the additive `asset` object and independent upload SDK and
  editor-adapter ESM entries.
- `asset_catalog`, `image_variants` and `workspaces` default to disabled. Enable
  one capability at a time after configuring authorization and shared state.
- Cluster deployments that enable the asset catalog must use the configured
  atomic state service or a custom shared `AssetCatalogInterface` service.
- Workspace resolvers must be host-authenticated and constrain resources. Do not
  derive a workspace directly from an untrusted query parameter.
- Plugin descriptors normalize to `descriptorVersion: "1.0"`; unknown fields
  and unsafe URLs now fail. Run `./scripts/php-bin.sh bin/console
  sofinder:plugin:validate --json` before deployment.
- Legacy operation events continue to fire. New integrations should consume
  `AssetOperationEvent`; existing listeners do not need removal.

## From 0.1.0-beta.19 to 0.1.0-beta.20

Deploy the complete rebuilt `dist/` directory together; stored files require no
migration. Quick access metadata remains backward compatible, while new clients
also consume typed file/folder/stale descriptors. The host-level
`features.quick_access` gate is independent from Favorites and remains
authoritative over browser preferences.

User settings now include named profiles and a separate system-default reset.
Language packs are loaded as manifest-allowlisted chunks, so every generated
asset must be deployed. `/live` is intentionally anonymous and minimal in the
reference configuration; keep `/health`, `/metrics` and security status behind
monitoring or administrator authentication. Office preview deployments should
verify both cached and newly converted full-screen XLSX previews.

## From 0.1.0-beta.18 to 0.1.0-beta.19

No files, metadata or APIs are migrated. The Symfony demo and quick-start
examples now use a broader recommended allowlist for common Office,
OpenDocument, text, image, archive, audio and video files. Existing host
applications keep their configured `allowed_extensions`; copy the expanded
list only where those formats should be accepted. The active/executable
extension denylist and upload size limits are unchanged.

## From 0.1.0-beta.17 to 0.1.0-beta.18

No files or metadata are migrated. The Symfony example's `APP_ENV=s3` now
registers only `S3Files`; deployments that intentionally demonstrate a second
provider must switch to `APP_ENV=s3_dual` and define every required
`SOFINDER_PROVIDER_*2` value. Production host configurations are unchanged.

## From 0.1.0-beta.16 to 0.1.0-beta.17

Deploy all rebuilt browser assets together. Existing files and metadata need no
migration. New host feature gates default to enabled for compatibility; disable
`batch_rename`, `image_editing`, `image_processing`, `document_preview` or
`security_status` explicitly when required.

Cross-origin picker callers must be exact entries in `picker.allowed_origins`.
When `cluster.state_service` is configured, SoFinder now shares metrics,
maintenance state and chunk-session coordination automatically. Every node must
mount `chunk_dir` at the same private shared path, or provide a custom
`cluster.chunk_upload_store_service`. Run `/health`, scrape `/metrics`, and
complete one resumable upload before switching traffic.

## From 0.1.0-beta.15 to 0.1.0-beta.16

Deploy `sofinder.js`, `sofinder-picker.js` and `sofinder.css` together. Stored
files and metadata need no migration. Browser tool preferences now use the
`sofinder.tools.v3` key; batch rename and optimize/watermark are intentionally
off until each user enables them in Settings. Grid and list sizes are stored
independently under `sofinder.viewSizes.v1`.

PDF preview works without LibreOffice. Office preview requires
`document_preview.office: true` and a working LibreOffice binary; check `/health`
after deployment. Private resources may use signed URLs or a configured
`entry_url` host route. Review the new security headers against any host-level
CSP before enabling third-party plugin UI assets.

## From 0.1.0-beta.14 to 0.1.0-beta.15

Deploy the rebuilt `sofinder.js`, `sofinder-picker.js` and `sofinder.css`
assets together. Existing routes and file data need no migration. Multi-node
hosts may opt into the new PDO or Redis state stores by overriding the metadata,
usage and request-gate aliases; single-node file stores remain the default.
Protect `/health` and `/metrics` with the host's monitoring role or network
policy. Run `sofinder:security:audit --json` as a deployment gate.
All optional `features` default to enabled for compatibility. Hosts may disable
them explicitly; browser-local preferences can no longer re-enable a disabled
host feature. No metadata migration is required.

## From 0.1.0-beta.13 to 0.1.0-beta.14

Thumbnail cache files now receive the configured filesystem mode after atomic
publication. Defaults remain `0775` for directories and `0664` for files. Hosts
where PHP-FPM and deployment processes share a group may opt into setgid
directories explicitly:

```yaml
so_finder:
  filesystem_permissions:
    directory_mode: '2775'
    file_mode: '0664'
```

The values must be quoted octal strings. Existing files are not changed; repair
historical ownership or modes once before deploying when required.

## From 0.1.0-beta.12 to 0.1.0-beta.13

- CKEditor 4 quick uploads now preserve an existing conflicting file and save the new upload with a CKFinder-style suffix such as `photo(1).jpg`. Integrations receive the actual renamed URL and a successful-upload warning.
- Hosts that intentionally require the previous replacement behavior must set `so_finder.ckeditor4.overwrite_on_upload: true` and grant the independent `overwrite` operation. The safe default is `false`.
- Custom multipart upload clients may opt into the same behavior with `autoRename=1`. No stored-file, database or asset migration is required.

## From 0.1.0-beta.11 to 0.1.0-beta.12

- Rebuild or deploy the committed `dist/` assets. Picker integrations that need the complete authenticated toolbar should add `uiTools=full`; the default remains the smaller common picker toolbar.
- File names are now rejected when they use non-portable reserved characters or names, trailing dots/spaces, bidirectional controls or invalid UTF-8. Rename and edited-image copy extensions are immutable.
- HTTP directory page sizes are bounded to 10–500; the browser default remains 100.

## From 0.1.0-beta.6 to 0.1.0-beta.7

The default browser no longer renders the dark SoFinder brand header. Restore a
brand-only header with `so_finder.ui.header: true` and its mark with
`so_finder.ui.logo: true`. Existing language, view, scale and feature browser
preferences remain valid. Cursor-capable HTTP clients must accept `total: null`.

Remote adapters that cannot use the configured recycle bin should continue to
report `recoverableDelete: false`; deletion then becomes explicitly permanent.
Implement `StorageAuditProviderInterface` to participate in the main security
audit. Existing local adapters need no changes.

## From 0.1.0-beta.5 to 0.1.0-beta.6

This is a documentation-only release. No configuration, storage, API or asset
migration is required. Existing `maintenance`, `ui.scale`, file paths and public
URLs remain unchanged.

## From 0.1.0-beta.4 to 0.1.0-beta.5

No file, URL or metadata migration is required. Maintenance defaults to bounded
`inline` execution, so existing hosts remain safe without cron or a worker.
Hosts with Symfony Messenger may select `maintenance.mode: messenger`; install
`symfony/messenger`, route `MaintenanceMessage` to an asynchronous transport and
run a consumer before switching modes. `external` retains Console/cron control,
while `disabled` turns off opportunity cleanup but not recycle-bin capacity
enforcement. The optional `ui.scale` default is `standard`.

## From 0.1.0-beta.3 to 0.1.0-beta.4

No stored files, public URLs, metadata or recycle-bin data require migration.
HEIC, HEIF and TIFF are no longer image-pipeline formats. Remove their
extensions and MIME aliases from image-only resources. They may remain in a
general `Files` resource, where SoFinder treats them as ordinary downloadable
files without decoding, dimensions, thumbnails or image editing.

Existing non-web files are not deleted. They remain visible as ordinary files
but cannot be selected in image mode or passed to an image endpoint. Run
`sofinder:image:capabilities` and `sofinder:security:audit` after upgrading.

## From 0.1.0-beta.2 to 0.1.0-beta.3

No stored files, public URLs, metadata or recycle-bin data require migration.
PHP applications implementing `StorageAdapterInterface` must update once:

1. Replace `list(string $path): array` with
   `list(ListQuery $query): ListingPage` and add `capabilities()`.
2. Move `absolutePath()` to `LocalPathProviderInterface` when the adapter can
   expose a safe local path.
3. Move `usage()` to `StorageUsageProviderInterface` when a full scan is
   available.
4. Register adapters through a tagged `StorageAdapterFactoryInterface`; the
   built-in `adapter: local` configuration is unchanged.

SoFinder now supports PHP 8.2 through 8.5 and Symfony 6.4 or 7.4. The HTTP
routes and beta.2 response fields remain compatible. Configuration may add an
adapter-specific `options` map. Schedule `sofinder:uploads:cleanup` alongside
the existing recycle-bin cleanup command.

## From 0.1.0-beta.1 to 0.1.0-beta.2

No storage migration is required. This release separates thumbnail traffic
from image-editing request limits. Hosts may override the new
`so_finder.limits.thumbnail` group; its defaults are 600 requests per minute
and 16 concurrent requests. Rebuild or replace the bundled assets when the
host publishes assets separately. Browser language preferences now include
English, Simplified Chinese and Traditional Chinese.

## From a Composer path repository to a tagged release

1. Commit or back up the host configuration and business uploads.
2. Remove the local `repositories` path entry from the host `composer.json`.
3. Require the intended immutable SoFinder tag and run Composer update.
4. Keep the existing `so_finder` resource roots and public URLs unchanged.
5. Add a private writable `usage_dir`, then run
   `sofinder:usage:recalculate` once for every resource.
6. Warm the production Symfony cache and run `sofinder:security:audit`.

`overwrite` is an independent authorization operation starting with this beta.
Host adapters must map it to a modification permission. Unknown operations
should be denied. Move and restore operations that replace an existing target
also require `overwrite`.

Published tags are immutable. Fixes are delivered as a new prerelease or patch
version; never repoint an existing tag.
