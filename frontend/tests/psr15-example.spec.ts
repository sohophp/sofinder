import { expect, test } from "@playwright/test";

const hosts = [
  { name: "Slim 4", url: "http://127.0.0.1:18085" },
  { name: "Mezzio 3", url: "http://127.0.0.1:18086" },
  { name: "plain PHP", url: "http://127.0.0.1:18087" },
];

for (const host of hosts) {
  test(`boots the real ${host.name} browser shell and shared API`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", error => runtimeErrors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    const configResponse = page.waitForResponse(response => response.url().includes("/sofinder/api/config"));
    const browserResponse = await page.goto(`${host.url}/sofinder/browser`);

    expect(browserResponse?.status()).toBe(200);
    expect(browserResponse?.headers()["content-security-policy"]).toContain("default-src 'none'");
    await expect(page.locator(".sf-app")).toBeVisible();
    await expect(page.locator(".sf-toolbar")).toBeVisible();

    const root = page.locator("#sofinder-root");
    const bootstrap = JSON.parse((await root.getAttribute("data-config")) ?? "{}") as {
      apiBase?: string;
      csrfToken?: string;
    };
    expect(bootstrap.apiBase).toBe("/sofinder/api/config");
    expect(bootstrap.csrfToken).toBe("sofinder-host-contract-token");

    const response = await configResponse;
    expect(response.status()).toBe(200);
    expect(response.headers()["x-sofinder-api-version"]).toBe("1.0");
    const payload = await response.json() as { success: boolean; data: { apiVersion: string; resources: unknown[] } };
    expect(payload.success).toBe(true);
    expect(payload.data.apiVersion).toBe("1.0");
    expect(payload.data.resources.length).toBeGreaterThan(0);
    expect(runtimeErrors).toEqual([]);
  });
}
