import { describe, expect, it } from "vitest";
import { normalizeUploadExtension } from "../src/uploadNaming";

describe("upload extension normalization", () => {
  it("lowercases only the final extension", () => {
    expect(normalizeUploadExtension("Report.XLSX", true)).toBe("Report.xlsx");
    expect(normalizeUploadExtension("Release.V1.PDF", true)).toBe("Release.V1.pdf");
  });

  it("preserves names without a usable extension", () => {
    expect(normalizeUploadExtension("README", true)).toBe("README");
    expect(normalizeUploadExtension("file.", true)).toBe("file.");
    expect(normalizeUploadExtension(".ENV", true)).toBe(".ENV");
  });

  it("keeps the original case when normalization is disabled", () => {
    expect(normalizeUploadExtension("Manual.PDF", false)).toBe("Manual.PDF");
  });
});
