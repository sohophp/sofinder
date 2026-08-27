---
title: Console commands
description: Deploy-time validation and scheduled maintenance commands provided by SoFinder.
---

# Console commands

Run commands through the host Symfony application's `bin/console`.

## Security audit

```bash
bin/console sofinder:security:audit
bin/console sofinder:security:audit --json
```

Audits configured storage roots and private working directories. Run it during deployment and after changing paths, permissions or storage configuration.
The JSON form is intended for deployment gates and monitoring; critical findings return a non-zero exit status in both forms.

## Image capabilities

```bash
bin/console sofinder:image:capabilities
bin/console sofinder:image:capabilities --json
```

Shows effective codecs and validates configured resource formats against the current GD and Imagick runtime.

## Recycle-bin cleanup

```bash
bin/console sofinder:trash:cleanup
```

Permanently removes expired local recycle-bin entries. Schedule this when maintenance mode is `external`.

## Stale upload cleanup

```bash
bin/console sofinder:uploads:cleanup
```

Removes expired chunk-upload sessions. Schedule this with recycle-bin cleanup when using external maintenance.

## Usage recalculation

```bash
bin/console sofinder:usage:recalculate
bin/console sofinder:usage:recalculate --dry-run --json
```

Rebuilds persisted resource-usage counters from storage. Use it after importing, restoring or modifying files outside SoFinder.
Dry-run reports scanned values without updating persisted counters.

## Maintenance status

```bash
bin/console sofinder:maintenance:status
bin/console sofinder:maintenance:status --json
```

Reports queued, running, successful and failed tasks. A recorded failure returns a non-zero exit status.

## Metadata repair

```bash
bin/console sofinder:metadata:repair --dry-run --json
bin/console sofinder:metadata:repair
```

Normalizes the local JSON metadata shape and removes references to missing
resources or entries. Dry-run acquires the same lock but never writes. Hosts
using a shared metadata service must use provider-specific repair tooling.

## Stable asset migration

```bash
bin/console sofinder:assets:migrate --dry-run --json
bin/console sofinder:assets:migrate Files --workspace=main --json
```

Recursively previews or registers existing files in the optional asset catalog.
It is bounded by `--limit`, idempotent, never rewrites file content and emits a
path-to-ID report suitable for a separate host content migration.

## Cache cleanup

```bash
bin/console sofinder:cache:cleanup --older-than=86400 --dry-run --json
bin/console sofinder:cache:cleanup --older-than=86400
```

Only matches generated thumbnail PNG and document-preview PDF files. Metrics,
scan history, maintenance state, upload sessions and source files are outside its scope.

Add `--help` to any command to see its current arguments and options:

```bash
bin/console sofinder:security:audit --help
```
