# Upgrading SoFinder

## From 0.1.0-beta.1 to 0.1.0-beta.2

No storage migration is required. This release separates thumbnail traffic
from image-editing request limits. Hosts may override the new
`so_finder.limits.thumbnail` group; its defaults are 600 requests per minute
and 16 concurrent requests. Rebuild or replace the bundled assets when the
host publishes assets separately. Browser language preferences now include
English, Simplified Chinese and Traditional Chinese.

## From a Composer path repository to 0.1.0-beta.2

1. Commit or back up the host configuration and business uploads.
2. Remove the local `repositories` path entry from the host `composer.json`.
3. Require `sohophp/sofinder:0.1.0-beta.2` and run Composer update.
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
