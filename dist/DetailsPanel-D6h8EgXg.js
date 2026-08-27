import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./UiIcon-ClFQjiWf.js";
import { n, t as r } from "./EntryVisuals-COz6M0oc.js";
import { t as i } from "./format-GD3_dnvn.js";
//#region src/components/DetailsPanel.tsx
var a = e();
function o({ api: e, resource: o, selectedEntries: s, selected: c, imageInfo: l, metadata: u, showTags: d, previewImage: f, selectMode: p, selectAllowed: m, assetMetadataEnabled: h, labels: g, formatDate: _, onChoose: v, onShare: y, onAssetMetadata: b, pluginActions: x }) {
	return /* @__PURE__ */ (0, a.jsxs)("aside", {
		className: "sf-details",
		children: [/* @__PURE__ */ (0, a.jsx)("h2", { children: g.details }), s.length > 1 ? /* @__PURE__ */ (0, a.jsxs)("div", {
			className: "sf-state",
			children: [
				s.length,
				" ",
				g.selected
			]
		}) : c ? /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [
			/* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-preview",
				children: f ? /* @__PURE__ */ (0, a.jsx)(n, {
					src: e.thumbnailUrl(o, c, 800, 600),
					alt: c.name
				}) : /* @__PURE__ */ (0, a.jsx)(r, {
					name: c.name,
					mimeType: c.mimeType,
					directory: c.directory
				})
			}),
			/* @__PURE__ */ (0, a.jsx)("h3", { children: c.name }),
			/* @__PURE__ */ (0, a.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, a.jsx)("dt", { children: g.type }),
				/* @__PURE__ */ (0, a.jsx)("dd", { children: c.directory ? g.folder : c.mimeType || g.file }),
				/* @__PURE__ */ (0, a.jsx)("dt", { children: g.size }),
				/* @__PURE__ */ (0, a.jsx)("dd", { children: c.directory ? "—" : i(c.size) }),
				l && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsx)("dt", { children: g.dimensions }), /* @__PURE__ */ (0, a.jsxs)("dd", { children: [
					l.width,
					" × ",
					l.height,
					" px"
				] })] }),
				/* @__PURE__ */ (0, a.jsx)("dt", { children: g.modified }),
				/* @__PURE__ */ (0, a.jsx)("dd", { children: /* @__PURE__ */ (0, a.jsx)("time", {
					dateTime: (/* @__PURE__ */ new Date(c.modifiedAt * 1e3)).toISOString(),
					children: _(c.modifiedAt)
				}) }),
				/* @__PURE__ */ (0, a.jsx)("dt", { children: g.location }),
				/* @__PURE__ */ (0, a.jsx)("dd", { children: c.path })
			] }),
			d && (u.tags[c.path] || []).length > 0 && /* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-tags",
				children: u.tags[c.path].map((e) => /* @__PURE__ */ (0, a.jsx)("span", { children: e }, e))
			}),
			p && !c.directory && c.url && /* @__PURE__ */ (0, a.jsxs)(a.Fragment, { children: [/* @__PURE__ */ (0, a.jsx)("button", {
				className: "sf-select primary",
				disabled: !m,
				onClick: v,
				children: g.select
			}), !m && /* @__PURE__ */ (0, a.jsx)("p", {
				className: "sf-warning",
				role: "status",
				children: g.unsupportedWebImage
			})] }),
			!c.directory && /* @__PURE__ */ (0, a.jsxs)("div", {
				className: "sf-detail-actions",
				children: [
					/* @__PURE__ */ (0, a.jsx)("a", {
						className: "sf-icon-action",
						href: c.url || e.downloadUrl(o, c.path),
						target: "_blank",
						rel: "noopener noreferrer",
						title: g.download,
						"aria-label": g.download,
						children: /* @__PURE__ */ (0, a.jsx)(t, { name: "download" })
					}),
					/* @__PURE__ */ (0, a.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => y(c),
						title: g.share,
						"aria-label": g.share,
						children: /* @__PURE__ */ (0, a.jsx)(t, { name: "share" })
					}),
					h && c.capabilities?.["metadata.update"] !== !1 && /* @__PURE__ */ (0, a.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => b?.(c),
						title: g.assetMetadata,
						"aria-label": g.assetMetadata,
						children: /* @__PURE__ */ (0, a.jsx)(t, { name: "asset-metadata" })
					})
				]
			}),
			x && /* @__PURE__ */ (0, a.jsx)("div", {
				className: "sf-plugin-detail-actions",
				children: x
			})
		] }) : /* @__PURE__ */ (0, a.jsx)("div", {
			className: "sf-state",
			children: "—"
		})]
	});
}
//#endregion
export { o as DetailsPanel };
