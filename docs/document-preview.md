---
title: PDF and Office preview
description: Configure authenticated PDF preview and optional sandboxed LibreOffice conversion for Office documents.
---

# PDF and Office preview

SoFinder registers a declaration-only `document-preview` plugin. The browser
matches its same-origin preview endpoint by MIME type or extension and embeds the
returned PDF in a same-origin frame. The browser page CSP permits only same-origin
frames, while the PDF response carries its own sandbox CSP. The plugin cannot
inject JavaScript or remote HTML.

```yaml
so_finder:
  document_preview:
    mode: auto # auto | inline | messenger
    pdf: true
    office: false
    office_binary: '/usr/bin/libreoffice'
    timeout_seconds: 60
    max_bytes: 52428800
    job_ttl_seconds: 86400
    cache_ttl_seconds: 604800
```

PDF preview is enabled by default. It copies authorized PDF bytes into a private,
versioned cache and serves them inline with `nosniff`, private caching and a
restrictive CSP. The original storage path is never exposed.

Office preview is opt-in. When enabled, SoFinder invokes the configured absolute
LibreOffice executable with an argument array, a private per-conversion profile,
no shell, a bounded input size and a hard timeout. DOC/DOCX/ODT/RTF,
XLS/XLSX/ODS and PPT/PPTX/ODP are converted to cached PDF. Run LibreOffice in a
dedicated container or OS sandbox with no network access and resource limits;
the PHP process must not have broader filesystem permissions than it needs.
Older LibreOffice installations can take more than 30 seconds on their first
headless conversion, so 60 seconds is a practical production starting point.

`auto` dispatches Office conversion through `messenger.default_bus` when that
service exists and otherwise preserves synchronous single-node behavior. The UI
creates an idempotent job, polls `queued`, `running`, `ready`, `failed` or
`expired`, and only creates the PDF frame after `ready`. PDF and cache hits remain
immediate. `inline` always converts in the request; `messenger` fails container
compilation when no bus exists. Workers run `DocumentPreviewMessageHandler`.

Multi-node async deployments must share both `AtomicStateStoreInterface` state
and the `cache_dir/document-previews` filesystem. Set
`cluster.shared_preview_cache: true` only after mounting that directory on every
node; the security audit reports a critical finding otherwise.

`GET /health` reports `document-preview: down` when Office conversion is enabled
but the executable is missing. A failed conversion returns a stable
`office_preview_unavailable` or `document_preview_failed` error and never falls
back to a public third-party viewer.
