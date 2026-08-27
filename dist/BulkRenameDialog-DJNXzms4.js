import { n as e, t } from "./jsx-runtime-BuvfPIin.js";
import { t as n } from "./Modal-u0Bikd5w.js";
import { t as r } from "./nameValidation-DURyMFRU.js";
//#region src/components/BulkRenameDialog.tsx
var i = e(), a = t(), o = (e, t, n) => {
	let r = e.directory ? -1 : e.name.lastIndexOf("."), i = r > 0 ? e.name.slice(r) : "", a = i ? e.name.slice(0, r) : e.name;
	return t.replaceAll("{name}", a).replaceAll("{ext}", i).replaceAll("{n}", String(n + 1));
};
function s({ entries: e, maximum: t, labels: s, onClose: c, onSave: l }) {
	let [u, d] = (0, i.useState)("{name}-{n}{ext}"), f = (0, i.useMemo)(() => e.map((e, t) => ({
		path: e.path,
		name: o(e, u, t)
	})), [e, u]), p = f.map((e) => e.name.toLocaleLowerCase()), m = new Set(p).size !== p.length, h = f.some((n, i) => r(n.name, t) !== null || !e[i].directory && n.name.slice(n.name.lastIndexOf(".")) !== e[i].name.slice(e[i].name.lastIndexOf(".")));
	return /* @__PURE__ */ (0, a.jsxs)(n, {
		title: s.title,
		closeLabel: s.close,
		onClose: c,
		className: "sf-bulk-rename-modal",
		footer: /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsx)("button", {
			onClick: c,
			children: s.cancel
		}), /* @__PURE__ */ (0, a.jsx)("button", {
			className: "primary",
			disabled: h || m || u.trim() === "",
			onClick: () => l(f),
			children: s.save
		})] }),
		children: [
			/* @__PURE__ */ (0, a.jsxs)("label", {
				className: "sf-field",
				children: [
					/* @__PURE__ */ (0, a.jsx)("span", { children: s.pattern }),
					/* @__PURE__ */ (0, a.jsx)("input", {
						autoFocus: !0,
						value: u,
						onChange: (e) => d(e.target.value),
						maxLength: t
					}),
					/* @__PURE__ */ (0, a.jsx)("small", { children: s.hint })
				]
			}),
			h && /* @__PURE__ */ (0, a.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: s.invalid
			}),
			m && /* @__PURE__ */ (0, a.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: s.duplicate
			}),
			/* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-rename-preview",
				children: /* @__PURE__ */ (0, a.jsxs)("table", { children: [/* @__PURE__ */ (0, a.jsx)("thead", { children: /* @__PURE__ */ (0, a.jsxs)("tr", { children: [/* @__PURE__ */ (0, a.jsx)("th", { children: s.oldName }), /* @__PURE__ */ (0, a.jsx)("th", { children: s.newName })] }) }), /* @__PURE__ */ (0, a.jsx)("tbody", { children: e.map((e, t) => /* @__PURE__ */ (0, a.jsxs)("tr", { children: [/* @__PURE__ */ (0, a.jsx)("td", { children: e.name }), /* @__PURE__ */ (0, a.jsx)("td", { children: f[t].name })] }, e.path)) })] })
			})
		]
	});
}
//#endregion
export { s as BulkRenameDialog };
