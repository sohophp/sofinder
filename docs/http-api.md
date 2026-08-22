# HTTP API stability

`GET /api/config` returns `apiVersion: "1.0"`. The browser endpoints remain
under the imported SoFinder route prefix and every JSON response uses one of:

```json
{"success":true,"data":{}}
{"success":false,"error":{"code":"stable_machine_code","message":"Human-readable message"}}
```

The directory endpoint retains `offset`, `limit` and an exact `total` for the
supported local adapter. It additionally returns `nextCursor` and
`storageCapabilities`; clients should tolerate an unknown total for future
cursor-only adapters. Existing beta.2 query parameters and response fields are
not renamed.

Mutation requests require the `X-CSRF-TOKEN` header and an authenticated actor.
Unknown operations are denied. Entry and directory capability fields are only
UI hints; the server repeats authorization for every operation.

Chunk uploads expose `GET /api/uploads/chunks/{id}` for the current actor. It
returns received chunk indexes and immutable session metadata. A resumed upload
must use the original resource, path, name, overwrite mode and chunk count.
Sessions expire after 24 hours and can be cleaned with
`sofinder:uploads:cleanup`.
