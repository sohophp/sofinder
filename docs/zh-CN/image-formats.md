---
title: 图片格式支持
description: SoFinder Preview 与编辑支持的 Raster Format，以及所需 GD 或 Imagick Runtime 能力。
---

# 图片格式支持

SoFinder 1.0 只会将支持的 Web Browser 可直接嵌入的格式视为图片。图片内容会在发布前完整 Decode；有效支持仍取决于已安装的 Processor：

| 格式 | GD | Imagick Fallback | CKEditor 图片 | 缩略图／编辑 |
| --- | --- | --- | --- | --- |
| JPEG、PNG、GIF、WebP、BMP | 是 | 已安装对应 Coder 时 | 是 | 是 |
| AVIF | GD 支持 AVIF 时 | 已安装对应 Coder 时 | 是 | 是 |
| ICO | 否 | 已安装 ICO Coder 时 | 是 | 是 |

默认 `auto` Driver 会对每个注册格式分别选择 GD；只有 GD 无法 Decode 时才 Fallback 到 Imagick。配置为 `gd` 或 `imagick` 时，若对应 Extension 不存在，Container Startup 会失败。Capability Command 与 `/api/config.imageCapabilities` 会报告当前服务器实际可读取、编辑及产生缩略图的 Codec。

```yaml
so_finder:
  image_processing:
    driver: auto # auto、gd 或 imagick
    max_width: 12000
    max_height: 12000
    max_single_frame_pixels: 50000000
    max_frames: 200
    max_total_pixels: 100000000
    memory_bytes: 268435456
    map_bytes: 536870912
    disk_bytes: 1073741824
    threads: 1
    timeout_seconds: 30
    # 可选覆盖；否则使用系统 CJK 字体或经过校验的字体缓存。
    watermark_font: /usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc
    watermark_font_auto_download: true
```

Imagick 只会接收由 Registry 产生的固定 Coder，永远不执行自动 SVG、PDF、PostScript、URL 或 Pseudo-protocol Dispatch。Memory、Map、Disk、Thread 与 Time Limit 仅套用于各次操作，完成后恢复。公开 Edit Capability 前，会通过有界 Round Trip 验证 Encoder Availability。

## 可配置基础动作与上传缩放（未发布）

图片解码、格式支持、方向、动画处理与缩放由 SoFinder 实现。宿主只配置能力，不必实现图片算法。普通 PHP 在工厂配置数组中传入相同键；Symfony 使用示例中的 `so_finder` 外层。

```yaml
so_finder:
  image_processing:
    driver: gd
    action_pipeline:
      formats: [jpeg, png, gif, webp, avif, bmp]
      editable_formats: [jpeg, png, gif, webp, avif, bmp]
      actions: [crop, rotate, resize]
      auto_orientation: true
      animated_editing: reject
      max_width: 4096
      max_height: 4096
      quality: 88
      resize_quality: 88
  uploads:
    image_resize:
      formats: [jpeg, png, gif, webp, avif, bmp]
      max_width: 4096
      max_height: 4096
      quality: 88
      other_formats: reject
```
`action_pipeline` 与 `image_resize` 默认均为 `null`，省略时保持现有处理器与上传行为。可选基础动作管线使用 GD，也接受 `driver: auto`；与 `imagick` 同时设置会报错。实际格式支持仍取决于已安装的编解码器，此管线不提供 ICO 或 Imagick 回退。`formats` 限定可读格式，`editable_formats` 必须为其子集；`actions` 只接受 crop、rotate、resize，空列表关闭编辑。浏览器发现动作与缩放范围，服务端独立校验。

`auto_orientation: false` 保留 EXIF 原始坐标；`animated_editing: first_frame` 明确允许有损的第一帧编辑，默认拒绝动画编辑。处理期间不改原图，整组基础动作最后只编码一次；通常使用 `quality`，包含缩放时使用 `resize_quality`。直接 transform／crop 接口遵守显式质量参数。

上传缩放独立启用，在普通及分块上传的私有隔离区执行，资源尺寸允许原图时也会执行更严格的缩放策略。原图须通过内容、MIME、大小与像素检查，结果须再通过资源检查；上传 `quality` 控制本次编码。列表外格式的 `other_formats: reject` 保留尺寸拒绝，显式 `preserve` 则允许超出尺寸上限而保留字节，内容、MIME、大小及像素检查仍执行；不会扩大资源扩展名白名单。尺寸为 1～2,147,483,647 的整数，质量为 1～100，像素限制继续约束解码与输出分配。

## 压缩、转换与水印

“压缩 / 水印”图片工具在用户工具栏中默认关闭，可在“设置”中启用。它提供质量可调的重新压缩、运行时支持的 JPEG/PNG/WebP/AVIF 转换、文字水印和图片水印。单批最多处理 100 张选中图片，并为每项返回独立结果。

格式转换始终另存副本；同格式压缩和水印可以另存或覆盖。动画和多页图片会被拒绝以免静默丢帧，水印图片仍经过正常资源权限检查。文字水印提供紧凑的“界面黑体、清晰黑体、典雅宋体”三种选择；默认使用界面黑体，保持最初编辑界面的字体风格。所选字体优先使用显式配置的 `watermark_font`（仅默认样式）或系统 CJK 字体；如果都不存在且启用了 `watermark_font_auto_download`，只会从官方仓库下载当前选中的固定版本 Noto CJK 字体，校验 SHA-256 后缓存到 `cache_dir/fonts`，并用文件锁避免并发重复下载。将该选项设为 `false` 可禁止自动联网。最终仍无可用字体时，Unicode 文字会返回 `watermark_font_unavailable`，不会生成乱码。

## 一般非 Web 图片文件

HEIC、HEIF、TIF 及 TIFF 在 1.0 不属于 Image Pipeline Format。它们可加入一般 `Files` Resource 的 Extension Allowlist，并接受和其他一般文件相同的 Actual-byte、Extension、MIME 与 Active-content Check。SoFinder 不会 Decode、报告尺寸、产生缩略图、编辑或自动转换这些格式。

不要把这些 Extension 或 MIME Alias 加入只允许图片的 Resource。既有文件不会被移除：Browser 会使用一般文件 Icon 显示；Image Selection 与 Image Endpoint 会以 `unsupported_image` 拒绝。File-selection Mode 仍可将其 Public URL 当作下载链接返回。CKEditor Image QuickUpload 会在写入前以 `image_not_web_embeddable` 拒绝。

SVG、PDF、PostScript、PSD、JP2 及 RAW 也不在 Image Pipeline 内。一般 File Resource 允许的格式仍视为普通文件；要支持安全 Preview 或 Conversion，需要另行设计。

部署后执行 `bin/console sofinder:image:capabilities`。若已配置的注册图片 Extension 没有有效 Decoder，命令会以失败状态结束；部署自动化可使用 `--json`。
