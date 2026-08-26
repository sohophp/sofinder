---
title: 主流編輯器整合
description: 透過通用 Picker SDK 連接 CKEditor 5、TinyMCE、TipTap、Quill 與一般表單。
---

# 主流編輯器整合

SoFinder 將 `sofinder-picker.js` 作為獨立 ES Module 發布。所有編輯器使用同一個
Picker URL 與帶版本的回傳物件，不依賴 React 內部實作。

回傳物件遵循公開的 [Picker Entry JSON Schema](/schema/picker-entry.schema.json)，固定包含 `resource`、`path`、`name`、`url`、`mimeType`、`size`、`modifiedAt`、`width`、`height` 與 `capabilities`。非圖片尺寸為 `null`；Consumer 必須忽略 1.x 新增欄位。訊息 Envelope 另見 [JSON Schema](/schema/picker-message.schema.json)。

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
  resource: 'Images'
}))
```

Adapter 呼叫 CKEditor 5 公開的 `insertImage` Command。安裝與授權要求請參考
[CKEditor 官方指南](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/cloud/quick-start.html)。
既有 CKEditor 4 Callback 與 Quick Upload Endpoint 會繼續保留。

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
