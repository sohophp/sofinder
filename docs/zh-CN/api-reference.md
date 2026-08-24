---
title: HTTP API 参考
description: 自定义客户端使用的 SoFinder HTTP Endpoint、请求、响应、上传、图片和错误参考。
---

# HTTP API 参考

以下路径都相对于 SoFinder 路由导入前缀，例如 `/sofinder`。API 面向同源、已登录的应用客户端，不是匿名对象存储 API。

## 协议约定

- JSON Endpoint 发送 `Accept: application/json`。
- 所有请求携带 Symfony Session Cookie。
- 所有写操作需要 `X-CSRF-TOKEN: <token>`；JSON 写操作还要使用 `Content-Type: application/json`。
- Path 是资源根目录下、以 `/` 分隔的逻辑路径，不能发送绝对路径、`..` 或存储 URL。
- 时间戳是 Unix 秒，容量是整数 Byte。
- 客户端必须忽略未知 Response Field 和 Capability Flag。

成功：

```json
{"success":true,"data":{"entry":{"path":"manuals/start.pdf"}}}
```

失败：

```json
{"success":false,"error":{"code":"conflict","message":"The destination already exists."}}
```

HTTP Status 是最终依据；`429` 包含 `Retry-After: 2`。批量请求可能返回 HTTP 200，但其中部分 Result 失败。

## 公共对象

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

`url` 可以为 null；非空值可能是公开地址、认证 proxy 或宿主 Route。Capability 只是提示，服务器会重新鉴权。

### Resource

`GET /api/config` 返回 `name`、`publicUrl`、扩展名／MIME、`maxSize`、`readOnly`、`quotaBytes`、`usedBytes`、名称／深度／图片／批量／压缩限制、`deliveryMode`、`animatedImagePolicy`，以及：

```json
{"storageCapabilities":{
  "search":true,"sort":true,"cursorPagination":false,
  "atomicMove":true,"nativeCopy":true,"recoverableDelete":true,"publicUrl":true
}}
```

## 发现与列表

### `GET /api/config`

返回 `apiVersion`、当前用户可见的 `resources`、Plugin Descriptor、图片预设、有效图片 Capability 和 UI Default。当前 API Version 为 `1.0`。

### `GET /api/entries`

| 参数 | 默认 | 含义 |
| --- | --- | --- |
| `resource` | `Files` | 配置的资源名。 |
| `path` | 空 | 要列出的文件夹。 |
| `search` | 空 | 名称关键词；`searchMode=tags` 时为逗号分隔标签。 |
| `searchMode` | `name` | `name` 或 `tags`。 |
| `sort` | `name` | `name`、`size`、`modified`。 |
| `direction` | `asc` | `asc` 或 `desc`。 |
| `offset` | `0` | 支持 Offset 的 Adapter 使用。 |
| `limit` | `100` | 请求页大小，服务器会限制。 |
| `cursor` | 无 | 上一页返回的不透明 Cursor。 |

Response Data 包含 `entries`、`total`、`path`、`offset`、`limit`、`sort`、`direction`、`nextCursor`、目录 `capabilities` 和 `storageCapabilities`。Cursor Adapter 可返回 `total: null`；禁止自行构造或修改 Cursor。

## 文件夹与文件写操作

### `POST /api/folders`

```json
{"resource":"Files","path":"manuals","name":"2026"}
```

返回 `{entry}`，HTTP 201。

### `PATCH /api/entries/rename`

```json
{"resource":"Files","path":"manuals/draft.pdf","name":"guide.pdf","overwrite":false}
```

`name` 是名称，不是目标路径；`overwrite` 需要独立权限。

### `POST /api/entries/copy`、`POST /api/entries/move`

```json
{"resource":"Files","path":"manuals/guide.pdf","destination":"archive/2026","overwrite":false,"autoRename":true}
```

`destination` 是文件夹。`autoRename=true` 且不覆盖时，SoFinder 自动生成安全名称。

### `DELETE /api/entries`

```json
{"resource":"Files","path":"manuals/old.pdf"}
```

返回 `trash`；永久删除 Adapter 为 null，可恢复资源则包含回收站项目和自动清理数量。

### `POST /api/entries/batch`

```json
{"operation":"copy","resource":"Files","paths":["a.pdf","folder"],"destination":"archive","overwrite":false,"autoRename":true}
```

`operation` 为 `copy`、`move`、`delete`。Path 会去重，不能同时包含文件夹和其子项。返回 `operation`、`total`、`succeeded`、`failed`、`purgedItems`、`purgedBytes` 和逐项 `results`；每项包含 `path`、`success`，以及 `entry` 或 `error.code/message`。

## 上传

### `POST /api/uploads`

使用 `multipart/form-data`，字段为 `resource`、`path`、`upload`，可选 `overwrite=1`。返回 `{entry}` 和 HTTP 201。服务器检查真实字节，不信任客户端大小或 MIME Metadata。

### 分块上传

`POST /api/uploads/chunks` 使用 Multipart：

