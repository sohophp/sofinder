---
title: HTTP API 稳定性
description: SoFinder 公开的稳定 Browser、API 与内容 Delivery 路由。
---

# HTTP API 稳定性

逐个 Endpoint 的请求字段、Schema、示例和错误处理参见 [HTTP API 参考](/zh-CN/api-reference)。本页说明客户端可以依赖的兼容规则。

`GET /api/config` 会返回 `apiVersion: "1.0"`。Browser Endpoint 位于导入的 SoFinder 路由 Prefix 下，每个 JSON Response 都使用以下其中一种格式：

每个 Response 同时返回 `X-SoFinder-API-Version: 1.0`。内置 UI 接受 `1.x` 范围；Major 不一致时会在写操作前以 `incompatible_api_version` 停止。旧字段会返回 `Deprecation`、`Sunset`、`Link` 和 `X-SoFinder-Deprecated-Fields` Header。契约来源包括 [OpenAPI 3.1](/openapi.json)、[JSON Schema](/schema/picker-entry.schema.json) 和完整的[机器错误目录](/error-codes.json)。

```json
{"success":true,"data":{}}
{"success":false,"error":{"code":"stable_machine_code","message":"Human-readable message"}}
```

对支持的本机 Adapter，目录 Endpoint 保留 `offset`、`limit` 及精确的 `total`。只支持 Cursor 的 Adapter 返回 `total: null` 及不透明的 `nextCursor`；Client 必须将该值以 `cursor` 原样传回，不得由 Offset 推导。既有 beta.2 Query Parameter 及 Response Field 不会重新命名。

变更请求需要 `X-CSRF-TOKEN` Header 及已验证的 Actor。未知操作会被拒绝。Entry 与 Directory 的 Capability Field 只供 UI 提示；服务器会对每个操作重新授权。

分块上传为当前 Actor 提供 `GET /api/uploads/chunks/{id}`。它会返回已接收的 Chunk Index 及不可变 Session Metadata。续传必须沿用原本的 Resource、Path、Name、Overwrite Mode 及 Chunk Count。Session 会在 24 小时后过期，可使用 `sofinder:uploads:cleanup` 清理。
