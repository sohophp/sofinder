import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

const config = {
  apiBase: "/sofinder/api/config",
  csrfToken: "test-token",
  language: "zh-cn",
  resource: "Files",
  selectMode: false,
  selectionKind: "any",
  ckeditorFunction: 0,
  theme: { accent: "#276ef1", background: "#f4f6f9", panel: "#ffffff", text: "#1c2735", muted: "#667282", danger: "#c13a43", radius: "10px" },
  featureDefaults: { folderTree: false },
};

test.beforeEach(async ({ page }) => {
  await page.route("http://sofinder.test/**", async route => {
    const url = new URL(route.request().url());
    if (url.pathname === "/sofinder/api/config") {
      await route.fulfill({ json: { success: true, data: { apiVersion: "1.0", resources: [{ name: "Files", publicUrl: "/uploads/editor/files", allowedExtensions: ["txt", "png", "heic"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public", storageCapabilities: { search: true, sort: true, cursorPagination: false, atomicMove: true, nativeCopy: true, recoverableDelete: true, publicUrl: true } }], plugins: [], imagePresets: {}, imageCapabilities: { driver: "auto", formats: [{ format: "png", extensions: ["png"], mimes: ["image/png"], processor: "gd", read: true, edit: true, thumbnail: true, webEmbeddable: true }] } } } });
      return;
    }
    if (url.pathname === "/sofinder/api/entries") {
      await route.fulfill({ json: { success: true, data: { entries: [
        { path: "guide.txt", name: "guide.txt", directory: false, size: 12, modifiedAt: 1, mimeType: "text/plain", url: "/uploads/editor/files/guide.txt", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
        { path: "photo.png", name: "photo.png", directory: false, size: 68, modifiedAt: 2, mimeType: "image/png", url: "/uploads/editor/files/photo.png", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
        { path: "camera.heic", name: "camera.heic", directory: false, size: 80, modifiedAt: 3, mimeType: "image/heic", url: "/uploads/editor/files/camera.heic", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
      ], total: 3, path: "", offset: 0, limit: 100, sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
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
    if (url.pathname === "/uploads/editor/files/photo.png") {
      await route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
      return;
    }
    await route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>SoFinder test</title>" });
  });
  await page.goto("http://sofinder.test/");
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

test("has no serious automated accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
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

test("switches language and remembers the choice", async ({ page }) => {
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
  await page.getByRole("button", { name: /回收站/ }).click();
  await page.getByRole("button", { name: "恢复" }).click();
  const conflict = page.getByRole("dialog", { name: "原位置已经存在同名项目" });
  await expect(conflict).toBeVisible();
  await conflict.getByRole("button", { name: "自动改名恢复" }).click();
  await expect(conflict).toBeHidden();
});

test("treats non-web image formats as ordinary files and blocks image selection", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="zh-CN"><head><title>SoFinder</title></head><body><main id="sofinder-root" data-config='${JSON.stringify({ ...config, selectMode: true, selectionKind: "image" })}'></main></body></html>`);
  await page.addStyleTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.css") });
  await page.addScriptTag({ path: resolve(import.meta.dirname, "../../dist/sofinder.js"), type: "module" });
  const heic = page.locator(".sf-entry", { hasText: "camera.heic" });
  await expect(heic).toBeVisible();
  await expect(heic.locator("img")).toHaveCount(0);
  await heic.click();
  await expect(page.getByRole("button", { name: "选择" })).toBeDisabled();
  await expect(page.getByText("此图片格式不能直接用于网页内容。")).toBeVisible();
  await heic.click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: "选择" })).toBeDisabled();
});
