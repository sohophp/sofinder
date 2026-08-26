---
title: Console 命令
description: SoFinder 提供的部署验证与调度维护命令。
---

# Console 命令

请通过宿主 Symfony 应用程序的 `bin/console` 执行命令。

## 安全审计

```bash
bin/console sofinder:security:audit
bin/console sofinder:security:audit --json
```

审计已配置的 Storage Root 与私有工作目录。部署时，以及路径、权限或存储配置变更后都应执行。
JSON 格式适合部署门禁与监控；两种格式发现 Critical 问题时都会返回非零退出码。

## 图片能力

```bash
bin/console sofinder:image:capabilities
bin/console sofinder:image:capabilities --json
```

显示有效 Codec，并依当前 GD 与 Imagick Runtime 验证资源格式配置。

## 回收站清理

```bash
bin/console sofinder:trash:cleanup
```

永久移除已过期的本机回收站项目。维护模式为 `external` 时应调度执行。

## 过期上传清理

```bash
bin/console sofinder:uploads:cleanup
```

移除过期的分块上传 Session。使用外部维护时，应与回收站清理一起调度。

## 使用量重新计算

```bash
bin/console sofinder:usage:recalculate
bin/console sofinder:usage:recalculate --dry-run --json
```

从存储空间重建持久化的资源使用量计数器。在 SoFinder 外部导入、恢复或变更文件后执行。
Dry-run 只报告扫描值，不修改持久计数。

## 维护状态

```bash
bin/console sofinder:maintenance:status
bin/console sofinder:maintenance:status --json
```

显示 queued、running、succeeded 与 failed 任务；存在失败记录时返回非零退出码。

## Metadata 修复

```bash
bin/console sofinder:metadata:repair --dry-run --json
bin/console sofinder:metadata:repair
```

规范化本地 JSON Metadata，并移除不存在的资源或项目引用。Dry-run 使用同一把锁但绝不写入；
共享 Metadata Service 应使用 Provider 自己的修复工具。

## 缓存清理

```bash
bin/console sofinder:cache:cleanup --older-than=86400 --dry-run --json
bin/console sofinder:cache:cleanup --older-than=86400
```

只匹配生成的缩略图 PNG 和文档预览 PDF，不处理指标、扫描历史、维护状态、上传 Session 或源文件。

在任何命令后加上 `--help` 可查看当前的参数与选项：

```bash
bin/console sofinder:security:audit --help
```
