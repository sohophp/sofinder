import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./format-GD3_dnvn.js";
//#region src/components/ImagePreviewPane.tsx
var r = t(), i = e(), a = [
	25,
	50,
	100,
	200
], o = 26214400, s = 4e7;
function c({ api: e, resource: t, entry: c, labels: l }) {
	let [u, d] = (0, r.useState)("fit"), [f, p] = (0, r.useState)(null), [m, h] = (0, r.useState)(!0), [g, _] = (0, r.useState)(!1), [v, y] = (0, r.useState)(null), [b, x] = (0, r.useState)(!0), [S, C] = (0, r.useState)(!1), [w, T] = (0, r.useState)(0), E = (0, r.useRef)(null), D = (0, r.useRef)(null);
	(0, r.useEffect)(() => {
		let n = !0;
		return p(null), h(!0), d("fit"), _(!1), y(null), e.imageInfo(t, c.path).then((e) => {
			n && p(e);
		}).catch(() => void 0).finally(() => {
			n && h(!1);
		}), () => {
			n = !1, D.current && D.current.removeAttribute("src");
		};
	}, [
		e,
		t,
		c.path
	]);
	let O = c.size > o || f !== null && f.width * f.height > s, k = (e) => {
		if (e === "fit") {
			y(null), d("fit");
			return;
		}
		if (!m) {
			if (O && !g) {
				y(e);
				return;
			}
			y(null), d(e);
		}
	}, A = u === "fit" ? e.thumbnailUrl(t, c, 512, 512) : e.contentUrl(t, c.path), j = w === 0 ? A : `${A}${A.includes("?") ? "&" : "?"}retry=${w}`;
	(0, r.useEffect)(() => {
		x(!0), C(!1), T(0);
	}, [A]);
	let M = () => {
		let e = E.current;
		e && e.scrollTo({
			left: Math.max(0, (e.scrollWidth - e.clientWidth) / 2),
			top: Math.max(0, (e.scrollHeight - e.clientHeight) / 2),
			behavior: "smooth"
		});
	}, N = (e) => {
		let t = u === "fit" ? 100 : u, n = e > 0 ? a.find((e) => e > t) ?? 200 : [...a].reverse().find((e) => e < t) ?? 25;
		k(n);
	}, P = (e) => {
		!e.ctrlKey && !e.metaKey || (e.preventDefault(), N(e.deltaY < 0 ? 1 : -1));
	}, F = (e) => {
		e.key === "+" || e.key === "=" ? (e.preventDefault(), N(1)) : e.key === "-" ? (e.preventDefault(), N(-1)) : e.key === "0" ? (e.preventDefault(), k(100)) : e.key.toLowerCase() === "f" && (e.preventDefault(), k("fit"));
	}, I = (0, r.useMemo)(() => u === "fit" || f === null ? void 0 : {
		width: `${Math.max(1, Math.round(f.width * u / 100))}px`,
		height: "auto"
	}, [f, u]);
	return /* @__PURE__ */ (0, i.jsxs)("section", {
		className: "sf-image-preview-pane",
		children: [
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-image-preview-toolbar",
				role: "toolbar",
				"aria-label": l.zoom,
				children: [
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						className: u === "fit" ? "active" : "",
						"aria-pressed": u === "fit",
						onClick: () => k("fit"),
						children: l.fit
					}),
					a.map((e) => /* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						className: u === e ? "active" : "",
						"aria-pressed": u === e,
						disabled: m,
						onClick: () => k(e),
						children: e === 100 ? l.actual : `${e}%`
					}, e)),
					/* @__PURE__ */ (0, i.jsx)("span", {
						className: "sf-image-zoom-level",
						"aria-live": "polite",
						children: u === "fit" ? l.fit : `${u}%`
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: M,
						disabled: u === "fit",
						children: l.center
					})
				]
			}),
			/* @__PURE__ */ (0, i.jsxs)("div", {
				ref: E,
				className: `sf-file-preview-content sf-image-preview-viewport${u === "fit" ? "" : " sf-image-original-size"}`,
				tabIndex: 0,
				onWheel: P,
				onKeyDown: F,
				onDoubleClick: () => k(u === "fit" ? 100 : "fit"),
				children: [/* @__PURE__ */ (0, i.jsxs)("div", {
					className: "sf-image-original-canvas",
					children: [b && !S && /* @__PURE__ */ (0, i.jsx)("div", {
						className: "sf-image-preview-state",
						role: "status",
						children: l.loading
					}), S ? /* @__PURE__ */ (0, i.jsxs)("div", {
						className: "sf-image-preview-state",
						role: "alert",
						children: [/* @__PURE__ */ (0, i.jsx)("span", { children: l.failed }), /* @__PURE__ */ (0, i.jsx)("button", {
							type: "button",
							onClick: () => {
								T((e) => e + 1), x(!0), C(!1);
							},
							children: l.retry
						})]
					}) : /* @__PURE__ */ (0, i.jsx)("img", {
						ref: D,
						src: j,
						alt: c.name,
						decoding: "async",
						style: I,
						onLoad: (e) => {
							f === null && p({
								width: e.currentTarget.naturalWidth,
								height: e.currentTarget.naturalHeight
							}), x(!1);
						},
						onError: () => {
							x(!1), C(!0);
						}
					})]
				}), v !== null && /* @__PURE__ */ (0, i.jsxs)("div", {
					className: "sf-image-preview-confirm",
					role: "alertdialog",
					"aria-modal": "true",
					children: [
						/* @__PURE__ */ (0, i.jsx)("strong", { children: l.warning }),
						/* @__PURE__ */ (0, i.jsxs)("p", { children: [
							f && `${l.dimensions}: ${f.width} × ${f.height} · `,
							l.size,
							": ",
							n(c.size)
						] }),
						/* @__PURE__ */ (0, i.jsxs)("div", { children: [/* @__PURE__ */ (0, i.jsx)("button", {
							type: "button",
							onClick: () => y(null),
							children: l.cancel
						}), /* @__PURE__ */ (0, i.jsx)("button", {
							type: "button",
							className: "primary",
							onClick: () => {
								_(!0), d(v), y(null);
							},
							children: l.continue
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-image-preview-info",
				children: [
					f ? `${f.width} × ${f.height}` : "—",
					" · ",
					n(c.size)
				]
			})
		]
	});
}
//#endregion
export { c as default };
