import { SoFinderSdkError as e, createSoFinderClient as t } from "./sofinder-sdk.js";
//#region src/assetPresentation.ts
var n = (e, t = {}) => t.defaultAlt?.(e) ?? e.alt ?? e.name.replace(/\.[^.]+$/, ""), r = (e, t = {}) => {
	let r = {
		src: e.url,
		alt: n(e, t)
	};
	return e.assetId && (r["data-sofinder-asset-id"] = e.assetId), e.width && (r.width = String(e.width)), e.height && (r.height = String(e.height)), e.variants?.length && (r.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), r.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), r;
}, i = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), a = (e, t = {}) => `<img ${Object.entries(r(e, t)).map(([e, t]) => `${e}="${i(t)}"`).join(" ")}>`, o = (e) => typeof e.path == "function" ? e.path() : e.path ?? "", s = (n, r, i = "input") => {
	let a = t(r).upload({
		file: n,
		resource: r.resource,
		path: o(r),
		source: i,
		conflictStrategy: r.conflictStrategy ?? "ask"
	});
	return r.onTaskChange && a.subscribe(r.onTaskChange), a.completion.then((e) => r.onAssetReady?.(e)).catch(() => void 0), a.completion.catch((t) => {
		t instanceof e && r.onError?.(t);
	}), a;
}, c = (e, t) => n(e, t), l = (t) => {
	if (!t.capabilities.embeddable || t.url === "") throw new e("asset_not_embeddable", "This resource does not provide a stable embeddable URL.", 422, !1);
	return t;
}, u = (e, t) => r(e, t), d = (e, t) => a(e, t), f = (e, t) => {
	let n = { default: e.url };
	e.width && (n[String(e.width)] = e.url);
	for (let t of e.variants) n[String(t.width)] = t.url;
	let r = {
		urls: n,
		sofinderAlt: c(e, t)
	};
	return e.assetId && (r.sofinderAssetId = e.assetId), e.width && (r.sofinderWidth = e.width), e.height && (r.sofinderHeight = e.height), r;
}, p = (e) => (t) => {
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
				return n = s(await t.file, {
					...e,
					onTaskChange: (n) => {
						t.uploaded = n.progress, t.uploadTotal = 100, e.onTaskChange?.(n);
					}
				}), f(l(await n.completion), e);
			},
			abort() {
				n?.cancel();
			}
		};
	};
}, m = (e) => async (t, n) => {
	let r = t.blob();
	return l(await s(r instanceof File ? r : new File([r], t.filename(), { type: r.type }), {
		...e,
		onTaskChange: (t) => {
			n(t.progress), e.onTaskChange?.(t);
		}
	}, "paste").completion).url;
}, h = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	return e.on("NodeChange", (r) => {
		let i = r.element instanceof HTMLImageElement ? [r.element] : Array.from(r.element?.querySelectorAll("img") ?? []);
		for (let r of i) {
			let i = n.get(e.dom.getAttrib(r, "src"));
			if (i) {
				for (let [n, a] of Object.entries(u(i, t))) e.dom.setAttrib(r, n, a);
				n.delete(i.url);
			}
		}
	}), m({
		...t,
		onAssetReady: (e) => {
			n.set(e.url, e), t.onAssetReady?.(e);
		}
	});
}, g = async (e, t, n, r = "input") => {
	let i = l(await s(t, n, r).completion);
	return e.chain().focus().setImage(u(i, n)).run(), i;
}, _ = (e, t) => {
	let n = (n) => {
		let r = Array.from(n.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), g(e, r, t, "paste"));
	}, r = (n) => {
		let r = Array.from(n.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), g(e, r, t, "drop"));
	};
	return e.view.dom.addEventListener("paste", n), e.view.dom.addEventListener("drop", r), () => {
		e.view.dom.removeEventListener("paste", n), e.view.dom.removeEventListener("drop", r);
	};
}, v = (e, t) => {
	let n = async (n, r) => {
		let i = l(await s(n, t, r).completion), a = e.getSelection(!0)?.index ?? 0;
		e.clipboard ? e.clipboard.dangerouslyPasteHTML(a, d(i, t), "user") : e.insertEmbed(a, "image", i.url, "user");
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
}, y = (e, t) => {
	let n = async (n, r) => {
		let i = l(await s(n, t, r).completion), a = `![${c(i, t).replace(/([\\\[\]])/g, "\\$1")}](<${i.url.replace(/</g, "%3C").replace(/>/g, "%3E")}>)`;
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
}, b = (e, t, n, r = "url") => {
	let i = async () => {
		let i = e.files?.[0];
		if (!i) return;
		let a = await s(i, n).completion;
		t.value = r === "json" ? JSON.stringify(a) : l(a).url, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	};
	return e.addEventListener("change", i), () => e.removeEventListener("change", i);
};
//#endregion
export { h as a, _ as c, g as d, p as i, m as l, b as n, d as o, y as r, v as s, u as t, s as u };
