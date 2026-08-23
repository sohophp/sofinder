# Image format support

> 繁體中文版本：[image-formats.zh-TW.md](image-formats.zh-TW.md)

SoFinder 1.0 only treats formats that can be embedded directly in supported
web browsers as images. Image content is fully decoded before publication.
Effective support still depends on the installed processor:

| Format | GD | Imagick fallback | CKEditor image | Thumbnail/edit |
| --- | --- | --- | --- | --- |
| JPEG, PNG, GIF, WebP, BMP | Yes | When its coder is installed | Yes | Yes |
| AVIF | When GD has AVIF support | When its coder is installed | Yes | Yes |
| ICO | No | When the ICO coder is installed | Yes | Yes |

The default `auto` driver selects GD separately for each registered format and
falls back to Imagick only when GD cannot decode it. A configured `gd` or
`imagick` driver fails container startup when that extension is absent. The
capability command and `/api/config.imageCapabilities` report the codecs that
the current server can actually read, edit and thumbnail.

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

Imagick receives a fixed coder derived from the registry and never performs
automatic SVG, PDF, PostScript, URL or pseudo-protocol dispatch. Its memory,
map, disk, thread and time limits are scoped to each operation and restored
afterward. Encoder availability is verified with a bounded round trip before
edit capability is advertised.

## Ordinary non-web image files

HEIC, HEIF, TIF and TIFF are not registered image-pipeline formats in 1.0.
They may be included in the extension allowlist of a general `Files` resource,
where they receive the same actual-byte, extension, MIME and active-content
checks as other ordinary files. SoFinder does not decode them, report their
dimensions, generate thumbnails, edit them or convert them automatically.

Do not include these extensions or MIME aliases in an image-only resource.
Existing files are not removed: the browser shows them with a normal file icon,
and image selection and image endpoints reject them with `unsupported_image`.
File-selection mode may still return their public URL as a download link.
CKEditor image QuickUpload rejects them before writing with
`image_not_web_embeddable`.

SVG, PDF, PostScript, PSD, JP2 and RAW formats are also outside the image
pipeline. Formats permitted by a general file resource remain ordinary files;
supporting safe preview or conversion requires a separate future design.

Run `bin/console sofinder:image:capabilities` after deployment. It exits with a
failure status when a configured registered image extension has no effective
decoder; use `--json` for deployment automation.
