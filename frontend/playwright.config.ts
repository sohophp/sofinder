import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  testIgnore: ["symfony-example.spec.ts", "laravel-example.spec.ts", "psr15-example.spec.ts"],
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: { trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
