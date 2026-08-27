import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(import.meta.dirname, "../../dist/sofinder.js");
const maximum = 95 * 1024;
const bytes = gzipSync(readFileSync(file), { level: 9 }).byteLength;

console.log(`sofinder.js gzip: ${bytes} bytes (limit ${maximum})`);
if (bytes > maximum) process.exitCode = 1;
