//#region src/picker.ts
var e = "1.0", t = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `sf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, n = (e, n = t()) => {
	let r = new URL(e.baseUrl, window.location.href);
	return r.searchParams.set("select", "1"), r.searchParams.set("uiMode", "picker"), r.searchParams.set("selection", e.kind ?? "any"), r.searchParams.set("pickerRequestId", n), r.searchParams.set("pickerOrigin", window.location.origin), e.resource && r.searchParams.set("type", e.resource), e.resource && r.searchParams.set("resourceLock", e.lockResource === !1 ? "0" : "1"), e.path && r.searchParams.set("path", e.path), e.language && r.searchParams.set("lang", e.language), e.tools && r.searchParams.set("uiTools", e.tools), r;
}, r = /* @__PURE__ */ new Map(), i = (e) => {
	let t = r.get(e);
	return !t || t.closed ? !1 : (t.focus(), !0);
}, a = (e) => {
	let i = t(), a = n(e, i), o = Math.max(640, e.width ?? 1100), c = Math.max(480, e.height ?? 760), l = e.windowName ?? `sofinder-picker-${i}`, u = window.open(a, l, `popup=yes,width=${o},height=${c},resizable=yes,scrollbars=yes`);
	return u ? (r.set(l, u), new Promise((t, n) => {
		let o = 0, c = () => {
			window.removeEventListener("message", d), o && window.clearInterval(o), r.get(l) === u && r.delete(l);
		}, d = (n) => {
			let r = n.data;
			n.source !== u || n.origin !== a.origin || r?.type !== "sofinder:select" || r.version !== "1.0" || r.requestId !== i || !s(r.entry, e, a) || e.resource && e.lockResource !== !1 && r.entry.resource !== e.resource || (c(), t(r.entry));
		};
		window.addEventListener("message", d), o = window.setInterval(() => {
			u.closed && (c(), n(new DOMException("The SoFinder picker was closed.", "AbortError")));
		}, 300);
	})) : Promise.reject(/* @__PURE__ */ Error("SoFinder picker was blocked by the browser."));
}, o = (e) => typeof e == "number" && Number.isFinite(e) && e >= 0, s = (e, t, n) => {
	if (!e || typeof e != "object") return !1;
	let r = e;
	if (typeof r.url != "string" || r.url === "") return !1;
	let i;
	try {
		i = new URL(r.url, n);
	} catch {
		return !1;
	}
	return i.protocol !== "http:" && i.protocol !== "https:" || t.allowedResultOrigins?.length && !t.allowedResultOrigins.includes(i.origin) || t.kind === "image" && !r.mimeType?.toLowerCase().startsWith("image/") ? !1 : typeof r.resource == "string" && r.resource !== "" && typeof r.path == "string" && typeof r.name == "string" && r.directory === !1 && o(r.size) && o(r.modifiedAt) && (r.mimeType === null || typeof r.mimeType == "string") && (r.width === null || o(r.width)) && (r.height === null || o(r.height)) && typeof r.capabilities == "object" && r.capabilities !== null;
}, c = (e, t) => {
	let n = t.language?.toLowerCase(), r = n && Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n) ? e.altTranslations?.[n] : n && Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n.split("-")[0]) ? e.altTranslations?.[n.split("-")[0]] : void 0;
	return t.defaultAlt?.(e) ?? r ?? e.alt ?? e.name.replace(/\.[^.]+$/, "");
}, l = (e, t) => {
	let n = {
		src: e.url,
		alt: c(e, t)
	};
	return e.assetId && (n["data-sofinder-asset-id"] = e.assetId), e.width && (n.width = String(e.width)), e.height && (n.height = String(e.height)), e.variants?.length && (n.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), n.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), n;
}, u = (e, t) => {
	let n = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return `<img ${Object.entries(l(e, t)).map(([e, t]) => `${e}="${n(t)}"`).join(" ")}>`;
}, d = (e, t) => {
	let n = e.model?.document.selection.getSelectedElement();
	!n || !e.model || e.model.change((e) => {
		e.setAttribute("url", t.url, n), t.assetId && e.setAttribute("sofinderAssetId", t.assetId, n), t.width && e.setAttribute("sofinderWidth", t.width, n), t.height && e.setAttribute("sofinderHeight", t.height, n);
	});
}, f = async (e, t) => {
	let n = await a({
		...t,
		kind: "image"
	});
	return e.execute("insertImage", { source: n.url }), d(e, n), (!e.commands || e.commands.get("imageTextAlternative")) && e.execute("imageTextAlternative", { newValue: c(n, t) }), e.editing?.view?.focus?.(), n;
}, p = async (e, t) => {
	let n = await a({
		...t,
		kind: "image"
	});
	return e.model?.document.selection.getSelectedElement() && e.model ? d(e, n) : e.execute("insertImage", { source: n.url }), (!e.commands || e.commands.get("imageTextAlternative")) && e.execute("imageTextAlternative", { newValue: c(n, t) }), e.editing?.view?.focus?.(), n;
}, m = (e, t) => {
	e.PluginManager.add("sofinder", (e) => {
		let n = async () => {
			let n = await a({
				...t,
				kind: "image"
			});
			e.insertContent(u(n, t));
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
}, h = async (e, t) => {
	let n = await a({
		...t,
		kind: "image"
	});
	return e.chain().focus().setImage(l(n, t)).run(), n;
}, g = (e, t) => {
	e.getModule("toolbar").addHandler("image", () => {
		a({
			...t,
			kind: "image"
		}).then((n) => {
			let r = e.getSelection(!0);
			e.clipboard ? e.clipboard.dangerouslyPasteHTML(r?.index ?? 0, u(n, t), "user") : e.insertEmbed(r?.index ?? 0, "image", n.url, "user");
		});
	});
}, _ = async (e, t) => {
	let n = await a({
		...t,
		kind: "image"
	});
	return e.restoreSelection?.(), e.insertNode({
		type: "image",
		src: n.url,
		alt: c(n, t),
		href: "",
		children: [{ text: "" }]
	}), e.focus?.(), n;
}, v = (e) => ({ customBrowseAndUpload(t) {
	a({
		...e,
		kind: "image"
	}).then((n) => t(n.url, c(n, e), ""));
} }), y = async (e, t) => {
	let n = await a({
		...t,
		kind: "image"
	}), r = e.createInside.element("img");
	for (let [e, i] of Object.entries(l(n, t))) r.setAttribute(e, i);
	return e.s.insertImage(r), n;
}, b = async (e, t) => {
	let n = await a(t);
	return e.value = n.url, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), n;
}, x = async (e, t) => {
	let n = await a(t), r = t.kind === "image" || n.mimeType?.startsWith("image/") === !0, i = (r ? c(n, t) : n.name).replace(/([\\\[\]])/g, "\\$1"), o = n.url.replace(/</g, "%3C").replace(/>/g, "%3E"), s = `${r ? "!" : ""}[${i}](<${o}>)`, l = e.selectionStart ?? e.value.length, u = e.selectionEnd ?? l;
	return e.setRangeText(s, l, u, "end"), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.focus(), n;
};
//#endregion
export { e as PICKER_PROTOCOL_VERSION, v as createWangEditorPickerIntegration, i as focusOpenPicker, a as openPicker, n as pickerUrl, g as registerQuill, m as registerTinyMce, p as replaceSelectedForCkeditor5, f as selectForCkeditor5, b as selectForInput, y as selectForJodit, x as selectForMarkdown, h as selectForTiptap, _ as selectForWangEditor };
