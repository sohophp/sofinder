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
- `SharedMetricsStore` for cluster-wide Prometheus counters;
- shared maintenance leases, status and chunk-session coordination.

Create the PDO store once with the host-owned connection; it creates the portable
`sofinder_state` table automatically, or call `install()` during deployment.
Register the host-owned state object as a Symfony service. Connection
credentials, retry policy and TLS settings remain outside bundle configuration.

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

```yaml
so_finder:
  cluster:
    state_service: 'app.sofinder_shared_state'
    chunk_upload_store_service: 'app.sofinder_shared_chunks' # optional
    shared_preview_cache: true # only after mounting cache_dir/document-previews
```

`state_service` automatically replaces metadata, request-gate, usage and metrics
stores, and enables shared maintenance and chunk-session coordination.
`/health` then performs an atomic shared-state read/write probe. The configured
services implement `AtomicStateStoreInterface` and `ChunkUploadStoreInterface`.

Chunk bytes still need `chunk_dir` mounted as the same shared private filesystem
on every node, or a host implementation of
`ChunkUploadStoreInterface`. Remote recycle behavior belongs to the storage
provider (for example bucket versioning); state storage is not a substitute for
file recovery.

## ClamAV

Enable the built-in ClamAV integration in SoFinder configuration. It streams the
private quarantine file to clamd's `INSTREAM` protocol, invokes no shell and
fails closed.

```yaml
so_finder:
  malware_scanning:
    enabled: true
    endpoint: 'unix:///run/clamav/clamd.ctl'
    timeout_seconds: 8
    history_limit: 100
    status_roles: [ROLE_ADMIN]
```

Rejected files return `malware_detected`; unavailable or ambiguous scanners
return `malware_scanner_unavailable` and the quarantine file is removed.
The Security status dialog and `GET /api/security/status` show the configured
state, live clamd readiness, bounded recent results and counts. Prometheus also
exports scan count, scanned bytes and cumulative duration counters by result.

## Readiness and metrics

- `GET /health` checks private runtime paths, built assets, image codecs,
  maintenance mode, every storage resource and tagged plugin checks. `down`
  returns HTTP 503; `degraded` remains HTTP 200.
- `GET /live` only proves that PHP and the bundle initialized; it does not probe
  storage, queues or external services.
- `GET /metrics` exposes bounded Prometheus counters, storage latency totals and
  observations, Office queue/conversion/cache activity, ClamAV timeouts, queue
  backlog/failed gauges, upload failures, limiter rejections and `sofinder_ready`.
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
