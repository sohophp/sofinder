---
title: 配置参考
description: SoFinder 全局、UI、维护、图片、请求限制与资源配置参考。
---

# 配置参考

所有配置都位于 `so_finder` 键下。Symfony 会在编译 Container 时验证每个值，因此拼错的键名及超出范围的值都会提早失败。

## 全局路径与上传 Session

| 选项 | 默认值 | 用途 |
| --- | --- | --- |
| `route_prefix` | `/admin/sofinder` | 保留的兼容配置；当前 HTTP URL 由导入的 Symfony 路由 prefix 控制。 |
| `cache_dir` | `%kernel.cache_dir%/sofinder` | 缩略图及其他可重新产生的缓存资料。 |
| `metadata_file` | `%kernel.project_dir%/var/sofinder/metadata.json` | 默认的收藏、标签及最近项目 Metadata Store。 |
| `quarantine_dir` | `%kernel.cache_dir%/sofinder/quarantine` | 私有上传检查区。 |
| `chunk_dir` | `%kernel.cache_dir%/sofinder/chunks` | 进行中的分块上传。 |
| `usage_dir` | `%kernel.project_dir%/var/sofinder/usage` | 持久化资源使用量计数器。 |
| `chunk_size` | `5242880` | 分块大小（byte）；允许范围为 256 KiB–16 MiB。 |
| `max_upload_chunks` | `200` | 单次上传的分块上限；允许范围为 1–1000。 |

这些工作目录必须允许 PHP 写入，而且不可经由 Web 直接存取。

## 集群 Service

`cluster.state_service` 可指定实现 `AtomicStateStoreInterface` 的宿主 Symfony Service，
自动把 metadata、请求 Gate、Usage、指标、维护协调和分块 Session Metadata 切换为
共享原子 Store。分块内容仍写入 `chunk_dir`，多节点必须把它挂载为相同路径的私有共享目录。
需要其他暂存后端时，可用 `cluster.chunk_upload_store_service` 替换内置协调器。
详见[生产运行](/zh-CN/production)。

## Picker Origin

Picker 默认同源。跨域 CMS 必须逐个配置精确 Origin，不接受通配符或带路径 URL：

```yaml
so_finder:
  picker:
    allowed_origins: ['https://cms.example.com']
```

## 临时签名 URL

```yaml
so_finder:
  signed_urls:
    enabled: true
    secret: '%kernel.secret%'
    default_ttl_seconds: 300
    max_ttl_seconds: 3600
```

Secret 至少 32 Byte。签名 URL 绑定文件版本且只适用于 `proxy` 资源。需要匿名访问时，
在通用 SoFinder Firewall 规则前为 `/sofinder/signed/` 配置严格范围的 `PUBLIC_ACCESS`。

## 文件系统权限

```yaml
so_finder:
  filesystem_permissions:
    directory_mode: '0775'
    file_mode: '0664'
```

这些模式应用于新建的本机存储项目和缩略图缓存。必须使用带引号的八进制字符串，避免 YAML 解释成十进制。PHP-FPM 与部署进程使用共享群组时，可设置 `directory_mode: '2775'` 保持群组继承。SoFinder 不会修改 owner，也不会修复历史项目。

## CKEditor 4 上传

```yaml
so_finder:
  ckeditor4:
    overwrite_on_upload: false
```

安全默认值会把快速上传的同名文件自动改名为 `photo(1).jpg` 这类名称。启用 `overwrite_on_upload` 后，也只有当前用户拥有资源独立的 `overwrite` 权限时才会替换原文件。

## 病毒扫描

```yaml
so_finder:
  malware_scanning:
    enabled: true
    endpoint: 'unix:///run/clamav/clamd.ctl'
    timeout_seconds: 8
    history_limit: 100
    status_roles: [ROLE_ADMIN]
```

启用后，SoFinder 会自动把内置 ClamAV Client 注册为同步、fail-closed 的上传扫描器和
就绪检查。只有管理员角色能打开“安全状态”，其中会明确显示 clamd 是否可用，以及有界的
通过、拦截、失败和待扫描记录；记录不保存文件内容。

## 回收站

| 选项 | 默认值 |
| --- | ---: |
| `trash_dir` | `%kernel.project_dir%/var/sofinder/trash` |
| `trash_retention_days` | `30` |
| `trash_max_items` | `1000` |
| `trash_max_bytes` | `1073741824` |

本机存储可使用回收站。对 SoFinder 而言，对象存储删除是永久操作；需要恢复能力时应启用供应商版本控制。

## UI

