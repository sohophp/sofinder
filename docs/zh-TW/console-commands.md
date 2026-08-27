---
title: Console 命令
description: SoFinder 提供的部署驗證與排程維護命令。
---

# Console 命令

請透過宿主 Symfony 應用程式的 `bin/console` 執行命令。

## 安全稽核

```bash
bin/console sofinder:security:audit
bin/console sofinder:security:audit --json
```

稽核已設定的 Storage Root 與私有工作目錄。部署時，以及路徑、權限或儲存設定變更後都應執行。
JSON 格式適合部署閘門與監控；兩種格式發現 Critical 問題時都會回傳非零結束碼。

## 圖片能力

```bash
bin/console sofinder:image:capabilities
bin/console sofinder:image:capabilities --json
```

顯示有效 Codec，並依目前 GD 與 Imagick Runtime 驗證資源格式設定。

## 回收站清理

```bash
bin/console sofinder:trash:cleanup
```

永久移除已過期的本機回收站項目。維護模式為 `external` 時應排程執行。

## 過期上傳清理

```bash
bin/console sofinder:uploads:cleanup
```

移除過期的分塊上傳 Session。使用外部維護時，應與回收站清理一起排程。

## 使用量重新計算

```bash
bin/console sofinder:usage:recalculate
bin/console sofinder:usage:recalculate --dry-run --json
```

從儲存空間重建持久化的資源使用量計數器。在 SoFinder 外部匯入、還原或變更檔案後執行。
Dry-run 只回報掃描值，不修改持久計數。

## 維護狀態

```bash
bin/console sofinder:maintenance:status
bin/console sofinder:maintenance:status --json
```

顯示 queued、running、succeeded 與 failed 任務；存在失敗記錄時回傳非零退出碼。

## Metadata 修復

```bash
bin/console sofinder:metadata:repair --dry-run --json
bin/console sofinder:metadata:repair
```

正規化本機 JSON Metadata，並移除不存在的資源或項目參照。Dry-run 使用同一把鎖但絕不寫入；
共享 Metadata Service 應使用 Provider 自己的修復工具。

## 穩定資產移轉

```bash
bin/console sofinder:assets:migrate --dry-run --json
bin/console sofinder:assets:migrate Files --workspace=main --json
```

遞迴預覽或將既有檔案登記到選用資產目錄。命令受 `--limit` 限制、可重複執行、不改寫檔案內容，並輸出路徑到 ID 的對應，供 Host 另行移轉內容記錄。

## 快取清理

```bash
bin/console sofinder:cache:cleanup --older-than=86400 --dry-run --json
bin/console sofinder:cache:cleanup --older-than=86400
```

只比對產生的縮圖 PNG 與文件預覽 PDF，不處理指標、掃描歷史、維護狀態、上傳 Session 或來源檔案。

在任何命令後加上 `--help` 可查看目前的參數與選項：

```bash
bin/console sofinder:security:audit --help
```
