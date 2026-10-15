// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Api } from "../src/api";
import type { SoFinderConfig } from "../src/types";
import { UploadRequest } from "./support/UploadRequest";

const fileSize = 5_749_829;
const entry = { path: "scan.pdf", name: "scan.pdf", directory: false, size: fileSize, modifiedAt: 1, mimeType: "application/pdf", url: "/files/scan.pdf", capabilities: {} };
const api = () => new Api({ apiBase: "/sofinder/api/config", csrfToken: "token" } as SoFinderConfig);
const file = () => new File([new Uint8Array(fileSize)], "scan.pdf", { lastModified: 1 });
const requestAt = async (index: number) => { await vi.waitFor(() => expect(UploadRequest.sent.length).toBeGreaterThan(index)); return UploadRequest.sent[index]; };

beforeEach(() => { localStorage.clear(); UploadRequest.sent = []; vi.stubGlobal("XMLHttpRequest", UploadRequest); });
afterEach(() => { vi.unstubAllGlobals(); });

describe("byte-based upload progress", () => {
  it("updates inside both PDF chunks, weights the short final chunk and waits for server confirmation", async () => {
    const progress: number[] = [];
    const processing = vi.fn();
    const uploaded = api().upload("Files", "", file(), { onProgress: value => progress.push(value), onProcessing: processing });
    const first = await requestAt(0);
    first.progress(1_000_000, 4_000_000); expect(progress.at(-1)).toBe(17);
    first.progress(2_000_000, 4_000_000); expect(progress.at(-1)).toBe(35);
    first.finishSending(); expect(progress.at(-1)).toBe(70);
    expect(processing).not.toHaveBeenCalled();
    first.respond({ complete: false });
    const second = await requestAt(1);
    second.progress(1, 2); expect(progress.at(-1)).toBe(85);
    second.finishSending(); expect(progress.at(-1)).toBe(99);
    expect(processing).toHaveBeenCalled();
    expect(progress).not.toContain(100);
    second.respond({ complete: true, entry }, 201);
    await expect(uploaded).resolves.toEqual({ entry });
    expect(progress.at(-1)).toBe(100);
    expect(progress).toEqual([...progress].sort((a, b) => a - b));
    expect(api().pendingUploads()).toEqual([]);
    expect(first.headers).toMatchObject({ "X-CSRF-TOKEN": "token" });
  });

  it("counts sparse stored chunks once and resends a stored final chunk to finalize", async () => {
    for (const received of [[1], [0, 1]]) {
      UploadRequest.sent = [];
      const uploadFile = file();
      localStorage.setItem("sofinder.uploadSessions.v1", JSON.stringify([{ id: "resume", scope: "/sofinder/api", resource: "Files", path: "", name: uploadFile.name, size: uploadFile.size, lastModified: 1, total: 2, overwrite: false, autoRename: false, updatedAt: Date.now() }]));
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { received, complete: false } }))));
      const progress: number[] = [];
      const uploaded = api().upload("Files", "", uploadFile, { onProgress: value => progress.push(value) });
      const chunk = await requestAt(0);
      expect(chunk.body.get("index")).toBe(received.length === 1 ? "0" : "1");
      expect(progress.at(-1)).toBe(received.length === 1 ? 30 : 70);
      chunk.progress(1, 2);
      expect(progress.at(-1)).toBe(received.length === 1 ? 65 : 85);
      chunk.respond({ complete: true, entry });
      await uploaded;
      expect(progress.at(-1)).toBe(100);
    }
  });

  it("keeps ordinary uploads below 100 until the server accepts them and preserves rejection details", async () => {
    const progress: number[] = [];
    const uploaded = api().upload("Files", "", new File(["%PDF-1.4"], "small.pdf"), { onProgress: value => progress.push(value) });
    const rejected = expect(uploaded).rejects.toMatchObject({ code: "unsafe_file_content", status: 415 });
    const request = await requestAt(0);
    request.finishSending(); expect(progress.at(-1)).toBe(99);
    request.reject("unsafe_file_content", 415);
    await rejected;
    expect(progress).not.toContain(100);
  });

  it("settles pre-cancelled uploads without sending and cancels an active chunk with cleanup", async () => {
    const cancelled = new AbortController(); cancelled.abort();
    await expect(api().upload("Files", "", new File(["a"], "small.txt"), { signal: cancelled.signal })).rejects.toMatchObject({ name: "AbortError" });
    expect(UploadRequest.sent).toEqual([]);
    const controller = new AbortController();
    const cleanup = vi.fn().mockResolvedValue(new Response('{}'));
    vi.stubGlobal("fetch", cleanup);
    const uploaded = api().upload("Files", "", file(), { signal: controller.signal });
    const rejected = expect(uploaded).rejects.toMatchObject({ name: "AbortError" });
    await requestAt(0);
    controller.abort();
    await rejected;
    expect(cleanup).toHaveBeenCalledWith(expect.stringContaining('/uploads/chunks/'), expect.objectContaining({ method: "DELETE" }));
    expect(api().pendingUploads()).toEqual([]);
  });
});
