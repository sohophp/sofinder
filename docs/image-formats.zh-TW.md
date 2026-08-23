# 圖片格式支援

英文原文：[image-formats.md](image-formats.md)

SoFinder 1.0 只把現代支援瀏覽器可直接嵌入的格式視為圖片。圖片在發布前必須完整解碼，實際支援能力仍取決於伺服器安裝的處理器：

| 格式 | GD | Imagick fallback | CKEditor 圖片 | 縮圖／編輯 |
| --- | --- | --- | --- | --- |
| JPEG、PNG、GIF、WebP、BMP | 支援 | 安裝對應 coder 時支援 | 支援 | 支援 |
| AVIF | GD 支援 AVIF 時 | 安裝對應 coder 時支援 | 支援 | 支援 |
| ICO | 不支援 | 安裝 ICO coder 時支援 | 支援 | 支援 |

預設 `auto` driver 會針對每種格式分別選擇 GD，只有 GD 無法解碼時才 fallback 到 Imagick。明確設定 `gd` 或 `imagick` 時，如果缺少該 extension，container 啟動會失敗。能力命令和 `/api/config.imageCapabilities` 會回報目前伺服器實際可讀取、編輯及產生縮圖的 codec。

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
```

Imagick 只會使用 registry 根據 MIME 選出的固定 coder，絕不自動呼叫 SVG、PDF、PostScript、URL 或偽協議 coder。Memory、map、disk、thread 與時間限制只作用於單次操作，結束後會還原。宣告可編輯前，encoder 必須通過有邊界的 round-trip 驗證。

## 非 Web 圖片的一般檔案

HEIC、HEIF、TIF、TIFF 不屬於 1.0 圖片管線。可將它們加入一般 `Files` 資源的副檔名白名單；此時只接受一般檔案的實際 byte、extension、MIME 與活動內容檢查。SoFinder 不解碼、不顯示尺寸、不產生縮圖、不編輯，也不自動轉換這些檔案。

圖片專用資源不得加入這些 extension 或 MIME alias。既有檔案不會被刪除，瀏覽器會顯示一般檔案圖示，圖片選取與圖片 API 會回傳 `unsupported_image`。檔案選取模式仍可把其 public URL 當作下載連結；CKEditor 圖片 QuickUpload 會在寫入前以 `image_not_web_embeddable` 拒絕。

SVG、PDF、PostScript、PSD、JP2 及 RAW 同樣不屬於圖片管線。若一般檔案資源允許，仍只作為普通檔案；安全預覽或轉換需要另行設計。

部署後執行：

```bash
bin/console sofinder:image:capabilities
```

若設定中的已註冊圖片 extension 沒有有效 decoder，命令會以失敗狀態退出；部署自動化可使用 `--json`。
