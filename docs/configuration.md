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

## Cluster services

`cluster.state_service` optionally names a host Symfony service implementing
`AtomicStateStoreInterface`; it switches metadata, request gates, usage,
metrics, maintenance coordination and chunk-session metadata to shared atomic
stores. Chunk bytes remain in `chunk_dir`, which must be a private shared mount
on every node. `cluster.chunk_upload_store_service` can replace the bundled
coordinator when a host needs another staging backend. See [production operation](/production).
For multi-node asynchronous Office preview, mount `cache_dir/document-previews`
on every node and then set `cluster.shared_preview_cache: true`; this explicit
acknowledgement is checked by `sofinder:security:audit`.

## Picker origins

Picker results are same-origin by default. Cross-origin CMS integration must
allow each exact caller origin; wildcards and paths are rejected:

```yaml
so_finder:
  picker:
    lock_resource: true
    allowed_origins: ['https://cms.example.com']
```

`lock_resource` controls the host-wide default when a picker receives a
resource. The default `true` hides other resources and confines the result to
that resource. Set it to `false` to use the resource only as the initial
location for direct picker URLs that omit `resourceLock`. The picker SDK sends
its own secure default (`lockResource: true`); pass `lockResource: false` on an
SDK call when switching resources should be allowed.

## Temporary signed URLs

```yaml
so_finder:
  signed_urls:
    enabled: true
    secret: '%kernel.secret%'
    default_ttl_seconds: 300
    max_ttl_seconds: 3600
```

The secret must contain at least 32 bytes. Signed URLs are revision-bound and
only available for `proxy` resources. To allow access without login, place a
narrow `PUBLIC_ACCESS` firewall rule for `/sofinder/signed/` before the general
SoFinder access rule.

## Asset catalog, variants and workspaces

All three capabilities are opt-in, so existing installations keep path-based,
single-workspace behavior:

```yaml
so_finder:
  asset_search:
    enabled: true
    provider_service: null
    max_scanned_entries: 10000
  asset_usage:
    enabled: false
    store_service: null
  asset_access_sessions:
    enabled: false
    store_service: null
    default_ttl_seconds: 3600
    max_ttl_seconds: 86400
    max_assets: 50
  asset_catalog:
    enabled: false
    store_service: null
    register_existing: lazy
    alt_locales: [en, zh-cn, zh-tw]
  image_variants:
    enabled: false
    widths: [320, 640, 960, 1280, 1920]
    formats: [original, webp]
    quality: 82
    mode: on_demand
    max_variants_per_asset: 10
    cache_ttl_seconds: 2592000
  workspaces:
    enabled: false
    default: main
    resolver_service: null
    option_provider_service: null
```

The built-in `asset_search` provider recursively scans only resources authorized
for the current workspace and stops at `max_scanned_entries`. Large or indexed
installations can replace it with `provider_service`; authorization must still be
applied before results are returned. The browser stores only the five most recent
query definitions in the current user's local browser storage.

`asset_usage` is intentionally disabled until the host content system registers
where stable asset IDs are used. Once enabled, deletion preflight warns about
registered pages or records. Cluster mode automatically uses shared state unless
`store_service` provides another shared implementation.

`asset_access_sessions` groups private proxy assets into short-lived, revocable,
revision-bound delivery URLs. If the content must be readable without a login,
allow only `/sofinder/asset-session/` through the host firewall, just as for signed
content; possession of the random session URL is the authorization. Never use a
session URL as a permanent public asset URL.

`asset_catalog.alt_locales` is the host-controlled list shown when an editor adds
localized alternative text. Users choose from this list and cannot enter arbitrary
language tags. Existing metadata in a removed locale remains readable and editable.

The catalog assigns opaque UUIDs lazily. Rename, move, overwrite and recycle-bin
restore retain the ID; upload and copy create a new one. With cluster state,
SoFinder automatically uses the shared catalog; a node-local catalog is not
allowed for a clustered deployment. Variants accept configured widths and
formats only, never enlarge the original and inherit resource authorization.
Workspace IDs must come from a trusted host `WorkspaceResolverInterface`, never
from an unchecked query parameter. A workspace is an authorization context, not
automatic physical storage isolation; the host must map its resources to
separate storage where tenant isolation requires it. Hosts with dynamic storage
mapping should also implement `WorkspaceStorageAuditProviderInterface`; its
autoconfigured mappings let `sofinder:security:audit` fail when writable roots
from different workspaces resolve to the same physical directory.
An optional `WorkspaceOptionProviderInterface` service may return trusted
same-origin navigation targets. The browser renders its switcher only when at
least two options are available, and disables switching while uploads are active;
navigation clears selection, preview and uncommitted browser state naturally.

