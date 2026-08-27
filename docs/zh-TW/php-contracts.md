---
title: 公開 PHP 契約
description: SoFinder 提供給整合與擴充使用的公開 PHP Interface 與 Value Object。
---

# 公開 PHP 契約

SoFinder 1.x 將 `SohoPHP\SoFinder\Contract` 下的 Interface 及文件化 Value Object 視為公開擴充介面。實作是 Symfony Service；可替換對應的 Interface Alias，或使用下述 Tag。實作必須能安全處理並行請求，且應拋出 SoFinder Domain Exception，不得洩漏 Storage Path 或機密。

## 授權與 Actor

`AuthorizationInterface` 驗證請求，並針對每個 `operation`、Resource 及正規化 Path 作出決定。未知操作必須回傳 `false`。Browser Capability Field 只供參考，不能取代伺服器端檢查。`ActorProviderInterface` 提供穩定、不透明的 Actor ID，用來隔離分塊上傳、Metadata 及回收站狀態。

## 儲存與狀態

Storage Interface、選用的本機 Capability 及 Factory Tag 記錄於[儲存 Adapter 契約](/zh-TW/storage-adapters)。可透過 `ChunkUploadStoreInterface`、`RequestGateStoreInterface`、`MetadataStoreInterface` 及 `UsageTrackerInterface` 分別替換狀態實作。Usage Tracker 必須依資源序列化 `mutate()` 呼叫，並以 Atomic 方式回傳 Callback 的精確 Byte Delta。

Remote Adapter 也可實作 `StorageAuditProviderInterface`，向安全稽核回傳不含機密的 `warning` 或 `critical` Finding。

可選的 `AssetCatalogInterface` 依 Workspace／資源／路徑解析不透明資產 ID，並維護上傳、移動、刪除與還原的身分變化；JSON 實作用於單節點，共享實作基於 `AtomicStateStoreInterface`。`WorkspaceResolverInterface` 必須從可信請求上下文回傳不可變 `WorkspaceContext`，不得直接信任瀏覽器查詢參數。

`EntryUrlContextProviderInterface` 可為資源設定的 `entry_url` Route Template 加入宿主擁有的 Scalar Value。Autoconfiguration 會自動加入 `sofinder.entry_url_context_provider` Tag。Provider 對無關資源應回傳空陣列，且不得在 Route Parameter 中暴露機密。

## 檢查與圖片

`FileInspectorInterface` 會接收私有 Quarantine Path、不受信任的檔名及 Resource Policy。它只能在內容檢查成功後回傳已驗證的 Metadata。`ImageProcessorInterface` 必須驗證完整圖片 Decode、如實回報 Animation，並且只寫入指定 Destination；不得默默壓平不支援的動態圖片。

## Event 與 Plugin

實作 `PluginInterface` 以提供 Browser-safe Descriptor，並使用 `sofinder.plugin` Tag。檔案操作會發送名稱為 `before.<operation>` 及 `after.<operation>` 的 `OperationEvent`。Before Handler 可透過拋出 Exception 拒絕操作；After Handler 必須假設 Storage 已變更，並讓次要工作保持 Idempotent。Event Context 是可擴充 Map，因此 Subscriber 必須忽略未知 Key。

新版 `AssetOperationEvent` 會同步派發，包含穩定操作 ID、固定操作與階段、Workspace、邏輯路徑、可選資產 ID 和安全可序列化屬性；公開格式請見 [Event Schema](/schema/asset-operation-event.schema.json)。

公開 Value Object 不可變。1.x 可新增選用 Field 或 Capability Flag；Consumer 必須忽略不認識的值。在 1.x 期間，Method 不會被移除，Parameter 的意義也不會改變。
