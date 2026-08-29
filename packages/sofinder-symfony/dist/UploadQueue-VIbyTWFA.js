import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./UiIcon-JdLj8VHV.js";
//#region src/components/UploadQueue.tsx
var n = e();
function r({ tasks: e, collapsed: r, labels: i, onToggle: a, onCancel: o, onCancelAll: s, onClearFinished: c, onRetry: l, onRemove: u }) {
	if (e.length === 0) return null;
	let d = e.some((e) => e.status === "queued" || e.status === "uploading"), f = e.filter((e) => e.status !== "queued" && e.status !== "uploading").length;
	return /* @__PURE__ */ (0, n.jsxs)("section", {
		className: `sf-upload-panel${r ? " collapsed" : ""}`,
		"aria-label": i.title,
		children: [/* @__PURE__ */ (0, n.jsxs)("header", { children: [
			/* @__PURE__ */ (0, n.jsx)("button", {
				className: "sf-upload-collapse",
				onClick: a,
				"aria-expanded": !r,
				title: r ? i.expand : i.collapse,
				children: /* @__PURE__ */ (0, n.jsx)(t, { name: r ? "chevron-right" : "chevron-down" })
			}),
			/* @__PURE__ */ (0, n.jsx)("strong", { children: i.title }),
			/* @__PURE__ */ (0, n.jsxs)("span", { children: [
				f,
				"/",
				e.length
			] }),
			/* @__PURE__ */ (0, n.jsx)("button", {
				onClick: s,
				disabled: !d,
				children: i.cancelAll
			}),
			/* @__PURE__ */ (0, n.jsx)("button", {
				onClick: c,
				children: i.clearFinished
			})
		] }), !r && /* @__PURE__ */ (0, n.jsx)("div", {
			className: "sf-upload-list",
			children: e.map((e) => /* @__PURE__ */ (0, n.jsxs)("div", {
				className: `sf-upload-task ${e.status}`,
				children: [
					/* @__PURE__ */ (0, n.jsx)("span", {
						className: "sf-upload-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ (0, n.jsx)("progress", {
						max: "100",
						value: e.progress,
						"aria-label": `${e.name}: ${e.progress}%`
					}),
					/* @__PURE__ */ (0, n.jsx)("span", { children: e.status === "uploading" ? `${e.progress}%` : i.status(e.status) }),
					(e.status === "queued" || e.status === "uploading") && /* @__PURE__ */ (0, n.jsx)("button", {
						onClick: () => o(e.id),
						children: i.cancel
					}),
					(e.status === "error" || e.status === "cancelled") && /* @__PURE__ */ (0, n.jsx)("button", {
						onClick: () => l(e.id),
						children: i.retry
					}),
					/* @__PURE__ */ (0, n.jsx)("button", {
						className: "sf-upload-remove",
						onClick: () => u(e.id),
						title: i.remove,
						"aria-label": `${i.remove}: ${e.name}`,
						children: /* @__PURE__ */ (0, n.jsx)(t, { name: "close" })
					}),
					e.message && /* @__PURE__ */ (0, n.jsx)("small", {
						title: e.message,
						children: e.message
					})
				]
			}, e.id))
		})]
	});
}
//#endregion
export { r as UploadQueue };
