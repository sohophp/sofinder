---
title: Production security
description: Authentication, authorization, storage, upload and operational security requirements for SoFinder deployments.
---

# Production security

SoFinder treats every configured resource root as a sandbox. Traversal,
control characters, hidden names, bidirectional text controls, portable
reserved characters and Windows device names are rejected, as are trailing
dots or spaces and symbolic-link access. These checks are repeated for rename,
copy/move destinations, generated copy names and recycle-bin restores.
Uploads first enter a mode-0600 private quarantine, are counted from the stream
rather than trusted request metadata, inspected, and only then atomically
published. Image extensions must match detected MIME and the image must fully
decode within the configured pixel limit. Rename and edited-image copies keep
the exact original extension; generated output is validated by the same upload
quarantine before publication.

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

Shared request gates separately constrain mapped ordinary APIs, upload/chunk traffic,
read-only thumbnails, image editing, ZIP generation and transfer batches.
Thumbnails have a larger independent allowance because one directory page can
load many images; successful responses are privately cached by the browser.
Tune `so_finder.limits` for the deployment. The built-in gate uses local locked
files; a multi-host setup should replace it with a shared limiter before
distributing concurrent traffic.

Symfony, PSR-15 and Laravel now use the same endpoint groups, including image variants and document preview jobs. Laravel uses its lock-capable cache store; PSR-15 supports an injected shared request-gate store for multi-node hosts. Verify the actual configured budgets and actor isolation. Corrupted local state fails with 503 rather than resetting counts.

JSON/form metadata is limited to 1 MiB, 4096 values and 32 levels; binary uploads retain separate stream and chunk budgets. Signed/share issuance requires POST and CSRF. Temporary bearer links intentionally remain usable without login until expiry; they are not an immediate account-revocation mechanism. Disable them for strictly private content. Weak legacy grants must be regenerated; protected streams are SHA-256-checked snapshots with private no-store caching. Self-started native sessions set Secure on HTTPS; reused host sessions remain the host's responsibility.

The default inspector is replaceable through `FileInspectorInterface`.
Deployments accepting untrusted public uploads should decorate it with an
antivirus or content-disarm service and use operation events for application
audit and quota policy.
