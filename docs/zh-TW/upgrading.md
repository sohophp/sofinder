---
title: 升級指南
description: 各 SoFinder 預發布版本的相容性、設定與 adapter 升級說明。
---

# 升級 SoFinder

## 從 0.1.0-beta.16 升級至 0.1.0-beta.17

請一併部署全部重建的 Browser Asset，檔案與 Metadata 無需遷移。新增 Host 功能開關
預設啟用以維持相容；需要時可明確關閉 `batch_rename`、`image_editing`、
`image_processing`、`document_preview` 或 `security_status`。

跨域 Picker 呼叫端必須精確列入 `picker.allowed_origins`。設定
`cluster.state_service` 後，指標、維護狀態與分塊 Session 會自動共享；所有節點必須把
`chunk_dir` 掛載為相同的私有共享路徑，或提供 `cluster.chunk_upload_store_service`。
切換流量前應檢查 `/health`、抓取 `/metrics` 並完成一次續傳。

## 從 0.1.0-beta.15 升級至 0.1.0-beta.16

請同時部署 `sofinder.js`、`sofinder-picker.js` 與 `sofinder.css`。儲存檔案和 metadata 無需遷移。瀏覽器工具偏好改用 `sofinder.tools.v3`；批次重新命名和壓縮／浮水印會保持關閉，直到各使用者在「設定」中啟用。網格與清單大小分別儲存在 `sofinder.viewSizes.v1`。

PDF 預覽不依賴 LibreOffice。Office 預覽需要設定 `document_preview.office: true` 並提供可執行的 LibreOffice Binary；部署後請檢查 `/health`。私有資源可使用簽名網址或設定 `entry_url` Host 路由。啟用第三方 plugin UI 資源前，請核對新增安全回應標頭與 Host CSP。

## 從 0.1.0-beta.14 升級至 0.1.0-beta.15

請同時部署重新建置的 `sofinder.js`、`sofinder-picker.js` 與 `sofinder.css`。既有路由及檔案資料無需遷移。多節點宿主可透過覆寫 metadata、usage 與 request-gate alias 選用新的 PDO 或 Redis 狀態 Store；單節點仍預設使用檔案 Store。請透過監控角色或網路政策保護 `/health` 與 `/metrics`，並以 `sofinder:security:audit --json` 作為部署閘門。

## 從 0.1.0-beta.13 升級至 0.1.0-beta.14

縮圖快取現在會在原子發布後套用設定的權限。預設目錄為 `0775`、檔案為 `0664`。
PHP-FPM 與部署程序使用共享群組的專案可設定：

```yaml
so_finder:
  filesystem_permissions:
    directory_mode: '2775'
    file_mode: '0664'
```

權限值必須是加上引號的八進位字串。升級不會修改歷史檔案的 owner 或權限。

## 從 0.1.0-beta.12 升級至 0.1.0-beta.13

- CKEditor 4 快速上傳現在會保留同名原檔案，並把新檔案儲存為 `photo(1).jpg` 這類 CKFinder 風格名稱；整合會收到實際改名 URL 與上傳成功提示。
- 確實需要取代同名檔案的宿主必須設定 `so_finder.ckeditor4.overwrite_on_upload: true`，並授予獨立的 `overwrite` 操作權限；安全預設值為 `false`。
- 自訂 Multipart 上傳客戶端可透過 `autoRename=1` 使用相同行為。無需遷移儲存檔案、資料庫或前端資源。

## 從 0.1.0-beta.11 升級至 0.1.0-beta.12

- 部署已提交的瀏覽器資源。只有需要完整 ACL 工具列的 picker 才加入 `uiTools=full`；預設仍為精簡模式。
- 依照更嚴格的可攜名稱和副檔名不可修改規則檢查既有整合。
- 目錄 API 每頁數量現在限制為 10–500。

## 從 0.1.0-beta.6 升級至 0.1.0-beta.7

預設檔案瀏覽器不再顯示深色 SoFinder 品牌頁首。若要還原只有品牌的頁首，設定 `so_finder.ui.header: true`；顯示標誌則設定 `so_finder.ui.logo: true`。現有的語言、檢視、縮放與功能偏好仍然有效。支援 cursor 的 HTTP client 必須接受 `total: null`。

