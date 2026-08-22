# Production security

SoFinder treats every configured resource root as a sandbox. Traversal,
control characters, hidden names and symbolic-link access are rejected.
Uploads first enter a mode-0600 private quarantine, are counted from the stream
rather than trusted request metadata, inspected, and only then atomically
published. Image extensions must match detected MIME and the image must fully
decode within the configured pixel limit.

Keep `quarantine_dir`, `chunk_dir`, `trash_dir`, metadata and thumbnail/archive
caches outside public resource roots. Disable script execution in public upload
aliases. For a proxy resource, do not expose its root through another alias:
that alternate URL would bypass read ACLs.

Deletion moves entries to an actor-isolated private recycle bin. Restores use
an atomic destination backup for overwrite conflicts. Schedule:

```bash
bin/console sofinder:trash:cleanup
bin/console sofinder:uploads:cleanup
```

Run after configuration or deployment changes:

```bash
bin/console sofinder:security:audit
```

Default request gates separately constrain ordinary APIs, upload/chunk traffic,
read-only thumbnails, image editing, ZIP generation and transfer batches.
Thumbnails have a larger independent allowance because one directory page can
load many images; successful responses are privately cached by the browser.
Tune `so_finder.limits` for the deployment. The built-in gate uses local locked
files; a multi-host setup should replace it with a shared limiter before
distributing concurrent traffic.

The default inspector is replaceable through `FileInspectorInterface`.
Deployments accepting untrusted public uploads should decorate it with an
antivirus or content-disarm service and use operation events for application
audit and quota policy.
