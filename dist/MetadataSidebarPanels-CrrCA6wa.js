import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-JdLj8VHV.js";
//#region src/components/MetadataSidebarPanels.tsx
var r = t(), i = e();
function a({ variant: e, items: t, labels: a, onOpen: o }) {
	let [s, d] = (0, r.useState)(!1);
	return e === "sidebar" ? /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-sidebar${s ? " collapsed" : ""}`,
		children: [/* @__PURE__ */ (0, i.jsx)(c, {
			title: a.title,
			count: t.length,
			collapsed: s,
			onToggle: () => d((e) => !e)
		}), /* @__PURE__ */ (0, i.jsx)(l, {
			collapsed: s,
			children: t.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-recent-empty",
				children: a.empty
			}) : t.slice(0, 8).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
				title: e.path,
				onClick: () => o(e.path),
				children: [/* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-recent-icon",
					children: /* @__PURE__ */ (0, i.jsx)(n, { name: "history" })
				}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, i.jsx)("small", { children: u(e.path, a.home) })] })]
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
			}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, i.jsx)("small", { children: u(e.path, a.home) })] })]
		}, e.path))]
	});
}
function o({ quickAccessByResource: e, resources: t, currentResource: a, quickAccessScope: o, labels: s, onOpenQuickAccess: d, onQuickAccessContext: f }) {
	let [p, m] = (0, r.useState)(!1), h = (o === "resource" ? (e[a] || []).map((e) => ({
		resource: a,
		...e
	})) : t.flatMap((t) => (e[t.name] || []).map((e) => ({
		resource: t.name,
		...e
	})))).filter((e) => e.directory !== !1);
	return /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-sidebar${p ? " collapsed" : ""}`,
		children: [/* @__PURE__ */ (0, i.jsx)(c, {
			title: s.quickAccess,
			count: h.length,
			collapsed: p,
			onToggle: () => m((e) => !e)
		}), /* @__PURE__ */ (0, i.jsxs)(l, {
			collapsed: p,
			children: [h.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-recent-empty",
				children: s.quickAccessEmpty
			}) : h.slice(0, 12).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
				className: e.exists ? "" : "missing",
				title: e.exists ? `${e.resource}: ${e.path}` : s.missing,
				onClick: () => d(e),
				onContextMenu: (t) => f(e, t),
				children: [/* @__PURE__ */ (0, i.jsx)("span", {
					className: "sf-recent-icon",
					children: /* @__PURE__ */ (0, i.jsx)(n, { name: e.exists ? "folder" : "warning" })
				}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.name }), /* @__PURE__ */ (0, i.jsx)("small", { children: e.exists ? o === "all" ? `${e.resource} · ${u(e.path, s.home)}` : u(e.path, s.home) : s.missing })] })]
			}, `${e.resource}:${e.path}`)), h.length > 12 && /* @__PURE__ */ (0, i.jsxs)("small", {
				className: "sf-sidebar-overflow",
				children: [
					"+",
					h.length - 12,
					" ",
					s.more
				]
			})]
		})]
	});
}
function s({ favorites: e, currentResource: t, favoritesActive: a, labels: o, onOpenFavorites: s, onOpenFavorite: d, onFavoriteContext: f }) {
	let [p, m] = (0, r.useState)(!1), h = new URL(window.location.href);
	h.searchParams.set("type", t), h.searchParams.set("collection", "favorites");
	let g = `${h.pathname}${h.search}${h.hash}`;
	return /* @__PURE__ */ (0, i.jsxs)("div", {
		className: `sf-recent sf-recent-sidebar${p ? " collapsed" : ""}`,
		children: [/* @__PURE__ */ (0, i.jsx)(c, {
			title: o.favorites,
			count: e.length,
			collapsed: p,
			onToggle: () => m((e) => !e)
		}), /* @__PURE__ */ (0, i.jsxs)(l, {
			collapsed: p,
			children: [
				e.length === 0 ? /* @__PURE__ */ (0, i.jsx)("p", {
					className: "sf-recent-empty",
					children: o.favoritesEmpty
				}) : e.slice(0, 8).map((e) => /* @__PURE__ */ (0, i.jsxs)("button", {
					title: e,
					onClick: () => d(e),
					onContextMenu: (t) => f(e, t),
					children: [/* @__PURE__ */ (0, i.jsx)("span", {
						className: "sf-recent-icon",
						children: /* @__PURE__ */ (0, i.jsx)(n, { name: "favorite" })
					}), /* @__PURE__ */ (0, i.jsxs)("span", { children: [/* @__PURE__ */ (0, i.jsx)("b", { children: e.split("/").pop() }), /* @__PURE__ */ (0, i.jsx)("small", { children: u(e, o.home) })] })]
				}, e)),
				e.length > 8 && /* @__PURE__ */ (0, i.jsxs)("small", {
					className: "sf-sidebar-overflow",
					children: [
						"+",
						e.length - 8,
						" ",
						o.more
					]
				}),
				/* @__PURE__ */ (0, i.jsxs)("a", {
					className: `sf-sidebar-section-link${a ? " active" : ""}`,
					href: g,
					onClick: (e) => {
						e.preventDefault(), s();
					},
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: o.favorites }), /* @__PURE__ */ (0, i.jsx)(n, { name: "chevron-right" })]
				})
			]
		})]
	});
}
function c({ title: e, count: t, collapsed: r, onToggle: a }) {
	return /* @__PURE__ */ (0, i.jsx)("header", { children: /* @__PURE__ */ (0, i.jsxs)("button", {
		type: "button",
		className: "sf-sidebar-section-toggle",
		"aria-label": e,
		"aria-expanded": !r,
		onClick: a,
		children: [/* @__PURE__ */ (0, i.jsx)("strong", { children: e }), /* @__PURE__ */ (0, i.jsxs)("span", { children: [t, /* @__PURE__ */ (0, i.jsx)(n, { name: "chevron-down" })] })]
	}) });
}
function l({ children: e, collapsed: t }) {
	return /* @__PURE__ */ (0, i.jsx)("div", {
		className: "sf-sidebar-section-content",
		"aria-hidden": t,
		inert: t,
		children: /* @__PURE__ */ (0, i.jsx)("div", { children: e })
	});
}
var u = (e, t) => e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : t;
//#endregion
export { s as FavoritesPanel, o as QuickAccessPanel, a as RecentPanel };
