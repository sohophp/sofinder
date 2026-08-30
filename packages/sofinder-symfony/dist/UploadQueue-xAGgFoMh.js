import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-JdLj8VHV.js";
//#region src/components/UploadQueue.tsx
var r = t(), i = e();
function a({ tasks: e, collapsed: t, labels: a, onToggle: o, onCancel: s, onCancelAll: c, onClearFinished: l, onRetry: u, onRemove: d }) {
	let f = (0, r.useRef)(null), p = (0, r.useRef)(null), [m, h] = (0, r.useState)(null);
	if ((0, r.useEffect)(() => {
		let e = () => h((e) => e && f.current ? {
			...e,
			left: Math.max(8, Math.min(Number(e.left), window.innerWidth - f.current.offsetWidth - 8)),
			top: Math.max(8, Math.min(Number(e.top), window.innerHeight - f.current.offsetHeight - 8))
		} : e);
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e.length === 0 || t) return null;
	let g = e.some((e) => e.status === "queued" || e.status === "uploading"), _ = e.filter((e) => e.status !== "queued" && e.status !== "uploading").length, v = (e) => {
		if (e.button !== 0 || e.target.closest("button")) return;
		let t = f.current?.getBoundingClientRect();
		t && (p.current = {
			pointerId: e.pointerId,
			offsetX: e.clientX - t.left,
			offsetY: e.clientY - t.top
		}, e.currentTarget.setPointerCapture(e.pointerId));
	}, y = (e) => {
		if (p.current?.pointerId !== e.pointerId || !f.current) return;
		let t = Math.max(8, Math.min(e.clientX - p.current.offsetX, window.innerWidth - f.current.offsetWidth - 8)), n = Math.max(8, Math.min(e.clientY - p.current.offsetY, window.innerHeight - f.current.offsetHeight - 8));
		h({
			left: t,
			top: n,
			transform: "none"
		});
	}, b = (e) => {
		p.current?.pointerId === e.pointerId && (p.current = null);
	};
	return /* @__PURE__ */ (0, i.jsxs)("section", {
		ref: f,
		className: "sf-upload-panel",
		"aria-label": a.title,
		style: m ?? void 0,
		children: [/* @__PURE__ */ (0, i.jsxs)("header", {
			className: "sf-upload-header",
			onPointerDown: v,
			onPointerMove: y,
			onPointerUp: b,
			onPointerCancel: b,
			children: [
				/* @__PURE__ */ (0, i.jsx)("strong", { children: a.title }),
				/* @__PURE__ */ (0, i.jsxs)("span", { children: [
					_,
					"/",
					e.length
				] }),
				/* @__PURE__ */ (0, i.jsxs)("div", {
					className: "sf-upload-actions",
					children: [
						/* @__PURE__ */ (0, i.jsx)("button", {
							onClick: c,
							disabled: !g,
							children: a.cancelAll
						}),
						/* @__PURE__ */ (0, i.jsx)("button", {
							onClick: l,
							children: a.clearFinished
						}),
						/* @__PURE__ */ (0, i.jsx)("button", {
							className: "sf-upload-close",
							onClick: o,
							title: a.close,
							"aria-label": a.close,
							children: /* @__PURE__ */ (0, i.jsx)(n, { name: "close" })
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, i.jsx)("div", {
			className: "sf-upload-list",
			children: e.map((e) => /* @__PURE__ */ (0, i.jsxs)("div", {
				className: `sf-upload-task ${e.status}`,
				children: [
					/* @__PURE__ */ (0, i.jsx)("span", {
						className: "sf-upload-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ (0, i.jsx)("progress", {
						max: "100",
						value: e.progress,
						"aria-label": `${e.name}: ${e.progress}%`
					}),
					/* @__PURE__ */ (0, i.jsx)("span", { children: e.status === "uploading" ? `${e.progress}%` : a.status(e.status) }),
					(e.status === "queued" || e.status === "uploading") && /* @__PURE__ */ (0, i.jsx)("button", {
						onClick: () => s(e.id),
						children: a.cancel
					}),
					(e.status === "error" || e.status === "cancelled") && /* @__PURE__ */ (0, i.jsx)("button", {
						onClick: () => u(e.id),
						children: a.retry
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						className: "sf-upload-remove",
						onClick: () => d(e.id),
						title: a.remove,
						"aria-label": `${a.remove}: ${e.name}`,
						children: /* @__PURE__ */ (0, i.jsx)(n, { name: "close" })
					}),
					e.message && /* @__PURE__ */ (0, i.jsx)("small", {
						title: e.message,
						children: e.message
					})
				]
			}, e.id))
		})]
	});
}
//#endregion
export { a as UploadQueue };
