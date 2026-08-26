import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

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
    if (url.pathname === "/sofinder/api/config") {
      await route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/uploads/editor/files", allowedExtensions: ["txt", "png", "heic", "pdf"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: [{ name: "document-preview", version: "1.0.0", capabilities: ["preview.pdf"], previewers: [{ id: "pdf", mimeTypes: ["application/pdf"], extensions: ["pdf"], url: "/sofinder/api/preview/document" }] }], imagePresets: {}, imageCapabilities: { driver: "auto", formats: [{ format: "png", extensions: ["png"], mimes: ["image/png"], processor: "gd", read: true, edit: true, thumbnail: true, webEmbeddable: true }] } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/security/status") {
      await route.fulfill({ json: { success: true, data: { malwareScanning: { enabled: false, provider: null, status: "disabled", message: "Malware scanning is not enabled.", counts: { passed: 0, quarantined: 0, failed: 0, pending: 0 }, recent: [] } } } });
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
  await page.getByRole("button", { name: "复制网址" }).click();
  const url = page.getByRole("dialog", { name: "文件网址" }).getByRole("textbox", { name: "文件网址" });
  await expect(url).toHaveValue("http://sofinder.test/uploads/editor/files/guide.txt");
  await url.click();
  await expect(page.getByRole("dialog", { name: "文件网址" }).getByRole("status")).toContainText("网址已复制");
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
  await page.getByRole("button", { name: "复制网址" }).click();

  const dialog = page.getByRole("dialog", { name: "临时文件网址" });
  await expect(dialog.getByRole("textbox", { name: "临时文件网址" })).toHaveValue("http://sofinder.test/sofinder/signed/test-token");
  await expect(dialog.getByText("失效时间")).toBeVisible();
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
  await page.getByRole("button", { name: "复制网址" }).click();

  await expect(page.getByRole("dialog", { name: "文件网址" }).getByRole("textbox")).toHaveValue("http://sofinder.test/uploads/editor/files/guide.txt");
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
});

