import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
//#region src/components/FolderTree.tsx
var n = t(), r = e();
function i({ api: e, resource: t, currentPath: i, rootLabel: a, onNavigate: o }) {
	let [s, c] = (0, n.useState)({ "": {
		loading: !1,
		loaded: !1,
		expanded: !0,
		children: []
	} }), l = (0, n.useCallback)(async (n, r = !0) => {
		c((e) => ({
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
			c((e) => ({
				...e,
				[n]: {
					loading: !1,
					loaded: !0,
					expanded: r,
					children: i.entries.filter((e) => e.directory)
				}
			}));
		} catch {
			c((e) => ({
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
	(0, n.useEffect)(() => {
		c({ "": {
			loading: !1,
			loaded: !1,
			expanded: !0,
			children: []
		} }), l("");
	}, [l, t]), (0, n.useEffect)(() => {
		let e = i === "" ? [] : i.split("/");
		e.forEach((t, n) => {
			let r = e.slice(0, n + 1).join("/");
			!s[r]?.loaded && !s[r]?.loading && l(r);
		});
	}, [
		i,
		l,
		s
	]);
	let u = (e) => {
		if (!s[e]?.loaded) {
			l(e);
			return;
		}
		c((t) => ({
			...t,
			[e]: {
				...t[e],
				expanded: !t[e].expanded
			}
		}));
	}, d = (e, t) => {
		let n = s[e];
		return n?.expanded ? n.children.map((e) => /* @__PURE__ */ (0, r.jsxs)("div", { children: [/* @__PURE__ */ (0, r.jsxs)("div", {
			className: `sf-tree-row ${i === e.path ? "active" : ""}`,
			style: { paddingInlineStart: `${8 + t * 16}px` },
			children: [/* @__PURE__ */ (0, r.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => u(e.path),
				"aria-expanded": s[e.path]?.expanded || !1,
				"aria-label": e.name,
				children: s[e.path]?.loading ? "…" : s[e.path]?.expanded ? "⌄" : "›"
			}), /* @__PURE__ */ (0, r.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => o(e.path),
				title: e.path,
				children: ["▰ ", e.name]
			})]
		}), d(e.path, t + 1)] }, e.path)) : null;
	};
	return /* @__PURE__ */ (0, r.jsxs)("nav", {
		className: "sf-folder-tree",
		"aria-label": a,
		children: [/* @__PURE__ */ (0, r.jsxs)("div", {
			className: `sf-tree-row ${i === "" ? "active" : ""}`,
			children: [/* @__PURE__ */ (0, r.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => u(""),
				"aria-expanded": s[""]?.expanded || !1,
				children: "⌄"
			}), /* @__PURE__ */ (0, r.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => o(""),
				children: ["⌂ ", a]
			})]
		}), d("", 1)]
	});
}
//#endregion
export { i as FolderTree };
