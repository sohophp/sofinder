# Upgrading SoFinder

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
