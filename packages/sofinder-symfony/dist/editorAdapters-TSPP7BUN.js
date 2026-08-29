import { t as e } from "./defineProperty-B_lfzbVN.js";
import { SoFinderSdkError as t, createSoFinderClient as n } from "./sofinder-sdk.js";
//#region src/assetPresentation.ts
var r = (e, t) => {
	if (!t) return;
	let n = t.trim().toLowerCase();
	if (!n) return;
	if (Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, n)) return e.altTranslations?.[n];
	let r = n.split("-")[0];
	return Object.prototype.hasOwnProperty.call(e.altTranslations ?? {}, r) ? e.altTranslations?.[r] : void 0;
}, i = (e, t = {}) => t.defaultAlt?.(e) ?? r(e, t.locale) ?? e.alt ?? e.name.replace(/\.[^.]+$/, ""), a = (e, t = {}) => {
	let n = {
		src: e.url,
		alt: i(e, t)
	};
	return e.assetId && (n["data-sofinder-asset-id"] = e.assetId), e.width && (n.width = String(e.width)), e.height && (n.height = String(e.height)), e.variants?.length && (n.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), n.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), n;
}, o = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), s = (e, t = {}) => `<img ${Object.entries(a(e, t)).map(([e, t]) => `${e}="${o(t)}"`).join(" ")}>`, c = (e) => typeof e.path == "function" ? e.path() : e.path ?? "", l = (e, t) => {
	let n = t.resourceRouter?.(e).trim();
	if (n) return n;
	let r = e.type.toLowerCase(), i = e.name.includes(".") ? e.name.split(".").pop()?.toLowerCase() ?? "" : "";
	return t.resourceRoutes?.find((e) => e.mimeTypes?.some((e) => e.toLowerCase() === r) || e.extensions?.some((e) => e.replace(/^\./, "").toLowerCase() === i))?.resource ?? t.resource;
}, u = (e, r, i = "input") => {
	let a = n(r).upload({
		file: e,
		resource: l(e, r),
		path: c(r),
		source: i,
		conflictStrategy: r.conflictStrategy ?? "ask"
	});
	return r.onTaskChange && a.subscribe(r.onTaskChange), a.completion.then((e) => r.onAssetReady?.(e)).catch(() => void 0), a.completion.catch((e) => {
		e instanceof t && r.onError?.(e);
	}), a;
}, d = (e, t) => i(e, t), f = (e) => {
	if (!e.capabilities.embeddable || e.url === "") throw new t("asset_not_embeddable", "This resource does not provide a stable embeddable URL.", 422, !1);
	return e;
}, p = (e, t) => a(e, t), m = (e, t) => s(e, t), h = (e, t) => {
	let n = { default: e.url };
	e.width && (n[String(e.width)] = e.url);
	for (let t of e.variants) n[String(t.width)] = t.url;
	let r = {
		urls: n,
		sofinderAlt: d(e, t)
	};
	return e.assetId && (r.sofinderAssetId = e.assetId), e.width && (r.sofinderWidth = e.width), e.height && (r.sofinderHeight = e.height), r;
}, g = (e, t) => {
	let n = e.plugins.get("FileRepository"), r = [
		"sofinderAssetId",
		"sofinderWidth",
		"sofinderHeight"
	];
	if (e.model && e.conversion) {
		for (let t of ["imageBlock", "imageInline"]) e.model.schema.extend(t, { allowAttributes: r });
		for (let t of r) {
			let n = t === "sofinderAssetId" ? "data-sofinder-asset-id" : t.replace("sofinder", "").toLowerCase();
			e.conversion.for("downcast").attributeToAttribute({
				model: t,
				view: n
			}), e.conversion.for("upcast").attributeToAttribute({
				view: n,
				model: t
			});
		}
		e.plugins.get("ImageUploadEditing")?.on?.("uploadComplete", (t, { data: n, imageElement: r }) => e.model?.change((e) => {
			typeof n.sofinderAlt == "string" && e.setAttribute("alt", n.sofinderAlt, r), typeof n.sofinderAssetId == "string" && n.sofinderAssetId !== "" && e.setAttribute("sofinderAssetId", n.sofinderAssetId, r), typeof n.sofinderWidth == "number" && e.setAttribute("sofinderWidth", n.sofinderWidth, r), typeof n.sofinderHeight == "number" && e.setAttribute("sofinderHeight", n.sofinderHeight, r);
		}));
	}
	n.createUploadAdapter = (e) => {
		let n = null;
		return {
			async upload() {
				return n = u(await e.file, {
					...t,
					onTaskChange: (n) => {
						e.uploaded = n.progress, e.uploadTotal = 100, t.onTaskChange?.(n);
					}
				}), h(f(await n.completion), t);
			},
			abort() {
				n?.cancel();
			}
		};
	};
}, _ = (t) => {
	var n;
	return n = class {
		constructor(t) {
			e(this, "editor", void 0), this.editor = t;
		}
		init() {
			g(this.editor, t);
		}
	}, e(n, "pluginName", "SoFinderUpload"), n;
}, v = (e) => async (t, n) => {
	let r = t.blob();
	return f(await u(r instanceof File ? r : new File([r], t.filename(), { type: r.type }), {
		...e,
		onTaskChange: (t) => {
			n(t.progress), e.onTaskChange?.(t);
		}
	}, "paste").completion).url;
}, y = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	return e.on("NodeChange", (r) => {
		let i = r.element instanceof HTMLImageElement ? [r.element] : Array.from(r.element?.querySelectorAll("img") ?? []);
		for (let r of i) {
			let i = n.get(e.dom.getAttrib(r, "src"));
			if (i) {
				for (let [n, a] of Object.entries(p(i, t))) e.dom.setAttrib(r, n, a);
				n.delete(i.url);
			}
		}
	}), v({
		...t,
		onAssetReady: (e) => {
			n.set(e.url, e), t.onAssetReady?.(e);
		}
	});
}, b = async (e, t, n, r = "input") => {
	let i = f(await u(t, n, r).completion);
	return e.chain().focus().setImage(p(i, n)).run(), i;
}, x = (e, t) => {
	let n = (n) => {
		let r = Array.from(n.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), b(e, r, t, "paste"));
	}, r = (n) => {
		let r = Array.from(n.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), b(e, r, t, "drop"));
	};
	return e.view.dom.addEventListener("paste", n), e.view.dom.addEventListener("drop", r), () => {
		e.view.dom.removeEventListener("paste", n), e.view.dom.removeEventListener("drop", r);
	};
}, S = (e, t) => {
	let n = async (n, r) => {
		let i = f(await u(n, t, r).completion), a = e.getSelection(!0)?.index ?? 0;
		e.clipboard ? e.clipboard.dangerouslyPasteHTML(a, m(i, t), "user") : e.insertEmbed(a, "image", i.url, "user");
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
}, C = async (e, t, n, r = "input") => {
	let i = f(await u(e, n, r).completion);
	return t(i.url, d(i, n), ""), i;
}, w = (e) => ({ async customUpload(t, n) {
	await C(t, n, e);
} }), T = (e, t, n) => {
	let r = e.createInside.element("img");
	for (let [e, i] of Object.entries(p(t, n))) r.setAttribute(e, i);
	e.s.insertImage(r);
}, E = (e) => typeof FormData < "u" && e instanceof FormData ? Array.from(e.values()).filter((e) => typeof File < "u" && e instanceof File) : Array.isArray(e) ? e.filter((e) => typeof File < "u" && e instanceof File) : typeof File < "u" && e instanceof File ? [e] : [], D = (e) => ({
	async customUploadFunction(t, n) {
		let r = E(t);
		if (r.length === 0) throw Error("Jodit did not provide a file to upload.");
		let i = [];
		for (let t = 0; t < r.length; t += 1) {
			let a = u(r[t], {
				...e,
				onTaskChange: (i) => {
					n(Math.round((t + i.progress / 100) / r.length * 100)), e.onTaskChange?.(i);
				}
			});
			i.push(f(await a.completion));
		}
		return n(100), {
			success: !0,
			data: { assets: i }
		};
	},
	isSuccess(e) {
		return e.success;
	},
	process(e) {
		return e.data;
	},
	defaultHandlerSuccess(t) {
		let n = this.j ?? this.jodit ?? this;
		if (!n.createInside || !n.s) throw Error("Jodit uploader context does not expose an editor instance.");
		for (let r of t.assets) T(n, r, e);
	}
}), O = (e, t) => {
	let n = async (n, r) => {
		let i = f(await u(n, t, r).completion), a = `![${d(i, t).replace(/([\\\[\]])/g, "\\$1")}](<${i.url.replace(/</g, "%3C").replace(/>/g, "%3E")}>)`;
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
}, k = (e, t, n, r = "url") => {
	let i = async () => {
		let i = e.files?.[0];
		if (!i) return;
		let a = await u(i, n).completion;
		t.value = r === "json" ? JSON.stringify(a) : f(a).url, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	};
	return e.addEventListener("change", i), () => e.removeEventListener("change", i);
};
//#endregion
export { D as a, m as c, v as d, u as f, _ as i, S as l, C as m, k as n, y as o, b as p, O as r, w as s, p as t, x as u };
