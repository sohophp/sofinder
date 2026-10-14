// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Api } from "../src/api";
import { useUploads } from "../src/hooks/useUploads";
import type { SoFinderConfig } from "../src/types";

const storageKey = "sofinder.uploadSessions.v1";
const session = (id: string, scope = "/sofinder/api") => ({
  id, scope, resource: "Files", path: "", name: `${id}.zip`, size: 10,
  lastModified: 1, total: 2, overwrite: false, autoRename: false, updatedAt: Date.now(),
});
const setup = () => {
  const api = new Api({ apiBase: "/sofinder/api/config", csrfToken: "token" } as SoFinderConfig);
  const props = { api, resource: "Files", path: "", currentDepth: 0, autoCollapse: false,
    conflictStrategy: "skip" as const, lowercaseExtensions: false,
    t: (key: string) => key, ask: async () => true,
    chooseConflict: async () => ({ strategy: "skip" as const, remember: false }),
    reload: vi.fn().mockResolvedValue(undefined), setNotice: vi.fn(), report: vi.fn(),
  };
  return { api, props, ...renderHook(() => useUploads(props)) };
};

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("restored upload tasks", () => {
  it("restores quietly, can be opened manually, and opens for a new upload", async () => {
    localStorage.setItem(storageKey, JSON.stringify([session("old")]));
    const { result, api } = setup();
    expect(result.current.uploads).toHaveLength(1);
    expect(result.current.uploadsCollapsed).toBe(true);
    expect(result.current.visibleUploads).toEqual([]);
    act(() => result.current.setUploadsCollapsed(false));
    expect(result.current.uploadsCollapsed).toBe(false);
    expect(result.current.visibleUploads.map(task => task.name)).toEqual(["old.zip"]);
    act(() => result.current.setUploadsCollapsed(true));
    vi.spyOn(api, "upload").mockResolvedValue({ entry: {} as never });
    await act(async () => { await result.current.upload([new File(["data"], "new.zip")]); });
    expect(result.current.uploadsCollapsed).toBe(false);
    expect(result.current.visibleUploads.map(task => task.name)).toEqual(["new.zip"]);
    expect(api.pendingUploads().map(item => item.id)).toEqual(["old"]);
    act(() => result.current.clearFinishedUploads());
    expect(result.current.visibleUploads).toEqual([]);
    expect(api.pendingUploads().map(item => item.id)).toEqual(["old"]);
    act(() => result.current.setUploadsCollapsed(false));
    expect(result.current.visibleUploads.map(task => task.name)).toEqual(["old.zip"]);
  });

  it.each(["remove", "clear", "cancel"])("%s forgets restored tasks even offline and after reopening", action => {
    const other = session("old", "/other/api");
    localStorage.setItem(storageKey, JSON.stringify([session("old"), other]));
    const view = setup();
    act(() => view.result.current.setUploadsCollapsed(false));
    act(() => {
      if (action === "remove") view.result.current.removeUploadTask("pending-old");
      else if (action === "clear") view.result.current.clearFinishedUploads();
      else view.result.current.cancelUpload("pending-old");
    });
    expect(view.api.pendingUploads()).toEqual([]);
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual([other]);
    expect(fetch).toHaveBeenCalledWith("/sofinder/api/uploads/chunks/old", expect.objectContaining({ method: "DELETE", headers: { "X-CSRF-TOKEN": "token" } }));
    view.unmount();
    expect(setup().result.current.uploads).toEqual([]);
  });

  it("clears a failed upload's saved session, while retry preserves resumable chunks", async () => {
    const { result, api } = setup();
    const file = new File(["data"], "failed.zip", { lastModified: 1 });
    vi.spyOn(api, "upload").mockImplementation(async () => {
      localStorage.setItem(storageKey, JSON.stringify([{ ...session("saved"), name: file.name, size: file.size }]));
      throw new TypeError("network");
    });
    await act(async () => { await result.current.upload([file]); });
    const retry = vi.spyOn(api, "upload").mockImplementation(async () => {
      expect(api.pendingUploads().map(item => item.id)).toEqual(["saved"]);
      throw new TypeError("network");
    });
    await act(async () => { result.current.retryUpload(result.current.uploads[0].id); });
    expect(retry).toHaveBeenCalledTimes(2);
    act(() => result.current.clearFinishedUploads());
    expect(api.pendingUploads()).toEqual([]);
  });
});
