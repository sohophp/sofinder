# Image format support

SoFinder validates image contents by fully decoding them before publication.
The available formats depend on the installed processor:

| Format | GD | Imagick fallback | Direct CKEditor image | Thumbnail |
| --- | --- | --- | --- | --- |
| JPEG, PNG, GIF, WebP, BMP | Yes | When its coder is installed | Yes | PNG |
| AVIF | When GD has AVIF support | When its coder is installed | Yes | PNG |
| ICO | No | When the ICO coder is installed | Yes | PNG |
| HEIC / HEIF | No | When the HEIC/HEIF coder is installed | No | PNG |
| TIFF | No | When the TIFF coder is installed | No | PNG |

The default `auto` driver selects GD separately for each format and only falls
back to Imagick when GD cannot decode that format. This keeps ImageMagick's
delegate attack surface out of the normal JPEG/PNG path. Individual coders are
checked at runtime; installing the PHP extension alone does not guarantee that
its ImageMagick build includes a particular delegate.
Read/thumbnail support and write/edit support are reported separately. SoFinder
performs a small, resource-limited encoder round trip once per process before it
advertises an Imagick format as editable; a registered coder with a missing
delegate therefore remains read-only instead of failing later during save.

```yaml
so_finder:
  image_processing:
    driver: auto # auto, gd, or imagick
    max_width: 12000
    max_height: 12000
    max_single_frame_pixels: 50000000
    max_frames: 200
    max_total_pixels: 100000000
    memory_bytes: 268435456
    map_bytes: 536870912
    disk_bytes: 1073741824
    threads: 1
    timeout_seconds: 30
```

Selecting `gd` or `imagick` explicitly fails container startup if that PHP
extension is absent. With `auto`, unavailable formats are reported through the
browser configuration and are disabled in the UI.

Animated and multi-page images may be uploaded when the resource policy permits
them, but editing is rejected when it would flatten the content. Thumbnails use
the first frame and are emitted as PNG so formats that browsers cannot render
directly still work in the file list and preview dialog.

Before a full Imagick decode, SoFinder identifies the content with `fileinfo`,
maps it to a fixed allowlisted coder, pings its dimensions and frames, and
enforces the configured frame and pixel budgets. SVG, PDF, PostScript, URLs and
pseudo-protocols are never passed to automatic ImageMagick coder selection.
Imagick memory, map, disk, thread and time limits are scoped to each operation
and restored afterwards.

SVG, PDF, PostScript, RAW camera formats and ImageMagick pseudo-formats are not
accepted by the image pipeline. They require separate sanitization or delegate
policies and are intentionally outside the supported raster allowlist.

HEIC, HEIF and TIFF remain available for ordinary SoFinder upload, storage,
download and preview. A browser opened with `selection=image` disables their
selection, and QuickUpload returns `image_not_web_embeddable` before writing
them. A browser opened with `selection=file` may still select their public URL
as a normal download link. SoFinder does not silently create a WebP copy.

Run `bin/console sofinder:image:capabilities` after deployment. It exits with a
failure status when a configured image extension has no effective decoder; use
`--json` for deployment automation. `/api/config` exposes the same effective
state in the additive `imageCapabilities` field.
