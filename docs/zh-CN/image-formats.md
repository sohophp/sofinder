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
    # 非 ASCII 文字水印必须配置；仅使用 ASCII 时可保持 null。
    watermark_font: /usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc
```

Imagick 只会接收由 Registry 产生的固定 Coder，永远不执行自动 SVG、PDF、PostScript、URL 或 Pseudo-protocol Dispatch。Memory、Map、Disk、Thread 与 Time Limit 仅套用于各次操作，完成后恢复。公开 Edit Capability 前，会通过有界 Round Trip 验证 Encoder Availability。

## 压缩、转换与水印

“压缩 / 水印”图片工具在用户工具栏中默认关闭，可在“设置”中启用。它提供质量可调的重新压缩、运行时支持的 JPEG/PNG/WebP/AVIF 转换、文字水印和图片水印。单批最多处理 100 张选中图片，并为每项返回独立结果。

格式转换始终另存副本；同格式压缩和水印可以另存或覆盖。动画和多页图片会被拒绝以免静默丢帧，水印图片仍经过正常资源权限检查。Unicode 文字必须配置可读的绝对路径 `watermark_font`；否则 API 返回 `watermark_font_unavailable`，不会生成乱码。

## 一般非 Web 图片文件

HEIC、HEIF、TIF 及 TIFF 在 1.0 不属于 Image Pipeline Format。它们可加入一般 `Files` Resource 的 Extension Allowlist，并接受和其他一般文件相同的 Actual-byte、Extension、MIME 与 Active-content Check。SoFinder 不会 Decode、报告尺寸、产生缩略图、编辑或自动转换这些格式。

不要把这些 Extension 或 MIME Alias 加入只允许图片的 Resource。既有文件不会被移除：Browser 会使用一般文件 Icon 显示；Image Selection 与 Image Endpoint 会以 `unsupported_image` 拒绝。File-selection Mode 仍可将其 Public URL 当作下载链接返回。CKEditor Image QuickUpload 会在写入前以 `image_not_web_embeddable` 拒绝。

SVG、PDF、PostScript、PSD、JP2 及 RAW 也不在 Image Pipeline 内。一般 File Resource 允许的格式仍视为普通文件；要支持安全 Preview 或 Conversion，需要另行设计。

部署后执行 `bin/console sofinder:image:capabilities`。若已配置的注册图片 Extension 没有有效 Decoder，命令会以失败状态结束；部署自动化可使用 `--json`。
