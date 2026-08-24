# SoFinder

其他语言：[English](README.md) · [繁體中文](README.zh-TW.md)

SoFinder 是原创、采 MIT 授权的网页文件管理器，支持 PHP 8.2 至 8.5，包含与框架无关的核心、Symfony 6.4／7.4 Bundle，以及 React 用户界面。

本项目采独立设计，不包含专有文件管理器的程序码、美术、翻译、样式或其他资产。Runtime 相依软件包声明记录于 `THIRD_PARTY_NOTICES.md`。

普通用户可阅读[文件管理器指南](https://sofinder.sohophp.app/zh-CN/user-guide)、[图片管理](https://sofinder.sohophp.app/zh-CN/image-guide)和 [CKEditor 4](https://sofinder.sohophp.app/zh-CN/ckeditor4)。开发者请使用[集成指南](https://sofinder.sohophp.app/zh-CN/developer-guide)及 [HTTP API 参考](https://sofinder.sohophp.app/zh-CN/api-reference)。

## Symfony 安装

完整文件站位于 <https://sofinder.sohophp.app/zh-CN/>。注册 `SohoPHP\SoFinder\SoFinderBundle`，导入 `@SoFinderBundle/Resources/config/routes.yaml`，并在 `so_finder.resources` 配置一个或多个资源类型。完整示例请见[简体中文 Symfony 整合](https://sofinder.sohophp.app/zh-CN/symfony)。

已实现功能包含：登录后浏览、搜索、上传、下载、新建文件夹、重新命名、可恢复删除、自动冲突命名的复制／移动、服务器限制的分页、名称／大小／日期排序、网格／列表视图、多选、具数量上限及逐项结果的批次操作、文件夹树、右键／长按菜单、剪贴簿与指定目标拖放、一般／分块上传进度、取消、明确覆盖、缩略图缓存、EXIF 方向修正、等比例缩放、Canvas 裁剪、派生图片默认、受限制的 ZIP 下载、响应式版面、英文／简体中文／繁体中文，以及 CKEditor 4 浏览与上传界面。

资源可配置 byte 配额、必要 Symfony roles 及各操作专用 roles。成功变更会产生结构化 PSR-3 audit log。每位用户的收藏、标签及最近 50 笔记录会通过可替换的 metadata store 原子化保存。

Symfony 整合亦提供经验证的主题配置、tagged plugin descriptor registry、键盘文件导览、可见焦点及屏幕阅读器选取提示。公开扩充契约请见 `docs/plugins.md`。

图片详细信息会显示实际解码尺寸。图片编辑默认自动命名并另存副本；覆盖必须明确选择。裁剪支持缩放、平移、八方向控制点、比例、键盘／数值微调、恢复／重做及前后比较。浏览器齿轮菜单可控制可选图片工具，旋转和默认尺寸默认关闭。复制与移动可从完整授权资源选取文件夹，服务器仍会执行路径沙箱及 ACL。

每个资源可分别限制 Unicode 文件名长度、文件夹名称长度与文件夹深度。上传、新建文件夹、重新命名、复制及移动都会检查，包含被移动文件夹的完整子树。

上传流程使用私有隔离区、实际 byte 限制、活动内容检查及完整图片解码，再原子发布。SoFinder 也提供继承式路径 ACL、public／proxy delivery、Range／ETag、操作门禁、结构化失败 audit 及私有 30 天回收站。部署时执行 `sofinder:security:audit`；使用外部调度时安排 `sofinder:trash:cleanup` 与 `sofinder:uploads:cleanup`。默认为有上限的 inline 维护，详见[维护模式](https://sofinder.sohophp.app/zh-CN/maintenance)与[安全部署](https://sofinder.sohophp.app/zh-CN/security)。

图片管线支持可嵌入网页的 JPEG、PNG、GIF、WebP、AVIF、BMP、ICO。可用时优先使用 GD，ICO 可可选 Imagick fallback。解码图片上限为五千万像素，编辑会保留原始格式与扩展名。HEIC、HEIF、TIFF 可放在一般文件资源，但不解码、不预览、不编辑。缩略图 Cache 保留 30 天并限制最多 5,000 个文件；ZIP 最多接受 100 个选取根、总计 1,000 个项目及 512 MB。

## 开发

```bash
composer install
vendor/bin/phpunit
composer phpstan
cd frontend
corepack pnpm install
corepack pnpm build
corepack pnpm test:unit
```

存储扩充契约请见 `docs/storage-adapters.md`；公开 PHP 契约、HTTP 兼容性与版本政策请见 `docs/php-contracts.md`、`docs/http-api.md`、`docs/versioning.md`。图片 Runtime 需求请见[图片格式支持](https://sofinder.sohophp.app/zh-CN/image-formats)。可执行的 Symfony 6.4／7.4 安装示例位于 `examples/symfony`。

S3 兼容对象存储由可选的 `sohophp/sofinder-s3` Composer 软件包提供，使核心
安装不必承担 AWS SDK 相依；可使用私有 proxy delivery，或明确配置公开／CDN
网址。原始码发行内容请见 `packages/sofinder-s3/README.md`。
