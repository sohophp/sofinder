import { defineConfig } from "vitest/config";

export default defineConfig({
  define: { "process.env.NODE_ENV": JSON.stringify("development") },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["tests/browser.spec.ts"],
  },
});
