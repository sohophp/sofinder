---
title: HTTP API reference
description: Complete SoFinder HTTP endpoint, request, response, upload, image and error reference for custom clients.
---

# HTTP API reference

The machine-readable [OpenAPI 3.1 document](/openapi.json) is checked against every published API route during the PHP test suite.

All paths below are relative to the prefix used when importing SoFinder routes, for example `/sofinder`. The API is intended for same-origin, authenticated application clients. It is not an anonymous object-storage API.

## Protocol conventions

- Send `Accept: application/json` for JSON endpoints.
- Send the Symfony session cookie with every request.
- Every mutation requires `X-CSRF-TOKEN: <token>`. JSON mutations also use `Content-Type: application/json`.
- Paths are logical `/`-separated paths relative to a configured resource root. Do not send absolute paths, `..` or storage URLs.
- Timestamps are Unix seconds; byte counts are integers.
- Clients must ignore unknown response fields and capability flags.

Successful JSON response:

```json
{"success":true,"data":{"entry":{"path":"manuals/start.pdf"}}}
```

Failed JSON response:

```json
{"success":false,"error":{"code":"conflict","message":"The destination already exists."}}
```

HTTP status is authoritative. `429` responses include `Retry-After: 2`. A batch request can return HTTP 200 with individual failed results.

## Shared objects

### Entry

```json
{
  "path": "images/photo.jpg",
  "name": "photo.jpg",
  "directory": false,
  "size": 184231,
  "modifiedAt": 1787529600,
  "mimeType": "image/jpeg",
  "url": "https://cdn.example.com/images/photo.jpg",
  "capabilities": {"read": true, "rename": true, "delete": false}
}
```

`url` can be null. A non-null value may be public, authenticated proxy or a host application route. Capabilities are hints; the server authorizes the final operation again.

### Asset Reference 1.0

Upload and picker responses may additionally contain `asset`, following the
[published Schema](/schema/asset-reference.schema.json). The legacy `entry`
remains present. With `asset_catalog.enabled`, `GET /api/assets/resolve` resolves
or lazily registers a resource/path, and `GET /api/assets/{id}` retrieves the
same workspace-scoped record. `PATCH /api/assets/{id}/metadata` updates `alt`,
`title` and shared `tags`; send the returned metadata `version` for optimistic concurrency.

### Resource

`GET /api/config` returns resource policy fields including `name`, `publicUrl`, `allowedExtensions`, `allowedMimeTypes`, `maxSize`, `readOnly`, `quotaBytes`, `usedBytes`, name/depth/image/batch/archive limits, `deliveryMode`, `animatedImagePolicy` and:

```json
{
  "storageCapabilities": {
    "search": true,
    "sort": true,
    "cursorPagination": false,
    "atomicMove": true,
    "nativeCopy": true,
    "recoverableDelete": true,
    "publicUrl": true
  }
}
```

## Discovery and listing

### `GET /api/config`

Returns `apiVersion`, visible `resources`, plugin descriptors, image presets, effective image capabilities and UI defaults. The current API version is `1.0`.

### `GET /api/capabilities`

Returns the versioned machine-readable names for entry operations, storage
capabilities, host-controlled optional features, plugin slots/selections and
picker kinds. Contract tests compare runtime discovery output with the published
JSON Schemas and a reviewed key snapshot.

### `GET /api/security/status`

Returns malware scanner readiness, pending/passed/quarantined/failed counts and bounded recent history. Access is restricted by `malware_scanning.status_roles`.

### `GET /api/entries`

Query parameters:

| Name | Default | Meaning |
| --- | --- | --- |
| `resource` | `Files` | Configured resource name. |
| `path` | empty | Directory to list. |
| `search` | empty | Name term, or comma-separated tag terms when `searchMode=tags`. |
| `searchMode` | `name` | `name` or `tags`. |
| `sort` | `name` | `name`, `size`, `type` (MIME type) or `modified`. |
| `direction` | `asc` | `asc` or `desc`. |
| `offset` | `0` | Offset for adapters that support it. |
| `limit` | `100` | Requested page size, bounded to 10–500. |
| `cursor` | absent | Opaque cursor returned by the previous page. |

Response data contains `entries`, `total`, `path`, `offset`, `limit`, `sort`, `direction`, `nextCursor`, directory `capabilities` and `storageCapabilities`. Cursor adapters may return `total: null`. Treat `nextCursor` as opaque and never construct or modify it.

## Folder and entry mutations

### `POST /api/folders`

```json
{"resource":"Files","path":"manuals","name":"2026"}
```

Returns `{entry}` with HTTP 201.

### `PATCH /api/entries/rename`

```json
{"resource":"Files","path":"manuals/draft.pdf","name":"guide.pdf","overwrite":false}
```

`name` is a name, not a destination path. `overwrite` requires independent authorization.

### `POST /api/entries/copy` and `POST /api/entries/move`

```json
{
  "resource":"Files",
  "path":"manuals/guide.pdf",
  "destination":"archive/2026",
  "overwrite":false,
  "autoRename":true
}
```

`destination` is a directory. When `autoRename` is true and overwrite is false, SoFinder chooses a conflict-safe name.

