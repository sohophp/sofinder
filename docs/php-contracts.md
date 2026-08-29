---
title: Public PHP contracts
description: Public PHP interfaces and value objects provided for SoFinder integrations and extensions.
---

# Public PHP contracts

`ConfigurationNormalizer` is the framework-neutral entry point for YAML-derived
or native PHP configuration arrays. `normalize($config, $hostDefaults)` applies
the published snake_case defaults, replaces list values instead of merging list
indexes, preserves the deprecated upload-naming alias, and rejects unsafe core
limits. A framework adapter may resolve environment expressions first, but must
pass the resolved result through `normalizeResolved()` before wiring services.

SoFinder 1.x treats the interfaces under `SohoPHP\SoFinder\Contract` and the
documented value objects as its public extension surface. Implementations are
Symfony services; replace the corresponding interface alias or use the tags
described below. Implementations must be safe for concurrent requests and must
throw SoFinder domain exceptions rather than expose storage paths or secrets.

## Authorization and actors

`AuthorizationInterface` authenticates the request and decides each
`operation`, resource and normalized path. Unknown operations must return
`false`. Browser capability fields are advisory only and do not replace this
server-side check. `ActorProviderInterface` supplies the stable opaque actor ID
used to isolate chunk uploads, metadata and recycle-bin state.

## Storage and state

The storage interfaces, optional local capabilities and factory tag are
documented in [storage-adapters.md](storage-adapters.md). State can be replaced
independently through `ChunkUploadStoreInterface`,
`RequestGateStoreInterface`, `MetadataStoreInterface` and
`UsageTrackerInterface`. A usage tracker must serialize `mutate()` calls for a
resource and return the callback's exact byte delta atomically.
Remote adapters may additionally implement `StorageAuditProviderInterface` to
return secret-safe `warning` or `critical` findings to the security audit.

`AssetCatalogInterface` is the optional stable identity layer. It resolves by
workspace/resource/path, finds opaque IDs and records upload, move, delete and
file or directory-tree restore identity transitions. The bundled JSON implementation is single-node;
the shared implementation uses `AtomicStateStoreInterface`. Asset metadata uses
optimistic versions and reports stale writes as `asset_metadata_conflict`.

`WorkspaceResolverInterface` resolves a trusted immutable `WorkspaceContext`
from the framework-neutral `RequestContext`; host implementations must not type
this parameter as Symfony, Laravel or PSR request objects. The corresponding
bridge owns that conversion. `CsrfTokenProviderInterface` similarly isolates
token issue/validation from the host framework.
The resolved Workspace context contains the opaque workspace ID, actor and
allowed resources. Resolvers must derive it from authenticated host context;
they must not trust a browser query parameter. Storage isolation remains the
host adapter/resource mapping's responsibility.

`EntryUrlContextProviderInterface` may add host-owned scalar values to a
resource's configured `entry_url` route templates. It is autoconfigured with
the `sofinder.entry_url_context_provider` tag. Providers should return an empty
array for unrelated resources and must not expose secrets in route parameters.

## Inspection and images

`FileInspectorInterface` receives the private quarantine path, untrusted file
name and resource policy. It must return verified metadata only after content
inspection succeeds. `ImageProcessorInterface` must validate a complete image
decode, report animation truthfully and write transformations only to the
provided destination. It must never silently flatten an unsupported animated
image.

## Events and plugins

Implement `PluginInterface` for browser-safe descriptors and use the
`sofinder.plugin` tag. File operations dispatch `OperationEvent` with
`before.<operation>` and `after.<operation>` names. Before handlers may reject
an operation by throwing; after handlers must assume storage has already
changed and should make secondary work idempotent. Event context is an
extensible map, so subscribers must ignore unknown keys.

`AssetOperationEvent` is the schema-versioned successor and is dispatched in
parallel. It carries a stable operation ID, fixed operation and phase, workspace,
resource, logical paths, optional asset ID and safe serializable attributes. Its
published JSON shape is documented by [the event Schema](/schema/asset-operation-event.schema.json).

`AssetUsageStoreInterface` lets a host register content records that reference a
stable asset ID; it powers usage display and deletion preflight. Optional plugins
may implement `AssetVersionProviderInterface` or `AssetEnrichmentProviderInterface`.
Core does not retain versions and never persists generated alt text, titles or
tags automatically: enrichment results are suggestions that require a host/user
decision. `/api/capabilities` advertises both optional contracts.

Public value objects are immutable. New optional fields or capability flags may
be added in 1.x; consumers must ignore values they do not recognize. Methods
will not be removed or have their parameter meaning changed during 1.x.
