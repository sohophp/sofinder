---
title: Configuration reference
description: Reference for SoFinder global, UI, maintenance, image, request-limit and resource settings.
---

# Configuration reference

Configuration lives below the `so_finder` key. Symfony validates all values while compiling the container, so misspelled keys and out-of-range values fail early.

## Global paths and upload sessions

| Option | Default | Purpose |
| --- | --- | --- |
| `route_prefix` | `/admin/sofinder` | Retained compatibility setting. The imported Symfony route prefix controls current HTTP URLs. |
| `cache_dir` | `%kernel.cache_dir%/sofinder` | Thumbnails and other regenerable cache data. |
| `metadata_file` | `%kernel.project_dir%/var/sofinder/metadata.json` | Default favorites, tags and recent-entry metadata store. |
| `quarantine_dir` | `%kernel.cache_dir%/sofinder/quarantine` | Private upload inspection area. |
| `chunk_dir` | `%kernel.cache_dir%/sofinder/chunks` | In-progress chunked uploads. |
| `usage_dir` | `%kernel.project_dir%/var/sofinder/usage` | Persisted resource usage counters. |
| `chunk_size` | `5242880` | Chunk size in bytes; accepted range is 256 KiB–16 MiB. |
| `max_upload_chunks` | `200` | Maximum chunks in one upload; accepted range is 1–1000. |

These working directories must be writable by PHP and must not be directly web-accessible.

## Recycle bin

| Option | Default |
| --- | ---: |
| `trash_dir` | `%kernel.project_dir%/var/sofinder/trash` |
| `trash_retention_days` | `30` |
| `trash_max_items` | `1000` |
| `trash_max_bytes` | `1073741824` |

Recycle-bin behavior is available to local storage. Object-storage deletion is permanent from SoFinder's perspective, so enable provider versioning when recovery is required.

## UI

```yaml
so_finder:
  ui:
    mode: auto
    header: false
    logo: false
    search: true
    language_switcher: true
    view_switcher: true
    folder_tree: false
    scale: standard
```

`mode` accepts `auto`, `manager` or `picker`. `scale` accepts `compact`, `standard`, `large` or `xlarge`. Browser preferences can change presentation, but never grant server capabilities.

## Theme

```yaml
so_finder:
  theme:
    accent: '#276ef1'
    background: '#f4f6f9'
    panel: '#ffffff'
    text: '#1c2735'
    muted: '#667282'
    danger: '#c13a43'
    radius: '10px'
```

Colors accept three- or six-digit hexadecimal values. Radius accepts `0px` through `32px`.

## Maintenance

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

Modes are `inline`, `messenger`, `external` and `disabled`. See [maintenance modes](/maintenance) before changing the default.

## Request and concurrency limits

The `limits` groups are `normal`, `upload`, `image`, `thumbnail`, `archive` and `transfer`. Each accepts:

| Key | Meaning |
| --- | --- |
| `max_requests` | Requests allowed in the configured interval; `0` disables this count. |
| `interval` | Sliding interval in seconds. |
| `max_concurrent` | Concurrent operations allowed; `0` disables this count. |

Defaults are deliberately stricter for uploads, image mutations and archives than for browsing and thumbnails.

## Image processing

`image_processing.driver` accepts `auto`, `gd` or `imagick`. Global bounds cover dimensions, pixels, frames, memory, map, disk, threads and timeout. A resource can impose tighter image width, height and pixel limits. See [image formats](/image-formats) for runtime codec requirements.

Presets are named bounded output sizes:

```yaml
so_finder:
  image_presets:
    content: { width: 1200, height: 1200, quality: 88 }
    thumbnail: { width: 400, height: 400, quality: 82 }
```

## Resources

At least one named resource is required.

| Key | Default | Notes |
| --- | --- | --- |
| `adapter` | `local` | Adapter factory name, such as `local` or optional `s3`. |
| `root` | required | Security boundary for local paths or object keys. |
| `public_url` | empty | Base URL used only for public delivery. |
| `delivery_mode` | `public` | `public` or authenticated `proxy`. |
| `allowed_extensions` | empty | Empty means no allowlist; the denylist still applies. |
| `denied_extensions` | executable/active formats | Includes PHP, Phar, CGI, shell, HTML and JavaScript by default. |
| `allowed_mime_types` | empty | Optional MIME allowlist checked during upload. |
| `max_size` | 20 MiB | Maximum file size. |
| `read_only` | `false` | Prevents mutations when enabled. |
| `quota` | `0` | Bytes; zero means unlimited. |
| `roles` | empty | Required Symfony roles; empty keeps authenticated-user behavior. |
| `operation_roles` | empty | Overrides roles for specific operations. |
| `path_acl` | empty | Inherited allow or deny rules below resource-relative paths. |

Resources also support limits for Unicode file and folder name length, folder depth, batch size, recursive operations, archive entries/bytes and image dimensions/pixels. The [Symfony guide](/symfony) contains a complete example with ACLs, host routes and presentation options.

## Inspect effective configuration

Use Symfony's standard configuration tools:

```bash
bin/console config:dump-reference so_finder
bin/console debug:config so_finder
```

`config:dump-reference` describes accepted keys and defaults; `debug:config` shows the values compiled for the current environment.
