import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-JdLj8VHV.js";
//#region src/components/Modal.tsx
var r = t(), i = e();
function a({ title: e, closeLabel: t, onClose: a, children: o, footer: s, className: c = "", maximizable: l = !1 }) {
	let u = (0, r.useRef)(null), [d, f] = (0, r.useState)(!1), p = document.documentElement.lang.toLowerCase(), m = p === "zh-tw" ? {
		enter: "全螢幕",
		exit: "退出全螢幕"
	} : p.startsWith("zh") ? {
		enter: "全屏",
		exit: "退出全屏"
	} : {
		enter: "Full screen",
		exit: "Exit full screen"
	}, h = (0, r.useRef)(`sf-dialog-${Math.random().toString(36).slice(2)}`);
	return (0, r.useEffect)(() => {
		let e = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return (u.current?.querySelector("[autofocus],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"))?.focus(), () => e?.focus();
	}, []), /* @__PURE__ */ (0, i.jsx)("div", {
		className: "sf-modal-backdrop",
		role: "presentation",
		onMouseDown: (e) => {
			e.target === e.currentTarget && a();
		},
		children: /* @__PURE__ */ (0, i.jsxs)("section", {
			ref: u,
			className: `sf-modal ${c}${d ? " sf-modal-fullscreen" : ""}`,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": h.current,
			onKeyDown: (e) => {
				if (e.key === "Escape") {
					e.preventDefault(), d ? f(!1) : a();
					return;
				}
				if (e.key !== "Tab" || !u.current) return;
				let t = Array.from(u.current.querySelectorAll("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"));
				if (t.length === 0) return;
				let n = t[0], r = t[t.length - 1];
				e.shiftKey && document.activeElement === n ? (e.preventDefault(), r.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n.focus());
			},
			children: [
				/* @__PURE__ */ (0, i.jsxs)("header", { children: [/* @__PURE__ */ (0, i.jsx)("h2", {
					id: h.current,
					children: e
				}), /* @__PURE__ */ (0, i.jsxs)("div", {
					className: "sf-modal-header-actions",
					children: [l && /* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: () => f((e) => !e),
						"aria-label": d ? m.exit : m.enter,
						title: d ? m.exit : m.enter,
						children: /* @__PURE__ */ (0, i.jsx)(n, { name: d ? "fullscreen-exit" : "fullscreen" })
					}), /* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: a,
						"aria-label": t,
						children: /* @__PURE__ */ (0, i.jsx)(n, { name: "close" })
					})]
				})] }),
				o,
				s && /* @__PURE__ */ (0, i.jsx)("footer", { children: s })
			]
		})
	});
}
//#endregion
export { a as t };
