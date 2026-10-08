import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./imageActions-BRpJl8Vz.js";
import { t as r } from "./Modal-DhcERqG6.js";
//#region src/components/ImageProcessDialog.tsx
var i = t(), a = e();
function o({ entries: e, resource: t, formats: o, actions: s, labels: c, onClose: l, onApply: u }) {
	let d = [
		...n(s, "optimize") ? ["optimize"] : [],
		...n(s, "watermarkText") ? ["text"] : [],
		...n(s, "watermarkImage") ? ["image"] : []
	], [f, p] = (0, i.useState)(d[0] ?? "optimize"), [m, h] = (0, i.useState)(82), [g, _] = (0, i.useState)("original"), [v, y] = (0, i.useState)("SoFinder"), [b, x] = (0, i.useState)("interface"), [S, C] = (0, i.useState)("#ffffff"), [w, T] = (0, i.useState)(t), [E, D] = (0, i.useState)(""), [O, k] = (0, i.useState)("bottom-right"), [A, j] = (0, i.useState)(60), [M, N] = (0, i.useState)(25), [P, F] = (0, i.useState)("copy"), [I, L] = (0, i.useState)(!1), [R, z] = (0, i.useState)(""), B = f === "optimize" && g !== "original" ? "copy" : P, V = !d.includes(f) || e.length === 0 || f === "text" && v.trim() === "" || f === "image" && E.trim() === "", H = async () => {
		if (V) return;
		let e = {
			position: O,
			opacity: A,
			scale: M,
			quality: 100
		}, n = f === "optimize" ? {
			type: "optimize",
			format: g,
			quality: m
		} : f === "text" ? {
			type: "watermarkText",
			text: v.trim(),
			font: b,
			color: S,
			...e
		} : {
			type: "watermarkImage",
			resource: w.trim() || t,
			path: E.trim(),
			...e
		};
		L(!0), z("");
		try {
			await u([n], { mode: B });
		} catch (e) {
			z(e instanceof Error ? e.message : String(e));
		} finally {
			L(!1);
		}
	};
	return /* @__PURE__ */ (0, a.jsxs)(r, {
		title: c.title,
		closeLabel: c.close,
		onClose: l,
		className: "sf-image-process-modal",
		footer: /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
			/* @__PURE__ */ (0, a.jsx)("span", { children: c.selected.replace("{count}", String(e.length)) }),
			/* @__PURE__ */ (0, a.jsx)("button", {
				onClick: l,
				children: c.cancel
			}),
			/* @__PURE__ */ (0, a.jsx)("button", {
				className: "primary",
				disabled: I || V,
				onClick: () => void H(),
				children: I ? c.processing : c.apply
			})
		] }),
		children: [
			/* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-image-process-grid",
				children: [
					/* @__PURE__ */ (0, a.jsxs)("label", { children: [c.operation, /* @__PURE__ */ (0, a.jsx)("select", {
						value: f,
						onChange: (e) => p(e.target.value),
						children: d.map((e) => /* @__PURE__ */ (0, a.jsx)("option", {
							value: e,
							children: e === "optimize" ? c.optimize : e === "text" ? c.textWatermark : c.imageWatermark
						}, e))
					})] }),
					f === "optimize" && /* @__PURE__ */ (0, a.jsxs)("label", { children: [c.outputFormat, /* @__PURE__ */ (0, a.jsxs)("select", {
						value: g,
						onChange: (e) => _(e.target.value),
						children: [/* @__PURE__ */ (0, a.jsx)("option", {
							value: "original",
							children: c.keepFormat
						}), o.map((e) => /* @__PURE__ */ (0, a.jsx)("option", {
							value: e,
							children: e.toUpperCase()
						}, e))]
					})] }),
					f === "text" && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
						/* @__PURE__ */ (0, a.jsxs)("label", {
							className: "sf-process-wide",
							children: [c.watermarkText, /* @__PURE__ */ (0, a.jsx)("input", {
								value: v,
								maxLength: 200,
								onChange: (e) => y(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, a.jsxs)("label", { children: [c.watermarkFont, /* @__PURE__ */ (0, a.jsxs)("select", {
							value: b,
							onChange: (e) => x(e.target.value),
							children: [
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "interface",
									children: c.interfaceFont
								}),
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "sans",
									children: c.sansFont
								}),
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "serif",
									children: c.serifFont
								})
							]
						})] }),
						/* @__PURE__ */ (0, a.jsxs)("label", { children: [c.color, /* @__PURE__ */ (0, a.jsx)("input", {
							type: "color",
							value: S,
							onChange: (e) => C(e.target.value)
						})] })
					] }),
					f === "image" && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsxs)("label", { children: [c.watermarkResource, /* @__PURE__ */ (0, a.jsx)("input", {
						value: w,
						onChange: (e) => T(e.target.value)
					})] }), /* @__PURE__ */ (0, a.jsxs)("label", {
						className: "sf-process-wide",
						children: [c.watermarkPath, /* @__PURE__ */ (0, a.jsx)("input", {
							value: E,
							placeholder: "branding/logo.png",
							onChange: (e) => D(e.target.value)
						})]
					})] }),
					f !== "optimize" && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
						/* @__PURE__ */ (0, a.jsxs)("label", { children: [c.position, /* @__PURE__ */ (0, a.jsxs)("select", {
							value: O,
							onChange: (e) => k(e.target.value),
							children: [
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "top-left",
									children: c.topLeft
								}),
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "top-right",
									children: c.topRight
								}),
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "center",
									children: c.center
								}),
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "bottom-left",
									children: c.bottomLeft
								}),
								/* @__PURE__ */ (0, a.jsx)("option", {
									value: "bottom-right",
									children: c.bottomRight
								})
							]
						})] }),
						/* @__PURE__ */ (0, a.jsxs)("label", { children: [
							c.opacity,
							": ",
							A,
							"%",
							/* @__PURE__ */ (0, a.jsx)("input", {
								type: "range",
								min: "1",
								max: "100",
								value: A,
								onChange: (e) => j(Number(e.target.value))
							})
						] }),
						/* @__PURE__ */ (0, a.jsxs)("label", { children: [
							c.scale,
							": ",
							M,
							"%",
							/* @__PURE__ */ (0, a.jsx)("input", {
								type: "range",
								min: "5",
								max: "80",
								value: M,
								onChange: (e) => N(Number(e.target.value))
							})
						] })
					] }),
					f === "optimize" && /* @__PURE__ */ (0, a.jsxs)("label", { children: [
						c.quality,
						": ",
						m,
						/* @__PURE__ */ (0, a.jsx)("input", {
							type: "range",
							min: "1",
							max: "100",
							value: m,
							onChange: (e) => h(Number(e.target.value))
						})
					] }),
					/* @__PURE__ */ (0, a.jsxs)("label", { children: [c.saveMode, /* @__PURE__ */ (0, a.jsxs)("select", {
						value: B,
						disabled: f === "optimize" && g !== "original",
						onChange: (e) => F(e.target.value),
						children: [/* @__PURE__ */ (0, a.jsx)("option", {
							value: "copy",
							children: c.saveCopy
						}), /* @__PURE__ */ (0, a.jsx)("option", {
							value: "overwrite",
							children: c.overwrite
						})]
					})] })
				]
			}),
			f === "optimize" && g !== "original" && /* @__PURE__ */ (0, a.jsx)("p", {
				className: "sf-configured-limits",
				children: c.conversionCopyHint
			}),
			B === "overwrite" && /* @__PURE__ */ (0, a.jsx)("p", {
				className: "sf-warning",
				children: c.overwriteWarning
			}),
			R && /* @__PURE__ */ (0, a.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: R
			})
		]
	});
}
//#endregion
export { o as ImageProcessDialog };
