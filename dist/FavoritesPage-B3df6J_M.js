import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./UiIcon-JdLj8VHV.js";
//#region src/components/FavoritesPage.tsx
var n = e();
function r({ paths: e, search: r, locale: i, labels: a, onOpen: o, onRemove: s }) {
	let c = r.trim().toLocaleLowerCase(i), l = e.filter((e) => c === "" || e.toLocaleLowerCase(i).includes(c));
	return /* @__PURE__ */ (0, n.jsxs)("section", {
		className: "sf-favorites-page",
		"aria-labelledby": "sf-favorites-title",
		children: [/* @__PURE__ */ (0, n.jsxs)("header", { children: [/* @__PURE__ */ (0, n.jsxs)("div", { children: [/* @__PURE__ */ (0, n.jsx)("span", {
			className: "sf-favorites-mark",
			children: /* @__PURE__ */ (0, n.jsx)(t, { name: "favorite" })
		}), /* @__PURE__ */ (0, n.jsxs)("div", { children: [/* @__PURE__ */ (0, n.jsx)("h2", {
			id: "sf-favorites-title",
			children: a.title
		}), /* @__PURE__ */ (0, n.jsx)("p", { children: a.hint })] })] }), /* @__PURE__ */ (0, n.jsxs)("span", { children: [
			l.length,
			" / ",
			e.length
		] })] }), l.length === 0 ? /* @__PURE__ */ (0, n.jsx)("div", {
			className: "sf-state",
			children: e.length === 0 ? a.empty : a.noMatch
		}) : /* @__PURE__ */ (0, n.jsx)("div", {
			className: "sf-favorites-links",
			children: l.map((e) => /* @__PURE__ */ (0, n.jsxs)("article", { children: [/* @__PURE__ */ (0, n.jsxs)("button", {
				className: "sf-favorite-open",
				title: e,
				onClick: () => o(e),
				children: [
					/* @__PURE__ */ (0, n.jsx)("span", {
						className: "sf-favorites-mark",
						children: /* @__PURE__ */ (0, n.jsx)(t, { name: "favorite" })
					}),
					/* @__PURE__ */ (0, n.jsxs)("span", { children: [/* @__PURE__ */ (0, n.jsx)("b", { children: e.split("/").pop() }), /* @__PURE__ */ (0, n.jsx)("small", { children: e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : a.home })] }),
					/* @__PURE__ */ (0, n.jsx)("span", {
						className: "sf-favorite-open-label",
						children: a.open
					})
				]
			}), /* @__PURE__ */ (0, n.jsx)("button", {
				className: "sf-favorite-remove",
				"aria-label": `${a.remove}: ${e}`,
				title: a.remove,
				onClick: () => s(e),
				children: /* @__PURE__ */ (0, n.jsx)(t, { name: "close" })
			})] }, e))
		})]
	});
}
//#endregion
export { r as default };