### `DELETE /api/entries`

```json
{"resource":"Files","path":"manuals/old.pdf"}
```

Returns `trash`, which is null for permanent-delete adapters or an object containing the trashed item and automatic-purge totals.

### `POST /api/entries/batch`

```json
{
  "operation":"copy",
  "resource":"Files",
  "paths":["a.pdf","folder"],
  "destination":"archive",
  "overwrite":false,
  "autoRename":true
}
```

`operation` is `copy`, `move` or `delete`. Paths are deduplicated and cannot contain both a folder and its descendant. Response:

```json
{
  "success": true,
  "data": {
    "operation": "copy",
    "total": 2,
    "succeeded": 1,
    "failed": 1,
    "purgedItems": 0,
    "purgedBytes": 0,
    "results": [
      {"path":"a.pdf","success":true,"entry":{}},
      {"path":"folder","success":false,"error":{"code":"access_denied","message":"Access denied."}}
    ]
  }
}
```

### `POST /api/entries/batch-rename`

```json
{"resource":"Files","renames":[{"path":"draft-a.pdf","name":"report-1.pdf"},{"path":"draft-b.pdf","name":"report-2.pdf"}]}
```

Paths and destination names must be unique. Extensions remain immutable and every item is authorized and validated independently. The response uses the same per-item result shape as other batch operations.

## Uploads

### `POST /api/uploads`

Send `multipart/form-data` fields `resource`, `path`, `upload` and optional `overwrite=1` or `autoRename=1`. Returns `{entry}` with HTTP 201. When `autoRename=1` and overwrite is false, a conflict is stored with the first available CKFinder-style suffix such as `photo(1).jpg`. The server validates actual bytes rather than trusting client size or MIME metadata.

### Chunk upload

Use `POST /api/uploads/chunks` with multipart fields:

- `resource`, `path`, `name` and optional `overwrite=1` or `autoRename=1`;
- `uploadId`, a 16–80 character URL-safe identifier;
- zero-based `index`, fixed `total`, and file field `chunk`.

An incomplete response is `{"complete":false}`. The final chunk returns `{"complete":true,"entry":{...}}` with HTTP 201. Session metadata is immutable; retries must use the same resource, path, name, overwrite, auto-rename and total.

- `GET /api/uploads/chunks/{id}` returns `id`, `total`, received indexes, `complete`, `resource`, `path`, `name`, `overwrite` and `updatedAt` for the current actor.
- `DELETE /api/uploads/chunks/{id}` cancels and discards the session; it requires CSRF.

Sessions expire after 24 hours. Clients may retry missing indexes, but must not upload beyond the resource file-size and maximum-chunk limits.

## Content delivery

### `GET /api/download?resource=Files&path=manual.pdf`

Authorizes `read` and returns an attachment. Folders return `invalid_type`.

### `GET /api/content?resource=Images&path=photo.jpg&disposition=inline`

Returns private authenticated content with ETag, Last-Modified, conditional request and a single byte `Range`. Only safe browser raster MIME types can be inline; every other type is forced to attachment. Invalid or unsatisfiable ranges return 416.

### Temporary signed URLs

`GET /api/signed-url?resource=Private&path=manual.pdf&ttl=300` first authorizes the
current user and returns `{url,expiresAt}`. The URL targets `/signed/{token}` and
may be opened without a session only when the host firewall explicitly grants
that route public access. Tokens are HMAC protected, work only with
`delivery_mode: proxy`, and are bound to the file size and modified time.
Expired or replaced files return 410; token tampering returns 403.

### `GET /api/preview/text?resource=Files&path=readme.txt`

Returns at most the first 256 KiB of an authorized UTF-8 text, JSON, XML or YAML file as JSON `{content,truncated,mimeType,size}`. Content is rendered as text by the bundled UI and is never treated as HTML.

### `GET /api/preview/document?resource=Files&path=manual.pdf`

Returns an authorized inline PDF. A cached Office conversion is returned directly; an uncached Office file in asynchronous mode returns HTTP 202 with `document_preview_pending` and `Retry-After`.

- `POST /api/preview/document/jobs` with `{"resource":"Files","path":"manual.docx","retry":false}` creates or reuses the actor-scoped, file-version-scoped conversion job.
- `GET /api/preview/document/jobs/{id}` returns `queued`, `running`, `ready`, `failed` or `expired`, plus `retryAfter` and the preview URL when ready.

See [PDF and Office preview](/document-preview) for worker and shared-cache requirements.

### `GET /api/checksum?resource=Files&path=manual.pdf`

Returns `{algorithm:"sha256",checksum,size}` for authorized files up to 512 MiB. The checksum is calculated from stored bytes and does not expose the adapter path.

## Recycle bin

- `GET /api/trash?resource=Files&offset=0&limit=50&search=term` returns `items`, page fields and `usedItems`, `usedBytes`, `maxItems`, `maxBytes`.
- `POST /api/trash/{id}/restore` body: `{"resource":"Files","conflict":"cancel"}`. Conflict is `cancel`, `rename` or `overwrite`.
- `DELETE /api/trash/{id}` body: `{"resource":"Files"}` permanently removes the item.

