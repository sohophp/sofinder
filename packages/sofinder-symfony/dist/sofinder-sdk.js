import { a as e, i as t, n, o as r, r as i, s as a, t as o } from "./defineProperty-DqgXQJ_v.js";
//#region src/sdk.ts
var s = class extends Error {
	constructor(e, t, n = 0, r = n === 0 || n >= 500) {
		super(t), o(this, "code", void 0), o(this, "status", void 0), o(this, "retryable", void 0), this.code = e, this.status = n, this.retryable = r, this.name = "SoFinderSdkError";
	}
}, c = (e) => ({ upload(t) {
	return new l(e, t);
} }), l = class {
	constructor(e, t) {
		o(this, "options", void 0), o(this, "request", void 0), o(this, "id", typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : `sf-${Date.now()}-${Math.random().toString(36).slice(2)}`), o(this, "source", void 0), o(this, "file", void 0), o(this, "status", "queued"), o(this, "progress", 0), o(this, "result", null), o(this, "error", null), o(this, "listeners", /* @__PURE__ */ new Set()), o(this, "controller", null), o(this, "chunkUploadStarted", !1), o(this, "completion", void 0), this.options = e, this.request = t, this.file = t.file, this.source = t.source ?? "input", this.completion = this.run();
	}
	cancel() {
		this.controller?.abort(), this.file.size > (this.options.chunkThreshold ?? 5e6) && this.discardChunkSession(), this.status = "canceled", this.emit();
	}
	retry() {
		return ["failed", "canceled"].includes(this.status) ? (this.error = null, this.progress = 0, this.status = "queued", this.completion = this.run(), this.completion) : this.completion;
	}
	subscribe(e) {
		return this.listeners.add(e), e(this.snapshot()), () => this.listeners.delete(e);
	}
	then(e, t) {
		return this.completion.then(e, t);
	}
	async run() {
		this.controller = new AbortController(), this.status = "uploading", this.emit();
		try {
			let e = this.request.conflictStrategy ?? "ask", t;
			try {
				t = await this.send(e);
			} catch (n) {
				if (n instanceof s && n.status === 409 && e === "skip") throw new s("upload_skipped", "A file with the same name was skipped.", 409, !1);
				if (!(n instanceof s) || n.status !== 409 || e !== "ask") throw n;
				let r = await (this.options.onConflict?.(this.file) ?? h(this.file, this.options.conflictLabels));
				if (r === "cancel") throw new s("upload_canceled", "Upload canceled.", 0, !1);
				if (r === "skip") throw new s("upload_skipped", "A file with the same name was skipped.", 409, !1);
				e = r, t = await this.send(e);
			}
			let n = t.asset ?? m(this.request.resource, t.entry, this.options.apiBase);
			return this.result = n, this.status = "ready", this.progress = 100, this.emit(), n;
		} catch (e) {
			let t = e instanceof s ? e : e instanceof DOMException && e.name === "AbortError" ? new s("upload_canceled", "Upload canceled.", 0, !1) : new s("upload_failed", e instanceof Error ? e.message : "Upload failed.");
			throw this.status = t.code === "upload_canceled" ? "canceled" : "failed", this.error = {
				code: t.code,
				message: t.message,
				retryable: t.retryable
			}, this.emit(), t;
		}
	}
	async send(e) {
		this.status = "uploading", this.progress = 0, this.emit();
		let t = this.options.chunkThreshold ?? 5e6;
		return this.file.size > t ? this.sendChunks(e) : this.sendWhole(e);
	}
	async sendWhole(e) {
		let t = await d(this.options.csrfToken), n = f(this.request, e);
		return this.post("/uploads", n, t, 0, this.file.size);
	}
	async post(e, t, a, o, c) {
		try {
			let n = await i(u(this.options.apiBase) + e, t, a, {
				signal: this.controller?.signal,
				credentials: e === "/uploads" ? this.options.credentials === "omit" ? "omit" : "include" : this.options.credentials ?? "same-origin",
				onProgress: (e) => {
					this.progress = r(o + c * e, this.file.size), e === 1 && o + c === this.file.size && (this.status = "processing"), this.emit();
				}
			});
			return await p(n.text, n.status);
		} catch (e) {
			throw e instanceof n ? new s("network_error", e.message) : e;
		}
	}
	async sendChunks(n) {
		let i = await d(this.options.csrfToken), a = this.options.chunkSize ?? 4e6, o = Math.ceil(this.file.size / a), c = this.id.replace(/[^A-Za-z0-9_-]/g, "-"), l = `${u(this.options.apiBase)}/uploads/chunks/${encodeURIComponent(c)}`, p = this.chunkUploadStarted ? e([...await this.receivedChunks(l)], o) : /* @__PURE__ */ new Set(), m = t(p, this.file.size, a);
		this.progress = r(m, this.file.size), this.emit();
		for (let e = 0; e < o; e++) {
			if (this.controller?.signal.aborted) throw new DOMException("Upload canceled.", "AbortError");
			if (p.has(e)) continue;
			let t = f(this.request, n, !1);
			t.set("name", this.file.name), t.set("uploadId", c), t.set("index", String(e)), t.set("total", String(o));
			let s = this.file.slice(e * a, Math.min(this.file.size, (e + 1) * a));
			t.set("chunk", s, `${this.file.name}.part`), this.chunkUploadStarted = !0;
			let l = await this.post("/uploads/chunks", t, i, m, s.size);
			if (m += s.size, this.progress = r(m, this.file.size), this.emit(), l.complete && l.entry) return {
				entry: l.entry,
				asset: l.asset
			};
		}
		throw new s("chunk_incomplete", "The chunk upload did not complete.", 500);
	}
	async receivedChunks(e) {
		let t = await fetch(e, {
			headers: { Accept: "application/json" },
			credentials: this.options.credentials ?? "same-origin",
			signal: this.controller?.signal
		});
		if (t.status === 404) return /* @__PURE__ */ new Set();
		let n = await p(await t.text(), t.status);
		return new Set(n.received);
	}
	async discardChunkSession() {
		let e = await d(this.options.csrfToken), t = this.id.replace(/[^A-Za-z0-9_-]/g, "-");
		await fetch(`${u(this.options.apiBase)}/uploads/chunks/${encodeURIComponent(t)}`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"X-CSRF-TOKEN": e
			},
			credentials: this.options.credentials ?? "same-origin",
			keepalive: !0
		}).catch(() => void 0);
	}
	snapshot() {
		return {
			id: this.id,
			source: this.source,
			status: this.status,
			progress: this.progress,
			file: this.file,
			result: this.result,
			error: this.error
		};
	}
	emit() {
		let e = this.snapshot();
		this.listeners.forEach((t) => t(e));
	}
}, u = (e) => e.replace(/\/config$/, "").replace(/\/$/, ""), d = async (e) => typeof e == "function" ? e() : e, f = (e, t, n = !0) => {
	let r = new FormData();
	return r.set("resource", e.resource), r.set("path", e.path ?? ""), n && r.set("upload", e.file), t === "overwrite" && r.set("overwrite", "1"), t === "rename" && r.set("autoRename", "1"), r;
}, p = async (e, t) => {
	let n;
	try {
		n = JSON.parse(e);
	} catch {
		throw new s("invalid_response", a(t, e), t);
	}
	if (t < 200 || t >= 300 || !n.success || !n.data) throw new s(n.error?.code ?? "upload_failed", n.error?.message ?? `Request failed (${t}).`, t);
	return n.data;
}, m = (e, t, n) => ({
	schemaVersion: "1.0",
	assetId: null,
	resource: e,
	path: t.path,
	name: t.name,
	directory: !1,
	mimeType: t.mimeType,
	size: t.size,
	modifiedAt: t.modifiedAt,
	version: `${t.modifiedAt}-${t.size}`,
	url: t.url ?? "",
	downloadUrl: `${u(n)}/download?${new URLSearchParams({
		resource: e,
		path: t.path
	})}`,
	width: null,
	height: null,
	alt: null,
	variants: [],
	capabilities: {
		...t.capabilities,
		embeddable: !!t.url,
		responsiveImages: !1,
		assetMetadata: !1
	}
}), h = (e, t) => typeof document > "u" ? Promise.resolve("cancel") : new Promise((n) => {
	let r = document.activeElement instanceof HTMLElement ? document.activeElement : null, i = document.documentElement.lang.toLowerCase(), a = i.startsWith("zh-tw") || i.startsWith("zh-hk") ? {
		title: `「${e.name}」已存在`,
		hint: "請選擇 SoFinder 處理此次上傳的方式。",
		rename: "自動改名",
		overwrite: "覆寫",
		skip: "略過",
		cancel: "取消"
	} : i.startsWith("zh") ? {
		title: `“${e.name}”已存在`,
		hint: "请选择 SoFinder 处理本次上传的方式。",
		rename: "自动改名",
		overwrite: "覆盖",
		skip: "跳过",
		cancel: "取消"
	} : {
		title: `“${e.name}” already exists`,
		hint: "Choose how SoFinder should handle this upload.",
		rename: "Rename",
		overwrite: "Overwrite",
		skip: "Skip",
		cancel: "Cancel"
	};
	Object.assign(a, t);
	let o = document.createElement("div");
	o.setAttribute("role", "presentation"), Object.assign(o.style, {
		position: "fixed",
		inset: "0",
		background: "rgba(15,23,42,.45)",
		zIndex: "2147483647",
		display: "grid",
		placeItems: "center",
		padding: "20px"
	});
	let s = document.createElement("div");
	s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.setAttribute("aria-label", "Upload conflict"), Object.assign(s.style, {
		background: "white",
		color: "#172033",
		borderRadius: "12px",
		padding: "20px",
		width: "min(440px,100%)",
		boxShadow: "0 20px 60px rgba(0,0,0,.25)"
	});
	let c = document.createElement("strong");
	c.textContent = a.title;
	let l = document.createElement("p");
	l.textContent = a.hint;
	let u = document.createElement("div");
	Object.assign(u.style, {
		display: "flex",
		gap: "8px",
		flexWrap: "wrap",
		justifyContent: "flex-end"
	});
	let d = (e) => {
		o.remove(), r?.focus(), n(e);
	};
	[
		[a.rename, "rename"],
		[a.overwrite, "overwrite"],
		[a.skip, "skip"],
		[a.cancel, "cancel"]
	].forEach(([e, t]) => {
		let n = document.createElement("button");
		n.type = "button", n.textContent = e, n.onclick = () => d(t), u.append(n);
	}), s.append(c, l, u), o.append(s), document.body.append(o), u.firstElementChild?.focus(), o.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			e.preventDefault(), d("cancel");
			return;
		}
		if (e.key !== "Tab") return;
		let t = Array.from(u.querySelectorAll("button"));
		if (!t.length) return;
		let n = t[0], r = t[t.length - 1];
		e.shiftKey && document.activeElement === n ? (e.preventDefault(), r.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n.focus());
	});
});
//#endregion
export { s as SoFinderSdkError, c as createSoFinderClient };
