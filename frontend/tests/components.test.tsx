// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UploadQueue } from "../src/components/UploadQueue";
import { characterLength, formatSize } from "../src/format";
import { Api } from "../src/api";
import type { SoFinderConfig } from "../src/types";

afterEach(cleanup);

describe("UploadQueue", () => {
  it("exposes progress and individual cancellation", () => {
    const cancel = vi.fn();
    render(<UploadQueue
      tasks={[{ id: "one", name: "large.jpg", progress: 40, status: "uploading" }]}
      collapsed={false}
      labels={{ title: "Uploads", expand: "Expand", collapse: "Collapse", cancel: "Cancel", cancelAll: "Cancel all", clearFinished: "Clear", remove: "Remove", status: status => status }}
      onToggle={vi.fn()} onCancel={cancel} onCancelAll={vi.fn()} onClearFinished={vi.fn()} onRemove={vi.fn()}
    />);

    expect(screen.getByRole("progressbar")).toHaveValue(40);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(cancel).toHaveBeenCalledWith("one");
  });
});

describe("format helpers", () => {
  it("counts Unicode characters and formats file sizes", () => {
    expect(characterLength("图😀")).toBe(2);
    expect(formatSize(1536)).toBe("1.5 KB");
  });
});

describe("resumable upload state", () => {
  it("returns only current, scoped sessions", () => {
    const api = new Api({ apiBase: "/sofinder/api/config", csrfToken: "token", language: "en", resource: "Files", initialPath: "", selectMode: false, selectionKind: "any", ckeditorFunction: 0, pickerRequestId: "", pickerOrigin: "", theme: { accent: "#000", background: "#fff", panel: "#fff", text: "#000", muted: "#666", danger: "#f00", radius: "1px" }, featureDefaults: { folderTree: false }, uiDefaults: { scale: "standard", mode: "manager", header: false, logo: false, search: true, languageSwitcher: true, viewSwitcher: true } } satisfies SoFinderConfig);
    localStorage.setItem("sofinder.uploadSessions.v1", JSON.stringify([
      { id: "current", scope: "/sofinder/api", resource: "Files", path: "", name: "large.zip", size: 10, lastModified: 1, total: 2, overwrite: false, updatedAt: Date.now() },
      { id: "other", scope: "/other/api", resource: "Files", path: "", name: "other.zip", size: 10, lastModified: 1, total: 2, overwrite: false, updatedAt: Date.now() },
    ]));

    expect(api.pendingUploads().map(item => item.id)).toEqual(["current"]);
  });
});
