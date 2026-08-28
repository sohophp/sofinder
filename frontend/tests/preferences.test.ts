import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadListColumnWidths, loadViewSizes } from "../src/preferences";
import { loadSidebarLayout } from "../src/components/SidebarSectionFrame";

describe("bounded personal display preferences", () => {
  let values: Record<string, string>;

  beforeEach(() => {
    values = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values[key] ?? null,
      setItem: (key: string, value: string) => { values[key] = value; },
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("rejects view sizes outside the small-to-large range", () => {
    values["sofinder.viewSizes.v1"] = JSON.stringify({ grid: "huge", list: "small" });
    expect(loadViewSizes()).toEqual({ grid: "medium", list: "small" });
  });

  it("clamps persisted list column widths to each column range", () => {
    values["sofinder.listColumnWidths.v1"] = JSON.stringify({ name: 10_000, size: -1, type: 240, modified: "invalid" });
    expect(loadListColumnWidths()).toEqual({ name: 720, size: 72, type: 240, modified: 180 });
  });

  it("repairs incomplete or duplicated sidebar layouts", () => {
    values["sofinder.sidebarLayout.v1"] = JSON.stringify({ left: ["recent", "recent", "unknown"], right: ["favorites"] });
    expect(loadSidebarLayout("left")).toEqual({ left: ["recent", "folderNavigation", "quickAccess"], right: ["favorites"] });
  });
});
