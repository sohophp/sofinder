type ResponseLanguage = "en" | "zh-cn" | "zh-tw";

const language = (): ResponseLanguage => {
  const value = typeof document === "undefined" ? "en" : document.documentElement.lang.toLowerCase();
  if (value.startsWith("zh-tw") || value.startsWith("zh-hk") || value.startsWith("zh-mo") || value.startsWith("zh-hant")) return "zh-tw";
  return value.startsWith("zh") ? "zh-cn" : "en";
};

const copy = {
  en: {
    network: "Upload failed because the server could not be reached. Check your connection and try again.",
    login: "Your login has expired or you do not have upload permission. Sign in again and retry.",
    tooLarge: "The file exceeds the upload size allowed by the server.",
    rateLimit: "Too many uploads were attempted. Wait a moment and retry.",
    server: "The server could not complete the upload. Retry later or contact an administrator.",
    html: "The server returned a login or error page instead of an upload result. Sign in again and retry.",
    invalid: "The server returned an invalid upload result. Retry or contact an administrator.",
  },
  "zh-cn": {
    network: "无法连接服务器，上传失败。请检查网络后重试。",
    login: "登录已失效或没有上传权限，请重新登录后重试。",
    tooLarge: "文件超过服务器允许的上传大小。",
    rateLimit: "上传操作过于频繁，请稍后重试。",
    server: "服务器未能完成上传，请稍后重试或联系管理员。",
    html: "服务器返回了登录页或错误页面，请重新登录后重试；如仍失败请联系管理员。",
    invalid: "服务器返回了无法识别的上传结果，请重试或联系管理员。",
  },
  "zh-tw": {
    network: "無法連線伺服器，上傳失敗。請檢查網路後重試。",
    login: "登入已失效或沒有上傳權限，請重新登入後重試。",
    tooLarge: "檔案超過伺服器允許的上傳大小。",
    rateLimit: "上傳操作過於頻繁，請稍後重試。",
    server: "伺服器未能完成上傳，請稍後重試或聯絡管理員。",
    html: "伺服器回傳了登入頁或錯誤頁面，請重新登入後重試；如仍失敗請聯絡管理員。",
    invalid: "伺服器回傳了無法識別的上傳結果，請重試或聯絡管理員。",
  },
} as const;

export const responseFailureMessage = (status: number, body = "", contentType = ""): string => {
  const messages = copy[language()];
  if (status === 0) return messages.network;
  if ([401, 403, 419, 440].includes(status)) return messages.login;
  if (status === 413) return messages.tooLarge;
  if (status === 429) return messages.rateLimit;
  if (status >= 500) return messages.server;
  if (contentType.toLowerCase().includes("text/html") || /^\s*(?:<!doctype\s+html|<html\b)/i.test(body)) return messages.html;
  return messages.invalid;
};
