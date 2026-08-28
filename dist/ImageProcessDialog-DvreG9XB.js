import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-ClPLM5jI.js";
//#region src/components/ImageProcessDialog.tsx
var r = t(), i = e();
function a({ entries: e, resource: t, formats: a, labels: o, onClose: s, onApply: c }) {
	let [l, u] = (0, r.useState)("optimize"), [d, f] = (0, r.useState)(82), [p, m] = (0, r.useState)("original"), [h, g] = (0, r.useState)("SoFinder"), [_, v] = (0, r.useState)("interface"), [y, b] = (0, r.useState)("#ffffff"), [x, S] = (0, r.useState)(t), [C, w] = (0, r.useState)(""), [T, E] = (0, r.useState)("bottom-right"), [D, O] = (0, r.useState)(60), [k, A] = (0, r.useState)(25), [j, M] = (0, r.useState)("copy"), [N, P] = (0, r.useState)(!1), [F, I] = (0, r.useState)(""), L = l === "optimize" && p !== "original" ? "copy" : j, R = e.length === 0 || l === "text" && h.trim() === "" || l === "image" && C.trim() === "", z = async () => {
		let e = {
			position: T,
			opacity: D,
			scale: k,
			quality: 100
		}, n = l === "optimize" ? {
			type: "optimize",
			format: p,
			quality: d
		} : l === "text" ? {
			type: "watermarkText",
			text: h.trim(),
			font: _,
			color: y,
			...e
		} : {
			type: "watermarkImage",
			resource: x.trim() || t,
			path: C.trim(),
			...e
		};
		P(!0), I("");
		try {
			await c([n], { mode: L });
		} catch (e) {
			I(e instanceof Error ? e.message : String(e));
		} finally {
			P(!1);
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
				disabled: N || R,
				onClick: () => void z(),
				children: N ? o.processing : o.apply
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
					l === "text" && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [
						/* @__PURE__ */ (0, i.jsxs)("label", {
							className: "sf-process-wide",
							children: [o.watermarkText, /* @__PURE__ */ (0, i.jsx)("input", {
								value: h,
								maxLength: 200,
								onChange: (e) => g(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.watermarkFont, /* @__PURE__ */ (0, i.jsxs)("select", {
							value: _,
							onChange: (e) => v(e.target.value),
							children: [
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "interface",
									children: o.interfaceFont
								}),
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "sans",
									children: o.sansFont
								}),
								/* @__PURE__ */ (0, i.jsx)("option", {
									value: "serif",
									children: o.serifFont
								})
							]
						})] }),
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.color, /* @__PURE__ */ (0, i.jsx)("input", {
							type: "color",
							value: y,
							onChange: (e) => b(e.target.value)
						})] })
					] }),
					l === "image" && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.watermarkResource, /* @__PURE__ */ (0, i.jsx)("input", {
						value: x,
						onChange: (e) => S(e.target.value)
					})] }), /* @__PURE__ */ (0, i.jsxs)("label", {
						className: "sf-process-wide",
						children: [o.watermarkPath, /* @__PURE__ */ (0, i.jsx)("input", {
							value: C,
							placeholder: "branding/logo.png",
							onChange: (e) => w(e.target.value)
						})]
					})] }),
					l !== "optimize" && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [o.position, /* @__PURE__ */ (0, i.jsxs)("select", {
							value: T,
							onChange: (e) => E(e.target.value),
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
							D,
							"%",
							/* @__PURE__ */ (0, i.jsx)("input", {
								type: "range",
								min: "1",
								max: "100",
								value: D,
								onChange: (e) => O(Number(e.target.value))
							})
						] }),
						/* @__PURE__ */ (0, i.jsxs)("label", { children: [
							o.scale,
							": ",
							k,
							"%",
							/* @__PURE__ */ (0, i.jsx)("input", {
								type: "range",
								min: "5",
								max: "80",
								value: k,
								onChange: (e) => A(Number(e.target.value))
							})
						] })
					] }),
					l === "optimize" && /* @__PURE__ */ (0, i.jsxs)("label", { children: [
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
						value: L,
						disabled: l === "optimize" && p !== "original",
						onChange: (e) => M(e.target.value),
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
			L === "overwrite" && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-warning",
				children: o.overwriteWarning
			}),
			F && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: F
			})
		]
	});
}
//#endregion
export { a as ImageProcessDialog };
