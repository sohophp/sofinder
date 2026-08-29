---
title: HTTP API 参考
description: 自定义客户端使用的 SoFinder HTTP Endpoint、请求、响应、上传、图片和错误参考。
---

# HTTP API 参考

PHP 测试会把机器可读的 [OpenAPI 3.1 文档](/openapi.json)与中央端点清单双向核对：
每个运行时 API 操作都必须被记录，每个已记录操作也必须真实存在。

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

### Asset Reference 1.0

上传及 Picker 响应可以增加 `asset`，格式见 [Schema](/schema/asset-reference.schema.json)，原 `entry` 保留。启用资产目录后，`GET /api/assets/resolve` 按资源／路径解析或懒注册；`GET /api/assets/{id}` 读取当前 Workspace 记录；`PATCH /api/assets/{id}/metadata` 修改 `alt`、`title`、共享 `tags`，并通过 `metadataVersion` 乐观并发控制。

### Resource

`GET /api/config` 返回 `name`、`publicUrl`、扩展名／MIME、`maxSize`、`readOnly`、`quotaBytes`、`usedBytes`、名称／深度／图片／批量／压缩限制、`deliveryMode`、`animatedImagePolicy`，以及：

```json
{"storageCapabilities":{
  "search":true,"sort":true,"cursorPagination":false,
  "atomicMove":true,"nativeCopy":true,"recoverableDelete":true,"publicUrl":true
}}
```

## 发现与列表

### `GET /api/assets/search`

在已授权资源及子目录中按文件名、资产标题、默认/多语言替代文本和共享标签搜索；可按资源、路径范围、类型、扩展名、大小及修改日期筛选。响应包含分页、聚合、扫描数量和 `truncated`，避免把受限扫描误认为完整索引。

### 资产使用与删除预检

- `GET /api/assets/{id}/usages` 列出授权范围内的宿主引用。
- `PUT /api/assets/{id}/usages/{referenceId}` 幂等登记 `{label,url,context}`。
- `DELETE /api/assets/{id}/usages/{referenceId}` 移除已登记的引用。
- `POST /api/assets/delete-check` 接收 `{resource,paths}`，返回 `safe`、引用总数和受影响资产。它只提示风险，不会绕过用户明确的删除决定。

### 私有资产访问会话

`POST /api/assets/access-sessions` 接收私有 Proxy 资产 ID 和可选 `ttl`，返回绑定文件版本的内联 URL 与过期时间；`DELETE /api/assets/access-sessions/{id}` 撤销整组会话。文件变化、过期、撤销或未列入会话的资产均无法读取。

### `GET /api/config`

返回 `apiVersion`、当前用户可见的 `resources`、Plugin Descriptor、图片预设、有效图片 Capability 和 UI Default。当前 API Version 为 `1.0`。

### `GET /api/capabilities`

返回带版本的机器可读名称：Entry Operation、Storage Capability、宿主可控可选功能、
Plugin Slot/Selection 和 Picker Kind。契约测试会以公开 JSON Schema 和经审核的 Key
Snapshot 检查实际 Discovery Response。

### `GET /api/security/status`

返回病毒扫描就绪状态、待扫描／通过／隔离／失败计数和有界最近记录；访问角色由 `malware_scanning.status_roles` 限制。

### `GET /api/entries`

| 参数 | 默认 | 含义 |
| --- | --- | --- |
| `resource` | `Files` | 配置的资源名。 |
| `path` | 空 | 要列出的文件夹。 |
| `search` | 空 | 名称关键词；`searchMode=tags` 时为逗号分隔标签。 |
| `searchMode` | `name` | `name` 或 `tags`。 |
| `sort` | `name` | `name`、`size`、`type`（MIME 类型）、`modified`。 |
| `direction` | `asc` | `asc` 或 `desc`。 |
| `offset` | `0` | 支持 Offset 的 Adapter 使用。 |
| `limit` | `100` | 请求页大小，服务器限制为 10–500。 |
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

