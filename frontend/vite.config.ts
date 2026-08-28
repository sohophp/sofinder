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
    manifest: "manifest.json",
    target: "es2020",
    lib: {
      entry: {
        sofinder: resolve(currentDirectory, "src/main.tsx"),
        "sofinder-picker": resolve(currentDirectory, "src/picker.ts"),
        "sofinder-sdk": resolve(currentDirectory, "src/sdk.ts"),
        "sofinder-editors": resolve(currentDirectory, "src/editors.ts"),
        "sofinder-ckeditor5": resolve(currentDirectory, "src/ckeditor5.ts"),
        "sofinder-tinymce": resolve(currentDirectory, "src/tinymce.ts"),
        "sofinder-tiptap": resolve(currentDirectory, "src/tiptap.ts"),
        "sofinder-quill": resolve(currentDirectory, "src/quill.ts"),
        "sofinder-wangeditor": resolve(currentDirectory, "src/wangeditor.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) => asset.name?.endsWith(".css") ? "sofinder.css" : "[name][extname]",
      },
    },
  },
});
