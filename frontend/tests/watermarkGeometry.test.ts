import { describe, expect, it } from "vitest";
import { watermarkPreviewDimensions } from "../src/watermarkGeometry";

describe("watermarkPreviewDimensions", () => {
  it("keeps the selected scale relative to an adaptive image preview", () => {
    expect(watermarkPreviewDimensions(600, 200, 300, 100, 25)).toEqual({ width: 150, height: 50 });
    expect(watermarkPreviewDimensions(300, 100, 300, 100, 25)).toEqual({ width: 75, height: 25 });
  });

  it("caps a tall watermark exactly like the server processors", () => {
    expect(watermarkPreviewDimensions(600, 200, 100, 800, 25)).toEqual({ width: 25, height: 200 });
  });

  it("does not calculate dimensions before both images are measurable", () => {
    expect(watermarkPreviewDimensions(0, 200, 100, 50, 25)).toBeNull();
    expect(watermarkPreviewDimensions(600, 200, 0, 50, 25)).toBeNull();
  });
});
