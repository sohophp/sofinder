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
