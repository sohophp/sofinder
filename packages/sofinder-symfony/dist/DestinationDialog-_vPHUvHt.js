import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./Modal-ClPLM5jI.js";
import { t as n } from "./EntryVisuals-COz6M0oc.js";
//#region src/components/DestinationDialog.tsx
var r = e();
function i({ state: e, unsafe: i, translate: a, onBrowse: o, onConfirm: s, onClose: c }) {
	let l = a, u = e.path ? e.path.split("/") : [];
	return /* @__PURE__ */ (0, r.jsxs)(t, {
		title: e.operation === "move" ? l("moveDestination") : l("copyDestination"),
		closeLabel: l("close"),
		onClose: c,
		className: "sf-folder-modal",
		footer: /* @__PURE__ */ (0, r.jsxs)(r.Fragment, { children: [
			/* @__PURE__ */ (0, r.jsxs)("span", { children: [
				l("currentFolder"),
				": /",
				e.path
			] }),
			/* @__PURE__ */ (0, r.jsx)("button", {
				onClick: c,
				children: l("cancel")
			}),
			/* @__PURE__ */ (0, r.jsx)("button", {
				className: "primary",
				disabled: e.loading || i,
				onClick: () => s(e.operation, e.path),
				children: e.operation === "move" ? l("moveHere") : l("copyHere")
			})
		] }),
		children: [
			/* @__PURE__ */ (0, r.jsxs)("nav", {
				className: "sf-folder-crumbs",
				"aria-label": l("chooseFolder"),
				children: [/* @__PURE__ */ (0, r.jsx)("button", {
					onClick: () => o(e.operation, ""),
					children: l("rootFolder")
				}), u.map((t, n) => /* @__PURE__ */ (0, r.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, r.jsx)("button", {
					onClick: () => o(e.operation, u.slice(0, n + 1).join("/")),
					children: t
				})] }, `${t}-${n}`))]
			}),
			/* @__PURE__ */ (0, r.jsx)("div", {
				className: "sf-folder-list",
				children: e.loading ? /* @__PURE__ */ (0, r.jsx)("div", {
					className: "sf-state",
					children: l("loading")
				}) : e.folders.length === 0 ? /* @__PURE__ */ (0, r.jsx)("div", {
					className: "sf-state",
					children: l("noFolders")
				}) : e.folders.map((t) => /* @__PURE__ */ (0, r.jsxs)("button", {
					onDoubleClick: () => o(e.operation, t.path),
					onClick: () => o(e.operation, t.path),
					children: [
						/* @__PURE__ */ (0, r.jsx)("span", {
							className: "sf-folder-small",
							children: /* @__PURE__ */ (0, r.jsx)(n, { kind: "folder" })
						}),
						t.name,
						/* @__PURE__ */ (0, r.jsx)("span", { children: "›" })
					]
				}, t.path))
			}),
			i && /* @__PURE__ */ (0, r.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: l("unsafeDestination")
			})
		]
	});
}
//#endregion
export { i as DestinationDialog };
