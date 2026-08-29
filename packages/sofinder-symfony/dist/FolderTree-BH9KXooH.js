import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-JdLj8VHV.js";
//#region src/components/FolderTree.tsx
var r = t(), i = e();
function a({ api: e, resource: t, currentPath: a, rootLabel: o, onNavigate: s }) {
	let [c, l] = (0, r.useState)({ "": {
		loading: !1,
		loaded: !1,
		expanded: !0,
		children: []
	} }), u = (0, r.useCallback)(async (n, r = !0) => {
		l((e) => ({
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
			let i = await e.list(t, n, "", "name", "asc", 0, 500);
			l((e) => ({
				...e,
				[n]: {
					loading: !1,
					loaded: !0,
					expanded: r,
					children: i.entries.filter((e) => e.directory)
				}
			}));
		} catch {
			l((e) => ({
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
	(0, r.useEffect)(() => {
		l({ "": {
			loading: !1,
			loaded: !1,
			expanded: !0,
			children: []
		} }), u("");
	}, [u, t]), (0, r.useEffect)(() => {
		let e = a === "" ? [] : a.split("/");
		e.forEach((t, n) => {
			let r = e.slice(0, n + 1).join("/");
			!c[r]?.loaded && !c[r]?.loading && u(r);
		});
	}, [
		a,
		u,
		c
	]);
	let d = (e) => {
		if (!c[e]?.loaded) {
			u(e);
			return;
		}
		l((t) => ({
			...t,
			[e]: {
				...t[e],
				expanded: !t[e].expanded
			}
		}));
	}, f = (e, t) => {
		let r = c[e];
		return r?.expanded ? r.children.map((e) => /* @__PURE__ */ (0, i.jsxs)("div", { children: [/* @__PURE__ */ (0, i.jsxs)("div", {
			className: `sf-tree-row ${a === e.path ? "active" : ""}`,
			style: { paddingInlineStart: `${4 + t * 14}px` },
			children: [/* @__PURE__ */ (0, i.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => d(e.path),
				"aria-expanded": c[e.path]?.expanded || !1,
				"aria-label": e.name,
				children: c[e.path]?.loading ? /* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-tree-loading",
					children: "…"
				}) : /* @__PURE__ */ (0, i.jsx)(n, { name: c[e.path]?.expanded ? "chevron-down" : "chevron-right" })
			}), /* @__PURE__ */ (0, i.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => s(e.path),
				title: e.path,
				children: [/* @__PURE__ */ (0, i.jsx)(n, { name: "folder" }), /* @__PURE__ */ (0, i.jsx)("span", { children: e.name })]
			})]
		}), f(e.path, t + 1)] }, e.path)) : null;
	};
	return /* @__PURE__ */ (0, i.jsxs)("nav", {
		className: "sf-folder-tree",
		"aria-label": o,
		children: [/* @__PURE__ */ (0, i.jsxs)("div", {
			className: `sf-tree-row ${a === "" ? "active" : ""}`,
			children: [/* @__PURE__ */ (0, i.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => d(""),
				"aria-expanded": c[""]?.expanded || !1,
				"aria-label": o,
				children: c[""]?.loading ? /* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-tree-loading",
					children: "…"
				}) : /* @__PURE__ */ (0, i.jsx)(n, { name: c[""]?.expanded ? "chevron-down" : "chevron-right" })
			}), /* @__PURE__ */ (0, i.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => s(""),
				children: [/* @__PURE__ */ (0, i.jsx)(n, { name: "folder" }), /* @__PURE__ */ (0, i.jsx)("span", { children: o })]
			})]
		}), f("", 1)]
	});
}
//#endregion
export { a as FolderTree };
