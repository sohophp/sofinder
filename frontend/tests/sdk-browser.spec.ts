import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("fresh built SDK chunk uploads do not query missing sessions", async ({ page }) => {
  const methods: string[] = [];
  const errors: string[] = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.route("http://sdk.sofinder.test/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === "/") {
      await route.fulfill({ contentType: "text/html", body: '<!doctype html><html><link rel="icon" href="data:,"><body>SDK fixture</body></html>' });
    } else if (/^\/[A-Za-z0-9._-]+\.js$/.test(url.pathname)) {
      await route.fulfill({ contentType: "text/javascript", body: readFileSync(resolve(import.meta.dirname, "../../dist", url.pathname.slice(1))) });
    } else if (url.pathname === "/sofinder/api/uploads/chunks" && request.method() === "POST") {
      methods.push("POST");
      const final = /name="index"\r\n\r\n1\r\n/.test(request.postData() ?? "");
      await route.fulfill({ status: final ? 201 : 200, json: { success: true, data: final ? { complete: true,
        entry: { path: "photo.png", name: "photo.png", directory: false, size: 2, modifiedAt: 10, mimeType: "image/png", url: "/uploads/original/photo.png", capabilities: {} },
      } : { complete: false } } });
    } else if (url.pathname.startsWith("/sofinder/api/uploads/chunks/")) {
      methods.push(request.method());
      await route.fulfill({ status: 404, json: { success: false, error: { code: "upload_session_not_found", message: "Session does not exist" } } });
    } else {
      await route.fulfill({ status: 404 });
    }
  });
  await page.goto("http://sdk.sofinder.test/");
  const urls = await page.evaluate(async () => {
    const moduleUrl = "/sofinder-sdk.js";
    const { createSoFinderClient }: typeof import("../src/sdk") = await import(/* @vite-ignore */ moduleUrl);
    const client = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "fixture-token", chunkThreshold: 1, chunkSize: 1 });
    const urls: string[] = [];
    for (let index = 0; index < 2; index++) {
      const task = client.upload({ file: new File(["ab"], `photo-${index}.png`, { type: "image/png" }), resource: "Images" });
      urls.push((await task.completion).url);
    }
    return urls;
  });
  expect(urls).toEqual(["/uploads/original/photo.png", "/uploads/original/photo.png"]);
  expect(methods).toEqual(["POST", "POST", "POST", "POST"]);
  expect(errors).toEqual([]);
});
