import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

const config = {
  apiBase: "/sofinder/api/config",
  csrfToken: "test-token",
  language: "zh-cn",
  resource: "Files",
  selectMode: false,
  ckeditorFunction: 0,
  theme: { accent: "#276ef1", background: "#f4f6f9", panel: "#ffffff", text: "#1c2735", muted: "#667282", danger: "#c13a43", radius: "10px" },
  featureDefaults: { folderTree: false },
};

test.beforeEach(async ({ page }) => {
  await page.route("http://sofinder.test/**", async route => {
    const url = new URL(route.request().url());
    if (url.pathname === "/sofinder/api/config") {
      await route.fulfill({ json: { success: true, data: { resources: [{ name: "Files", publicUrl: "/uploads/editor/files", allowedExtensions: ["txt", "png"], maxSize: 1000000, readOnly: false, quotaBytes: 0, usedBytes: 80, maxFileNameLength: 120, maxFolderNameLength: 50, maxFolderDepth: 5, deliveryMode: "public" }], plugins: [], imagePresets: {} } } });
      return;
    }
    if (url.pathname === "/sofinder/api/entries") {
      await route.fulfill({ json: { success: true, data: { entries: [
        { path: "guide.txt", name: "guide.txt", directory: false, size: 12, modifiedAt: 1, mimeType: "text/plain", url: "/uploads/editor/files/guide.txt", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
        { path: "photo.png", name: "photo.png", directory: false, size: 68, modifiedAt: 2, mimeType: "image/png", url: "/uploads/editor/files/photo.png", capabilities: { read: true, rename: true, copy: true, move: true, delete: true } },
      ], total: 2, path: "", offset: 0, limit: 100, sort: "name", direction: "asc", capabilities: { upload: true, create_folder: true } } } });
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
  await expect(page.locator(".sf-file-preview-content img")).toHaveAttribute("src", "/uploads/editor/files/photo.png");
  await expect.poll(() => page.evaluate(() => (window as Window & { selectionEvents?: number }).selectionEvents)).toBe(0);
});

test("switches language and remembers the choice", async ({ page }) => {
  await page.getByLabel("语言").selectOption("en");
  await expect(page.getByRole("button", { name: /New folder/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sofinder.language"))).toBe("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
