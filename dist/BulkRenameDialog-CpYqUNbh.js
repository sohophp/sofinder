import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-ClPLM5jI.js";
import { t as r } from "./nameValidation-DURyMFRU.js";
//#region src/components/BulkRenameDialog.tsx
var i = t(), a = e(), o = (e, t, n) => {
	let r = e.directory ? -1 : e.name.lastIndexOf("."), i = r > 0 ? e.name.slice(r) : "", a = i ? e.name.slice(0, r) : e.name;
	return t.replaceAll("{name}", a).replaceAll("{ext}", i).replaceAll("{n}", String(n + 1));
};
function s({ entries: e, maximum: t, labels: s, onClose: c, onSave: l }) {
	let u = (0, i.useId)(), [d, f] = (0, i.useState)("{name}-{n}{ext}"), p = (0, i.useMemo)(() => e.map((e, t) => ({
		path: e.path,
		name: o(e, d, t)
	})), [e, d]), m = p.map((e) => e.name.toLocaleLowerCase()), h = new Set(m).size !== m.length, g = p.some((n, i) => r(n.name, t) !== null || !e[i].directory && n.name.slice(n.name.lastIndexOf(".")) !== e[i].name.slice(e[i].name.lastIndexOf(".")));
	return /* @__PURE__ */ (0, a.jsx)(n, {
		title: s.title,
		closeLabel: s.close,
		onClose: c,
		className: "sf-bulk-rename-modal",
		footer: /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsx)("button", {
			onClick: c,
			children: s.cancel
		}), /* @__PURE__ */ (0, a.jsx)("button", {
			className: "primary",
			disabled: g || h || d.trim() === "",
			onClick: () => l(p),
			children: s.save
		})] }),
		children: /* @__PURE__ */ (0, a.jsxs)("div", {
			className: "sf-bulk-rename-body",
			children: [
				/* @__PURE__ */ (0, a.jsxs)("label", {
					className: "sf-bulk-rename-pattern",
					children: [
						/* @__PURE__ */ (0, a.jsx)("span", { children: s.pattern }),
						/* @__PURE__ */ (0, a.jsx)("input", {
							autoFocus: !0,
							value: d,
							onChange: (e) => f(e.target.value),
							maxLength: t,
							"aria-describedby": u
						}),
						/* @__PURE__ */ (0, a.jsx)("small", {
							id: u,
							children: s.hint
						})
					]
				}),
				g && /* @__PURE__ */ (0, a.jsx)("p", {
					className: "sf-warning",
					role: "alert",
					children: s.invalid
				}),
				h && /* @__PURE__ */ (0, a.jsx)("p", {
					className: "sf-warning",
					role: "alert",
					children: s.duplicate
				}),
				/* @__PURE__ */ (0, a.jsx)("div", {
					className: "sf-rename-preview",
					children: /* @__PURE__ */ (0, a.jsxs)("table", { children: [
						/* @__PURE__ */ (0, a.jsxs)("colgroup", { children: [/* @__PURE__ */ (0, a.jsx)("col", {}), /* @__PURE__ */ (0, a.jsx)("col", {})] }),
						/* @__PURE__ */ (0, a.jsx)("thead", { children: /* @__PURE__ */ (0, a.jsxs)("tr", { children: [/* @__PURE__ */ (0, a.jsx)("th", { children: s.oldName }), /* @__PURE__ */ (0, a.jsx)("th", { children: s.newName })] }) }),
						/* @__PURE__ */ (0, a.jsx)("tbody", { children: e.map((e, t) => /* @__PURE__ */ (0, a.jsxs)("tr", { children: [/* @__PURE__ */ (0, a.jsx)("td", {
							title: e.name,
							children: e.name
						}), /* @__PURE__ */ (0, a.jsx)("td", {
							title: p[t].name,
							children: p[t].name
						})] }, e.path)) })
					] })
				})
			]
		})
	});
}
//#endregion
export { s as BulkRenameDialog };
