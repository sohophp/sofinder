import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./UiIcon-CyBzESIM.js";
import { t as r } from "./Modal-DhcERqG6.js";
//#region src/components/TrashDialog.tsx
var i = t(), a = e();
function o({ api: e, resource: t, locale: o, labels: s, onClose: c, onChanged: l }) {
	let [u, d] = (0, i.useState)({
		items: [],
		total: 0,
		offset: 0,
		limit: 50,
		usedItems: 0,
		usedBytes: 0,
		maxItems: 0,
		maxBytes: 0
	}), [f, p] = (0, i.useState)(0), [m, h] = (0, i.useState)(""), [g, _] = (0, i.useState)(!0), [v, y] = (0, i.useState)(""), [b, x] = (0, i.useState)(null), [S, C] = (0, i.useState)(null), [w, T] = (0, i.useState)(""), [E, D] = (0, i.useState)(!1), O = (0, i.useCallback)((n = f) => {
		_(!0), y(""), e.trash(t, n, 50, m).then((e) => {
			d(e), p(e.offset);
		}).catch((e) => y(e instanceof Error ? e.message : String(e))).finally(() => _(!1));
	}, [
		e,
		f,
		t,
		m
	]);
	(0, i.useEffect)(() => {
		let e = window.setTimeout(() => O(f), 200);
		return () => window.clearTimeout(e);
	}, [O, f]);
	let k = async (n) => {
		try {
			await e.restoreTrash(t, n.id, "cancel"), O(f), l();
		} catch (e) {
			if (e instanceof Error && "code" in e && e.code === "conflict") {
				x(n);
				return;
			}
			y(e instanceof Error ? e.message : String(e));
		}
	}, A = async (n) => {
		if (b) try {
			await e.restoreTrash(t, b.id, n), x(null), O(f), l();
		} catch (e) {
			y(e instanceof Error ? e.message : String(e));
		}
	}, j = (e) => {
		C(e), T("");
	}, M = async () => {
		if (!(!S || w !== S.path.split("/").pop() || E)) {
			D(!0);
			try {
				await e.permanentlyDeleteTrash(t, S.id), C(null), T(""), O(f);
			} catch (e) {
				y(e instanceof Error ? e.message : String(e));
			} finally {
				D(!1);
			}
		}
	}, N = (e) => e < 1024 ? `${e} B` : e < 1024 ** 2 ? `${(e / 1024).toFixed(1)} KB` : e < 1024 ** 3 ? `${(e / 1024 ** 2).toFixed(1)} MB` : `${(e / 1024 ** 3).toFixed(1)} GB`, P = u.total === 0 ? 0 : u.offset + 1, F = Math.min(u.offset + u.items.length, u.total);
	return /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
		/* @__PURE__ */ (0, a.jsxs)(r, {
			title: s.title,
			closeLabel: s.close,
			onClose: c,
			inactive: b !== null || S !== null,
			className: "sf-trash-modal",
			footer: /* @__PURE__ */ (0, a.jsx)("button", {
				className: "primary",
				onClick: c,
				children: s.close
			}),
			children: [
				v && /* @__PURE__ */ (0, a.jsx)("div", {
					className: "sf-notice",
					role: "alert",
					children: v
				}),
				/* @__PURE__ */ (0, a.jsxs)("div", {
					className: "sf-trash-usage",
					children: [/* @__PURE__ */ (0, a.jsxs)("div", { children: [/* @__PURE__ */ (0, a.jsx)("strong", { children: s.usage }), /* @__PURE__ */ (0, a.jsxs)("span", { children: [
						N(u.usedBytes),
						" / ",
						N(u.maxBytes),
						" · ",
						u.usedItems,
						" / ",
						u.maxItems,
						" ",
						s.items
					] })] }), /* @__PURE__ */ (0, a.jsx)("progress", {
						max: Math.max(1, u.maxBytes),
						value: Math.min(u.usedBytes, u.maxBytes)
					})]
				}),
				/* @__PURE__ */ (0, a.jsxs)("div", {
					className: "sf-trash-search",
					children: [
						/* @__PURE__ */ (0, a.jsx)(n, { name: "search" }),
						/* @__PURE__ */ (0, a.jsx)("input", {
							value: m,
							onChange: (e) => {
								h(e.target.value), p(0);
							},
							placeholder: s.search,
							"aria-label": s.search
						}),
						m && /* @__PURE__ */ (0, a.jsx)("button", {
							onClick: () => h(""),
							"aria-label": s.close,
							children: /* @__PURE__ */ (0, a.jsx)(n, { name: "close" })
						})
					]
				}),
				/* @__PURE__ */ (0, a.jsx)("div", {
					className: "sf-trash-list",
					children: g ? /* @__PURE__ */ (0, a.jsx)("p", { children: "…" }) : u.items.length === 0 ? /* @__PURE__ */ (0, a.jsx)("p", { children: s.empty }) : u.items.map((e) => /* @__PURE__ */ (0, a.jsxs)("article", { children: [
						/* @__PURE__ */ (0, a.jsxs)("div", { children: [
							/* @__PURE__ */ (0, a.jsx)("strong", { children: e.path.split("/").pop() }),
							/* @__PURE__ */ (0, a.jsx)("small", {
								title: e.path,
								children: e.path
							}),
							/* @__PURE__ */ (0, a.jsxs)("small", { children: [
								e.directory ? s.items : N(e.size),
								" · ",
								s.expires,
								": ",
								new Intl.DateTimeFormat(o, { dateStyle: "medium" }).format(e.expiresAt * 1e3)
							] })
						] }),
						/* @__PURE__ */ (0, a.jsx)("button", {
							onClick: () => void k(e),
							children: s.restore
						}),
						/* @__PURE__ */ (0, a.jsx)("button", {
							className: "danger",
							onClick: () => j(e),
							children: s.permanentDelete
						})
					] }, e.id))
				}),
				u.total > u.limit && /* @__PURE__ */ (0, a.jsxs)("nav", {
					className: "sf-trash-pagination",
					"aria-label": s.title,
					children: [
						/* @__PURE__ */ (0, a.jsxs)("button", {
							disabled: u.offset === 0 || g,
							onClick: () => p(Math.max(0, u.offset - u.limit)),
							children: [
								/* @__PURE__ */ (0, a.jsx)(n, { name: "chevron-left" }),
								" ",
								s.previous
							]
						}),
						/* @__PURE__ */ (0, a.jsxs)("span", { children: [
							P,
							"–",
							F,
							" / ",
							u.total
						] }),
						/* @__PURE__ */ (0, a.jsxs)("button", {
							disabled: u.offset + u.limit >= u.total || g,
							onClick: () => p(u.offset + u.limit),
							children: [
								s.next,
								" ",
								/* @__PURE__ */ (0, a.jsx)(n, { name: "chevron-right" })
							]
						})
					]
				})
			]
		}),
		b && /* @__PURE__ */ (0, a.jsx)(r, {
			title: s.conflict,
			closeLabel: s.close,
			onClose: () => x(null),
			className: "sf-confirm-modal",
			footer: /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
				/* @__PURE__ */ (0, a.jsx)("button", {
					onClick: () => x(null),
					children: s.cancel
				}),
				/* @__PURE__ */ (0, a.jsx)("button", {
					onClick: () => void A("rename"),
					children: s.autoRename
				}),
				/* @__PURE__ */ (0, a.jsx)("button", {
					className: "danger",
					onClick: () => void A("overwrite"),
					children: s.overwrite
				})
			] }),
			children: /* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-form-body",
				children: /* @__PURE__ */ (0, a.jsx)("p", { children: b.path })
			})
		}),
		S && /* @__PURE__ */ (0, a.jsx)(r, {
			title: s.permanentDelete,
			closeLabel: s.close,
			onClose: () => {
				E || C(null);
			},
			className: "sf-confirm-modal",
			footer: /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
				/* @__PURE__ */ (0, a.jsx)("span", {}),
				/* @__PURE__ */ (0, a.jsx)("button", {
					disabled: E,
					onClick: () => C(null),
					children: s.cancel
				}),
				/* @__PURE__ */ (0, a.jsx)("button", {
					className: "danger",
					disabled: E || w !== S.path.split("/").pop(),
					onClick: () => void M(),
					children: E ? s.deleting : s.permanentDelete
				})
			] }),
			children: /* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-form-body",
				children: [
					/* @__PURE__ */ (0, a.jsx)("p", {
						role: "alert",
						children: s.confirmPermanentDelete
					}),
					/* @__PURE__ */ (0, a.jsx)("strong", { children: S.path }),
					/* @__PURE__ */ (0, a.jsxs)("label", { children: [s.typeNameToConfirm.replace("{name}", S.path.split("/").pop() || S.path), /* @__PURE__ */ (0, a.jsx)("input", {
						autoFocus: !0,
						value: w,
						disabled: E,
						onChange: (e) => T(e.target.value),
						onKeyDown: (e) => {
							e.key === "Enter" && M();
						}
					})] })
				]
			})
		})
	] });
}
//#endregion
export { o as TrashDialog };