### `POST /api/entries/batch-rename`

```json
{"resource":"Files","renames":[{"path":"draft-a.pdf","name":"report-1.pdf"},{"path":"draft-b.pdf","name":"report-2.pdf"}]}
```

源路径和目标名称必须唯一，扩展名不可修改；服务端会分别验证并授权每个项目，响应使用与其他批次操作相同的逐项结果格式。

## 上传

### `POST /api/uploads`

使用 `multipart/form-data`，字段为 `resource`、`path`、`upload`，可选 `overwrite=1` 或 `autoRename=1`。返回 `{entry}` 和 HTTP 201。`autoRename=1` 且不覆盖时，同名文件会以 `photo(1).jpg` 这类 CKFinder 风格的首个可用名称保存。服务器检查真实字节，不信任客户端大小或 MIME Metadata。

### 分块上传

`POST /api/uploads/chunks` 使用 Multipart：

- `resource`、`path`、`name`，可选 `overwrite=1` 或 `autoRename=1`；
- 16–80 字符 URL-safe `uploadId`；
- 从 0 开始的 `index`、固定 `total`、文件字段 `chunk`。

未完成返回 `{"complete":false}`；最后一块返回 `{"complete":true,"entry":{...}}` 和 HTTP 201。Session Metadata 不可变化，重试必须沿用 Resource、Path、Name、Overwrite、Auto-Rename、Total。

- `GET /api/uploads/chunks/{id}` 返回当前 Actor 的 Session、已接收 Index 和 Metadata。
- `DELETE /api/uploads/chunks/{id}` 取消并丢弃 Session，需要 CSRF。

Session 24 小时后过期。客户端可以补传缺失 Index，但不能超过文件大小和最大 Chunk 数限制。

## 内容传递

- `GET /api/download?resource=Files&path=manual.pdf`：鉴权后以 Attachment 下载，并支持 ETag、Last-Modified、条件请求及单段字节 Range；文件夹返回 `invalid_type`，非法或无法满足的 Range 返回 416。
- `GET /api/content?resource=Images&path=photo.jpg&disposition=inline`：返回私有内容，支持 ETag、Last-Modified、条件请求和单段 Byte Range。只有安全 Raster MIME 能 Inline，其余强制 Attachment。无效 Range 返回 416。
- `GET /api/signed-url?resource=Private&path=manual.pdf&ttl=300`：先重新授权当前用户，再返回 `{url,expiresAt}`。临时地址指向 `/signed/{token}`；只有宿主 Firewall 明确允许该路由匿名访问时才不需要 Session。Token 使用 HMAC、只适用于 `delivery_mode: proxy`，并绑定文件大小和修改时间；过期或文件已替换返回 410，篡改返回 403。
- `GET /api/preview/text?resource=Files&path=readme.txt`：返回已授权 UTF-8 文本、JSON、XML 或 YAML 文件的前 256 KiB，格式为 `{content,truncated,mimeType,size}`；内置 UI 始终按纯文本渲染。
- `GET /api/preview/document?resource=Files&path=manual.pdf`：直接返回已授权 PDF 或已缓存的 Office 转换结果；异步模式下未缓存的 Office 文件返回 HTTP 202、`document_preview_pending` 和 `Retry-After`。
- `POST /api/preview/document/jobs`：Body 为 `{"resource":"Files","path":"manual.docx","retry":false}`，按用户与文件版本创建或复用转换任务。
- `GET /api/preview/document/jobs/{id}`：返回 `queued`、`running`、`ready`、`failed` 或 `expired`；就绪时包含预览 URL，等待时包含 `retryAfter`。部署要求参见 [PDF 与 Office 预览](/zh-CN/document-preview)。
- `GET /api/checksum?resource=Files&path=manual.pdf`：为不超过 512 MiB 的已授权文件返回 `{algorithm:"sha256",checksum,size}`，不会暴露 Adapter 路径。

