---
title: 儲存 Adapter 契約
description: 透過 SoFinder 公開契約實作及註冊本機、物件或遠端 Storage Adapter。
---

# 儲存 Adapter 契約

SoFinder 0.1.0-beta.3 引入預計在 1.x 維持穩定的 Storage Contract。1.0 Release 支援內建 Local Adapter；應用程式可以註冊 Remote Adapter，但它不在 1.0 Support Promise 內。

實作 `StorageAdapterInterface` 以提供 Stream I/O 及 Entry Mutation。目錄讀取會接收 `ListQuery` 並回傳 `ListingPage`；回傳 Entry 前應套用 Search、Sorting、Filtering 及 Page Bound。當 Backend 只支援 Cursor 時，精確 Total 可為 `null`。非 Null 的 `nextCursor` 對目前 Query 必須保持不透明、穩定，且不得重複。

回傳如實的 `StorageCapabilities`。Capability Flag 描述 Backend Native Behavior，讓 Browser 避免提供不支援的 Query。它們不會繞過 `AuthorizationInterface`；File Manager 永遠會執行授權。

透過 Tagged `StorageAdapterFactoryInterface` Service 註冊 Adapter：

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

為 Service 加入 `sofinder.storage_factory` Tag，然後在 Resource Configuration 使用 `adapter: acme` 及 `options` Mapping。Adapter Alias 必須唯一；未知 Alias 會使 Container 初始化失敗。

只適用本機的最佳化由不同的選用 Contract 提供：

- `LocalPathProviderInterface` 向私有本機回收站實作提供 Absolute Path。
- `StorageUsageProviderInterface` 提供 Authoritative Full Usage Scan。
- 當不存在 Local Path 時，`StorageAuditProviderInterface` 為 `sofinder:security:audit` 提供不含機密的 Warning 或 Critical Finding。
- 叢集部署可替換 `RecycleBinInterface`、`UsageTrackerInterface`、`MetadataStoreInterface`、`ChunkUploadStoreInterface` 及 `RequestGateStoreInterface`。

沒有 `LocalPathProviderInterface` 的 Adapter 必須使用相容的自訂 `RecycleBinInterface`，或停用可復原刪除。沒有 `StorageUsageProviderInterface` 的 Adapter 在啟用 Quota 前，必須使用已具有 Authoritative Baseline 的 Usage Tracker。

只有已設定的 Recycle-bin Service 能還原該 Adapter Entry 時，`recoverableDelete` 才能為 True。SoFinder 會透過回報 False 的 Adapter 永久刪除，並在 Browser 顯示明確的不可復原警告。選用的 `sohophp/sofinder-s3` 套件遵循此模型。

## 可執行契約驗證

第三方 Adapter 可執行 SoFinder 週期性供應商檢查使用的同一套公開、框架無關相容性探針：

```php
use SohoPHP\SoFinder\Testing\StorageAdapterContractVerifier;

StorageAdapterContractVerifier::verify($adapter);
```

探針會在隨機的 `sofinder-contract-<16 位小寫十六進位字元>` 目錄中執行變更並將其刪除。只能在憑證權限受限的專用空白測試資源執行；切勿用於正式環境或使用者可控制的命名空間。
