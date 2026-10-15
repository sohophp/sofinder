import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";

test("boots the real Symfony browser shell and shared API", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", error => runtimeErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  const configResponse = page.waitForResponse(response => response.url().includes("/sofinder/api/config"));
  const browserResponse = await page.goto("/sofinder/browser");

  expect(browserResponse?.status()).toBe(200);
  await expect(page.locator(".sf-app")).toBeVisible();
  await expect(page.locator(".sf-toolbar")).toBeVisible();
  await expect(page.locator("#sofinder-root")).toHaveAttribute("data-config", /csrfToken/);

  const response = await configResponse;
  expect(response.status()).toBe(200);
  expect(response.headers()["x-sofinder-api-version"]).toBe("1.0");
  const payload = await response.json() as { success: boolean; data: { apiVersion: string; resources: unknown[] } };
  expect(payload.success).toBe(true);
  expect(payload.data.apiVersion).toBe("1.0");
  expect(payload.data.resources.length).toBeGreaterThan(0);
  expect(runtimeErrors).toEqual([]);
});

test("initializes every pinned third-party editor in the integration demo", async ({ page }) => {
  test.skip(process.env.SOFINDER_EDITOR_NETWORK_CONTRACT !== "1", "External editor compatibility runs in its scheduled workflow.");
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  const response = await page.goto("/integrations", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);

  await expect(page.locator(".ck-editor")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator(".tox-tinymce")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#tiptap-editor .ProseMirror")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#quill-editor.ql-container")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#wangeditor-editor [data-slate-editor]")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator(".jodit-container")).toHaveCount(1, { timeout: 90_000 });
  await expect(page.locator("#ckeditor-status")).not.toContainText("初始化失败");
  expect(pageErrors).toEqual([]);
});

// A real multipart request is needed: routed API stubs cannot exercise upload bytes.
for (const scenario of ["small PDF", "chunked PDF", "SDK chunked PDF"] as const) {
  test(`reports continuous byte progress for a throttled ${scenario}`, async ({ page, context }, testInfo) => {
    test.setTimeout(90_000);
    const large = scenario !== "small PDF";
    const name = `progress-${Date.now()}-${testInfo.workerIndex}-${scenario.replaceAll(" ", "-")}.pdf`;
    // Padding is a PDF comment before the object table; the xref offsets remain valid.
    let pdf = `%PDF-1.4\n%${" ".repeat(large ? 5_749_000 : 999_000)}\n`;
    const offsets = [0];
    const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] >>"];
    for (const [index, object] of objects.entries()) { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }
    const xref = pdf.length;
    pdf += `xref\n0 4\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    const buffer = Buffer.from(pdf);
    const configuration = page.waitForResponse(response => response.url().includes("/sofinder/api/config"));
    const browser = await page.goto("/sofinder/browser?type=Files&lang=zh-cn");
    expect(browser?.status()).toBe(200);
    expect((await configuration).status()).toBe(200);
    await expect(page.getByRole("button", { name: "文件", exact: true })).toHaveClass(/active/);
    await expect(page.locator(".sf-app")).toBeVisible();
    const csrf = await page.locator("#sofinder-root").getAttribute("data-config").then(value => JSON.parse(value!).csrfToken as string);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 50, downloadThroughput: -1, uploadThroughput: 700_000 });
    let finalResponse = "";
    let responses = 0;
    const responseStatuses: number[] = [];
    const protocolErrors: string[] = [];
    await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*/sofinder/api/uploads*", requestStage: "Response" }] });
    cdp.on("Fetch.requestPaused", event => {
      if (event.request.method === "POST") responseStatuses.push(event.responseStatusCode ?? 0);
      if (event.request.method === "POST" && ++responses === (large ? 2 : 1)) finalResponse = event.requestId;
      else void cdp.send("Fetch.continueRequest", { requestId: event.requestId }).catch(error => { protocolErrors.push(String(error)); });
    });
    try {
      if (scenario === "SDK chunked PDF") {
        await page.evaluate(async ({ name, pdf, csrf }) => {
          const url = "/sofinder/assets/sofinder-sdk.js";
          const { createSoFinderClient }: typeof import("../src/sdk") = await import(/* @vite-ignore */ url);
          const state = window as Window & { uploadSamples?: number[]; uploadTask?: import("../src/sdk").UploadTask; uploadResult?: string; uploadError?: string };
          state.uploadSamples = [];
          const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: csrf }).upload({ file: new File([pdf], name, { type: "application/pdf" }), resource: "Files" });
          state.uploadTask = task;
          task.subscribe(snapshot => { if (state.uploadSamples!.at(-1) !== snapshot.progress) state.uploadSamples!.push(snapshot.progress); });
          void task.completion.then(asset => { state.uploadResult = asset.path; }, error => { state.uploadError = String(error); });
        }, { name, pdf, csrf });
      } else {
        await page.evaluate(() => {
          const state = window as Window & { uploadSamples?: number[] };
          state.uploadSamples = [];
          new MutationObserver(() => {
            const value = document.querySelector<HTMLProgressElement>(".sf-upload-task progress")?.value;
            if (value !== undefined && state.uploadSamples!.at(-1) !== value) state.uploadSamples!.push(value);
          }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["value"] });
        });
        await page.locator('input[type="file"]:not([webkitdirectory])').setInputFiles({ name, mimeType: "application/pdf", buffer });
      }
      await expect.poll(() => ({ held: Boolean(finalResponse), errors: protocolErrors, statuses: responseStatuses }), { timeout: 40_000 }).toMatchObject({ held: true, errors: [] });
      expect(responseStatuses.every(status => status >= 200 && status < 300)).toBe(true);
      const samples = await page.evaluate(() => (window as Window & { uploadSamples: number[] }).uploadSamples);
      expect(samples.filter(value => value > 0 && value < (large ? 60 : 90)).length).toBeGreaterThan(3);
      if (large) expect(samples.some(value => value > 72 && value < 99)).toBe(true);
      expect(samples).toEqual([...samples].sort((a, b) => a - b));
      expect(samples).not.toContain(100);
      if (scenario === "SDK chunked PDF") {
        await expect.poll(() => page.evaluate(() => {
          const task = (window as Window & { uploadTask: import("../src/sdk").UploadTask }).uploadTask;
          return [task.status, task.progress];
        })).toEqual(["processing", 99]);
      } else {
        await expect(page.locator(".sf-upload-task.uploading progress")).toHaveAttribute("value", "99");
        await expect(page.locator(".sf-upload-task.uploading")).toContainText("正在等待服务器处理");
        await expect(page.locator(".sf-upload-task.done")).toHaveCount(0);
      }
      await cdp.send("Fetch.continueResponse", { requestId: finalResponse });
      finalResponse = "";
      if (scenario === "SDK chunked PDF") {
        await expect.poll(() => page.evaluate(() => (window as Window & { uploadResult?: string; uploadError?: string }).uploadResult)).toBe(name);
      } else await expect(page.locator(".sf-upload-task.done")).toContainText(name);
      const downloaded = await page.request.get(`/sofinder/api/download?${new URLSearchParams({ resource: "Files", path: name })}`);
      expect(downloaded.status()).toBe(200);
      expect(createHash("sha256").update(await downloaded.body()).digest("hex")).toBe(createHash("sha256").update(buffer).digest("hex"));
      const completed = await page.evaluate(() => (window as Window & { uploadSamples: number[] }).uploadSamples);
      expect(completed.at(-1)).toBe(100);
      await testInfo.attach("upload-progress.json", { body: JSON.stringify({ scenario, bytes: buffer.length, samples: completed }), contentType: "application/json" });
    } finally {
      await testInfo.attach("upload-http-responses.json", { body: JSON.stringify({ responseStatuses, protocolErrors }), contentType: "application/json" });
      if (finalResponse) await cdp.send("Fetch.continueResponse", { requestId: finalResponse }).catch(() => undefined);
      await cdp.send("Fetch.disable").catch(() => undefined);
      await cdp.detach();
      // Remove only the unique file created by this test.
      const removed = await page.request.delete("/sofinder/api/entries", { headers: { "X-CSRF-TOKEN": csrf }, data: { resource: "Files", path: name } });
      if (removed.ok()) {
        const trashId = (await removed.json()).data?.trash?.item?.id;
        if (typeof trashId === "string" && /^[a-f0-9]{32}$/.test(trashId)) {
          await page.request.delete(`/sofinder/api/trash/${trashId}`, { headers: { "X-CSRF-TOKEN": csrf }, data: { resource: "Files" } });
        }
      }
    }
  });
}
