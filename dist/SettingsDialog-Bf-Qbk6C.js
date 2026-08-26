import { t as e } from "./jsx-runtime-BuvfPIin.js";
import { t } from "./Modal-C1uNxIi2.js";
//#region src/components/SettingsDialog.tsx
var n = e();
function r({ resource: e, tools: r, features: i, columns: a, viewSizes: o, availability: s, scale: c, translate: l, onToolChange: u, onFeatureChange: d, onColumnChange: f, onViewSizeChange: p, onScaleChange: m, onClose: h }) {
	let g = l;
	return /* @__PURE__ */ (0, n.jsxs)(t, {
		title: g("settings"),
		closeLabel: g("close"),
		onClose: h,
		className: "sf-settings-modal",
		footer: /* @__PURE__ */ (0, n.jsx)("button", {
			className: "primary",
			onClick: h,
			children: g("done")
		}),
		children: [
			/* @__PURE__ */ (0, n.jsx)("p", { children: g("toolSettingsHint") }),
			e && /* @__PURE__ */ (0, n.jsxs)("p", {
				className: "sf-configured-limits",
				children: [
					g("configuredLimits"),
					": ",
					g("fileName"),
					" ",
					e.maxFileNameLength,
					" · ",
					g("folderName"),
					" ",
					e.maxFolderNameLength,
					" · ",
					g("folderDepth"),
					" ",
					e.maxFolderDepth
				]
			}),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: g("interfaceScale") }),
			/* @__PURE__ */ (0, n.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": g("interfaceScale"),
				children: [
					"compact",
					"standard",
					"large",
					"xlarge"
				].map((e) => /* @__PURE__ */ (0, n.jsxs)("label", { children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "radio",
					name: "sofinder-scale",
					value: e,
					checked: c === e,
					onChange: () => m(e)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: g(e === "compact" ? "scaleCompact" : e === "standard" ? "scaleStandard" : e === "large" ? "scaleLarge" : "scaleExtraLarge") })] }, e))
			}),
			["grid", "list"].map((e) => /* @__PURE__ */ (0, n.jsxs)("div", { children: [/* @__PURE__ */ (0, n.jsx)("h3", { children: g(e === "grid" ? "gridItemSize" : "listRowSize") }), /* @__PURE__ */ (0, n.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": g(e === "grid" ? "gridItemSize" : "listRowSize"),
				children: [
					"small",
					"medium",
					"large"
				].map((t) => /* @__PURE__ */ (0, n.jsxs)("label", { children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "radio",
					name: `sofinder-${e}-size`,
					value: t,
					checked: o[e] === t,
					onChange: () => p(e, t)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: g(t === "small" ? "sizeSmall" : t === "medium" ? "sizeMedium" : "sizeLarge") })] }, t))
			})] }, e)),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: g("optionalTools") }),
			s.batchRename !== !1 && /* @__PURE__ */ (0, n.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "checkbox",
					checked: r.batchRename,
					onChange: (e) => u("batchRename", e.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: g("batchRename") })]
			}),
			(s.imageEditing !== !1 || s.imageProcessing !== !1) && /* @__PURE__ */ (0, n.jsx)("h3", { children: g("imageTools") }),
			[
				"resize",
				"crop",
				"rotate",
				"presets",
				"process"
			].filter((e) => e === "process" ? s.imageProcessing !== !1 : s.imageEditing !== !1).map((e) => /* @__PURE__ */ (0, n.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "checkbox",
					checked: r[e],
					onChange: (t) => u(e, t.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: g(e === "presets" ? "preset" : e === "rotate" ? "rotationTools" : e === "process" ? "imageProcess" : e) })]
			}, e)),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: g("listColumns") }),
			[
				"size",
				"modified",
				"type"
			].map((e) => /* @__PURE__ */ (0, n.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "checkbox",
					checked: a[e],
					onChange: (t) => f(e, t.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: g(e === "size" ? "showSizeColumn" : e === "modified" ? "showModifiedColumn" : "showTypeColumn") })]
			}, e)),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: g("optionalFeatures") }),
			/* @__PURE__ */ (0, n.jsx)("p", { children: g("featureSettingsHint") }),
			[
				"autoCollapseUploads",
				"folderTree",
				"recent",
				"favorites",
				"tags",
				"archive",
				"trash"
			].filter((e) => e === "autoCollapseUploads" || s[e] !== !1).map((t) => /* @__PURE__ */ (0, n.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "checkbox",
					checked: i[t],
					disabled: t === "trash" && e?.storageCapabilities?.recoverableDelete === !1,
					onChange: (e) => d(t, e.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: g(t === "folderTree" ? "folderTreeFeature" : t === "favorites" ? "favoriteFeature" : t === "archive" ? "archiveFeature" : t === "trash" ? "trashFeature" : t === "tags" ? "tagsFeature" : t === "recent" ? "recentFeature" : "autoCollapseUploads") })]
			}, t))
		]
	});
}
//#endregion
export { r as SettingsDialog };
