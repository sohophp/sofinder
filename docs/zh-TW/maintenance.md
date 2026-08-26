---
title: 維護模式
description: 設定 SoFinder 有界 Inline、Symfony Messenger、External 或 Disabled 維護模式。
---

# 維護模式

SoFinder 預設使用有界的 `inline` 維護，因此不需要 Cron、systemd 或長時間執行的 PHP Process。刪除 Entry 時，回收站 Item 與 Byte Limit 永遠會同步執行。Opportunity Cleanup 另有節流，並由各 Task 的 Non-blocking Lock 保護。

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

- `inline` 會在相關請求後處理不超過設定數量的過期項目，且不會執行一般 Full Usage Scan。
- `messenger` 會分派 Allowlist 中的 `MaintenanceMessage`；選用前請安裝 Symfony Messenger、將 Message Route 到 Durable Transport，並啟動 Consumer。
- `external` 不執行由 Request 觸發的工作；請由 Operator 管理的 Scheduler 呼叫 Console Command。
- `disabled` 停用 Opportunity Cleanup。Manual Command 仍可使用，回收站容量限制也仍然生效。

```bash
bin/console sofinder:uploads:cleanup
bin/console sofinder:trash:cleanup
bin/console sofinder:usage:recalculate
bin/console sofinder:usage:recalculate --dry-run --json
bin/console sofinder:maintenance:status --json
bin/console sofinder:metadata:repair --dry-run --json
bin/console sofinder:cache:cleanup --dry-run --json
```

Command 與 Message Handler 共用相同的 Non-blocking Lock。啟動第二個相同 Task 時會安全回報 Skip，不會重複執行。除非 Quota Decision 需要復原 Dirty Persisted Usage State，Web Request 刻意不執行 Full Usage Recalculation。

任務狀態記錄 queued/running/succeeded/failed、嘗試次數、時間與處理數量；失敗時
`maintenance:status` 回傳非零退出碼。Usage dry-run 只掃描 Storage，不修改持久計數。