## 回收站

- `GET /api/trash?resource=Files&offset=0&limit=50&search=term` 返回 `items`、分页以及 `usedItems`、`usedBytes`、`maxItems`、`maxBytes`。
- `POST /api/trash/{id}/restore` Body：`{"resource":"Files","conflict":"cancel"}`；策略为 `cancel`、`rename`、`overwrite`。
- `DELETE /api/trash/{id}` Body：`{"resource":"Files"}`，永久删除。

Trash ID 是按 Actor 隔离的 32 位十六进制字符串。覆盖恢复需要 `overwrite` 权限；父文件夹不存在返回 `restore_parent_missing`。

## 图片

- `GET /api/images/thumbnail?resource=Images&path=photo.jpg&width=240&height=180` 返回私有缓存缩略图和 ETag。
- `GET /api/images/info?resource=Images&path=photo.jpg` 返回解码后的 `width`、`height`。
- `GET /api/images/variant?resource=Images&path=photo.jpg&width=640&format=webp&v=...` 在启用后返回继承鉴权且受白名单限制的响应式变体。
- `PATCH /api/images/edit` 执行 1–10 个有序 Action。
- `PATCH /api/images/batch` 对 1–100 个路径执行同一组 Action，并返回逐项成功／错误。

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

Action 为 `crop`、`resize`、`rotate`、`preset`、`optimize`、`watermarkText`、`watermarkImage`，完整边界见 [image-actions.schema.json](/schema/image-actions.schema.json)。格式转换必须另存；旧 Transform／Crop Body 在公布的 `Sunset` 前兼容并返回废弃 Header。

## ZIP 与 Metadata

`POST /api/archive`：

```json
{"resource":"Files","paths":["manual.pdf","screenshots"]}
```

返回名为 `sofinder-download.zip` 的 `application/zip`，受资源选择数量、递归项目数和容量限制。

`GET /api/metadata?resource=Files` 返回仅含文件的 `favorites`、最多 12 个仅含文件夹的 `quickAccess` 路径、兼容增加的 `quickAccessEntries` 展示信息（`name`、`directory`、`mimeType`、`exists`）、按 Path 组织的 `tags`，以及最多 50 条 `recent {path,touchedAt}`。失效的固定文件夹以 `exists: false` 保留显示，直到用户打开或移除。使用 `PATCH /api/metadata` 更新：

```json
{"resource":"Files","path":"manual.pdf","action":"favorite","favorite":true}
{"resource":"Files","path":"manuals","action":"quick_access","pinned":true}
{"resource":"Files","path":"manual.pdf","action":"tags","tags":["docs","approved"]}
{"resource":"Files","path":"manual.pdf","action":"touch"}
```

把文件夹加入收藏会返回 `422 favorite_folder_unsupported`；把文件固定到侧栏会返回 `422 quick_access_file_disabled`。旧的 `features.quick_access_files` 设置不再生效，已有文件快捷项仍可移除。

客户端确认最近路径已在 SoFinder 外部消失后，可发送 `action: "forget"`，从收藏、标签和
最近状态中清理该路径。宿主关闭某项功能后，其专用操作返回 `feature_disabled` 及 HTTP
404，Config Response 的 `featureAvailability` 也会标记为 `false`。

每个项目最多 10 个不重复标签，每个 1–30 个可见字符。

## CKEditor 兼容上传

`POST /compat/ckeditor4/upload` 使用 Multipart `upload` 字段；Query 包括 `type`、`selection`、`currentFolder`、`_token`、`CKEditorFuncNum`，可选 `responseType=json`。除非显式开启 `ckeditor4.overwrite_on_upload`，否则同名文件会自动改名。回调和 JSON 格式参见 [CKEditor 指南](/zh-CN/ckeditor4)。

## 常见状态和错误

完整 Code／Status／Category 目录是 [error-codes.json](/error-codes.json)，CI 会自动与服务器 Literal Exception 对照。

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
