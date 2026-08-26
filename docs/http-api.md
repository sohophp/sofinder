---
title: HTTP API stability
description: Stable browser, API and content-delivery routes exposed by SoFinder.
---

# HTTP API stability

For endpoint-by-endpoint requests, schemas, examples and error handling, see the [HTTP API reference](/api-reference). This page defines the compatibility rules clients can rely on.

`GET /api/config` returns `apiVersion: "1.0"`. The browser endpoints remain
under the imported SoFinder route prefix and every JSON response uses one of:

```json
{"success":true,"data":{}}
{"success":false,"error":{"code":"stable_machine_code","message":"Human-readable message"}}
```

The directory endpoint retains `offset`, `limit` and an exact `total` for the
supported local adapter. Cursor-only adapters return `total: null` and an opaque
`nextCursor`; clients send that value back as `cursor` and must not derive it
from the offset. Existing beta.2 query parameters and response fields are not
renamed.

Every response also carries `X-SoFinder-API-Version: 1.0`. The bundled UI accepts the `1.x` range and stops with `incompatible_api_version` before mutations when another major is reported. Deprecated request fields return `Deprecation`, `Sunset`, `Link` and `X-SoFinder-Deprecated-Fields` headers.

Use the [OpenAPI 3.1 document](/openapi.json), reusable [JSON Schemas](/schema/picker-entry.schema.json), and the exhaustive [machine error directory](/error-codes.json) as contract sources.

Mutation requests require the `X-CSRF-TOKEN` header and an authenticated actor.
Unknown operations are denied. Entry and directory capability fields are only
UI hints; the server repeats authorization for every operation.

Chunk uploads expose `GET /api/uploads/chunks/{id}` for the current actor. It
returns received chunk indexes and immutable session metadata. A resumed upload
must use the original resource, path, name, overwrite mode and chunk count.
Sessions expire after 24 hours and can be cleaned with
`sofinder:uploads:cleanup`.
