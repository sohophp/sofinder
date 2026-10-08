//#region src/imageActions.ts
var e = (e, t) => e === void 0 || e.includes(t);
function t(t, n) {
	return n === "process" ? [
		"optimize",
		"watermarkText",
		"watermarkImage"
	].some((n) => e(t, n)) : e(t, n === "presets" ? "preset" : n);
}
//#endregion
export { t as n, e as t };
