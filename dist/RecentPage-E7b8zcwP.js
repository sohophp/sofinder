import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./UiIcon-JdLj8VHV.js";
//#region src/components/RecentPage.tsx
var n = e();
function r({ items: e, search: r, locale: i, labels: a, onOpen: o }) {
	let s = r.trim().toLocaleLowerCase(i), c = e.filter((e) => s === "" || e.path.toLocaleLowerCase(i).includes(s));
	return /* @__PURE__ */ (0, n.jsxs)("section", {
		className: "sf-favorites-page",
		"aria-labelledby": "sf-recent-title",
		children: [/* @__PURE__ */ (0, n.jsxs)("header", { children: [/* @__PURE__ */ (0, n.jsxs)("div", { children: [/* @__PURE__ */ (0, n.jsx)("span", {
			className: "sf-favorites-mark",
			children: /* @__PURE__ */ (0, n.jsx)(t, { name: "history" })
		}), /* @__PURE__ */ (0, n.jsxs)("div", { children: [/* @__PURE__ */ (0, n.jsx)("h2", {
			id: "sf-recent-title",
			children: a.title
		}), /* @__PURE__ */ (0, n.jsx)("p", { children: a.hint })] })] }), /* @__PURE__ */ (0, n.jsxs)("span", { children: [
			c.length,
			" / ",
			e.length
		] })] }), c.length === 0 ? /* @__PURE__ */ (0, n.jsx)("div", {
			className: "sf-state",
			children: e.length === 0 ? a.empty : a.noMatch
		}) : /* @__PURE__ */ (0, n.jsx)("div", {
			className: "sf-favorites-links",
			children: c.map((e) => /* @__PURE__ */ (0, n.jsx)("article", { children: /* @__PURE__ */ (0, n.jsxs)("button", {
				className: "sf-favorite-open",
				title: e.path,
				onClick: () => o(e.path),
				children: [
					/* @__PURE__ */ (0, n.jsx)("span", {
						className: "sf-favorites-mark",
						children: /* @__PURE__ */ (0, n.jsx)(t, { name: "history" })
					}),
					/* @__PURE__ */ (0, n.jsxs)("span", { children: [/* @__PURE__ */ (0, n.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, n.jsx)("small", { children: e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : a.home })] }),
					/* @__PURE__ */ (0, n.jsx)("span", {
						className: "sf-favorite-open-label",
						children: a.open
					})
				]
			}) }, e.path))
		})]
	});
}
//#endregion
export { r as default };
