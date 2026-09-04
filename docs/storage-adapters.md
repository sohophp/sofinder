---
title: Storage adapter contract
description: Implement and register local, object or remote storage adapters through SoFinder's public contracts.
---

# Storage adapter contract

SoFinder 0.1.0-beta.3 introduces the storage contract intended to remain
stable through 1.x. The 1.0 release supports the bundled local adapter; remote
adapters may be registered by applications but are not part of the 1.0 support
promise.

Implement `StorageAdapterInterface` for stream I/O and entry mutations. Directory
reads receive a `ListQuery` and return a `ListingPage`. Apply its search,
sorting, filtering and page bounds before returning entries. Exact totals may
be `null` when a backend only supports cursors. A non-null `nextCursor` must be
opaque, stable for the current query and must never repeat.

Return a truthful `StorageCapabilities` value. Capability flags describe native
backend behavior and allow the browser to avoid offering unsupported queries.
They do not bypass `AuthorizationInterface`; authorization is always evaluated
by the file manager.

Register adapters through a tagged `StorageAdapterFactoryInterface` service:

```php
final class AcmeStorageFactory implements StorageAdapterFactoryInterface
{
    public function alias(): string { return 'acme'; }

    public function create(ResourceType $resource, array $options = []): StorageAdapterInterface
    {
        return new AcmeStorageAdapter($options);
    }
}
```

Tag the service `sofinder.storage_factory`, then use `adapter: acme` and an
`options` mapping in the resource configuration. Adapter aliases must be
unique. Unknown aliases fail container initialization.

Local-only optimizations are separate optional contracts:

- `LocalPathProviderInterface` supplies an absolute path to the private local
  recycle-bin implementation.
- `StorageUsageProviderInterface` supplies an authoritative full usage scan.
- `StorageAuditProviderInterface` supplies secret-safe warning or critical
  findings for `sofinder:security:audit` when no local path exists.
- `RecycleBinInterface`, `UsageTrackerInterface`, `MetadataStoreInterface`,
  `ChunkUploadStoreInterface` and `RequestGateStoreInterface` can be replaced
  for clustered deployments.

An adapter without `LocalPathProviderInterface` must use a compatible custom
`RecycleBinInterface` or disable recoverable deletion. An adapter without
`StorageUsageProviderInterface` must use a usage tracker that already has an
authoritative baseline before quotas are enabled.

`recoverableDelete` must be true only when the configured recycle-bin service
can restore that adapter's entries. SoFinder permanently deletes through an
adapter that reports false and presents an explicit non-recoverable warning in
the browser. The optional `sohophp/sofinder-s3` package follows this model.

## Executable contract verification

Third-party adapters can run the same public, framework-neutral compatibility
probe used by SoFinder's scheduled provider checks:

```php
use SohoPHP\SoFinder\Testing\StorageAdapterContractVerifier;

StorageAdapterContractVerifier::verify($adapter);
```

The verifier mutates and then removes a randomized
`sofinder-contract-<16 lowercase hex characters>` directory. Run it only on a
dedicated, empty test resource whose credentials are restricted to that
resource; never run it against production or a user-controlled namespace.
