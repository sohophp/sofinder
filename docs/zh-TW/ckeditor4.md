---
title: CKEditor 4 使用與整合
description: 設定和使用 SoFinder 的 CKEditor 4 檔案瀏覽、圖片選擇與快速上傳功能。
---

# CKEditor 4 使用與整合

SoFinder 支援 CKEditor 4 的檔案瀏覽回呼協議和快速上傳回應。瀏覽檔案時會進入 picker 模式；快速上傳則把本地檔案直接傳送到設定的 SoFinder 資源。

## 管理員設定

以下範例假定路由前綴為 `/sofinder`。請透過宿主模板的正常機制把 CSRF Token 注入編輯頁面，不要硬編碼到 JavaScript Bundle。

```javascript
CKEDITOR.replace("editor", {
  filebrowserBrowseUrl: "/sofinder/browser?type=Files&selection=file&uiMode=picker&uiTools=full",
  filebrowserImageBrowseUrl: "/sofinder/browser?type=Images&selection=image&uiMode=picker&uiTools=full",
  filebrowserUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Files&selection=file&_token="
    + encodeURIComponent(soFinderCsrfToken),
  filebrowserImageUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Images&selection=image&_token="
    + encodeURIComponent(soFinderCsrfToken)
});
```

CKEditor 會在瀏覽和傳統上傳請求中附加 `CKEditorFuncNum`。SoFinder 透過 `CKEDITOR.tools.callFunction` 返回選擇結果。瀏覽器也接受 `select=1`；`type` 選擇初始資源，`selection=image|file` 控制選擇驗證。

路由必須受到同源 Symfony Session 和 Firewall 保護。由於 CKEditor 4 無法設定 JSON API Header，快速上傳必須透過 `_token` 傳遞 CSRF Token。Origin／Referer 只是額外檢查，不能替代 CSRF。

## 瀏覽並插入已有檔案

1. 在 CKEditor 中開啟檔案的“連結”視窗，或圖片的“圖片”視窗。
2. 點擊**瀏覽伺服器**。
3. 在 SoFinder 中切換資源和資料夾；搜尋、排序、網格／列表、預覽仍可使用。
4. 選擇一個檔案。圖片模式只允許選擇可嵌入 Web 且具有可用 URL 的圖片。
5. 點擊**選擇**。SoFinder 呼叫 CKEditor Callback、填寫 URL 並關閉選擇視窗。
6. 返回 CKEditor 後，檢查替代文字、尺寸、對齊等內容，再完成插入。

範例保留 picker 的選擇與 Callback 行為，同時透過 `uiTools=full` 顯示完整工具，讓有權限的使用者可在選擇前上傳、新增資料夾、重新命名、複製、移動、刪除和編輯圖片。所有按鈕仍受資源能力和伺服器 ACL 限制。省略該參數或使用 `uiTools=common` 可恢復精簡工具列。

## 從 CKEditor 快速上傳

1. 開啟“連結”或“圖片”視窗並切換到**上傳**。
2. 選擇本地檔案並傳送。
3. SoFinder 驗證並儲存到指定資源，然後返回入口 URL。
4. CKEditor 切換到 URL 資訊，使用者完成插入。

檔案欄位名必須是 `upload`。可在上傳 URL 中增加 `currentFolder`，指定固定且規範化的目標資料夾。同名衝突不會靜默覆蓋。圖片快速上傳會拒絕 HEIC、HEIF、TIFF，以及目前伺服器不能嵌入網頁的格式。

需要 JSON 的整合可使用 `responseType=json` 或 `Accept: application/json`。成功回應：

```json
{"uploaded":1,"fileName":"photo.jpg","url":"https://cdn.example.com/images/photo.jpg"}
```

失敗回應：

```json
{"uploaded":0,"error":{"code":"image_not_web_embeddable","message":"This image format cannot be embedded directly in a web page."}}
```

## 選擇正確的 URL 傳遞方式

- 最終內容無需登入即可存取時，使用公開／CDN URL。
- 需要穩定 ID、下載記錄或宿主授權時，使用宿主 `entry_url` Route。
- SoFinder proxy URL 需要認證，適合私有內網內容；如果文章公開或用於郵件 HTML，就不應返回僅編輯者可存取的地址。

不要為了讓編輯器取得公開 URL，就透過 Web Server Alias 暴露私有儲存根目錄。

## 常見問題

| 現象 | 檢查 |
| --- | --- |
| “瀏覽伺服器”打不開 | Browser URL、彈窗策略、路由前綴和登入 Firewall。 |
| 選擇後沒有反應 | `CKEditorFuncNum`、同源 opener／parent，以及目標視窗是否存在 CKEditor 4。 |
| 上傳返回 403 | `_token`、登入狀態、Origin／Referer 和資源操作權限。 |
| 上傳返回 415 | 副檔名／MIME Allowlist、圖片解碼支援和 `selection=image`。 |
| URL 只有編輯者能開啟 | 返回了 proxy 或受保護的宿主 URL，應重新檢查傳遞設計。 |
| 圖片不能選擇 | 格式不可嵌入、沒有入口 URL，或伺服器無法解碼。 |

管理員還應閱讀 [Symfony 整合](/zh-TW/symfony)、[生產安全](/zh-TW/security)和[圖片格式](/zh-TW/image-formats)。
