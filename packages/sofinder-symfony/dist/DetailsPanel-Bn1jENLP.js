import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { n } from "./api-Cq-FmALq.js";
import { t as r } from "./UiIcon-JdLj8VHV.js";
import { n as i, t as a } from "./EntryVisuals-COz6M0oc.js";
import { t as o } from "./format-GD3_dnvn.js";
//#region src/components/AssetPropertiesPanel.tsx
var s = t(), c = e();
function l({ api: e, resource: t, entry: r, locales: i, labels: a, usageEnabled: o = !0 }) {
	let [l, u] = (0, s.useState)(null), [d, f] = (0, s.useState)(null), [p, m] = (0, s.useState)(""), [h, g] = (0, s.useState)(""), [_, v] = (0, s.useState)(""), [y, b] = (0, s.useState)({}), [x, S] = (0, s.useState)(!1), [C, w] = (0, s.useState)(""), [T, E] = (0, s.useState)("loading"), [D, O] = (0, s.useState)([]), [k, A] = (0, s.useState)(!1);
	(0, s.useEffect)(() => {
		let i = !0;
		return E("loading"), u(null), f(null), e.resolveAsset(t, r.path).then((t) => {
			if (!t.asset.assetId) throw new n(a.error, "asset_catalog_unavailable", 404);
			return e.asset(t.asset.assetId);
		}).then((t) => {
			i && (u(t.asset.assetId), f(t.metadata), m(t.metadata.alt ?? ""), S(t.metadata.alt === ""), g(t.metadata.title ?? ""), v(t.metadata.tags.join(", ")), b(t.metadata.altTranslations ?? {}), E("idle"), o && t.asset.assetId && e.assetUsages(t.asset.assetId).then((e) => {
				i && (O(e.items), A(!0));
			}).catch(() => {
				i && A(!1);
			}));
		}).catch(() => {
			i && E("error");
		}), () => {
			i = !1;
		};
	}, [
		e,
		t,
		r.path,
		a.error,
		o
	]);
	let j = (0, s.useMemo)(() => ({
		alt: x ? "" : p.trim() || null,
		altTranslations: Object.fromEntries(Object.entries(y).map(([e, t]) => [e.toLowerCase(), t.trim()]).filter(([, e]) => e !== "")),
		title: h.trim() || null,
		tags: _.split(/[,，]/).map((e) => e.trim()).filter(Boolean)
	}), [
		p,
		x,
		_,
		h,
		y
	]), M = d !== null && JSON.stringify(j) !== JSON.stringify({
		alt: d.alt,
		altTranslations: d.altTranslations ?? {},
		title: d.title,
		tags: d.tags
	}), N = Object.keys(y).sort(), P = i.filter((e) => !N.includes(e.code)), F = P.some((e) => e.code === C) ? C : P[0]?.code ?? "";
	if ((0, s.useEffect)(() => {
		if (!M) return;
		let e = (e) => e.preventDefault();
		return window.addEventListener("beforeunload", e), () => window.removeEventListener("beforeunload", e);
	}, [M]), T === "loading") return /* @__PURE__ */ (0, c.jsx)("div", {
		className: "sf-state",
		children: a.loading
	});
	if (!d || !l) return /* @__PURE__ */ (0, c.jsx)("div", {
		className: "sf-warning",
		role: "status",
		children: a.error
	});
	let I = async () => {
		E("saving");
		try {
			let t = await e.updateAssetMetadata(l, {
				...j,
				version: d.version
			});
			f(t.metadata), E("saved");
		} catch (t) {
			if (t instanceof n && t.code === "asset_metadata_conflict") {
				try {
					let t = await e.asset(l);
					f(t.metadata);
				} catch {}
				E("conflict");
			} else E("error");
		}
	};
	return /* @__PURE__ */ (0, c.jsxs)("div", {
		className: "sf-asset-properties",
		children: [
			/* @__PURE__ */ (0, c.jsxs)("label", { children: [/* @__PURE__ */ (0, c.jsx)("span", { children: a.alt }), /* @__PURE__ */ (0, c.jsx)("textarea", {
				value: p,
				disabled: x,
				maxLength: 1e3,
				placeholder: a.unsetAlt,
				onChange: (e) => {
					m(e.target.value), E("idle");
				}
			})] }),
			/* @__PURE__ */ (0, c.jsxs)("label", {
				className: "sf-asset-decorative",
				children: [/* @__PURE__ */ (0, c.jsx)("input", {
					type: "checkbox",
					checked: x,
					onChange: (e) => {
						S(e.target.checked), E("idle");
					}
				}), /* @__PURE__ */ (0, c.jsx)("span", { children: a.decorative })]
			}),
			/* @__PURE__ */ (0, c.jsxs)("section", {
				className: "sf-property-translations",
				children: [
					/* @__PURE__ */ (0, c.jsx)("strong", { children: a.translatedAlt }),
					/* @__PURE__ */ (0, c.jsxs)("div", {
						className: "sf-property-locale-add",
						children: [/* @__PURE__ */ (0, c.jsx)("select", {
							"aria-label": a.language,
							value: F,
							disabled: !F,
							onChange: (e) => w(e.target.value),
							children: P.map((e) => /* @__PURE__ */ (0, c.jsx)("option", {
								value: e.code,
								children: e.label
							}, e.code))
						}), /* @__PURE__ */ (0, c.jsx)("button", {
							type: "button",
							disabled: !F,
							onClick: () => {
								b((e) => ({
									...e,
									[F]: ""
								})), w(""), E("idle");
							},
							children: a.addLanguage
						})]
					}),
					N.map((e) => /* @__PURE__ */ (0, c.jsxs)("label", { children: [/* @__PURE__ */ (0, c.jsx)("span", { children: i.find((t) => t.code === e)?.label ?? e }), /* @__PURE__ */ (0, c.jsx)("textarea", {
						value: y[e] ?? "",
						maxLength: 1e3,
						placeholder: a.inheritAlt,
						onChange: (t) => {
							b((n) => ({
								...n,
								[e]: t.target.value
							})), E("idle");
						}
					})] }, e))
				]
			}),
			/* @__PURE__ */ (0, c.jsxs)("label", { children: [/* @__PURE__ */ (0, c.jsx)("span", { children: a.assetTitle }), /* @__PURE__ */ (0, c.jsx)("input", {
				value: h,
				maxLength: 200,
				onChange: (e) => {
					g(e.target.value), E("idle");
				}
			})] }),
			/* @__PURE__ */ (0, c.jsxs)("label", { children: [/* @__PURE__ */ (0, c.jsx)("span", { children: a.tags }), /* @__PURE__ */ (0, c.jsx)("input", {
				value: _,
				onChange: (e) => {
					v(e.target.value), E("idle");
				}
			})] }),
			k && /* @__PURE__ */ (0, c.jsxs)("section", {
				className: "sf-property-usages",
				children: [/* @__PURE__ */ (0, c.jsxs)("strong", { children: [
					a.usages,
					" (",
					D.length,
					")"
				] }), D.length === 0 ? /* @__PURE__ */ (0, c.jsx)("small", { children: a.noUsages }) : D.map((e) => /* @__PURE__ */ (0, c.jsxs)("a", {
					href: e.url ?? void 0,
					target: e.url ? "_blank" : void 0,
					rel: "noopener noreferrer",
					children: [/* @__PURE__ */ (0, c.jsx)("span", { children: e.label }), e.context && /* @__PURE__ */ (0, c.jsx)("small", { children: e.context })]
				}, e.referenceId))]
			}),
			/* @__PURE__ */ (0, c.jsxs)("div", {
				className: "sf-property-save",
				children: [/* @__PURE__ */ (0, c.jsx)("span", {
					className: T === "conflict" || T === "error" ? "sf-warning" : "sf-muted",
					children: T === "saving" ? a.loading : T === "saved" && !M ? a.saved : T === "conflict" ? a.conflict : T === "error" ? a.error : M ? a.unsaved : ""
				}), /* @__PURE__ */ (0, c.jsx)("button", {
					className: "primary",
					type: "button",
					disabled: !M || T === "saving",
					onClick: () => void I(),
					children: a.save
				})]
			})
		]
	});
}
//#endregion
//#region src/components/DetailsPanel.tsx
function u({ api: e, resource: t, selectedEntries: n, selected: u, imageInfo: d, metadata: f, showTags: p, previewImage: m, selectMode: h, selectAllowed: g, assetMetadataEnabled: _, assetUsageEnabled: v, assetAltLocales: y = [], labels: b, formatDate: x, onChoose: S, onShare: C, onAssetMetadata: w, pluginActions: T }) {
	let [E, D] = (0, s.useState)("information"), O = !!(_ && u && !u.directory && u.capabilities?.["metadata.update"] !== !1), k = b.details === "详细信息" ? {
		usages: "使用位置",
		none: "没有已登记的使用位置"
	} : b.details === "詳細資訊" ? {
		usages: "使用位置",
		none: "沒有已登記的使用位置"
	} : {
		usages: "Usages",
		none: "No registered usages"
	};
	return /* @__PURE__ */ (0, c.jsxs)("aside", {
		className: "sf-details",
		children: [/* @__PURE__ */ (0, c.jsxs)("div", {
			className: "sf-details-tabs",
			children: [/* @__PURE__ */ (0, c.jsx)("button", {
				type: "button",
				className: E === "information" ? "active" : "",
				onClick: () => D("information"),
				children: b.information ?? b.details
			}), O && /* @__PURE__ */ (0, c.jsx)("button", {
				type: "button",
				className: E === "properties" ? "active" : "",
				onClick: () => D("properties"),
				children: b.assetMetadata
			})]
		}), E === "properties" && O && u ? /* @__PURE__ */ (0, c.jsx)(l, {
			api: e,
			resource: t,
			entry: u,
			locales: y,
			usageEnabled: v,
			labels: {
				alt: b.assetAlt ?? "Alt",
				translatedAlt: b.translatedAlt ?? "Localized alt",
				language: b.language ?? "Language",
				addLanguage: b.addLanguage ?? "Add",
				assetTitle: b.assetTitle ?? "Title",
				tags: b.tags ?? "Tags",
				decorative: b.decorative ?? "Decorative",
				unsetAlt: b.unsetAlt ?? "",
				inheritAlt: b.inheritAlt ?? "",
				save: b.save ?? "Save",
				loading: b.loading ?? "Loading…",
				saved: b.saved ?? "Saved",
				unsaved: b.unsaved ?? "Unsaved changes",
				conflict: b.conflict ?? "Conflict",
				error: b.metadataError ?? "Unable to load metadata",
				usages: b.usages ?? k.usages,
				noUsages: b.noUsages ?? k.none
			}
		}, `${t}:${u.path}`) : n.length > 1 ? /* @__PURE__ */ (0, c.jsxs)("div", {
			className: "sf-state",
			children: [
				n.length,
				" ",
				b.selected
			]
		}) : u ? /* @__PURE__ */ (0, c.jsxs)(c.Fragment, { children: [
			/* @__PURE__ */ (0, c.jsx)("div", {
				className: "sf-preview",
				children: m ? /* @__PURE__ */ (0, c.jsx)(i, {
					src: e.thumbnailUrl(t, u, 800, 600),
					alt: u.name
				}) : /* @__PURE__ */ (0, c.jsx)(a, {
					name: u.name,
					mimeType: u.mimeType,
					directory: u.directory
				})
			}),
			/* @__PURE__ */ (0, c.jsx)("h3", { children: u.name }),
			/* @__PURE__ */ (0, c.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, c.jsx)("dt", { children: b.type }),
				/* @__PURE__ */ (0, c.jsx)("dd", { children: u.directory ? b.folder : u.mimeType || b.file }),
				/* @__PURE__ */ (0, c.jsx)("dt", { children: b.size }),
				/* @__PURE__ */ (0, c.jsx)("dd", { children: u.directory ? "—" : o(u.size) }),
				d && /* @__PURE__ */ (0, c.jsxs)(c.Fragment, { children: [/* @__PURE__ */ (0, c.jsx)("dt", { children: b.dimensions }), /* @__PURE__ */ (0, c.jsxs)("dd", { children: [
					d.width,
					" × ",
					d.height,
					" px"
				] })] }),
				/* @__PURE__ */ (0, c.jsx)("dt", { children: b.modified }),
				/* @__PURE__ */ (0, c.jsx)("dd", { children: /* @__PURE__ */ (0, c.jsx)("time", {
					dateTime: (/* @__PURE__ */ new Date(u.modifiedAt * 1e3)).toISOString(),
					children: x(u.modifiedAt)
				}) }),
				/* @__PURE__ */ (0, c.jsx)("dt", { children: b.location }),
				/* @__PURE__ */ (0, c.jsx)("dd", { children: u.path })
			] }),
			p && (f.tags[u.path] || []).length > 0 && /* @__PURE__ */ (0, c.jsx)("div", {
				className: "sf-tags",
				children: f.tags[u.path].map((e) => /* @__PURE__ */ (0, c.jsx)("span", { children: e }, e))
			}),
			h && !u.directory && u.url && /* @__PURE__ */ (0, c.jsxs)(c.Fragment, { children: [/* @__PURE__ */ (0, c.jsx)("button", {
				className: "sf-select primary",
				disabled: !g,
				onClick: S,
				children: b.select
			}), !g && /* @__PURE__ */ (0, c.jsx)("p", {
				className: "sf-warning",
				role: "status",
				children: b.unsupportedWebImage
			})] }),
			!u.directory && /* @__PURE__ */ (0, c.jsxs)("div", {
				className: "sf-detail-actions",
				children: [
					/* @__PURE__ */ (0, c.jsx)("a", {
						className: "sf-icon-action",
						href: u.url || e.downloadUrl(t, u.path),
						target: "_blank",
						rel: "noopener noreferrer",
						title: b.download,
						"aria-label": b.download,
						children: /* @__PURE__ */ (0, c.jsx)(r, { name: "download" })
					}),
					/* @__PURE__ */ (0, c.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => C(u),
						title: b.share,
						"aria-label": b.share,
						children: /* @__PURE__ */ (0, c.jsx)(r, { name: "share" })
					}),
					_ && u.capabilities?.["metadata.update"] !== !1 && /* @__PURE__ */ (0, c.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => w?.(u),
						title: b.assetMetadata,
						"aria-label": b.assetMetadata,
						children: /* @__PURE__ */ (0, c.jsx)(r, { name: "asset-metadata" })
					})
				]
			}),
			T && /* @__PURE__ */ (0, c.jsx)("div", {
				className: "sf-plugin-detail-actions",
				children: T
			})
		] }) : /* @__PURE__ */ (0, c.jsx)("div", {
			className: "sf-state",
			children: "—"
		})]
	});
}
//#endregion
export { u as DetailsPanel };
