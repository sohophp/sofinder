---
title: PDF 与 Office 预览
description: 配置鉴权 PDF 预览及可选的 LibreOffice 沙箱转换。
---

# PDF 与 Office 预览

SoFinder 会注册声明式 `document-preview` 插件。浏览器按照 MIME 或扩展名匹配同源预览
端点，并在同源 iframe 中显示返回的 PDF。浏览器页面 CSP 只允许同源 frame，PDF
响应自身仍带 sandbox CSP；插件不能注入 JavaScript 或远程 HTML。

```yaml
so_finder:
  document_preview:
    pdf: true
    office: false
    office_binary: '/usr/bin/libreoffice'
    timeout_seconds: 60
    max_bytes: 52428800
```

PDF 预览默认启用。系统会把已鉴权 PDF 复制到私有、带版本的缓存，再以 inline、
`nosniff`、private cache 和严格 CSP 返回，不会暴露实际存储路径。

Office 预览需要明确启用。SoFinder 使用参数数组调用绝对路径的 LibreOffice，不经过 Shell；
每次转换使用私有 Profile，并限制输入大小与执行时间。DOC/DOCX/ODT/RTF、XLS/XLSX/ODS
和 PPT/PPTX/ODP 会转换成缓存 PDF。正式环境应把 LibreOffice 放在禁止联网并限制 CPU、
内存和文件系统权限的专用容器或 OS 沙箱中。
较旧的 LibreOffice 第一次无界面转换可能超过 30 秒，生产环境建议从 60 秒开始设置。

启用 Office 但找不到转换器时，`GET /health` 会报告 `document-preview: down`。转换失败返回
稳定的 `office_preview_unavailable` 或 `document_preview_failed`，不会退回公共第三方 Viewer。
