import { describe, expect, it } from "vitest";
import { supportsImageAction, supportsImageTool } from "../src/imageActions";

describe("host image action discovery", () => {
  it("preserves existing processors and treats an explicit empty list as unavailable", () => {
    for (const tool of ["crop", "rotate", "resize", "presets", "process"] as const) {
      expect(supportsImageTool(undefined, tool)).toBe(true);
      expect(supportsImageTool([], tool)).toBe(false);
    }
  });

  it("retains basic editing without offering advanced actions", () => {
    const actions = ["crop", "rotate", "resize"] as const;
    for (const tool of ["crop", "rotate", "resize"] as const) expect(supportsImageTool([...actions], tool)).toBe(true);
    expect(supportsImageTool([...actions], "presets")).toBe(false);
    expect(supportsImageTool([...actions], "process")).toBe(false);
  });

  it("allows only the declared advanced operation", () => {
    expect(supportsImageTool(["watermarkText"], "process")).toBe(true);
    expect(supportsImageAction(["watermarkText"], "watermarkImage")).toBe(false);
    expect(supportsImageAction(["watermarkText"], "optimize")).toBe(false);
    expect(supportsImageTool(["watermarkText"], "crop")).toBe(false);
  });
});
