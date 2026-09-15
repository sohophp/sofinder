//#region src/responseError.ts
var e = () => {
	let e = typeof document > "u" ? "en" : document.documentElement.lang.toLowerCase();
	return e.startsWith("zh-tw") || e.startsWith("zh-hk") || e.startsWith("zh-mo") || e.startsWith("zh-hant") ? "zh-tw" : e.startsWith("zh") ? "zh-cn" : "en";
}, t = {
	en: {
		network: "Upload failed because the server could not be reached. Check your connection and try again.",
		login: "Your login has expired or you do not have upload permission. Sign in again and retry.",
		tooLarge: "The file exceeds the upload size allowed by the server.",
		rateLimit: "Too many uploads were attempted. Wait a moment and retry.",
		server: "The server could not complete the upload. Retry later or contact an administrator.",
		html: "The server returned a login or error page instead of an upload result. Sign in again and retry.",
		invalid: "The server returned an invalid upload result. Retry or contact an administrator."
	},
	"zh-cn": {
		network: "无法连接服务器，上传失败。请检查网络后重试。",
		login: "登录已失效或没有上传权限，请重新登录后重试。",
		tooLarge: "文件超过服务器允许的上传大小。",
		rateLimit: "上传操作过于频繁，请稍后重试。",
		server: "服务器未能完成上传，请稍后重试或联系管理员。",
		html: "服务器返回了登录页或错误页面，请重新登录后重试；如仍失败请联系管理员。",
		invalid: "服务器返回了无法识别的上传结果，请重试或联系管理员。"
	},
	"zh-tw": {
		network: "無法連線伺服器，上傳失敗。請檢查網路後重試。",
		login: "登入已失效或沒有上傳權限，請重新登入後重試。",
		tooLarge: "檔案超過伺服器允許的上傳大小。",
		rateLimit: "上傳操作過於頻繁，請稍後重試。",
		server: "伺服器未能完成上傳，請稍後重試或聯絡管理員。",
		html: "伺服器回傳了登入頁或錯誤頁面，請重新登入後重試；如仍失敗請聯絡管理員。",
		invalid: "伺服器回傳了無法識別的上傳結果，請重試或聯絡管理員。"
	}
}, n = (n, r = "", i = "") => {
	let a = t[e()];
	return n === 0 ? a.network : [
		401,
		403,
		419,
		440
	].includes(n) ? a.login : n === 413 ? a.tooLarge : n === 429 ? a.rateLimit : n >= 500 ? a.server : i.toLowerCase().includes("text/html") || /^\s*(?:<!doctype\s+html|<html\b)/i.test(r) ? a.html : a.invalid;
};
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/typeof.js
function r(e) {
	"@babel/helpers - typeof";
	return r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, r(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
function i(e, t) {
	if (r(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var i = n.call(e, t || "default");
		if (r(i) != "object") return i;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
function a(e) {
	var t = i(e, "string");
	return r(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
function o(e, t, n) {
	return (t = a(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
export { n, o as t };
