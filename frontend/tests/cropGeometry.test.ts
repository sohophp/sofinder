import { describe, expect, it } from "vitest";
import { clampCropRect } from "../src/cropGeometry";

describe("crop geometry", () => {
  it("rounds and clamps CropperJS data to the source image", () => {
    expect(clampCropRect(
      { x: -5.2, y: 799.7, width: 1200, height: 20 },
      { width: 1000, height: 800 },
    )).toEqual({ x: 0, y: 799, width: 1000, height: 1 });
  });
});
