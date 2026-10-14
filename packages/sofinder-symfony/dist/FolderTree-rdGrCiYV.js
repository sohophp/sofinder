import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-CyBzESIM.js";
//#region src/components/FolderTree.tsx
var r = t(), i = e();
function a({ api: e, resource: t, revision: a = 0, currentPath: o, rootLabel: s, onNavigate: c }) {
	let [l, u] = (0, r.useState)({ "": {
		loading: !1,
		loaded: !1,
		expanded: !0,
		children: []
	} }), d = (0, r.useRef)(0), f = (0, r.useCallback)(async (n, r = !0) => {
		let i = d.current;
		u((e) => ({
			...e,
			[n]: {
				...e[n] || {
					children: [],
					loaded: !1
				},
				loading: !0,
				expanded: r
			}
		}));
		try {
			let a = await e.list(t, n, "", "name", "asc", 0, 500);
			if (i !== d.current) return;
			u((e) => ({
				...e,
				[n]: {
					loading: !1,
					loaded: !0,
					expanded: r,
					children: a.entries.filter((e) => e.directory)
				}
			}));
		} catch {
			if (i !== d.current) return;
			u((e) => ({
				...e,
				[n]: {
					...e[n] || {
						children: [],
						loaded: !1
					},
					loading: !1,
					expanded: r
				}
			}));
		}
	}, [e, t]);
	(0, r.useEffect)(() => (u({ "": {
		loading: !1,
		loaded: !1,
		expanded: !0,
		children: []
	} }), f(""), () => {
		d.current += 1;
	}), [
		f,
		t,
		a
	]), (0, r.useEffect)(() => {
		let e = o === "" ? [] : o.split("/");
		e.forEach((t, n) => {
			let r = e.slice(0, n + 1).join("/");
			!l[r]?.loaded && !l[r]?.loading && f(r);
		});
	}, [
		o,
		f,
		l
	]);
	let p = (e) => {
		if (!l[e]?.loaded) {
			f(e);
			return;
		}
		u((t) => ({
			...t,
			[e]: {
				...t[e],
				expanded: !t[e].expanded
			}
		}));
	}, m = (e, t) => {
		let r = l[e];
		return r?.expanded ? r.children.map((e) => /* @__PURE__ */ (0, i.jsxs)("div", { children: [/* @__PURE__ */ (0, i.jsxs)("div", {
			className: `sf-tree-row ${o === e.path ? "active" : ""}`,
			style: { paddingInlineStart: `${4 + t * 14}px` },
			children: [/* @__PURE__ */ (0, i.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => p(e.path),
				"aria-expanded": l[e.path]?.expanded || !1,
				"aria-label": e.name,
				children: l[e.path]?.loading ? /* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-tree-loading",
					children: "…"
				}) : /* @__PURE__ */ (0, i.jsx)(n, { name: l[e.path]?.expanded ? "chevron-down" : "chevron-right" })
			}), /* @__PURE__ */ (0, i.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => c(e.path),
				title: e.path,
				children: [/* @__PURE__ */ (0, i.jsx)(n, { name: "folder" }), /* @__PURE__ */ (0, i.jsx)("span", { children: e.name })]
			})]
		}), m(e.path, t + 1)] }, e.path)) : null;
	};
	return /* @__PURE__ */ (0, i.jsxs)("nav", {
		className: "sf-folder-tree",
		"aria-label": s,
		children: [/* @__PURE__ */ (0, i.jsxs)("div", {
			className: `sf-tree-row ${o === "" ? "active" : ""}`,
			children: [/* @__PURE__ */ (0, i.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => p(""),
				"aria-expanded": l[""]?.expanded || !1,
				"aria-label": s,
				children: l[""]?.loading ? /* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-tree-loading",
					children: "…"
				}) : /* @__PURE__ */ (0, i.jsx)(n, { name: l[""]?.expanded ? "chevron-down" : "chevron-right" })
			}), /* @__PURE__ */ (0, i.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => c(""),
				children: [/* @__PURE__ */ (0, i.jsx)(n, { name: "folder" }), /* @__PURE__ */ (0, i.jsx)("span", { children: s })]
			})]
		}), m("", 1)]
	});
}
//#endregion
export { a as FolderTree };
