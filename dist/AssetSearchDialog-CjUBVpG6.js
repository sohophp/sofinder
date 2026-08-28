import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-JdLj8VHV.js";
import { t as r } from "./Modal-ClPLM5jI.js";
import { t as i } from "./EntryVisuals-COz6M0oc.js";
import { t as a } from "./format-GD3_dnvn.js";
//#region src/components/AssetSearchDialog.tsx
var o = t(), s = e(), c = "sofinder.assetSearch.recent.v1", l = () => {
	try {
		let e = JSON.parse(localStorage.getItem(c) || "[]");
		return Array.isArray(e) ? e.slice(0, 5) : [];
	} catch {
		return [];
	}
}, u = (e) => e.split(/[,，]/).map((e) => e.trim()).filter(Boolean), d = (e) => e ? Math.floor((/* @__PURE__ */ new Date(`${e}T00:00:00`)).getTime() / 1e3) : void 0, f = (e) => e ? Math.floor((/* @__PURE__ */ new Date(`${e}T23:59:59`)).getTime() / 1e3) : void 0;
function p({ api: e, resources: t, currentResource: p, currentPath: m, labels: h, formatDate: g, onOpen: _, onClose: v }) {
	let y = new URL(window.location.href).searchParams, [b, x] = (0, o.useState)(y.get("asset_q") ?? ""), [S, C] = (0, o.useState)(y.get("asset_scope") || "all"), [w, T] = (0, o.useState)(y.get("asset_type") || "all"), [E, D] = (0, o.useState)(y.get("asset_tags") ?? ""), [O, k] = (0, o.useState)(y.get("asset_ext") ?? ""), [A, j] = (0, o.useState)(""), [M, N] = (0, o.useState)(""), [P, F] = (0, o.useState)(""), [I, L] = (0, o.useState)(""), [R, z] = (0, o.useState)(/* @__PURE__ */ new Set([
		"name",
		"title",
		"alt",
		"tags"
	])), [B, V] = (0, o.useState)(null), [H, U] = (0, o.useState)(!1), [W, G] = (0, o.useState)(""), [K, q] = (0, o.useState)(l), J = (0, o.useMemo)(() => [
		b,
		w === "all" ? "" : h[w || "all"],
		...u(E),
		...u(O).map((e) => `.${e}`),
		P,
		I
	].filter(Boolean), [
		b,
		w,
		E,
		O,
		P,
		I,
		h
	]), Y = async (n = 0, r) => {
		let i = r ?? {
			keyword: b,
			scope: S,
			type: w,
			tags: E,
			extensions: O
		};
		r && (x(r.keyword), C(r.scope), T(r.type), D(r.tags), k(r.extensions));
		let a = Array.from(R);
		if (a.length === 0) return;
		U(!0), G("");
		let o = {
			keyword: i.keyword,
			resources: i.scope === "all" ? t : [p],
			path: i.scope === "directory" ? m : "",
			fields: a,
			tags: u(i.tags),
			extensions: u(i.extensions).map((e) => e.replace(/^\./, "").toLowerCase()),
			type: i.type,
			minimumSize: A ? Math.round(Number(A) * 1024 * 1024) : void 0,
			maximumSize: M ? Math.round(Number(M) * 1024 * 1024) : void 0,
			modifiedAfter: d(P),
			modifiedBefore: f(I),
			offset: n,
			limit: 50
		};
		try {
			let t = await e.searchAssets(o);
			V(t);
			let n = i, r = [n, ...K.filter((e) => JSON.stringify(e) !== JSON.stringify(n))].slice(0, 5);
			q(r), localStorage.setItem(c, JSON.stringify(r));
			let a = new URL(window.location.href);
			a.searchParams.set("asset_q", i.keyword), a.searchParams.set("asset_scope", i.scope), a.searchParams.set("asset_type", i.type || "all"), i.tags ? a.searchParams.set("asset_tags", i.tags) : a.searchParams.delete("asset_tags"), i.extensions ? a.searchParams.set("asset_ext", i.extensions) : a.searchParams.delete("asset_ext"), history.replaceState(history.state, "", a);
		} catch (e) {
			G(e instanceof Error ? e.message : h.searchFailed);
		} finally {
			U(!1);
		}
	}, X = () => {
		let e = new URL(window.location.href);
		[
			"asset_q",
			"asset_scope",
			"asset_type",
			"asset_tags",
			"asset_ext"
		].forEach((t) => e.searchParams.delete(t)), history.replaceState(history.state, "", e), v();
	};
	return /* @__PURE__ */ (0, s.jsx)(r, {
		title: h.advancedSearch,
		closeLabel: h.close,
		onClose: X,
		className: "sf-asset-search-modal",
		footer: /* @__PURE__ */ (0, s.jsx)("button", {
			type: "button",
			onClick: X,
			children: h.close
		}),
		children: /* @__PURE__ */ (0, s.jsxs)("div", {
			className: "sf-asset-search-body",
			children: [
				/* @__PURE__ */ (0, s.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault(), Y();
					},
					children: [
						/* @__PURE__ */ (0, s.jsxs)("label", {
							className: "sf-search-query",
							children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.keywords }), /* @__PURE__ */ (0, s.jsx)("input", {
								autoFocus: !0,
								value: b,
								maxLength: 200,
								onChange: (e) => x(e.target.value),
								placeholder: h.searchAssets
							})]
						}),
						/* @__PURE__ */ (0, s.jsxs)("div", {
							className: "sf-asset-search-grid",
							children: [
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.scope }), /* @__PURE__ */ (0, s.jsxs)("select", {
									value: S,
									onChange: (e) => C(e.target.value),
									children: [
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "directory",
											children: h.currentDirectory
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "resource",
											children: h.currentResource
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "all",
											children: h.allResources
										})
									]
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.type }), /* @__PURE__ */ (0, s.jsxs)("select", {
									value: w,
									onChange: (e) => T(e.target.value),
									children: [
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "all",
											children: h.allTypes
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "image",
											children: h.image
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "document",
											children: h.document
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "audio",
											children: h.audio
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "video",
											children: h.video
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "archive",
											children: h.archive
										}),
										/* @__PURE__ */ (0, s.jsx)("option", {
											value: "other",
											children: h.other
										})
									]
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.tags }), /* @__PURE__ */ (0, s.jsx)("input", {
									value: E,
									onChange: (e) => D(e.target.value),
									placeholder: h.commaSeparated
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.extensions }), /* @__PURE__ */ (0, s.jsx)("input", {
									value: O,
									onChange: (e) => k(e.target.value),
									placeholder: "jpg, pdf, docx"
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.minimumSize }), /* @__PURE__ */ (0, s.jsx)("input", {
									type: "number",
									min: "0",
									step: "0.1",
									value: A,
									onChange: (e) => j(e.target.value)
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.maximumSize }), /* @__PURE__ */ (0, s.jsx)("input", {
									type: "number",
									min: "0",
									step: "0.1",
									value: M,
									onChange: (e) => N(e.target.value)
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.modifiedAfter }), /* @__PURE__ */ (0, s.jsx)("input", {
									type: "date",
									value: P,
									onChange: (e) => F(e.target.value)
								})] }),
								/* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("span", { children: h.modifiedBefore }), /* @__PURE__ */ (0, s.jsx)("input", {
									type: "date",
									value: I,
									onChange: (e) => L(e.target.value)
								})] })
							]
						}),
						/* @__PURE__ */ (0, s.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, s.jsx)("legend", { children: h.searchFields }), [
							"name",
							"title",
							"alt",
							"tags"
						].map((e) => /* @__PURE__ */ (0, s.jsxs)("label", { children: [/* @__PURE__ */ (0, s.jsx)("input", {
							type: "checkbox",
							checked: R.has(e),
							onChange: (t) => z((n) => {
								let r = new Set(n);
								return t.target.checked ? r.add(e) : r.delete(e), r;
							})
						}), /* @__PURE__ */ (0, s.jsx)("span", { children: h[e] })] }, e))] }),
						/* @__PURE__ */ (0, s.jsxs)("button", {
							className: "primary sf-run-asset-search",
							type: "submit",
							disabled: H || R.size === 0,
							children: [/* @__PURE__ */ (0, s.jsx)(n, { name: "search" }), H ? h.searching : h.search]
						})
					]
				}),
				K.length > 0 && /* @__PURE__ */ (0, s.jsxs)("section", {
					className: "sf-recent-searches",
					children: [/* @__PURE__ */ (0, s.jsx)("h3", { children: h.recentSearches }), /* @__PURE__ */ (0, s.jsx)("div", { children: K.map((e, t) => /* @__PURE__ */ (0, s.jsx)("button", {
						type: "button",
						onClick: () => void Y(0, e),
						children: e.keyword || h.filteredAssets
					}, `${e.keyword}-${t}`)) })]
				}),
				J.length > 0 && /* @__PURE__ */ (0, s.jsx)("div", {
					className: "sf-search-filter-chips",
					children: J.map((e, t) => /* @__PURE__ */ (0, s.jsx)("span", { children: e }, `${e}-${t}`))
				}),
				W && /* @__PURE__ */ (0, s.jsx)("p", {
					className: "sf-warning",
					role: "alert",
					children: W
				}),
				B && /* @__PURE__ */ (0, s.jsxs)("section", {
					className: "sf-asset-search-results",
					children: [
						/* @__PURE__ */ (0, s.jsxs)("header", { children: [/* @__PURE__ */ (0, s.jsx)("strong", { children: h.results.replace("{count}", String(B.total)) }), /* @__PURE__ */ (0, s.jsxs)("small", { children: [h.scanned.replace("{count}", String(B.scanned)), B.truncated ? ` · ${h.truncated}` : ""] })] }),
						B.items.length === 0 ? /* @__PURE__ */ (0, s.jsx)("p", { children: h.noResults }) : /* @__PURE__ */ (0, s.jsx)("div", { children: B.items.map((e) => /* @__PURE__ */ (0, s.jsxs)("button", {
							type: "button",
							onClick: () => {
								X(), _(e.resource, e.entry.path);
							},
							children: [
								/* @__PURE__ */ (0, s.jsx)(i, {
									name: e.entry.name,
									mimeType: e.entry.mimeType,
									directory: !1
								}),
								/* @__PURE__ */ (0, s.jsxs)("span", { children: [
									/* @__PURE__ */ (0, s.jsx)("strong", { children: e.entry.name }),
									/* @__PURE__ */ (0, s.jsxs)("small", { children: [
										e.resource,
										" · ",
										e.entry.path
									] }),
									e.metadata.title && /* @__PURE__ */ (0, s.jsx)("small", { children: e.metadata.title }),
									/* @__PURE__ */ (0, s.jsx)("span", { children: e.metadata.tags.map((e) => /* @__PURE__ */ (0, s.jsx)("i", { children: e }, e)) })
								] }),
								/* @__PURE__ */ (0, s.jsx)("time", {
									dateTime: (/* @__PURE__ */ new Date(e.entry.modifiedAt * 1e3)).toISOString(),
									children: g(e.entry.modifiedAt)
								}),
								/* @__PURE__ */ (0, s.jsx)("b", { children: a(e.entry.size) })
							]
						}, `${e.resource}:${e.entry.path}`)) }),
						B.total > B.limit && /* @__PURE__ */ (0, s.jsxs)("nav", { children: [
							/* @__PURE__ */ (0, s.jsx)("button", {
								type: "button",
								disabled: B.offset === 0 || H,
								onClick: () => void Y(Math.max(0, B.offset - B.limit)),
								children: h.previous
							}),
							/* @__PURE__ */ (0, s.jsxs)("span", { children: [
								B.offset + 1,
								"–",
								Math.min(B.total, B.offset + B.limit),
								" / ",
								B.total
							] }),
							/* @__PURE__ */ (0, s.jsx)("button", {
								type: "button",
								disabled: B.offset + B.limit >= B.total || H,
								onClick: () => void Y(B.offset + B.limit),
								children: h.next
							})
						] })
					]
				})
			]
		})
	});
}
//#endregion
export { p as AssetSearchDialog };
