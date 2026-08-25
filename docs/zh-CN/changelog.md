---
title: 更新日志
description: SoFinder 每个公开版本的重要变更。
---

# 更新日志

## 0.1.0-beta.13 - 2026-08-25

- CKEditor 4 快速上传遇到同名文件时使用 CKFinder 风格后缀自动改名，返回实际 URL 与成功提示；只有显式配置并通过独立覆盖权限检查后才替换原文件。

## 0.1.0-beta.12 - 2026-08-25

- 新增 `uiTools=full`，让 picker 保留选择回调的同时显示完整且受 ACL 控制的管理、详情和图片工具。
- 未启用 Logo 时，把面包屑移到原品牌位置并将桌面搜索框右移；移动端使用紧凑的两行命令栏。
- 对重命名、裁剪副本、复制／移动目标和回收站自动改名统一执行可移植名称、长度、扩展名锁定及资源扩展名检查，并提供明确提示。
- 每页数量可输入或选择常用值，记住浏览器偏好，并在前后端限制为 10–500。
- 默认在命令栏显示紧凑 Logo；`ui.header` 控制相邻品牌文字，不再新增独立 Header。
- Picker 保留新建文件夹、上传、拖放及粘贴上传等常用工具。
- 裁剪副本保留或推断正确图片扩展名，避免二进制图片误触脚本签名，并在编辑器内显示保存错误。
- 裁剪副本的扩展名在界面和服务器端都不可修改，保存时验证名称、MIME、尺寸和内容安全。
- 恢复清晰的 Logo 和品牌文字大小，搜索居中、操作靠右，面包屑位于文件列表或网格正上方。
- 新增完整的英文、简体中文、繁体中文文件管理、图片、CKEditor 4、开发集成和 HTTP API 文档。

## 0.1.0-beta.11 - 2026-08-24

- 在共用配置中定义本机 `Files` 资源，让使用即时原始码的 Symfony 示例可在正式模式运作。

## 0.1.0-beta.10 - 2026-08-24

- 切换至加载失败的资源时清除过时的目录项目，并忽略已被取代的非同步列表 response。
- 复制链接与下载单一文件时使用已配置的公开／CDN 项目 URL；私有资源继续使用通过验证的 API URL。
- 允许每个资源通过配置的 Symfony 路由与参数样板产生项目 URL，并可可选宿主提供的数据库 context。
- 扩充使用即时原始码的 Symfony 示例，无须发布中间软件包版本即可直接测试本机与多资源 S3 浏览器。
- 静止时只显示一道淡色 panel 分隔线；只有 hover、键盘 focus 或拖曳中才显示较宽的双线调整控制。

## 0.1.0-beta.9 - 2026-08-24

- 图片缩略图完整限制在固定高度的列表列中。
- 直向与特别高的缩略图完整限制在固定高度的网格预览格中。
- 直向详细信息缩略图完整显示，不再被预览 panel 裁切。
- 无须启用可选的 tag 管理 UI，即可切换名称与 tag 搜索。
- 合并前端 stylesheet 入口，并加入窄版 manager／picker、键盘、图片比例及无障碍回归测试。
- 没有已存储偏好时，使用预定的 270px 详细信息 panel 宽度。
- 将自制 crop overlay 改为 CropperJS 1.6.2，提供对齐的 handle、可靠的角落／边缘缩放及更流畅的选取绘制。
- 使用未变更的默认副本名称存储裁切结果时，由服务器选择不冲突的名称。
- 说明不发布版本时的本机前端与 Symfony 整合测试方式。

## 0.1.0-beta.8 - 2026-08-24

- 以对角角落 handle 与方向性边缘 handle 改善 crop box 缩放。
- 锁定长宽比缩放时，保持对角位置固定。
- 防止 crop box 漂移，并确保缩放后的选取范围留在图片边界内。
- 加入裁切几何与四舍五入行为的 unit test。

## 0.1.0-beta.7 - 2026-08-24

- 以可感知模式的 manager 与 picker 外壳、情境文件操作、精简工具和 picker 确认列，取代默认品牌页首。
- 加入经验证的宿主与浏览器显示配置，不变更 ACL。
- 完整保留可为 null 的目录总数与不透明 cursor 分页。
- 让非本机 adapter 可选择加入安全审计与永久删除，而不调用本机回收站。
- 加入可选的 `sohophp/sofinder-s3` 软件包，支持 AWS S3、R2 与 MinIO endpoint 配置、前缀隔离及有界递归操作。

