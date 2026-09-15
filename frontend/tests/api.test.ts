import { afterEach, describe, expect, it, vi } from "vitest";
import { isApiVersionSupported } from "../src/api";
import { responseFailureMessage } from "../src/responseError";

describe("API compatibility", () => {
  it("accepts the published 1.x range and rejects unknown majors", () => {
    expect(isApiVersionSupported("1.0")).toBe(true);
    expect(isApiVersionSupported("1.12")).toBe(true);
    expect(isApiVersionSupported("2.0")).toBe(false);
    expect(isApiVersionSupported("")).toBe(false);
  });
});

describe("upload response errors", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("replaces an HTML login response with a friendly localized message", async () => {
    vi.stubGlobal("document", { documentElement: { lang: "zh-TW" } });
    expect(responseFailureMessage(200, "<!DOCTYPE html><title>Login</title>", "text/html")).toBe(
      "伺服器回傳了登入頁或錯誤頁面，請重新登入後重試；如仍失敗請聯絡管理員。",
    );
  });

  it("explains an HTML 413 response from a reverse proxy", async () => {
    vi.stubGlobal("document", { documentElement: { lang: "zh-TW" } });
    expect(responseFailureMessage(413, "<html>too large</html>", "text/html")).toBe("檔案超過伺服器允許的上傳大小。");
  });
});
