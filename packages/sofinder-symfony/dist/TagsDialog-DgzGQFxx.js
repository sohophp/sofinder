import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-JdLj8VHV.js";
import { t as r } from "./Modal-ClPLM5jI.js";
//#region src/components/TagsDialog.tsx
var i = t(), a = e();
function o({ initial: e, suggestions: t, labels: o, onSave: s, onClose: c }) {
	let [l, u] = (0, i.useState)(() => e.slice(0, 10)), [d, f] = (0, i.useState)(""), p = (0, i.useMemo)(() => new Set(l.map((e) => e.toLocaleLowerCase())), [l]), m = t.filter((e) => !p.has(e.toLocaleLowerCase()) && (d.trim() === "" || e.toLocaleLowerCase().includes(d.trim().toLocaleLowerCase()))).slice(0, 8), h = (e = d) => {
		let t = e.trim().replace(/^[,，]+|[,，]+$/gu, "");
		t === "" || Array.from(t).length > 30 || l.length >= 10 || p.has(t.toLocaleLowerCase()) || (u((e) => [...e, t]), f(""));
	}, g = (e) => u((t) => t.filter((t) => t !== e));
	return /* @__PURE__ */ (0, a.jsx)(r, {
		title: o.title,
		closeLabel: o.close,
		onClose: c,
		className: "sf-tags-modal",
		footer: /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
			/* @__PURE__ */ (0, a.jsxs)("span", { children: [l.length, " / 10"] }),
			/* @__PURE__ */ (0, a.jsx)("button", {
				onClick: c,
				children: o.cancel
			}),
			/* @__PURE__ */ (0, a.jsx)("button", {
				className: "primary",
				onClick: () => s(l),
				children: o.save
			})
		] }),
		children: /* @__PURE__ */ (0, a.jsxs)("div", {
			className: "sf-tags-editor",
			children: [
				/* @__PURE__ */ (0, a.jsxs)("div", {
					className: "sf-tags-input",
					onClick: (e) => e.currentTarget.querySelector("input")?.focus(),
					children: [l.map((e) => /* @__PURE__ */ (0, a.jsxs)("span", { children: [e, /* @__PURE__ */ (0, a.jsx)("button", {
						type: "button",
						onClick: () => g(e),
						"aria-label": `${o.close}: ${e}`,
						children: /* @__PURE__ */ (0, a.jsx)(n, { name: "close" })
					})] }, e)), /* @__PURE__ */ (0, a.jsx)("input", {
						autoFocus: !0,
						value: d,
						maxLength: 30,
						disabled: l.length >= 10,
						placeholder: l.length === 0 ? o.input : "",
						onChange: (e) => {
							let t = e.target.value;
							/[,，]$/u.test(t) ? h(t) : f(t);
						},
						onKeyDown: (e) => {
							(e.key === "Enter" || e.key === ",") && (e.preventDefault(), h()), e.key === "Backspace" && d === "" && l.length > 0 && g(l.at(-1) || "");
						},
						onBlur: () => h()
					})]
				}),
				m.length > 0 && /* @__PURE__ */ (0, a.jsx)("div", {
					className: "sf-tag-suggestions",
					children: m.map((e) => /* @__PURE__ */ (0, a.jsxs)("button", {
						type: "button",
						title: e,
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => h(e),
						children: [/* @__PURE__ */ (0, a.jsx)(n, { name: "add" }), /* @__PURE__ */ (0, a.jsx)("span", { children: e })]
					}, e))
				}),
				/* @__PURE__ */ (0, a.jsxs)("small", { children: [
					o.hint,
					" · ",
					o.maximum
				] })
			]
		})
	});
}
//#endregion
export { o as TagsDialog };