```yaml
so_finder:
  ui:
    mode: auto
    header: true
    logo: true
    search: true
    language_switcher: true
    view_switcher: true
    folder_tree: false
    scale: standard
```

`mode` 可设置为 `auto`、`manager` 或 `picker`。启用 `logo` 时，左侧显示 Logo 和可选品牌文字，搜索居中，面包屑位于文件列表或网格上方；关闭 `logo` 时，面包屑占用原 Logo 位置，宽屏搜索框向右移动。启用 Logo 时，设置 `header: false` 只隐藏品牌文字。`scale` 可设置为 `compact`、`standard`、`large` 或 `xlarge`。浏览器偏好和 `uiTools=common|full` 只能改变显示方式，不会授予服务器能力。

宿主可为可选功能设置不可越过的上限。关闭后，浏览器设置不再显示该功能，专用 HTTP
端点统一返回 `feature_disabled` 404：

```yaml
so_finder:
  features:
    folder_tree: true
    recent: true
    favorites: true
    tags: true
    archive: true
    trash: true
    batch_rename: true
    image_editing: true
    image_processing: true
    document_preview: true
    security_status: true
    folder_upload: true
    text_preview: true
    checksum: true
```

## 主题

```yaml
so_finder:
  theme:
    accent: '#276ef1'
    background: '#f4f6f9'
    panel: '#ffffff'
    text: '#1c2735'
    muted: '#667282'
    danger: '#c13a43'
    radius: '10px'
```

色彩只接受三位或六位十六进位值；圆角接受 `0px` 至 `32px`。

## 维护

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

模式包括 `inline`、`messenger`、`external` 及 `disabled`。改变默认值前请阅读[维护模式](/zh-CN/maintenance)。

## 请求与并行限制

`limits` 群组包括 `normal`、`upload`、`image`、`thumbnail`、`archive` 及 `transfer`。每个群组都接受：

| 键 | 意义 |
| --- | --- |
| `max_requests` | 配置时间区间内允许的请求数；`0` 表示停用此计数。 |
| `interval` | 滑动时间区间，单位为秒。 |
| `max_concurrent` | 允许的同时操作数；`0` 表示停用此计数。 |

上传、图片变更及压缩文件的默认限制刻意比浏览与缩略图更严格。

## 图片处理

`image_processing.driver` 可设置为 `auto`、`gd` 或 `imagick`。全局界线涵盖尺寸、像素、Frame、Memory、Map、Disk、Thread 及 Timeout；个别资源可配置更严格的图片宽度、高度及像素限制。Runtime Codec 需求请参考[图片格式](/zh-CN/image-formats)。

Preset 是具名称及界线的输出尺寸：

```yaml
so_finder:
  image_presets:
    content: { width: 1200, height: 1200, quality: 88 }
    thumbnail: { width: 400, height: 400, quality: 82 }
```

## 资源

至少必须定义一个具名称的资源。

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `adapter` | `local` | Adapter Factory 名称，例如 `local` 或可选的 `s3`。 |
| `root` | 必填 | 本机路径或 Object Key 的安全边界。 |
| `public_url` | 空字串 | 只供公开 Delivery 使用的 Base URL。 |
| `delivery_mode` | `public` | `public` 或经验证的 `proxy`。 |
| `allowed_extensions` | 空列表 | 空列表表示不使用 Allowlist；Denylist 仍然生效。 |
| `denied_extensions` | 可执行／主动内容格式 | 默认包括 PHP、Phar、CGI、Shell、HTML 及 JavaScript。 |
| `allowed_mime_types` | 空列表 | 上传时检查的可选 MIME Allowlist。 |
| `max_size` | 20 MiB | 文件大小上限。 |
| `read_only` | `false` | 启用时禁止变更。 |
| `quota` | `0` | Byte；零表示无上限。 |
| `roles` | 空列表 | 必要 Symfony Role；空列表维持已登录用户行为。 |
| `operation_roles` | 空列表 | 覆盖特定操作所需的 Role。 |
| `path_acl` | 空列表 | 资源相对路径下可继承的 Allow 或 Deny 规则。 |

资源也支持 Unicode 文件名／文件夹名称长度、文件夹深度、批次大小、递归操作、压缩文件项目／Byte，以及图片尺寸／像素限制。[Symfony 整合指南](/zh-CN/symfony)提供包含 ACL、宿主路由及显示选项的完整示例。

## 检查有效配置

使用 Symfony 标准配置工具：

```bash
bin/console config:dump-reference so_finder
bin/console debug:config so_finder
```

`config:dump-reference` 说明可接受的键及默认值；`debug:config` 显示当前环境编译后的值。
