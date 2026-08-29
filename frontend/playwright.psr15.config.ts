import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const hosts = [
  { name: "slim", port: 18085 },
  { name: "mezzio", port: 18086 },
  { name: "plain", port: 18087 },
];

export default defineConfig({
  testDir: "./tests",
  testMatch: "psr15-example.spec.ts",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: hosts.map(host => ({
    command: `${repositoryRoot}/scripts/php-bin.sh -S 127.0.0.1:${host.port} public/${host.name}.php`,
    cwd: resolve(repositoryRoot, "examples/psr15"),
    env: { SOFINDER_EXAMPLE_AUTHORIZED: "1" },
    url: `http://127.0.0.1:${host.port}/sofinder/live`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  })),
});
