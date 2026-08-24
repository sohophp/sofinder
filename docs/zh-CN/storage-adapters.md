---
title: 存储 Adapter 契约
description: 通过 SoFinder 公开契约实现及注册本机、对象或远端 Storage Adapter。
---

# 存储 Adapter 契约

SoFinder 0.1.0-beta.3 引入预计在 1.x 维持稳定的 Storage Contract。1.0 Release 支持内建 Local Adapter；应用程序可以注册 Remote Adapter，但它不在 1.0 Support Promise 内。

实现 `StorageAdapterInterface` 以提供 Stream I/O 及 Entry Mutation。目录读取会接收 `ListQuery` 并返回 `ListingPage`；返回 Entry 前应套用 Search、Sorting、Filtering 及 Page Bound。当 Backend 只支持 Cursor 时，精确 Total 可为 `null`。非 Null 的 `nextCursor` 对当前 Query 必须保持不透明、稳定，且不得重复。

返回如实的 `StorageCapabilities`。Capability Flag 描述 Backend Native Behavior，让 Browser 避免提供不支持的 Query。它们不会绕过 `AuthorizationInterface`；File Manager 永远会执行授权。

通过 Tagged `StorageAdapterFactoryInterface` Service 注册 Adapter：

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

为 Service 加入 `sofinder.storage_factory` Tag，然后在 Resource Configuration 使用 `adapter: acme` 及 `options` Mapping。Adapter Alias 必须唯一；未知 Alias 会使 Container 初始化失败。

只适用本机的最佳化由不同的可选 Contract 提供：

- `LocalPathProviderInterface` 向私有本机回收站实现提供 Absolute Path。
- `StorageUsageProviderInterface` 提供 Authoritative Full Usage Scan。
- 当不存在 Local Path 时，`StorageAuditProviderInterface` 为 `sofinder:security:audit` 提供不含机密的 Warning 或 Critical Finding。
- 丛集部署可替换 `RecycleBinInterface`、`UsageTrackerInterface`、`MetadataStoreInterface`、`ChunkUploadStoreInterface` 及 `RequestGateStoreInterface`。

没有 `LocalPathProviderInterface` 的 Adapter 必须使用兼容的自订 `RecycleBinInterface`，或停用可恢复删除。没有 `StorageUsageProviderInterface` 的 Adapter 在启用 Quota 前，必须使用已具有 Authoritative Baseline 的 Usage Tracker。

只有已配置的 Recycle-bin Service 能恢复该 Adapter Entry 时，`recoverableDelete` 才能为 True。SoFinder 会通过报告 False 的 Adapter 永久删除，并在 Browser 显示明确的不可恢复警告。可选的 `sohophp/sofinder-s3` 软件包遵循此模型。
