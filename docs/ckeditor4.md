---
title: CKEditor 4 guide
description: Configure and use SoFinder file browsing, image selection and quick uploads with CKEditor 4.
---

# CKEditor 4 guide

SoFinder supports the CKEditor 4 file-browser callback protocol and its quick-upload response. The browser opens in picker mode, while quick upload sends the chosen local file directly to the current SoFinder resource.

## Administrator configuration

The route examples below assume SoFinder is imported at `/sofinder`. Make the CSRF token available to the editor page using the host application's normal templating mechanism; do not hard-code it in JavaScript bundles.

```javascript
CKEDITOR.replace("editor", {
  filebrowserBrowseUrl: "/sofinder/browser?type=Files&selection=file",
  filebrowserImageBrowseUrl: "/sofinder/browser?type=Images&selection=image",
  filebrowserUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Files&selection=file&_token="
    + encodeURIComponent(soFinderCsrfToken),
  filebrowserImageUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Images&selection=image&_token="
    + encodeURIComponent(soFinderCsrfToken)
});
```

CKEditor appends `CKEditorFuncNum` to browser and legacy upload requests. SoFinder returns the selected entry through `CKEDITOR.tools.callFunction`. The browser also accepts `select=1`; `type` selects the initial resource, and `selection=image|file` controls picker validation.

The host route must be protected by the same-origin Symfony session and firewall. Quick upload requires `_token` because CKEditor 4 cannot set SoFinder's JSON API header. Origin/Referer checks are additional protections, not substitutes for CSRF validation.

## Browse and insert an existing file

1. In CKEditor, open the Link dialog for a file or Image dialog for an image.
2. Choose **Browse Server**.
3. Navigate resources and folders in SoFinder. Search, sort, grid/list and preview remain available.
4. Select one file. In image mode, SoFinder accepts only a web-embeddable image with a usable URL.
5. Press **Select**. SoFinder calls the CKEditor callback, fills the URL field and closes the picker window.
6. Complete the CKEditor dialog. For images, review alternative text, size and alignment before confirming.

Picker mode intentionally hides manager mutations. If users must upload or edit before selecting, provide a separate authorized manager entry or use CKEditor's Upload tab.

## Quick upload from CKEditor

1. Open the Link or Image dialog and switch to **Upload**.
2. Choose a local file and send it to the server.
3. SoFinder validates and stores it in the configured resource, then returns its entry URL.
4. CKEditor switches to the URL information and allows the user to finish insertion.

The field name must be `upload`. `currentFolder` may be added to the upload URL to target a fixed normalized folder. A name conflict is not overwritten silently. Image quick upload rejects HEIC, HEIF, TIFF and any format that the current server cannot embed in a browser.

Modern CKEditor upload integrations may request JSON with `responseType=json` or `Accept: application/json`. Success is:

```json
{"uploaded":1,"fileName":"photo.jpg","url":"https://cdn.example.com/images/photo.jpg"}
```

Failure is:

```json
{"uploaded":0,"error":{"code":"image_not_web_embeddable","message":"This image format cannot be embedded directly in a web page."}}
```

## Choosing the correct delivery model

- Use a public/CDN URL when inserted content must be visible without the editor's authenticated session.
- Use a host-owned `entry_url` route when the application needs stable IDs, download tracking or its own access checks.
- A SoFinder proxy URL requires authentication. It is appropriate for private intranet content, but not for public articles or email HTML unless every viewer can authenticate.

Never expose a private storage root through a web-server alias merely to make editor URLs public.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Browse Server does not open | Browser URL, popup policy, imported route prefix and authenticated firewall. |
| Selecting does nothing | `CKEditorFuncNum`, same-origin opener/parent and CKEditor 4 being available in that window. |
| Upload returns 403 | `_token`, authenticated session, Origin/Referer and resource operation roles. |
| Upload returns 415 | Extension/MIME allowlists, decoded image support and `selection=image`. |
| URL works for editors only | The resource returned a proxy or protected host URL; review delivery design. |
| Image cannot be selected | It is not web-embeddable, has no entry URL, or the runtime cannot decode it. |

Administrators should also review [Symfony integration](/symfony), [production security](/security) and [image formats](/image-formats).
