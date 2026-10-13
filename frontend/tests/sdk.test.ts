import { afterEach, describe, expect, it, vi } from "vitest";
import { createSoFinderClient } from "../src/sdk";

afterEach(() => vi.unstubAllGlobals());

describe("upload SDK", () => {
  it("resumes an interrupted chunk task from server-reported indexes", async () => {
    const firstChunk = new Response(JSON.stringify({ success: true, data: { complete: false } }), { status: 200 });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(firstChunk)
      .mockRejectedValueOnce(new TypeError("Network interrupted"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { received: [0] } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: {
        complete: true,
        entry: { path: "photo.png", name: "photo.png", directory: false, size: 2, modifiedAt: 10, mimeType: "image/png", url: "/images/photo.png", capabilities: {} },
        asset: { schemaVersion: "1.0", assetId: null, resource: "Images", path: "photo.png", name: "photo.png", directory: false, mimeType: "image/png", size: 2, modifiedAt: 10, version: "10-2", url: "/images/photo.png", downloadUrl: null, width: 1, height: 1, alt: null, variants: [], capabilities: { embeddable: true } },
      } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "token", chunkThreshold: 1, chunkSize: 1 }).upload({ file: new File(["ab"], "photo.png", { type: "image/png" }), resource: "Images" });
    await expect(task.completion).rejects.toThrow("Network interrupted");
    const result = await task.retry();

    expect(result.url).toBe("/images/photo.png");
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe("POST");
    expect(fetchMock.mock.calls[2]?.[0]).toContain(`/uploads/chunks/${task.id}`);
    expect(fetchMock.mock.calls[2]?.[1]?.method).toBeUndefined();
    const uploaded = fetchMock.mock.calls[3]?.[1]?.body as FormData;
    expect(uploaded.get("index")).toBe("1");
  });

  it("starts a fresh chunk task with POST without probing a missing session", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { complete: false } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { complete: true,
        entry: { path: "new.png", name: "new.png", directory: false, size: 2, modifiedAt: 10, mimeType: "image/png", url: "/images/new.png", capabilities: {} },
      } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "token", chunkThreshold: 1, chunkSize: 1 })
      .upload({ file: new File(["ab"], "new.png", { type: "image/png" }), resource: "Images" });
    expect((await task.completion).url).toBe("/images/new.png");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([url, options]) => url === "/sofinder/api/uploads/chunks" && options.method === "POST")).toBe(true);
    expect(fetchMock.mock.calls.map(([, options]) => (options.body as FormData).get("index"))).toEqual(["0", "1"]);
  });

  it("restarts expired sessions on retry but propagates permission errors", async () => {
    for (const status of [404, 403]) {
      const fetchMock = vi.fn()
        .mockRejectedValueOnce(new TypeError("Network interrupted"))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: false, error: { code: "missing_or_denied", message: "Missing or denied" } }), { status }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { complete: false } }), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { complete: true,
          entry: { path: "retry.png", name: "retry.png", directory: false, size: 2, modifiedAt: 10, mimeType: "image/png", url: "/images/retry.png", capabilities: {} },
        } }), { status: 201 }));
      vi.stubGlobal("fetch", fetchMock);
      const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "token", chunkThreshold: 1, chunkSize: 1 })
        .upload({ file: new File(["ab"], "retry.png", { type: "image/png" }), resource: "Images" });
      await expect(task.completion).rejects.toThrow("Network interrupted");
      if (status === 404) {
        expect((await task.retry()).url).toBe("/images/retry.png");
        expect(fetchMock).toHaveBeenCalledTimes(4);
        expect((fetchMock.mock.calls[2]?.[1]?.body as FormData).get("index")).toBe("0");
      } else {
        await expect(task.retry()).rejects.toMatchObject({ status: 403, code: "missing_or_denied" });
        expect(fetchMock).toHaveBeenCalledTimes(2);
      }
    }
  });

});
