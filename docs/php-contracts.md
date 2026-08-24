# Public PHP contracts

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

Public value objects are immutable. New optional fields or capability flags may
be added in 1.x; consumers must ignore values they do not recognize. Methods
will not be removed or have their parameter meaning changed during 1.x.
