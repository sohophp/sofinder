---
title: Maintenance modes
description: Configure bounded inline, Symfony Messenger, external or disabled SoFinder maintenance.
---

# Maintenance modes

> Traditional Chinese: [Maintenance modes](/zh-TW/maintenance)

SoFinder defaults to bounded `inline` maintenance and therefore does not
require cron, systemd or a long-running PHP process. Recycle-bin item and byte
limits are always enforced synchronously when an entry is deleted. Opportunity
cleanup is separately throttled and protected by non-blocking per-task locks.

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

- `inline` performs at most the configured number of expired items after a
  related request and never performs an ordinary full usage scan.
- `messenger` dispatches an allowlisted `MaintenanceMessage`; install Symfony
  Messenger, route the message to a durable transport and start a consumer
  before selecting this mode.
- `external` performs no request-triggered work. Invoke the Console commands
  from an operator-managed scheduler.
- `disabled` disables opportunity cleanup. Manual commands remain available,
  and recycle-bin capacity enforcement remains active.

```bash
bin/console sofinder:uploads:cleanup
bin/console sofinder:trash:cleanup
bin/console sofinder:usage:recalculate
```

The commands and message handler share the same non-blocking locks. Starting a
second copy of the same task safely reports a skip instead of running twice.
Full usage recalculation is intentionally kept out of web requests unless a
dirty persisted usage state must be recovered for a quota decision.
