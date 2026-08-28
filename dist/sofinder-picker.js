//#region src/picker.ts
var e = "1.0", t = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `sf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, n = (e, n = t()) => {
	let r = new URL(e.baseUrl, window.location.href);
	return r.searchParams.set("select", "1"), r.searchParams.set("uiMode", "picker"), r.searchParams.set("selection", e.kind ?? "any"), r.searchParams.set("pickerRequestId", n), r.searchParams.set("pickerOrigin", window.location.origin), e.resource && r.searchParams.set("type", e.resource), e.path && r.searchParams.set("path", e.path), e.language && r.searchParams.set("lang", e.language), e.tools && r.searchParams.set("uiTools", e.tools), r;
}, r = (e) => {
	let r = t(), a = n(e, r), o = Math.max(640, e.width ?? 1100), s = Math.max(480, e.height ?? 760), c = window.open(a, e.windowName ?? "sofinder-picker", `popup=yes,width=${o},height=${s},resizable=yes,scrollbars=yes`);
	return c ? new Promise((e, t) => {
		let n = 0, o = () => {
			window.removeEventListener("message", s), n && window.clearInterval(n);
		}, s = (t) => {
			let n = t.data;
			t.source !== c || t.origin !== a.origin || n?.type !== "sofinder:select" || n.version !== "1.0" || n.requestId !== r || !i(n.entry) || (o(), e(n.entry));
		};
		window.addEventListener("message", s), n = window.setInterval(() => {
			c.closed && (o(), t(new DOMException("The SoFinder picker was closed.", "AbortError")));
		}, 300);
	}) : Promise.reject(/* @__PURE__ */ Error("SoFinder picker was blocked by the browser."));
}, i = (e) => {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.resource == "string" && t.resource !== "" && typeof t.path == "string" && typeof t.name == "string" && t.directory === !1 && typeof t.size == "number" && typeof t.modifiedAt == "number" && typeof t.url == "string" && t.url !== "" && (t.mimeType === null || typeof t.mimeType == "string") && (t.width === null || typeof t.width == "number") && (t.height === null || typeof t.height == "number") && typeof t.capabilities == "object" && t.capabilities !== null;
}, a = (e, t) => {
	let n = t.language?.toLowerCase(), r = n && Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n) ? e.altTranslations?.[n] : n && Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n.split("-")[0]) ? e.altTranslations?.[n.split("-")[0]] : void 0;
	return t.defaultAlt?.(e) ?? r ?? e.alt ?? e.name.replace(/\.[^.]+$/, "");
}, o = (e, t) => {
	let n = {
		src: e.url,
		alt: a(e, t)
	};
	return e.assetId && (n["data-sofinder-asset-id"] = e.assetId), e.width && (n.width = String(e.width)), e.height && (n.height = String(e.height)), e.variants?.length && (n.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), n.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), n;
}, s = (e, t) => {
	let n = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return `<img ${Object.entries(o(e, t)).map(([e, t]) => `${e}="${n(t)}"`).join(" ")}>`;
}, c = (e, t) => {
	let n = e.model?.document.selection.getSelectedElement();
	!n || !e.model || e.model.change((e) => {
		e.setAttribute("url", t.url, n), t.assetId && e.setAttribute("sofinderAssetId", t.assetId, n), t.width && e.setAttribute("sofinderWidth", t.width, n), t.height && e.setAttribute("sofinderHeight", t.height, n);
	});
}, l = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.execute("insertImage", { source: n.url }), c(e, n), (!e.commands || e.commands.get("imageTextAlternative")) && e.execute("imageTextAlternative", { newValue: a(n, t) }), e.editing?.view?.focus?.(), n;
}, u = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.model?.document.selection.getSelectedElement() && e.model ? c(e, n) : e.execute("insertImage", { source: n.url }), (!e.commands || e.commands.get("imageTextAlternative")) && e.execute("imageTextAlternative", { newValue: a(n, t) }), e.editing?.view?.focus?.(), n;
}, d = (e, t) => {
	e.PluginManager.add("sofinder", (e) => {
		let n = async () => {
			let n = await r({
				...t,
				kind: "image"
			});
			e.insertContent(s(n, t));
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
}, f = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.chain().focus().setImage(o(n, t)).run(), n;
}, p = (e, t) => {
	e.getModule("toolbar").addHandler("image", () => {
		r({
			...t,
			kind: "image"
		}).then((n) => {
			let r = e.getSelection(!0);
			e.clipboard ? e.clipboard.dangerouslyPasteHTML(r?.index ?? 0, s(n, t), "user") : e.insertEmbed(r?.index ?? 0, "image", n.url, "user");
		});
	});
}, m = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	});
	return e.restoreSelection?.(), e.insertNode({
		type: "image",
		src: n.url,
		alt: a(n, t),
		href: "",
		children: [{ text: "" }]
	}), e.focus?.(), n;
}, h = (e) => ({ customBrowseAndUpload(t) {
	r({
		...e,
		kind: "image"
	}).then((n) => t(n.url, a(n, e), ""));
} }), g = async (e, t) => {
	let n = await r({
		...t,
		kind: "image"
	}), i = e.createInside.element("img");
	for (let [e, r] of Object.entries(o(n, t))) i.setAttribute(e, r);
	return e.s.insertImage(i), n;
}, _ = async (e, t) => {
	let n = await r(t);
	return e.value = n.url, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), n;
}, v = async (e, t) => {
	let n = await r(t), i = t.kind === "image" || n.mimeType?.startsWith("image/") === !0, o = (i ? a(n, t) : n.name).replace(/([\\\[\]])/g, "\\$1"), s = n.url.replace(/</g, "%3C").replace(/>/g, "%3E"), c = `${i ? "!" : ""}[${o}](<${s}>)`, l = e.selectionStart ?? e.value.length, u = e.selectionEnd ?? l;
	return e.setRangeText(c, l, u, "end"), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.focus(), n;
};
//#endregion
export { e as PICKER_PROTOCOL_VERSION, h as createWangEditorPickerIntegration, r as openPicker, n as pickerUrl, p as registerQuill, d as registerTinyMce, u as replaceSelectedForCkeditor5, l as selectForCkeditor5, _ as selectForInput, g as selectForJodit, v as selectForMarkdown, f as selectForTiptap, m as selectForWangEditor };
