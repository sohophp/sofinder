---
title: 主流編輯器整合
description: 透過通用 Picker SDK 連接 CKEditor 5、TinyMCE、TipTap、Quill 與一般表單。
---

# 主流編輯器整合

SoFinder 將 `sofinder-picker.js` 作為獨立 ES Module 發布。所有編輯器使用同一個
Picker URL 與帶版本的回傳物件，不依賴 React 內部實作。

回傳物件遵循公開的 [Picker Entry JSON Schema](/schema/picker-entry.schema.json)，固定包含 `resource`、`path`、`name`、`url`、`mimeType`、`size`、`modifiedAt`、`width`、`height` 與 `capabilities`。非圖片尺寸為 `null`；Consumer 必須忽略 1.x 新增欄位。訊息 Envelope 另見 [JSON Schema](/schema/picker-message.schema.json)。

上傳回應與新版 Picker 也會回傳相容新增的 [Asset Reference 1.0](/schema/asset-reference.schema.json)：包含版本指紋、下載 URL、可選穩定資產 ID、替代文字、響應式變體與 `embeddable` 能力；原有 `entry` 不會移除。

```js
import { openPicker } from '/sofinder/assets/sofinder-picker.js'

const entry = await openPicker({
  baseUrl: '/sofinder/browser',
  kind: 'image',
  resource: 'Images',
  path: 'articles/2026'
})
```

SDK 使用彈窗回傳結果，並同時驗證彈窗物件、Origin、協議版本及隨機 Request ID；
不使用萬用字元 `postMessage`。Host 與 Picker 必須同源，伺服器仍會執行登入、ACL
及圖片格式驗證。

## CKEditor 5

在應用程式正常安裝 CKEditor 5 及 Image Plugin，再將編輯器實例交給 SoFinder：

```js
import { selectForCkeditor5 } from '/sofinder/assets/sofinder-picker.js'

button.addEventListener('click', () => selectForCkeditor5(editor, {
  baseUrl: '/sofinder/browser',
  resource: 'Images',
  language: 'zh-tw'
}))
```

Adapter 呼叫 CKEditor 5 公開的 `insertImage` 與替代文字 Command。啟用資產目錄後，Picker 與上傳會保留明確的 `alt=""`，先依 `language`／`locale` 讀取 `altTranslations`，再使用資產預設替代文字；仍未設定時才使用移除副檔名的檔名。語言鍵採規範化 BCP 47 風格，例如 `en`、`zh-tw`、`fr-ca`，中繼資料 API 最多接受 20 種語言；上傳 Adapter 可傳 `locale: 'zh-tw'`。同時會盡量寫入響應式變體、寬高及 `data-sofinder-asset-id`。安裝與授權要求請參考
[CKEditor 自行託管官方指南](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/self-hosted/quick-start.html)。
既有 CKEditor 4 Callback 與 Quick Upload Endpoint 會繼續保留。

本機選擇、貼上及桌面拖入使用獨立官方 Upload Adapter，不會把 CKEditor 打入 SoFinder 主套件：

```js
import { createCkeditor5UploadPlugin } from '/sofinder/assets/sofinder-ckeditor5.js'

ClassicEditor.create(element, {
  extraPlugins: [createCkeditor5UploadPlugin({ apiBase: '/sofinder/api', csrfToken, resource: 'Images' })]
})
```

它與 TinyMCE、TipTap、Quill、Markdown 和一般表單入口共用 `sofinder-sdk.js` 上傳任務，統一處理進度、取消、重試、分塊恢復及同名檔案選擇。Private 資源沒有穩定鑑權交付 URL 時會拒絕永久插入，臨時簽章 URL 不會被視為可嵌入位址。Factory 回傳的是可建構 CKEditor Plugin，請勿手動呼叫或再包一層 Plugin 類別。

## TinyMCE

在 `tinymce.init()` 前註冊 Plugin：

```js
import { registerTinyMce } from '/sofinder/assets/sofinder-picker.js'

registerTinyMce(tinymce, {
  baseUrl: '/sofinder/browser',
  resource: 'Images'
})

tinymce.init({
  selector: '#editor',
  plugins: 'sofinder link image',
  toolbar: 'undo redo | bold italic | image sofinder'
})
```

Adapter 透過 TinyMCE 公開 API 插入已編碼的 `<img>`。CDN Key 與自託管方式參見
[TinyMCE 官方部署文件](https://www.tiny.cloud/docs/tinymce/latest/editor-and-features/)。

直接上傳請從 `sofinder-tinymce.js` 使用 `createTinyMceUploadIntegration(editor, options)`，並在 TinyMCE 的 `setup` Callback 建立。它會在圖片節點產生後補齊 `alt`、寬高、`srcset` 和穩定資產 ID，而不只保留上傳 URL。

## TipTap、Quill 與一般表單

TipTap 安裝 Image Extension 後呼叫：

```js
await selectForTiptap(editor, { baseUrl: '/sofinder/browser', resource: 'Images' })
```

Quill 在初始化含圖片按鈕的 Toolbar 後呼叫：

```js
registerQuill(quill, { baseUrl: '/sofinder/browser', resource: 'Images' })
```

一般輸入框使用 `selectForInput(input, options)`；它會寫入 URL 並觸發可冒泡的
`input` 與 `change` 事件。文件使用 `kind: 'file'`，網頁圖片使用 `kind: 'image'`。

## 專案內本機示範

啟動 `examples/symfony`，以 `demo` / `demo` 登入後開啟 `/integrations`。頁面會用
本機 SoFinder 後端及 Picker SDK 實際連接 CKEditor 5、TinyMCE 8、TipTap、Quill 2
和一般表單。第三方編輯器從其文件列出的 CDN 載入；部署前必須檢查各編輯器授權並
替換示範 Key。

目錄深層連結可以直接收藏：

```text
/sofinder/browser?uiMode=manager&type=Images&path=articles/2026
```

瀏覽器導覽時會同步 `type` 與 `path`；此處保存邏輯路徑，不會暴露伺服器檔案系統路徑。
