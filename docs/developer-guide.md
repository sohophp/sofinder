---
title: Developer integration guide
description: Embed SoFinder, consume selections, call its services and extend it safely from a Symfony application.
---

# Developer integration guide

Start with [installation](/getting-started) and [Symfony configuration](/symfony). This guide covers application-level integration after the bundle, routes and resources are working.

## Choose an integration surface

| Need | Recommended surface |
| --- | --- |
| Full file management | `/sofinder/browser` in manager mode |
| Select one file/image | Browser picker mode and `sofinder:select` |
| CKEditor 4 | Callback and quick-upload routes in [CKEditor guide](/ckeditor4) |
| Custom frontend | Authenticated [HTTP API](/api-reference) |
| Server-side business logic | Inject `FileManager` and public contracts |
| New storage backend | `StorageAdapterFactoryInterface` and [storage adapter contract](/storage-adapters) |

## Embed manager or picker mode

Presentation query parameters are optional and validated:

```text
/sofinder/browser?uiMode=manager
/sofinder/browser?select=1&type=Images&selection=image&uiMode=picker
```

`uiMode` is `auto`, `manager` or `picker`. `type` chooses the initial resource. `selection` is `any`, `file` or `image`; an image selection must be web-embeddable. `uiTools=common|full` keeps picker selection behavior while optionally exposing all ACL-controlled management, detail and image tools. `uiHeader`, `uiLogo`, `uiSearch`, `uiLanguage` and `uiView` accept only `0` or `1`. These options never add permissions.

For an iframe or same-window picker without CKEditor, listen for the selection event:

```javascript
window.addEventListener("sofinder:select", (event) => {
  const entry = event.detail;
  console.log(entry.path, entry.url, entry.mimeType);
});
```

The event is dispatched in the picker window. If the picker is inside an iframe, install the listener on `iframe.contentWindow` after it loads, or bridge the result with a narrowly scoped same-origin wrapper. SoFinder does not use unrestricted cross-origin `postMessage`.

## Call the HTTP API

Read requests use the current Symfony session. Mutations additionally require the token injected into the browser bootstrap:

```javascript
const response = await fetch("/sofinder/api/folders", {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": csrfToken
  },
  body: JSON.stringify({ resource: "Files", path: "manuals", name: "2026" })
});
const payload = await response.json();
if (!response.ok || !payload.success) throw new Error(payload.error?.message);
```

Do not trust frontend capability flags as authorization. Handle `total: null`, opaque cursors, partial batch failures, `409 conflict`, `413` policy limits, `415` media rejection and `429` with `Retry-After`. See the [complete API reference](/api-reference).

## Use FileManager on the server

Inject `SohoPHP\SoFinder\FileManager` into an application service. Always pass a configured resource name and a logical normalized path, never an absolute storage path.

```php
use SohoPHP\SoFinder\FileManager;

final readonly class DocumentService
{
    public function __construct(private FileManager $files) {}

    public function openManual(string $path)
    {
        return $this->files->read('Documents', $path);
    }
}
```

`FileManager` applies resource lookup, path normalization, authorization, quotas, operation gates, storage capabilities, audit events and usage accounting. Prefer it over resolving a storage adapter directly. The returned read value is a stream owned by the caller and must be closed.

## Stable entry URLs

Use resource `entry_url` when storage keys must become application URLs. Route templates can use `{resource}`, `{path}`, `{name}`, `{stem}`, `{extension}` and `{storage_url}`. Implement `EntryUrlContextProviderInterface` to add host database values such as `{id}`. The route controller owns its final access policy and may stream through `FileManager::read()` or redirect to a public provider URL.

## Events and application policy

Subscribe to `OperationEvent` names `before.<operation>` and `after.<operation>`. A before subscriber may reject by throwing a domain exception. After events run after storage changes, so notification, indexing and database synchronization must be retry-safe and idempotent. Ignore context keys you do not recognize.

Replace `AuthorizationInterface` for business-specific resource, operation and normalized-path decisions. Return false for unknown operations. `ActorProviderInterface` must return a stable opaque ID because it isolates upload sessions, metadata and recycle-bin ownership.

## Extension points

- Storage: `StorageAdapterInterface`, optional capability interfaces and tagged factories.
- State: `ChunkUploadStoreInterface`, `MetadataStoreInterface`, `RequestGateStoreInterface`, `UsageTrackerInterface` and `RecycleBinInterface`.
- Security: `FileInspectorInterface` and `AuthorizationInterface`.
- Images: `ImageProcessorInterface` and `ImageCapabilityProviderInterface`.
- UI descriptors: `PluginInterface` tagged with `sofinder.plugin`.
- URLs and audit: `EntryUrlContextProviderInterface`, `StorageAuditProviderInterface` and operation events.

Contracts and immutable value objects are listed in [PHP contracts](/php-contracts). Implementations must be concurrency-safe, keep storage paths and secrets out of exceptions, and throw `SoFinderException` with a stable machine code for expected domain failures.

## Testing an integration

At minimum, automate:

1. route import and authenticated access;
2. list/create/upload/read/rename/copy/move/delete/restore for each resource class;
3. CSRF and role/path-ACL rejection;
4. upload extension, MIME, size, quota and conflict cases;
5. public versus proxy entry URLs;
6. cursor pagination and partial batch results for remote adapters;
7. CKEditor callback or custom picker selection;
8. security audit and usage recalculation in a production-like environment.

Use the runnable `examples/symfony` variants as integration fixtures. During deployment run `sofinder:security:audit`; critical findings must block release.
