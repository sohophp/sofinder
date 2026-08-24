---
title: CKEditor 4 使用与集成
description: 配置和使用 SoFinder 的 CKEditor 4 文件浏览、图片选择与快速上传功能。
---

# CKEditor 4 使用与集成

SoFinder 支持 CKEditor 4 的文件浏览回调协议和快速上传响应。浏览文件时会进入 picker 模式；快速上传则把本地文件直接发送到配置的 SoFinder 资源。

## 管理员配置

以下示例假定路由前缀为 `/sofinder`。请通过宿主模板的正常机制把 CSRF Token 注入编辑页面，不要硬编码到 JavaScript Bundle。

```javascript
CKEDITOR.replace("editor", {
  filebrowserBrowseUrl: "/sofinder/browser?type=Files&selection=file&uiMode=picker&uiTools=full",
  filebrowserImageBrowseUrl: "/sofinder/browser?type=Images&selection=image&uiMode=picker&uiTools=full",
  filebrowserUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Files&selection=file&_token="
    + encodeURIComponent(soFinderCsrfToken),
  filebrowserImageUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Images&selection=image&_token="
    + encodeURIComponent(soFinderCsrfToken)
});
```

CKEditor 会在浏览和传统上传请求中附加 `CKEditorFuncNum`。SoFinder 通过 `CKEDITOR.tools.callFunction` 返回选择结果。浏览器也接受 `select=1`；`type` 选择初始资源，`selection=image|file` 控制选择验证。

路由必须受到同源 Symfony Session 和 Firewall 保护。由于 CKEditor 4 无法设置 JSON API Header，快速上传必须通过 `_token` 传递 CSRF Token。Origin／Referer 只是额外检查，不能替代 CSRF。

## 浏览并插入已有文件

1. 在 CKEditor 中打开文件的“链接”窗口，或图片的“图像”窗口。
2. 点击**浏览服务器**。
3. 在 SoFinder 中切换资源和文件夹；搜索、排序、网格／列表、预览仍可使用。
4. 选择一个文件。图片模式只允许选择可嵌入 Web 且具有可用 URL 的图片。
5. 点击**选择**。SoFinder 调用 CKEditor Callback、填写 URL 并关闭选择窗口。
6. 返回 CKEditor 后，检查替代文本、尺寸、对齐等内容，再完成插入。

示例保留 picker 的选择与 Callback 行为，同时通过 `uiTools=full` 显示完整工具，让有权限的用户可在选择前上传、新建文件夹、重命名、复制、移动、删除和编辑图片。所有按钮仍受资源能力和服务器 ACL 限制。省略该参数或使用 `uiTools=common` 可恢复精简工具栏。

## 从 CKEditor 快速上传

1. 打开“链接”或“图像”窗口并切换到**上传**。
2. 选择本地文件并发送。
3. SoFinder 验证并保存到指定资源，然后返回入口 URL。
4. CKEditor 切换到 URL 信息，用户完成插入。

文件字段名必须是 `upload`。可在上传 URL 中增加 `currentFolder`，指定固定且规范化的目标文件夹。同名冲突不会静默覆盖。图片快速上传会拒绝 HEIC、HEIF、TIFF，以及当前服务器不能嵌入网页的格式。

需要 JSON 的集成可使用 `responseType=json` 或 `Accept: application/json`。成功响应：

```json
{"uploaded":1,"fileName":"photo.jpg","url":"https://cdn.example.com/images/photo.jpg"}
```

失败响应：

```json
{"uploaded":0,"error":{"code":"image_not_web_embeddable","message":"This image format cannot be embedded directly in a web page."}}
```

## 选择正确的 URL 传递方式

- 最终内容无需登录即可访问时，使用公开／CDN URL。
- 需要稳定 ID、下载记录或宿主鉴权时，使用宿主 `entry_url` Route。
- SoFinder proxy URL 需要认证，适合私有内网内容；如果文章公开或用于邮件 HTML，就不应返回仅编辑者可访问的地址。

不要为了让编辑器获取公开 URL，就通过 Web Server Alias 暴露私有存储根目录。

## 常见问题

| 现象 | 检查 |
| --- | --- |
| “浏览服务器”打不开 | Browser URL、弹窗策略、路由前缀和登录 Firewall。 |
| 选择后没有反应 | `CKEditorFuncNum`、同源 opener／parent，以及目标窗口是否存在 CKEditor 4。 |
| 上传返回 403 | `_token`、登录状态、Origin／Referer 和资源操作权限。 |
| 上传返回 415 | 扩展名／MIME Allowlist、图片解码支持和 `selection=image`。 |
| URL 只有编辑者能打开 | 返回了 proxy 或受保护的宿主 URL，应重新检查传递设计。 |
| 图片不能选择 | 格式不可嵌入、没有入口 URL，或服务器无法解码。 |

管理员还应阅读 [Symfony 集成](/zh-CN/symfony)、[生产安全](/zh-CN/security)和[图片格式](/zh-CN/image-formats)。
