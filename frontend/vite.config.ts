import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: resolve(currentDirectory, "../dist"),
    emptyOutDir: true,
    target: "es2020",
    lib: {
      entry: resolve(currentDirectory, "src/main.tsx"),
      formats: ["es"],
      fileName: () => "sofinder.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) => asset.name?.endsWith(".css") ? "sofinder.css" : "[name][extname]",
      },
    },
  },
});