## 0.1.0-beta.6 - 2026-08-23

- 加入简体中文项目 README。
- 加入简体中文 Symfony 整合、维护模式与图片格式指南。
- 从每份英文来源文件链接至其翻译指南。
- 保持所有 PHP、HTTP、存储与前端执行期契约不变。

## 0.1.0-beta.5 - 2026-08-23

- 加入有界 `inline`、可选 `messenger`、外部调度与停用等维护模式，同时保留同步回收站容量安全机制。
- 使用 non-blocking lock 序列化清理入口，并限制 Web request 清理频率，不需要 daemon 或 cron 服务。
- 加入 compact、standard、large 与 extra-large 界面密度配置，提供宿主默认值及浏览器本机用户偏好。

## 0.1.0-beta.4 - 2026-08-23

- 将图片 pipeline 与 CKEditor 图片选取限制为可嵌入 Web 的 raster 格式：JPEG、PNG、GIF、WebP、AVIF、BMP 与 ICO。
- 当 `Files` 资源允许其扩展名时，将 HEIC、HEIF 与 TIFF 视为一般文件；不再解码、预览或编辑。
- 无须迁移即可保留现有非 Web 文件，同时拒绝向 Winstar 的 `Images` 资源新上传 HEIC／HEIF／TIFF。
- 说明 1.0 支持政策、发布流程与 Winstar 维护调度，不变更路由、公开 URL 或 PHP 契约。

## 0.1.0-beta.3 - 2026-08-23

- 通过 CI 兼容性矩阵支持 PHP 8.2–8.5 与 Symfony 6.4／7.4。
- 加入分页存储查询、支持 cursor 的列表结果、存储 capability 宣告与带 tag 的 adapter factory。
- 将本机路径、完整用量扫描、回收站、上传 session 与 request gate 状态分离至可替换契约。
- 加入可恢复分段上传 session 状态、过期 session 调度清理及明确的恢复冲突对话框。
- 将内容传递与主要浏览器 panel 拆分成专注模组，不变更既有 HTTP 路由或 JSON field。
- 加入中央图片格式 registry，以及每种格式优先使用 GD、fallback 至 Imagick 的 AVIF、HEIC／HEIF、TIFF 与 ICO capability 检测。
- 使用固定 allowlist coder、解码前 frame／pixel budget、有限资源限制及浏览器安全 PNG 缩略图强化 Imagick。
- 通过 API 与 console 发布有效图片 capability；防止在 CKEditor 图片模式选取或 QuickUpload 插入 HEIC／HEIF／TIFF。
- 加入 PHPStan、coverage CI、Range／ETag HTTP 契约检查、component test 与 10,000 个项目的目录回归测试。

所有重要变更都记录于此。项目遵循 Semantic Versioning；预发布版本仍可能调整公开扩充界面。

## 0.1.0-beta.2 - 2026-08-22

- 为唯读缩略图提供独立 request limit，避免大型图片目录耗尽更严格的图片编辑 quota。
- 私下缓存带版本的缩略图 response，并重试暂时性预览失败，不在文件浏览器留下损坏图片控制项。
- 将 context menu 预览改为独立无障碍对话框，不再调用编辑器的文件选取 callback。
- 改善预览配置，将 URL 复制移至精简图示与点击复制对话框，并加入持久化语言切换。
- 为文件详细信息与预览对话框加入一致的 responsive padding 与本地化修改时间。
- 加入完整繁体中文（`zh-tw`）UI 文字、依 locale 显示日期及自动检测繁体中文浏览器语言。

## 0.1.0-beta.1 - 2026-08-22

- 首次公开 beta，包含不依赖 framework 的核心与 Symfony 7.4 Bundle。
- 提供本机存储、安全上传、ACL、回收站、公开／proxy 传递、持久化 quota 计算及 CKEditor 4 整合。
- React 文件浏览器具备 responsive 网格／列表视图、可选工具、tag、文件夹树、上传伫列及 Canvas 图片裁切编辑器。
