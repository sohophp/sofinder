---
title: 主流编辑器集成
description: 通过通用 Picker SDK 连接 CKEditor 5、TinyMCE、TipTap、Quill、wangEditor、Jodit 和普通表单。
---

# 主流编辑器集成

SoFinder 将 `sofinder-picker.js` 作为独立 ES Module 发布。所有编辑器使用同一
Picker URL 和带版本的返回对象，不依赖 React 内部实现。

返回对象遵循公开的 [Picker Entry JSON Schema](/schema/picker-entry.schema.json)，固定包含 `resource`、`path`、`name`、`url`、`mimeType`、`size`、`modifiedAt`、`width`、`height` 和 `capabilities`。非图片尺寸为 `null`；Consumer 必须忽略 1.x 新增字段。消息 Envelope 另见 [JSON Schema](/schema/picker-message.schema.json)。

上传响应和新版 Picker 也会返回兼容增加的 [Asset Reference 1.0](/schema/asset-reference.schema.json)：包含版本指纹、下载 URL、可选稳定资产 ID、替代文本、响应式变体和 `embeddable` 能力；原 `entry` 不删除。

```js
import { openPicker } from '/sofinder/assets/sofinder-picker.js'

const entry = await openPicker({
  baseUrl: '/sofinder/browser',
  kind: 'image',
  resource: 'Images',
  path: 'articles/2026'
})
```

SDK 使用弹窗返回结果，并同时校验弹窗对象、Origin、协议版本和随机 Request ID；
不会使用通配符 `postMessage`。同源无需配置；跨域 Host 必须精确列入
`picker.allowed_origins`，Picker 服务端仍会执行登录、ACL 和图片格式验证。

## CKEditor 5

在应用中正常安装 CKEditor 5 和 Image Plugin，将编辑器实例交给 SoFinder：

```js
import { selectForCkeditor5 } from '/sofinder/assets/sofinder-picker.js'

button.addEventListener('click', () => selectForCkeditor5(editor, {
  baseUrl: '/sofinder/browser',
  resource: 'Images',
  language: 'zh-cn'
}))
```

适配器调用 CKEditor 5 公开的 `insertImage` 和替代文本 Command。开启资产目录后，Picker 与上传会保留显式的 `alt=""`，先按 `language`／`locale` 读取 `altTranslations`，再使用资产默认替代文本；仍未设置时才使用去掉扩展名的文件名。语言键采用规范化的 BCP 47 风格，例如 `en`、`zh-cn`、`fr-ca`，元数据 API 最多接受 20 种语言；上传适配器可传 `locale: 'zh-cn'`。同时会尽量写入响应式变体、宽高和 `data-sofinder-asset-id`。安装及授权要求请查看
[CKEditor 自托管官方指南](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/self-hosted/quick-start.html)。
原有 CKEditor 4 Callback 和 Quick Upload 接口继续保留。

本地选择、粘贴和桌面拖入使用独立官方上传 Adapter，不会把 CKEditor 打入 SoFinder 主包：

```js
import { createCkeditor5UploadPlugin } from '/sofinder/assets/sofinder-ckeditor5.js'

ClassicEditor.create(element, {
  extraPlugins: [createCkeditor5UploadPlugin({ apiBase: '/sofinder/api', csrfToken, resource: 'Images' })]
})
```

它与 TinyMCE、TipTap、Quill、Markdown 和普通表单入口共用 `sofinder-sdk.js` 上传任务，统一处理进度、取消、重试、分块恢复及同名文件选择。Private 资源没有稳定鉴权交付 URL 时会拒绝持久插入，临时签名 URL 不会被当成可嵌入地址。工厂返回的是可构造 CKEditor Plugin，请勿手动调用或再套一层 Plugin 包装。

## TinyMCE

在 `tinymce.init()` 前注册插件：

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

