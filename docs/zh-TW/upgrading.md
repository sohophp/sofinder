---
title: 升級指南
description: 各 SoFinder 預發布版本的相容性、設定與 adapter 升級說明。
---

# 升級 SoFinder

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
