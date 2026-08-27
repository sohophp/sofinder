import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const limits = { "sofinder.js": 100 * 1024, "sofinder-sdk.js": 30 * 1024, "sofinder-picker.js": 30 * 1024, "sofinder-editors.js": 30 * 1024, "sofinder-ckeditor5.js": 15 * 1024, "sofinder-tinymce.js": 15 * 1024, "sofinder-tiptap.js": 15 * 1024, "sofinder-quill.js": 15 * 1024 };
for (const [name, maximum] of Object.entries(limits)) {
  const bytes = gzipSync(readFileSync(resolve(import.meta.dirname, "../../dist", name)), { level: 9 }).byteLength;
  console.log(`${name} gzip: ${bytes} bytes (limit ${maximum})`);
  if (bytes > maximum) process.exitCode = 1;
}
