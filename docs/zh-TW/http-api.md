---
title: HTTP API 穩定性
description: SoFinder 公開的穩定 Browser、API 與內容 Delivery 路由。
---

# HTTP API 穩定性

逐一 Endpoint 的請求欄位、Schema、範例和錯誤處理請參考 [HTTP API 參考](/zh-TW/api-reference)。本頁說明客戶端可以依賴的相容規則。

`GET /api/config` 會回傳 `apiVersion: "1.0"`。Browser Endpoint 位於匯入的 SoFinder 路由 Prefix 下，每個 JSON Response 都使用以下其中一種格式：

每個 Response 同時回傳 `X-SoFinder-API-Version: 1.0`。內建 UI 接受 `1.x` 範圍；Major 不一致時會在寫入操作前以 `incompatible_api_version` 停止。舊欄位會回傳 `Deprecation`、`Sunset`、`Link` 與 `X-SoFinder-Deprecated-Fields` Header。契約來源包括 [OpenAPI 3.1](/openapi.json)、[JSON Schema](/schema/picker-entry.schema.json) 與完整的[機器錯誤目錄](/error-codes.json)。

```json
{"success":true,"data":{}}
{"success":false,"error":{"code":"stable_machine_code","message":"Human-readable message"}}
```

對支援的本機 Adapter，目錄 Endpoint 保留 `offset`、`limit` 及精確的 `total`。只支援 Cursor 的 Adapter 回傳 `total: null` 及不透明的 `nextCursor`；Client 必須將該值以 `cursor` 原樣傳回，不得由 Offset 推導。既有 beta.2 Query Parameter 及 Response Field 不會重新命名。

異動請求需要 `X-CSRF-TOKEN` Header 及已驗證的 Actor。未知操作會被拒絕。Entry 與 Directory 的 Capability Field 只供 UI 提示；伺服器會對每個操作重新授權。

分塊上傳為目前 Actor 提供 `GET /api/uploads/chunks/{id}`。它會回傳已接收的 Chunk Index 及不可變 Session Metadata。續傳必須沿用原本的 Resource、Path、Name、Overwrite Mode 及 Chunk Count。Session 會在 24 小時後過期，可使用 `sofinder:uploads:cleanup` 清理。
