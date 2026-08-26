import { describe, expect, it } from "vitest";
import { isApiVersionSupported } from "../src/api";

describe("API compatibility", () => {
  it("accepts the published 1.x range and rejects unknown majors", () => {
    expect(isApiVersionSupported("1.0")).toBe(true);
    expect(isApiVersionSupported("1.12")).toBe(true);
    expect(isApiVersionSupported("2.0")).toBe(false);
    expect(isApiVersionSupported("")).toBe(false);
  });
});
