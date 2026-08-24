---
title: HTTP API 參考
description: 自定義客戶端使用的 SoFinder HTTP Endpoint、請求、回應、上傳、圖片和錯誤參考。
---

# HTTP API 參考

以下路徑都相對於 SoFinder 路由匯入前綴，例如 `/sofinder`。API 面向同源、已登入的應用客戶端，不是匿名物件儲存 API。

## 協議約定

- JSON Endpoint 傳送 `Accept: application/json`。
- 所有請求攜帶 Symfony Session Cookie。
- 所有寫操作需要 `X-CSRF-TOKEN: <token>`；JSON 寫操作還要使用 `Content-Type: application/json`。
- Path 是資源根目錄下、以 `/` 分隔的邏輯路徑，不能傳送絕對路徑、`..` 或儲存 URL。
- 時間戳是 Unix 秒，容量是整數 Byte。
- 客戶端必須忽略未知 Response Field 和 Capability Flag。

成功：

```json
{"success":true,"data":{"entry":{"path":"manuals/start.pdf"}}}
```

失敗：

```json
{"success":false,"error":{"code":"conflict","message":"The destination already exists."}}
```

HTTP Status 是最終依據；`429` 包含 `Retry-After: 2`。批次請求可能返回 HTTP 200，但其中部分 Result 失敗。

## 公共物件

### Entry

```json
{
  "path": "images/photo.jpg",
  "name": "photo.jpg",
  "directory": false,
  "size": 184231,
  "modifiedAt": 1787529600,
  "mimeType": "image/jpeg",
  "url": "https://cdn.example.com/images/photo.jpg",
  "capabilities": {"read": true, "rename": true, "delete": false}
}
```

`url` 可以為 null；非空值可能是公開地址、認證 proxy 或宿主 Route。Capability 只是提示，伺服器會重新授權。

### Resource

`GET /api/config` 返回 `name`、`publicUrl`、副檔名／MIME、`maxSize`、`readOnly`、`quotaBytes`、`usedBytes`、名稱／深度／圖片／批次／壓縮限制、`deliveryMode`、`animatedImagePolicy`，以及：

```json
{"storageCapabilities":{
  "search":true,"sort":true,"cursorPagination":false,
  "atomicMove":true,"nativeCopy":true,"recoverableDelete":true,"publicUrl":true
}}
```

## 發現與列表

### `GET /api/config`

返回 `apiVersion`、目前使用者可見的 `resources`、Plugin Descriptor、圖片預設、有效圖片 Capability 和 UI Default。目前 API Version 為 `1.0`。

### `GET /api/entries`

| 引數 | 預設 | 含義 |
| --- | --- | --- |
| `resource` | `Files` | 設定的資源名。 |
| `path` | 空 | 要列出的資料夾。 |
| `search` | 空 | 名稱關鍵詞；`searchMode=tags` 時為逗號分隔標籤。 |
| `searchMode` | `name` | `name` 或 `tags`。 |
| `sort` | `name` | `name`、`size`、`modified`。 |
| `direction` | `asc` | `asc` 或 `desc`。 |
| `offset` | `0` | 支援 Offset 的 Adapter 使用。 |
| `limit` | `100` | 請求頁大小，伺服器會限制。 |
| `cursor` | 無 | 上一頁返回的不透明 Cursor。 |

Response Data 包含 `entries`、`total`、`path`、`offset`、`limit`、`sort`、`direction`、`nextCursor`、目錄 `capabilities` 和 `storageCapabilities`。Cursor Adapter 可返回 `total: null`；禁止自行構造或修改 Cursor。

## 資料夾與檔案寫操作

### `POST /api/folders`

```json
{"resource":"Files","path":"manuals","name":"2026"}
```

返回 `{entry}`，HTTP 201。

### `PATCH /api/entries/rename`

```json
{"resource":"Files","path":"manuals/draft.pdf","name":"guide.pdf","overwrite":false}
```

`name` 是名稱，不是目標路徑；`overwrite` 需要獨立權限。

### `POST /api/entries/copy`、`POST /api/entries/move`

```json
{"resource":"Files","path":"manuals/guide.pdf","destination":"archive/2026","overwrite":false,"autoRename":true}
```

`destination` 是資料夾。`autoRename=true` 且不覆蓋時，SoFinder 自動產生安全名稱。

### `DELETE /api/entries`

```json
{"resource":"Files","path":"manuals/old.pdf"}
```

返回 `trash`；永久刪除 Adapter 為 null，可恢復資源則包含回收站項目和自動清理數量。

### `POST /api/entries/batch`

```json
{"operation":"copy","resource":"Files","paths":["a.pdf","folder"],"destination":"archive","overwrite":false,"autoRename":true}
```

`operation` 為 `copy`、`move`、`delete`。Path 會去重，不能同時包含資料夾和其子項。返回 `operation`、`total`、`succeeded`、`failed`、`purgedItems`、`purgedBytes` 和逐項 `results`；每項包含 `path`、`success`，以及 `entry` 或 `error.code/message`。

## 上傳

### `POST /api/uploads`

使用 `multipart/form-data`，欄位為 `resource`、`path`、`upload`，可選 `overwrite=1`。返回 `{entry}` 和 HTTP 201。伺服器檢查真實位元組，不信任客戶端大小或 MIME Metadata。

### 分塊上傳

`POST /api/uploads/chunks` 使用 Multipart：

- `resource`、`path`、`name`，可選 `overwrite=1`；
- 16–80 字元 URL-safe `uploadId`；
- 從 0 開始的 `index`、固定 `total`、檔案欄位 `chunk`。

