import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-Dw1vVt5K.js";
//#region src/components/ImageProcessDialog.tsx
var r = t(), i = e();
function a({ entries: e, resource: t, formats: a, labels: o, onClose: s, onApply: c }) {
	let [l, u] = (0, r.useState)("optimize"), [d, f] = (0, r.useState)(82), [p, m] = (0, r.useState)("original"), [h, g] = (0, r.useState)("SoFinder"), [_, v] = (0, r.useState)("#ffffff"), [y, b] = (0, r.useState)(t), [x, S] = (0, r.useState)(""), [C, w] = (0, r.useState)("bottom-right"), [T, E] = (0, r.useState)(60), [D, O] = (0, r.useState)(25), [k, A] = (0, r.useState)("copy"), [j, M] = (0, r.useState)(!1), [N, P] = (0, r.useState)(""), F = l === "optimize" && p !== "original" ? "copy" : k, I = e.length === 0 || l === "text" && h.trim() === "" || l === "image" && x.trim() === "", L = async () => {
		let e = {
			position: C,
			opacity: T,
			scale: D,
			quality: d
		}, n = l === "optimize" ? {
			type: "optimize",
			format: p,
			quality: d
		} : l === "text" ? {
			type: "watermarkText",
			text: h.trim(),
			color: _,
			...e
		} : {
			type: "watermarkImage",
			resource: y.trim() || t,
			path: x.trim(),
			...e
		};
		M(!0), P("");
		try {
			await c([n], { mode: F });
		} catch (e) {
			P(e instanceof Error ? e.message : String(e));
		} finally {
			M(!1);
		}
	};
	return /* @__PURE__ */ (0, i.jsxs)(n, {
		title: o.title,
		closeLabel: o.close,
		onClose: s,
		className: "sf-image-process-modal",
		footer: /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [
			/* @__PURE__ */ (0, i.jsx)("span", { children: o.selected.replace("{count}", String(e.length)) }),
			/* @__PURE__ */ (0, i.jsx)("button", {
				onClick: s,
				children: o.cancel
			}),
			/* @__PURE__ */ (0, i.jsx)("button", {
				className: "primary",
				disabled: j || I,
				onClick: () => void L(),
				children: j ? o.processing : o.apply
			})
		] }),
		children: [
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-image-process-grid",
				children: [
					/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.operation, /* @__PURE__ */ (0, i.jsxs)("select", {
						value: l,
						onChange: (e) => u(e.target.value),
						children: [
							/* @__PURE__ */ (0, i.jsx)("option", {
								value: "optimize",
								children: o.optimize
							}),
							/* @__PURE__ */ (0, i.jsx)("option", {
								value: "text",
								children: o.textWatermark
							}),
							/* @__PURE__ */ (0, i.jsx)("option", {
								value: "image",
								children: o.imageWatermark
							})
						]
					})] }),
					l === "optimize" && /* @__PURE__ */ (0, i.jsxs)("label", { children: [o.outputFormat, /* @__PURE__ */ (0, i.jsxs)("select", {
						value: p,
						onChange: (e) => m(e.target.value),
						children: [/* @__PURE__ */ (0, i.jsx)("option", {
							value: "original",
							children: o.keepFormat
						}), a.map((e) => /* @__PURE__ */ (0, i.jsx)("option", {
							value: e,
							children: e.toUpperCase()
						}, e))]
					})] }),
					l === "text" && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-process-wide",
						children: [o.watermarkText, /* @__PURE__ */ (0, i.jsx)("input", {
							value: h,
							maxLength: 200,
							onChange: (e) => g(e.target.value)
						})]
					}), /* @__PURE__ */ (0, i.jsxs)("label", { children: [o.color, /* @__PURE__ */ (0, i.jsx)("input", {
						type: "color",
						value: _,
						onChange: (e) => v(e.target.value)
					})] })] }),
					l === "image" && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.watermarkResource, /* @__PURE__ */ (0, i.jsx)("input", {
						value: y,
						onChange: (e) => b(e.target.value)
					})] }), /* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-process-wide",
						children: [o.watermarkPath, /* @__PURE__ */ (0, i.jsx)("input", {
							value: x,
							placeholder: "branding/logo.png",
							onChange: (e) => S(e.target.value)
						})]
					})] }),
					l !== "optimize" && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.position, /* @__PURE__ */ (0, i.jsxs)("select", {
							value: C,
							onChange: (e) => w(e.target.value),
							children: [
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "top-left",
									children: o.topLeft
								}),
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "top-right",
									children: o.topRight
								}),
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "center",
									children: o.center
								}),
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "bottom-left",
									children: o.bottomLeft
								}),
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "bottom-right",
									children: o.bottomRight
								})
							]
						})] }),
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [
							o.opacity,
							": ",
							T,
							"%",
							/* @__PURE__ */ (0, i.jsx)("input", {
								type: "range",
								min: "1",
								max: "100",
								value: T,
								onChange: (e) => E(Number(e.target.value))
							})
						] }),
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [
							o.scale,
							": ",
							D,
							"%",
							/* @__PURE__ */ (0, i.jsx)("input", {
								type: "range",
								min: "5",
								max: "80",
								value: D,
								onChange: (e) => O(Number(e.target.value))
							})
						] })
					] }),
					/* @__PURE__ */ (0, i.jsxs)("label", { children: [
						o.quality,
						": ",
						d,
						/* @__PURE__ */ (0, i.jsx)("input", {
							type: "range",
							min: "1",
							max: "100",
							value: d,
							onChange: (e) => f(Number(e.target.value))
						})
					] }),
					/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.saveMode, /* @__PURE__ */ (0, i.jsxs)("select", {
						value: F,
						disabled: l === "optimize" && p !== "original",
						onChange: (e) => A(e.target.value),
						children: [/* @__PURE__ */ (0, i.jsx)("option", {
							value: "copy",
							children: o.saveCopy
						}), /* @__PURE__ */ (0, i.jsx)("option", {
							value: "overwrite",
							children: o.overwrite
						})]
					})] })
				]
			}),
			l === "optimize" && p !== "original" && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-configured-limits",
				children: o.conversionCopyHint
			}),
			F === "overwrite" && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-warning",
				children: o.overwriteWarning
			}),
			N && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: N
			})
		]
	});
}
//#endregion
export { a as ImageProcessDialog };
