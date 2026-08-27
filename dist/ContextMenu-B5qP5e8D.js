import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
//#region src/components/ContextMenu.tsx
var n = t(), r = e();
function i({ x: e, y: t, items: i, onSelect: a, onClose: o }) {
	let s = (0, n.useRef)(null);
	return (0, n.useEffect)(() => {
		let e = () => o();
		return window.addEventListener("pointerdown", e), window.addEventListener("resize", e), s.current?.querySelector("button:not(:disabled)")?.focus(), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("resize", e);
		};
	}, [o]), /* @__PURE__ */ (0, r.jsx)("div", {
		ref: s,
		className: "sf-context-menu",
		role: "menu",
		style: {
			left: Math.min(e, window.innerWidth - 220),
			top: Math.min(t, window.innerHeight - 320)
		},
		onPointerDown: (e) => e.stopPropagation(),
		onKeyDown: (e) => {
			e.key === "Escape" && o();
		},
		children: i.map((e) => /* @__PURE__ */ (0, r.jsx)("button", {
			role: "menuitem",
			disabled: e.disabled,
			className: e.danger ? "danger" : "",
			onClick: () => a(e.id),
			children: e.label
		}, e.id))
	});
}
//#endregion
export { i as ContextMenu };
