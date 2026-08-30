---
title: File manager user guide
description: Learn how to browse, upload, organize, search, download and recover files with the SoFinder browser.
---

# File manager user guide

This guide is for people using an installed SoFinder browser. Administrators decide which resources, file types and operations you can access, so a button may be hidden or disabled when the current resource is read-only or your role lacks permission.

## Understand the workspace

- **Resources** appear in the left panel. A resource is an independent storage area such as Files, Images or a remote S3 bucket.
- **Breadcrumbs** above the file list show the current folder. Select a segment to return to that level.
- **Search** filters the current folder by name. If tag support is enabled, change the search scope from Name to Tags; comma-separated tag terms must all match.
- **Grid/List** changes the presentation without changing files.
- The **More** menu contains language, sorting, refresh, Settings and the recycle bin.
- Selecting an item opens the **Details** panel with type, size, location, modification time, image dimensions and available links.

The browser remembers language, view, interface size, panel widths and optional-feature preferences on the current device. Settings provide separate Small, Medium and Large bounds for grid cards and list rows. In list view, drag a header divider to resize a column within its safe minimum and maximum; double-click the divider to fit that column to its content. The widths are also remembered on this device.

## Navigate and select

- Select a folder once to inspect it and twice to open it. Select a file once to show details; double-clicking a selectable file chooses it in picker integrations.
- Use `Ctrl`/`Cmd` + click to add or remove individual items from the selection.
- Use `Shift` + click to select a continuous range.
- Use `Ctrl`/`Cmd` + `A` to select or clear every item on the current page, and `Escape` to clear the selection.
- Arrow keys move the active selection, `Enter` opens it, `F2` renames one selected item, and `Delete` starts deletion.
- Right-click an item, or long-press it on a touch screen, to open Preview/Open, Download, Rename, Copy, Move and Delete actions.

Selections apply only to the current page. A directory may be paginated, so verify the selection count before a batch operation.

## Create folders and rename items

Select **New folder**, enter a name and confirm. Folder depth and name length are controlled by the resource. If the button is disabled, the resource may be read-only, you may lack `create_folder`, or the configured maximum depth has been reached.

Select exactly one item and choose **Rename**, or press `F2`. For files, SoFinder keeps the extension outside the editable base name so it is not changed accidentally. The server validates the final Unicode name, extension, path and permissions again.

Names cannot start with a dot, end with a dot or space, contain control or bidirectional text characters, use `< > : " / \\ | ? *`, or equal a reserved Windows device name such as `CON` or `LPT1`. The same checks apply to crop copies, automatic copy/move names and recycle-bin restores.

## Upload files

You can upload by:

1. selecting **Upload** and choosing one or more files;
2. dragging files from the desktop onto the browser;
3. dropping files directly on a folder to upload into that folder; or
4. pasting a copied image or file while manager mode has focus.

The upload panel shows queued, active, completed, failed and cancelled files. Up to three files upload concurrently. Files larger than 5 MB use 4 MB chunks. If the page is interrupted, select the same local file again within 24 hours to resume the saved session. You can cancel one upload, cancel all active uploads, remove a task or clear finished tasks.

If a destination already contains the same file name, SoFinder asks before overwriting it. An upload can still fail because of the host's PHP/web-server limit, the resource size or quota limit, a denied extension/MIME type, unsafe active content, invalid image data, name length or permissions. The upload panel keeps the server's exact error message.

## Copy and move

Select one or more entries, then choose **Copy** or **Move**. Browse the destination dialog and select **Copy here** or **Move here**. SoFinder prevents moving an item into its current parent, moving a folder into itself or a descendant, and exceeding the destination depth.

Batch transfers use conflict-safe automatic names by default. Generated names are rechecked against the destination resource's name length and extension policy. Each item is authorized separately; the completion message shows successful and failed counts rather than hiding partial failures.

## Download and share

For one file, use Download from the details panel, preview dialog or context menu. The download opens in a new browser tab or window. A private proxy resource downloads through an authenticated SoFinder URL. A public resource may expose its configured public/CDN URL.

When **Download ZIP** is enabled, select one or more files or folders and choose it from the action bar. ZIP generation is bounded by the administrator's selection, entry and byte limits. It requires ZIP support on the server.

