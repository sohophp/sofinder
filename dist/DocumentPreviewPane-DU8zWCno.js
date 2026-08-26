import { n as e, t } from "./jsx-runtime-BuvfPIin.js";
//#region src/components/DocumentPreviewPane.tsx
var n = e(), r = t();
function i({ api: e, resource: t, entry: i, labels: a }) {
	let [o, s] = (0, n.useState)(null), [c, l] = (0, n.useState)(""), [u, d] = (0, n.useState)(0);
	return (0, n.useEffect)(() => {
		let n = !0, r, a = async (t) => {
			!n || t.status === "ready" || t.status === "failed" || t.status === "expired" || (r = window.setTimeout(async () => {
				try {
					let r = await e.documentPreviewJob(t.id);
					if (!n) return;
					s(r), a(r);
				} catch (e) {
					n && l(e instanceof Error ? e.message : String(e));
				}
			}, Math.max(500, t.retryAfter * 1e3)));
		};
		return e.prepareDocumentPreview(t, i.path, u > 0).then((e) => {
			n && (s(e), a(e));
		}).catch((e) => {
			n && l(e instanceof Error ? e.message : String(e));
		}), () => {
			n = !1, r !== void 0 && window.clearTimeout(r);
		};
	}, [
		e,
		u,
		i.path,
		t
	]), o?.status === "ready" && o.previewUrl ? /* @__PURE__ */ (0, r.jsx)("iframe", {
		className: "sf-document-preview",
		src: o.previewUrl,
		title: i.name
	}) : c || o?.status === "failed" || o?.status === "expired" ? /* @__PURE__ */ (0, r.jsxs)("div", {
		className: "sf-file-preview-fallback",
		children: [/* @__PURE__ */ (0, r.jsx)("p", {
			className: "sf-warning",
			role: "alert",
			children: o?.error?.message || c || a.failed
		}), /* @__PURE__ */ (0, r.jsx)("button", {
			onClick: () => {
				l(""), s(null), d((e) => e + 1);
			},
			children: a.retry
		})]
	}) : /* @__PURE__ */ (0, r.jsx)("div", {
		className: "sf-state",
		role: "status",
		children: a.preparing
	});
}
//#endregion
export { i as default };