## Filesystem permissions

```yaml
so_finder:
  filesystem_permissions:
    directory_mode: '0775'
    file_mode: '0664'
```

The modes apply to newly created local-storage entries and generated thumbnail
caches. They are quoted octal strings so YAML cannot reinterpret them as decimal
numbers. Shared PHP-FPM/deployment groups can use `directory_mode: '2775'` to
preserve group inheritance. SoFinder does not change file ownership or repair
historical entries.

## CKEditor 4 uploads

```yaml
so_finder:
  ckeditor4:
    overwrite_on_upload: false
```

The safe default auto-renames quick-upload conflicts using names such as `photo(1).jpg`. Enabling `overwrite_on_upload` replaces an existing file only when the current actor also has the resource's independent `overwrite` permission.

## Malware scanning

```yaml
so_finder:
  malware_scanning:
    enabled: true
    endpoint: 'unix:///run/clamav/clamd.ctl'
    timeout_seconds: 8
    history_limit: 100
    status_roles: [ROLE_ADMIN]
```

When enabled, SoFinder registers the bundled ClamAV client as a synchronous,
fail-closed upload scanner and readiness check. The administrator-only Security
status dialog reports whether clamd is ready and shows a bounded history of
passed, blocked, failed and pending scans. It never stores file contents.

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
  uploads:
    naming:
      lowercase_extensions: true
  ui:
    mode: auto
    header: true
    logo: true
    search: true
    language_switcher: true
    view_switcher: true
    folder_tree: false
    scale: standard
    upload_conflict_strategy: ask
```

`mode` accepts `auto`, `manager` or `picker`. With `logo: true`, the logo and optional SoFinder brand name are shown at the left, search is centered, and the breadcrumb sits above the file list or grid. With `logo: false`, the breadcrumb uses the former logo slot and search shifts right on wide screens. Set `header: false` to hide only the brand name when the logo is enabled. `scale` accepts `compact`, `standard`, `large` or `xlarge`. `upload_conflict_strategy` accepts `ask`, `rename`, `overwrite` or `skip`; `ask` is the default and shows all three concrete choices when a same-name file is found. `uploads.naming.lowercase_extensions` defaults to `true`, so `Report.XLSX` is uploaded as `Report.xlsx`; the server enforces it for regular, chunked and editor uploads. The legacy `ui.lowercase_upload_extensions` key remains compatible. Browser preferences and `uiTools=common|full` can change presentation, but never grant server capabilities.

Optional capabilities have a host-controlled upper bound. Disabled features are
removed from browser settings and their dedicated HTTP endpoints return a stable
`feature_disabled` 404 response:

```yaml
so_finder:
  features:
    folder_tree: true
    recent: true
    favorites: true
    quick_access: true
    quick_access_files: false
    tags: true
    archive: true
    trash: true
    batch_rename: true
    image_editing: true
    image_processing: true
    document_preview: true
    security_status: true
    folder_upload: true
    text_preview: true
    checksum: true
    qr_code: true
```

`favorites` stores files only. `quick_access` independently controls folders pinned to the sidebar, up to 12 per resource. `quick_access_files` is retained only so older configuration files remain valid; it has no effect and defaults to `false`. Known legacy file shortcuts are hidden but can still be removed through the metadata API.

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

`metadata.update` is a first-class write operation. Use it in
`operation_roles` or `path_acl` when asset alt/title/tag editing should be more
restricted than file reading; read-only resources always deny it.
The built-in catalogs also implement `LocalizedAssetMetadataCatalogInterface`, which stores up to 20 normalized language tags in `altTranslations`. Third-party catalogs can opt in through that additive interface without changing `AssetCatalogInterface`.

## Inspect effective configuration

Use Symfony's standard configuration tools:

```bash
bin/console config:dump-reference so_finder
bin/console debug:config so_finder
```

`config:dump-reference` describes accepted keys and defaults; `debug:config` shows the values compiled for the current environment.
