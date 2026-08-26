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
```

Rebuilds persisted resource-usage counters from storage. Use it after importing, restoring or modifying files outside SoFinder.

Add `--help` to any command to see its current arguments and options:

```bash
bin/console sofinder:security:audit --help
```
