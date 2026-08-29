import { expect, test } from "@playwright/test";

test("boots the real Laravel browser shell and shared API", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", error => runtimeErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  const configResponse = page.waitForResponse(response => response.url().includes("/sofinder/api/config"));
  const browserResponse = await page.goto("/sofinder/browser");

  expect(browserResponse?.status()).toBe(200);
  expect(browserResponse?.headers()["content-security-policy"]).toContain("default-src 'none'");
  await expect(page.locator(".sf-app")).toBeVisible();
  await expect(page.locator(".sf-toolbar")).toBeVisible();

  const root = page.locator("#sofinder-root");
  await expect(root).toHaveAttribute("data-config", /csrfToken/);
  const bootstrap = JSON.parse((await root.getAttribute("data-config")) ?? "{}") as {
    apiBase?: string;
    csrfToken?: string;
  };
  expect(bootstrap.apiBase).toBe("/sofinder/api/config");
  expect(bootstrap.csrfToken).toBeTruthy();

  const response = await configResponse;
  expect(response.status()).toBe(200);
  expect(response.headers()["x-sofinder-api-version"]).toBe("1.0");
  const payload = await response.json() as { success: boolean; data: { apiVersion: string; resources: unknown[] } };
  expect(payload.success).toBe(true);
  expect(payload.data.apiVersion).toBe("1.0");
  expect(payload.data.resources.length).toBeGreaterThan(0);
  expect(runtimeErrors).toEqual([]);
});