無法使用已設定回收站的遠端 adapter，應繼續回報 `recoverableDelete: false`；刪除操作此時會明確成為永久刪除。若要參與主要安全稽核，請實作 `StorageAuditProviderInterface`。現有本機 adapter 無須變更。

## 從 0.1.0-beta.5 升級至 0.1.0-beta.6

這是僅更新文件的版本，不需要遷移設定、儲存空間、API 或資產。現有 `maintenance`、`ui.scale`、檔案路徑與公開 URL 均保持不變。

## 從 0.1.0-beta.4 升級至 0.1.0-beta.5

不需要遷移檔案、URL 或 metadata。維護預設使用有界的 `inline` 執行，因此現有宿主即使沒有 cron 或 worker 也能安全運作。使用 Symfony Messenger 的宿主可選擇 `maintenance.mode: messenger`；安裝 `symfony/messenger`、將 `MaintenanceMessage` 路由至非同步 transport，並在切換模式前啟動 consumer。`external` 保留 Console／cron 控制，`disabled` 會關閉機會式清理，但不關閉回收站容量限制。選用的 `ui.scale` 預設為 `standard`。

## 從 0.1.0-beta.3 升級至 0.1.0-beta.4

已儲存檔案、公開 URL、metadata 與回收站資料均無須遷移。HEIC、HEIF 與 TIFF 不再是圖片 pipeline 格式，請從僅限圖片的資源移除其副檔名與 MIME alias。它們可保留在一般 `Files` 資源中；SoFinder 會將其視為普通可下載檔案，不進行解碼、尺寸讀取、縮圖或圖片編輯。

現有的非 Web 圖片檔不會刪除；它們仍以一般檔案顯示，但無法在圖片模式選取，也不能傳入圖片 endpoint。升級後請執行 `sofinder:image:capabilities` 與 `sofinder:security:audit`。

## 從 0.1.0-beta.2 升級至 0.1.0-beta.3

已儲存檔案、公開 URL、metadata 與回收站資料均無須遷移。實作 `StorageAdapterInterface` 的 PHP 應用程式需要進行一次更新：

1. 將 `list(string $path): array` 改為 `list(ListQuery $query): ListingPage`，並加入 `capabilities()`。
2. Adapter 能公開安全本機路徑時，將 `absolutePath()` 移至 `LocalPathProviderInterface`。
3. 可完整掃描用量時，將 `usage()` 移至 `StorageUsageProviderInterface`。
4. 透過帶 tag 的 `StorageAdapterFactoryInterface` 註冊 adapter；內建 `adapter: local` 設定不變。

SoFinder 現在支援 PHP 8.2–8.5 與 Symfony 6.4／7.4。HTTP 路由及 beta.2 response field 保持相容。設定可加入 adapter 專用的 `options` map。請將 `sofinder:uploads:cleanup` 與既有回收站清理命令一併排程。

## 從 0.1.0-beta.1 升級至 0.1.0-beta.2

不需要遷移儲存空間。此版本將縮圖流量從圖片編輯 request limit 分離。宿主可覆寫新的 `so_finder.limits.thumbnail` 群組；預設值為每分鐘 600 次請求及 16 個並行請求。若宿主分開發布資產，請重新建置或替換 bundled assets。瀏覽器語言偏好現在包括英文、簡體中文與繁體中文。

## 從 Composer path repository 改用已標記版本

1. 提交或備份宿主設定與業務上傳檔案。
2. 從宿主 `composer.json` 移除本機 `repositories` path 項目。
3. Require 預定且不可變更的 SoFinder 標籤，再執行 Composer update。
4. 保持既有 `so_finder` 資源根目錄與公開 URL 不變。
5. 加入私有且可寫入的 `usage_dir`，再為每個資源執行一次 `sofinder:usage:recalculate`。
6. 預熱正式環境 Symfony cache，並執行 `sofinder:security:audit`。

從此 beta 起，`overwrite` 是獨立授權操作。宿主 adapter 必須將它對應至修改權限；未知操作應拒絕。替換現有目標的移動與還原操作也需要 `overwrite`。

已發布標籤不可變更。修正必須透過新的預發布版或 patch 版本提供，絕不可重新指向既有標籤。
