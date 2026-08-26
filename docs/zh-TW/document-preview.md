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
    pdf: true
    office: false
    office_binary: '/usr/bin/libreoffice'
    timeout_seconds: 60
    max_bytes: 52428800
```

PDF 預覽預設啟用。系統會將已鑑權 PDF 複製到私有、帶版本的快取，再以 inline、
`nosniff`、private cache 和嚴格 CSP 回傳，不會暴露實際儲存路徑。

Office 預覽需要明確啟用。SoFinder 使用參數陣列呼叫絕對路徑的 LibreOffice，不經過 Shell；
每次轉換使用私有 Profile，並限制輸入大小與執行時間。DOC/DOCX/ODT/RTF、XLS/XLSX/ODS
和 PPT/PPTX/ODP 會轉換成快取 PDF。正式環境應將 LibreOffice 放在禁止連網並限制 CPU、
記憶體和檔案系統權限的專用容器或 OS 沙箱中。
較舊的 LibreOffice 第一次無介面轉換可能超過 30 秒，正式環境建議從 60 秒開始設定。

啟用 Office 但找不到轉換器時，`GET /health` 會回報 `document-preview: down`。轉換失敗回傳
穩定的 `office_preview_unavailable` 或 `document_preview_failed`，不會退回公共第三方 Viewer。
