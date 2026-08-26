//#region src/picker.ts
var e = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `sf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, t = (t, n = e()) => {
	let r = new URL(t.baseUrl, window.location.href);
	return r.searchParams.set("select", "1"), r.searchParams.set("uiMode", "picker"), r.searchParams.set("selection", t.kind ?? "any"), r.searchParams.set("pickerRequestId", n), t.resource && r.searchParams.set("type", t.resource), t.path && r.searchParams.set("path", t.path), t.language && r.searchParams.set("lang", t.language), t.tools && r.searchParams.set("uiTools", t.tools), r;
}, n = (n) => {
	let r = e(), i = t(n, r), a = Math.max(640, n.width ?? 1100), o = Math.max(480, n.height ?? 760), s = window.open(i, n.windowName ?? "sofinder-picker", `popup=yes,width=${a},height=${o},resizable=yes,scrollbars=yes`);
	return s ? new Promise((e, t) => {
		let n = 0, a = () => {
			window.removeEventListener("message", o), n && window.clearInterval(n);
		}, o = (t) => {
			let n = t.data;
			t.source !== s || t.origin !== i.origin || n?.type !== "sofinder:select" || n.version !== "1.0" || n.requestId !== r || !n.entry || (a(), e(n.entry));
		};
		window.addEventListener("message", o), n = window.setInterval(() => {
			s.closed && (a(), t(new DOMException("The SoFinder picker was closed.", "AbortError")));
		}, 300);
	}) : Promise.reject(/* @__PURE__ */ Error("SoFinder picker was blocked by the browser."));
}, r = async (e, t) => {
	let r = await n({
		...t,
		kind: "image"
	});
	return e.execute("insertImage", { source: r.url }), e.editing?.view?.focus?.(), r;
}, i = (e, t) => {
	e.PluginManager.add("sofinder", (e) => {
		let r = async () => {
			let r = await n({
				...t,
				kind: "image"
			});
			e.insertContent(`<img src="${e.dom.encode(r.url)}" alt="${e.dom.encode(r.name)}">`);
		};
		return e.ui.registry.addButton("sofinder", {
			text: "Files",
			tooltip: "Choose from SoFinder",
			onAction: r
		}), e.ui.registry.addMenuItem("sofinder", {
			text: "Choose from SoFinder",
			onAction: r
		}), { getMetadata: () => ({
			name: "SoFinder",
			url: "https://sofinder.sohophp.app/"
		}) };
	});
}, a = async (e, t) => {
	let r = await n({
		...t,
		kind: "image"
	});
	return e.chain().focus().setImage({
		src: r.url,
		alt: r.name
	}).run(), r;
}, o = (e, t) => {
	e.getModule("toolbar").addHandler("image", () => {
		n({
			...t,
			kind: "image"
		}).then((t) => {
			let n = e.getSelection(!0);
			e.insertEmbed(n?.index ?? 0, "image", t.url, "user");
		});
	});
}, s = async (e, t) => {
	let r = await n(t);
	return e.value = r.url, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), r;
};
//#endregion
export { n as openPicker, t as pickerUrl, o as registerQuill, i as registerTinyMce, r as selectForCkeditor5, s as selectForInput, a as selectForTiptap };
