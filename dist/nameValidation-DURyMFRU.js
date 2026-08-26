//#region src/nameValidation.ts
var e = /[<>:"/\\|?*\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u, t = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/iu, n = (n, r) => n.trim() === "" ? "empty" : Array.from(n).length > r ? "tooLong" : n !== n.trim() || n.startsWith(".") || n.endsWith(".") || e.test(n) || t.test(n) ? "unsafe" : null;
//#endregion
export { n as t };
