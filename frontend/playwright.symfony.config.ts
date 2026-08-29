import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const baseURL = process.env.SOFINDER_SYMFONY_URL ?? "http://127.0.0.1:18083";

export default defineConfig({
  testDir: "./tests",
  testMatch: "symfony-example.spec.ts",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
    extraHTTPHeaders: {
      Authorization: `Basic ${Buffer.from("demo:demo").toString("base64")}`,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `${repositoryRoot}/scripts/php-bin.sh -S 127.0.0.1:18083 -t public public/index.php`,
    cwd: resolve(repositoryRoot, "examples/symfony"),
    env: { APP_ENV: "prod", APP_DEBUG: "0" },
    url: `${baseURL}/sofinder/live`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
