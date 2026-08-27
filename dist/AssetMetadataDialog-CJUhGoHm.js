import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-aP8IYcPB.js";
//#region src/components/AssetMetadataDialog.tsx
var r = t(), i = e();
function a({ asset: e, metadata: t, labels: a, onClose: s, onSave: c }) {
	let [l, u] = (0, r.useState)(t.alt ?? ""), [d, f] = (0, r.useState)(t.title ?? ""), [p, m] = (0, r.useState)(t.tags.join(", ")), [h, g] = (0, r.useState)(t.altTranslations ?? {}), [_, v] = (0, r.useState)(""), [y, b] = (0, r.useState)(t.alt === ""), [x, S] = (0, r.useState)(!1), C = [
		"en",
		"zh-cn",
		"zh-tw",
		...Object.keys(h).filter((e) => ![
			"en",
			"zh-cn",
			"zh-tw"
		].includes(e)).sort()
	];
	return /* @__PURE__ */ (0, i.jsxs)(n, {
		title: a.title,
		closeLabel: a.cancel,
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
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: a.alt }), /* @__PURE__ */ (0, i.jsx)("input", {
						value: l,
						disabled: y,
						placeholder: a.unsetAlt,
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
					}), /* @__PURE__ */ (0, i.jsx)("span", { children: a.decorative })]
				}),
				/* @__PURE__ */ (0, i.jsxs)("section", {
					className: "sf-alt-translations",
					"aria-labelledby": "sf-alt-translations-title",
					children: [/* @__PURE__ */ (0, i.jsxs)("div", {
						className: "sf-alt-translations-heading",
						children: [
							/* @__PURE__ */ (0, i.jsx)("h3", {
								id: "sf-alt-translations-title",
								children: a.translatedAlt
							}),
							/* @__PURE__ */ (0, i.jsx)("small", { children: a.translatedAltHelp }),
							/* @__PURE__ */ (0, i.jsxs)("div", {
								className: "sf-alt-locale-add",
								children: [/* @__PURE__ */ (0, i.jsx)("input", {
									"aria-label": a.languageCode,
									value: _,
									maxLength: 35,
									placeholder: "fr-ca",
									onChange: (e) => v(e.target.value)
								}), /* @__PURE__ */ (0, i.jsx)("button", {
									type: "button",
									disabled: o(_) === null || C.includes(o(_) ?? "") || C.length >= 20,
									onClick: () => {
										let e = o(_);
										e && (g((t) => ({
											...t,
											[e]: ""
										})), v(""));
									},
									children: a.addLanguage
								})]
							})
						]
					}), /* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-alt-translation-list",
						children: C.map((e) => /* @__PURE__ */ (0, i.jsxs)("label", { children: [/* @__PURE__ */ (0, i.jsx)("span", { children: a.locales[e] ?? e }), /* @__PURE__ */ (0, i.jsx)("input", {
							value: h[e] ?? "",
							placeholder: a.inheritAlt,
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
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: a.assetTitle }), /* @__PURE__ */ (0, i.jsx)("input", {
						value: d,
						maxLength: 200,
						onChange: (e) => f(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, i.jsxs)("label", {
					className: "sf-form-field",
					children: [/* @__PURE__ */ (0, i.jsx)("span", { children: a.tags }), /* @__PURE__ */ (0, i.jsx)("input", {
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
				children: a.cancel
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
				children: a.save
			})]
		})]
	});
}
var o = (e) => {
	let t = e.trim().toLowerCase();
	return /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(t) ? t : null;
};
//#endregion
export { a as AssetMetadataDialog };
