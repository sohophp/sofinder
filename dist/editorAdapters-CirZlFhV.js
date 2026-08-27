import { SoFinderSdkError as e, createSoFinderClient as t } from "./sofinder-sdk.js";
//#region src/editorAdapters.ts
var n = (e) => typeof e.path == "function" ? e.path() : e.path ?? "", r = (r, i, a = "input") => {
	let o = t(i).upload({
		file: r,
		resource: i.resource,
		path: n(i),
		source: a,
		conflictStrategy: i.conflictStrategy ?? "ask"
	});
	return i.onTaskChange && o.subscribe(i.onTaskChange), o.completion.catch((t) => {
		t instanceof e && i.onError?.(t);
	}), o;
}, i = (e, t) => t.defaultAlt?.(e) ?? e.alt ?? e.name.replace(/\.[^.]+$/, ""), a = (t) => {
	if (!t.capabilities.embeddable || t.url === "") throw new e("asset_not_embeddable", "This resource does not provide a stable embeddable URL.", 422, !1);
	return t;
}, o = (e, t) => {
	let n = {
		src: e.url,
		alt: i(e, t)
	};
	return e.assetId && (n["data-sofinder-asset-id"] = e.assetId), e.width && (n.width = String(e.width)), e.height && (n.height = String(e.height)), e.variants.length && (n.srcset = e.variants.map((e) => `${e.url} ${e.width}w`).join(", "), n.sizes = typeof t.sizes == "function" ? t.sizes(e) : t.sizes ?? (e.width ? `(max-width: ${e.width}px) 100vw, ${e.width}px` : "100vw")), n;
}, s = (e, t) => {
	let n = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return `<img ${Object.entries(o(e, t)).map(([e, t]) => `${e}="${n(t)}"`).join(" ")}>`;
}, c = (e) => (t) => {
	t.plugins.get("FileRepository").createUploadAdapter = (t) => {
		let n = null;
		return {
			async upload() {
				n = r(await t.file, {
					...e,
					onTaskChange: (n) => {
						t.uploaded = n.progress, t.uploadTotal = 100, e.onTaskChange?.(n);
					}
				});
				let i = a(await n.completion), o = { default: i.url };
				for (let e of i.variants) o[String(e.width)] = e.url;
				return o;
			},
			abort() {
				n?.cancel();
			}
		};
	};
}, l = (e) => async (t, n) => {
	let i = t.blob();
	return a(await r(i instanceof File ? i : new File([i], t.filename(), { type: i.type }), {
		...e,
		onTaskChange: (t) => {
			n(t.progress), e.onTaskChange?.(t);
		}
	}, "paste").completion).url;
}, u = async (e, t, n, i = "input") => {
	let s = a(await r(t, n, i).completion);
	return e.chain().focus().setImage(o(s, n)).run(), s;
}, d = (e, t) => {
	let n = (n) => {
		let r = Array.from(n.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), u(e, r, t, "paste"));
	}, r = (n) => {
		let r = Array.from(n.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		r && (n.preventDefault(), u(e, r, t, "drop"));
	};
	return e.view.dom.addEventListener("paste", n), e.view.dom.addEventListener("drop", r), () => {
		e.view.dom.removeEventListener("paste", n), e.view.dom.removeEventListener("drop", r);
	};
}, f = (e, t) => {
	let n = async (n, i) => {
		let o = a(await r(n, t, i).completion);
		e.insertEmbed(e.getSelection(!0)?.index ?? 0, "image", o.url, "user");
	};
	t.toolbarUpload !== !1 && e.getModule("toolbar").addHandler("image", () => {
		let e = document.createElement("input");
		e.type = "file", e.accept = "image/*", e.onchange = () => {
			let t = e.files?.[0];
			t && n(t, "input");
		}, e.click();
	});
	let i = (e) => {
		let t = Array.from(e.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "paste"));
	}, o = (e) => {
		let t = Array.from(e.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "drop"));
	};
	return e.root.addEventListener("paste", i), e.root.addEventListener("drop", o), () => {
		e.root.removeEventListener("paste", i), e.root.removeEventListener("drop", o);
	};
}, p = (e, t) => {
	let n = async (n, o) => {
		let s = a(await r(n, t, o).completion), c = `![${i(s, t).replace(/([\\\[\]])/g, "\\$1")}](<${s.url.replace(/</g, "%3C").replace(/>/g, "%3E")}>)`;
		e.setRangeText(c, e.selectionStart, e.selectionEnd, "end"), e.dispatchEvent(new Event("input", { bubbles: !0 }));
	}, o = (e) => {
		let t = Array.from(e.clipboardData?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "paste"));
	}, s = (e) => {
		let t = Array.from(e.dataTransfer?.files ?? []).find((e) => e.type.startsWith("image/"));
		t && (e.preventDefault(), n(t, "drop"));
	};
	return e.addEventListener("paste", o), e.addEventListener("drop", s), () => {
		e.removeEventListener("paste", o), e.removeEventListener("drop", s);
	};
}, m = (e, t, n, i = "url") => {
	let o = async () => {
		let o = e.files?.[0];
		if (!o) return;
		let s = await r(o, n).completion;
		t.value = i === "json" ? JSON.stringify(s) : a(s).url, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	};
	return e.addEventListener("change", o), () => e.removeEventListener("change", o);
};
//#endregion
export { s as a, l as c, c as i, r as l, m as n, f as o, p as r, d as s, o as t, u };
