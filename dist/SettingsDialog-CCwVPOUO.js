import { t as e } from "./jsx-runtime-BuvfPIin.js";
import { t } from "./Modal-u0Bikd5w.js";
//#region src/components/SettingsDialog.tsx
var n = e();
function r({ resource: e, tools: r, features: i, columns: a, viewSizes: o, availability: s, scale: c, uploadConflictStrategy: l, translate: u, onToolChange: d, onFeatureChange: f, onColumnChange: p, onViewSizeChange: m, onScaleChange: h, onUploadConflictStrategyChange: g, onClose: _ }) {
	let v = u;
	return /* @__PURE__ */ (0, n.jsxs)(t, {
		title: v("settings"),
		closeLabel: v("close"),
		onClose: _,
		className: "sf-settings-modal",
		footer: /* @__PURE__ */ (0, n.jsx)("button", {
			className: "primary",
			onClick: _,
			children: v("done")
		}),
		children: [
			/* @__PURE__ */ (0, n.jsx)("p", { children: v("toolSettingsHint") }),
			e && /* @__PURE__ */ (0, n.jsxs)("p", {
				className: "sf-configured-limits",
				children: [
					v("configuredLimits"),
					": ",
					v("fileName"),
					" ",
					e.maxFileNameLength,
					" · ",
					v("folderName"),
					" ",
					e.maxFolderNameLength,
					" · ",
					v("folderDepth"),
					" ",
					e.maxFolderDepth
				]
			}),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: v("interfaceScale") }),
			/* @__PURE__ */ (0, n.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": v("interfaceScale"),
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
					onChange: () => h(e)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v(e === "compact" ? "scaleCompact" : e === "standard" ? "scaleStandard" : e === "large" ? "scaleLarge" : "scaleExtraLarge") })] }, e))
			}),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: v("uploadConflictSetting") }),
			/* @__PURE__ */ (0, n.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": v("uploadConflictSetting"),
				children: [
					"ask",
					"rename",
					"overwrite",
					"skip"
				].map((e) => /* @__PURE__ */ (0, n.jsxs)("label", { children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "radio",
					name: "sofinder-upload-conflict",
					value: e,
					checked: l === e,
					onChange: () => g(e)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v(e === "ask" ? "uploadConflictAsk" : e === "rename" ? "uploadConflictRename" : e === "overwrite" ? "uploadConflictOverwrite" : "uploadConflictSkip") })] }, e))
			}),
			["grid", "list"].map((e) => /* @__PURE__ */ (0, n.jsxs)("div", { children: [/* @__PURE__ */ (0, n.jsx)("h3", { children: v(e === "grid" ? "gridItemSize" : "listRowSize") }), /* @__PURE__ */ (0, n.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": v(e === "grid" ? "gridItemSize" : "listRowSize"),
				children: [
					"small",
					"medium",
					"large"
				].map((t) => /* @__PURE__ */ (0, n.jsxs)("label", { children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "radio",
					name: `sofinder-${e}-size`,
					value: t,
					checked: o[e] === t,
					onChange: () => m(e, t)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v(t === "small" ? "sizeSmall" : t === "medium" ? "sizeMedium" : "sizeLarge") })] }, t))
			})] }, e)),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: v("optionalTools") }),
			s.batchRename !== !1 && /* @__PURE__ */ (0, n.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "checkbox",
					checked: r.batchRename,
					onChange: (e) => d("batchRename", e.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v("batchRename") })]
			}),
			(s.imageEditing !== !1 || s.imageProcessing !== !1) && /* @__PURE__ */ (0, n.jsx)("h3", { children: v("imageTools") }),
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
					onChange: (t) => d(e, t.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v(e === "presets" ? "preset" : e === "rotate" ? "rotationTools" : e === "process" ? "imageProcess" : e) })]
			}, e)),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: v("listColumns") }),
			[
				"size",
				"modified",
				"type"
			].map((e) => /* @__PURE__ */ (0, n.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, n.jsx)("input", {
					type: "checkbox",
					checked: a[e],
					onChange: (t) => p(e, t.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v(e === "size" ? "showSizeColumn" : e === "modified" ? "showModifiedColumn" : "showTypeColumn") })]
			}, e)),
			/* @__PURE__ */ (0, n.jsx)("h3", { children: v("optionalFeatures") }),
			/* @__PURE__ */ (0, n.jsx)("p", { children: v("featureSettingsHint") }),
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
					onChange: (e) => f(t, e.target.checked)
				}), /* @__PURE__ */ (0, n.jsx)("span", { children: v(t === "folderTree" ? "folderTreeFeature" : t === "favorites" ? "favoriteFeature" : t === "archive" ? "archiveFeature" : t === "trash" ? "trashFeature" : t === "tags" ? "tagsFeature" : t === "recent" ? "recentFeature" : "autoCollapseUploads") })]
			}, t))
		]
	});
}
//#endregion
export { r as SettingsDialog };
