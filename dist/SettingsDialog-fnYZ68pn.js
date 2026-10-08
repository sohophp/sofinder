import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { n } from "./imageActions-BRpJl8Vz.js";
import { t as r } from "./Modal-DhcERqG6.js";
//#region src/components/PreferenceProfiles.tsx
var i = t(), a = e(), o = "sofinder.preferenceProfiles.v1", s = 10, c = {
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
}, l = (e, t) => typeof e == "object" && !!e && t.every((t) => typeof e[t] == "boolean"), u = (e) => {
	if (typeof e != "object" || !e) return !1;
	let t = e, n = t.viewSizes, r = t.features;
	return l(t.tools, [
		"resize",
		"crop",
		"rotate",
		"presets",
		"process",
		"batchRename"
	]) && l(t.features, [
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
	].every((e) => e === void 0 || typeof e == "boolean") && l(t.columns, [
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
}, d = () => {
	try {
		let e = JSON.parse(localStorage.getItem(o) || "[]");
		return Array.isArray(e) ? e.filter((e) => typeof e == "object" && !!e && typeof e.id == "string" && typeof e.name == "string" && e.name.length > 0 && e.name.length <= 40 && Number.isFinite(e.updatedAt) && u(e.settings)).map((e) => ({
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
		})).slice(0, s) : [];
	} catch {
		return [];
	}
}, f = (e) => localStorage.setItem(o, JSON.stringify(e.slice(0, s)));
function p({ current: e, onApply: t, onReset: n }) {
	let r = document.documentElement.lang.toLowerCase(), o = c[r === "zh-tw" ? "zh-tw" : r.startsWith("zh") ? "zh-cn" : "en"], [l, u] = (0, i.useState)(d), [p, m] = (0, i.useState)(""), [h, g] = (0, i.useState)(""), [_, v] = (0, i.useState)("standard"), [y, b] = (0, i.useState)(""), x = (0, i.useMemo)(() => l.find((e) => e.id === h), [l, h]), S = () => {
		let t = p.trim().slice(0, 40);
		if (!t) return;
		let n = {
			id: l.find((e) => e.name.toLocaleLowerCase() === t.toLocaleLowerCase())?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
			name: t,
			updatedAt: Date.now(),
			settings: structuredClone(e)
		}, r = [n, ...l.filter((e) => e.id !== n.id)].slice(0, s);
		u(r), f(r), g(n.id), m(""), b(o.saved);
	};
	return /* @__PURE__ */ (0, a.jsxs)("section", {
		className: "sf-preference-profiles",
		children: [
			/* @__PURE__ */ (0, a.jsx)("h3", { children: o.title }),
			/* @__PURE__ */ (0, a.jsx)("p", { children: o.hint }),
			/* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-preference-presets",
				children: [
					/* @__PURE__ */ (0, a.jsxs)("select", {
						value: _,
						"aria-label": o.preset,
						onChange: (e) => v(e.target.value),
						children: [
							/* @__PURE__ */ (0, a.jsx)("option", {
								value: "standard",
								children: o.standard
							}),
							/* @__PURE__ */ (0, a.jsx)("option", {
								value: "compact",
								children: o.compact
							}),
							/* @__PURE__ */ (0, a.jsx)("option", {
								value: "spacious",
								children: o.spacious
							})
						]
					}),
					/* @__PURE__ */ (0, a.jsx)("button", {
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
							}), b(o.restored);
						},
						children: o.restore
					}),
					/* @__PURE__ */ (0, a.jsx)("button", {
						type: "button",
						onClick: () => {
							n(), b(o.resetDone);
						},
						children: o.reset
					})
				]
			}),
			/* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-preference-save",
				children: [/* @__PURE__ */ (0, a.jsx)("input", {
					value: p,
					maxLength: 40,
					placeholder: o.name,
					"aria-label": o.name,
					onChange: (e) => m(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && (e.preventDefault(), S());
					}
				}), /* @__PURE__ */ (0, a.jsx)("button", {
					type: "button",
					disabled: p.trim() === "",
					onClick: S,
					children: o.save
				})]
			}),
			/* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-preference-apply",
				children: [
					/* @__PURE__ */ (0, a.jsxs)("select", {
						value: h,
						"aria-label": o.choose,
						onChange: (e) => {
							g(e.target.value), b("");
						},
						children: [/* @__PURE__ */ (0, a.jsx)("option", {
							value: "",
							children: l.length === 0 ? o.empty : o.choose
						}), l.map((e) => /* @__PURE__ */ (0, a.jsx)("option", {
							value: e.id,
							children: e.name
						}, e.id))]
					}),
					/* @__PURE__ */ (0, a.jsx)("button", {
						type: "button",
						className: "primary",
						disabled: !x,
						onClick: () => {
							x && (t(structuredClone(x.settings)), b(o.applied));
						},
						children: o.apply
					}),
					/* @__PURE__ */ (0, a.jsx)("button", {
						type: "button",
						className: "danger",
						disabled: !x,
						onClick: () => {
							if (!x) return;
							let e = l.filter((e) => e.id !== x.id);
							u(e), f(e), g(""), b("");
						},
						children: o.remove
					})
				]
			}),
			/* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-preference-meta",
				children: [/* @__PURE__ */ (0, a.jsxs)("small", { children: [
					l.length,
					" / ",
					s,
					" ",
					o.maximum
				] }), /* @__PURE__ */ (0, a.jsx)("span", {
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
function m({ resource: e, tools: t, imageActions: i, features: o, columns: s, viewSizes: c, folderTreePlacement: l, quickAccessScope: u, availability: d, scale: f, uploadConflictStrategy: m, translate: h, onToolChange: g, onFeatureChange: _, onColumnChange: v, onViewSizeChange: y, onFolderTreePlacementChange: b, onQuickAccessScopeChange: x, onScaleChange: S, onUploadConflictStrategyChange: C, onReset: w, onClose: T }) {
	let E = h, D = document.documentElement.lang.toLowerCase(), O = D === "zh-tw" ? {
		title: "固定資料夾顯示範圍",
		all: "全部根目錄",
		resource: "目前根目錄"
	} : D.startsWith("zh") ? {
		title: "固定文件夹显示范围",
		all: "全部根目录",
		resource: "当前根目录"
	} : {
		title: "Pinned folder scope",
		all: "All storage roots",
		resource: "Current storage root"
	}, k = D === "zh-tw" ? {
		title: "側邊欄內容",
		favorites: "顯示收藏檔案",
		quick: "顯示固定資料夾"
	} : D.startsWith("zh") ? {
		title: "侧边栏内容",
		favorites: "显示收藏文件",
		quick: "显示固定文件夹"
	} : {
		title: "Sidebar content",
		favorites: "Show favorite files",
		quick: "Show pinned folders"
	}, A = D === "zh-tw" ? {
		appearance: "外觀",
		operations: "檔案操作",
		list: "清單",
		features: "功能與側邊欄"
	} : D.startsWith("zh") ? {
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
	return /* @__PURE__ */ (0, a.jsxs)(r, {
		title: E("settings"),
		closeLabel: E("close"),
		onClose: T,
		className: "sf-settings-modal",
		footer: /* @__PURE__ */ (0, a.jsx)("button", {
			className: "primary",
			onClick: T,
			children: E("done")
		}),
		children: [
			/* @__PURE__ */ (0, a.jsx)("p", { children: E("toolSettingsHint") }),
			e && /* @__PURE__ */ (0, a.jsxs)("p", {
				className: "sf-configured-limits",
				children: [
					E("configuredLimits"),
					": ",
					E("fileName"),
					" ",
					e.maxFileNameLength,
					" · ",
					E("folderName"),
					" ",
					e.maxFolderNameLength,
					" · ",
					E("folderDepth"),
					" ",
					e.maxFolderDepth
				]
			}),
			/* @__PURE__ */ (0, a.jsx)(p, {
				current: {
					tools: t,
					features: o,
					columns: s,
					viewSizes: c,
					folderTreePlacement: l,
					quickAccessScope: u,
					scale: f,
					uploadConflictStrategy: m
				},
				onReset: w,
				onApply: (e) => {
					Object.keys(e.tools).forEach((t) => g(t, e.tools[t])), Object.keys(e.features).forEach((t) => _(t, e.features[t])), Object.keys(e.columns).forEach((t) => v(t, e.columns[t])), Object.keys(e.viewSizes).forEach((t) => y(t, e.viewSizes[t])), b(e.folderTreePlacement), x(e.quickAccessScope), S(e.scale), C(e.uploadConflictStrategy);
				}
			}),
			/* @__PURE__ */ (0, a.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, a.jsx)("h2", { children: A.appearance }),
					/* @__PURE__ */ (0, a.jsx)("h3", { children: E("interfaceScale") }),
					/* @__PURE__ */ (0, a.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": E("interfaceScale"),
						children: [
							"compact",
							"standard",
							"large",
							"xlarge"
						].map((e) => /* @__PURE__ */ (0, a.jsxs)("label", { children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "radio",
							name: "sofinder-scale",
							value: e,
							checked: f === e,
							onChange: () => S(e)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(e === "compact" ? "scaleCompact" : e === "standard" ? "scaleStandard" : e === "large" ? "scaleLarge" : "scaleExtraLarge") })] }, e))
					}),
					["grid", "list"].map((e) => /* @__PURE__ */ (0, a.jsxs)("div", { children: [/* @__PURE__ */ (0, a.jsx)("h3", { children: E(e === "grid" ? "gridItemSize" : "listRowSize") }), /* @__PURE__ */ (0, a.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": E(e === "grid" ? "gridItemSize" : "listRowSize"),
						children: [
							"small",
							"medium",
							"large"
						].map((t) => /* @__PURE__ */ (0, a.jsxs)("label", { children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "radio",
							name: `sofinder-${e}-size`,
							value: t,
							checked: c[e] === t,
							onChange: () => y(e, t)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(t === "small" ? "sizeSmall" : t === "medium" ? "sizeMedium" : "sizeLarge") })] }, t))
					})] }, e))
				]
			}),
			/* @__PURE__ */ (0, a.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, a.jsx)("h2", { children: A.operations }),
					/* @__PURE__ */ (0, a.jsx)("h3", { children: E("uploadConflictSetting") }),
					/* @__PURE__ */ (0, a.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": E("uploadConflictSetting"),
						children: [
							"ask",
							"rename",
							"overwrite",
							"skip"
						].map((e) => /* @__PURE__ */ (0, a.jsxs)("label", { children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "radio",
							name: "sofinder-upload-conflict",
							value: e,
							checked: m === e,
							onChange: () => C(e)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(e === "ask" ? "uploadConflictAsk" : e === "rename" ? "uploadConflictRename" : e === "overwrite" ? "uploadConflictOverwrite" : "uploadConflictSkip") })] }, e))
					}),
					m === "overwrite" && /* @__PURE__ */ (0, a.jsx)("p", {
						className: "sf-warning",
						role: "status",
						children: E("persistentOverwriteWarning")
					}),
					/* @__PURE__ */ (0, a.jsx)("h3", { children: E("optionalTools") }),
					d.batchRename !== !1 && /* @__PURE__ */ (0, a.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "checkbox",
							checked: t.batchRename,
							onChange: (e) => g("batchRename", e.target.checked)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E("batchRename") })]
					}),
					(d.imageEditing !== !1 || d.imageProcessing !== !1) && /* @__PURE__ */ (0, a.jsx)("h3", { children: E("imageTools") }),
					[
						"resize",
						"crop",
						"rotate",
						"presets",
						"process"
					].filter((e) => n(i, e) && (e === "process" ? d.imageProcessing !== !1 : d.imageEditing !== !1)).map((e) => /* @__PURE__ */ (0, a.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "checkbox",
							checked: t[e],
							onChange: (t) => g(e, t.target.checked)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(e === "presets" ? "preset" : e === "rotate" ? "rotationTools" : e === "process" ? "imageProcess" : e) })]
					}, e))
				]
			}),
			/* @__PURE__ */ (0, a.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, a.jsx)("h2", { children: A.list }),
					/* @__PURE__ */ (0, a.jsx)("h3", { children: E("listColumns") }),
					[
						"size",
						"modified",
						"type"
					].map((e) => /* @__PURE__ */ (0, a.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "checkbox",
							checked: s[e],
							onChange: (t) => v(e, t.target.checked)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(e === "size" ? "showSizeColumn" : e === "modified" ? "showModifiedColumn" : "showTypeColumn") })]
					}, e))
				]
			}),
			/* @__PURE__ */ (0, a.jsxs)("section", {
				className: "sf-settings-section",
				children: [
					/* @__PURE__ */ (0, a.jsx)("h2", { children: A.features }),
					/* @__PURE__ */ (0, a.jsx)("h3", { children: E("optionalFeatures") }),
					/* @__PURE__ */ (0, a.jsx)("p", { children: E("featureSettingsHint") }),
					[
						"autoCollapseUploads",
						"folderTree",
						"recent",
						"favorites",
						"tags",
						"archive",
						"trash"
					].filter((e) => e === "autoCollapseUploads" || d[e] !== !1).map((t) => /* @__PURE__ */ (0, a.jsxs)("label", {
						className: "sf-setting",
						children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "checkbox",
							checked: o[t],
							disabled: t === "trash" && e?.storageCapabilities?.recoverableDelete === !1,
							onChange: (e) => _(t, e.target.checked)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(t === "folderTree" ? "folderTreeFeature" : t === "favorites" ? "favoriteFeature" : t === "archive" ? "archiveFeature" : t === "trash" ? "trashFeature" : t === "tags" ? "tagsFeature" : t === "recent" ? "recentFeature" : "autoCollapseUploads") })]
					}, t)),
					o.folderTree && d.folderTree !== !1 && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsx)("h3", { children: E("folderNavigationPosition") }), /* @__PURE__ */ (0, a.jsx)("div", {
						className: "sf-scale-options",
						role: "radiogroup",
						"aria-label": E("folderNavigationPosition"),
						children: ["left", "right"].map((e) => /* @__PURE__ */ (0, a.jsxs)("label", { children: [/* @__PURE__ */ (0, a.jsx)("input", {
							type: "radio",
							name: "sofinder-folder-navigation-position",
							value: e,
							checked: l === e,
							onChange: () => b(e)
						}), /* @__PURE__ */ (0, a.jsx)("span", { children: E(e === "left" ? "leftSidebar" : "rightSidebar") })] }, e))
					})] }),
					(o.favorites && d.favorites !== !1 || d.quickAccess !== !1) && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
						/* @__PURE__ */ (0, a.jsx)("h3", { children: k.title }),
						d.quickAccess !== !1 && /* @__PURE__ */ (0, a.jsxs)("label", {
							className: "sf-setting",
							children: [/* @__PURE__ */ (0, a.jsx)("input", {
								type: "checkbox",
								checked: o.sidebarQuickAccess,
								onChange: (e) => _("sidebarQuickAccess", e.target.checked)
							}), /* @__PURE__ */ (0, a.jsx)("span", { children: k.quick })]
						}),
						o.favorites && d.favorites !== !1 && /* @__PURE__ */ (0, a.jsxs)("label", {
							className: "sf-setting",
							children: [/* @__PURE__ */ (0, a.jsx)("input", {
								type: "checkbox",
								checked: o.sidebarFavorites,
								onChange: (e) => _("sidebarFavorites", e.target.checked)
							}), /* @__PURE__ */ (0, a.jsx)("span", { children: k.favorites })]
						}),
						d.quickAccess !== !1 && o.sidebarQuickAccess && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsx)("h3", { children: O.title }), /* @__PURE__ */ (0, a.jsx)("div", {
							className: "sf-scale-options",
							role: "radiogroup",
							"aria-label": O.title,
							children: ["all", "resource"].map((e) => /* @__PURE__ */ (0, a.jsxs)("label", { children: [/* @__PURE__ */ (0, a.jsx)("input", {
								type: "radio",
								name: "sofinder-quick-access-scope",
								value: e,
								checked: u === e,
								onChange: () => x(e)
							}), /* @__PURE__ */ (0, a.jsx)("span", { children: e === "all" ? O.all : O.resource })] }, e))
						})] })
					] })
				]
			})
		]
	});
}
//#endregion
export { m as SettingsDialog };
