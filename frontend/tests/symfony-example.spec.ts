import { expect, test } from "@playwright/test";

test("boots the real Symfony browser shell and shared API", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", error => runtimeErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  const configResponse = page.waitForResponse(response => response.url().includes("/sofinder/api/config"));
  const browserResponse = await page.goto("/sofinder/browser");

  expect(browserResponse?.status()).toBe(200);
  await expect(page.locator(".sf-app")).toBeVisible();
  await expect(page.locator(".sf-toolbar")).toBeVisible();
  await expect(page.locator("#sofinder-root")).toHaveAttribute("data-config", /csrfToken/);

  const response = await configResponse;
  expect(response.status()).toBe(200);
  expect(response.headers()["x-sofinder-api-version"]).toBe("1.0");
  const payload = await response.json() as { success: boolean; data: { apiVersion: string; resources: unknown[] } };
  expect(payload.success).toBe(true);
  expect(payload.data.apiVersion).toBe("1.0");
  expect(payload.data.resources.length).toBeGreaterThan(0);
  expect(runtimeErrors).toEqual([]);
});

test("initializes every pinned third-party editor in the integration demo", async ({ page }) => {
  test.skip(process.env.SOFINDER_EDITOR_NETWORK_CONTRACT !== "1", "External editor compatibility runs in its scheduled workflow.");
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  const response = await page.goto("/integrations", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);

  await expect(page.locator(".ck-editor")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator(".tox-tinymce")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#tiptap-editor .ProseMirror")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#quill-editor.ql-container")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#wangeditor-editor [data-slate-editor]")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator(".jodit-container")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#ckeditor-status")).not.toContainText("初始化失败");
  expect(pageErrors).toEqual([]);
});
