import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
//#region src/components/DocumentPreviewPane.tsx
var n = t(), r = e();
function i({ api: e, resource: t, entry: i, labels: a }) {
	let [o, s] = (0, n.useState)(null), [c, l] = (0, n.useState)(""), [u, d] = (0, n.useState)(0), [f, p] = (0, n.useState)(!1), [m, h] = (0, n.useState)(!1), [g, _] = (0, n.useState)(Date.now()), v = (0, n.useRef)(Date.now());
	if ((0, n.useEffect)(() => {
		v.current = Date.now(), _(Date.now()), p(!1), h(!1);
		let e = window.setTimeout(() => p(!0), 180);
		return () => window.clearTimeout(e);
	}, [
		u,
		i.path,
		t
	]), (0, n.useEffect)(() => {
		let e = window.setInterval(() => _(Date.now()), 1e3);
		return () => window.clearInterval(e);
	}, []), (0, n.useEffect)(() => {
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
	]), o?.status === "ready" && o.previewUrl) return /* @__PURE__ */ (0, r.jsxs)("div", {
		className: "sf-document-preview-frame",
		children: [/* @__PURE__ */ (0, r.jsx)("iframe", {
			className: "sf-document-preview",
			src: o.previewUrl,
			title: i.name,
			onLoad: () => h(!0)
		}), !m && /* @__PURE__ */ (0, r.jsx)("div", {
			className: "sf-document-preview-progress",
			role: "status",
			children: a.loading
		})]
	});
	if (c || o?.status === "failed" || o?.status === "expired") return /* @__PURE__ */ (0, r.jsxs)("div", {
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
	});
	if (!f) return null;
	let y = o?.status === "queued" ? a.queued : o?.status === "running" ? a.converting : a.submitting, b = Math.max(0, Math.floor(g / 1e3 - (o?.createdAt || v.current / 1e3)));
	return /* @__PURE__ */ (0, r.jsxs)("div", {
		className: "sf-state sf-document-preview-progress",
		role: "status",
		children: [/* @__PURE__ */ (0, r.jsx)("span", { children: y }), b > 0 && /* @__PURE__ */ (0, r.jsx)("small", { children: a.elapsed(b) })]
	});
}
//#endregion
export { i as default };
