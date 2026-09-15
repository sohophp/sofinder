import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
//#region src/components/ContextMenu.tsx
var n = t(), r = e();
function i({ x: e, y: t, items: i, onSelect: a, onClose: o }) {
	let s = (0, n.useRef)(null), c = (0, n.useRef)(document.activeElement instanceof HTMLElement ? document.activeElement : null);
	return (0, n.useEffect)(() => {
		let e = () => o();
		return window.addEventListener("pointerdown", e), window.addEventListener("resize", e), s.current?.querySelector("button:not(:disabled)")?.focus(), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("resize", e), c.current?.focus();
		};
	}, [o]), /* @__PURE__ */ (0, r.jsx)("div", {
		ref: s,
		className: "sf-context-menu",
		role: "menu",
		style: {
			left: Math.max(8, Math.min(e, window.innerWidth - 220)),
			top: Math.max(8, Math.min(t, window.innerHeight - 320))
		},
		onPointerDown: (e) => e.stopPropagation(),
		onKeyDown: (e) => {
			let t = Array.from(s.current?.querySelectorAll("button:not(:disabled)") || []);
			if (e.key === "Escape" || e.key === "Tab") {
				e.key === "Escape" && e.preventDefault(), o();
				return;
			}
			if (!t.length || ![
				"ArrowDown",
				"ArrowUp",
				"Home",
				"End"
			].includes(e.key)) return;
			e.preventDefault();
			let n = Math.max(0, t.indexOf(document.activeElement));
			t[e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : e.key === "ArrowDown" ? (n + 1) % t.length : (n - 1 + t.length) % t.length].focus();
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
