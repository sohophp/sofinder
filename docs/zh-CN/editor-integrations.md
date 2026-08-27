---
title: 主流编辑器集成
description: 通过通用 Picker SDK 连接 CKEditor 5、TinyMCE、TipTap、Quill 和普通表单。
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
  resource: 'Images'
}))
```

适配器调用 CKEditor 5 公开的 `insertImage` 和替代文本 Command。开启资产目录后，Picker 与上传会保留显式的 `alt=""`，优先使用资产默认替代文本；未设置时才使用去掉扩展名的文件名，并尽量写入响应式变体、宽高和 `data-sofinder-asset-id`。安装及授权要求请查看
[CKEditor 官方指南](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/cloud/quick-start.html)。
原有 CKEditor 4 Callback 和 Quick Upload 接口继续保留。

本地选择、粘贴和桌面拖入使用独立官方上传 Adapter，不会把 CKEditor 打入 SoFinder 主包：

```js
import { createCkeditor5UploadPlugin } from '/sofinder/assets/sofinder-ckeditor5.js'

ClassicEditor.create(element, {
  extraPlugins: [createCkeditor5UploadPlugin({ apiBase: '/sofinder/api', csrfToken, resource: 'Images' })]
})
```

它与 TinyMCE、TipTap、Quill、Markdown 和普通表单入口共用 `sofinder-sdk.js` 上传任务，统一处理进度、取消、重试、分块恢复及同名文件选择。Private 资源没有稳定鉴权交付 URL 时会拒绝持久插入，临时签名 URL 不会被当成可嵌入地址。

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

## TipTap、Quill 与普通表单

TipTap 安装 Image Extension 后调用：

```js
await selectForTiptap(editor, { baseUrl: '/sofinder/browser', resource: 'Images' })
```

Quill 在初始化含图片按钮的 Toolbar 后调用：

```js
registerQuill(quill, { baseUrl: '/sofinder/browser', resource: 'Images' })
```

普通输入框使用 `selectForInput(input, options)`；它会写入 URL 并触发可冒泡的
`input` 和 `change` 事件。文档使用 `kind: 'file'`，网页图片使用 `kind: 'image'`。

Markdown 编辑器使用 `selectForMarkdown(textarea, options)`，会在当前选择位置插入图片
`![name](<url>)` 或文件链接 `[name](<url>)`，并触发标准 `input`、`change` 事件。

## 项目内本地演示

启动 `examples/symfony`，用 `demo` / `demo` 登录后访问 `/integrations`。页面会用
本地 SoFinder 后端和 Picker SDK 实际连接 CKEditor 5、TinyMCE 8、TipTap、Quill 2
和普通表单。第三方编辑器从其文档所列 CDN 加载；部署前须检查各编辑器授权并替换
演示 Key。

目录深链接可以直接收藏：

```text
/sofinder/browser?uiMode=manager&type=Images&path=articles/2026
```

浏览器导航时会同步 `type` 和 `path`，这里保存的是逻辑路径，不会暴露服务端文件系统路径。