适配器通过 TinyMCE 公开 API 插入经过编码的 `<img>`。CDN Key 与自托管方式参见
[TinyMCE 官方部署文档](https://www.tiny.cloud/docs/tinymce/latest/editor-and-features/)。

直接上传请从 `sofinder-tinymce.js` 使用 `createTinyMceUploadIntegration(editor, options)`，并在 TinyMCE 的 `setup` 回调中创建。它会在图片节点生成后补齐 `alt`、宽高、`srcset` 和稳定资产 ID，而不是只保留上传 URL。

## TipTap 与 Quill

TipTap 安装 Image Extension 后调用：

```js
await selectForTiptap(editor, { baseUrl: '/sofinder/browser', resource: 'Images' })
```

Quill 在初始化含图片按钮的 Toolbar 后调用：

```js
registerQuill(quill, { baseUrl: '/sofinder/browser', resource: 'Images' })
```

## wangEditor 5

外部选择按钮使用公开节点 API，本地选择、粘贴和拖入则使用
`MENU_CONF.uploadImage.customUpload`：

```js
import { selectForWangEditor } from '/sofinder/assets/sofinder-picker.js'
import { createWangEditorUploadIntegration } from '/sofinder/assets/sofinder-wangeditor.js'

const editorConfig = {
  MENU_CONF: {
    uploadImage: createWangEditorUploadIntegration({
      apiBase: '/sofinder/api', csrfToken, resource: 'Images'
    })
  }
}

button.addEventListener('click', () => selectForWangEditor(editor, {
  baseUrl: '/sofinder/browser', resource: 'Images', language: 'zh-cn'
}))
```

如果希望 wangEditor 自带的图片按钮直接打开 SoFinder，可把
`createWangEditorPickerIntegration(options)` 配置到 `MENU_CONF.uploadImage`。
适配器遵循 wangEditor 5 公开的 `insertNode`、`customUpload` 和
`customBrowseAndUpload` 接口，不会把编辑器运行时打入 SoFinder。

## Jodit 4

把上传配置交给 Jodit，并用外部按钮打开素材选择器：

```js
import { selectForJodit } from '/sofinder/assets/sofinder-picker.js'
import { createJoditUploadIntegration } from '/sofinder/assets/sofinder-jodit.js'

const editor = Jodit.make('#editor', {
  uploader: createJoditUploadIntegration({
    apiBase: '/sofinder/api', csrfToken, resource: 'Images'
  })
})

button.addEventListener('click', () => selectForJodit(editor, {
  baseUrl: '/sofinder/browser', resource: 'Images', language: 'zh-cn'
}))
```

Jodit 自带的图片对话框、粘贴和拖入会使用公开的自定义上传接口；Picker 与上传均通过
`createInside.element()` 和 `s.insertImage()` 插入完整资产属性，不会将 Jodit 打入 SoFinder 包。

## 普通表单与 Markdown

普通输入框使用 `selectForInput(input, options)`；它会写入 URL 并触发可冒泡的
`input` 和 `change` 事件。文档使用 `kind: 'file'`，网页图片使用 `kind: 'image'`。

Markdown 编辑器使用 `selectForMarkdown(textarea, options)`，会在当前选择位置插入图片
`![name](<url>)` 或文件链接 `[name](<url>)`，并触发标准 `input`、`change` 事件。

## 项目内本地演示

启动 `examples/symfony`，用 `demo` / `demo` 登录后访问 `/integrations`。页面会用
本地 SoFinder 后端和 Picker SDK 实际连接 CKEditor 5、TinyMCE 8、TipTap、Quill 2、
wangEditor 5、Jodit 4 和普通表单。第三方编辑器从其文档所列 CDN 加载；部署前须检查各编辑器授权并替换
演示 Key。

目录深链接可以直接收藏：

```text
/sofinder/browser?uiMode=manager&type=Images&path=articles/2026
```

浏览器导航时会同步 `type` 和 `path`，这里保存的是逻辑路径，不会暴露服务端文件系统路径。
