import { afterEach, describe, expect, it, vi } from "vitest";
import { createSoFinderClient } from "../src/sdk";

afterEach(() => vi.unstubAllGlobals());

describe("upload SDK", () => {
  it("resumes a chunk task from server-reported indexes", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { received: [0] } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: {
        complete: true,
        entry: { path: "photo.png", name: "photo.png", directory: false, size: 2, modifiedAt: 10, mimeType: "image/png", url: "/images/photo.png", capabilities: {} },
        asset: { schemaVersion: "1.0", assetId: null, resource: "Images", path: "photo.png", name: "photo.png", directory: false, mimeType: "image/png", size: 2, modifiedAt: 10, version: "10-2", url: "/images/photo.png", downloadUrl: null, width: 1, height: 1, alt: null, variants: [], capabilities: { embeddable: true } },
      } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const task = createSoFinderClient({ apiBase: "/sofinder/api", csrfToken: "token", chunkThreshold: 1, chunkSize: 1 }).upload({ file: new File(["ab"], "photo.png", { type: "image/png" }), resource: "Images" });
    const result = await task.completion;

    expect(result.url).toBe("/images/photo.png");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const uploaded = fetchMock.mock.calls[1]?.[1]?.body as FormData;
    expect(uploaded.get("index")).toBe("1");
  });
});
