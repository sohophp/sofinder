---
title: Image format support
description: Supported raster formats and the GD or Imagick runtime capabilities required for SoFinder previews and editing.
---

# Image format support

> [繁體中文](/zh-TW/image-formats) · [简体中文](/zh-CN/image-formats)

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
    # Optional override; otherwise a system CJK font or the verified cache is used.
    watermark_font: /usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc
    watermark_font_auto_download: true
```

Imagick receives a fixed coder derived from the registry and never performs
automatic SVG, PDF, PostScript, URL or pseudo-protocol dispatch. Its memory,
map, disk, thread and time limits are scoped to each operation and restored
afterward. Encoder availability is verified with a bounded round trip before
edit capability is advertised.

## Configurable basic actions and upload resizing (unreleased)

Image decoding, format support, orientation, animation handling and resizing belong to SoFinder. Hosts configure these capabilities rather than implementing their own image algorithms. Plain PHP passes the following keys in the factory configuration array; Symfony uses the `so_finder` wrapper shown here.

```yaml
so_finder:
  image_processing:
    driver: gd
    action_pipeline:
      formats: [jpeg, png, gif, webp, avif, bmp]
      editable_formats: [jpeg, png, gif, webp, avif, bmp]
      actions: [crop, rotate, resize]
      auto_orientation: true
      animated_editing: reject
      max_width: 4096
      max_height: 4096
      quality: 88
      resize_quality: 88
  uploads:
    image_resize:
      formats: [jpeg, png, gif, webp, avif, bmp]
      max_width: 4096
      max_height: 4096
      quality: 88
      other_formats: reject
```
Both `action_pipeline` and `image_resize` default to `null`: omitting them preserves the existing processor and upload behavior. The opt-in basic pipeline uses GD; `driver: auto` is also accepted, but `imagick` is rejected with this pipeline. Effective format support requires installed codecs; it does not add ICO or Imagick fallback. `formats` controls readable formats; `editable_formats` is a subset. `actions` accepts only crop, rotate and resize, and an empty list disables editing. The browser discovers these actions and resize bounds; the server validates them independently.

`auto_orientation: false` retains raw EXIF coordinates. `animated_editing: first_frame` explicitly permits lossy first-frame editing; the default rejects animated edits. Originals remain unchanged during processing. Complete basic action sequences encode once; `quality` applies normally and `resize_quality` applies to a sequence containing resize. The direct transform/crop API honors its explicit quality argument.

Upload resizing is independently opt-in and runs inside private quarantine for ordinary and chunked uploads, even when resource dimensions would accept the original. The original must pass content, MIME, size and pixel checks; the transformed result must pass resource checks before publication. Upload `quality` controls this transformation. For formats outside its list, `other_formats: reject` keeps dimension rejection; explicit `preserve` retains bytes beyond dimension bounds while still enforcing content, MIME, size and pixels. It never extends the resource extension allowlist. Dimension values are positive integers up to 2,147,483,647; quality is 1–100. Pixel limits still bound decoding and output allocations.

## Compression, conversion and watermarks

The **Optimize / watermark** image tool is disabled in each user's toolbar by default and can be enabled in Settings. It provides quality-controlled recompression, supported JPEG/PNG/WebP/AVIF conversion, text watermarks and image watermarks. A batch handles up to 100 selected images and returns an individual result for every item.

Conversion always creates a copy. Same-format compression and watermarking can create a copy or overwrite. Animated and multi-page images are rejected to prevent silent frame loss, and watermark images pass through normal resource permissions. Text watermarks offer compact Interface Sans, Clean Sans, and Elegant Serif choices; Interface Sans is the default and keeps the original editor UI style. The selected CJK font is resolved from the explicit `watermark_font` (for the default style) or a supported system font. If neither exists and `watermark_font_auto_download` is enabled, only the selected pinned Noto CJK font is downloaded from the official repository, verified by SHA-256, and stored in `cache_dir/fonts`; concurrent requests share a file lock. Set the option to `false` to prohibit automatic network access. If no usable font remains, Unicode text returns `watermark_font_unavailable` instead of producing corrupted text.

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
