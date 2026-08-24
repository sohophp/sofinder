import { describe, expect, it } from "vitest";
import { clampCropRect, cropCursorFor, resizeCropRect } from "../src/cropGeometry";

const bounds = { width: 1000, height: 800 };
const original = { x: 200, y: 150, width: 400, height: 300 };

describe("crop geometry", () => {
  it("uses diagonal cursors for corners and axis cursors for edges", () => {
    expect(["nw", "se"].map(handle => cropCursorFor(handle as "nw" | "se", false))).toEqual(["nwse-resize", "nwse-resize"]);
    expect(["ne", "sw"].map(handle => cropCursorFor(handle as "ne" | "sw", false))).toEqual(["nesw-resize", "nesw-resize"]);
    expect(["n", "s"].map(handle => cropCursorFor(handle as "n" | "s", false))).toEqual(["ns-resize", "ns-resize"]);
    expect(["e", "w"].map(handle => cropCursorFor(handle as "e" | "w", false))).toEqual(["ew-resize", "ew-resize"]);
  });

  it("resizes both dimensions from a corner and keeps the opposite corner fixed", () => {
    expect(resizeCropRect(original, "nw", { x: 100, y: 50 }, bounds)).toEqual({ x: 100, y: 50, width: 500, height: 400 });
    expect(resizeCropRect(original, "se", { x: 750, y: 600 }, bounds)).toEqual({ x: 200, y: 150, width: 550, height: 450 });
  });

  it("uses edge handles for single-axis resizing", () => {
    expect(resizeCropRect(original, "e", { x: 850, y: 0 }, bounds)).toEqual({ x: 200, y: 150, width: 650, height: 300 });
    expect(resizeCropRect(original, "n", { x: 0, y: 100 }, bounds)).toEqual({ x: 200, y: 100, width: 400, height: 350 });
  });

  it("keeps a fixed ratio while preserving the opposite corner", () => {
    const result = resizeCropRect(original, "nw", { x: 0, y: 50 }, bounds, 16 / 9);
    expect(result.x + result.width).toBe(600);
    expect(result.y + result.height).toBe(450);
    expect(result.width / result.height).toBeCloseTo(16 / 9, 2);
  });

  it("keeps ratio-locked edge resizing centred on the secondary axis", () => {
    const result = resizeCropRect(original, "e", { x: 800, y: 0 }, bounds, 1);
    expect(result).toEqual({ x: 200, y: 0, width: 600, height: 600 });
  });

  it("clamps crop boxes to the image after rounding", () => {
    expect(clampCropRect({ x: -5.2, y: 799.7, width: 1200, height: 20 }, bounds)).toEqual({ x: 0, y: 799, width: 1000, height: 1 });
  });
});