test("opens PDF files through the registered same-origin previewer", async ({ page }) => {
  await expect(page.locator(".sf-entry", { hasText: "manual.pdf" }).locator(".sf-entry-icon svg")).toHaveClass("sf-file-icon-pdf");
  await page.locator(".sf-entry", { hasText: "manual.pdf" }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "预览" }).click();
  const frame = page.getByRole("dialog", { name: "manual.pdf" }).locator("iframe.sf-document-preview");
  await expect(frame).not.toHaveAttribute("sandbox", /.+/);
  await expect(frame).toHaveAttribute("src", /\/sofinder\/api\/preview\/document\?resource=Files&path=manual\.pdf/);
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
  await page.getByRole("button", { name: "列表" }).click();
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

test("persists independent grid and list entry sizes", async ({ page }) => {
  await expect(page.locator(".sf-entry", { hasText: "photo.png" }).locator(".sf-entry-icon")).toHaveCSS("height", "90px");
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  let settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("radiogroup", { name: "网格项目大小" }).getByRole("radio", { name: "大" }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-entry", { hasText: "photo.png" }).locator(".sf-entry-icon")).toHaveCSS("height", "132px");

  await page.getByRole("button", { name: "列表" }).click();
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByRole("radiogroup", { name: "列表行大小" }).getByRole("radio", { name: "小" }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await expect(page.locator(".sf-entry", { hasText: "photo.png" })).toHaveCSS("height", "40px");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.viewSizes.v1"))).toBe('{"grid":"large","list":"small"}');
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
  await page.evaluate(() => localStorage.setItem("sofinder.features.v2", JSON.stringify({ recent: true, tags: true, archive: true })));
  const restricted = { ...config, featureAvailability: { folderTree: true, recent: false, favorites: true, tags: false, archive: false, trash: true } };
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
  await expect(page.getByRole("button", { name: "裁剪" })).toBeVisible();
  await expect(page.locator(".sf-details")).toBeVisible();
  await page.evaluate(() => window.addEventListener("sofinder:select", event => {
    (window as Window & { pickerImage?: unknown }).pickerImage = (event as CustomEvent).detail;
  }));
  await page.locator(".sf-picker-bar").getByRole("button", { name: "选择" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { pickerImage?: unknown }).pickerImage)).toMatchObject({ resource: "Files", path: "photo.png", width: 1200, height: 400 });
});

test("keeps image thumbnails inside list rows", async ({ page }) => {
  await page.getByRole("button", { name: "列表" }).click();
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
  await page.getByRole("button", { name: "裁剪" }).click();
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

test("lets the server auto-rename an unchanged default crop copy", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "裁剪" }).click();
  await expect(page.getByRole("textbox", { name: "文件名" })).toHaveValue("photo-edited");
  await expect(page.getByRole("dialog").getByText(".png", { exact: true })).toBeVisible();
  await expect(page.getByText(/图片格式固定为 \.png/)).toBeVisible();

  const requestPromise = page.waitForRequest(request => request.url().endsWith("/sofinder/api/images/edit") && request.method() === "PATCH");
  await page.getByRole("dialog").getByRole("button", { name: "保存" }).click();
  const request = await requestPromise;
  const body = request.postDataJSON() as { save: { mode: string; name?: string } };
  expect(body.save).toEqual({ mode: "copy" });
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("exposes standalone image compression and text watermark controls", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await expect(page.getByRole("button", { name: "压缩 / 水印" })).toHaveCount(0);
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "设置" }).click();
  const settings = page.getByRole("dialog", { name: "设置" });
  await settings.getByText("压缩 / 水印", { exact: true }).click();
  await settings.getByRole("button", { name: "完成" }).click();
  await page.getByRole("button", { name: "压缩 / 水印" }).click();
  const dialog = page.getByRole("dialog", { name: "压缩 / 水印" });
  await expect(dialog.getByLabel("输出格式")).toHaveValue("original");
  await dialog.getByLabel("处理方式").selectOption("text");
  await dialog.getByLabel("水印文字").fill("内部资料");
  await dialog.getByLabel(/透明度/).fill("45");

  const requestPromise = page.waitForRequest(request => request.url().endsWith("/sofinder/api/images/edit") && request.method() === "PATCH");
  await dialog.getByRole("button", { name: "开始处理" }).click();
  const body = requestPromise.then(request => request.postDataJSON() as { actions: Array<Record<string, unknown>>; save: { mode: string } });
  await expect.poll(async () => (await body).actions[0]).toMatchObject({ type: "watermarkText", text: "内部资料", opacity: 45, position: "bottom-right" });
  expect((await body).save).toEqual({ mode: "copy" });
});

test("blocks unsafe crop copy names before saving", async ({ page }) => {
  await page.locator(".sf-entry", { hasText: "photo.png" }).click();
  await page.getByRole("button", { name: "裁剪" }).click();
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
  await page.getByRole("button", { name: "裁剪" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "保存" }).click();

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText("This file extension is not allowed.");
  await expect(dialog.getByRole("button", { name: "保存" })).toBeEnabled();
});

test("navigates cursor pages with unknown totals", async ({ page }) => {
  await page.getByRole("button", { name: /下一页/ }).click();
  await expect(page.getByText("later.txt")).toBeVisible();
  await expect(page.getByText(/第 2/)).toBeVisible();
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
  await expect.poll(() => page.evaluate(() => (window as Window & { selectionEvents?: number }).selectionEvents)).toBe(0);
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
  await expect(dialog.getByRole("cell", { name: "guide-1.txt" })).toBeVisible();
  await expect(dialog.getByRole("cell", { name: "photo-2.png" })).toBeVisible();
  await dialog.getByRole("button", { name: "重命名", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("2 项完成");
});

test("exposes separate file and folder upload controls", async ({ page }) => {
  await expect(page.getByRole("button", { name: "上传", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "上传文件夹", exact: true })).toBeVisible();
  await expect(page.locator('input[type="file"][webkitdirectory]')).toHaveCount(1);
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
  await page.getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: /回收站/ }).click();
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
