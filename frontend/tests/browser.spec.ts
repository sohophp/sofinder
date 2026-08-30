import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";

const config = {
  apiBase: "/sofinder/api/config",
  csrfToken: "test-token",
  language: "zh-cn",
  resource: "Files",
  initialPath: "",
  selectMode: false,
  selectionKind: "any",
  ckeditorFunction: 0,
  pickerRequestId: "",
  pickerOrigin: "",
  theme: { accent: "#276ef1", background: "#f4f6f9", panel: "#ffffff", text: "#1c2735", muted: "#667282", danger: "#c13a43", radius: "10px" },
  featureDefaults: { folderTree: false },
  uiDefaults: { scale: "standard" as const, mode: "manager" as const, header: true, logo: true, search: true, languageSwitcher: true, viewSwitcher: true },
};

test.beforeEach(async ({ page }) => {
  await page.route("http://sofinder.test/**", async route => {
    const url = new URL(route.request().url());
    const asset = resolve(import.meta.dirname, "../../dist", url.pathname.slice(1));
    if (/^\/[A-Za-z0-9._-]+\.js$/.test(url.pathname) && existsSync(asset)) {
      await route.fulfill({ contentType: "text/javascript; charset=UTF-8", body: readFileSync(asset) });
      return;
    }
    if (url.pathname === "/sofinder/api/config") {
      await route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/uploads/editor/files", allowedExtensions: ["txt", "png", "heic", "pdf"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: [{ name: "document-preview", version: "1.0.0", capabilities: ["preview.pdf"], previewers: [{ id: "pdf", mimeTypes: ["application/pdf"], extensions: ["pdf"], url: "/sofinder/api/preview/document" }] }], imagePresets: {}, imageCapabilities: { driver: "auto", formats: [{ format: "png", extensions: ["png"], mimes: ["image/png"], processor: "gd", read: true, edit: true, thumbnail: true, webEmbeddable: true }] } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/security/status") {
      await route.fulfill({ json: { success: true, data: { malwareScanning: { enabled: false, provider: null, status: "disabled", message: "Malware scanning is not enabled.", counts: { passed: 0, quarantined: 0, failed: 0, pending: 0 }, recent: [] }, documentPreview: { pdfEnabled: true, officeEnabled: true, available: true, binary: "/usr/bin/libreoffice", version: "LibreOffice 25.2", cacheWritable: true, cacheCount: 3, lastSuccessfulAt: 1, configuredMode: "auto", effectiveMode: "inline", queueAvailable: false, counts: { queued: 0, running: 0, ready: 2, failed: 0, expired: 0 } } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/metadata") {
      await route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: [], quickAccessEntries: [], tags: {}, recent: [] } } });
      return;
    }
    if (url.pathname === "/sofinder/api/entries") {
      if (url.searchParams.get("cursor") === "page-2") {
        await route.fulfill({ json: { success: true, data: { entries: [{ path: "later.txt", name: "later.txt", directory: false, size: 9, modifiedAt: 4, mimeType: "text/plain", url: "/uploads/editor/files/later.txt", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } }], total: null, path: "", offset: 100, limit: 100, nextCursor: null, sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
        return;
      }
      await route.fulfill({ json: { success: true, data: { entries: [
        { path: "guide.txt", name: "guide.txt", directory: false, size: 12, modifiedAt: 1, mimeType: "text/plain", url: "/uploads/editor/files/guide.txt", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
        { path: "photo.png", name: "photo.png", directory: false, size: 68, modifiedAt: 2, mimeType: "image/png", url: "/uploads/editor/files/photo.png", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
        { path: "camera.heic", name: "camera.heic", directory: false, size: 80, modifiedAt: 3, mimeType: "image/heic", url: "/uploads/editor/files/camera.heic", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
        { path: "manual.pdf", name: "manual.pdf", directory: false, size: 90, modifiedAt: 4, mimeType: "application/pdf", url: "/uploads/editor/files/manual.pdf", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
      ], total: null, path: "", offset: 0, limit: 100, nextCursor: "page-2", sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/images/info") {
      await route.fulfill({ json: { success: true, data: { width: 1200, height: 400, format: "png", mimeType: "image/png", editable: true } } });
      return;
    }
    if (url.pathname === "/sofinder/api/preview/text") {
      await route.fulfill({ json: { success: true, data: { content: "SoFinder local preview", truncated: false, mimeType: "text/plain", size: 22 } } });
      return;
    }
    if (url.pathname === "/sofinder/api/preview/document") {
      await route.fulfill({ contentType: "application/pdf", body: Buffer.from("%PDF-1.4\n% SoFinder preview\n") });
      return;
    }
    if (url.pathname === "/sofinder/api/preview/document/jobs" && route.request().method() === "POST") {
      const body = route.request().postDataJSON() as { resource: string; path: string };
      await route.fulfill({ json: { success: true, data: { id: "", status: "ready", retryAfter: 0, error: null, source: "pdf", key: "a".repeat(64), resource: body.resource, path: body.path, previewUrl: `/sofinder/api/preview/document?resource=${encodeURIComponent(body.resource)}&path=${encodeURIComponent(body.path)}` } } });
      return;
    }
    if (url.pathname === "/sofinder/api/checksum") {
      await route.fulfill({ json: { success: true, data: { algorithm: "sha256", checksum: "a".repeat(64), size: 12 } } });
      return;
    }
    if (url.pathname === "/sofinder/api/entries/batch-rename" && route.request().method() === "POST") {
      await route.fulfill({ json: { success: true, data: { operation: "rename", total: 2, succeeded: 2, failed: 0, purgedItems: 0, purgedBytes: 0, results: [] } } });
      return;
    }
    if (url.pathname === "/sofinder/api/images/edit" && route.request().method() === "PATCH") {
      await route.fulfill({ json: { success: true, data: { entry: { path: "photo-edited-1.png", name: "photo-edited-1.png", directory: false, size: 64, modifiedAt: 5, mimeType: "image/png", url: "/uploads/editor/files/photo-edited-1.png", capabilities: {} }, original: { width: 1200, height: 400, size: 68 }, result: { width: 1000, height: 340, size: 64 } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/trash" && route.request().method() === "GET") {
      await route.fulfill({ json: { success: true, data: { items: [{ id: "1234567890abcdef1234567890abcdef", resource: "Files", path: "guide.txt", directory: false, size: 12, deletedAt: 1, expiresAt: 9999999999 }], total: 1, offset: 0, limit: 50, usedItems: 1, usedBytes: 12, maxItems: 1000, maxBytes: 1000000 } } });
      return;
    }
    if (/\/sofinder\/api\/trash\/[a-f0-9]{32}\/restore/.test(url.pathname)) {
      const body = route.request().postDataJSON() as { conflict: string };
      if (body.conflict === "cancel") await route.fulfill({ status: 409, json: { success: false, error: { code: "conflict", message: "Conflict" } } });
      else await route.fulfill({ json: { success: true, data: { entry: { path: "guide (1).txt", name: "guide (1).txt", directory: false, size: 12, modifiedAt: 3, mimeType: "text/plain", url: "/uploads/editor/files/guide%20(1).txt", capabilities: {} } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/content") {
      await route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><rect width="1200" height="400" fill="#dce8f8"/></svg>' });
      return;
    }
    if (url.pathname === "/sofinder/api/images/thumbnail") {
      if (url.searchParams.get("path") === "photo.png") {
        await route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="800"><rect width="100" height="800" fill="#749b72"/></svg>' });
        return;
      }
      await route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
      return;
    }
    await route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>SoFinder test</title>" });
  });
  await page.goto("http://sofinder.test/");
  await page.evaluate(() => localStorage.setItem("sofinder.tools.v3", JSON.stringify({ resize: false, crop: true, rotate: false, presets: false, process: false, batchRename: false })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();
});

test("shows and copies an absolute public file URL", async ({ page }) => {
  await page.waitForTimeout(400);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => undefined } }));
  await page.getByText("guide.txt").first().click();
  await expect(page.locator(".sf-details time")).toHaveAttribute("datetime", "1970-01-01T00:00:01.000Z");
  await page.getByRole("button", { name: "分享" }).click();
  const dialog = page.getByRole("dialog", { name: "分享" });
  const url = dialog.getByRole("textbox", { name: "复制网址" });
  await expect(url).toHaveValue("http://sofinder.test/uploads/editor/files/guide.txt");
  await dialog.getByRole("button", { name: "复制网址" }).click();
  await expect(dialog.getByRole("status")).toContainText("网址已复制");
});

test("searches authorized assets across folders and reopens a result", async ({ page }) => {
  await page.route("**/sofinder/api/config", route => route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/files", allowedExtensions: ["jpg", "pdf"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 100, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "", formats: [] }, assetSearch: { enabled: true } } } }));
  await page.route("**/sofinder/api/assets/search?*", route => route.fulfill({ json: { success: true, data: { items: [{ resource: "Files", entry: { path: "campaign/sunset.jpg", name: "sunset.jpg", directory: false, size: 512, modifiedAt: 20, mimeType: "image/jpeg", url: "/files/campaign/sunset.jpg", capabilities: { read: true } }, assetId: null, metadata: { alt: "Golden sunset", altTranslations: { "zh-cn": "金色日落" }, title: "Autumn campaign", tags: ["campaign"], version: 1, updatedAt: 20 } }], total: 1, offset: 0, limit: 50, scanned: 12, truncated: false, facets: { resources: { Files: 1 }, types: { image: 1 }, extensions: { jpg: 1 } } } } }));
  await page.route("**/sofinder/api/entries?*", route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("path") !== "campaign") return route.fallback();
    return route.fulfill({ json: { success: true, data: { entries: [{ path: "campaign/sunset.jpg", name: "sunset.jpg", directory: false, size: 512, modifiedAt: 20, mimeType: "image/jpeg", url: "/files/campaign/sunset.jpg", capabilities: { read: true } }], total: 1, path: "campaign", offset: 0, limit: 100, nextCursor: null, sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await page.getByRole("button", { name: "高级资产搜索" }).click();
  const dialog = page.getByRole("dialog", { name: "高级资产搜索" });
  await dialog.getByRole("textbox", { name: "关键词" }).fill("金色日落");
  await dialog.getByRole("button", { name: "搜索文件", exact: true }).click();
  await expect(dialog.getByRole("button", { name: /sunset\.jpg/ })).toBeVisible();
  await expect(dialog.getByText(/已检查 12/)).toBeVisible();
  await dialog.getByRole("button", { name: /sunset\.jpg/ }).click();
  await expect(page).toHaveURL(/path=campaign/);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.assetSearch.recent.v1") || "[]").length)).toBe(1);
});

test("warns before deleting an asset that has registered usages", async ({ page }) => {
  await page.route("**/sofinder/api/config", route => route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/uploads/editor/files", allowedExtensions: ["txt", "png"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "", formats: [] }, assetUsage: { enabled: true } } } }));
  await page.route("**/sofinder/api/assets/delete-check", route => route.fulfill({ json: { success: true, data: { safe: false, total: 2, assets: [{ assetId: "00000000-0000-4000-8000-000000000001", path: "guide.txt", total: 2, usages: [{ referenceId: "article:1", label: "首页文章", url: "/admin/article/1", context: "body", updatedAt: 1 }, { referenceId: "article:2", label: "帮助页面", url: null, context: null, updatedAt: 1 }] }] } } }));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  const guide = page.locator(".sf-entry", { hasText: "guide.txt" }); await guide.click(); await guide.click({ button: "right" });
  await page.getByRole("menuitem", { name: "删除" }).click();
  const dialog = page.getByRole("dialog", { name: "删除" });
  await expect(dialog).toContainText("2 条使用记录"); await expect(dialog).toContainText("首页文章");
});

test("edits image alternative text from the context, details and preview surfaces", async ({ page }) => {
  const assetId = "00000000-0000-4000-8000-000000000001";
  let savedAlt: string | null = null;
  let savedTranslations: Record<string, string> = {};
  await page.route("**/sofinder/api/config", route => route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/files", allowedExtensions: ["png"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 68, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "gd", formats: [{ format: "png", extensions: ["png"], mimes: ["image/png"], processor: "gd", read: true, edit: true, thumbnail: true, webEmbeddable: true }] }, assetCatalog: { enabled: true, altLocales: ["en", "zh-cn", "zh-tw", "fr-ca"] }, assetUsage: { enabled: true }, imageVariants: { enabled: true } } } }));
  await page.route("**/sofinder/api/entries?*", route => route.fulfill({ json: { success: true, data: { entries: [{ path: "photo.png", name: "photo.png", directory: false, size: 68, modifiedAt: 2, mimeType: "image/png", url: "/files/photo.png", capabilities: { read: true, "metadata.update": true } }], total: 1, path: "", offset: 0, limit: 100, nextCursor: null, sort: "name", direction: "asc", capabilities: {} } } }));
  const asset = { schemaVersion: "1.0", assetId, resource: "Files", path: "photo.png", name: "photo.png", directory: false, mimeType: "image/png", size: 68, modifiedAt: 2, version: "2-68", url: "/files/photo.png", downloadUrl: "/sofinder/api/download?resource=Files&path=photo.png", width: 1200, height: 400, alt: "A campaign photo", variants: [{ width: 320, height: 107, url: "/sofinder/api/images/variant?width=320", mimeType: "image/webp" }], capabilities: { embeddable: true, responsiveImages: true, assetMetadata: true, "metadata.update": true } };
  await page.route("**/sofinder/api/assets/resolve?*", route => route.fulfill({ json: { success: true, data: { asset } } }));
  await page.route(`**/sofinder/api/assets/${assetId}**`, async route => {
    if (new URL(route.request().url()).pathname.endsWith("/usages")) { await route.fulfill({ json: { success: true, data: { items: [{ referenceId: "article:42", label: "首页文章", url: "/admin/articles/42", context: "hero", updatedAt: 3 }], total: 1 } } }); return; }
    if (route.request().method() === "PATCH") {
      const body = route.request().postDataJSON() as { alt: string | null; altTranslations: Record<string, string> };
      savedAlt = body.alt;
      savedTranslations = body.altTranslations;
      await route.fulfill({ json: { success: true, data: { metadata: { alt: body.alt, altTranslations: body.altTranslations, title: null, tags: [], version: 2, updatedAt: 3 } } } });
      return;
    }
    await route.fulfill({ json: { success: true, data: { asset, metadata: { alt: asset.alt, title: null, tags: [], version: 1, updatedAt: 2 } } } });
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const photo = page.locator(".sf-entry", { hasText: "photo.png" });
  await expect(photo).toBeVisible();
  await photo.click();
  await expect(page.locator(".sf-details-tabs").getByRole("button", { name: "资产元数据" })).toBeVisible();
  await page.locator(".sf-details-tabs").getByRole("button", { name: "资产元数据" }).click();
  await expect(page.locator(".sf-asset-properties").getByRole("textbox", { name: "默认替代文本" })).toHaveValue("A campaign photo");
  await expect(page.locator(".sf-property-usages")).toContainText("首页文章");
  await page.locator(".sf-details-tabs").getByRole("button", { name: "信息" }).click();
  await photo.click({ button: "right" });
  await page.getByRole("menuitem", { name: "资产元数据" }).click();
  const dialog = page.getByRole("dialog", { name: "资产元数据" });
  await expect(dialog.getByRole("textbox", { name: "默认替代文本" })).toHaveValue("A campaign photo");
  await expect(dialog.locator(".sf-asset-decorative")).toHaveCSS("display", "flex");
  await expect(dialog.locator(".sf-modal-actions")).toHaveCSS("justify-content", "flex-end");
  expect((await dialog.getByRole("textbox", { name: "默认替代文本" }).boundingBox())?.height).toBeGreaterThanOrEqual(38);
  const language = dialog.getByRole("combobox", { name: "语言" });
  await language.selectOption("zh-cn");
  await dialog.getByRole("button", { name: "添加语言" }).click();
  await dialog.getByRole("textbox", { name: "简体中文" }).fill("活动照片");
  await language.selectOption("fr-ca");
  await dialog.getByRole("button", { name: "添加语言" }).click();
  await dialog.getByRole("textbox", { name: "fr-ca" }).fill("Photo de campagne");
  await dialog.getByRole("checkbox", { name: /装饰性图片/ }).check();
  await dialog.getByRole("button", { name: "保存" }).click();
  await expect.poll(() => savedAlt).toBe("");
  await expect.poll(() => savedTranslations).toEqual({ "zh-cn": "活动照片", "fr-ca": "Photo de campagne" });

  await photo.click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  await expect(page.getByRole("dialog", { name: "photo.png" }).getByRole("button", { name: "资产元数据" })).toBeVisible();
});

test("shows trusted Workspace choices only when more than one is available", async ({ page }) => {
  const workspaceConfig = { ...config, workspace: { id: "site-a", resources: ["Files"], options: [
    { id: "site-a", label: "站点 A", url: "/site-a/files" },
    { id: "site-b", label: "站点 B", url: "/site-b/files" },
  ] } };
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(workspaceConfig)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  const switcher = page.getByRole("combobox", { name: "工作空间" });
  await expect(switcher).toHaveValue("site-a");
  await expect(switcher.locator("option")).toHaveCount(2);
});

test("enables a local QR Code action and keeps file delivery actions together", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const setting = page.getByRole("checkbox", { name: "文件网址 QR Code" });
  await expect(setting).not.toBeChecked();
  await setting.check();
  await page.getByRole("button", { name: "完成" }).click();

  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  const actions = page.locator(".sf-detail-actions");
  const download = actions.getByRole("link", { name: "下载" });
  await expect(download).toHaveAttribute("target", "_blank");
  await expect(download).toHaveAttribute("rel", "noopener noreferrer");
  await actions.getByRole("button", { name: "分享" }).click();

  const dialog = page.getByRole("dialog", { name: "分享" });
  await expect(dialog.getByRole("button", { name: "复制网址" })).toBeVisible();
  await expect(dialog.locator(".sf-qr-code img")).toHaveAttribute("src", /^data:image\/png;base64,/);
  await expect(dialog.getByRole("textbox", { name: "复制网址" })).toHaveValue("http://sofinder.test/uploads/editor/files/guide.txt");
  await expect(dialog.getByRole("link", { name: "下载 QR Code" })).toHaveAttribute("download", "guide.txt-qr.png");
});

test("keeps optional tag chips inline at the largest interface scale", async ({ page }) => {
  await page.setContent(`<!doctype html><html data-sofinder-scale="xlarge"><body><section class="sf-modal sf-tags-modal"><div class="sf-tag-suggestions"><button type="button"><svg class="sf-ui-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span>花木成畦手自栽并且这是一个很长的候选标签</span></button></div></section></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });

  const chip = page.locator(".sf-tag-suggestions button");
  const icon = chip.locator("svg");
  const label = chip.locator("span");
  await expect(chip).toHaveCSS("display", "flex");
  await expect(chip).toHaveCSS("white-space", "nowrap");
  await expect(label).toHaveCSS("text-overflow", "ellipsis");
  const [chipBox, iconBox, labelBox] = await Promise.all([chip.boundingBox(), icon.boundingBox(), label.boundingBox()]);
  expect(chipBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(Math.abs((iconBox!.y + iconBox!.height / 2) - (labelBox!.y + labelBox!.height / 2))).toBeLessThan(2);
  expect(chipBox!.height).toBeLessThan(48);
  expect(chipBox!.width).toBeLessThanOrEqual(260);
});

test("issues an expiring anonymous URL for a private resource", async ({ page }) => {
  await page.route("**/sofinder/api/config", async route => {
    await route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "", allowedExtensions: ["txt"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "proxy", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: false } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "", formats: [] }, signedUrls: { enabled: true, defaultTtlSeconds: 300, maxTtlSeconds: 3600 } } } });
  });
  await page.route("**/sofinder/api/signed-url?*", async route => {
    const requestUrl = new URL(route.request().url());
    expect(requestUrl.searchParams.get("resource")).toBe("Files");
    expect(requestUrl.searchParams.get("path")).toBe("guide.txt");
    expect(requestUrl.searchParams.get("ttl")).toBe("300");
    await route.fulfill({ json: { success: true, data: { url: "http://sofinder.test/sofinder/signed/test-token", expiresAt: 1893456000 } } });
  });

  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await page.getByRole("button", { name: "分享" }).click();

  const dialog = page.getByRole("dialog", { name: "分享" });
  await expect(dialog.getByRole("textbox", { name: "复制网址" })).toHaveValue("http://sofinder.test/sofinder/signed/test-token");
  await expect(dialog.getByText("失效时间", { exact: true })).toBeVisible();
  await expect(dialog.getByText("需要登录")).toHaveCount(0);
  await expect(dialog.locator("time")).toHaveAttribute("datetime", "2030-01-01T00:00:00.000Z");
});

test("prefers a configured host controller URL over a long signed URL", async ({ page }) => {
  let signedRequests = 0;
  await page.route("**/sofinder/api/config", async route => {
    await route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "", allowedExtensions: ["txt"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "proxy", entryUrlConfigured: true, storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: false } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "", formats: [] }, signedUrls: { enabled: true, defaultTtlSeconds: 300, maxTtlSeconds: 3600 } } } });
  });
  await page.route("**/sofinder/api/signed-url?*", async route => { signedRequests += 1; await route.abort(); });

  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await page.getByRole("button", { name: "分享" }).click();

  await expect(page.getByRole("dialog", { name: "分享" }).getByRole("textbox")).toHaveValue("http://sofinder.test/uploads/editor/files/guide.txt");
  expect(signedRequests).toBe(0);
});

test("has no serious automated accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
});

test("shows explicit administrator malware scanning status", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "安全状态" }).click();
  const dialog = page.getByRole("dialog", { name: "安全状态" });
  await expect(dialog.getByText("病毒扫描未启用")).toBeVisible();
  await expect(dialog.getByText("尚无病毒扫描记录。")).toBeVisible();
  await expect(dialog.getByText("LibreOffice 25.2")).toBeVisible();
  await expect(dialog.getByText("inline (auto)")).toBeVisible();
});

test("opens PDF files through the registered same-origin previewer", async ({ page }) => {
  await expect(page.locator(".sf-entry", { hasText: "manual.pdf" }).locator(".sf-entry-icon svg")).toHaveClass("sf-file-icon-pdf");
  await page.locator(".sf-entry", { hasText: "manual.pdf" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  const frame = page.getByRole("dialog", { name: "manual.pdf" }).locator("iframe.sf-document-preview");
  await expect(frame).not.toHaveAttribute("sandbox", /.+/);
  await expect(frame).toHaveAttribute("src", /\/sofinder\/api\/preview\/document\?resource=Files&path=manual\.pdf/);
  await page.waitForTimeout(250);
  await expect(page.getByText("正在提交 Office 预览…")).toHaveCount(0);
});

test("shows queued and converting Office preview phases before loading PDF", async ({ page }) => {
  const officeConfig = { ...config, featureAvailability: { documentPreview: true }, plugins: [{ name: "document-preview", version: "1.0.0", capabilities: ["preview.office"], previewers: [{ id: "office", mimeTypes: [], extensions: ["xlsx"], url: "/sofinder/api/preview/document" }] }] };
  await page.route("**/sofinder/api/config", route => route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/files", allowedExtensions: ["xlsx"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 10, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: officeConfig.plugins, imagePresets: {}, imageCapabilities: { driver: "", formats: [] }, featureAvailability: officeConfig.featureAvailability } } }));
  await page.route("**/sofinder/api/entries?*", route => route.fulfill({ json: { success: true, data: { entries: [{ path: "report.xlsx", name: "report.xlsx", directory: false, size: 10, modifiedAt: 1, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", url: "/files/report.xlsx", capabilities: { read: true } }], total: 1, path: "", offset: 0, limit: 100, nextCursor: null, sort: "name", direction: "asc", capabilities: {} } } }));
  let polls = 0;
  let converted = false;
  const job = (status: "queued" | "running" | "ready") => ({ id: "a".repeat(48), status, retryAfter: status === "ready" ? 0 : 1, error: null, source: "office", key: "b".repeat(64), resource: "Files", path: "report.xlsx", previewUrl: status === "ready" ? "/sofinder/api/preview/document?resource=Files&path=report.xlsx" : null, mode: "messenger", cached: false, createdAt: 1, startedAt: status === "queued" ? null : 2, updatedAt: 2, finishedAt: status === "ready" ? 3 : null, durationMilliseconds: status === "ready" ? 1000 : null });
  await page.route("**/sofinder/api/preview/document/jobs", route => route.fulfill({ status: converted ? 200 : 202, json: { success: true, data: job(converted ? "ready" : "queued") } }));
  await page.route("**/sofinder/api/preview/document/jobs/*", route => { const status = polls++ === 0 ? "running" : "ready"; if (status === "ready") converted = true; return route.fulfill({ status: status === "ready" ? 200 : 202, json: { success: true, data: job(status) } }); });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(officeConfig)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await page.locator(".sf-entry", { hasText: "report.xlsx" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  await expect(page.getByText("正在等待 Office 转换服务…")).toBeVisible();
  await expect(page.getByText("正在将 Office 文件转换为 PDF…")).toBeVisible({ timeout: 2500 });
  const dialog = page.getByRole("dialog", { name: "report.xlsx" });
  const frame = dialog.locator(".sf-document-preview-frame");
  const iframe = frame.locator("iframe.sf-document-preview");
  await expect(iframe).toBeVisible({ timeout: 3500 });
  await dialog.getByRole("button", { name: "全屏" }).click();
  await expect(dialog).toHaveClass(/sf-modal-fullscreen/);
  const fullscreenSizes = await Promise.all([dialog.locator(".sf-file-preview-content"), frame, iframe].map(locator => locator.evaluate(element => ({ width: element.clientWidth, height: element.clientHeight }))));
  expect(fullscreenSizes[1]).toEqual(fullscreenSizes[0]);
  expect(fullscreenSizes[2]).toEqual(fullscreenSizes[0]);
  await dialog.getByRole("button", { name: "退出全屏" }).click();
  await dialog.locator("footer").getByRole("button", { name: "关闭" }).click();
  await page.locator(".sf-entry", { hasText: "report.xlsx" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  await page.waitForTimeout(250);
  await expect(page.getByText("正在提交 Office 预览…")).toHaveCount(0);
});

test("uses a minimal shell and reveals manager actions contextually", async ({ page }) => {
  await expect(page.locator(".sf-header")).toHaveCount(0);
  await expect(page.locator(".sf-commandbar > .sf-brand .sf-brand-mark")).toHaveText("S");
  await expect(page.locator(".sf-commandbar > .sf-brand strong")).toHaveText("SoFinder");
  await expect(page.locator(".sf-commandbar > .sf-brand .sf-brand-mark")).toHaveCSS("width", "30px");
  const commandLayout = await page.locator(".sf-commandbar").evaluate(element => {
    const command = element.getBoundingClientRect();
    const search = element.querySelector(".sf-search")!.getBoundingClientRect();
    return { commandCenter: command.x + command.width / 2, searchCenter: search.x + search.width / 2 };
  });
  expect(Math.abs(commandLayout.commandCenter - commandLayout.searchCenter)).toBeLessThanOrEqual(1);
  const contentLayout = await page.locator(".sf-content").evaluate(element => {
    const breadcrumb = element.querySelector(":scope > .sf-breadcrumb")!.getBoundingClientRect();
    const entries = element.querySelector(":scope > .sf-entries")!.getBoundingClientRect();
    return { breadcrumbBottom: breadcrumb.bottom, entriesTop: entries.top };
  });
  expect(contentLayout.breadcrumbBottom).toBeLessThanOrEqual(contentLayout.entriesTop);
  await expect(page.getByRole("button", { name: "重命名" })).toHaveCount(0);
  await page.waitForTimeout(350);
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await expect(page.getByRole("button", { name: "重命名", exact: true })).toBeVisible();
  await expect(page.locator(".sf-details")).toHaveCSS("width", "270px");
  await page.getByRole("button", { name: "更多操作" }).click();
  await expect(page.getByLabel("语言")).toBeVisible();
});

test("closes the more-actions menu after clicking the main area", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "更多操作" });
  await trigger.click();
  await expect(page.getByRole("menu")).toBeVisible();

  await page.locator(".sf-content").click({ position: { x: 12, y: 260 } });

  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("shows the selection menu outside the scrollable toolbar", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 600 });
  const trigger = page.getByRole("button", { name: "选择", exact: true });
  await trigger.click();

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const toolbarBox = await page.locator(".sf-toolbar").boundingBox();
  const menuBox = await menu.boundingBox();
  expect(toolbarBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  expect(menuBox!.y).toBeGreaterThanOrEqual(toolbarBox!.y + toolbarBox!.height);

  await page.getByRole("menuitem", { name: "全部选择" }).click();
  await expect(page.locator(".sf-entry[aria-selected=true]")).toHaveCount(4);
  await expect(menu).toHaveCount(0);
});

test("keeps favorites file-only and pinned sidebar items folder-only", async ({ page }) => {
  let metadata = { favorites: ["guide.txt"], quickAccess: [] as string[], tags: { "guide.txt": ["Docs"] }, recent: [] as Array<{ path: string; touchedAt: number }> };
  await page.route("**/sofinder/api/metadata**", async route => {
    if (route.request().method() === "PATCH") {
      const body = route.request().postDataJSON() as { action: string; path: string; pinned?: boolean; favorite?: boolean };
      if (body.action === "quick_access") metadata.quickAccess = body.pinned ? [body.path] : [];
      if (body.action === "favorite") metadata.favorites = body.favorite ? [body.path] : metadata.favorites.filter(path => path !== body.path);
    }
    await route.fulfill({ json: { success: true, data: { ...metadata, quickAccessEntries: metadata.quickAccess.map(path => ({ path, name: path, directory: path === "manuals", mimeType: path.endsWith(".txt") ? "text/plain" : null, exists: true })) } } });
  });
  await page.route("**/sofinder/api/entries?*", async route => {
    await route.fulfill({ json: { success: true, data: { entries: [
      { path: "manuals", name: "manuals", directory: true, size: 0, modifiedAt: 4, mimeType: null, url: null, capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
      { path: "guide.txt", name: "guide.txt", directory: false, size: 12, modifiedAt: 1, mimeType: "text/plain", url: "/guide.txt", capabilities: {} },
      { path: "photo.png", name: "photo.png", directory: false, size: 68, modifiedAt: 2, mimeType: "image/png", url: "/photo.png", capabilities: {} },
    ], total: 3, path: "", offset: 0, limit: 100, nextCursor: null, sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
  });
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ favorites: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await expect(page.locator(".sf-sidebar").getByRole("button", { name: /guide\.txt/ })).toBeVisible();
  await expect(page.locator(".sf-resource-status")).toHaveCount(0);
  const guide = page.locator(".sf-entry", { hasText: "guide.txt" });
  await guide.click({ button: "right" });
  await page.getByRole("menuitem", { name: "取消收藏" }).click();
  await expect(page.locator(".sf-sidebar").getByRole("button", { name: /guide\.txt/ })).toHaveCount(0);
  await guide.click({ button: "right" });
  await page.getByRole("menuitem", { name: "收藏", exact: true }).click();
  await expect(page.locator(".sf-sidebar").getByRole("button", { name: /guide\.txt/ })).toBeVisible();
  await guide.click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: "固定到侧栏" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  const manuals = page.locator(".sf-entry", { hasText: "manuals" });
  await manuals.click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: "收藏", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  const favoritesPanel = page.locator(".sf-recent-sidebar", { has: page.locator("header strong", { hasText: "收藏文件" }) });
  const favoritesToggle = favoritesPanel.getByRole("button", { name: "收藏文件", exact: true });
  await expect(favoritesToggle).toHaveAttribute("aria-expanded", "true");
  await favoritesToggle.click();
  await expect(favoritesToggle).toHaveAttribute("aria-expanded", "false");
  await expect(favoritesPanel.getByRole("button", { name: /guide\.txt/ })).toBeHidden();
  await favoritesToggle.click();
  await expect(favoritesPanel.getByRole("button", { name: /guide\.txt/ })).toBeVisible();
  await favoritesPanel.getByRole("button", { name: /guide\.txt/ }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "取消收藏" }).click();
  await expect(favoritesPanel.getByRole("button", { name: /guide\.txt/ })).toHaveCount(0);
  await guide.click({ button: "right" });
  await page.getByRole("menuitem", { name: "收藏", exact: true }).click();
  await expect(favoritesPanel.getByRole("button", { name: /guide\.txt/ })).toBeVisible();
  await expect(favoritesPanel.locator("header").getByRole("link")).toHaveCount(0);
  const favoritesLink = favoritesPanel.locator(".sf-sidebar-section-link");
  await expect(favoritesLink).toHaveAccessibleName("收藏文件");
  await expect(favoritesLink).toHaveAttribute("href", /collection=favorites/);
  await favoritesLink.click();
  await expect(page).toHaveURL(/collection=favorites/);
  await expect(page.getByRole("heading", { name: "收藏文件" })).toBeVisible();
  await expect(page.locator(".sf-favorites-links .sf-favorite-open", { hasText: "guide.txt" })).toBeVisible();
  await page.getByRole("textbox", { name: "搜索收藏文件" }).fill("missing");
  await expect(page.getByText("没有符合此筛选条件的项目。")).toBeVisible();
  await page.getByRole("textbox", { name: "搜索收藏文件" }).fill("");
  await page.goBack();
  await expect(page).not.toHaveURL(/collection=favorites/);
  await expect(page.locator(".sf-entry", { hasText: "manuals" })).toBeVisible();
  await page.locator(".sf-entry", { hasText: "manuals" }).click();
  await page.getByRole("button", { name: "固定到侧栏" }).click();
  await expect(page.locator(".sf-sidebar").getByRole("button", { name: /manuals/ })).toBeVisible();
  await expect(page.locator(".sf-sidebar").getByRole("button", { name: /manuals/ }).locator("[data-icon=folder]")).toBeVisible();

  await page.getByRole("button", { name: "选择", exact: true }).click();
  await page.getByRole("menuitem", { name: "全部选择" }).click();
  await expect(page.locator(".sf-entry[aria-selected=true]")).toHaveCount(3);
  await page.getByRole("button", { name: "选择", exact: true }).click();
  await page.getByRole("menuitem", { name: "反向选择" }).click();
  await expect(page.locator(".sf-entry[aria-selected=true]")).toHaveCount(0);

  await page.getByRole("button", { name: "排序" }).click();
  await page.getByRole("menuitem", { name: "分组" }).click();
  await page.getByRole("menu", { name: "分组" }).getByRole("menuitemradio", { name: "类型" }).click();
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByLabel("筛选类型").selectOption("image");
  await expect(page.locator(".sf-entry")).toHaveCount(1);
  await expect(page.locator(".sf-entry-group")).toContainText("图片");
});

test("lets each user place folder navigation in either sidebar", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("checkbox", { name: "文件夹导航" }).check();
  await expect(settings.getByRole("radiogroup", { name: "文件夹导航位置" })).toBeVisible();
  await settings.getByRole("radio", { name: "右侧边栏" }).check();
  await settings.getByRole("button", { name: "完成" }).click();

  await expect(page.locator(".sf-folder-navigation-right")).toBeVisible();
  await expect(page.locator(".sf-folder-navigation-right")).toContainText("首页");
  const rightTreeRow = page.locator(".sf-folder-navigation-right .sf-tree-row").first();
  await expect(rightTreeRow.locator('[data-icon="folder"]')).toBeVisible();
  expect((await rightTreeRow.boundingBox())?.height).toBeGreaterThanOrEqual(40);
  const rightTreeStyle = await rightTreeRow.evaluate(element => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, radius: style.borderRadius };
  });
  await expect(page.locator(".sf-sidebar .sf-folder-tree")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.folderNavigation.position.v1"))).toBe("right");

  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  await page.getByRole("dialog", { name: "设置" }).getByRole("radio", { name: "左侧边栏" }).check();
  await page.getByRole("dialog", { name: "设置" }).getByRole("button", { name: "完成" }).click();
  const leftTreeRow = page.locator(".sf-sidebar .sf-folder-tree .sf-tree-row").first();
  await expect(leftTreeRow).toBeVisible();
  await expect(leftTreeRow.locator('[data-icon="folder"]')).toBeVisible();
  await expect.poll(() => leftTreeRow.evaluate(element => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, radius: style.borderRadius };
  })).toEqual(rightTreeStyle);
  await expect(page.locator(".sf-folder-navigation-right")).toHaveCount(0);
});

test("drags sidebar sections between sides and preserves their order", async ({ page }) => {
  await page.route("**/sofinder/api/metadata**", route => route.fulfill({ json: { success: true, data: { favorites: ["guide.txt"], quickAccess: ["manuals"], quickAccessEntries: [{ path: "manuals", name: "manuals", directory: true, mimeType: null, exists: true }], tags: {}, recent: [{ path: "guide.txt", touchedAt: 1 }] } } }));
  await page.evaluate(() => {
    localStorage.setItem("sofinder.features.v2", JSON.stringify({ folderTree: true, recent: true, favorites: true, sidebarFavorites: true, sidebarQuickAccess: true }));
    localStorage.removeItem("sofinder.sidebarLayout.v1");
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const sectionOrder = (side: "left" | "right") => page.locator(`[data-sidebar-dropzone=${side}] [data-sidebar-section]`).evaluateAll(nodes => nodes.map(node => node.getAttribute("data-sidebar-section")));
  await expect.poll(() => sectionOrder("left")).toEqual(["folderNavigation", "quickAccess", "favorites", "recent"]);

  const favoriteHandle = page.getByRole("button", { name: /拖动调整侧栏.*收藏文件/ });
  await expect(favoriteHandle).toHaveCSS("opacity", "0");
  await favoriteHandle.focus();
  await expect(favoriteHandle).toHaveCSS("opacity", "1");
  await page.keyboard.press("Home");
  await expect.poll(() => sectionOrder("left")).toEqual(["favorites", "folderNavigation", "quickAccess", "recent"]);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => sectionOrder("right")).toEqual(["favorites"]);

  await page.locator('[data-sidebar-section="favorites"] .sf-sidebar-drag-handle').dragTo(page.locator('[data-sidebar-section="quickAccess"]'), { targetPosition: { x: 10, y: 1 } });
  await expect.poll(() => sectionOrder("left")).toEqual(["folderNavigation", "favorites", "quickAccess", "recent"]);
  await expect.poll(() => sectionOrder("right")).toEqual([]);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.sidebarLayout.v1") || "null"))).toEqual({ left: ["folderNavigation", "favorites", "quickAccess", "recent"], right: [] });
});

test("keeps cross-resource pinned folders visible and unpins from its context menu", async ({ page }) => {
  const resource = (name: string) => ({ name, publicUrl: `/uploads/${name.toLowerCase()}`, allowedExtensions: ["txt"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 0, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } });
  const quickAccess: Record<string, string[]> = { Files: ["manuals"], Images: ["albums"], Private: ["vault"] };
  let unpinnedResource = "";
  await page.route("**/sofinder/api/config", route => route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [resource("Files"), resource("Images"), resource("Private")], plugins: [], imagePresets: {}, imageCapabilities: { driver: "", formats: [] } } } }));
  await page.route("**/sofinder/api/metadata**", async route => {
    const requestUrl = new URL(route.request().url());
    const body = route.request().method() === "PATCH" ? route.request().postDataJSON() as { resource: string; action: string; path: string; pinned: boolean } : null;
    const resourceName = body?.resource || requestUrl.searchParams.get("resource") || "Files";
    if (body?.action === "quick_access" && body.pinned === false) { quickAccess[resourceName] = quickAccess[resourceName].filter(path => path !== body.path); unpinnedResource = resourceName; }
    await route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: quickAccess[resourceName], tags: {}, recent: [] } } });
  });
  await page.evaluate(() => {
    localStorage.setItem("sofinder.features.v2", JSON.stringify({ favorites: true }));
    localStorage.removeItem("sofinder.quickAccess.scope.v1");
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const panel = page.locator(".sf-recent-sidebar", { has: page.getByText("已固定文件夹", { exact: true }) });
  const quickLinks = panel.locator(".sf-sidebar-section-content button");
  await expect(quickLinks).toHaveCount(3);
  await expect(panel).toContainText("Files");
  await expect(panel).toContainText("Images");
  await expect(panel).toContainText("Private");
  await page.getByRole("button", { name: "图片", exact: true }).click();
  await expect(quickLinks).toHaveCount(3);

  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("radio", { name: "当前根目录" }).check();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(quickLinks).toHaveCount(1);
  await expect(panel).toContainText("albums");

  await panel.getByRole("button", { name: /albums/ }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "从侧栏取消固定" }).click();
  await expect(quickLinks).toHaveCount(0);
  expect(unpinnedResource).toBe("Images");
});

test("keeps pinned folders available when Favorites is disabled", async ({ page }) => {
  await page.route("**/sofinder/api/metadata**", route => route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: ["manuals"], quickAccessEntries: [{ path: "manuals", name: "manuals", directory: true, mimeType: null, exists: true }], tags: {}, recent: [] } } }));
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ favorites: false, sidebarQuickAccess: true, sidebarFavorites: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await expect(page.locator(".sf-recent-sidebar", { hasText: "已固定文件夹" }).getByRole("button", { name: /manuals/ })).toBeVisible();
  await expect(page.locator(".sf-recent-sidebar", { hasText: "收藏文件" })).toHaveCount(0);
});

test("marks and removes a stale pinned folder", async ({ page }) => {
  let paths = ["missing.txt"];
  let staleEntryRequests = 0;
  await page.route("**/sofinder/api/metadata**", async route => {
    if (route.request().method() === "PATCH") paths = [];
    await route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: paths, quickAccessEntries: paths.map(path => ({ path, name: path, directory: null, mimeType: null, exists: false })), tags: {}, recent: [] } } });
  });
  await page.route("**/sofinder/api/entries?**", async route => {
    if (new URL(route.request().url()).searchParams.get("search") === "missing.txt") staleEntryRequests++;
    await route.fallback();
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  const stale = page.locator(".sf-recent-sidebar").getByRole("button", { name: /missing\.txt/ });
  await expect(stale.locator("[data-icon=warning]")).toBeVisible();
  await stale.click();
  await expect(stale).toHaveCount(0);
  await expect(page.getByRole("alert")).toContainText("该固定文件夹已不存在");
  expect(staleEntryRequests).toBe(0);
});

test("keeps a stale pinned folder when removing its metadata fails", async ({ page }) => {
  await page.route("**/sofinder/api/metadata**", async route => {
    if (route.request().method() === "PATCH") {
      await route.fulfill({ status: 503, json: { success: false, error: { code: "metadata_unavailable", message: "Metadata unavailable" } } });
      return;
    }
    await route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: ["missing"], quickAccessEntries: [{ path: "missing", name: "missing", directory: null, mimeType: null, exists: false }], tags: {}, recent: [] } } });
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const stale = page.locator(".sf-recent-sidebar").getByRole("button", { name: /missing/ });
  await stale.click();
  await expect(stale).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Metadata unavailable");
});

test("removes a pinned folder that disappears while opening", async ({ page }) => {
  let paths = ["123"];
  let directoryRequests = 0;
  await page.route("**/sofinder/api/metadata**", async route => {
    if (route.request().method() === "PATCH") paths = [];
    await route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: paths, quickAccessEntries: paths.map(path => ({ path, name: path, directory: true, mimeType: null, exists: true })), tags: {}, recent: [] } } });
  });
  await page.route("**/sofinder/api/entries?**", async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("path") === "" && url.searchParams.get("search") === "123") {
      await route.fulfill({ json: { success: true, data: { entries: [{ path: "123", name: "123", directory: true, size: 0, modifiedAt: 1, mimeType: null, url: null, capabilities: { read: true } }], total: 1, path: "", offset: 0, limit: 500, nextCursor: null, sort: "name", direction: "asc", capabilities: {} } } });
      return;
    }
    if (url.searchParams.get("path") === "123") {
      directoryRequests++;
      await route.fulfill({ status: 404, json: { success: false, error: { code: "not_found", message: "Not found" } } });
      return;
    }
    await route.fallback();
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const shortcut = page.locator(".sf-recent-sidebar").getByRole("button", { name: /123/ });
  await expect(shortcut).toBeVisible();
  await shortcut.click();
  await expect(shortcut).toHaveCount(0);
  await expect(page.getByRole("alert")).toContainText("该固定文件夹已不存在");
  await expect.poll(() => new URL(page.url()).searchParams.get("path")).toBeNull();
  expect(directoryRequests).toBe(1);
});

test("configures Favorites sidebar sections and keeps the collection link below Trash", async ({ page }) => {
  await page.route("**/sofinder/api/metadata**", route => route.fulfill({ json: { success: true, data: { favorites: ["guide.txt"], quickAccess: ["manuals"], tags: {}, recent: [] } } }));
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ favorites: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  const showQuickAccess = settings.getByRole("checkbox", { name: "显示固定文件夹" });
  const showFavorites = settings.getByRole("checkbox", { name: "显示收藏文件" });
  await expect(showQuickAccess).toBeChecked();
  await expect(showFavorites).toBeChecked();
  await showQuickAccess.uncheck();
  await showFavorites.uncheck();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-sidebar").getByRole("button", { name: "已固定文件夹", exact: true })).toHaveCount(0);
  await expect(page.locator(".sf-sidebar").getByRole("button", { name: "收藏文件", exact: true })).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.features.v2") || "{}").sidebarFavorites)).toBe(false);

  await page.getByRole("button", { name: "更多操作" }).click();
  const menuItems = await page.getByRole("menuitem").allTextContents();
  expect(menuItems).not.toContain("回收站");
  await page.getByRole("menuitem", { name: "收藏文件" }).click();
  await expect(page).toHaveURL(/collection=favorites/);
});

test("saves, selects and applies named preference profiles", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  const profileName = settings.getByRole("textbox", { name: "偏好名称" });
  const profiles = settings.getByRole("combobox", { name: "选择偏好方案" });

  await profileName.fill("标准方案");
  await settings.getByRole("button", { name: "保存当前设置" }).click();
  await expect(settings.getByRole("status")).toContainText("偏好方案已保存");

  await settings.getByRole("radio", { name: "大（112.5%）" }).check();
  await settings.getByRole("checkbox", { name: "文件夹导航" }).check();
  await settings.getByRole("radio", { name: "右侧边栏" }).check();
  await profileName.fill("大屏右栏");
  await settings.getByRole("button", { name: "保存当前设置" }).click();

  await profiles.selectOption({ label: "标准方案" });
  await settings.getByRole("button", { name: "应用" }).click();
  await expect(settings.getByRole("radio", { name: "标准（100%）" })).toBeChecked();
  await expect(settings.getByRole("checkbox", { name: "文件夹导航" })).not.toBeChecked();

  await profiles.selectOption({ label: "大屏右栏" });
  await settings.getByRole("button", { name: "应用" }).click();
  await expect(settings.getByRole("radio", { name: "大（112.5%）" })).toBeChecked();
  await expect(settings.getByRole("radio", { name: "右侧边栏" })).toBeChecked();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.preferenceProfiles.v1") || "[]").length)).toBe(2);

  await settings.getByRole("combobox", { name: "选择内置预设" }).selectOption("compact");
  await settings.getByRole("button", { name: "恢复预设" }).click();
  await expect(settings.getByRole("radio", { name: "紧凑（90%）" })).toBeChecked();
  const smallSizes = settings.getByRole("radio", { name: "小", exact: true });
  await expect(smallSizes).toHaveCount(2);
  await expect(smallSizes.nth(0)).toBeChecked();
  await expect(smallSizes.nth(1)).toBeChecked();
  await expect(settings.getByRole("checkbox", { name: "显示大小" })).toBeChecked();
  await expect(settings.getByRole("checkbox", { name: "显示修改时间" })).not.toBeChecked();
  await expect(settings.getByRole("checkbox", { name: "显示 MIME 类型" })).not.toBeChecked();
  await expect(settings.getByRole("status")).toContainText("已恢复内置预设");

  await settings.getByRole("button", { name: "恢复系统默认" }).click();
  await expect(settings.getByRole("radio", { name: "标准（100%）" })).toBeChecked();
  await expect(settings.getByRole("radio", { name: "每次由我选择" })).toBeChecked();
  await expect(settings.getByRole("checkbox", { name: "快速访问包含文件" })).toHaveCount(0);
  await expect(settings.getByRole("checkbox", { name: "显示修改时间" })).toBeChecked();
  await expect(settings.getByRole("status")).toContainText("已恢复系统默认设置");
  await expect(settings.getByRole("heading", { name: "外观" })).toBeVisible();
  await expect(settings.getByRole("heading", { name: "文件操作" })).toBeVisible();
  await expect(settings.getByRole("heading", { name: "列表", exact: true })).toBeVisible();
  await expect(settings.getByRole("heading", { name: "功能与侧边栏" })).toBeVisible();

  await settings.getByRole("button", { name: "删除方案" }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.preferenceProfiles.v1") || "[]").length)).toBe(1);
});

test("keeps every settings section expanded at the largest interface scale", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 578 });
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("radio", { name: "特大（125%）" }).check();
  const sections = settings.locator(".sf-settings-section");
  await expect(sections).toHaveCount(4);
  const dimensions = await sections.evaluateAll(items => items.map(item => ({ clientHeight: item.clientHeight, scrollHeight: item.scrollHeight })));
  for (const section of dimensions) expect(section.clientHeight).toBe(section.scrollHeight);
  await sections.last().scrollIntoViewIfNeeded();
  await expect(settings.getByRole("checkbox", { name: "上传全部结束后自动收起队列" })).toBeVisible();
  await expect(settings.getByRole("button", { name: "已完成" })).toBeVisible();
});

test("keeps the more-actions menu open for internal controls and closes it with Escape", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "更多操作" });
  await trigger.click();
  await page.getByLabel("语言").selectOption("zh-tw");
  await expect(page.getByRole("menu")).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("uses the logo slot for breadcrumbs and shifts search right when the logo is disabled", async ({ page }) => {
  const noLogoConfig = { ...config, uiDefaults: { ...config.uiDefaults, logo: false } };
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify(noLogoConfig)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();

  await expect(page.locator(".sf-commandbar > .sf-brand")).toHaveCount(0);
  await expect(page.locator(".sf-commandbar > .sf-command-breadcrumb")).toBeVisible();
  await expect(page.locator(".sf-content > .sf-breadcrumb")).toHaveCount(0);
  const layout = await page.locator(".sf-commandbar").evaluate(element => {
    const command = element.getBoundingClientRect();
    const breadcrumb = element.querySelector(":scope > .sf-command-breadcrumb")!.getBoundingClientRect();
    const search = element.querySelector(":scope > .sf-search")!.getBoundingClientRect();
    return {
      commandCenter: command.x + command.width / 2,
      breadcrumbLeft: breadcrumb.left,
      searchCenter: search.x + search.width / 2,
    };
  });
  expect(layout.breadcrumbLeft).toBeLessThan(layout.commandCenter);
  expect(layout.searchCenter).toBeGreaterThan(layout.commandCenter);
});

test("keeps panel separators subtle until they can be dragged", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  const separator = page.locator(".sf-column-resizer.right");
  await expect(separator).toBeVisible();
  await expect(separator).toHaveCSS("width", "1px");
  const handleStyle = () => separator.evaluate(element => {
    const style = getComputedStyle(element, "::before");
    return {
      width: style.width,
      backgroundColor: style.backgroundColor,
      borderLeftWidth: style.borderLeftWidth,
      borderRightWidth: style.borderRightWidth,
    };
  });
  const restingStyle = await handleStyle();
  expect(restingStyle).toMatchObject({ width: "1px", borderLeftWidth: "0px", borderRightWidth: "0px" });
  expect(restingStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  await separator.hover();
  await expect.poll(handleStyle).toEqual({
    width: "5px",
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderLeftWidth: "1px",
    borderRightWidth: "1px",
  });
  await page.mouse.down();
  await expect(separator).toHaveClass(/is-resizing/);
  await page.mouse.move(20, 20);
  await expect.poll(handleStyle).toMatchObject({ width: "5px", borderLeftWidth: "1px", borderRightWidth: "1px" });
  await page.mouse.up();
  await expect(separator).not.toHaveClass(/is-resizing/);
});

test("switches between name and tag search without enabling tag management", async ({ page }) => {
  const scope = page.getByRole("combobox", { name: "搜索范围" });
  await expect(scope).toHaveValue("name");
  await scope.selectOption("tags");
  await expect(scope).toHaveValue("tags");
  await expect(page.getByRole("textbox", { name: "搜索标签（多个标签用逗号分隔）" })).toBeEnabled();
  await scope.selectOption("name");
  await expect(scope).toHaveValue("name");
  await expect(page.getByRole("textbox", { name: "搜索文件" })).toBeEnabled();
});

test("keeps the compact manager layout inside a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 740 });
  await expect(page.locator(".sf-commandbar")).toBeVisible();
  await expect(page.locator(".sf-details")).toBeHidden();
  await expect(page.locator(".sf-sidebar")).toBeHidden();
  const metrics = await page.locator(".sf-app").evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    commandRight: element.querySelector(".sf-commandbar")?.getBoundingClientRect().right || 0,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  expect(metrics.commandRight).toBeLessThanOrEqual(560);
});

test("moves selected-file actions to a touch-safe mobile bottom bar", async ({ page }) => {
  await page.setViewportSize({ width: 403, height: 740 });
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  const actions = page.locator(".sf-context-actions");
  await expect(actions).toBeVisible();
  const box = await actions.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs((box!.y + box!.height) - 740)).toBeLessThanOrEqual(2);
  await expect(actions.getByRole("button", { name: "删除" })).toBeVisible();
});

test("restores resource paths from browser history", async ({ page }) => {
  const request = page.waitForRequest(value => {
    const url = new URL(value.url());
    return url.pathname === "/sofinder/api/entries" && url.searchParams.get("path") === "manuals/2026";
  });
  await page.evaluate(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("type", "Files");
    url.searchParams.set("path", "manuals/2026");
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await request;
});

test("persists precise list-column choices", async ({ page }) => {
  await page.getByRole("button", { name: "查看" }).click();
  await page.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  await expect(page.locator(".sf-list-head").getByText("类型", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("显示 MIME 类型", { exact: true }).click();
  await settings.getByText("显示修改时间", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-list-head").getByText("类型", { exact: true })).toBeVisible();
  await expect(page.locator(".sf-list-head").getByText("修改时间", { exact: true })).toHaveCount(0);
  await expect(page.locator(".sf-entry", { hasText: "photo.png" }).getByText("image/png", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.listColumns.v1"))).toContain('"type":true');
});

test("integrates Windows-style view choices and panes in one menu", async ({ page }) => {
  const viewButton = page.getByRole("button", { name: "查看" });
  await viewButton.click();
  const menu = page.getByRole("menu", { name: "查看" });
  await expect(menu.getByRole("menuitemradio")).toHaveCount(6);
  await menu.getByRole("menuitemradio", { name: "大图标" }).click();
  await expect(page.locator(".sf-entry", { hasText: "photo.png" }).locator(".sf-entry-icon")).toHaveCSS("height", "132px");

  await viewButton.click();
  await menu.getByRole("menuitemcheckbox", { name: "紧凑视图" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-sofinder-scale", "compact");
  await menu.getByRole("menuitemcheckbox", { name: "文件夹导航" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.features.v2"))).toContain('"folderTree":true');

  await viewButton.click();
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await expect(page.locator(".sf-details")).toBeVisible();
  await viewButton.click();
  await menu.getByRole("menuitemcheckbox", { name: "详细信息窗格" }).click();
  await expect(page.locator(".sf-details")).toBeHidden();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.detailsPane.v1"))).toBe("hidden");

  await menu.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  await viewButton.click();
  await menu.getByRole("menuitemcheckbox", { name: "显示 MIME 类型" }).click();
  await expect(page.locator(".sf-list-head").getByText("类型", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.viewSizes.v1"))).toContain('"grid":"large"');
});

test("offers only supported Windows-style sort and grouping choices", async ({ page }) => {
  await page.setViewportSize({ width: 727, height: 900 });
  await page.getByRole("button", { name: "排序" }).click();
  const menu = page.getByRole("menu", { name: "排序" });
  await expect(menu.getByRole("menuitemradio")).toHaveCount(6);
  await expect(menu).not.toContainText(/创建日期|拍摄日期|分辨率|分级/);
  const groupTrigger = menu.getByRole("menuitem", { name: "分组" });
  await groupTrigger.click();
  const groups = page.getByRole("menu", { name: "分组" });
  await expect(groups.getByRole("menuitemradio")).toHaveCount(5);
  const triggerBox = await groupTrigger.boundingBox();
  const groupsBox = await groups.boundingBox();
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(triggerBox).not.toBeNull();
  expect(groupsBox).not.toBeNull();
  expect(groupsBox!.width).toBeLessThanOrEqual(161);
  expect(groupsBox!.x).toBeGreaterThanOrEqual(12);
  expect(groupsBox!.x + groupsBox!.width).toBeLessThanOrEqual(viewportWidth - 12);
  const rightSpace = viewportWidth - triggerBox!.x - triggerBox!.width - 18;
  const leftSpace = triggerBox!.x - 18;
  const expectedSide = rightSpace >= 96 ? "right" : leftSpace >= 96 ? "left" : rightSpace >= leftSpace ? "right" : "left";
  await expect(groups).toHaveClass(new RegExp(`opens-${expectedSide}`));
  if (expectedSide === "right") expect(groupsBox!.x).toBeGreaterThanOrEqual(triggerBox!.x + triggerBox!.width);
  else expect(groupsBox!.x + groupsBox!.width).toBeLessThanOrEqual(triggerBox!.x);

  await groupTrigger.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await groupTrigger.click();
  await expect(groups).toHaveClass(/opens-right/);
  const wideTriggerBox = await groupTrigger.boundingBox();
  const wideGroupsBox = await groups.boundingBox();
  expect(wideTriggerBox).not.toBeNull();
  expect(wideGroupsBox).not.toBeNull();
  expect(wideGroupsBox!.x).toBeGreaterThanOrEqual(wideTriggerBox!.x + wideTriggerBox!.width);
  expect(wideGroupsBox!.x + wideGroupsBox!.width).toBeLessThanOrEqual(1428);
  await groups.getByRole("menuitemradio", { name: "类型" }).click();
  await expect(page.locator(".sf-entry-group")).toHaveCount(2);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.groupMode.v1"))).toBe("type");
});

test("sorts from every visible list header and exposes type and direction controls", async ({ page }) => {
  await page.getByRole("button", { name: "查看" }).click();
  await page.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  const waitForSort = (sort: string, direction: string) => page.waitForRequest(request => {
    const url = new URL(request.url());
    return url.pathname === "/sofinder/api/entries" && url.searchParams.get("sort") === sort && url.searchParams.get("direction") === direction;
  });

  let request = waitForSort("name", "desc");
  await page.getByRole("button", { name: "名称, 升序" }).click();
  await request;
  await expect(page.locator('.sf-list-head button[aria-pressed="true"] svg')).toHaveAttribute("data-icon", "sort-desc");

  request = waitForSort("size", "asc");
  await page.locator(".sf-list-head .sf-list-size").click();
  await request;
  request = waitForSort("size", "desc");
  await page.getByRole("button", { name: "大小, 升序" }).click();
  await request;

  request = waitForSort("modified", "asc");
  await page.locator(".sf-list-head .sf-list-modified").click();
  await request;

  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("显示 MIME 类型", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();

  request = waitForSort("type", "asc");
  const sortButton = page.getByRole("button", { name: "排序" });
  await sortButton.click();
  await page.getByRole("menu", { name: "排序" }).getByRole("menuitemradio", { name: "类型" }).click();
  await request;
  await sortButton.click();
  await expect(page.getByRole("menu", { name: "排序" }).getByRole("menuitemradio", { name: "升序" })).toHaveAttribute("aria-checked", "true");
  await sortButton.click();
  request = waitForSort("type", "desc");
  await page.locator(".sf-list-head .sf-list-type").click();
  await request;
  await expect(page.locator('.sf-list-head .sf-list-type svg')).toHaveAttribute("data-icon", "sort-desc");
});

test("persists independently bounded grid and list entry sizes", async ({ page }) => {
  await expect(page.locator(".sf-entry", { hasText: "photo.png" }).locator(".sf-entry-icon")).toHaveCSS("height", "90px");
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  let settings = page.getByRole("dialog", { name: "设置" });
  const gridSizeGroup = settings.getByRole("radiogroup", { name: "网格项目大小" });
  const gridSizes = gridSizeGroup.getByRole("radio");
  await expect(gridSizes).toHaveCount(3);
  await expect(gridSizes.first()).toHaveValue("small");
  await expect(gridSizes.last()).toHaveValue("large");
  await gridSizeGroup.getByRole("radio", { name: "大" }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-entry", { hasText: "photo.png" }).locator(".sf-entry-icon")).toHaveCSS("height", "132px");

  await page.getByRole("button", { name: "查看" }).click();
  await page.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("radiogroup", { name: "列表行大小" }).getByRole("radio", { name: "小" }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-entry", { hasText: "photo.png" })).toHaveCSS("height", "40px");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.viewSizes.v1"))).toBe('{"grid":"large","list":"small"}');
});

test("resizes list columns within limits and double-clicks to fit content", async ({ page }) => {
  await page.getByRole("button", { name: "查看" }).click();
  await page.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  const separator = page.getByRole("separator", { name: "调整列宽: 名称" });
  await expect(separator).toHaveAttribute("aria-valuemin", "180");
  await expect(separator).toHaveAttribute("aria-valuemax", "720");

  const initial = Number(await separator.getAttribute("aria-valuenow"));
  let box = await separator.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 60, box!.y + box!.height / 2);
  await page.mouse.up();
  await expect.poll(async () => Number(await separator.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(initial + 50);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}").name)).toBeGreaterThanOrEqual(initial + 50);

  for (let index = 0; index < 40; index += 1) await separator.press("ArrowRight");
  await expect(separator).toHaveAttribute("aria-valuenow", "720");

  await separator.dblclick();
  await expect.poll(async () => Number(await separator.getAttribute("aria-valuenow"))).toBeLessThan(720);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}").name)).toBeGreaterThanOrEqual(180);

  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("显示 MIME 类型", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-list-column-resizer")).toHaveCount(4);
  const typeSeparator = page.getByRole("separator", { name: "调整列宽: 类型" });
  await expect(typeSeparator).toHaveAttribute("aria-valuemin", "120");
  await expect(typeSeparator).toHaveAttribute("aria-valuemax", "360");
  await typeSeparator.press("ArrowRight");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}").type)).toBe(170);
});

test("keeps previous and next pagination controls on one line", async ({ page }) => {
  await page.setViewportSize({ width: 403, height: 740 });
  const previous = page.getByRole("button", { name: "上一页", exact: true });
  const next = page.getByRole("button", { name: "下一页", exact: true });
  await expect(previous).toBeVisible();
  await expect(next).toBeVisible();
  const metrics = await Promise.all([previous, next].map(button => button.evaluate(element => ({
    display: getComputedStyle(element).display,
    whiteSpace: getComputedStyle(element).whiteSpace,
    height: element.getBoundingClientRect().height,
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
  }))));
  for (const item of metrics) {
    expect(item.display).toBe("flex");
    expect(item.whiteSpace).toBe("nowrap");
    expect(item.height).toBeLessThanOrEqual(40);
    expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
  }
});

test("stays bounded at Windows 100, 125 and 150 percent effective viewport scales", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  await page.getByRole("dialog", { name: "设置" }).getByRole("radio", { name: "特大（125%）" }).check();
  await page.getByRole("dialog", { name: "设置" }).getByRole("button", { name: "完成" }).click();
  for (const width of [1280, 1024, 853]) {
    await page.setViewportSize({ width, height: 760 });
    const layout = await page.locator(".sf-app").evaluate(element => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    expect(layout.scrollWidth, `horizontal overflow at ${width}px effective viewport`).toBeLessThanOrEqual(layout.clientWidth + 1);
    await expect(page.locator(".sf-commandbar")).toBeVisible();
  }
});

test("visual baseline covers dark Chinese grid, compact list, long names and mobile", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Pixel baselines are recorded once; functional coverage still runs in all three engines.");
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.evaluate(() => {
    localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify({ grid: "large", list: "small" }));
    document.documentElement.style.setProperty("--sf-bg", "#111827");
    document.documentElement.style.setProperty("--sf-panel", "#1f2937");
    document.documentElement.style.setProperty("--sf-text", "#f3f4f6");
    document.documentElement.style.setProperty("--sf-muted", "#9ca3af");
  });
  await page.locator(".sf-entry-name").first().evaluate(element => { element.textContent = "这是一个用于验证省略显示和中文布局的非常非常长的文件名称-2026-最终版本.txt"; });
  await expect(page.locator(".sf-app")).toHaveScreenshot("dark-grid-chinese.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.02,
  });
  await page.getByRole("button", { name: "查看" }).click();
  await page.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  await expect(page.locator(".sf-app")).toHaveScreenshot("dark-list-compact.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.02,
  });
  await page.setViewportSize({ width: 403, height: 740 });
  await expect(page.locator(".sf-app")).toHaveScreenshot("mobile-chinese.png", {
    animations: "disabled",
    // Mobile text rasterization differs slightly between the local Playwright
    // image and GitHub's Linux runner; keep the desktop baselines stricter.
    maxDiffPixelRatio: 0.04,
  });
});

test("shows recent files immediately when enabled and keeps them accessible on mobile", async ({ page }) => {
  let recent: Array<{ path: string; touchedAt: number }> = [];
  await page.route("**/sofinder/api/metadata**", async route => {
    if (route.request().method() === "PATCH") {
      const body = route.request().postDataJSON() as { path: string };
      recent = [{ path: body.path, touchedAt: 1 }];
    }
    await route.fulfill({ json: { success: true, data: { favorites: [], tags: {}, recent } } });
  });
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ recent: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const desktopRecent = page.locator(".sf-recent-sidebar");
  await expect(desktopRecent.getByText("暂无最近使用；选择或打开文件后会显示在这里。")).toBeVisible();
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await expect(desktopRecent.getByRole("button", { name: /guide\.txt/ })).toBeVisible();

  await page.setViewportSize({ width: 403, height: 740 });
  await expect(desktopRecent).toBeHidden();
  await expect(page.locator(".sf-recent-mobile").getByRole("button", { name: /guide\.txt/ })).toBeVisible();
});

test("shows five recent files in the sidebar and opens the full recent page", async ({ page }) => {
  const recent = Array.from({ length: 7 }, (_, index) => ({ path: `folder/recent-${index + 1}.txt`, touchedAt: 7 - index }));
  await page.route("**/sofinder/api/metadata**", route => route.fulfill({ json: { success: true, data: { favorites: [], quickAccess: [], tags: {}, recent } } }));
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ recent: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const recentPanel = page.locator(".sf-recent-sidebar", { has: page.getByText("最近使用", { exact: true }) });
  await expect(recentPanel.locator(".sf-sidebar-section-content > div > button")).toHaveCount(5);
  const recentLink = recentPanel.locator(".sf-sidebar-section-link");
  await expect(recentLink).toHaveAttribute("href", /collection=recent/);
  await recentLink.click();
  await expect(page).toHaveURL(/collection=recent/);
  await expect(page.getByRole("heading", { name: "最近使用" })).toBeVisible();
  await expect(page.locator(".sf-favorites-links article")).toHaveCount(7);
  await page.getByRole("textbox", { name: "搜索最近使用" }).fill("recent-7");
  await expect(page.locator(".sf-favorites-links article")).toHaveCount(1);
});

test("shows five favorite files in the sidebar", async ({ page }) => {
  const favorites = Array.from({ length: 7 }, (_, index) => `folder/favorite-${index + 1}.txt`);
  await page.route("**/sofinder/api/metadata**", route => route.fulfill({ json: { success: true, data: { favorites, quickAccess: [], tags: {}, recent: [] } } }));
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ favorites: true, sidebarFavorites: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  const favoritesPanel = page.locator(".sf-recent-sidebar", { has: page.getByText("收藏文件", { exact: true }) });
  await expect(favoritesPanel.locator(".sf-sidebar-section-content > div > button")).toHaveCount(5);
  await expect(favoritesPanel.locator(".sf-sidebar-overflow")).toHaveText("+2 项未展开");
  await expect(favoritesPanel.locator(".sf-sidebar-section-link")).toHaveAttribute("href", /collection=favorites/);
});

test("removes a recent entry that disappeared outside SoFinder", async ({ page }) => {
  let recent = [{ path: "missing/file.txt", touchedAt: 1 }];
  let forgotten = false;
  await page.route("**/sofinder/api/metadata**", async route => {
    if (route.request().method() === "PATCH") {
      const body = route.request().postDataJSON() as { action: string };
      if (body.action === "forget") { recent = []; forgotten = true; }
    }
    await route.fulfill({ json: { success: true, data: { favorites: [], tags: {}, recent } } });
  });
  await page.route("**/sofinder/api/entries?*", async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("path") === "missing") {
      await route.fulfill({ status: 404, json: { success: false, error: { code: "not_found", message: "Missing" } } });
      return;
    }
    await route.fallback();
  });
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ recent: true })));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await page.locator(".sf-recent-sidebar").getByRole("button", { name: /file\.txt/ }).click();
  await expect(page.getByRole("alert")).toContainText("该最近使用文件已不存在，已从列表移除。");
  await expect(page.locator(".sf-recent-sidebar").getByText("暂无最近使用；选择或打开文件后会显示在这里。")).toBeVisible();
  expect(forgotten).toBe(true);
});

test("does not let browser preferences re-enable host-disabled features", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ recent: true, tags: true, archive: true, qrCode: true, sidebarQuickAccess: true, quickAccessFiles: true })));
  const restricted = { ...config, featureAvailability: { folderTree: true, recent: false, favorites: true, quickAccess: false, quickAccessFiles: true, tags: false, archive: false, trash: true, qrCode: false } };
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify(restricted)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await expect(settings.getByText("最近使用", { exact: true })).toHaveCount(0);
  await expect(settings.getByText("标签", { exact: true })).toHaveCount(0);
  await expect(settings.getByText("打包下载", { exact: true })).toHaveCount(0);
  await expect(settings.getByText("文件网址 QR Code", { exact: true })).toHaveCount(0);
  await expect(settings.getByRole("checkbox", { name: "显示固定文件夹" })).toHaveCount(0);
  await settings.getByRole("button", { name: "完成" }).click();
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: "固定到侧栏" })).toHaveCount(0);
});

test("supports keyboard selection and keeps the picker confirmation bar compact", async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 740 });
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder picker</title></head><body><main id="sofinder-root" data-config='${JSON.stringify({ ...config, selectMode: true, selectionKind: "any", uiDefaults: { ...config.uiDefaults, mode: "picker" } })}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  const first = page.locator(".sf-entry").first();
  await expect(first).toBeVisible();
  await first.focus();
  await page.keyboard.press("ArrowRight");
  const selected = page.locator('.sf-entry[aria-selected="true"]');
  await expect(selected).toHaveCount(1);
  await expect(page.locator(".sf-picker-bar")).toBeVisible();
  await expect(page.getByRole("button", { name: "新建文件夹" })).toBeVisible();
  await expect(page.getByRole("button", { name: "上传", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "重命名" })).toHaveCount(0);
  await page.evaluate(() => window.addEventListener("sofinder:select", event => {
    (window as Window & { pickerEntry?: unknown }).pickerEntry = (event as CustomEvent).detail;
  }));
  await page.getByRole("button", { name: "选择", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { pickerEntry?: unknown }).pickerEntry)).toMatchObject({ resource: "Files", path: "guide.txt", width: null, height: null, mimeType: "text/plain" });
  const bounds = await page.locator(".sf-picker-bar").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(560);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
});

test("locks a resource-scoped picker against resource navigation", async ({ page }) => {
  await page.route("http://sofinder.test/sofinder/api/config", route => route.fulfill({ json: { success: true, data: {
    apiVersion: "1.0",
    resources: [
      { name: "Files", publicUrl: "/files", allowedExtensions: ["txt"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 0, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true } },
      { name: "Images", publicUrl: "/images", allowedExtensions: ["png"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 0, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true } },
    ],
    plugins: [], imagePresets: {}, imageCapabilities: { driver: "auto", formats: [] },
  } } }));
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>Scoped picker</title></head><body><main id="sofinder-root" data-config='${JSON.stringify({ ...config, selectMode: true, pickerResource: "Files", uiDefaults: { ...config.uiDefaults, mode: "picker" } })}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await expect(page.getByText("guide.txt").first()).toBeVisible();
  await expect(page.locator(".sf-sidebar")).toHaveCount(0);
  await page.evaluate(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("type", "Images");
    history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect.poll(() => page.evaluate(() => new URL(window.location.href).searchParams.get("type"))).toBe("Files");

  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>Unlocked picker</title></head><body><main id="sofinder-root" data-config='${JSON.stringify({ ...config, selectMode: true, pickerResource: null, uiDefaults: { ...config.uiDefaults, mode: "picker" } })}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.locator(".sf-sidebar")).toBeVisible();
  await expect(page.getByRole("button", { name: "图片" })).toBeVisible();
});

test("keeps picker selection while exposing full ACL-controlled tools", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder full picker</title></head><body><main id="sofinder-root" data-config='${JSON.stringify({ ...config, selectMode: true, selectionKind: "image", uiDefaults: { ...config.uiDefaults, mode: "picker", fullTools: true } })}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("photo.png").first()).toBeVisible();
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();

  await expect(page.locator(".sf-picker-bar")).toBeVisible();
  await expect(page.getByRole("button", { name: "重命名", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "复制", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "移动" })).toBeVisible();
  await expect(page.getByRole("button", { name: "删除" })).toBeVisible();
  await expect(page.getByRole("button", { name: "图片编辑" })).toBeVisible();
  await expect(page.locator(".sf-details")).toBeVisible();
  await page.evaluate(() => window.addEventListener("sofinder:select", event => {
    (window as Window & { pickerImage?: unknown }).pickerImage = (event as CustomEvent).detail;
  }));
  await page.locator(".sf-picker-bar").getByRole("button", { name: "选择" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { pickerImage?: unknown }).pickerImage)).toMatchObject({ resource: "Files", path: "photo.png", width: 1200, height: 400 });
});

test("keeps image thumbnails inside list rows", async ({ page }) => {
  await page.getByRole("button", { name: "查看" }).click();
  await page.getByRole("menuitemradio", { name: "列表", exact: true }).click();
  const entry = page.locator(".sf-entry", { hasText: "photo.png" });
  const thumbnail = entry.locator(".sf-entry-icon img");
  await expect(thumbnail).toBeVisible();
  const boxes = await Promise.all([entry.boundingBox(), thumbnail.boundingBox()]);
  expect(boxes[0]).not.toBeNull();
  expect(boxes[1]).not.toBeNull();
  expect(boxes[1]!.height).toBeLessThanOrEqual(32);
  expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.y);
  expect(boxes[1]!.y + boxes[1]!.height).toBeLessThanOrEqual(boxes[0]!.y + boxes[0]!.height);
});

test("keeps portrait thumbnails inside grid preview cells", async ({ page }) => {
  const entry = page.locator(".sf-entry", { hasText: "photo.png" });
  const preview = entry.locator(".sf-entry-icon");
  const thumbnail = preview.locator("img");
  await expect(thumbnail).toBeVisible();
  const [entryBox, previewBox, thumbnailBox] = await Promise.all([entry.boundingBox(), preview.boundingBox(), thumbnail.boundingBox()]);
  expect(entryBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(thumbnailBox).not.toBeNull();
  expect(previewBox!.height).toBe(90);
  expect(thumbnailBox!.height).toBeLessThanOrEqual(90);
  expect(thumbnailBox!.y).toBeGreaterThanOrEqual(previewBox!.y);
  expect(thumbnailBox!.y + thumbnailBox!.height).toBeLessThanOrEqual(previewBox!.y + previewBox!.height);
  expect(previewBox!.y + previewBox!.height).toBeLessThanOrEqual(entryBox!.y + entryBox!.height);

  await entry.click();
  const detailPreview = page.locator(".sf-details .sf-preview");
  const detailThumbnail = detailPreview.locator("img");
  await expect(detailThumbnail).toBeVisible();
  const [detailPreviewBox, detailThumbnailBox] = await Promise.all([detailPreview.boundingBox(), detailThumbnail.boundingBox()]);
  expect(detailPreviewBox).not.toBeNull();
  expect(detailThumbnailBox).not.toBeNull();
  expect(detailThumbnailBox!.x).toBeGreaterThanOrEqual(detailPreviewBox!.x);
  expect(detailThumbnailBox!.y).toBeGreaterThanOrEqual(detailPreviewBox!.y);
  expect(detailThumbnailBox!.x + detailThumbnailBox!.width).toBeLessThanOrEqual(detailPreviewBox!.x + detailPreviewBox!.width);
  expect(detailThumbnailBox!.y + detailThumbnailBox!.height).toBeLessThanOrEqual(detailPreviewBox!.y + detailPreviewBox!.height);
  await expect(detailThumbnail).toHaveAttribute("src", /path=photo\.png/);
});

test("keeps crop corner and side handles reachable for wide images", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  await expect(page.getByRole("combobox", { name: "比例" })).toBeVisible();
  const cropper = page.locator(".cropper-container");
  await expect(cropper).toBeVisible();
  for (const [handle, cursor] of [
    ["nw", "nwse-resize"], ["ne", "nesw-resize"],
    ["se", "nwse-resize"], ["sw", "nesw-resize"],
    ["w", "ew-resize"], ["e", "ew-resize"],
  ] as const) {
    await expect(page.locator(`.cropper-point.point-${handle}`)).toHaveCSS("cursor", cursor);
  }

  const width = page.getByRole("spinbutton", { name: "宽度" });
  const height = page.getByRole("spinbutton", { name: "高度" });
  const initialWidth = await width.inputValue();
  const initialHeight = await height.inputValue();
  const northWest = await page.locator(".cropper-point.point-nw").boundingBox();
  expect(northWest).not.toBeNull();
  await page.mouse.move(northWest!.x + northWest!.width / 2, northWest!.y + northWest!.height / 2);
  await page.mouse.down();
  await page.mouse.move(northWest!.x + northWest!.width / 2 + 40, northWest!.y + northWest!.height / 2 + 25);
  await page.mouse.up();
  await expect(width).not.toHaveValue(initialWidth);
  await expect(height).not.toHaveValue(initialHeight);

  await page.getByRole("button", { name: "重置" }).click();
  await expect(width).toHaveValue(initialWidth);
  await expect(height).toHaveValue(initialHeight);
  const east = await page.locator(".cropper-point.point-e").boundingBox();
  expect(east).not.toBeNull();
  await page.mouse.move(east!.x + east!.width / 2, east!.y + east!.height / 2);
  await page.mouse.down();
  await page.mouse.move(east!.x + east!.width / 2 - 80, east!.y + east!.height / 2);
  await page.mouse.up();
  await expect(width).not.toHaveValue(initialWidth);
  await expect(height).toHaveValue(initialHeight);

  const currentBox = await page.locator(".cropper-crop-box").boundingBox();
  const containerBox = await cropper.boundingBox();
  expect(currentBox).not.toBeNull();
  expect(containerBox).not.toBeNull();
  const startX = currentBox!.x + currentBox!.width + 12;
  const startY = currentBox!.y + 70;
  const endX = Math.min(containerBox!.x + containerBox!.width - 15, startX + 45);
  const endY = startY + 100;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 1, startY + 1);
  await page.mouse.move(endX, endY);
  await page.mouse.up();
  await page.waitForTimeout(50);
  const redrawn = await page.locator(".cropper-crop-box").boundingBox();
  expect(redrawn).not.toBeNull();
  expect(Math.abs(redrawn!.x - startX)).toBeLessThanOrEqual(2);
  expect(Math.abs(redrawn!.y - startY)).toBeLessThanOrEqual(2);
  expect(Math.abs(redrawn!.x + redrawn!.width - endX)).toBeLessThanOrEqual(10);
  expect(Math.abs(redrawn!.y + redrawn!.height - endY)).toBeLessThanOrEqual(10);
});

test("lets the server auto-rename the default edited copy", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  await expect(page.getByRole("textbox", { name: "文件名" })).toHaveValue("photo-edited");
  await expect(page.getByRole("dialog").getByText(".png", { exact: true })).toBeVisible();
  await page.getByRole("spinbutton", { name: "宽度" }).fill("1000");

  const requestPromise = page.waitForRequest(request => request.url().endsWith("/sofinder/api/images/edit") && request.method() === "PATCH");
  await page.getByRole("dialog").getByRole("button", { name: "保存" }).click();
  const request = await requestPromise;
  const body = request.postDataJSON() as { save: { mode: string; name?: string } };
  expect(body.save).toEqual({ mode: "copy" });
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("exposes compression and watermark controls in the image editor", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await expect(page.getByRole("button", { name: "压缩 / 水印" })).toHaveCount(0);
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("压缩 / 水印", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  const dialog = page.getByRole("dialog", { name: /图片编辑/ });
  await dialog.getByRole("button", { name: "水印" }).click();
  await dialog.getByLabel("水印类型").selectOption("text");
  await dialog.getByLabel("水印文字", { exact: true }).fill("内部资料");
  await expect(dialog.getByLabel("字体")).toHaveValue("interface");
  await dialog.getByLabel("字体").selectOption("serif");
  await dialog.getByLabel(/透明度/).fill("45");

  const requestPromise = page.waitForRequest(request => request.url().endsWith("/sofinder/api/images/edit") && request.method() === "PATCH");
  await dialog.getByRole("button", { name: "保存" }).click();
  const body = requestPromise.then(request => request.postDataJSON() as { actions: Array<Record<string, unknown>>; save: { mode: string } });
  await expect.poll(async () => (await body).actions[0]).toMatchObject({ type: "watermarkText", text: "内部资料", font: "serif", opacity: 45, position: "bottom-right", quality: 100 });
  expect((await body).save).toEqual({ mode: "copy" });
});

test("refreshes the editor source whenever the image is reopened", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  const firstDialog = page.getByRole("dialog", { name: /图片编辑/ });
  const firstSource = await firstDialog.locator(".sf-editor-canvas img[src*='/sofinder/api/content']").first().getAttribute("src");
  expect(firstSource).toContain("&v=2-68-");
  await firstDialog.getByRole("button", { name: "关闭" }).click();

  await page.getByRole("button", { name: "图片编辑" }).click();
  const secondDialog = page.getByRole("dialog", { name: /图片编辑/ });
  const secondSource = await secondDialog.locator(".sf-editor-canvas img[src*='/sofinder/api/content']").first().getAttribute("src");
  expect(secondSource).toContain("&v=2-68-");
  expect(secondSource).not.toBe(firstSource);
});

test("previews and freely drags an image watermark", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("压缩 / 水印", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  const dialog = page.getByRole("dialog", { name: /图片编辑/ });
  await dialog.getByRole("button", { name: "水印" }).click();
  await dialog.getByLabel("水印类型").selectOption("image");
  await dialog.getByLabel("水印图片路径").fill("photo.png");

  const preview = dialog.locator(".sf-watermark-preview img");
  await expect(preview).toBeVisible();
  const marker = dialog.getByRole("button", { name: "拖动水印" });
  const layer = dialog.locator(".sf-watermark-layer");
  const bounds = await marker.boundingBox();
  const layerBounds = await layer.boundingBox();
  expect(bounds).not.toBeNull();
  expect(layerBounds).not.toBeNull();
  // The 3:1 watermark and image fixture must remain at 25% in both axes,
  // even though the editor canvas itself is responsively scaled.
  expect(bounds!.width).toBeCloseTo(layerBounds!.width * 0.25, 0);
  expect(bounds!.height).toBeCloseTo(layerBounds!.height * 0.25, 0);
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 - 80, bounds!.y + bounds!.height / 2 - 40);
  await page.mouse.up();
  await expect(dialog.getByLabel("位置")).toHaveValue("custom");

  const requestPromise = page.waitForRequest(request => request.url().endsWith("/sofinder/api/images/edit") && request.method() === "PATCH");
  await dialog.getByRole("button", { name: "保存" }).click();
  const body = await requestPromise.then(request => request.postDataJSON() as { actions: Array<Record<string, unknown>> });
  expect(body.actions[0]).toMatchObject({ type: "watermarkImage", path: "photo.png", position: "custom", quality: 100 });
  expect(Number(body.actions[0].x)).toBeLessThan(100);
  expect(Number(body.actions[0].y)).toBeLessThan(100);
});

test("blocks unsafe crop copy names before saving", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox", { name: "文件名" }).fill("CON");

  await expect(dialog.getByRole("alert")).toContainText("名称不能使用系统保留名");
  await expect(dialog.getByRole("button", { name: "保存" })).toBeDisabled();
});

test("keeps the crop editor open and presents save errors", async ({ page }) => {
  await page.route("**/sofinder/api/images/edit", route => route.fulfill({
    status: 415,
    json: { success: false, error: { code: "invalid_extension", message: "This file extension is not allowed." } },
  }));
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "图片编辑" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("spinbutton", { name: "宽度" }).fill("1000");
  await dialog.getByRole("button", { name: "保存" }).click();

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText("This file extension is not allowed.");
  await expect(dialog.getByRole("button", { name: "保存" })).toBeEnabled();
});

test("navigates cursor pages with unknown totals", async ({ page }) => {
  await page.getByRole("button", { name: /下一页/ }).click();
  await expect(page.getByText("later.txt")).toBeVisible();
  await expect(page.locator(".sf-page-indicator")).toContainText("第2");
  await page.getByRole("button", { name: /上一页/ }).click();
  await expect(page.getByText("guide.txt").first()).toBeVisible();
});

test("accepts and persists a bounded page size", async ({ page }) => {
  const pageSize = page.getByRole("spinbutton", { name: "每页数量 (10–500)" });
  await expect(pageSize).toHaveValue("100");
  await expect(pageSize).toHaveAttribute("min", "10");
  await expect(pageSize).toHaveAttribute("max", "500");

  const request = page.waitForRequest(candidate => {
    const url = new URL(candidate.url());
    return url.pathname === "/sofinder/api/entries" && url.searchParams.get("limit") === "25";
  });
  await pageSize.fill("25");
  await pageSize.press("Enter");
  expect(new URL((await request).url()).searchParams.get("offset")).toBe("0");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.pageSize.v1"))).toBe("25");

  const boundedRequest = page.waitForRequest(candidate => {
    const url = new URL(candidate.url());
    return url.pathname === "/sofinder/api/entries" && url.searchParams.get("limit") === "500";
  });
  await pageSize.fill("999");
  await pageSize.press("Enter");
  await boundedRequest;
  await expect(pageSize).toHaveValue("500");
});

test("warns when the current storage deletes permanently", async ({ page }) => {
  await page.route("**/sofinder/api/config", async route => {
    await route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "", allowedExtensions: ["txt"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "proxy", storageCapabilities: { search: false, sort: false, cursorPagination: true, atomicMove: false, nativeCopy: true, recoverableDelete: false, publicUrl: false } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "", formats: [] } } } });
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();
  await expect(page.locator(".sf-toolbar").getByRole("button", { name: "回收站" })).toHaveCount(0);
  const scope = page.getByRole("combobox", { name: "搜索范围" });
  await expect(scope.locator('option[value="name"]')).toBeDisabled();
  await scope.selectOption("tags");
  await expect(page.getByRole("textbox", { name: "搜索标签（多个标签用逗号分隔）" })).toBeEnabled();
  await page.waitForTimeout(350);
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await page.getByRole("button", { name: "删除" }).click();
  await expect(page.getByText("此存储不提供回收站，本操作无法撤销。")).toBeVisible();
  await page.getByRole("button", { name: "取消" }).click();
});

test("right-click preview opens a preview without selecting the file", async ({ page }) => {
  await page.evaluate(() => {
    (window as Window & { selectionEvents?: number }).selectionEvents = 0;
    window.addEventListener("sofinder:select", () => (window as Window & { selectionEvents?: number }).selectionEvents = ((window as Window & { selectionEvents?: number }).selectionEvents || 0) + 1);
  });
  await page.locator(".sf-entry", { hasText: "photo.png" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  await expect(page.getByRole("dialog", { name: "photo.png" })).toBeVisible();
  await expect(page.locator(".sf-file-preview-content img")).toHaveAttribute("src", /\/sofinder\/api\/images\/thumbnail\?.*path=photo\.png/);
  await expect(page.locator(".sf-file-preview-meta time")).toHaveAttribute("datetime", "1970-01-01T00:00:02.000Z");
  const preview = page.getByRole("dialog", { name: "photo.png" });
  await preview.getByRole("button", { name: "原始大小（1:1）" }).click();
  const original = preview.locator(".sf-image-original-canvas img");
  await expect(original).toHaveAttribute("src", /\/sofinder\/api\/content\?.*path=photo\.png.*disposition=inline/);
  await expect.poll(() => original.evaluate(image => ({ naturalWidth: (image as HTMLImageElement).naturalWidth, clientWidth: (image as HTMLImageElement).clientWidth }))).toEqual({ naturalWidth: 1200, clientWidth: 1200 });
  const originalViewport = preview.locator(".sf-file-preview-content");
  await expect.poll(() => originalViewport.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await preview.getByRole("button", { name: "200%" }).click();
  await expect.poll(() => original.evaluate(image => (image as HTMLImageElement).clientWidth)).toBe(2400);
  await preview.getByRole("button", { name: "图片居中" }).click();
  await expect.poll(() => originalViewport.evaluate(element => element.scrollLeft > 0)).toBe(true);
  await preview.getByRole("button", { name: "50%" }).click();
  await expect.poll(() => original.evaluate(image => (image as HTMLImageElement).clientWidth)).toBe(600);
  await originalViewport.dispatchEvent("wheel", { deltaY: -100, ctrlKey: true });
  await expect.poll(() => original.evaluate(image => (image as HTMLImageElement).clientWidth)).toBe(1200);
  await originalViewport.dblclick();
  await expect(original).toHaveAttribute("src", /\/sofinder\/api\/images\/thumbnail/);
  await originalViewport.dblclick();
  await expect(original).toHaveAttribute("src", /\/sofinder\/api\/content/);
  await preview.getByRole("button", { name: "适应窗口" }).click();
  await expect(page.locator(".sf-file-preview-content img")).toHaveAttribute("src", /\/sofinder\/api\/images\/thumbnail/);
  await preview.getByRole("button", { name: "全屏" }).click();
  await expect(preview).toHaveClass(/sf-modal-fullscreen/);
  await expect(preview.getByRole("button", { name: "退出全屏" })).toBeVisible();
  const viewport = page.viewportSize();
  const fullscreenBox = await preview.boundingBox();
  expect(fullscreenBox?.x).toBe(0);
  expect(fullscreenBox?.y).toBe(0);
  expect(fullscreenBox?.width).toBe(viewport?.width);
  expect(fullscreenBox?.height).toBe(viewport?.height);
  await page.keyboard.press("Escape");
  await expect(preview).not.toHaveClass(/sf-modal-fullscreen/);
  await expect(preview).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as Window & { selectionEvents?: number }).selectionEvents)).toBe(0);
});

test("asks before loading a very large original image", async ({ page }) => {
  let originalRequests = 0;
  await page.route("**/sofinder/api/images/info**", route => route.fulfill({ json: { success: true, data: { width: 10000, height: 5000, format: "png", mimeType: "image/png", editable: true } } }));
  await page.route("**/sofinder/api/content**", async route => {
    originalRequests++;
    await route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="10000" height="5000"/>' });
  });
  await page.locator(".sf-entry", { hasText: "photo.png" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  const preview = page.getByRole("dialog", { name: "photo.png" });
  const actual = preview.getByRole("button", { name: "原始大小（1:1）" });
  await expect(actual).toBeEnabled();
  await actual.click();
  await expect(preview.getByRole("alertdialog")).toContainText("加载原图可能占用较多内存");
  expect(originalRequests).toBe(0);
  await preview.getByRole("button", { name: "加载原图" }).click();
  await expect.poll(() => originalRequests).toBe(1);
});

test("retries a failed original image request", async ({ page }) => {
  let originalRequests = 0;
  await page.route("**/sofinder/api/content**", async route => {
    originalRequests++;
    if (originalRequests === 1) await route.fulfill({ status: 500, body: "failed" });
    else await route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"/>' });
  });
  await page.locator(".sf-entry", { hasText: "photo.png" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  const preview = page.getByRole("dialog", { name: "photo.png" });
  await preview.getByRole("button", { name: "原始大小（1:1）" }).click();
  await expect(preview.getByRole("alert")).toContainText("图片加载失败");
  await preview.getByRole("button", { name: "重试" }).click();
  await expect(preview.locator(".sf-image-original-canvas img")).toHaveAttribute("src", /retry=1/);
  await expect.poll(() => originalRequests).toBe(2);
  await expect(preview.getByRole("alert")).toHaveCount(0);
});

test("opens context-menu downloads in a new browsing context", async ({ page }) => {
  await page.evaluate(() => {
    (window as Window & { openedDownload?: { url: string; target: string; features: string } }).openedDownload = undefined;
    window.open = ((url?: string | URL, target?: string, features?: string) => {
      (window as Window & { openedDownload?: { url: string; target: string; features: string } }).openedDownload = { url: String(url || ""), target: target || "", features: features || "" };
      return null;
    }) as typeof window.open;
  });
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "下载" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { openedDownload?: { url: string; target: string; features: string } }).openedDownload)).toEqual({
    url: "/uploads/editor/files/guide.txt",
    target: "_blank",
    features: "noopener,noreferrer",
  });
});

test("previews bounded text and calculates a checksum", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  const dialog = page.getByRole("dialog", { name: "guide.txt" });
  await expect(dialog.getByText("SoFinder local preview")).toBeVisible();
  await dialog.getByRole("button", { name: "计算校验值" }).click();
  await expect(dialog.locator(".sf-checksum")).toHaveText("a".repeat(64));
});

test("previews and submits a deterministic batch rename", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await page.locator(".sf-entry", { hasText: "photo.png" }).click({ modifiers: ["Control"] });
  await expect(page.getByRole("button", { name: "批量重命名" })).toHaveCount(0);
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("批量重命名", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await page.getByRole("button", { name: "批量重命名" }).click();
  const dialog = page.getByRole("dialog", { name: "批量重命名" });
  const pattern = dialog.getByRole("textbox", { name: "名称规则" });
  const hint = dialog.getByText(/使用 \{name\}/);
  const patternBox = await pattern.boundingBox();
  const hintBox = await hint.boundingBox();
  expect(patternBox).not.toBeNull();
  expect(hintBox).not.toBeNull();
  expect(patternBox!.height).toBeGreaterThanOrEqual(38);
  expect(hintBox!.y).toBeGreaterThanOrEqual(patternBox!.y + patternBox!.height);
  await expect(dialog.locator(".sf-bulk-rename-pattern")).toHaveCSS("display", "grid");
  await expect(dialog.locator(".sf-rename-preview")).toHaveCSS("border-top-style", "solid");
  await expect(dialog.getByRole("cell", { name: "guide-1.txt" })).toBeVisible();
  await expect(dialog.getByRole("cell", { name: "photo-2.png" })).toBeVisible();
  await dialog.getByRole("button", { name: "重命名", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("2 项完成");
});

test("uses file upload by default and offers folder upload from one control", async ({ page }) => {
  await expect(page.getByRole("button", { name: "上传", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "上传文件夹", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "上传选项" }).click();
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem", { name: "上传文件", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "上传文件夹", exact: true })).toBeVisible();
  await expect(page.locator('input[type="file"][webkitdirectory]')).toHaveCount(1);
});

test("asks the user to rename, overwrite or skip a same-name upload", async ({ page }) => {
  let attempts = 0;
  await page.route("**/sofinder/api/uploads", async route => {
    attempts++;
    if (attempts === 1) {
      await route.fulfill({ status: 409, json: { success: false, error: { code: "conflict", message: "Conflict" } } });
      return;
    }
    expect(route.request().postData()).toContain('name="autoRename"');
    await route.fulfill({ status: 201, json: { success: true, data: { entry: { path: "guide(1).txt", name: "guide(1).txt", directory: false, size: 3, modifiedAt: 5, mimeType: "text/plain", url: "/uploads/editor/files/guide(1).txt", capabilities: {} } } } });
  });

  await page.locator('input[type="file"]:not([webkitdirectory])').setInputFiles({ name: "guide.txt", mimeType: "text/plain", buffer: Buffer.from("new") });
  const conflict = page.getByRole("dialog", { name: "已存在同名文件" });
  await expect(conflict.getByRole("button", { name: "自动改名" })).toBeVisible();
  await expect(conflict.getByRole("button", { name: "覆盖" })).toBeVisible();
  await expect(conflict.getByRole("button", { name: "跳过" })).toBeVisible();
  await conflict.getByRole("button", { name: "自动改名" }).click();
  await expect(page.getByText("已完成", { exact: true })).toBeVisible();
  expect(attempts).toBe(2);
});

test("lets each user configure the default same-name upload strategy", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await expect(settings.getByRole("radio", { name: "每次由我选择" })).toBeChecked();
  await settings.getByRole("radio", { name: "跳过" }).check();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.uploadConflictStrategy.v1"))).toBe("skip");
});

test("uses the host-only lowercase upload extension policy", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("sofinder.lowercaseUploadExtensions.v1", "false"));
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await expect(page.getByText("guide.txt").first()).toBeVisible();
  const uploadedNames: string[] = [];
  await page.route("**/sofinder/api/uploads", async route => {
    const body = route.request().postData() || "";
    const match = body.match(/filename="([^"]+)"/);
    uploadedNames.push(match?.[1] || "");
    const name = uploadedNames.at(-1) || "unknown";
    await route.fulfill({ status: 201, json: { success: true, data: { entry: { path: name, name, directory: false, size: 3, modifiedAt: 5, mimeType: "application/octet-stream", url: `/uploads/editor/files/${name}`, capabilities: {} } } } });
  });

  const input = page.locator('input[type="file"]:not([webkitdirectory])');
  await input.setInputFiles({ name: "Report.XLSX", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer: Buffer.from("one") });
  await expect.poll(() => uploadedNames.length).toBe(1);
  expect(uploadedNames[0]).toBe("Report.xlsx");

  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  await expect(page.getByRole("dialog", { name: "设置" }).getByText(/扩展名.*小写/)).toHaveCount(0);
});

test("marks a same-name upload as skipped without retrying it", async ({ page }) => {
  let attempts = 0;
  await page.route("**/sofinder/api/uploads", async route => {
    attempts++;
    await route.fulfill({ status: 409, json: { success: false, error: { code: "conflict", message: "Conflict" } } });
  });
  await page.locator('input[type="file"]:not([webkitdirectory])').setInputFiles({ name: "guide.txt", mimeType: "text/plain", buffer: Buffer.from("new") });
  await page.getByRole("dialog", { name: "已存在同名文件" }).getByRole("button", { name: "跳过" }).click();
  await expect(page.getByText("已跳过", { exact: true }).first()).toBeVisible();
  expect(attempts).toBe(1);
});

test("uses a configured overwrite strategy on the first request", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("radio", { name: "覆盖" }).check();
  await settings.getByRole("button", { name: "完成" }).click();
  let attempts = 0;
  await page.route("**/sofinder/api/uploads", async route => {
    attempts++;
    expect(route.request().postData()).toContain('name="overwrite"');
    await route.fulfill({ status: 201, json: { success: true, data: { entry: { path: "guide.txt", name: "guide.txt", directory: false, size: 3, modifiedAt: 5, mimeType: "text/plain", url: "/uploads/editor/files/guide.txt", capabilities: {} } } } });
  });
  await page.locator('input[type="file"]:not([webkitdirectory])').setInputFiles({ name: "guide.txt", mimeType: "text/plain", buffer: Buffer.from("new") });
  await expect(page.getByText("已完成", { exact: true })).toBeVisible();
  expect(attempts).toBe(1);
});

test("previews a folder upload before creating directories", async ({ page }) => {
  await page.locator('input[type="file"][webkitdirectory]').evaluate((input: HTMLInputElement) => {
    const file = new File(["preview"], "guide.txt", { type: "text/plain" });
    Object.defineProperty(file, "webkitRelativePath", { value: "sample/nested/guide.txt" });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    Object.defineProperty(input, "files", { configurable: true, value: transfer.files });
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  const dialog = page.getByRole("dialog", { name: "上传文件夹" });
  await expect(dialog).toContainText("1 文件 · 2 文件夹");
  await expect(dialog).toContainText("顶层文件夹: sample");
  await dialog.getByRole("button", { name: "取消" }).click();
});

test("keeps destination selection open when a folder disappears concurrently", async ({ page }) => {
  const rootEntries = [
    { path: "guide.txt", name: "guide.txt", directory: false, size: 12, modifiedAt: 1, mimeType: "text/plain", url: "/uploads/editor/files/guide.txt", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
    { path: "gone", name: "gone", directory: true, size: 0, modifiedAt: 1, mimeType: null, url: null, capabilities: { read: true, copy: true, move: true, delete: true } },
  ];
  await page.route("**/sofinder/api/entries?*", async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("path") === "gone") {
      await route.fulfill({ status: 404, json: { success: false, error: { code: "not_found", message: "Missing" } } });
      return;
    }
    await route.fulfill({ json: { success: true, data: { entries: rootEntries, total: 2, path: "", offset: 0, limit: 100, nextCursor: null, sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
  });
  await page.setContent(`<!doctype html><html lang="zh-CN"><body><main id="sofinder-root" data-config='${JSON.stringify(config)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  await page.locator(".sf-entry", { hasText: "guide.txt" }).click();
  await page.getByRole("button", { name: "复制", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "复制到文件夹" });
  await dialog.getByRole("button", { name: "gone" }).click();

  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("已选文件夹: /");
  await expect(page.getByRole("alert")).toContainText("目标文件夹已不存在，请从根目录重新选择。");
});

test("returns stale deep links to the root without making the folder tree repeat the missing request", async ({ page }) => {
  let missingRequests = 0;
  await page.route("**/sofinder/api/entries?*", async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("path") !== "missing-folder") {
      await route.fallback();
      return;
    }
    missingRequests += 1;
    await route.fulfill({ status: 404, json: { success: false, error: { code: "not_found", message: "The requested entry was not found." } } });
  });
  const staleConfig = { ...config, initialPath: "missing-folder", featureDefaults: { folderTree: true } };
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify(staleConfig)}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });

  await expect(page.getByRole("alert")).toContainText("该文件夹已不存在，已返回根目录。");
  await expect(page.getByText("guide.txt").first()).toBeVisible();
  await expect.poll(() => missingRequests).toBe(1);
  await expect.poll(() => new URL(page.url()).searchParams.get("path")).toBeNull();
});

test("switches language and remembers the choice", async ({ page }) => {
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByLabel("语言").selectOption("zh-tw");
  await expect(page.getByRole("button", { name: /新增資料夾/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.language"))).toBe("zh-tw");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
  await page.getByLabel("語言").selectOption("en");
  await expect(page.getByRole("button", { name: /New folder/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.language"))).toBe("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("asks how to resolve a recycle-bin restore conflict", async ({ page }) => {
  await expect(page.locator(".sf-toolbar").getByRole("button", { name: "回收站" })).toHaveCount(0);
  await page.locator(".sf-sidebar").getByRole("button", { name: "回收站" }).click();
  await page.getByRole("button", { name: "恢复" }).click();
  const conflict = page.getByRole("dialog", { name: "原位置已经存在同名项目" });
  await expect(conflict).toBeVisible();
  await conflict.getByRole("button", { name: "自动改名恢复" }).click();
  await expect(conflict).toBeHidden();
});

test("treats non-web image formats as ordinary files and blocks image selection", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify({ ...config, selectMode: true, selectionKind: "image", uiDefaults: { ...config.uiDefaults, mode: "picker" } })}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  const heic = page.locator(".sf-entry", { hasText: "camera.heic" });
  await expect(heic).toBeVisible();
  await expect(page.getByRole("button", { name: "新建文件夹" })).toBeVisible();
  await expect(page.getByRole("button", { name: "上传", exact: true })).toBeVisible();
  await expect(heic.locator("img")).toHaveCount(0);
  await heic.click();
  await expect(page.getByRole("button", { name: "选择" })).toBeDisabled();
  await expect(page.getByText("此图片格式不能直接用于网页内容。")).toBeVisible();
  await heic.click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: "选择" })).toBeDisabled();
  await expect(page.getByRole("menuitem", { name: "删除" })).toHaveCount(0);
});
