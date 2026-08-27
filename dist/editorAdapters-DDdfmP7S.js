import { SoFinderSdkError as e, createSoFinderClient as t } from "./sofinder-sdk.js";
//#region src/assetPresentation.ts
var n = (e, t) => {
	if (!t) return;
	let n = t.trim().toLowerCase();
	if (!n) return;
	if (Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n)) return e.altTranslations?.[n];
	let r = n.split("-")[0];
	return Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, r) ? e.altTranslations?.[r] : void 0;
}, r = (e, t = {}) => t.defaultAlt?.(e) ?? n(e, t.locale) ?? e.alt ?? e.name.replace(/\.[^.]+$/, ""), i = (e, t = {}) => {
	let n = {
		src: e.url,
		alt: r(e, t)
	};
	return e.assetId && (n["data-sofinder-asset-id"] = e.assetId), e.width && (n.width = String(e.width)), e.height && (n.height = String(e.height)), e.variants?.length && (n.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), n.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), n;
}, a = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), o = (e, t = {}) => `<img ${Object.entries(i(e, t)).map(([e, t]) => `${e}="${a(t)}"`).join(" ")}>`, s = (e) => typeof e.path == "function" ? e.path() : e.path ?? "", c = (n, r, i = "input") => {
	let a = t(r).upload({
		file: n,
		resource: r.resource,
		path: s(r),
		source: i,
		conflictStrategy: r.conflictStrategy ?? "ask"
	});
	return r.onTaskChange && a.subscribe(r.onTaskChange), a.completion.then((e) => r.onAssetReady?.(e)).catch(() => void 0), a.completion.catch((t) => {
		t instanceof e && r.onError?.(t);
	}), a;
}, l = (e, t) => r(e, t), u = (t) => {
	if (!t.capabilities.embeddable || t.url === "") throw new e("asset_not_embeddable", "This resource does not provide a stable embeddable URL.", 422, !1);
	return t;
}, d = (e, t) => i(e, t), f = (e, t) => o(e, t), p = (e, t) => {
	let n = { default: e.url };
	e.width && (n[String(e.width)] = e.url);
	for (let t of e.variants) n[String(t.width)] = t.url;
	let r = {
		urls: n,
		sofinderAlt: l(e, t)
	};
	return e.assetId && (r.sofinderAssetId = e.assetId), e.width && (r.sofinderWidth = e.width), e.height && (r.sofinderHeight = e.height), r;
}, m = (e) => (t) => {
	let n = t.plugins.get("FileRepository"), r = [
		"sofinderAssetId",
		"sofinderWidth",
		"sofinderHeight"
	];
	if (t.model && t.conversion) {
		for (let e of ["imageBlock", "imageInline"]) t.model.schema.extend(e, { allowAttributes: r });
		for (let e of r) {
			let n = e === "sofinderAssetId" ? "data-sofinder-asset-id" : e.replace("sofinder", "").toLowerCase();
			t.conversion.for("downcast").attributeToAttribute({
				model: e,
				view: n
			}), t.conversion.for("upcast").attributeToAttribute({
				view: n,
				model: e
			});
		}
		t.plugins.get("ImageUploadEditing")?.on?.("uploadComplete", (e, { data: n, imageElement: r }) => t.model?.change((e) => {
			typeof n.sofinderAlt == "string" && e.setAttribute("alt", n.sofinderAlt, r), typeof n.sofinderAssetId == "string" && n.sofinderAssetId !== "" && e.setAttribute("sofinderAssetId", n.sofinderAssetId, r), typeof n.sofinderWidth == "number" && e.setAttribute("sofinderWidth", n.sofinderWidth, r), typeof n.sofinderHeight == "number" && e.setAttribute("sofinderHeight", n.sofinderHeight, r);
		}));
	}
	n.createUploadAdapter = (t) => {
		let n = null;
		return {
			async upload() {
				return n = c(await t.file, {
					...e,
					onTaskChange: (n) => {
						t.uploaded = n.progress, t.uploadTotal = 100, e.onTaskChange?.(n);
					}
				}), p(u(await n.completion), e);
			},
			abort() {
				n?.cancel();
			}
		};
	};
}, h = (e) => async (t, n) => {
	let r = t.blob();
	return u(await c(r instanceof File ? r : new File([r], t.filename(), { type: r.type }), {
		...e,
		onTaskChange: (t) => {
			n(t.progress), e.onTaskChange?.(t);
		}
	}, "paste").completion).url;
}, g = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	return e.on("NodeChange", (r) => {
		let i = r.element instanceof HTMLImageElement ? [r.element] : Array.from(r.element?.querySelectorAll("img") ?? []);
		for (let r of i) {
			let i = n.get(e.dom.getAttrib(r, "src"));
			if (i) {
				for (let [n, a] of Object.entries(d(i, t))) e.dom.setAttrib(r, n, a);
				n.delete(i.url);
			}
		}
	}), h({
		...t,
		onAssetReady: (e) => {
			n.set(e.url, e), t.onAssetReady?.(e);
		}
	});
}, _ = async (e, t, n, r = "input") => {
	let i = u(await c(t, n, r).completion);
	return e.chain().focus().setImage(d(i, n)).run(), i;
}, v = (e, t) => {
	let n = (n) => {
		let r = Array.from(n.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), _(e, r, t, "paste"));
	}, r = (n) => {
		let r = Array.from(n.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), _(e, r, t, "drop"));
	};
	return e.view.dom.addEventListener("paste", n), e.view.dom.addEventListener("drop", r), () => {
		e.view.dom.removeEventListener("paste", n), e.view.dom.removeEventListener("drop", r);
	};
}, y = (e, t) => {
	let n = async (n, r) => {
		let i = u(await c(n, t, r).completion), a = e.getSelection(!0)?.index ?? 0;
		e.clipboard ? e.clipboard.dangerouslyPasteHTML(a, f(i, t), "user") : e.insertEmbed(a, "image", i.url, "user");
	};
	t.toolbarUpload !== !1 && e.getModule("toolbar").addHandler("image", () => {
		let e = document.createElement("input");
		e.type = "file", e.accept = "image/*", e.onchange = () => {
			let t = e.files?.[0];
			t && n(t, "input");
		}, e.click();
	});
	let r = (e) => {
		let t = Array.from(e.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "paste"));
	}, i = (e) => {
		let t = Array.from(e.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "drop"));
	};
	return e.root.addEventListener("paste", r), e.root.addEventListener("drop", i), () => {
		e.root.removeEventListener("paste", r), e.root.removeEventListener("drop", i);
	};
}, b = (e, t) => {
	let n = async (n, r) => {
		let i = u(await c(n, t, r).completion), a = `![${l(i, t).replace(/([\\\[\]])/g, "\\$1")}](<${i.url.replace(/</g, "%3C").replace(/>/g, "%3E")}>)`;
		e.setRangeText(a, e.selectionStart, e.selectionEnd, "end"), e.dispatchEvent(new Event("input", { bubbles: !0 }));
	}, r = (e) => {
		let t = Array.from(e.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "paste"));
	}, i = (e) => {
		let t = Array.from(e.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "drop"));
	};
	return e.addEventListener("paste", r), e.addEventListener("drop", i), () => {
		e.removeEventListener("paste", r), e.removeEventListener("drop", i);
	};
}, x = (e, t, n, r = "url") => {
	let i = async () => {
		let i = e.files?.[0];
		if (!i) return;
		let a = await c(i, n).completion;
		t.value = r === "json" ? JSON.stringify(a) : u(a).url, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	};
	return e.addEventListener("change", i), () => e.removeEventListener("change", i);
};
//#endregion
export { g as a, v as c, _ as d, m as i, h as l, x as n, f as o, b as r, y as s, d as t, c as u };
