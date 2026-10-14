---
title: 正式環境安全
description: SoFinder 部署的驗證、授權、儲存、上傳與運維安全要求。
---

# 正式環境安全

SoFinder 將每個設定的 Resource Root 視為 Sandbox。Path Traversal、Control Character、隱藏名稱及 Symbolic Link 存取都會被拒絕。上傳會先進入 Mode 0600 的私有 Quarantine；Byte 數量來自 Stream，而不是信任 Request Metadata；內容經檢查後才以 Atomic 方式發布。圖片副檔名必須符合偵測到的 MIME，而且圖片必須在設定的像素限制內完整 Decode。

請將 `quarantine_dir`、`chunk_dir`、`trash_dir`、Metadata，以及 Thumbnail／Archive Cache 放在公開 Resource Root 外。停用公開上傳 Alias 的 Script Execution。Proxy Resource 不得透過另一個 Alias 暴露 Root，否則該 URL 會繞過 Read ACL。

刪除會把項目移至依 Actor 隔離的私有回收站。Overwrite Conflict 的還原會使用 Atomic Destination Backup。請排程：

```bash
bin/console sofinder:trash:cleanup
bin/console sofinder:uploads:cleanup
```

設定或部署變更後執行：

```bash
bin/console sofinder:security:audit
```

三種框架共用的 Request Gate 會分別限制已對應的一般 API、Upload／Chunk Traffic、唯讀 Thumbnail、圖片編輯、ZIP 產生及 Transfer Batch。因單一目錄頁可能載入大量圖片，Thumbnail 有較高的獨立額度；成功 Response 會由 Browser 私有快取。請依部署調整 `so_finder.limits`。內建 Gate 使用本機 Lock File；多主機部署在分散並行 Traffic 前應改用共用 Limiter。

Symfony、PSR-15 與 Laravel 已共用端點分組，包含圖片變體及文件預覽工作。Laravel 使用支援鎖的宿主快取；PSR-15 多節點部署可注入共用 RequestGateStore。須複驗實際額度與使用者隔離；本機狀態損壞回傳 503，不會重設計數。

JSON／表單中繼資料上限為 1 MiB、4096 個值、32 層；二進位上傳保留獨立串流與分塊預算。分享／簽名簽發要求 POST＋CSRF。臨時 bearer 連結依設計可匿名使用至到期，不代表帳號撤權後立即失效；嚴格私有內容應停用此功能。舊弱綁定授權須重建；新授權使用 SHA-256 校驗快照並禁止快取。自行啟動原生工作階段時 HTTPS 使用 Secure，重用的宿主工作階段由宿主維護安全屬性。

預設 Inspector 可透過 `FileInspectorInterface` 替換。接受不受信任公開上傳的部署，應以防毒或 Content-disarm Service 裝飾它，並使用 Operation Event 處理應用程式 Audit 與 Quota Policy。
