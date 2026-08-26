---
title: 生产与多节点运行
description: 配置共享状态、病毒扫描、健康检查、指标和请求关联。
---

# 生产与多节点运行

默认文件型状态适用于单个 PHP 节点。多节点部署必须共享对象存储和运行状态；各节点
使用独立 metadata、配额或限流文件会产生不一致。

## 数据库或 Redis 状态

`PdoAtomicStateStore` 支持用于本地测试的 SQLite，以及共享部署的 MySQL/PostgreSQL；
`RedisAtomicStateStore` 使用 ext-redis 和有时限的独占锁。两者都实现
`AtomicStateStoreInterface`，可组合为：

- `SharedMetadataStore`：收藏、标签和最近文件；
- `SharedRequestGateStore`：跨节点请求与并发限制；
- `SharedUsageTracker`：原子配额统计。

```php
$state = new PdoAtomicStateStore($pdo);
$metadata = new SharedMetadataStore($state);
$gates = new SharedRequestGateStore($state);
$usage = new SharedUsageTracker($state);

// Redis
$state = new RedisAtomicStateStore($redis, 'myapp:sofinder:');
```

PDO Store 会创建可移植的 `sofinder_state` 表，也可以在部署阶段显式执行 `install()`。
连接凭证、TLS 和重试策略由 Host 管理，并在 Symfony Container 中覆盖相应 Contract
Alias。分块文件仍须使用共享私有文件系统或自定义 `ChunkUploadStoreInterface`；共享状态
不能代替对象存储的版本恢复能力。

## ClamAV

将 `ClamAvScanner` 注册为 Symfony Service，Autoconfiguration 会同时添加上传扫描和
健康检查 Tag。它通过 clamd `INSTREAM` 协议传送隔离文件，不执行 Shell，并采用
fail-closed 策略。

```yaml
services:
  SohoPHP\SoFinder\Security\ClamAvScanner:
    arguments:
      $endpoint: 'unix:///run/clamav/clamd.ctl'
      $timeoutSeconds: 8
```

病毒文件返回 `malware_detected`；扫描器不可用或响应不确定时返回
`malware_scanner_unavailable`，隔离文件随后删除。

## 健康检查与指标

- `GET /health` 检查私有运行目录、构建资源、全部 Storage 和插件检查；`down` 返回
  HTTP 503，`degraded` 仍返回 200。
- `GET /metrics` 输出有界的 Prometheus Counter 和 `sofinder_ready`。
- 所有 SoFinder Response 带 `X-Request-ID`；安全的传入值会保留，否则自动生成，
  Audit 与失败日志会记录同一 ID。

健康和指标路由应置于内部防火墙或监控专用 Role 后。项目内 Symfony 示例可用
`demo` / `demo` 测试 `/integrations`、`/sofinder/health` 和 `/sofinder/metrics`。
