//#region src/picker.ts
var e = "1.0", t = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `sf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, n = (e, n = t()) => {
	let r = new URL(e.baseUrl, window.location.href);
	return r.searchParams.set("select", "1"), r.searchParams.set("uiMode", "picker"), r.searchParams.set("selection", e.kind ?? "any"), r.searchParams.set("pickerRequestId", n), r.searchParams.set("pickerOrigin", window.location.origin), e.resource && r.searchParams.set("type", e.resource), e.resource && r.searchParams.set("resourceLock", e.lockResource === !1 ? "0" : "1"), e.path && r.searchParams.set("path", e.path), e.language && r.searchParams.set("lang", e.language), e.tools && r.searchParams.set("uiTools", e.tools), r;
}, r = (e) => {
	let r = t(), i = n(e, r), o = Math.max(640, e.width ?? 1100), s = Math.max(480, e.height ?? 760), c = window.open(i, e.windowName ?? `sofinder-picker-${r}`, `popup=yes,width=${o},height=${s},resizable=yes,scrollbars=yes`);
	return c ? new Promise((t, n) => {
		let o = 0, s = () => {
			window.removeEventListener("message", l), o && window.clearInterval(o);
		}, l = (n) => {
			let o = n.data;
			n.source !== c || n.origin !== i.origin || o?.type !== "sofinder:select" || o.version !== "1.0" || o.requestId !== r || !a(o.entry, e, i) || e.resource && e.lockResource !== !1 && o.entry.resource !== e.resource || (s(), t(o.entry));
		};
		window.addEventListener("message", l), o = window.setInterval(() => {
			c.closed && (s(), n(new DOMException("The SoFinder picker was closed.", "AbortError")));
		}, 300);
	}) : Promise.reject(/* @__PURE__ */ Error("SoFinder picker was blocked by the browser."));
}, i = (e) => typeof e == "number" && Number.isFinite(e) && e >= 0, a = (e, t, n) => {
	if (!e || typeof e != "object") return !1;
	let r = e;
	if (typeof r.url != "string" || r.url === "") return !1;
	let a;
	try {
		a = new URL(r.url, n);
	} catch {
		return !1;
	}
	return a.protocol !== "http:" && a.protocol !== "https:" || t.allowedResultOrigins?.length && !t.allowedResultOrigins.includes(a.origin) || t.kind === "image" && !r.mimeType?.toLowerCase().startsWith("image/") ? !1 : typeof r.resource == "string" && r.resource !== "" && typeof r.path == "string" && typeof r.name == "string" && r.directory === !1 && i(r.size) && i(r.modifiedAt) && (r.mimeType === null || typeof r.mimeType == "string") && (r.width === null || i(r.width)) && (r.height === null || i(r.height)) && typeof r.capabilities == "object" && r.capabilities !== null;
}, o = (e, t) => {
	let n = t.language?.toLowerCase(), r = n && Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n) ? e.altTranslations?.[n] : n && Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n.split("-")[0]) ? e.altTranslations?.[n.split("-")[0]] : void 0;
	return t.defaultAlt?.(e) ?? r ?? e.alt ?? e.name.replace(/\.[^.]+$/, "");
}, s = (e, t) => {
	let n = {
		src: e.url,
		alt: o(e, t)
	};
	return e.assetId && (n["data-sofinder-asset-id"] = e.assetId), e.width && (n.width = String(e.width)), e.height && (n.height = String(e.height)), e.variants?.length && (n.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), n.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), n;
}, c = (e, t) => {
	let n = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return `<img ${Object.entries(s(e, t)).map(([e, t]) => `${e}="${n(t)}"`).join(" ")}>`;
}, l = (e, t) => {
	let n = e.model?.document.selection.getSelectedElement();
	!n || !e.model || e.model.change((e) => {
		e.setAttribute("url", t.url, n), t.assetId && e.setAttribute("sofinderAssetId", t.assetId, n), t.width && e.setAttribute("sofinderWidth", t.width, n), t.height && e.setAttribute("sofinderHeight", t.height, n);
	});
}, u = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.execute("insertImage", { source: n.url }), l(e, n), (!e.commands || e.commands.get("imageTextAlternative")) && e.execute("imageTextAlternative", { newValue: o(n, t) }), e.editing?.view?.focus?.(), n;
}, d = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.model?.document.selection.getSelectedElement() && e.model ? l(e, n) : e.execute("insertImage", { source: n.url }), (!e.commands || e.commands.get("imageTextAlternative")) && e.execute("imageTextAlternative", { newValue: o(n, t) }), e.editing?.view?.focus?.(), n;
}, f = (e, t) => {
	e.PluginManager.add("sofinder", (e) => {
		let n = async () => {
			let n = await r({
				...t,
				kind: "image"
			});
			e.insertContent(c(n, t));
		};
		return e.ui.registry.addButton("sofinder", {
			text: "Files",
			tooltip: "Choose from SoFinder",
			onAction: n
		}), e.ui.registry.addMenuItem("sofinder", {
			text: "Choose from SoFinder",
			onAction: n
		}), { getMetadata: () => ({
			name: "SoFinder",
			url: "https://sofinder.sohophp.app/"
		}) };
	});
}, p = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.chain().focus().setImage(s(n, t)).run(), n;
}, m = (e, t) => {
	e.getModule("toolbar").addHandler("image", () => {
		r({
			...t,
			kind: "image"
		}).then((n) => {
			let r = e.getSelection(!0);
			e.clipboard ? e.clipboard.dangerouslyPasteHTML(r?.index ?? 0, c(n, t), "user") : e.insertEmbed(r?.index ?? 0, "image", n.url, "user");
		});
	});
}, h = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.restoreSelection?.(), e.insertNode({
		type: "image",
		src: n.url,
		alt: o(n, t),
		href: "",
		children: [{ text: "" }]
	}), e.focus?.(), n;
}, g = (e) => ({ customBrowseAndUpload(t) {
	r({
		...e,
		kind: "image"
	}).then((n) => t(n.url, o(n, e), ""));
} }), _ = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	}), i = e.createInside.element("img");
	for (let [e, r] of Object.entries(s(n, t))) i.setAttribute(e, r);
	return e.s.insertImage(i), n;
}, v = async (e, t) => {
	let n = await r(t);
	return e.value = n.url, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), n;
}, y = async (e, t) => {
	let n = await r(t), i = t.kind === "image" || n.mimeType?.startsWith("image/") === !0, a = (i ? o(n, t) : n.name).replace(/([\\\[\]])/g, "\\$1"), s = n.url.replace(/</g, "%3C").replace(/>/g, "%3E"), c = `${i ? "!" : ""}[${a}](<${s}>)`, l = e.selectionStart ?? e.value.length, u = e.selectionEnd ?? l;
	return e.setRangeText(c, l, u, "end"), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.focus(), n;
};
//#endregion
export { e as PICKER_PROTOCOL_VERSION, g as createWangEditorPickerIntegration, r as openPicker, n as pickerUrl, m as registerQuill, f as registerTinyMce, d as replaceSelectedForCkeditor5, u as selectForCkeditor5, v as selectForInput, _ as selectForJodit, y as selectForMarkdown, p as selectForTiptap, h as selectForWangEditor };
