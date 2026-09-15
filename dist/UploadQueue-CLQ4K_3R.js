import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-CyBzESIM.js";
//#region src/components/UploadQueue.tsx
var r = t(), i = e();
function a({ tasks: e, collapsed: t, labels: a, riskLabel: o, onToggle: s, onCancel: c, onCancelAll: l, onClearFinished: u, onRetry: d, onRemove: f }) {
	let p = (0, r.useRef)(null), m = (0, r.useRef)(null), [h, g] = (0, r.useState)(null);
	if ((0, r.useEffect)(() => {
		let e = () => g((e) => e && p.current ? {
			...e,
			left: Math.max(8, Math.min(Number(e.left), window.innerWidth - p.current.offsetWidth - 8)),
			top: Math.max(8, Math.min(Number(e.top), window.innerHeight - p.current.offsetHeight - 8))
		} : e);
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e.length === 0 || t) return null;
	let _ = e.some((e) => e.status === "queued" || e.status === "uploading"), v = e.filter((e) => e.status !== "queued" && e.status !== "uploading").length, y = (e) => {
		if (e.button !== 0 || e.target.closest("button")) return;
		let t = p.current?.getBoundingClientRect();
		t && (m.current = {
			pointerId: e.pointerId,
			offsetX: e.clientX - t.left,
			offsetY: e.clientY - t.top
		}, e.currentTarget.setPointerCapture(e.pointerId));
	}, b = (e) => {
		if (m.current?.pointerId !== e.pointerId || !p.current) return;
		let t = Math.max(8, Math.min(e.clientX - m.current.offsetX, window.innerWidth - p.current.offsetWidth - 8)), n = Math.max(8, Math.min(e.clientY - m.current.offsetY, window.innerHeight - p.current.offsetHeight - 8));
		g({
			left: t,
			top: n,
			transform: "none"
		});
	}, x = (e) => {
		m.current?.pointerId === e.pointerId && (m.current = null);
	};
	return /* @__PURE__ */ (0, i.jsxs)("section", {
		ref: p,
		className: "sf-upload-panel",
		"aria-label": a.title,
		"aria-busy": _,
		style: h ?? void 0,
		children: [
			/* @__PURE__ */ (0, i.jsxs)("header", {
				className: "sf-upload-header",
				onPointerDown: y,
				onPointerMove: b,
				onPointerUp: x,
				onPointerCancel: x,
				children: [
					/* @__PURE__ */ (0, i.jsx)("strong", { children: a.title }),
					/* @__PURE__ */ (0, i.jsxs)("span", {
						"aria-live": "polite",
						children: [
							v,
							"/",
							e.length
						]
					}),
					/* @__PURE__ */ (0, i.jsxs)("div", {
						className: "sf-upload-actions",
						children: [
							/* @__PURE__ */ (0, i.jsx)("button", {
								onClick: l,
								disabled: !_,
								children: a.cancelAll
							}),
							/* @__PURE__ */ (0, i.jsx)("button", {
								onClick: u,
								children: a.clearFinished
							}),
							/* @__PURE__ */ (0, i.jsx)("button", {
								className: "sf-upload-close",
								onClick: s,
								title: a.close,
								"aria-label": a.close,
								children: /* @__PURE__ */ (0, i.jsx)(n, { name: "close" })
							})
						]
					})
				]
			}),
			o && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-warning sf-upload-risk",
				role: "status",
				children: o
			}),
			/* @__PURE__ */ (0, i.jsx)("div", {
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
						/* @__PURE__ */ (0, i.jsx)("span", {
							className: "sf-upload-status",
							children: e.status === "uploading" ? `${e.progress}%` : a.status(e.status)
						}),
						(e.status === "queued" || e.status === "uploading") && /* @__PURE__ */ (0, i.jsx)("button", {
							onClick: () => c(e.id),
							children: a.cancel
						}),
						(e.status === "error" || e.status === "cancelled") && /* @__PURE__ */ (0, i.jsx)("button", {
							onClick: () => d(e.id),
							children: a.retry
						}),
						/* @__PURE__ */ (0, i.jsx)("button", {
							className: "sf-upload-remove",
							onClick: () => f(e.id),
							title: a.remove,
							"aria-label": `${a.remove}: ${e.name}`,
							children: /* @__PURE__ */ (0, i.jsx)(n, { name: "close" })
						}),
						e.message && /* @__PURE__ */ (0, i.jsx)("small", {
							title: e.message,
							role: e.status === "error" ? "alert" : void 0,
							children: e.message
						})
					]
				}, e.id))
			})
		]
	});
}
//#endregion
export { a as UploadQueue };