The details panel presents **Download** and **Share** as two clear actions. Share groups **Copy URL** and the optional **QR Code** in one dialog. QR Code is disabled by default in each user's settings, generated entirely in the browser, and never sends the URL to an external QR service. Login requirements and signed-link expiration remain visible and still apply; sharing does not turn a private URL into a public one.

## Delete and restore

Select entries and choose **Delete**. Read the confirmation carefully:

- Local resources normally move entries to a private recycle bin.
- A remote adapter may report that deletion is permanent; the confirmation explicitly warns when recovery is unavailable.
- The recycle bin can automatically purge its oldest entries to enforce item and byte limits.

Open **More → Recycle bin** to search deleted entries, review expiration and usage, restore, or permanently delete. If the original name now exists, choose automatic rename or overwrite. Overwrite requires separate permission. A missing original parent folder must be recreated before restore.

## Search, sort and personal metadata

Name search applies to the current folder and waits briefly while you type. Sort by name, size, type or modification date and reverse the direction from **More**. The same menu can filter the current page by a bounded set of file types and group it by name, type, size, date or tag. Some remote adapters do not support server-side search or sorting; those controls are disabled.

The pagination bar accepts a typed page size or a common value from its suggestion list. The allowed range is 10–500 files per page; changing it returns to the first page and the browser remembers the choice.

The **Preference profiles** section saves the current tools, optional features, list columns, grid/list sizes, folder-navigation position, Quick access scope, interface scale and same-name upload strategy as a named profile. Up to 10 profiles are stored in the current browser; saving the same name updates it, and applying a profile changes the interface immediately. **Restore system defaults** resets the complete preference set, including panel and list-column widths; it is separate from layout presets.

Settings can also enable:

- **Recent**: records recently selected paths for your account.
- **Favorite files**: marks files only and lists up to eight shortcuts in the sidebar. The heading links to a dedicated, searchable page at `collection=favorites`, where every saved file can be opened or removed.
- **Pinned folders**: operates independently from Favorites and accepts folders only. It shows folders from all storage roots by default, can be limited to the current root, marks stale folders, and supports opening or right-click removal. Its sidebar display remains bounded to 12 folders.
- **Sidebar layout**: drag the six-dot handle on Pinned folders, Favorite files, Recent or Folder navigation to move it between the left and right sidebars or change its order. The arrangement is saved in the current browser. Focus a handle and use the arrow keys as a keyboard alternative.
- **Tags**: assigns up to 10 tags, each 1–30 visible characters. In tag search, separate terms with `,` or `，`; every term must match at least one tag.
- **Folder navigation**, which can be placed in the left or right sidebar per user, plus **Download ZIP** and **Recycle bin** controls.

Metadata is private to the authenticated actor unless the host application replaces that policy.

The **Select** menu groups Select all, Clear and Invert selection. These operations apply to the currently visible, filtered page. List columns keep bounded widths, can be dragged at their separators, and auto-fit on double-click; long values are truncated without expanding the layout.

## Manager mode and picker mode

Manager mode provides creation, upload, rename, copy, move, delete and image tools. Picker mode is used by editors such as CKEditor: choose one file and press **Select**. Folders and entries without a usable URL cannot be selected. Image pickers accept only browser-embeddable image formats.

For image editing, continue with [managing images](/image-guide). For editor workflows, see [CKEditor 4 user guide](/ckeditor4).

## Folder upload, batch rename and verification

**Upload folder** preserves the selected folder's relative structure, creates validated parent folders, respects the configured depth and accepts at most 500 files per selection. Select two or more entries and choose **Batch rename** to preview a `{name}`, `{n}`, `{ext}` pattern before applying it. Extensions remain locked and every result is reported separately.

Preview supports images and bounded UTF-8 text/JSON/XML/YAML content. The preview details can calculate SHA-256 for files up to 512 MiB; select the displayed value to copy it when verifying a transfer.

## When an action is unavailable

Common reasons are read-only storage, an operation role or path ACL, unsupported adapter capability, resource quota, folder depth, missing GD/Imagick support, or picker mode. Refresh after an administrator changes permissions. If a failure persists, give support the resource name, visible path, action and exact message—never send private file contents, credentials or signed URLs.