- `resource`、`path`、`name`，可选 `overwrite=1`；
- 16–80 字符 URL-safe `uploadId`；
- 从 0 开始的 `index`、固定 `total`、文件字段 `chunk`。

未完成返回 `{"complete":false}`；最后一块返回 `{"complete":true,"entry":{...}}` 和 HTTP 201。Session Metadata 不可变化，重试必须沿用 Resource、Path、Name、Overwrite、Total。

- `GET /api/uploads/chunks/{id}` 返回当前 Actor 的 Session、已接收 Index 和 Metadata。
- `DELETE /api/uploads/chunks/{id}` 取消并丢弃 Session，需要 CSRF。

Session 24 小时后过期。客户端可以补传缺失 Index，但不能超过文件大小和最大 Chunk 数限制。

## 内容传递

- `GET /api/download?resource=Files&path=manual.pdf`：鉴权后以 Attachment 下载，文件夹返回 `invalid_type`。
- `GET /api/content?resource=Images&path=photo.jpg&disposition=inline`：返回私有内容，支持 ETag、Last-Modified、条件请求和单段 Byte Range。只有安全 Raster MIME 能 Inline，其余强制 Attachment。无效 Range 返回 416。

## 回收站

- `GET /api/trash?resource=Files&offset=0&limit=50&search=term` 返回 `items`、分页以及 `usedItems`、`usedBytes`、`maxItems`、`maxBytes`。
- `POST /api/trash/{id}/restore` Body：`{"resource":"Files","conflict":"cancel"}`；策略为 `cancel`、`rename`、`overwrite`。
- `DELETE /api/trash/{id}` Body：`{"resource":"Files"}`，永久删除。

Trash ID 是按 Actor 隔离的 32 位十六进制字符串。覆盖恢复需要 `overwrite` 权限；父文件夹不存在返回 `restore_parent_missing`。

## 图片

- `GET /api/images/thumbnail?resource=Images&path=photo.jpg&width=240&height=180` 返回私有缓存缩略图和 ETag。
- `GET /api/images/info?resource=Images&path=photo.jpg` 返回解码后的 `width`、`height`。
- `PATCH /api/images/edit` 执行 1–10 个有序 Action。

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

Action 为 `crop`、`resize`、`rotate`、`preset`。Rotation 为 0／90／180／270；Preset 使用 `name`。`save.mode` 为 `copy` 或 `overwrite`。Response 包含 `entry`、`original`／`result` 的尺寸和字节。旧的单次 Transform／Crop Body 仍兼容，新客户端应使用 Actions。

## ZIP 与 Metadata

`POST /api/archive`：

```json
{"resource":"Files","paths":["manual.pdf","screenshots"]}
```

返回名为 `sofinder-download.zip` 的 `application/zip`，受资源选择数量、递归项目数和容量限制。

`GET /api/metadata?resource=Files` 返回 `favorites`、按 Path 组织的 `tags`，以及最多 50 条 `recent {path,touchedAt}`。使用 `PATCH /api/metadata` 更新：

```json
{"resource":"Files","path":"manual.pdf","action":"favorite","favorite":true}
{"resource":"Files","path":"manual.pdf","action":"tags","tags":["docs","approved"]}
{"resource":"Files","path":"manual.pdf","action":"touch"}
```

每个项目最多 10 个不重复标签，每个 1–30 个可见字符。

## CKEditor 兼容上传

`POST /compat/ckeditor4/upload` 使用 Multipart `upload` 字段；Query 包括 `type`、`selection`、`currentFolder`、`_token`、`CKEditorFuncNum`，可选 `responseType=json`。回调和 JSON 格式参见 [CKEditor 指南](/zh-CN/ckeditor4)。

## 常见状态和错误

| Status | 代表 Code | 客户端处理 |
| --- | --- | --- |
| 400 | `invalid_json`、`invalid_path`、`invalid_type` | 修正语法或参数。 |
| 401/403 | `access_denied`、`read_only` | 登录或申请资源／操作权限。 |
| 404 | `not_found`、`upload_session_not_found`、`trash_disabled` | 刷新状态，不要原样重试。 |
| 409 | `conflict`、`upload_session_mismatch`、`restore_parent_missing` | 询问改名／覆盖或重建父目录。 |
| 413 | `file_too_large`、`quota_exceeded`、`batch_limit_exceeded`、`archive_limit_exceeded` | 缩小操作或修改策略。 |
| 415 | `invalid_extension`、`invalid_mime_type`、`unsafe_file_content`、`unsupported_image` | 选择允许且有效的格式。 |
| 416 | `invalid_range` | 修正或移除 Range。 |
| 422 | `invalid_tags`、`invalid_crop`、`storage_search_unsupported` | 修正语义输入或按 Capability 降级。 |
| 429 | `rate_limit_exceeded`、`concurrency_limit_exceeded` | 等待 `Retry-After` 并使用退避。 |
| 500/503/507 | 存储、配额、回收站、图片或 Session 可用性错误 | 保留 Machine Code，停止自动写重试并通知运维。 |

不得向用户显示内部 Stack Trace，也不要记录 Session Cookie、CSRF Token、签名 URL、凭据或私有文件内容。
