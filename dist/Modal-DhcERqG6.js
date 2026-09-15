import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-CyBzESIM.js";
//#region src/components/Modal.tsx
var r = t(), i = e();
function a({ title: e, closeLabel: t, onClose: a, children: o, footer: s, className: c = "", maximizable: l = !1, inactive: u = !1 }) {
	let d = (0, r.useRef)(null), [f, p] = (0, r.useState)(!1), [m, h] = (0, r.useState)({
		x: 0,
		y: 0
	}), g = (0, r.useRef)(null), _ = document.documentElement.lang.toLowerCase(), v = _ === "zh-tw" ? {
		enter: "全螢幕",
		exit: "退出全螢幕"
	} : _.startsWith("zh") ? {
		enter: "全屏",
		exit: "退出全屏"
	} : {
		enter: "Full screen",
		exit: "Exit full screen"
	}, y = (0, r.useRef)(`sf-dialog-${Math.random().toString(36).slice(2)}`);
	(0, r.useEffect)(() => {
		let e = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return (d.current?.querySelector("[autofocus],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"))?.focus(), () => e?.focus();
	}, []);
	let b = (e) => {
		if (e.key === "Escape") {
			e.preventDefault(), f ? p(!1) : a();
			return;
		}
		if (e.key !== "Tab" || !d.current) return;
		let t = Array.from(d.current.querySelectorAll("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"));
		if (t.length === 0) return;
		let n = t[0], r = t[t.length - 1];
		e.shiftKey && document.activeElement === n ? (e.preventDefault(), r.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n.focus());
	}, x = (e) => {
		if (f || e.button !== 0 || e.target instanceof Element && e.target.closest("button") || !d.current) return;
		let t = d.current.getBoundingClientRect();
		g.current = {
			pointerId: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			originX: m.x,
			originY: m.y,
			minX: m.x - t.left,
			maxX: m.x + window.innerWidth - t.right,
			minY: m.y - t.top,
			maxY: m.y + window.innerHeight - t.bottom
		}, e.currentTarget.setPointerCapture(e.pointerId);
	}, S = (e) => {
		let t = g.current;
		!t || t.pointerId !== e.pointerId || h({
			x: Math.max(t.minX, Math.min(t.maxX, t.originX + e.clientX - t.startX)),
			y: Math.max(t.minY, Math.min(t.maxY, t.originY + e.clientY - t.startY))
		});
	}, C = (e) => {
		g.current?.pointerId === e.pointerId && (g.current = null, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId));
	};
	return /* @__PURE__ */ (0, i.jsx)("div", {
		className: "sf-modal-backdrop",
		role: "presentation",
		"aria-hidden": u || void 0,
		inert: u || void 0,
		onMouseDown: (e) => {
			!u && e.target === e.currentTarget && a();
		},
		children: /* @__PURE__ */ (0, i.jsxs)("section", {
			ref: d,
			className: `sf-modal ${c}${f ? " sf-modal-fullscreen" : ""}`,
			style: f ? void 0 : { transform: `translate(${m.x}px, ${m.y}px)` },
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": y.current,
			onKeyDown: b,
			children: [
				/* @__PURE__ */ (0, i.jsxs)("header", {
					onPointerDown: x,
					onPointerMove: S,
					onPointerUp: C,
					onPointerCancel: C,
					children: [/* @__PURE__ */ (0, i.jsx)("h2", {
						id: y.current,
						children: e
					}), /* @__PURE__ */ (0, i.jsxs)("div", {
						className: "sf-modal-header-actions",
						children: [l && /* @__PURE__ */ (0, i.jsx)("button", {
							type: "button",
							onClick: () => p((e) => !e),
							"aria-label": f ? v.exit : v.enter,
							title: f ? v.exit : v.enter,
							children: /* @__PURE__ */ (0, i.jsx)(n, { name: f ? "fullscreen-exit" : "fullscreen" })
						}), /* @__PURE__ */ (0, i.jsx)("button", {
							type: "button",
							onClick: a,
							"aria-label": t,
							children: /* @__PURE__ */ (0, i.jsx)(n, { name: "close" })
						})]
					})]
				}),
				o,
				s && /* @__PURE__ */ (0, i.jsx)("footer", { children: s })
			]
		})
	});
}
//#endregion
export { a as t };
