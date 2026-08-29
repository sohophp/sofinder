import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-ClPLM5jI.js";
//#region src/components/PreferenceProfiles.tsx
var r = t(), i = e(), a = "sofinder.preferenceProfiles.v1", o = 10, s = {
	en: {
		title: "Preferences and presets",
		hint: "Restore a built-in layout preset, or save the complete current settings as a named profile.",
		preset: "Choose a built-in preset",
		standard: "Standard layout",
		compact: "Compact layout",
		spacious: "Large-screen layout",
		restore: "Restore preset",
		restored: "Built-in preset restored.",
		reset: "Restore system defaults",
		resetDone: "System defaults restored.",
		name: "Profile name",
		save: "Save current",
		choose: "Choose a profile",
		apply: "Apply",
		remove: "Delete profile",
		saved: "Preference profile saved.",
		applied: "Preference profile applied.",
		empty: "No saved profiles",
		maximum: "profiles maximum"
	},
	"zh-cn": {
		title: "偏好与预设",
		hint: "可以恢复内置布局预设，也可以把当前整套设置保存为命名方案。",
		preset: "选择内置预设",
		standard: "标准布局",
		compact: "紧凑布局",
		spacious: "大屏布局",
		restore: "恢复预设",
		restored: "已恢复内置预设。",
		reset: "恢复系统默认",
		resetDone: "已恢复系统默认设置。",
		name: "偏好名称",
		save: "保存当前设置",
		choose: "选择偏好方案",
		apply: "应用",
		remove: "删除方案",
		saved: "偏好方案已保存。",
		applied: "偏好方案已应用。",
		empty: "暂无已保存方案",
		maximum: "个方案上限"
	},
	"zh-tw": {
		title: "偏好與預設",
		hint: "可以還原內建版面預設，也可以將目前整套設定儲存為命名方案。",
		preset: "選擇內建預設",
		standard: "標準版面",
		compact: "緊湊版面",
		spacious: "大螢幕版面",
		restore: "還原預設",
		restored: "已還原內建預設。",
		reset: "還原系統預設",
		resetDone: "已還原系統預設設定。",
		name: "偏好名稱",
		save: "儲存目前設定",
		choose: "選擇偏好方案",
		apply: "套用",
		remove: "刪除方案",
		saved: "偏好方案已儲存。",
		applied: "偏好方案已套用。",
		empty: "暫無已儲存方案",
		maximum: "個方案上限"
	}
}, c = (e, t) => typeof e == "object" && !!e && t.every((t) => typeof e[t] == "boolean"), l = (e) => {
	if (typeof e != "object" || !e) return !1;
	let t = e, n = t.viewSizes, r = t.features;
	return c(t.tools, [
		"resize",
		"crop",
		"rotate",
		"presets",
		"process",
		"batchRename"
	]) && c(t.features, [
		"recent",
		"favorites",
		"tags",
		"archive",
		"trash",
		"folderTree",
		"qrCode",
		"autoCollapseUploads"
	]) && r !== null && [
		r.sidebarFavorites,
		r.sidebarQuickAccess,
		r.quickAccessFiles
	].every((e) => e === void 0 || typeof e == "boolean") && c(t.columns, [
		"size",
		"modified",
		"type"
	]) && typeof n == "object" && !!n && [n.grid, n.list].every((e) => e === "small" || e === "medium" || e === "large") && (t.folderTreePlacement === "left" || t.folderTreePlacement === "right") && (t.quickAccessScope === void 0 || t.quickAccessScope === "all" || t.quickAccessScope === "resource") && [
		"compact",
		"standard",
		"large",
		"xlarge"
	].includes(String(t.scale)) && [
		"ask",
		"rename",
		"overwrite",
		"skip"
	].includes(String(t.uploadConflictStrategy));
}, u = () => {
	try {
		let e = JSON.parse(localStorage.getItem(a) || "[]");
		return Array.isArray(e) ? e.filter((e) => typeof e == "object" && !!e && typeof e.id == "string" && typeof e.name == "string" && e.name.length > 0 && e.name.length <= 40 && Number.isFinite(e.updatedAt) && l(e.settings)).map((e) => ({
			...e,
			settings: {
				...e.settings,
				features: {
					...e.settings.features,
					sidebarFavorites: e.settings.features.sidebarFavorites !== !1,
					sidebarQuickAccess: e.settings.features.sidebarQuickAccess !== !1,
					quickAccessFiles: !1
				},
				quickAccessScope: e.settings.quickAccessScope === "resource" ? "resource" : "all"
			}
		})).slice(0, o) : [];
	} catch {
		return [];
	}
}, d = (e) => localStorage.setItem(a, JSON.stringify(e.slice(0, o)));
function f({ current: e, onApply: t, onReset: n }) {
	let a = document.documentElement.lang.toLowerCase(), c = s[a === "zh-tw" ? "zh-tw" : a.startsWith("zh") ? "zh-cn" : "en"], [l, f] = (0, r.useState)(u), [p, m] = (0, r.useState)(""), [h, g] = (0, r.useState)(""), [_, v] = (0, r.useState)("standard"), [y, b] = (0, r.useState)(""), x = (0, r.useMemo)(() => l.find((e) => e.id === h), [l, h]), S = () => {
		let t = p.trim().slice(0, 40);
		if (!t) return;
		let n = {
			id: l.find((e) => e.name.toLocaleLowerCase() === t.toLocaleLowerCase())?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
			name: t,
			updatedAt: Date.now(),
			settings: structuredClone(e)
		}, r = [n, ...l.filter((e) => e.id !== n.id)].slice(0, o);
		f(r), d(r), g(n.id), m(""), b(c.saved);
	};
	return /* @__PURE__ */ (0, i.jsxs)("section", {
		className: "sf-preference-profiles",
		children: [
			/* @__PURE__ */ (0, i.jsx)("h3", { children: c.title }),
			/* @__PURE__ */ (0, i.jsx)("p", { children: c.hint }),
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-preference-presets",
				children: [
					/* @__PURE__ */ (0, i.jsxs)("select", {
						value: _,
						"aria-label": c.preset,
						onChange: (e) => v(e.target.value),
						children: [
							/* @__PURE__ */ (0, i.jsx)("option", {
								value: "standard",
								children: c.standard
							}),
							/* @__PURE__ */ (0, i.jsx)("option", {
								value: "compact",
								children: c.compact
							}),
							/* @__PURE__ */ (0, i.jsx)("option", {
								value: "spacious",
								children: c.spacious
							})
						]
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: () => {
							let n = _ === "compact", r = _ === "spacious";
							t({
								...structuredClone(e),
								scale: n ? "compact" : r ? "large" : "standard",
								viewSizes: {
									grid: n ? "small" : r ? "large" : "medium",
									list: n ? "small" : r ? "large" : "medium"
								},
								columns: {
									size: !0,
									modified: !n,
									type: r
								}
							}), b(c.restored);
						},
						children: c.restore
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: () => {
							n(), b(c.resetDone);
						},
						children: c.reset
					})
				]
			}),
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-preference-save",
				children: [/* @__PURE__ */ (0, i.jsx)("input", {
					value: p,
					maxLength: 40,
					placeholder: c.name,
					"aria-label": c.name,
					onChange: (e) => m(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && (e.preventDefault(), S());
					}
				}), /* @__PURE__ */ (0, i.jsx)("button", {
					type: "button",
					disabled: p.trim() === "",
					onClick: S,
					children: c.save
				})]
			}),
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-preference-apply",
				children: [
					/* @__PURE__ */ (0, i.jsxs)("select", {
						value: h,
						"aria-label": c.choose,
						onChange: (e) => {
							g(e.target.value), b("");
						},
						children: [/* @__PURE__ */ (0, i.jsx)("option", {
							value: "",
							children: l.length === 0 ? c.empty : c.choose
						}), l.map((e) => /* @__PURE__ */ (0, i.jsx)("option", {
							value: e.id,
							children: e.name
						}, e.id))]
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						className: "primary",
						disabled: !x,
						onClick: () => {
							x && (t(structuredClone(x.settings)), b(c.applied));
						},
						children: c.apply
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						className: "danger",
						disabled: !x,
						onClick: () => {
							if (!x) return;
							let e = l.filter((e) => e.id !== x.id);
							f(e), d(e), g(""), b("");
						},
						children: c.remove
					})
				]
			}),
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-preference-meta",
				children: [/* @__PURE__ */ (0, i.jsxs)("small", { children: [
					l.length,
					" / ",
					o,
					" ",
					c.maximum
				] }), /* @__PURE__ */ (0, i.jsx)("span", {
					role: "status",
					"aria-live": "polite",
					children: y
				})]
			})
		]
	});
}
//#endregion
//#region src/components/SettingsDialog.tsx
function p({ resource: e, tools: t, features: r, columns: a, viewSizes: o, folderTreePlacement: s, quickAccessScope: c, availability: l, scale: u, uploadConflictStrategy: d, translate: p, onToolChange: m, onFeatureChange: h, onColumnChange: g, onViewSizeChange: _, onFolderTreePlacementChange: v, onQuickAccessScopeChange: y, onScaleChange: b, onUploadConflictStrategyChange: x, onReset: S, onClose: C }) {
	let w = p, T = document.documentElement.lang.toLowerCase(), E = T === "zh-tw" ? {
		title: "固定資料夾顯示範圍",
		all: "全部根目錄",
		resource: "目前根目錄"
	} : T.startsWith("zh") ? {
		title: "固定文件夹显示范围",
		all: "全部根目录",
		resource: "当前根目录"
	} : {
		title: "Pinned folder scope",
		all: "All storage roots",
		resource: "Current storage root"
	}, D = T === "zh-tw" ? {
		title: "側邊欄內容",
		favorites: "顯示收藏檔案",
		quick: "顯示固定資料夾"
	} : T.startsWith("zh") ? {
		title: "侧边栏内容",
		favorites: "显示收藏文件",
		quick: "显示固定文件夹"
	} : {
		title: "Sidebar content",
		favorites: "Show favorite files",
		quick: "Show pinned folders"
	}, O = T === "zh-tw" ? {
		appearance: "外觀",
		operations: "檔案操作",
		list: "清單",
		features: "功能與側邊欄"
	} : T.startsWith("zh") ? {
		appearance: "外观",
		operations: "文件操作",
		list: "列表",
		features: "功能与侧边栏"
	} : {
		appearance: "Appearance",
		operations: "File operations",
		list: "List",
		features: "Features and sidebar"
	};
	return /* @__PURE__ */ (0, i.jsxs)(n, {
		title: w("settings"),
		closeLabel: w("close"),
		onClose: C,
		className: "sf-settings-modal",
		footer: /* @__PURE__ */ (0, i.jsx)("button", {
			className: "primary",
			onClick: C,
			children: w("done")
		}),
		children: [
			/* @__PURE__ */ (0, i.jsx)("p", { children: w("toolSettingsHint") }),
			e && /* @__PURE__ */ (0, i.jsxs)("p", {
				className: "sf-configured-limits",
				children: [
					w("configuredLimits"),
					": ",
					w("fileName"),
					" ",
					e.maxFileNameLength,
					" · ",
					w("folderName"),
					" ",
					e.maxFolderNameLength,
					" · ",
					w("folderDepth"),
					" ",
					e.maxFolderDepth
				]
			}),
			/* @__PURE__ */ (0, i.jsx)(f, {
				current: {
					tools: t,
					features: r,
					columns: a,
					viewSizes: o,
					folderTreePlacement: s,
					quickAccessScope: c,
					scale: u,
					uploadConflictStrategy: d
				},
				onReset: S,
				onApply: (e) => {
					Object.keys(e.tools).forEach((t) => m(t, e.tools[t])), Object.keys(e.features).forEach((t) => h(t, e.features[t])), Object.keys(e.columns).forEach((t) => g(t, e.columns[t])), Object.keys(e.viewSizes).forEach((t) => _(t, e.viewSizes[t])), v(e.folderTreePlacement), y(e.quickAccessScope), b(e.scale), x(e.uploadConflictStrategy);
				}
			}),
			/* @__PURE__ */ (0, i.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, i.jsx)("h2", { children: O.appearance }),
					/* @__PURE__ */ (0, i.jsx)("h3", { children: w("interfaceScale") }),
					/* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": w("interfaceScale"),
						children: [
							"compact",
							"standard",
							"large",
							"xlarge"
						].map((e) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "radio",
							name: "sofinder-scale",
							value: e,
							checked: u === e,
							onChange: () => b(e)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(e === "compact" ? "scaleCompact" : e === "standard" ? "scaleStandard" : e === "large" ? "scaleLarge" : "scaleExtraLarge") })] }, e))
					}),
					["grid", "list"].map((e) => /* @__PURE__ */ (0, i.jsxs)("div", { children: [/* @__PURE__ */ (0, i.jsx)("h3", { children: w(e === "grid" ? "gridItemSize" : "listRowSize") }), /* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": w(e === "grid" ? "gridItemSize" : "listRowSize"),
						children: [
							"small",
							"medium",
							"large"
						].map((t) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "radio",
							name: `sofinder-${e}-size`,
							value: t,
							checked: o[e] === t,
							onChange: () => _(e, t)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(t === "small" ? "sizeSmall" : t === "medium" ? "sizeMedium" : "sizeLarge") })] }, t))
					})] }, e))
				]
			}),
			/* @__PURE__ */ (0, i.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, i.jsx)("h2", { children: O.operations }),
					/* @__PURE__ */ (0, i.jsx)("h3", { children: w("uploadConflictSetting") }),
					/* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": w("uploadConflictSetting"),
						children: [
							"ask",
							"rename",
							"overwrite",
							"skip"
						].map((e) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "radio",
							name: "sofinder-upload-conflict",
							value: e,
							checked: d === e,
							onChange: () => x(e)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(e === "ask" ? "uploadConflictAsk" : e === "rename" ? "uploadConflictRename" : e === "overwrite" ? "uploadConflictOverwrite" : "uploadConflictSkip") })] }, e))
					}),
					/* @__PURE__ */ (0, i.jsx)("h3", { children: w("optionalTools") }),
					l.batchRename !== !1 && /* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "checkbox",
							checked: t.batchRename,
							onChange: (e) => m("batchRename", e.target.checked)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w("batchRename") })]
					}),
					(l.imageEditing !== !1 || l.imageProcessing !== !1) && /* @__PURE__ */ (0, i.jsx)("h3", { children: w("imageTools") }),
					[
						"resize",
						"crop",
						"rotate",
						"presets",
						"process"
					].filter((e) => e === "process" ? l.imageProcessing !== !1 : l.imageEditing !== !1).map((e) => /* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "checkbox",
							checked: t[e],
							onChange: (t) => m(e, t.target.checked)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(e === "presets" ? "preset" : e === "rotate" ? "rotationTools" : e === "process" ? "imageProcess" : e) })]
					}, e))
				]
			}),
			/* @__PURE__ */ (0, i.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, i.jsx)("h2", { children: O.list }),
					/* @__PURE__ */ (0, i.jsx)("h3", { children: w("listColumns") }),
					[
						"size",
						"modified",
						"type"
					].map((e) => /* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "checkbox",
							checked: a[e],
							onChange: (t) => g(e, t.target.checked)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(e === "size" ? "showSizeColumn" : e === "modified" ? "showModifiedColumn" : "showTypeColumn") })]
					}, e))
				]
			}),
			/* @__PURE__ */ (0, i.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, i.jsx)("h2", { children: O.features }),
					/* @__PURE__ */ (0, i.jsx)("h3", { children: w("optionalFeatures") }),
					/* @__PURE__ */ (0, i.jsx)("p", { children: w("featureSettingsHint") }),
					[
						"autoCollapseUploads",
						"folderTree",
						"recent",
						"favorites",
						"tags",
						"archive",
						"trash",
						"qrCode"
					].filter((e) => e === "autoCollapseUploads" || l[e] !== !1).map((t) => /* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "checkbox",
							checked: r[t],
							disabled: t === "trash" && e?.storageCapabilities?.recoverableDelete === !1,
							onChange: (e) => h(t, e.target.checked)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(t === "folderTree" ? "folderTreeFeature" : t === "favorites" ? "favoriteFeature" : t === "archive" ? "archiveFeature" : t === "trash" ? "trashFeature" : t === "tags" ? "tagsFeature" : t === "recent" ? "recentFeature" : t === "qrCode" ? "qrCodeFeature" : "autoCollapseUploads") })]
					}, t)),
					r.folderTree && l.folderTree !== !1 && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsx)("h3", { children: w("folderNavigationPosition") }), /* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": w("folderNavigationPosition"),
						children: ["left", "right"].map((e) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("input", {
							type: "radio",
							name: "sofinder-folder-navigation-position",
							value: e,
							checked: s === e,
							onChange: () => v(e)
						}), /* @__PURE__ */ (0, i.jsx)("span", { children: w(e === "left" ? "leftSidebar" : "rightSidebar") })] }, e))
					})] }),
					(r.favorites && l.favorites !== !1 || l.quickAccess !== !1) && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [
						/* @__PURE__ */ (0, i.jsx)("h3", { children: D.title }),
						l.quickAccess !== !1 && /* @__PURE__ */ (0, i.jsxs)("label", {
							className: "sf-setting",
							children: [/* @__PURE__ */ (0, i.jsx)("input", {
								type: "checkbox",
								checked: r.sidebarQuickAccess,
								onChange: (e) => h("sidebarQuickAccess", e.target.checked)
							}), /* @__PURE__ */ (0, i.jsx)("span", { children: D.quick })]
						}),
						r.favorites && l.favorites !== !1 && /* @__PURE__ */ (0, i.jsxs)("label", {
							className: "sf-setting",
							children: [/* @__PURE__ */ (0, i.jsx)("input", {
								type: "checkbox",
								checked: r.sidebarFavorites,
								onChange: (e) => h("sidebarFavorites", e.target.checked)
							}), /* @__PURE__ */ (0, i.jsx)("span", { children: D.favorites })]
						}),
						l.quickAccess !== !1 && r.sidebarQuickAccess && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsx)("h3", { children: E.title }), /* @__PURE__ */ (0, i.jsx)("div", {
							className: "sf-scale-options",
							role: "radiogroup",
							"aria-label": E.title,
							children: ["all", "resource"].map((e) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("input", {
								type: "radio",
								name: "sofinder-quick-access-scope",
								value: e,
								checked: c === e,
								onChange: () => y(e)
							}), /* @__PURE__ */ (0, i.jsx)("span", { children: e === "all" ? E.all : E.resource })] }, e))
						})] })
					] })
				]
			})
		]
	});
}
//#endregion
export { p as SettingsDialog };
