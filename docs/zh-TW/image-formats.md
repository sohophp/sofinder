---
title: 圖片格式支援
description: SoFinder Preview 與編輯支援的 Raster Format，以及所需 GD 或 Imagick Runtime 能力。
---

# 圖片格式支援

SoFinder 1.0 只會將支援的 Web Browser 可直接嵌入的格式視為圖片。圖片內容會在發布前完整 Decode；有效支援仍取決於已安裝的 Processor：

| 格式 | GD | Imagick Fallback | CKEditor 圖片 | 縮圖／編輯 |
| --- | --- | --- | --- | --- |
| JPEG、PNG、GIF、WebP、BMP | 是 | 已安裝對應 Coder 時 | 是 | 是 |
| AVIF | GD 支援 AVIF 時 | 已安裝對應 Coder 時 | 是 | 是 |
| ICO | 否 | 已安裝 ICO Coder 時 | 是 | 是 |

預設 `auto` Driver 會對每個註冊格式分別選擇 GD；只有 GD 無法 Decode 時才 Fallback 到 Imagick。設定為 `gd` 或 `imagick` 時，若對應 Extension 不存在，Container Startup 會失敗。Capability Command 與 `/api/config.imageCapabilities` 會回報目前伺服器實際可讀取、編輯及產生縮圖的 Codec。

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
    # 非 ASCII 文字浮水印必須設定；僅使用 ASCII 時可保持 null。
    watermark_font: /usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc
```

Imagick 只會接收由 Registry 產生的固定 Coder，永遠不執行自動 SVG、PDF、PostScript、URL 或 Pseudo-protocol Dispatch。Memory、Map、Disk、Thread 與 Time Limit 僅套用於各次操作，完成後還原。公開 Edit Capability 前，會透過有界 Round Trip 驗證 Encoder Availability。

## 壓縮、轉換與浮水印

「壓縮 / 浮水印」圖片工具在使用者工具列中預設關閉，可在「設定」中啟用。它提供品質可調的重新壓縮、Runtime 支援的 JPEG/PNG/WebP/AVIF 轉換、文字浮水印與圖片浮水印。單批最多處理 100 張已選圖片，並為每項回傳獨立結果。

格式轉換一律另存副本；同格式壓縮與浮水印可另存或覆寫。動畫與多頁圖片會被拒絕以避免靜默遺失 Frame，浮水印圖片仍經過一般資源權限檢查。Unicode 文字必須設定可讀的絕對路徑 `watermark_font`；否則 API 回傳 `watermark_font_unavailable`，不會產生亂碼。

## 一般非 Web 圖片檔

HEIC、HEIF、TIF 及 TIFF 在 1.0 不屬於 Image Pipeline Format。它們可加入一般 `Files` Resource 的 Extension Allowlist，並接受和其他一般檔案相同的 Actual-byte、Extension、MIME 與 Active-content Check。SoFinder 不會 Decode、回報尺寸、產生縮圖、編輯或自動轉換這些格式。

不要把這些 Extension 或 MIME Alias 加入只允許圖片的 Resource。既有檔案不會被移除：Browser 會使用一般檔案 Icon 顯示；Image Selection 與 Image Endpoint 會以 `unsupported_image` 拒絕。File-selection Mode 仍可將其 Public URL 當作下載連結回傳。CKEditor Image QuickUpload 會在寫入前以 `image_not_web_embeddable` 拒絕。

SVG、PDF、PostScript、PSD、JP2 及 RAW 也不在 Image Pipeline 內。一般 File Resource 允許的格式仍視為普通檔案；要支援安全 Preview 或 Conversion，需要另行設計。

部署後執行 `bin/console sofinder:image:capabilities`。若已設定的註冊圖片 Extension 沒有有效 Decoder，命令會以失敗狀態結束；部署自動化可使用 `--json`。
