import { t as e } from "./defineProperty-B_lfzbVN.js";
//#region src/api.ts
var t = (e) => /^1(?:\.|$)/.test(e), n = class extends Error {
	constructor(t, n, r) {
		super(t), e(this, "code", void 0), e(this, "status", void 0), this.code = n, this.status = r, this.name = "ApiError";
	}
}, r = class {
	constructor(t) {
		e(this, "config", void 0), e(this, "base", void 0), e(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = t, this.base = t.apiBase.replace(/\/config$/, "");
	}
	async configData() {
		let e = await this.request("/config");
		if (!t(e.apiVersion)) throw new n(`SoFinder UI requires API 1.x; server reported ${e.apiVersion || "an unknown version"}.`, "incompatible_api_version", 426);
		return e;
	}
	securityStatus() {
		return this.request("/security/status");
	}
	resolveAsset(e, t) {
		return this.request(`/assets/resolve?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	asset(e) {
		return this.request(`/assets/${encodeURIComponent(e)}`);
	}
	updateAssetMetadata(e, t) {
		return this.request(`/assets/${encodeURIComponent(e)}/metadata`, {
			method: "PATCH",
			body: JSON.stringify(t)
		});
	}
	searchAssets(e) {
		let t = new URLSearchParams();
		return e.keyword && t.set("q", e.keyword), e.resources?.length && t.set("resources", e.resources.join(",")), e.path && t.set("path", e.path), e.fields?.length && t.set("fields", e.fields.join(",")), e.tags?.length && t.set("tags", e.tags.join(",")), e.extensions?.length && t.set("extensions", e.extensions.join(",")), e.type && e.type !== "all" && t.set("type", e.type), e.minimumSize !== void 0 && t.set("minSize", String(e.minimumSize)), e.maximumSize !== void 0 && t.set("maxSize", String(e.maximumSize)), e.modifiedAfter !== void 0 && t.set("modifiedAfter", String(e.modifiedAfter)), e.modifiedBefore !== void 0 && t.set("modifiedBefore", String(e.modifiedBefore)), t.set("offset", String(e.offset ?? 0)), t.set("limit", String(e.limit ?? 50)), this.request(`/assets/search?${t}`);
	}
	assetUsages(e) {
		return this.request(`/assets/${encodeURIComponent(e)}/usages`);
	}
	registerAssetUsage(e, t, n) {
		return this.request(`/assets/${encodeURIComponent(e)}/usages/${encodeURIComponent(t)}`, {
			method: "PUT",
			body: JSON.stringify(n)
		});
	}
	removeAssetUsage(e, t) {
		return this.request(`/assets/${encodeURIComponent(e)}/usages/${encodeURIComponent(t)}`, { method: "DELETE" });
	}
	checkAssetDeletion(e, t) {
		return this.request("/assets/delete-check", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				paths: t
			})
		});
	}
	createAssetAccessSession(e, t) {
		return this.request("/assets/access-sessions", {
			method: "POST",
			body: JSON.stringify({
				assetIds: e,
				ttl: t
			})
		});
	}
	revokeAssetAccessSession(e) {
		return this.request(`/assets/access-sessions/${encodeURIComponent(e)}`, { method: "DELETE" });
	}
	prepareDocumentPreview(e, t, n = !1) {
		return this.request("/preview/document/jobs", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				path: t,
				retry: n
			})
		});
	}
	documentPreviewJob(e) {
		return this.request(`/preview/document/jobs/${encodeURIComponent(e)}`);
	}
	signedUrl(e, t, n, r = "attachment") {
		let i = new URLSearchParams({
			resource: e,
			path: t,
			disposition: r
		});
		return n !== void 0 && i.set("ttl", String(n)), this.request(`/signed-url?${i}`);
	}
	list(e, t, n = "", r = "name", i = "asc", a = 0, o = 100, s = "name", c = null) {
		let l = new URLSearchParams({
			resource: e,
			path: t,
			search: n,
			searchMode: s,
			sort: r,
			direction: i,
			offset: String(a),
			limit: String(o)
		});
		return c !== null && l.set("cursor", c), this.request(`/entries?${l}`);
	}
	createFolder(e, t, n) {
		return this.request("/folders", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				path: t,
				name: n
			})
		});
	}
	rename(e, t, n) {
		return this.request("/entries/rename", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				name: n
			})
		});
	}
	remove(e, t) {
		return this.request("/entries", {
			method: "DELETE",
			body: JSON.stringify({
				resource: e,
				path: t
			})
		});
	}
	transfer(e, t, n, r) {
		return this.request(`/entries/${e}`, {
			method: "POST",
			body: JSON.stringify({
				resource: t,
				path: n,
				destination: r,
				autoRename: !0
			})
		});
	}
	batch(e, t, n, r = "") {
		return this.request("/entries/batch", {
			method: "POST",
			body: JSON.stringify({
				operation: e,
				resource: t,
				paths: n,
				destination: r,
				autoRename: !0
			})
		});
	}
	batchRename(e, t) {
		return this.request("/entries/batch-rename", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				renames: t
			})
		});
	}
	upload(e, t, r, i = {}) {
		if (r.size > 5e6) return this.chunkUpload(e, t, r, i);
		let a = new FormData();
		return a.set("resource", e), a.set("path", t), a.set("upload", r), i.overwrite && a.set("overwrite", "1"), i.autoRename && a.set("autoRename", "1"), new Promise((e, t) => {
			let r = new XMLHttpRequest(), o = () => r.abort(), s = () => i.signal?.removeEventListener("abort", o);
			if (r.open("POST", this.base + "/uploads"), r.withCredentials = !0, r.setRequestHeader("Accept", "application/json"), r.setRequestHeader("X-CSRF-TOKEN", this.config.csrfToken), r.upload.addEventListener("progress", (e) => {
				e.lengthComputable && i.onProgress?.(Math.min(100, Math.round(e.loaded / e.total * 100)));
			}), r.addEventListener("load", () => {
				s();
				let a;
				try {
					a = JSON.parse(r.responseText);
				} catch {
					t(new n(`Request failed (${r.status})`, "invalid_response", r.status));
					return;
				}
				if (r.status < 200 || r.status >= 300 || !a.success || !a.data) {
					t(new n(a.error?.message || `Request failed (${r.status})`, a.error?.code || "upload_failed", r.status));
					return;
				}
				i.onProgress?.(100), e(a.data);
			}), r.addEventListener("error", () => {
				s(), t(new n("The upload failed because of a network error.", "network_error", 0));
			}), r.addEventListener("abort", () => {
				s(), t(new DOMException("The upload was cancelled.", "AbortError"));
			}), i.signal?.addEventListener("abort", o, { once: !0 }), i.signal?.aborted) {
				o();
				return;
			}
			r.send(a);
		});
	}
	async chunkUpload(e, t, r, i) {
		let a = 4e6, o = Math.ceil(r.size / a), s = this.findPendingUpload(e, t, r, !!i.overwrite, !!i.autoRename, o), c = s?.id || crypto.randomUUID(), l = s || {
			id: c,
			scope: this.base,
			resource: e,
			path: t,
			name: r.name,
			size: r.size,
			lastModified: r.lastModified,
			total: o,
			overwrite: !!i.overwrite,
			autoRename: !!i.autoRename,
			updatedAt: Date.now()
		};
		this.savePendingUpload({
			...l,
			updatedAt: Date.now()
		});
		let u = () => {
			fetch(`${this.base}/uploads/chunks/${encodeURIComponent(c)}`, {
				method: "DELETE",
				headers: { "X-CSRF-TOKEN": this.config.csrfToken },
				credentials: "same-origin",
				keepalive: !0
			});
		};
		i.signal?.addEventListener("abort", u, { once: !0 });
		try {
			let u = /* @__PURE__ */ new Set();
			if (s) try {
				let e = await this.request(`/uploads/chunks/${encodeURIComponent(c)}`);
				u = new Set(e.received), u.size >= o && u.delete(o - 1);
			} catch (a) {
				if (!(a instanceof n) || a.status !== 404) throw a;
				return this.removePendingUpload(c), this.chunkUpload(e, t, r, i);
			}
			for (let s = 0; s < o; s++) {
				if (i.signal?.aborted) throw new DOMException("The upload was cancelled.", "AbortError");
				if (u.has(s)) {
					i.onProgress?.(Math.round((s + 1) / o * 100));
					continue;
				}
				let d = new FormData();
				d.set("resource", e), d.set("path", t), d.set("name", r.name), d.set("uploadId", c), d.set("index", String(s)), d.set("total", String(o)), i.overwrite && d.set("overwrite", "1"), i.autoRename && d.set("autoRename", "1"), d.set("chunk", r.slice(s * a, Math.min(r.size, (s + 1) * a)), `${r.name}.part`);
				let f = await fetch(this.base + "/uploads/chunks", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"X-CSRF-TOKEN": this.config.csrfToken
					},
					body: d,
					credentials: "same-origin",
					signal: i.signal
				}), p = await f.json();
				if (!f.ok || !p.success || !p.data) throw new n(p.error?.message || `Request failed (${f.status})`, p.error?.code || "upload_failed", f.status);
				if (i.onProgress?.(Math.round((s + 1) / o * 100)), this.savePendingUpload({
					...l,
					updatedAt: Date.now()
				}), p.data.complete && p.data.entry) return this.removePendingUpload(c), { entry: p.data.entry };
			}
			throw new n("The chunk upload did not complete.", "chunk_incomplete", 500);
		} catch (e) {
			throw e instanceof n && e.status >= 400 && e.status < 500 && this.removePendingUpload(c), e;
		} finally {
			i.signal?.removeEventListener("abort", u), i.signal?.aborted && this.removePendingUpload(c);
		}
	}
	pendingUploads() {
		try {
			let e = JSON.parse(localStorage.getItem(this.uploadStorageKey) || "[]");
			return Array.isArray(e) ? e.filter((e) => e.scope === this.base && Date.now() - e.updatedAt < 864e5).map((e) => ({
				...e,
				autoRename: e.autoRename === !0
			})) : [];
		} catch {
			return [];
		}
	}
	findPendingUpload(e, t, n, r, i = !1, a) {
		return this.pendingUploads().find((o) => o.resource === e && o.path === t && o.name === n.name && o.size === n.size && o.lastModified === n.lastModified && o.overwrite === r && o.autoRename === i && (a === void 0 || o.total === a));
	}
	savePendingUpload(e) {
		let t = this.readAllPendingUploads().filter((t) => t.id !== e.id);
		t.push(e), localStorage.setItem(this.uploadStorageKey, JSON.stringify(t.slice(-50)));
	}
	removePendingUpload(e) {
		localStorage.setItem(this.uploadStorageKey, JSON.stringify(this.readAllPendingUploads().filter((t) => t.id !== e)));
	}
	readAllPendingUploads() {
		try {
			let e = JSON.parse(localStorage.getItem(this.uploadStorageKey) || "[]");
			return Array.isArray(e) ? e : [];
		} catch {
			return [];
		}
	}
	downloadUrl(e, t) {
		return `${this.base}/download?${new URLSearchParams({
			resource: e,
			path: t
		})}`;
	}
	contentUrl(e, t) {
		return `${this.base}/content?${new URLSearchParams({
			resource: e,
			path: t,
			disposition: "inline"
		})}`;
	}
	textPreview(e, t) {
		return this.request(`/preview/text?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	checksum(e, t) {
		return this.request(`/checksum?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	thumbnailUrl(e, t, n = 240, r = 180) {
		return `${this.base}/images/thumbnail?${new URLSearchParams({
			resource: e,
			path: t.path,
			width: String(n),
			height: String(r),
			v: `${t.modifiedAt}-${t.size}`
		})}`;
	}
	imageInfo(e, t) {
		return this.request(`/images/info?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	editImage(e, t, n = 0, r = 0, i = 0) {
		return this.request("/images/edit", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				rotation: n,
				width: r,
				height: i
			})
		});
	}
	cropImage(e, t, n, r, i, a) {
		return this.request("/images/edit", {
			method: "PATCH",
			body: JSON.stringify({
				operation: "crop",
				resource: e,
				path: t,
				x: n,
				y: r,
				width: i,
				height: a
			})
		});
	}
	applyImageActions(e, t, n, r) {
		return this.request("/images/edit", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				actions: n,
				save: r
			})
		});
	}
	applyImageBatch(e, t, n, r) {
		return this.request("/images/batch", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				paths: t,
				actions: n,
				save: r
			})
		});
	}
	trash(e, t = 0, n = 50, r = "") {
		return this.request(`/trash?${new URLSearchParams({
			resource: e,
			offset: String(t),
			limit: String(n),
			search: r
		})}`);
	}
	restoreTrash(e, t, n = "cancel") {
		return this.request(`/trash/${encodeURIComponent(t)}/restore`, {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				conflict: n
			})
		});
	}
	permanentlyDeleteTrash(e, t) {
		return this.request(`/trash/${encodeURIComponent(t)}`, {
			method: "DELETE",
			body: JSON.stringify({ resource: e })
		});
	}
	async downloadArchive(e, t) {
		let r = await fetch(this.base + "/archive", {
			method: "POST",
			headers: {
				Accept: "application/zip, application/json",
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": this.config.csrfToken
			},
			credentials: "same-origin",
			body: JSON.stringify({
				resource: e,
				paths: t
			})
		});
		if (!r.ok) {
			let e = await r.json();
			throw new n(e.error?.message || `Request failed (${r.status})`, e.error?.code || "archive_failed", r.status);
		}
		return r.blob();
	}
	async metadata(e) {
		let t = await this.request(`/metadata?${new URLSearchParams({ resource: e })}`), n = t.quickAccess || [];
		return {
			...t,
			quickAccess: n,
			quickAccessEntries: t.quickAccessEntries || n.map((e) => ({
				path: e,
				name: e.split("/").pop() || e,
				directory: null,
				mimeType: null,
				exists: !0
			}))
		};
	}
	async updateMetadata(e, t, n, r = {}) {
		let i = await this.request("/metadata", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				action: n,
				...r
			})
		}), a = i.quickAccess || [];
		return {
			...i,
			quickAccess: a,
			quickAccessEntries: i.quickAccessEntries || a.map((e) => ({
				path: e,
				name: e.split("/").pop() || e,
				directory: null,
				mimeType: null,
				exists: !0
			}))
		};
	}
	async request(e, t = {}) {
		let r = new Headers(t.headers);
		r.set("Accept", "application/json"), !(t.body instanceof FormData) && t.body !== void 0 && r.set("Content-Type", "application/json"), t.method && t.method !== "GET" && r.set("X-CSRF-TOKEN", this.config.csrfToken);
		let i = await fetch(this.base + e, {
			...t,
			headers: r,
			credentials: "same-origin"
		}), a = await i.json();
		if (!i.ok || !a.success || !a.data) throw new n(a.error?.message || `Request failed (${i.status})`, a.error?.code || "request_failed", i.status);
		return a.data;
	}
};
//#endregion
export { n, r as t };
