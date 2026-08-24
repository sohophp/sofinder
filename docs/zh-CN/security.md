---
title: 正式环境安全
description: SoFinder 部署的验证、授权、存储、上传与运维安全要求。
---

# 正式环境安全

SoFinder 将每个配置的 Resource Root 视为 Sandbox。Path Traversal、Control Character、隐藏名称及 Symbolic Link 存取都会被拒绝。上传会先进入 Mode 0600 的私有 Quarantine；Byte 数量来自 Stream，而不是信任 Request Metadata；内容经检查后才以 Atomic 方式发布。图片扩展名必须符合检测到的 MIME，而且图片必须在配置的像素限制内完整 Decode。

请将 `quarantine_dir`、`chunk_dir`、`trash_dir`、Metadata，以及 Thumbnail／Archive Cache 放在公开 Resource Root 外。停用公开上传 Alias 的 Script Execution。Proxy Resource 不得通过另一个 Alias 暴露 Root，否则该 URL 会绕过 Read ACL。

删除会把文件移至依 Actor 隔离的私有回收站。Overwrite Conflict 的恢复会使用 Atomic Destination Backup。请调度：

```bash
bin/console sofinder:trash:cleanup
bin/console sofinder:uploads:cleanup
```

配置或部署变更后执行：

```bash
bin/console sofinder:security:audit
```

默认 Request Gate 会分别限制一般 API、Upload／Chunk Traffic、唯读 Thumbnail、图片编辑、ZIP 产生及 Transfer Batch。因单一目录页可能加载大量图片，Thumbnail 有较高的独立额度；成功 Response 会由 Browser 私有缓存。请依部署调整 `so_finder.limits`。内建 Gate 使用本机 Lock File；多主机部署在分散并行 Traffic 前应改用共用 Limiter。

默认 Inspector 可通过 `FileInspectorInterface` 替换。接受不受信任公开上传的部署，应以防毒或 Content-disarm Service 装饰它，并使用 Operation Event 处理应用程序 Audit 与 Quota Policy。
