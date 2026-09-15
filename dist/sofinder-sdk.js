import { n as e, t } from "./defineProperty-Crj45lTn.js";
//#region src/sdk.ts
var n = class extends Error {
	constructor(e, n, r = 0, i = r === 0 || r >= 500) {
		super(n), t(this, "code", void 0), t(this, "status", void 0), t(this, "retryable", void 0), this.code = e, this.status = r, this.retryable = i, this.name = "SoFinderSdkError";
	}
}, r = (e) => ({ upload(t) {
	return new i(e, t);
} }), i = class {
	constructor(e, n) {
		t(this, "options", void 0), t(this, "request", void 0), t(this, "id", typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : `sf-${Date.now()}-${Math.random().toString(36).slice(2)}`), t(this, "source", void 0), t(this, "file", void 0), t(this, "status", "queued"), t(this, "progress", 0), t(this, "result", null), t(this, "error", null), t(this, "listeners", /* @__PURE__ */ new Set()), t(this, "controller", null), t(this, "completion", void 0), this.options = e, this.request = n, this.file = n.file, this.source = n.source ?? "input", this.completion = this.run();
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
			} catch (r) {
				if (r instanceof n && r.status === 409 && e === "skip") throw new n("upload_skipped", "A file with the same name was skipped.", 409, !1);
				if (!(r instanceof n) || r.status !== 409 || e !== "ask") throw r;
				let i = await (this.options.onConflict?.(this.file) ?? u(this.file, this.options.conflictLabels));
				if (i === "cancel") throw new n("upload_canceled", "Upload canceled.", 0, !1);
				if (i === "skip") throw new n("upload_skipped", "A file with the same name was skipped.", 409, !1);
				e = i, t = await this.send(e);
			}
			this.status = "processing", this.progress = 100, this.emit();
			let r = t.asset ?? l(this.request.resource, t.entry, this.options.apiBase);
			return this.result = r, this.status = "ready", this.emit(), r;
		} catch (e) {
			let t = e instanceof n ? e : e instanceof DOMException && e.name === "AbortError" ? new n("upload_canceled", "Upload canceled.", 0, !1) : new n("upload_failed", e instanceof Error ? e.message : "Upload failed.");
			throw this.status = t.code === "upload_canceled" ? "canceled" : "failed", this.error = {
				code: t.code,
				message: t.message,
				retryable: t.retryable
			}, this.emit(), t;
		}
	}
	async send(e) {
		let t = this.options.chunkThreshold ?? 5e6;
		return this.file.size > t ? this.sendChunks(e) : this.sendWhole(e);
	}
	async sendWhole(e) {
		let t = await o(this.options.csrfToken), r = s(this.request, e);
		return new Promise((e, i) => {
			let o = new XMLHttpRequest();
			this.controller?.signal.addEventListener("abort", () => o.abort(), { once: !0 }), o.open("POST", a(this.options.apiBase) + "/uploads"), o.withCredentials = this.options.credentials !== "omit", o.setRequestHeader("Accept", "application/json"), o.setRequestHeader("X-CSRF-TOKEN", t), o.upload.onprogress = (e) => {
				e.lengthComputable && (this.progress = Math.min(99, Math.round(e.loaded / e.total * 100)), this.emit());
			}, o.onerror = () => i(new n("network_error", "The upload failed because of a network error.")), o.onabort = () => i(new DOMException("Upload canceled.", "AbortError")), o.onload = () => c(o.responseText, o.status).then(e, i), o.send(r);
		});
	}
	async sendChunks(e) {
		let t = await o(this.options.csrfToken), r = this.options.chunkSize ?? 4e6, i = Math.ceil(this.file.size / r), l = this.id.replace(/[^A-Za-z0-9_-]/g, "-"), u = `${a(this.options.apiBase)}/uploads/chunks/${encodeURIComponent(l)}`, d = await this.receivedChunks(u);
		for (let n = 0; n < i; n++) {
			if (d.has(n)) {
				this.progress = Math.round((n + 1) / i * 100), this.emit();
				continue;
			}
			let o = s(this.request, e, !1);
			o.set("name", this.file.name), o.set("uploadId", l), o.set("index", String(n)), o.set("total", String(i)), o.set("chunk", this.file.slice(n * r, Math.min(this.file.size, (n + 1) * r)), `${this.file.name}.part`);
			let u = await fetch(a(this.options.apiBase) + "/uploads/chunks", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"X-CSRF-TOKEN": t
				},
				credentials: this.options.credentials ?? "same-origin",
				body: o,
				signal: this.controller?.signal
			}), f = await c(await u.text(), u.status);
			if (this.progress = Math.round((n + 1) / i * 100), this.emit(), f.complete && f.entry) return {
				entry: f.entry,
				asset: f.asset
			};
		}
		throw new n("chunk_incomplete", "The chunk upload did not complete.", 500);
	}
	async receivedChunks(e) {
		let t = await fetch(e, {
			headers: { Accept: "application/json" },
			credentials: this.options.credentials ?? "same-origin",
			signal: this.controller?.signal
		});
		if (t.status === 404) return /* @__PURE__ */ new Set();
		let n = await c(await t.text(), t.status);
		return new Set(n.received);
	}
	async discardChunkSession() {
		let e = await o(this.options.csrfToken), t = this.id.replace(/[^A-Za-z0-9_-]/g, "-");
		await fetch(`${a(this.options.apiBase)}/uploads/chunks/${encodeURIComponent(t)}`, {
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
}, a = (e) => e.replace(/\/config$/, "").replace(/\/$/, ""), o = async (e) => typeof e == "function" ? e() : e, s = (e, t, n = !0) => {
	let r = new FormData();
	return r.set("resource", e.resource), r.set("path", e.path ?? ""), n && r.set("upload", e.file), t === "overwrite" && r.set("overwrite", "1"), t === "rename" && r.set("autoRename", "1"), r;
}, c = async (t, r) => {
	let i;
	try {
		i = JSON.parse(t);
	} catch {
		throw new n("invalid_response", e(r, t), r);
	}
	if (r < 200 || r >= 300 || !i.success || !i.data) throw new n(i.error?.code ?? "upload_failed", i.error?.message ?? `Request failed (${r}).`, r);
	return i.data;
}, l = (e, t, n) => ({
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
	downloadUrl: `${a(n)}/download?${new URLSearchParams({
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
}), u = (e, t) => typeof document > "u" ? Promise.resolve("cancel") : new Promise((n) => {
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
export { n as SoFinderSdkError, r as createSoFinderClient };
