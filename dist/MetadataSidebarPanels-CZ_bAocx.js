import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-ClFQjiWf.js";
//#region src/components/MetadataSidebarPanels.tsx
var r = t(), i = e();
function a({ variant: e, items: t, labels: a, onOpen: o }) {
	let [u, d] = (0, r.useState)(!1);
	return e === "sidebar" ? /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-sidebar${u ? " collapsed" : ""}`,
		children: [/* @__PURE__ */ (0, i.jsx)(s, {
			title: a.title,
			count: t.length,
			collapsed: u,
			onToggle: () => d((e) => !e)
		}), /* @__PURE__ */ (0, i.jsx)(c, {
			collapsed: u,
			children: t.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-recent-empty",
				children: a.empty
			}) : t.slice(0, 8).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
				title: e.path,
				onClick: () => o(e.path),
				children: [/* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-recent-icon",
					children: /* @__PURE__ */ (0, i.jsx)(n, { name: "history" })
				}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, i.jsx)("small", { children: l(e.path, a.home) })] })]
			}, e.path))
		})]
	}) : /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-${e}`,
		children: [/* @__PURE__ */ (0, i.jsxs)("header", { children: [/* @__PURE__ */ (0, i.jsx)("strong", { children: a.title }), /* @__PURE__ */ (0, i.jsx)("span", { children: t.length })] }), t.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
			className: "sf-recent-empty",
			children: a.empty
		}) : t.slice(0, 8).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
			title: e.path,
			onClick: () => o(e.path),
			children: [/* @__PURE__ */ (0, i.jsx)("span", {
				className: "sf-recent-icon",
				children: /* @__PURE__ */ (0, i.jsx)(n, { name: "history" })
			}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, i.jsx)("small", { children: l(e.path, a.home) })] })]
		}, e.path))]
	});
}
function o({ favorites: e, quickAccessByResource: t, resources: a, currentResource: o, quickAccessScope: u, showFavorites: d, showQuickAccess: f, favoritesActive: p, labels: m, onOpenFavorites: h, onOpenFavorite: g, onOpenQuickAccess: _, onQuickAccessContext: v, onFavoriteContext: y }) {
	let [b, x] = (0, r.useState)(!1), [S, C] = (0, r.useState)(!1), w = u === "resource" ? (t[o] || []).map((e) => ({
		resource: o,
		...e
	})) : a.flatMap((e) => (t[e.name] || []).map((t) => ({
		resource: e.name,
		...t
	}))), T = new URL(window.location.href);
	T.searchParams.set("type", o), T.searchParams.set("collection", "favorites");
	let E = `${T.pathname}${T.search}${T.hash}`;
	return /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [f && /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-sidebar${b ? " collapsed" : ""}`,
		children: [/* @__PURE__ */ (0, i.jsx)(s, {
			title: m.quickAccess,
			count: w.length,
			collapsed: b,
			onToggle: () => x((e) => !e)
		}), /* @__PURE__ */ (0, i.jsxs)(c, {
			collapsed: b,
			children: [w.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-recent-empty",
				children: m.quickAccessEmpty
			}) : w.slice(0, 12).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
				className: e.exists ? "" : "missing",
				title: e.exists ? `${e.resource}: ${e.path}` : m.missing,
				onClick: () => _(e),
				onContextMenu: (t) => v(e, t),
				children: [/* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-recent-icon",
					children: /* @__PURE__ */ (0, i.jsx)(n, { name: e.exists ? e.directory ? "folder" : "file" : "warning" })
				}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.name }), /* @__PURE__ */ (0, i.jsx)("small", { children: e.exists ? u === "all" ? `${e.resource} · ${l(e.path, m.home)}` : l(e.path, m.home) : m.missing })] })]
			}, `${e.resource}:${e.path}`)), w.length > 12 && /* @__PURE__ */ (0, i.jsxs)("small", {
				className: "sf-sidebar-overflow",
				children: [
					"+",
					w.length - 12,
					" ",
					m.more
				]
			})]
		})]
	}), d && /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-sidebar${S ? " collapsed" : ""}`,
		children: [/* @__PURE__ */ (0, i.jsx)(s, {
			title: m.favorites,
			count: e.length,
			collapsed: S,
			onToggle: () => C((e) => !e)
		}), /* @__PURE__ */ (0, i.jsxs)(c, {
			collapsed: S,
			children: [
				e.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
					className: "sf-recent-empty",
					children: m.favoritesEmpty
				}) : e.slice(0, 8).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
					title: e,
					onClick: () => g(e),
					onContextMenu: (t) => y(e, t),
					children: [/* @__PURE__ */ (0, i.jsx)("span", {
						className: "sf-recent-icon",
						children: /* @__PURE__ */ (0, i.jsx)(n, { name: "favorite" })
					}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.split("/").pop() }), /* @__PURE__ */ (0, i.jsx)("small", { children: l(e, m.home) })] })]
				}, e)),
				e.length > 8 && /* @__PURE__ */ (0, i.jsxs)("small", {
					className: "sf-sidebar-overflow",
					children: [
						"+",
						e.length - 8,
						" ",
						m.more
					]
				}),
				/* @__PURE__ */ (0, i.jsxs)("a", {
					className: `sf-sidebar-section-link${p ? " active" : ""}`,
					href: E,
					onClick: (e) => {
						e.preventDefault(), h();
					},
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: m.favorites }), /* @__PURE__ */ (0, i.jsx)(n, { name: "chevron-right" })]
				})
			]
		})]
	})] });
}
function s({ title: e, count: t, collapsed: r, onToggle: a }) {
	return /* @__PURE__ */ (0, i.jsx)("header", { children: /* @__PURE__ */ (0, i.jsxs)("button", {
		type: "button",
		className: "sf-sidebar-section-toggle",
		"aria-label": e,
		"aria-expanded": !r,
		onClick: a,
		children: [/* @__PURE__ */ (0, i.jsx)("strong", { children: e }), /* @__PURE__ */ (0, i.jsxs)("span", { children: [t, /* @__PURE__ */ (0, i.jsx)(n, { name: "chevron-down" })] })]
	}) });
}
function c({ children: e, collapsed: t }) {
	return /* @__PURE__ */ (0, i.jsx)("div", {
		className: "sf-sidebar-section-content",
		"aria-hidden": t,
		inert: t,
		children: /* @__PURE__ */ (0, i.jsx)("div", { children: e })
	});
}
var l = (e, t) => e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : t;
//#endregion
export { a as RecentPanel, o as default };
