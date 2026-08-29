import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
import { t as n } from "./Modal-ClPLM5jI.js";
import { t as r } from "./format-GD3_dnvn.js";
//#region src/components/SecurityStatusDialog.tsx
var i = t(), a = e();
function o({ api: e, labels: t, formatDate: o, onClose: s }) {
	let [c, l] = (0, i.useState)(null), [u, d] = (0, i.useState)("");
	(0, i.useEffect)(() => {
		let t = !0;
		return e.securityStatus().then((e) => {
			t && l(e);
		}).catch((e) => {
			t && d(e instanceof Error ? e.message : String(e));
		}), () => {
			t = !1;
		};
	}, [e]);
	let f = c?.malwareScanning, p = c?.documentPreview;
	return /* @__PURE__ */ (0, a.jsx)(n, {
		title: t.title,
		closeLabel: t.close,
		onClose: s,
		className: "sf-security-modal",
		footer: /* @__PURE__ */ (0, a.jsx)("button", {
			className: "primary",
			onClick: s,
			children: t.close
		}),
		children: u ? /* @__PURE__ */ (0, a.jsx)("p", {
			className: "sf-warning",
			role: "alert",
			children: u
		}) : f ? /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
			/* @__PURE__ */ (0, a.jsxs)("section", {
				className: `sf-security-summary sf-security-${f.status}`,
				children: [
					/* @__PURE__ */ (0, a.jsx)("span", {
						className: "sf-security-indicator",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, a.jsxs)("div", { children: [/* @__PURE__ */ (0, a.jsx)("strong", { children: f.enabled ? t.enabled : t.disabled }), /* @__PURE__ */ (0, a.jsx)("small", { children: f.message })] }),
					/* @__PURE__ */ (0, a.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, a.jsx)("dt", { children: t.provider }),
						/* @__PURE__ */ (0, a.jsx)("dd", { children: f.provider ?? "—" }),
						/* @__PURE__ */ (0, a.jsx)("dt", { children: t.service }),
						/* @__PURE__ */ (0, a.jsx)("dd", { children: f.status })
					] })
				]
			}),
			/* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-security-counts",
				"aria-label": t.scans,
				children: [
					/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: f.counts.passed }), t.passed] }),
					/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: f.counts.quarantined }), t.quarantined] }),
					/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: f.counts.failed }), t.failed] }),
					/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: f.counts.pending }), t.pending] })
				]
			}),
			p && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
				/* @__PURE__ */ (0, a.jsx)("h3", { children: t.document }),
				/* @__PURE__ */ (0, a.jsxs)("section", {
					className: `sf-security-summary sf-security-${p.available && p.cacheWritable ? "ready" : "down"}`,
					children: [
						/* @__PURE__ */ (0, a.jsx)("span", {
							className: "sf-security-indicator",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, a.jsxs)("div", { children: [/* @__PURE__ */ (0, a.jsx)("strong", { children: t.document }), /* @__PURE__ */ (0, a.jsx)("small", { children: p.officeEnabled && p.available ? t.ready : t.disabled })] }),
						/* @__PURE__ */ (0, a.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, a.jsx)("dt", { children: t.mode }),
							/* @__PURE__ */ (0, a.jsxs)("dd", { children: [p.effectiveMode, p.configuredMode === p.effectiveMode ? "" : ` (${p.configuredMode})`] }),
							/* @__PURE__ */ (0, a.jsx)("dt", { children: t.converter }),
							/* @__PURE__ */ (0, a.jsx)("dd", { children: p.binary }),
							/* @__PURE__ */ (0, a.jsx)("dt", { children: t.version }),
							/* @__PURE__ */ (0, a.jsx)("dd", { children: p.version ?? "—" }),
							/* @__PURE__ */ (0, a.jsx)("dt", { children: t.cache }),
							/* @__PURE__ */ (0, a.jsxs)("dd", { children: [
								p.cacheCount,
								" · ",
								p.cacheWritable ? t.writable : t.readOnly
							] }),
							/* @__PURE__ */ (0, a.jsx)("dt", { children: t.lastSuccess }),
							/* @__PURE__ */ (0, a.jsx)("dd", { children: p.lastSuccessfulAt ? o(p.lastSuccessfulAt) : t.never })
						] })
					]
				}),
				/* @__PURE__ */ (0, a.jsxs)("div", {
					className: "sf-security-counts",
					"aria-label": t.jobs,
					children: [
						/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: p.counts.queued }), t.pending] }),
						/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: p.counts.running }), t.running] }),
						/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: p.counts.ready }), t.ready] }),
						/* @__PURE__ */ (0, a.jsxs)("span", { children: [/* @__PURE__ */ (0, a.jsx)("b", { children: p.counts.failed + p.counts.expired }), t.failed] })
					]
				})
			] }),
			/* @__PURE__ */ (0, a.jsx)("h3", { children: t.recent }),
			f.recent.length === 0 ? /* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-state",
				children: t.none
			}) : /* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-security-history",
				children: f.recent.map((e) => /* @__PURE__ */ (0, a.jsxs)("article", { children: [
					/* @__PURE__ */ (0, a.jsx)("span", {
						className: `sf-scan-status sf-scan-${e.status}`,
						children: e.status
					}),
					/* @__PURE__ */ (0, a.jsxs)("div", { children: [/* @__PURE__ */ (0, a.jsx)("strong", { children: e.fileName }), /* @__PURE__ */ (0, a.jsxs)("small", { children: [
						e.resource,
						" · ",
						r(e.bytes),
						" · ",
						o(e.finishedAt ?? e.startedAt),
						e.durationMilliseconds === null ? "" : ` · ${e.durationMilliseconds} ms`
					] })] }),
					e.code && /* @__PURE__ */ (0, a.jsx)("code", { children: e.code })
				] }, e.id))
			})
		] }) : /* @__PURE__ */ (0, a.jsx)("div", {
			className: "sf-state",
			children: t.loading
		})
	});
}
//#endregion
export { o as SecurityStatusDialog };
