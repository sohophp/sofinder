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

預設 Request Gate 會分別限制一般 API、Upload／Chunk Traffic、唯讀 Thumbnail、圖片編輯、ZIP 產生及 Transfer Batch。因單一目錄頁可能載入大量圖片，Thumbnail 有較高的獨立額度；成功 Response 會由 Browser 私有快取。請依部署調整 `so_finder.limits`。內建 Gate 使用本機 Lock File；多主機部署在分散並行 Traffic 前應改用共用 Limiter。

預設 Inspector 可透過 `FileInspectorInterface` 替換。接受不受信任公開上傳的部署，應以防毒或 Content-disarm Service 裝飾它，並使用 Operation Event 處理應用程式 Audit 與 Quota Policy。
