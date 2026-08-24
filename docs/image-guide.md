---
title: Managing images
description: Upload, preview, crop, resize, rotate and select web images safely in SoFinder.
---

# Managing images

SoFinder treats JPEG, PNG, GIF, WebP, AVIF, BMP and ICO as browser images when the server has the required decoder. HEIC, HEIF and TIFF may be stored as ordinary files but are not previewed, edited or selected by an image picker. Availability is determined by the server and the current resource, not by the file extension alone.

## Upload and preview

Upload images in the same ways as other files. Before publishing, SoFinder checks the actual byte count, MIME type, active content, decoded dimensions and configured pixel limit. An extension that does not match the decoded content is rejected.

Select an image to see file size, MIME type, modification time, path and decoded dimensions. Use **Preview** from the context menu for a larger thumbnail. Browser thumbnails are private, versioned by modification time and may differ from the original resolution.

## Enable image tools

Open **More → Settings → Image tools**. Resize, Crop, Rotation and Presets are browser-local preferences; enabling them only shows controls and does not grant server permission. A control remains disabled if the selected format cannot be edited, the resource is read-only, or your role lacks the operation.

## Rotate, resize and presets

Select exactly one editable image.

- **Rotate left/right** creates a new copy rotated 270° or 90°.
- **Resize** accepts `WIDTHxHEIGHT`, for example `1200x800`. Processing preserves aspect ratio within that box.
- A configured **Preset** applies its width, height and quality and creates a new copy.

These toolbar actions preserve the original image. SoFinder chooses a conflict-safe copy name and reports the final name and dimensions.

## Crop an image

Select **Crop** to open the editor:

1. Choose Free, Original, `1:1`, `4:3` or `16:9` ratio.
2. Drag the image and use corner or edge handles to set the selection.
3. Adjust zoom or enter exact X, Y, width and height values.
4. Use arrow keys for 1-pixel movement or `Shift` + arrow for 10 pixels.
5. Use Undo/Redo (`Ctrl`/`Cmd` + `Z`, with `Shift` for redo), Reset and press-and-hold Compare.
6. Save as a copy with an optional name, or explicitly choose Overwrite.

Saving a copy is the safe default. Overwrite changes the original path and requires `overwrite` authorization; it cannot be inferred from general edit permission. Crop coordinates must stay inside the decoded image.

## Animation and format behavior

The resource decides whether animated images are preserved or rejected. Editing an animated or multi-page image is refused when processing would silently flatten it. Image output keeps the original supported format and extension. Quality must be 1–100, and edited dimensions are limited by the configured resource and processor limits.

## Select images for an editor

An image picker displays only files that have a browser-usable entry URL and reports unsupported formats instead of returning them. Select the image and press **Select**. For public resources, the returned URL may point to a CDN. For private resources, it can be an authenticated host route or proxy URL; the application must decide whether that is suitable for content viewed by other users.

See [image format support](/image-formats) for codec requirements and [CKEditor 4](/ckeditor4) for editor setup and daily use.
