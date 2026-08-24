---
title: 開發者整合指南
description: 在 Symfony 應用中嵌入 SoFinder、接收選擇結果、呼叫服務並安全擴充套件。
---

# 開發者整合指南

請先完成[安裝](/zh-TW/getting-started)和 [Symfony 設定](/zh-TW/symfony)。本指南說明 Bundle、路由和資源正常工作後的應用整合。

## 選擇整合方式

| 需求 | 推薦方式 |
| --- | --- |
| 完整檔案管理 | manager 模式的 `/sofinder/browser` |
| 選擇一個檔案／圖片 | picker 模式和 `sofinder:select` Event |
| CKEditor 4 | [CKEditor 指南](/zh-TW/ckeditor4)中的 Callback 和快速上傳 |
| 自定義前端 | 經過認證的 [HTTP API](/zh-TW/api-reference) |
| 服務端業務邏輯 | 注入 `FileManager` 和公開 Contract |
| 新儲存後端 | `StorageAdapterFactoryInterface` 和[儲存 Adapter Contract](/zh-TW/storage-adapters) |

## 嵌入 manager 或 picker

可使用經過驗證的顯示引數：

```text
/sofinder/browser?uiMode=manager
/sofinder/browser?select=1&type=Images&selection=image&uiMode=picker
```

`uiMode` 可以是 `auto`、`manager`、`picker`；`type` 選擇初始資源；`selection` 為 `any`、`file`、`image`，圖片必須可嵌入瀏覽器。`uiHeader`、`uiLogo`、`uiSearch`、`uiLanguage`、`uiView` 只接受 `0` 或 `1`。這些引數不會增加權限。

不使用 CKEditor 的同視窗或 iframe 選擇器可監聽：

```javascript
window.addEventListener("sofinder:select", (event) => {
  const entry = event.detail;
  console.log(entry.path, entry.url, entry.mimeType);
});
```

Event 在 picker 所在 Window 觸發。iframe 可在載入完成後監聽 `iframe.contentWindow`，或由嚴格同源的 Wrapper 轉發。SoFinder 不提供不受限制的跨域 `postMessage`。

## 呼叫 HTTP API

讀取請求使用目前 Symfony Session；寫請求還需要 Browser Bootstrap 中注入的 Token：

```javascript
const response = await fetch("/sofinder/api/folders", {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": csrfToken
  },
  body: JSON.stringify({ resource: "Files", path: "manuals", name: "2026" })
});
const payload = await response.json();
if (!response.ok || !payload.success) throw new Error(payload.error?.message);
```

不要把前端 Capability 當作授權結果。客戶端必須處理 `total: null`、不透明 Cursor、批次部分失敗、`409 conflict`、`413` 策略限制、`415` 媒體拒絕和帶 `Retry-After` 的 `429`。詳見[完整 API 參考](/zh-TW/api-reference)。

## 服務端使用 FileManager

將 `SohoPHP\SoFinder\FileManager` 注入應用服務。始終傳入已設定資源名和邏輯規範化路徑，不要傳絕對儲存路徑。

```php
use SohoPHP\SoFinder\FileManager;

final readonly class DocumentService
{
    public function __construct(private FileManager $files) {}

    public function openManual(string $path)
    {
        return $this->files->read('Documents', $path);
    }
}
```

`FileManager` 會執行資源查詢、路徑規範化、授權、配額、Operation Gate、儲存 Capability、Audit Event 和用量記賬。不要繞過它直接解析 Adapter。讀取結果是 Stream，由呼叫方負責關閉。

## 穩定的檔案入口 URL

資源的 `entry_url` 可以把 Storage Key 轉成應用 URL。Route Template 支援 `{resource}`、`{path}`、`{name}`、`{stem}`、`{extension}`、`{storage_url}`。實現 `EntryUrlContextProviderInterface` 可新增 `{id}` 等宿主資料庫值。最終 Route Controller 負責自己的存取策略，可透過 `FileManager::read()` 輸出，也可重定向公開 Provider URL。

## Event 與業務策略

訂閱 `OperationEvent` 的 `before.<operation>` 和 `after.<operation>`。Before Subscriber 可丟擲 Domain Exception 拒絕操作；After Event 在儲存變更後觸發，通知、索引和資料庫同步必須可重試且冪等。應忽略未知 Context Key。

業務級資源、操作和規範化路徑判斷可替換 `AuthorizationInterface`，未知操作必須返回 false。`ActorProviderInterface` 必須返回穩定、不透明的 ID，用於隔離上傳 Session、Metadata 和回收站歸屬。

## 擴充套件點

- 儲存：`StorageAdapterInterface`、可選 Capability Interface、帶 Tag 的 Factory。
- 狀態：`ChunkUploadStoreInterface`、`MetadataStoreInterface`、`RequestGateStoreInterface`、`UsageTrackerInterface`、`RecycleBinInterface`。
- 安全：`FileInspectorInterface`、`AuthorizationInterface`。
- 圖片：`ImageProcessorInterface`、`ImageCapabilityProviderInterface`。
- UI 描述：使用 `sofinder.plugin` Tag 的 `PluginInterface`。
- URL 與審計：`EntryUrlContextProviderInterface`、`StorageAuditProviderInterface`、Operation Event。

完整清單參見 [PHP Contract](/zh-TW/php-contracts)。實現必須支援併發，不在異常中暴露儲存路徑或金鑰，併為可預期的 Domain Failure 丟擲帶穩定 Machine Code 的 `SoFinderException`。

## 整合測試清單

至少自動化驗證：

1. 路由匯入和登入存取；
2. 每類資源的列表、新建、上傳、讀取、重新命名、複製、移動、刪除、恢復；
3. CSRF、Role、Path ACL 拒絕；
4. 上傳副檔名、MIME、大小、配額和衝突；
5. public 與 proxy 入口 URL；
6. 遠端 Adapter 的 Cursor 分頁和批次部分失敗；
7. CKEditor Callback 或自定義 picker；
8. 接近生產環境的 Security Audit 和用量重算。

可使用 `examples/symfony` 作為整合 Fixture。部署期間必須執行 `sofinder:security:audit`，Critical 結果應阻止釋出。

