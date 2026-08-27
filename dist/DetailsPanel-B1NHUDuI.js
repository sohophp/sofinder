import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { n as t, t as n } from "./EntryVisuals-COz6M0oc.js";
import { t as r } from "./format-GD3_dnvn.js";
//#region src/components/DetailsPanel.tsx
var i = e();
function a({ api: e, resource: a, selectedEntries: o, selected: s, imageInfo: c, metadata: l, showTags: u, previewImage: d, selectMode: f, selectAllowed: p, assetMetadataEnabled: m, labels: h, formatDate: g, onChoose: _, onShare: v, onAssetMetadata: y, pluginActions: b }) {
	return /* @__PURE__ */ (0, i.jsxs)("aside", {
		className: "sf-details",
		children: [/* @__PURE__ */ (0, i.jsx)("h2", { children: h.details }), o.length > 1 ? /* @__PURE__ */ (0, i.jsxs)("div", {
			className: "sf-state",
			children: [
				o.length,
				" ",
				h.selected
			]
		}) : s ? /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [
			/* @__PURE__ */ (0, i.jsx)("div", {
				className: "sf-preview",
				children: d ? /* @__PURE__ */ (0, i.jsx)(t, {
					src: e.thumbnailUrl(a, s, 800, 600),
					alt: s.name
				}) : /* @__PURE__ */ (0, i.jsx)(n, {
					name: s.name,
					mimeType: s.mimeType,
					directory: s.directory
				})
			}),
			/* @__PURE__ */ (0, i.jsx)("h3", { children: s.name }),
			/* @__PURE__ */ (0, i.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, i.jsx)("dt", { children: h.type }),
				/* @__PURE__ */ (0, i.jsx)("dd", { children: s.directory ? h.folder : s.mimeType || h.file }),
				/* @__PURE__ */ (0, i.jsx)("dt", { children: h.size }),
				/* @__PURE__ */ (0, i.jsx)("dd", { children: s.directory ? "—" : r(s.size) }),
				c && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsx)("dt", { children: h.dimensions }), /* @__PURE__ */ (0, i.jsxs)("dd", { children: [
					c.width,
					" × ",
					c.height,
					" px"
				] })] }),
				/* @__PURE__ */ (0, i.jsx)("dt", { children: h.modified }),
				/* @__PURE__ */ (0, i.jsx)("dd", { children: /* @__PURE__ */ (0, i.jsx)("time", {
					dateTime: (/* @__PURE__ */ new Date(s.modifiedAt * 1e3)).toISOString(),
					children: g(s.modifiedAt)
				}) }),
				/* @__PURE__ */ (0, i.jsx)("dt", { children: h.location }),
				/* @__PURE__ */ (0, i.jsx)("dd", { children: s.path })
			] }),
			u && (l.tags[s.path] || []).length > 0 && /* @__PURE__ */ (0, i.jsx)("div", {
				className: "sf-tags",
				children: l.tags[s.path].map((e) => /* @__PURE__ */ (0, i.jsx)("span", { children: e }, e))
			}),
			f && !s.directory && s.url && /* @__PURE__ */ (0, i.jsxs)(i.Fragment, { children: [/* @__PURE__ */ (0, i.jsx)("button", {
				className: "sf-select primary",
				disabled: !p,
				onClick: _,
				children: h.select
			}), !p && /* @__PURE__ */ (0, i.jsx)("p", {
				className: "sf-warning",
				role: "status",
				children: h.unsupportedWebImage
			})] }),
			!s.directory && /* @__PURE__ */ (0, i.jsxs)("div", {
				className: "sf-detail-actions",
				children: [
					/* @__PURE__ */ (0, i.jsx)("a", {
						className: "sf-download",
						href: s.url || e.downloadUrl(a, s.path),
						target: "_blank",
						rel: "noopener noreferrer",
						children: h.download
					}),
					/* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: () => v(s),
						children: h.share
					}),
					m && s.capabilities?.["metadata.update"] !== !1 && /* @__PURE__ */ (0, i.jsx)("button", {
						type: "button",
						onClick: () => y?.(s),
						children: h.assetMetadata
					})
				]
			}),
			b && /* @__PURE__ */ (0, i.jsx)("div", {
				className: "sf-plugin-detail-actions",
				children: b
			})
		] }) : /* @__PURE__ */ (0, i.jsx)("div", {
			className: "sf-state",
			children: "—"
		})]
	});
}
//#endregion
export { a as DetailsPanel };
