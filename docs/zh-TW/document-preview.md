---
title: PDF 與 Office 預覽
description: 設定鑑權 PDF 預覽及選用的 LibreOffice 沙箱轉換。
---

# PDF 與 Office 預覽

SoFinder 會註冊宣告式 `document-preview` Plugin。瀏覽器依 MIME 或副檔名配對同源預覽
端點，並在同源 iframe 中顯示回傳的 PDF。瀏覽器頁面 CSP 只允許同源 frame，PDF
回應自身仍帶 sandbox CSP；Plugin 不能注入 JavaScript 或遠端 HTML。

```yaml
so_finder:
  document_preview:
    mode: auto # auto | inline | messenger
    pdf: true
    office: false
    office_binary: '/usr/bin/libreoffice'
    timeout_seconds: 60
    max_bytes: 52428800
    job_ttl_seconds: 86400
    cache_ttl_seconds: 604800
```

PDF 預覽預設啟用。系統會將已鑑權 PDF 複製到私有、帶版本的快取，再以 inline、
`nosniff`、private cache 和嚴格 CSP 回傳，不會暴露實際儲存路徑。

Office 預覽需要明確啟用。SoFinder 使用參數陣列呼叫絕對路徑的 LibreOffice，不經過 Shell；
每次轉換使用私有 Profile，並限制輸入大小與執行時間。DOC/DOCX/ODT/RTF、XLS/XLSX/ODS
和 PPT/PPTX/ODP 會轉換成快取 PDF。正式環境應將 LibreOffice 放在禁止連網並限制 CPU、
記憶體和檔案系統權限的專用容器或 OS 沙箱中。
較舊的 LibreOffice 第一次無介面轉換可能超過 30 秒，正式環境建議從 60 秒開始設定。

`auto` 在存在 `messenger.default_bus` 時非同步排隊，否則保留單節點同步相容。前端以等冪
任務輪詢 `queued`、`running`、`ready`、`failed`、`expired`，只在 `ready` 後建立 PDF
iframe；PDF 與快取命中仍立即回傳。`inline` 固定在 Request 內轉換；`messenger` 缺少 Bus
時會讓 Container 編譯失敗。Worker 處理 `DocumentPreviewMessageHandler`。

工作回應包含實際 `mode`、快取命中、建立／開始／更新／完成時間和轉換耗時。瀏覽器會區分
提交、排隊、轉換及載入 PDF，並短暫延遲進度提示，避免快取命中時閃現誤導文字。管理員
安全狀態頁會顯示設定／實際模式、轉換器路徑和版本、快取可寫性、PDF 快取數量、最近成功
時間和有界工作統計。

多節點非同步部署必須同時共享 `AtomicStateStoreInterface` 狀態與
`cache_dir/document-previews` 檔案系統。只有每個節點完成共享掛載後才可設定
`cluster.shared_preview_cache: true`，否則安全稽核會回報 critical。

啟用 Office 但找不到轉換器時，`GET /health` 會回報 `document-preview: down`。轉換失敗回傳
穩定的 `office_preview_unavailable` 或 `document_preview_failed`，不會退回公共第三方 Viewer。
