import { describe, expect, it } from "vitest";
import { entryNameIssue } from "../src/nameValidation";

describe("entryNameIssue", () => {
  it("accepts ordinary Unicode file names", () => {
    expect(entryNameIssue("产品照片 01.png", 120)).toBeNull();
  });

  it.each(["CON.txt", ".hidden", "report?.txt", "report.txt.", "report.txt ", "safe\u202Etxt.png"])("rejects unsafe portable name %s", name => {
    expect(entryNameIssue(name, 120)).toBe("unsafe");
  });

  it("counts Unicode characters against the configured complete-name limit", () => {
    expect(entryNameIssue("照片.png", 5)).toBe("tooLong");
  });
});
