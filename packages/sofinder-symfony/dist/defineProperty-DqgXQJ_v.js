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
}, r = class extends Error {
	constructor() {
		super("The upload failed because of a network error.");
	}
};
function i(e, t, n, i) {
	return i.credentials === "omit" ? fetch(e, {
		method: "POST",
		body: t,
		signal: i.signal,
		credentials: "omit",
		headers: {
			Accept: "application/json",
			"X-CSRF-TOKEN": n
		}
	}).then(async (e) => (i.onProgress?.(1), {
		text: await e.text(),
		status: e.status,
		contentType: e.headers.get("Content-Type") || ""
	})).catch((e) => {
		throw e instanceof DOMException && e.name === "AbortError" ? e : new r();
	}) : new Promise((a, o) => {
		if (i.signal?.aborted) {
			o(new DOMException("The upload was cancelled.", "AbortError"));
			return;
		}
		let s = new XMLHttpRequest(), c = () => i.signal?.removeEventListener("abort", l), l = () => s.abort();
		s.open("POST", e), s.withCredentials = i.credentials === "include", s.setRequestHeader("Accept", "application/json"), s.setRequestHeader("X-CSRF-TOKEN", n), s.upload.onprogress = (e) => {
			e.lengthComputable && e.total > 0 && i.onProgress?.(Math.min(1, e.loaded / e.total));
		}, s.upload.onload = () => i.onProgress?.(1), s.onload = () => {
			c(), a({
				text: s.responseText,
				status: s.status,
				contentType: s.getResponseHeader("Content-Type") || ""
			});
		}, s.onerror = () => {
			c(), o(new r());
		}, s.onabort = () => {
			c(), o(new DOMException("The upload was cancelled.", "AbortError"));
		}, i.signal?.addEventListener("abort", l, { once: !0 });
		try {
			s.send(t);
		} catch (e) {
			c(), o(e);
		}
	});
}
var a = (e, t) => Math.min(99, Math.max(0, Math.round(e / Math.max(1, t) * 100)));
function o(e, t, n) {
	let r = 0;
	for (let i of e) r += Math.min(n, t - i * n);
	return r;
}
function s(e, t) {
	let n = new Set(e.filter((e) => Number.isInteger(e) && e >= 0 && e < t));
	return n.size === t && n.delete(t - 1), n;
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/typeof.js
function c(e) {
	"@babel/helpers - typeof";
	return c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, c(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
function l(e, t) {
	if (c(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (c(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
function u(e) {
	var t = l(e, "string");
	return c(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
function d(e, t, n) {
	return (t = u(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
export { s as a, o as i, r as n, a as o, i as r, n as s, d as t };
