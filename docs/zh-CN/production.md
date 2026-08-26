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
- `SharedMetricsStore`：集群统一 Prometheus Counter；
- 共享维护 Lease、任务状态及分块 Session 协调。

```php
$state = new PdoAtomicStateStore($pdo);
$metadata = new SharedMetadataStore($state);
$gates = new SharedRequestGateStore($state);
$usage = new SharedUsageTracker($state);

// Redis
$state = new RedisAtomicStateStore($redis, 'myapp:sofinder:');
```

PDO Store 会创建可移植的 `sofinder_state` 表，也可以在部署阶段显式执行 `install()`。
连接凭证、TLS 和重试策略由 Host 管理。把状态对象注册为 Symfony Service 后配置：

```yaml
so_finder:
  cluster:
    state_service: 'app.sofinder_shared_state'
    chunk_upload_store_service: 'app.sofinder_shared_chunks' # 可选
```

`state_service` 自动替换 metadata、请求限流、配额与指标 Store，同时启用共享维护和分块
Session 协调；`/health` 会执行原子读写探针。
两个 Service 分别实现 `AtomicStateStoreInterface` 与 `ChunkUploadStoreInterface`。
每个节点仍须把 `chunk_dir` 挂载为相同路径的共享私有文件系统，或自定义
`ChunkUploadStoreInterface`；共享状态
不能代替对象存储的版本恢复能力。

## ClamAV

在 SoFinder 配置中启用内置 ClamAV 整合。它通过 clamd `INSTREAM` 协议传送隔离文件，
不执行 Shell，并采用 fail-closed 策略。

```yaml
so_finder:
  malware_scanning:
    enabled: true
    endpoint: 'unix:///run/clamav/clamd.ctl'
    timeout_seconds: 8
    history_limit: 100
    status_roles: [ROLE_ADMIN]
```

病毒文件返回 `malware_detected`；扫描器不可用或响应不确定时返回
`malware_scanner_unavailable`，隔离文件随后删除。
“安全状态”和 `GET /api/security/status` 会显示配置状态、clamd 实时就绪结果、有界的
最近扫描记录及数量。Prometheus 也会按结果输出扫描次数、扫描 Byte 与累计耗时 Counter。

## 健康检查与指标

- `GET /health` 检查私有运行目录、构建资源、图片 Codec、维护模式、全部 Storage 和插件检查；`down` 返回
  HTTP 503，`degraded` 仍返回 200。
- `GET /metrics` 输出有界的 Prometheus Counter、存储耗时累计/观察数、上传失败、限流拒绝和 `sofinder_ready`。
- 所有 SoFinder Response 带 `X-Request-ID`；安全的传入值会保留，否则自动生成，
  Audit 与失败日志会记录同一 ID。

健康和指标路由应置于内部防火墙或监控专用 Role 后。项目内 Symfony 示例可用
`demo` / `demo` 测试 `/integrations`、`/sofinder/health` 和 `/sofinder/metrics`。
