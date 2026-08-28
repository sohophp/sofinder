---
title: Editor integrations
description: Connect SoFinder to CKEditor 5, TinyMCE, TipTap, Quill or a plain form through the picker SDK.
---

# Editor integrations

SoFinder ships `sofinder-picker.js` as a small framework-independent ES module.
Every integration uses the same picker URL and returns the same versioned entry
object; editor-specific code never calls private React APIs.

The resolved object follows the published [picker entry JSON Schema](/schema/picker-entry.schema.json) and always includes `resource`, `path`, `name`, `url`, `mimeType`, `size`, `modifiedAt`, `width`, `height` and `capabilities`. Dimensions are `null` for non-images. Consumers must ignore additional 1.x fields. The message envelope has its own [JSON Schema](/schema/picker-message.schema.json).

Upload responses and new picker consumers can use the additive [Asset Reference
1.0 Schema](/schema/asset-reference.schema.json). It adds a version fingerprint,
download URL, optional stable asset ID, alternative text, responsive variants
and explicit `embeddable` capability without removing the legacy `entry`.

```js
import { openPicker } from '/sofinder/assets/sofinder-picker.js'

const entry = await openPicker({
  baseUrl: '/sofinder/browser',
  kind: 'image',
  resource: 'Images',
  path: 'articles/2026'
})
```

The picker opens as a popup. Results are accepted only when the popup window,
origin, protocol version and random request ID all match. SoFinder does not use
a wildcard `postMessage` target. Same-origin works without configuration. A
cross-origin host must be listed exactly in `picker.allowed_origins`; login,
resource ACLs and selection validation still run on the picker server.

## CKEditor 5

Keep CKEditor itself in the host application's build. Add a button using the
editor's normal UI system, then pass the editor instance to SoFinder:

```js
import { selectForCkeditor5 } from '/sofinder/assets/sofinder-picker.js'

button.addEventListener('click', () => selectForCkeditor5(editor, {
  baseUrl: '/sofinder/browser',
  resource: 'Images',
  language: 'en'
}))
```

The adapter executes CKEditor 5's public `insertImage` and alternative-text commands. When the asset catalog is enabled, picker and upload insertion preserve explicit `alt=""`, resolve `altTranslations` for `language`/`locale`, use the asset default alt next, and otherwise fall back to the extension-free filename. Translation keys are normalized BCP 47-style tags such as `en`, `zh-cn` and `fr-ca`; the metadata API accepts up to 20. Pass `locale: 'en'` to an upload adapter. Responsive variants, dimensions and `data-sofinder-asset-id` are also carried where the editor model supports them. Configure its
Image plugin and follow the [official self-hosted installation and licensing guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/self-hosted/quick-start.html).
The legacy CKEditor 4 callback and quick-upload endpoints remain available.

For local selection, paste and desktop drop uploads, install the official
adapter without bundling CKEditor into SoFinder:

```js
import { createCkeditor5UploadPlugin } from '/sofinder/assets/sofinder-ckeditor5.js'

ClassicEditor.create(element, {
  extraPlugins: [createCkeditor5UploadPlugin({
    apiBase: '/sofinder/api', csrfToken, resource: 'Images'
  })]
})
```

The adapter uses the public CKEditor UploadAdapter contract and the shared
`sofinder-sdk.js` upload task. Upload progress, abort, retry, whole/chunked
transfer and `ask|rename|overwrite|skip` conflicts therefore behave the same in
every editor. A Private resource is rejected unless it has a stable,
authorization-preserving delivery URL; a temporary signed URL is never treated
as embeddable content. The returned value is a constructible CKEditor plugin;
do not invoke it manually or wrap it in another plugin class.

## TinyMCE

Register the SoFinder plugin before `tinymce.init()` and add `sofinder` to the
plugin and toolbar lists:

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

The adapter inserts an encoded `<img>` element through TinyMCE's public API.
See the [TinyMCE deployment guide](https://www.tiny.cloud/docs/tinymce/latest/editor-and-features/)
for CDN keys or self-hosting.

Direct upload adapters are separate ESM entries:

```js
import { createTinyMceUploadIntegration } from '/sofinder/assets/sofinder-tinymce.js'
// TipTap: sofinder-tiptap.js; Quill: sofinder-quill.js
```

Create the TinyMCE integration in its `setup` callback and forward
`images_upload_handler` to it. This lets the bridge apply the full asset
attributes after TinyMCE creates the image node instead of losing everything
except the URL.

All accept `apiBase`, `csrfToken`, `resource`, optional dynamic `path`, conflict
strategy, default-alt callback, task observer and error callback. The generic
Markdown and form bindings are exported by `sofinder-editors.js`.

## TipTap and Quill

TipTap requires its Image extension:

```js
import { selectForTiptap } from '/sofinder/assets/sofinder-picker.js'

await selectForTiptap(editor, {
  baseUrl: '/sofinder/browser',
  resource: 'Images'
})
```

For Quill, initialize a toolbar containing the image action, then replace that
handler:

```js
import { registerQuill } from '/sofinder/assets/sofinder-picker.js'

registerQuill(quill, {
  baseUrl: '/sofinder/browser',
  resource: 'Images'
})
```

## Plain forms

`selectForInput(input, options)` writes the selected URL and emits bubbling
`input` and `change` events. Use `kind: 'file'` for documents or `kind: 'image'`
for browser-embeddable images.

## Markdown editors

`selectForMarkdown(textarea, options)` inserts at the current selection. Image
selections use `![name](<url>)`; other files use `[name](<url>)`. It emits normal
`input` and `change` events and does not depend on one Markdown editor.

## Local integration matrix

Run the project under `examples/symfony`, sign in with `demo` / `demo`, then
open `/integrations`. It exercises CKEditor 5, TinyMCE 8, TipTap, Quill 2 and a
plain input against the local SoFinder checkout. Third-party editors load from
their documented CDN endpoints; the picker SDK and backend remain local. Review
each editor's license and replace demonstration keys before deployment.

Deep links use `type` and `path`, for example:

```text
/sofinder/browser?uiMode=manager&type=Images&path=articles/2026
```

The browser keeps these parameters synchronized as users navigate, so a current
folder can be bookmarked or copied without exposing a filesystem path.
