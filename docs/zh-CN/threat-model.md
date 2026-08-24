---
title: 威胁模型
description: SoFinder 的受保护资产、信任边界、攻击者能力及缓解措施。
---

# 威胁模型

## 受保护资产

SoFinder 保护已配置的 Storage Root、Private Resource、已验证用户能力、Upload Quarantine、Chunk Session、Metadata、Quota State 及回收站 Payload。Public Resource URL 刻意不经 SoFinder 授权即可读取。

## 信任边界

- Browser Input、名称、Path、MIME Declaration 及报告的 Size 均不可信。
- 宿主应用程序提供 Authentication、Role、Actor Identity 及 CSRF Infrastructure。
- 已配置的 Local Root 与 Private State Directory 只有在 `sofinder:security:audit` 成功后才可信。
- 自订 Adapter、Inspector、Metadata Store 及 Event Listener 以宿主应用程序权限执行，必须当作 Trusted Code 审查。

## 必要控制

- 规范化每个 Path，并拒绝 Traversal、Hidden Segment、Control Character 及 Symbolic-link Escape。
- 隔离上传、计算实际 Byte、检查内容，并在 Atomic Publication 前完整 Decode 图片资源。
- 每个操作都重新检查授权；UI Capability Value 永远不授予权限。
- 以 Staged Target 或 Backup 保护 Replacement，确保失败时保留原始文件。
- 以不透明 Actor Identifier 隔离 Chunk 与回收站状态，并强制执行 CSRF、Rate Limit、Concurrency Limit 及有界递归工作。
- 强制不安全内容下载；Authenticated Proxy Response 使用 `nosniff`、Private Cache Control 及严格 CSP。

## 剩余风险

Public Delivery 按设计绕过 Read ACL。默认 Inspector 不是防毒或 Content-disarm Engine。本机 Lock File 无法协调多台主机。GD Processing 与 ZIP Creation 虽有界线，仍会消耗 CPU 及 Disk；接受恶意公开 Traffic 的部署应隔离 Worker 并套用外部 Request Limit。Remote Adapter 不在 1.0 Support Promise 内。
