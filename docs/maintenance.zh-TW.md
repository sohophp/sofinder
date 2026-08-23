# 維護模式

英文原文：[maintenance.md](maintenance.md)

SoFinder 預設使用有上限的 `inline` 維護，因此不依賴 cron、systemd 或常駐 PHP 程序。項目刪除時一定會同步執行回收站數量與 byte 上限保護；機會式清理則另外受到限頻與每項任務非阻塞鎖保護。

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

- `inline`：相關請求後最多處理設定數量的過期項目，普通請求不會執行完整容量掃描。
- `messenger`：投遞白名單內的 `MaintenanceMessage`。選擇此模式前必須安裝 Symfony Messenger、將訊息路由到持久 transport，並啟動 consumer。
- `external`：不由 HTTP 請求觸發工作；由管理者維護的排程呼叫 Console 指令。
- `disabled`：停止機會式清理；手動命令仍可使用，回收站容量保護也仍然有效。

```bash
bin/console sofinder:uploads:cleanup
bin/console sofinder:trash:cleanup
bin/console sofinder:usage:recalculate
```

Console 指令與訊息 Handler 共用相同非阻塞鎖。同一任務已有程序執行時，第二個程序會安全回報跳過，不會重複處理。完整容量重新計算不會放進一般 Web 請求；只有 quota 判斷需要修復持久化 dirty 狀態時才會重新校準。
