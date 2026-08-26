---
title: Editor integrations
description: Connect SoFinder to CKEditor 5, TinyMCE, TipTap, Quill or a plain form through the picker SDK.
---

# Editor integrations

SoFinder ships `sofinder-picker.js` as a small framework-independent ES module.
Every integration uses the same picker URL and returns the same versioned entry
object; editor-specific code never calls private React APIs.

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
a wildcard `postMessage` target. The host route and popup must be same-origin;
authentication, resource ACLs and selection validation still run on the server.

## CKEditor 5

Keep CKEditor itself in the host application's build. Add a button using the
editor's normal UI system, then pass the editor instance to SoFinder:

```js
import { selectForCkeditor5 } from '/sofinder/assets/sofinder-picker.js'

button.addEventListener('click', () => selectForCkeditor5(editor, {
  baseUrl: '/sofinder/browser',
  resource: 'Images'
}))
```

The adapter executes CKEditor 5's public `insertImage` command. Configure its
Image plugin and follow the [official installation and licensing guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/cloud/quick-start.html).
The legacy CKEditor 4 callback and quick-upload endpoints remain available.

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