未完成返回 `{"complete":false}`；最後一塊返回 `{"complete":true,"entry":{...}}` 和 HTTP 201。Session Metadata 不可變化，重試必須沿用 Resource、Path、Name、Overwrite、Total。

- `GET /api/uploads/chunks/{id}` 返回目前 Actor 的 Session、已接收 Index 和 Metadata。
- `DELETE /api/uploads/chunks/{id}` 取消並丟棄 Session，需要 CSRF。

Session 24 小時後過期。客戶端可以補傳缺失 Index，但不能超過檔案大小和最大 Chunk 數限制。

## 內容傳遞

- `GET /api/download?resource=Files&path=manual.pdf`：授權後以 Attachment 下載，資料夾返回 `invalid_type`。
- `GET /api/content?resource=Images&path=photo.jpg&disposition=inline`：返回私有內容，支援 ETag、Last-Modified、條件請求和單段 Byte Range。只有安全 Raster MIME 能 Inline，其餘強制 Attachment。無效 Range 返回 416。

## 回收站

- `GET /api/trash?resource=Files&offset=0&limit=50&search=term` 返回 `items`、分頁以及 `usedItems`、`usedBytes`、`maxItems`、`maxBytes`。
- `POST /api/trash/{id}/restore` Body：`{"resource":"Files","conflict":"cancel"}`；策略為 `cancel`、`rename`、`overwrite`。
- `DELETE /api/trash/{id}` Body：`{"resource":"Files"}`，永久刪除。

Trash ID 是按 Actor 隔離的 32 位十六進位制字串。覆蓋恢復需要 `overwrite` 權限；父資料夾不存在返回 `restore_parent_missing`。

## 圖片

- `GET /api/images/thumbnail?resource=Images&path=photo.jpg&width=240&height=180` 返回私有快取縮圖和 ETag。
- `GET /api/images/info?resource=Images&path=photo.jpg` 返回解碼後的 `width`、`height`。
- `PATCH /api/images/edit` 執行 1–10 個有序 Action。

```json
{
  "resource":"Images",
  "path":"photo.jpg",
  "actions":[
    {"type":"crop","x":10,"y":20,"width":800,"height":600},
    {"type":"resize","width":400,"height":300,"quality":88},
    {"type":"rotate","degrees":90}
  ],
  "save":{"mode":"copy","name":"photo-card.jpg"}
}
```

Action 為 `crop`、`resize`、`rotate`、`preset`。Rotation 為 0／90／180／270；Preset 使用 `name`。`save.mode` 為 `copy` 或 `overwrite`。Response 包含 `entry`、`original`／`result` 的尺寸和位元組。舊的單次 Transform／Crop Body 仍相容，新客戶端應使用 Actions。

## ZIP 與 Metadata

`POST /api/archive`：

```json
{"resource":"Files","paths":["manual.pdf","screenshots"]}
```

返回名為 `sofinder-download.zip` 的 `application/zip`，受資源選擇數量、遞迴項目數和容量限制。

`GET /api/metadata?resource=Files` 返回 `favorites`、按 Path 組織的 `tags`，以及最多 50 條 `recent {path,touchedAt}`。使用 `PATCH /api/metadata` 更新：

```json
{"resource":"Files","path":"manual.pdf","action":"favorite","favorite":true}
{"resource":"Files","path":"manual.pdf","action":"tags","tags":["docs","approved"]}
{"resource":"Files","path":"manual.pdf","action":"touch"}
```

每個項目最多 10 個不重複標籤，每個 1–30 個可見字元。

## CKEditor 相容上傳

`POST /compat/ckeditor4/upload` 使用 Multipart `upload` 欄位；Query 包括 `type`、`selection`、`currentFolder`、`_token`、`CKEditorFuncNum`，可選 `responseType=json`。回呼和 JSON 格式參見 [CKEditor 指南](/zh-TW/ckeditor4)。

## 常見狀態和錯誤

| Status | 代表 Code | 客戶端處理 |
| --- | --- | --- |
| 400 | `invalid_json`、`invalid_path`、`invalid_type` | 修正語法或引數。 |
| 401/403 | `access_denied`、`read_only` | 登入或申請資源／操作權限。 |
| 404 | `not_found`、`upload_session_not_found`、`trash_disabled` | 重新整理狀態，不要原樣重試。 |
| 409 | `conflict`、`upload_session_mismatch`、`restore_parent_missing` | 詢問改名／覆蓋或重建父目錄。 |
| 413 | `file_too_large`、`quota_exceeded`、`batch_limit_exceeded`、`archive_limit_exceeded` | 縮小操作或修改策略。 |
| 415 | `invalid_extension`、`invalid_mime_type`、`unsafe_file_content`、`unsupported_image` | 選擇允許且有效的格式。 |
| 416 | `invalid_range` | 修正或移除 Range。 |
| 422 | `invalid_tags`、`invalid_crop`、`storage_search_unsupported` | 修正語義輸入或按 Capability 降級。 |
| 429 | `rate_limit_exceeded`、`concurrency_limit_exceeded` | 等待 `Retry-After` 並使用退避。 |
| 500/503/507 | 儲存、配額、回收站、圖片或 Session 可用性錯誤 | 保留 Machine Code，停止自動寫重試並通知運維。 |

不得向使用者顯示內部 Stack Trace，也不要記錄 Session Cookie、CSRF Token、簽名 URL、憑據或私有檔案內容。
