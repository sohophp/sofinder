// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UploadQueue } from "../src/components/UploadQueue";
import { characterLength, formatSize } from "../src/format";
import { Api } from "../src/api";
import type { SoFinderConfig } from "../src/types";
import { SecurityStatusDialog } from "../src/components/SecurityStatusDialog";
import { entryIconKind } from "../src/components/EntryVisuals";

afterEach(cleanup);

describe("UploadQueue", () => {
  const labels = { title: "Uploads", close: "Close", cancel: "Cancel", cancelAll: "Cancel all", clearFinished: "Clear", retry: "Retry", remove: "Remove", status: (status: string) => status };

  it("exposes progress and individual cancellation", () => {
    const cancel = vi.fn();
    render(<UploadQueue
      tasks={[{ id: "one", name: "large.jpg", progress: 40, status: "uploading" }]}
      collapsed={false}
      labels={labels}
      onToggle={vi.fn()} onCancel={cancel} onCancelAll={vi.fn()} onClearFinished={vi.fn()} onRetry={vi.fn()} onRemove={vi.fn()}
    />);

    expect(screen.getByRole("progressbar")).toHaveValue(40);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(cancel).toHaveBeenCalledWith("one");
  });

  it("offers retry for an interrupted upload", () => {
    const retry = vi.fn();
    render(<UploadQueue
      tasks={[{ id: "failed", name: "archive.zip", progress: 55, status: "error" }]}
      collapsed={false}
      labels={labels}
      onToggle={vi.fn()} onCancel={vi.fn()} onCancelAll={vi.fn()} onClearFinished={vi.fn()} onRetry={retry} onRemove={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalledWith("failed");
  });

  it("keeps one hundred upload tasks independently observable", () => {
    const tasks = Array.from({ length: 100 }, (_, index) => ({ id: String(index), name: `upload-${index}.bin`, progress: index, status: index % 3 === 0 ? "uploading" as const : "queued" as const }));
    render(<UploadQueue tasks={tasks} collapsed={false} labels={labels} onToggle={vi.fn()} onCancel={vi.fn()} onCancelAll={vi.fn()} onClearFinished={vi.fn()} onRetry={vi.fn()} onRemove={vi.fn()}/>);
    expect(screen.getAllByRole("progressbar")).toHaveLength(100);
    expect(screen.getByText("upload-99.bin")).toBeInTheDocument();
  });

  it("closes without removing tasks and can be dragged by its header", () => {
    const close = vi.fn();
    const { container } = render(<UploadQueue tasks={[{ id: "one", name: "large.jpg", progress: 100, status: "done" }]} collapsed={false} labels={labels} onToggle={close} onCancel={vi.fn()} onCancelAll={vi.fn()} onClearFinished={vi.fn()} onRetry={vi.fn()} onRemove={vi.fn()}/>);
    const panel = container.querySelector<HTMLElement>(".sf-upload-panel")!;
    Object.defineProperties(panel, { offsetWidth: { value: 400 }, offsetHeight: { value: 240 } });
    panel.getBoundingClientRect = () => ({ left: 100, top: 80, width: 400, height: 240, right: 500, bottom: 320, x: 100, y: 80, toJSON: () => ({}) });
    const header = container.querySelector<HTMLElement>(".sf-upload-header")!;
    header.setPointerCapture = vi.fn();
    fireEvent.pointerDown(header, { button: 0, pointerId: 1, clientX: 130, clientY: 100 });
    fireEvent.pointerMove(header, { pointerId: 1, clientX: 230, clientY: 170 });
    expect(panel).toHaveStyle({ left: "200px", top: "150px" });
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledOnce();
    expect(screen.getByText("large.jpg")).toBeInTheDocument();
  });
});

describe("format helpers", () => {
  it("counts Unicode characters and formats file sizes", () => {
    expect(characterLength("图😀")).toBe(2);
    expect(formatSize(1536)).toBe("1.5 KB");
  });
});

describe("file type icons", () => {
  it("classifies common formats without loading external icon assets", () => {
    expect(entryIconKind("report.pdf", "application/pdf")).toBe("pdf");
    expect(entryIconKind("proposal.docx", "application/octet-stream")).toBe("word");
    expect(entryIconKind("预算.xlsx", null)).toBe("sheet");
    expect(entryIconKind("deck.pptx", null)).toBe("slides");
    expect(entryIconKind("source.ts", "text/plain")).toBe("code");
    expect(entryIconKind("backup.tar.gz", "application/gzip")).toBe("archive");
    expect(entryIconKind("anything", null, true)).toBe("folder");
  });
});

describe("resumable upload state", () => {
  it("returns only current, scoped sessions", () => {
    const api = new Api({ apiBase: "/sofinder/api/config", csrfToken: "token", language: "en", resource: "Files", initialPath: "", selectMode: false, selectionKind: "any", ckeditorFunction: 0, pickerRequestId: "", pickerOrigin: "", theme: { accent: "#000", background: "#fff", panel: "#fff", text: "#000", muted: "#666", danger: "#f00", radius: "1px" }, featureDefaults: { folderTree: false }, uiDefaults: { scale: "standard", mode: "manager", header: false, logo: false, search: true, languageSwitcher: true, viewSwitcher: true } } satisfies SoFinderConfig);
    localStorage.setItem("sofinder.uploadSessions.v1", JSON.stringify([
      { id: "current", scope: "/sofinder/api", resource: "Files", path: "", name: "large.zip", size: 10, lastModified: 1, total: 2, overwrite: false, autoRename: false, updatedAt: Date.now() },
      { id: "other", scope: "/other/api", resource: "Files", path: "", name: "other.zip", size: 10, lastModified: 1, total: 2, overwrite: false, autoRename: false, updatedAt: Date.now() },
    ]));

    expect(api.pendingUploads().map(item => item.id)).toEqual(["current"]);
  });
});

describe("SecurityStatusDialog", () => {
  it("makes disabled malware scanning explicit", async () => {
    const api = new Api({ apiBase: "/sofinder/api/config", csrfToken: "token", language: "en", resource: "Files", initialPath: "", selectMode: false, selectionKind: "any", ckeditorFunction: 0, pickerRequestId: "", pickerOrigin: "", theme: { accent: "#000", background: "#fff", panel: "#fff", text: "#000", muted: "#666", danger: "#f00", radius: "1px" }, featureDefaults: { folderTree: false }, uiDefaults: { scale: "standard" } } satisfies SoFinderConfig);
    vi.spyOn(api, "securityStatus").mockResolvedValue({ malwareScanning: { enabled: false, provider: null, status: "disabled", message: "Malware scanning is not enabled.", counts: { passed: 0, quarantined: 0, failed: 0, pending: 0 }, recent: [] } });
    render(<SecurityStatusDialog api={api} formatDate={String} labels={{ title: "Security status", close: "Close", loading: "Loading", enabled: "Enabled", disabled: "Disabled", provider: "Provider", service: "Service", scans: "Scans", passed: "Passed", quarantined: "Blocked", failed: "Failed", pending: "Pending", recent: "Recent", none: "No scans" }} onClose={vi.fn()}/>);

    expect(await screen.findByText("Disabled")).toBeInTheDocument();
    expect(screen.getByText("No scans")).toBeInTheDocument();
  });
});
