---
title: 升级指南
description: 各 SoFinder 预发布版本的兼容性、配置与 adapter 升级说明。
---

# 升级 SoFinder

## 从 0.1.0-beta.14 升级至 0.1.0-beta.15

请同时部署重新构建的 `sofinder.js`、`sofinder-picker.js` 与 `sofinder.css`。既有路由及文件数据无需迁移。多节点宿主可通过覆盖 metadata、usage 与 request-gate alias 选用新的 PDO 或 Redis 状态 Store；单节点仍默认使用文件 Store。请通过监控角色或网络策略保护 `/health` 与 `/metrics`，并以 `sofinder:security:audit --json` 作为部署门禁。

## 从 0.1.0-beta.13 升级至 0.1.0-beta.14

缩略图缓存现在会在原子发布后应用配置的权限。默认目录为 `0775`、文件为 `0664`。
PHP-FPM 与部署进程使用共享群组的项目可配置：

```yaml
so_finder:
  filesystem_permissions:
    directory_mode: '2775'
    file_mode: '0664'
```

权限值必须是带引号的八进制字符串。升级不会修改历史文件的 owner 或权限。

## 从 0.1.0-beta.12 升级至 0.1.0-beta.13

- CKEditor 4 快速上传现在会保留同名原文件，并把新文件保存为 `photo(1).jpg` 这类 CKFinder 风格名称；集成会收到实际改名 URL 与上传成功提示。
- 确实需要替换同名文件的宿主必须设置 `so_finder.ckeditor4.overwrite_on_upload: true`，并授予独立的 `overwrite` 操作权限；安全默认值为 `false`。
- 自定义 Multipart 上传客户端可通过 `autoRename=1` 使用相同行为。无需迁移存储文件、数据库或前端资源。

## 从 0.1.0-beta.11 升级至 0.1.0-beta.12

- 部署已提交的浏览器资源。只有需要完整 ACL 工具栏的 picker 才添加 `uiTools=full`；默认仍为精简模式。
- 根据更严格的可移植名称和扩展名不可修改规则检查现有集成。
- 目录 API 每页数量现在限制为 10–500。

## 从 0.1.0-beta.6 升级至 0.1.0-beta.7

默认文件浏览器不再显示深色 SoFinder 品牌页首。若要恢复只有品牌的页首，配置 `so_finder.ui.header: true`；显示标志则配置 `so_finder.ui.logo: true`。现有的语言、视图、缩放与功能偏好仍然有效。支持 cursor 的 HTTP client 必须接受 `total: null`。

无法使用已配置回收站的远端 adapter，应继续报告 `recoverableDelete: false`；删除操作此时会明确成为永久删除。若要参与主要安全审计，请实现 `StorageAuditProviderInterface`。现有本机 adapter 无须变更。

## 从 0.1.0-beta.5 升级至 0.1.0-beta.6

这是仅更新文件的版本，不需要迁移配置、存储空间、API 或资产。现有 `maintenance`、`ui.scale`、文件路径与公开 URL 均保持不变。

## 从 0.1.0-beta.4 升级至 0.1.0-beta.5

不需要迁移文件、URL 或 metadata。维护默认使用有界的 `inline` 执行，因此现有宿主即使没有 cron 或 worker 也能安全运作。使用 Symfony Messenger 的宿主可选择 `maintenance.mode: messenger`；安装 `symfony/messenger`、将 `MaintenanceMessage` 路由至非同步 transport，并在切换模式前启动 consumer。`external` 保留 Console／cron 控制，`disabled` 会关闭机会式清理，但不关闭回收站容量限制。可选的 `ui.scale` 默认为 `standard`。

## 从 0.1.0-beta.3 升级至 0.1.0-beta.4

已存储文件、公开 URL、metadata 与回收站数据均无须迁移。HEIC、HEIF 与 TIFF 不再是图片 pipeline 格式，请从仅限图片的资源移除其扩展名与 MIME alias。它们可保留在一般 `Files` 资源中；SoFinder 会将其视为普通可下载文件，不进行解码、尺寸读取、缩略图或图片编辑。

现有的非 Web 图片文件不会删除；它们仍以一般文件显示，但无法在图片模式选取，也不能传入图片 endpoint。升级后请执行 `sofinder:image:capabilities` 与 `sofinder:security:audit`。

## 从 0.1.0-beta.2 升级至 0.1.0-beta.3

已存储文件、公开 URL、metadata 与回收站数据均无须迁移。实现 `StorageAdapterInterface` 的 PHP 应用程序需要进行一次更新：

1. 将 `list(string $path): array` 改为 `list(ListQuery $query): ListingPage`，并加入 `capabilities()`。
2. Adapter 能公开安全本机路径时，将 `absolutePath()` 移至 `LocalPathProviderInterface`。
3. 可完整扫描用量时，将 `usage()` 移至 `StorageUsageProviderInterface`。
4. 通过带 tag 的 `StorageAdapterFactoryInterface` 注册 adapter；内建 `adapter: local` 配置不变。

SoFinder 现在支持 PHP 8.2–8.5 与 Symfony 6.4／7.4。HTTP 路由及 beta.2 response field 保持兼容。配置可加入 adapter 专用的 `options` map。请将 `sofinder:uploads:cleanup` 与既有回收站清理命令一并调度。

## 从 0.1.0-beta.1 升级至 0.1.0-beta.2

不需要迁移存储空间。此版本将缩略图流量从图片编辑 request limit 分离。宿主可覆盖新的 `so_finder.limits.thumbnail` 群组；默认值为每分钟 600 次请求及 16 个并行请求。若宿主分开发布资产，请重新构建或替换 bundled assets。浏览器语言偏好现在包括英文、简体中文与繁体中文。

## 从 Composer path repository 改用已标记版本

1. 提交或备份宿主配置与业务上传文件。
2. 从宿主 `composer.json` 移除本机 `repositories` path 项目。
3. Require 预定且不可变更的 SoFinder 标签，再执行 Composer update。
4. 保持既有 `so_finder` 资源根目录与公开 URL 不变。
5. 加入私有且可写入的 `usage_dir`，再为每个资源执行一次 `sofinder:usage:recalculate`。
6. 预热正式环境 Symfony cache，并执行 `sofinder:security:audit`。

从此 beta 起，`overwrite` 是独立授权操作。宿主 adapter 必须将它对应至修改权限；未知操作应拒绝。替换现有目标的移动与恢复操作也需要 `overwrite`。

已发布标签不可变更。修正必须通过新的预发布版或 patch 版本提供，绝不可重新指向既有标签。
