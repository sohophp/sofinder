---
title: 维护模式
description: 配置 SoFinder 有界 Inline、Symfony Messenger、External 或 Disabled 维护模式。
---

# 维护模式

SoFinder 默认使用有界的 `inline` 维护，因此不需要 Cron、systemd 或长时间执行的 PHP Process。删除 Entry 时，回收站 Item 与 Byte Limit 永远会同步执行。Opportunity Cleanup 另有节流，并由各 Task 的 Non-blocking Lock 保护。

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

- `inline` 会在相关请求后处理不超过配置数量的过期项目，且不会执行一般 Full Usage Scan。
- `messenger` 会分派 Allowlist 中的 `MaintenanceMessage`；可选前请安装 Symfony Messenger、将 Message Route 到 Durable Transport，并启动 Consumer。
- `external` 不执行由 Request 触发的工作；请由 Operator 管理的 Scheduler 调用 Console Command。
- `disabled` 停用 Opportunity Cleanup。Manual Command 仍可使用，回收站容量限制也仍然生效。

```bash
bin/console sofinder:uploads:cleanup
bin/console sofinder:trash:cleanup
bin/console sofinder:usage:recalculate
```

Command 与 Message Handler 共用相同的 Non-blocking Lock。启动第二个相同 Task 时会安全报告 Skip，不会重复执行。除非 Quota Decision 需要恢复 Dirty Persisted Usage State，Web Request 刻意不执行 Full Usage Recalculation。
