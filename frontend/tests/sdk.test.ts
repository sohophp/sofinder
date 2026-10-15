import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSoFinderClient, type UploadTaskSnapshot } from "../src/sdk";
import { UploadRequest } from "./support/UploadRequest";

beforeEach(() => { UploadRequest.sent = []; vi.stubGlobal("XMLHttpRequest", UploadRequest); });
afterEach(() => vi.unstubAllGlobals());
const entry = { path: "photo.png", name: "photo.png", directory: false, size: 2, modifiedAt: 10, mimeType: "image/png", url: "/images/photo.png", capabilities: {} };
const client = () => createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "token", chunkThreshold: 1, chunkSize: 1 });
const requestAt = async (index: number) => { await vi.waitFor(() => expect(UploadRequest.sent.length).toBeGreaterThan(index)); return UploadRequest.sent[index]; };

describe("upload SDK", () => {
  it("resumes an interrupted chunk task from server-reported indexes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { received: [0] } })));
    vi.stubGlobal("fetch", fetchMock);
    const task = client().upload({ file: new File(["ab"], "photo.png"), resource: "Images" });
    const rejected = expect(task.completion).rejects.toMatchObject({ code: "network_error" });
    (await requestAt(0)).respond({ complete: false });
    (await requestAt(1)).fail();
    await rejected;
    const retried = task.retry();
    const last = await requestAt(2);
    expect(last.body.get("index")).toBe("1");
    last.respond({ complete: true, entry }, 201);
    expect((await retried).url).toBe("/images/photo.png");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain(`/uploads/chunks/${task.id}`);
  });

  it("starts fresh chunks with POST and exposes partial bytes and a real processing phase", async () => {
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "token", chunkThreshold: 1, chunkSize: 4 })
      .upload({ file: new File(["abcdef"], "new.pdf"), resource: "Files" });
    const snapshots: UploadTaskSnapshot[] = [];
    task.subscribe(snapshot => snapshots.push(snapshot));
    const first = await requestAt(0);
    first.progress(1, 2); expect(task.progress).toBe(33);
    first.finishSending(); expect(task.progress).toBe(67);
    first.respond({ complete: false });
    const last = await requestAt(1);
    last.progress(1, 2); expect(task.progress).toBe(83);
    last.finishSending(); expect(task.status).toBe("processing"); expect(task.progress).toBe(99);
    expect(snapshots.some(snapshot => snapshot.progress === 100)).toBe(false);
    last.respond({ complete: true, entry });
    await task.completion;
    expect(task.status).toBe("ready"); expect(task.progress).toBe(100);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(UploadRequest.sent.map(request => [request.method, request.body.get("index")])).toEqual([["POST", "0"], ["POST", "1"]]);
  });

  it.each([404, 403])("restarts expired sessions but preserves status %s from the resume check", async status => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, error: { code: "missing_or_denied", message: "Missing or denied" } }), { status })));
    const task = client().upload({ file: new File(["ab"], "retry.png"), resource: "Images" });
    const rejected = expect(task.completion).rejects.toMatchObject({ code: "network_error" });
    (await requestAt(0)).fail(); await rejected;
    const retried = task.retry();
    if (status === 403) {
      await expect(retried).rejects.toMatchObject({ status: 403, code: "missing_or_denied" });
      expect(UploadRequest.sent).toHaveLength(1);
    } else {
      const first = await requestAt(1); expect(first.body.get("index")).toBe("0"); first.respond({ complete: false });
      (await requestAt(2)).respond({ complete: true, entry });
      expect((await retried).url).toBe("/images/photo.png");
    }
  });

  it("preserves explicitly anonymous chunk uploads without sending cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { complete: true, entry } })));
    vi.stubGlobal("fetch", fetchMock);
    const task = createSoFinderClient({ apiBase: "/api", csrfToken: "token", credentials: "omit", chunkThreshold: 1 })
      .upload({ file: new File(["ab"], "anonymous.png"), resource: "Images" });
    await task.completion;
    expect(fetchMock).toHaveBeenCalledWith("/api/uploads/chunks", expect.objectContaining({ credentials: "omit" }));
    expect(UploadRequest.sent).toHaveLength(0);
  });

  it("cancels before an asynchronous token is available without sending bytes", async () => {
    let tokenReady!: (token: string) => void;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{}')));
    const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: () => new Promise(resolve => { tokenReady = resolve; }) })
      .upload({ file: new File(["a"], "small.txt"), resource: "Files" });
    const rejected = expect(task.completion).rejects.toMatchObject({ code: "upload_canceled" });
    task.cancel(); tokenReady("token"); await rejected;
    expect(UploadRequest.sent).toHaveLength(0);
  });
});
