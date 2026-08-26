---
title: Production and multi-node operation
description: Configure shared state, malware scanning, health checks, metrics and request correlation for production SoFinder deployments.
---

# Production and multi-node operation

The default file-backed stores are deliberately simple and safe for one PHP
application node. A multi-node deployment must share object storage and runtime
state; do not point independent local stores at each node and expect quota,
metadata or rate limits to remain consistent.

## Database or Redis state

`PdoAtomicStateStore` supports SQLite for local integration tests and MySQL or
PostgreSQL for shared deployments. `RedisAtomicStateStore` uses ext-redis and a
bounded exclusive lock. Both implement `AtomicStateStoreInterface`; compose one
with:

- `SharedMetadataStore` for favorites, tags and recent files;
- `SharedRequestGateStore` for cross-node request/concurrency limits;
- `SharedUsageTracker` for atomic quota accounting.

Create the PDO store once with the host-owned connection; it creates the portable
`sofinder_state` table automatically, or call `install()` during deployment.
Override the corresponding Symfony aliases in the host container. The host owns
connection credentials, retry policy and TLS settings.

```php
$state = new PdoAtomicStateStore($pdo);
$metadata = new SharedMetadataStore($state);
$gates = new SharedRequestGateStore($state);
$usage = new SharedUsageTracker($state);
```

For Redis:

```php
$state = new RedisAtomicStateStore($redis, 'myapp:sofinder:');
```

Chunk bytes still need a shared private filesystem or a host implementation of
`ChunkUploadStoreInterface`. Remote recycle behavior belongs to the storage
provider (for example bucket versioning); state storage is not a substitute for
file recovery.

## ClamAV

Register `ClamAvScanner` as a Symfony service. Autoconfiguration tags it as both
an `UploadScannerInterface` and a `HealthCheckInterface`. It streams the private
quarantine file to clamd's `INSTREAM` protocol, invokes no shell and fails closed.

```yaml
services:
  SohoPHP\SoFinder\Security\ClamAvScanner:
    arguments:
      $endpoint: 'unix:///run/clamav/clamd.ctl'
      $timeoutSeconds: 8
```

Rejected files return `malware_detected`; unavailable or ambiguous scanners
return `malware_scanner_unavailable` and the quarantine file is removed.

## Readiness and metrics

- `GET /health` checks private runtime paths, built assets, every storage resource
  and tagged plugin checks. `down` returns HTTP 503; `degraded` remains HTTP 200.
- `GET /metrics` exposes bounded Prometheus counters and `sofinder_ready`.
- Every SoFinder response includes `X-Request-ID`. A safe incoming value is
  preserved; otherwise SoFinder creates one. Audit and failure logs include it.

Keep health and metrics behind an internal firewall or dedicated monitoring role.
Neither endpoint exposes credentials or absolute storage paths, but resource
names and operational status are still administrative information.

## Release checks

Run the security audit, health request, metrics scrape, usage recalculation and
one real upload/read/delete cycle from every deployment environment. For local
testing, the Symfony example exposes `/integrations`, `/sofinder/health` and
`/sofinder/metrics` behind `demo` / `demo` authentication.
