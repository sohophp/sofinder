import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-aP8IYcPB.js";
//#region src/components/AssetMetadataDialog.tsx
var r = t(), i = e();
function a({ asset: e, metadata: t, labels: a, onClose: o, onSave: s }) {
	let [c, l] = (0, r.useState)(t.alt ?? ""), [u, d] = (0, r.useState)(t.title ?? ""), [f, p] = (0, r.useState)(t.tags.join(", ")), [m, h] = (0, r.useState)(t.alt === ""), [g, _] = (0, r.useState)(!1);
	return /* @__PURE__ */ (0, i.jsxs)(n, {
		title: a.title,
		closeLabel: a.cancel,
		onClose: o,
		children: [/* @__PURE__ */ (0, i.jsxs)("div", {
			className: "sf-form-body sf-asset-metadata",
			children: [
				/* @__PURE__ */ (0, i.jsx)("p", { children: /* @__PURE__ */ (0, i.jsx)("strong", { children: e.name }) }),
				/* @__PURE__ */ (0, i.jsxs)("label", { children: [a.alt, /* @__PURE__ */ (0, i.jsx)("input", {
					value: c,
					disabled: m,
					placeholder: a.unsetAlt,
					maxLength: 1e3,
					onChange: (e) => l(e.target.value)
				})] }),
				/* @__PURE__ */ (0, i.jsxs)("label", {
					className: "sf-setting",
					children: [/* @__PURE__ */ (0, i.jsx)("input", {
						type: "checkbox",
						checked: m,
						onChange: (e) => h(e.target.checked)
					}), /* @__PURE__ */ (0, i.jsx)("span", { children: a.decorative })]
				}),
				/* @__PURE__ */ (0, i.jsxs)("label", { children: [a.assetTitle, /* @__PURE__ */ (0, i.jsx)("input", {
					value: u,
					maxLength: 200,
					onChange: (e) => d(e.target.value)
				})] }),
				/* @__PURE__ */ (0, i.jsxs)("label", { children: [a.tags, /* @__PURE__ */ (0, i.jsx)("input", {
					value: f,
					onChange: (e) => p(e.target.value)
				})] })
			]
		}), /* @__PURE__ */ (0, i.jsxs)("div", {
			className: "sf-modal-actions",
			children: [/* @__PURE__ */ (0, i.jsx)("button", {
				type: "button",
				onClick: o,
				children: a.cancel
			}), /* @__PURE__ */ (0, i.jsx)("button", {
				className: "primary",
				type: "button",
				disabled: g,
				onClick: () => {
					_(!0), s({
						alt: m ? "" : c.trim() || null,
						title: u.trim() || null,
						tags: f.split(/[,，]/).map((e) => e.trim()).filter(Boolean),
						version: t.version
					}).finally(() => _(!1));
				},
				children: a.save
			})]
		})]
	});
}
//#endregion
export { a as AssetMetadataDialog };
