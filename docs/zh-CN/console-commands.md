---
title: Console 命令
description: SoFinder 提供的部署验证与调度维护命令。
---

# Console 命令

请通过宿主 Symfony 应用程序的 `bin/console` 执行命令。

## 安全审计

```bash
bin/console sofinder:security:audit
```

审计已配置的 Storage Root 与私有工作目录。部署时，以及路径、权限或存储配置变更后都应执行。

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
```

从存储空间重建持久化的资源使用量计数器。在 SoFinder 外部导入、恢复或变更文件后执行。

在任何命令后加上 `--help` 可查看当前的参数与选项：

```bash
bin/console sofinder:security:audit --help
```
