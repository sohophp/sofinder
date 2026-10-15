import { a as e, i as t, n, o as r, r as i, s as a, t as o } from "./defineProperty-DqgXQJ_v.js";
//#region src/api.ts
var s = (e) => /^1(?:\.|$)/.test(e), c = class extends Error {
	constructor(e, t, n) {
		super(e), o(this, "code", void 0), o(this, "status", void 0), this.code = t, this.status = n, this.name = "ApiError";
	}
}, l = class {
	constructor(e) {
		o(this, "config", void 0), o(this, "base", void 0), o(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = e, this.base = e.apiBase.replace(/\/config$/, "");
	}
	async configData() {
		let e = await this.request("/config");
		if (!s(e.apiVersion)) throw new c(`SoFinder UI requires API 1.x; server reported ${e.apiVersion || "an unknown version"}.`, "incompatible_api_version", 426);
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
		return n !== void 0 && i.set("ttl", String(n)), this.request(`/signed-url?${i}`, { method: "POST" });
	}
	shareLink(e, t) {
		return this.request(`/share-link?${new URLSearchParams({
			resource: e,
			path: t
		})}`, { method: "POST" });
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
	upload(e, t, n, i = {}) {
		if (n.size > 5e6) return this.chunkUpload(e, t, n, i);
		let a = new FormData();
		return a.set("resource", e), a.set("path", t), a.set("upload", n), i.overwrite && a.set("overwrite", "1"), i.autoRename && a.set("autoRename", "1"), this.sendUpload("/uploads", a, i, (e) => {
			i.onProgress?.(r(n.size * e, n.size)), e === 1 && i.onProcessing?.();
		}).then((e) => (i.onProgress?.(100), e));
	}
	async sendUpload(e, t, r, o) {
		let s;
		try {
			s = await i(this.base + e, t, this.config.csrfToken, {
				signal: r.signal,
				credentials: e === "/uploads" ? "include" : "same-origin",
				onProgress: o
			});
		} catch (e) {
			throw e instanceof n ? new c(e.message, "network_error", 0) : e;
		}
		let l;
		try {
			l = JSON.parse(s.text);
		} catch {
			throw new c(a(s.status, s.text, s.contentType), "invalid_response", s.status);
		}
		if (s.status < 200 || s.status >= 300 || !l.success || !l.data) throw new c(l.error?.message || `Request failed (${s.status})`, l.error?.code || "upload_failed", s.status);
		return l.data;
	}
	async chunkUpload(n, i, a, o) {
		let s = 4e6, l = Math.ceil(a.size / s), u = this.findPendingUpload(n, i, a, !!o.overwrite, !!o.autoRename, l), d = u?.id || crypto.randomUUID(), f = u || {
			id: d,
			scope: this.base,
			resource: n,
			path: i,
			name: a.name,
			size: a.size,
			lastModified: a.lastModified,
			total: l,
			overwrite: !!o.overwrite,
			autoRename: !!o.autoRename,
			updatedAt: Date.now()
		};
		this.savePendingUpload({
			...f,
			updatedAt: Date.now()
		});
		let p = () => {
			fetch(`${this.base}/uploads/chunks/${encodeURIComponent(d)}`, {
				method: "DELETE",
				headers: { "X-CSRF-TOKEN": this.config.csrfToken },
				credentials: "same-origin",
				keepalive: !0
			}).catch(() => {});
		};
		o.signal?.addEventListener("abort", p, { once: !0 });
		try {
			let p = /* @__PURE__ */ new Set();
			if (u) try {
				let t = await this.request(`/uploads/chunks/${encodeURIComponent(d)}`);
				p = e(t.received, l);
			} catch (e) {
				if (!(e instanceof c) || e.status !== 404) throw e;
				return this.removePendingUpload(d), this.chunkUpload(n, i, a, o);
			}
			let m = t(p, a.size, s);
			o.onProgress?.(r(m, a.size));
			for (let e = 0; e < l; e++) {
				if (o.signal?.aborted) throw new DOMException("The upload was cancelled.", "AbortError");
				if (p.has(e)) continue;
				let t = new FormData();
				t.set("resource", n), t.set("path", i), t.set("name", a.name), t.set("uploadId", d), t.set("index", String(e)), t.set("total", String(l)), o.overwrite && t.set("overwrite", "1"), o.autoRename && t.set("autoRename", "1");
				let c = a.slice(e * s, Math.min(a.size, (e + 1) * s));
				t.set("chunk", c, `${a.name}.part`);
				let u = await this.sendUpload("/uploads/chunks", t, o, (e) => {
					o.onProgress?.(r(m + c.size * e, a.size)), e === 1 && m + c.size === a.size && o.onProcessing?.();
				});
				if (m += c.size, o.onProgress?.(r(m, a.size)), this.savePendingUpload({
					...f,
					updatedAt: Date.now()
				}), u.complete && u.entry) return this.removePendingUpload(d), o.onProgress?.(100), { entry: u.entry };
			}
			throw new c("The chunk upload did not complete.", "chunk_incomplete", 500);
		} catch (e) {
			throw e instanceof c && e.status >= 400 && e.status < 500 && this.removePendingUpload(d), e;
		} finally {
			o.signal?.removeEventListener("abort", p), o.signal?.aborted && this.removePendingUpload(d);
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
	discardPendingUpload(e) {
		this.pendingUploads().some((t) => t.id === e) && (this.removePendingUpload(e), fetch(`${this.base}/uploads/chunks/${encodeURIComponent(e)}`, {
			method: "DELETE",
			headers: { "X-CSRF-TOKEN": this.config.csrfToken },
			credentials: "same-origin",
			keepalive: !0
		}).catch(() => {}));
	}
	findPendingUpload(e, t, n, r, i = !1, a) {
		return this.pendingUploads().find((o) => o.resource === e && o.path === t && o.name === n.name && o.size === n.size && o.lastModified === n.lastModified && o.overwrite === r && o.autoRename === i && (a === void 0 || o.total === a));
	}
	savePendingUpload(e) {
		let t = this.readAllPendingUploads().filter((t) => t.id !== e.id);
		t.push(e), localStorage.setItem(this.uploadStorageKey, JSON.stringify(t.slice(-50)));
	}
	removePendingUpload(e) {
		localStorage.setItem(this.uploadStorageKey, JSON.stringify(this.readAllPendingUploads().filter((t) => t.id !== e || t.scope !== this.base)));
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
		let n = await fetch(this.base + "/archive", {
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
		if (!n.ok) {
			let e = await this.jsonResponse(n, "archive_failed");
			throw new c(e.error?.message || `Request failed (${n.status})`, e.error?.code || "archive_failed", n.status);
		}
		return n.blob();
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
		let n = new Headers(t.headers);
		n.set("Accept", "application/json"), !(t.body instanceof FormData) && t.body !== void 0 && n.set("Content-Type", "application/json"), t.method && t.method !== "GET" && n.set("X-CSRF-TOKEN", this.config.csrfToken);
		let r = await fetch(this.base + e, {
			...t,
			headers: n,
			credentials: "same-origin"
		}), i = await this.jsonResponse(r, "request_failed");
		if (!r.ok || !i.success || !i.data) throw new c(i.error?.message || `Request failed (${r.status})`, i.error?.code || "request_failed", r.status);
		return i.data;
	}
	async jsonResponse(e, t) {
		let n = await e.text();
		try {
			return JSON.parse(n);
		} catch {
			throw new c(a(e.status, n, e.headers.get("Content-Type") || ""), t, e.status);
		}
	}
};
//#endregion
export { c as n, l as t };