Trash IDs are actor-private 32-character hexadecimal values. Overwrite restore requires `overwrite`; missing parent folders return `restore_parent_missing`.

## Images

- `GET /api/images/thumbnail?resource=Images&path=photo.jpg&width=240&height=180` returns a private cached thumbnail with ETag.
- `GET /api/images/info?resource=Images&path=photo.jpg` returns decoded `width` and `height`.
- `GET /api/images/variant?resource=Images&path=photo.jpg&width=640&format=webp&v=...` returns an authorization-preserving, whitelist-bounded responsive variant when enabled.
- `PATCH /api/images/edit` applies one to ten ordered actions.
- `PATCH /api/images/batch` applies the same actions to 1–100 paths and returns per-item success/error records.

```json
{
  "resource":"Images",
  "path":"photo.jpg",
  "actions":[
    {"type":"crop","x":10,"y":20,"width":800,"height":600},
    {"type":"resize","width":400,"height":300,"quality":88},
    {"type":"rotate","degrees":90}
  ],
  "save":{"mode":"copy","name":"photo-card.jpg"}
}
```

Action types are `crop`, `resize`, `rotate`, `preset`, `optimize`, `watermarkText` and `watermarkImage`; complete bounds are in [image-actions.schema.json](/schema/image-actions.schema.json). `save.mode` is `copy` or `overwrite`, and format conversion requires copy mode. Legacy transform/crop bodies remain until the advertised `Sunset` and return deprecation headers.

## ZIP and metadata

`POST /api/archive` body:

```json
{"resource":"Files","paths":["manual.pdf","screenshots"]}
```

Returns `application/zip` named `sofinder-download.zip`; it is limited by resource selection, recursive entry and byte policies.

`GET /api/metadata?resource=Files` returns `favorites`, up to 12 file-or-folder `quickAccess` paths, compatible `quickAccessEntries` display metadata (`name`, `directory`, `mimeType`, `exists`), `tags` keyed by path, and up to 50 recent `{path,touchedAt}` entries. Missing shortcuts remain visible with `exists: false` until the user opens or removes them. Use `PATCH /api/metadata` to update with:

```json
{"resource":"Files","path":"manual.pdf","action":"favorite","favorite":true}
{"resource":"Files","path":"manuals","action":"quick_access","pinned":true}
{"resource":"Files","path":"manual.pdf","action":"tags","tags":["docs","approved"]}
{"resource":"Files","path":"manual.pdf","action":"touch"}
```

When host configuration `features.quick_access_files` is disabled, adding a file returns `422 quick_access_file_disabled`; folders remain supported and existing file shortcuts remain removable.

Clients may send `action: "forget"` after an authorized lookup confirms that a
recent path disappeared outside SoFinder; this removes that path from favorites,
tags and recent state. When the host disables a feature, its dedicated operation
returns `feature_disabled` with HTTP 404 and the config response marks it false
under `featureAvailability`.

An entry accepts at most 10 unique tags of 1–30 visible characters.

## CKEditor compatibility upload

`POST /compat/ckeditor4/upload` accepts multipart field `upload`. Query parameters include `type`, `selection`, `currentFolder`, `_token`, `CKEditorFuncNum` and optional `responseType=json`. Name conflicts are auto-renamed unless `ckeditor4.overwrite_on_upload` is explicitly enabled. See the [CKEditor 4 guide](/ckeditor4) for callback and JSON responses.

## Common status and error codes

The exhaustive code/status/category catalog is [error-codes.json](/error-codes.json) and CI checks it against literal server exceptions.

| Status | Representative codes | Client behavior |
| --- | --- | --- |
| 400 | `invalid_json`, `invalid_path`, `invalid_type`, `invalid_upload_chunk` | Fix request syntax or values. |
| 401/403 | `access_denied`, `read_only` | Authenticate or request the required resource/operation permission. |
| 404 | `not_found`, `upload_session_not_found`, `trash_disabled`, `unknown_image_preset` | Refresh state; do not retry unchanged. |
| 409 | `conflict`, `upload_session_mismatch`, `restore_parent_missing` | Ask for rename/overwrite or recreate the parent. |
| 413 | `file_too_large`, `quota_exceeded`, `batch_limit_exceeded`, `archive_limit_exceeded`, `recursive_limit_exceeded` | Reduce the operation or change policy. |
| 415 | `invalid_extension`, `invalid_mime_type`, `unsafe_file_content`, `invalid_image`, `unsupported_image` | Choose an allowed, valid format. |
| 416 | `invalid_range` | Correct or remove the Range header. |
| 422 | `invalid_tags`, `invalid_crop`, `invalid_image_dimensions`, `storage_search_unsupported` | Correct semantic input or use supported capabilities. |
| 429 | `rate_limit_exceeded`, `concurrency_limit_exceeded` | Wait for `Retry-After`, then retry with backoff. |
| 500/503/507 | storage, quota, trash, image or session availability failures | Preserve the machine code, stop automatic mutation retries and alert operations. |

Never display raw internal exception traces, and never log session cookies, CSRF tokens, signed URLs, credentials or private file content.
