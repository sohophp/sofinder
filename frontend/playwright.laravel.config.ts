import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const baseURL = process.env.SOFINDER_LARAVEL_URL ?? "http://127.0.0.1:18084";

export default defineConfig({
  testDir: "./tests",
  testMatch: "laravel-example.spec.ts",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `${repositoryRoot}/scripts/php-bin.sh -S 127.0.0.1:18084 -t public public/index.php`,
    cwd: resolve(repositoryRoot, "examples/laravel"),
    env: { APP_ENV: "production", APP_DEBUG: "0" },
    url: `${baseURL}/sofinder/live`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
