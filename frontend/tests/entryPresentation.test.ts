import { describe, expect, it } from "vitest";
import { entryCategory, filterEntries, groupEntries } from "../src/entryPresentation";
import type { Entry } from "../src/types";

const entry = (name: string, mimeType: string | null, size = 1, modifiedAt = 1, directory = false): Entry => ({ path: name, name, mimeType, size, modifiedAt, directory, url: null, capabilities: {} });

describe("entry presentation", () => {
  it("classifies common file types and filters the current page", () => {
    const entries = [entry("folder", null, 0, 1, true), entry("photo.jpg", "image/jpeg"), entry("report.xlsx", "application/octet-stream"), entry("bundle.zip", "application/zip")];
    expect(entries.map(entryCategory)).toEqual(["folder", "image", "document", "archive"]);
    expect(filterEntries(entries, "document").map(item => item.name)).toEqual(["report.xlsx"]);
  });

  it("creates bounded name, size, date and tag groups without duplicating entries", () => {
    const entries = [entry("Alpha.txt", "text/plain", 0), entry("Zulu.mp4", "video/mp4", 2_000_000, Math.floor(Date.now() / 1000)), entry("中文.pdf", "application/pdf", 200_000_000)];
    expect(groupEntries(entries, "name", {}).map(group => group.label)).toEqual(["A–H", "Q–Z", "#"]);
    expect(groupEntries(entries, "size", {}).flatMap(group => group.entries)).toHaveLength(3);
    expect(groupEntries(entries, "modified", {}).some(group => group.label === "today")).toBe(true);
    expect(groupEntries(entries, "tags", { "Alpha.txt": ["Work"] }).map(group => group.label)).toEqual(["Work", "untagged"]);
  });
});
