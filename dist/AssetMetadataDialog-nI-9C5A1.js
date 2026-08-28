import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-ClPLM5jI.js";
//#region src/components/AssetMetadataDialog.tsx
var r = t(), i = e();
function a({ asset: e, metadata: t, locales: a, labels: o, onClose: s, onSave: c }) {
	let [l, u] = (0, r.useState)(t.alt ?? ""), [d, f] = (0, r.useState)(t.title ?? ""), [p, m] = (0, r.useState)(t.tags.join(", ")), [h, g] = (0, r.useState)(t.altTranslations ?? {}), [_, v] = (0, r.useState)(a[0]?.code ?? ""), [y, b] = (0, r.useState)(t.alt === ""), [x, S] = (0, r.useState)(!1), C = Object.fromEntries(a.map((e) => [e.code, e.label])), w = Object.keys(h).sort((e, t) => e.localeCompare(t)), T = a.filter((e) => !w.includes(e.code)), E = T.some((e) => e.code === _) ? _ : T[0]?.code ?? "";
	return /* @__PURE__ */ (0, i.jsxs)(n, {
		title: o.title,
		closeLabel: o.cancel,
		onClose: s,
		className: "sf-asset-metadata-modal",
		children: [/* @__PURE__ */ (0, i.jsxs)("div", {
			className: "sf-form-body sf-asset-metadata",
			children: [
				/* @__PURE__ */ (0, i.jsx)("p", {
					className: "sf-asset-metadata-file",
					title: e.name,
					children: e.name
				}),
				/* @__PURE__ */ (0, i.jsxs)("label", {
					className: "sf-form-field",
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: o.alt }), /* @__PURE__ */ (0, i.jsx)("input", {
						value: l,
						disabled: y,
						placeholder: o.unsetAlt,
						maxLength: 1e3,
						onChange: (e) => u(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, i.jsxs)("label", {
					className: "sf-asset-decorative",
					children: [/* @__PURE__ */ (0, i.jsx)("input", {
						type: "checkbox",
						checked: y,
						onChange: (e) => b(e.target.checked)
					}), /* @__PURE__ */ (0, i.jsx)("span", { children: o.decorative })]
				}),
				/* @__PURE__ */ (0, i.jsxs)("section", {
					className: "sf-alt-translations",
					"aria-labelledby": "sf-alt-translations-title",
					children: [/* @__PURE__ */ (0, i.jsxs)("div", {
						className: "sf-alt-translations-heading",
						children: [
							/* @__PURE__ */ (0, i.jsx)("h3", {
								id: "sf-alt-translations-title",
								children: o.translatedAlt
							}),
							/* @__PURE__ */ (0, i.jsx)("small", { children: o.translatedAltHelp }),
							/* @__PURE__ */ (0, i.jsxs)("div", {
								className: "sf-alt-locale-add",
								children: [/* @__PURE__ */ (0, i.jsx)("select", {
									"aria-label": o.language,
									value: E,
									disabled: T.length === 0,
									onChange: (e) => v(e.target.value),
									children: T.map((e) => /* @__PURE__ */ (0, i.jsx)("option", {
										value: e.code,
										children: e.label
									}, e.code))
								}), /* @__PURE__ */ (0, i.jsx)("button", {
									type: "button",
									disabled: !E,
									onClick: () => {
										E && (g((e) => ({
											...e,
											[E]: ""
										})), v(""));
									},
									children: o.addLanguage
								})]
							})
						]
					}), w.length > 0 && /* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-alt-translation-list",
						children: w.map((e) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("span", { children: C[e] ?? e }), /* @__PURE__ */ (0, i.jsx)("input", {
							value: h[e] ?? "",
							placeholder: o.inheritAlt,
							maxLength: 1e3,
							onChange: (t) => g((n) => ({
								...n,
								[e]: t.target.value
							}))
						})] }, e))
					})]
				}),
				/* @__PURE__ */ (0, i.jsxs)("label", {
					className: "sf-form-field",
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: o.assetTitle }), /* @__PURE__ */ (0, i.jsx)("input", {
						value: d,
						maxLength: 200,
						onChange: (e) => f(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, i.jsxs)("label", {
					className: "sf-form-field",
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: o.tags }), /* @__PURE__ */ (0, i.jsx)("input", {
						value: p,
						onChange: (e) => m(e.target.value)
					})]
				})
			]
		}), /* @__PURE__ */ (0, i.jsxs)("div", {
			className: "sf-modal-actions",
			children: [/* @__PURE__ */ (0, i.jsx)("button", {
				type: "button",
				onClick: s,
				children: o.cancel
			}), /* @__PURE__ */ (0, i.jsx)("button", {
				className: "primary",
				type: "button",
				disabled: x,
				onClick: () => {
					S(!0);
					let e = Object.fromEntries(Object.entries(h).map(([e, t]) => [e.toLowerCase(), t.trim()]).filter(([, e]) => e !== ""));
					c({
						alt: y ? "" : l.trim() || null,
						altTranslations: e,
						title: d.trim() || null,
						tags: p.split(/[,，]/).map((e) => e.trim()).filter(Boolean),
						version: t.version
					}).finally(() => S(!1));
				},
				children: o.save
			})]
		})]
	});
}
//#endregion
export { a as AssetMetadataDialog };
