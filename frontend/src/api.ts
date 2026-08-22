import type { ApiResponse, BatchResult, Entry, ImageAction, ImageEditResult, ImagePreset, ImageInfo, MetadataState, PluginDescriptor, ResourceType, SoFinderConfig, TrashPage } from "./types";

export class ApiError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

interface UploadOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
  onProgress?: (percentage: number) => void;
}

export class Api {
  private readonly base: string;

  constructor(private readonly config: SoFinderConfig) {
    this.base = config.apiBase.replace(/\/config$/, "");
  }

  configData() { return this.request<{ resources: ResourceType[]; plugins: PluginDescriptor[]; imagePresets: Record<string, ImagePreset> }>("/config"); }

  list(resource: string, path: string, search = "", sort = "name", direction = "asc", offset = 0, limit = 100, searchMode: "name" | "tags" = "name") {
    const query = new URLSearchParams({ resource, path, search, searchMode, sort, direction, offset: String(offset), limit: String(limit) });
    return this.request<{ entries: Entry[]; total: number; path: string; offset: number; limit: number; sort: string; direction: string; capabilities: Record<string, boolean> }>(`/entries?${query}`);
  }

  createFolder(resource: string, path: string, name: string) {
    return this.request<{ entry: Entry }>("/folders", { method: "POST", body: JSON.stringify({ resource, path, name }) });
  }

  rename(resource: string, path: string, name: string) {
    return this.request<{ entry: Entry }>("/entries/rename", { method: "PATCH", body: JSON.stringify({ resource, path, name }) });
  }

  remove(resource: string, path: string) {
    return this.request<Record<string, never>>("/entries", { method: "DELETE", body: JSON.stringify({ resource, path }) });
  }

  transfer(operation: "copy" | "move", resource: string, path: string, destination: string) {
    return this.request<{ entry: Entry }>(`/entries/${operation}`, {
      method: "POST",
      body: JSON.stringify({ resource, path, destination, autoRename: true }),
    });
  }

  batch(operation: "copy" | "move" | "delete", resource: string, paths: string[], destination = "") {
    return this.request<BatchResult>("/entries/batch", {
      method: "POST",
      body: JSON.stringify({ operation, resource, paths, destination, autoRename: true }),
    });
  }

  upload(resource: string, path: string, file: File, options: UploadOptions = {}) {
    if (file.size > 5_000_000) return this.chunkUpload(resource, path, file, options);
    const form = new FormData();
    form.set("resource", resource);
    form.set("path", path);
    form.set("upload", file);
    if (options.overwrite) form.set("overwrite", "1");

    return new Promise<{ entry: Entry }>((resolve, reject) => {
      const request = new XMLHttpRequest();
      const abort = () => request.abort();
      const cleanup = () => options.signal?.removeEventListener("abort", abort);
      request.open("POST", this.base + "/uploads");
      request.withCredentials = true;
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("X-CSRF-TOKEN", this.config.csrfToken);
      request.upload.addEventListener("progress", event => {
        if (event.lengthComputable) options.onProgress?.(Math.min(100, Math.round(event.loaded / event.total * 100)));
      });
      request.addEventListener("load", () => {
        cleanup();
        let payload: ApiResponse<{ entry: Entry }>;
        try {
          payload = JSON.parse(request.responseText) as ApiResponse<{ entry: Entry }>;
        } catch {
          reject(new ApiError(`Request failed (${request.status})`, "invalid_response", request.status));
          return;
        }
        if (request.status < 200 || request.status >= 300 || !payload.success || !payload.data) {
          reject(new ApiError(payload.error?.message || `Request failed (${request.status})`, payload.error?.code || "upload_failed", request.status));
          return;
        }
        options.onProgress?.(100);
        resolve(payload.data);
      });
      request.addEventListener("error", () => {
        cleanup();
        reject(new ApiError("The upload failed because of a network error.", "network_error", 0));
      });
      request.addEventListener("abort", () => {
        cleanup();
        reject(new DOMException("The upload was cancelled.", "AbortError"));
      });
      options.signal?.addEventListener("abort", abort, { once: true });
      if (options.signal?.aborted) {
        abort();
        return;
      }
      request.send(form);
    });
  }

  private async chunkUpload(resource: string, path: string, file: File, options: UploadOptions): Promise<{ entry: Entry }> {
    const chunkSize = 4_000_000;
    const total = Math.ceil(file.size / chunkSize);
    const uploadId = crypto.randomUUID();
    const cancel = () => { void fetch(`${this.base}/uploads/chunks/${encodeURIComponent(uploadId)}`, { method: "DELETE", headers: { "X-CSRF-TOKEN": this.config.csrfToken }, credentials: "same-origin", keepalive: true }); };
    options.signal?.addEventListener("abort", cancel, { once: true });
    try {
      for (let index = 0; index < total; index++) {
        if (options.signal?.aborted) throw new DOMException("The upload was cancelled.", "AbortError");
        const form = new FormData();
        form.set("resource", resource); form.set("path", path); form.set("name", file.name);
        form.set("uploadId", uploadId); form.set("index", String(index)); form.set("total", String(total));
        if (options.overwrite) form.set("overwrite", "1");
        form.set("chunk", file.slice(index * chunkSize, Math.min(file.size, (index + 1) * chunkSize)), `${file.name}.part`);
        const response = await fetch(this.base + "/uploads/chunks", { method: "POST", headers: { "Accept": "application/json", "X-CSRF-TOKEN": this.config.csrfToken }, body: form, credentials: "same-origin", signal: options.signal });
        const payload = await response.json() as ApiResponse<{ complete: boolean; entry?: Entry }>;
        if (!response.ok || !payload.success || !payload.data) throw new ApiError(payload.error?.message || `Request failed (${response.status})`, payload.error?.code || "upload_failed", response.status);
        options.onProgress?.(Math.round((index + 1) / total * 100));
        if (payload.data.complete && payload.data.entry) return { entry: payload.data.entry };
      }
      throw new ApiError("The chunk upload did not complete.", "chunk_incomplete", 500);
    } finally {
      options.signal?.removeEventListener("abort", cancel);
    }
  }

  downloadUrl(resource: string, path: string) {
    return `${this.base}/download?${new URLSearchParams({ resource, path })}`;
  }

  thumbnailUrl(resource: string, entry: Entry, width = 240, height = 180) {
    return `${this.base}/images/thumbnail?${new URLSearchParams({ resource, path: entry.path, width: String(width), height: String(height), v: `${entry.modifiedAt}-${entry.size}` })}`;
  }

  imageInfo(resource: string, path: string) {
    return this.request<ImageInfo>(`/images/info?${new URLSearchParams({ resource, path })}`);
  }

  editImage(resource: string, path: string, rotation = 0, width = 0, height = 0) {
    return this.request<{ entry: Entry }>("/images/edit", {
      method: "PATCH",
      body: JSON.stringify({ resource, path, rotation, width, height }),
    });
  }

  cropImage(resource: string, path: string, x: number, y: number, width: number, height: number) {
    return this.request<{ entry: Entry }>("/images/edit", {
      method: "PATCH",
      body: JSON.stringify({ operation: "crop", resource, path, x, y, width, height }),
    });
  }

  applyImageActions(resource: string, path: string, actions: ImageAction[], save: { mode: "copy" | "overwrite"; name?: string }) {
    return this.request<ImageEditResult>("/images/edit", {
      method: "PATCH",
      body: JSON.stringify({ resource, path, actions, save }),
    });
  }

  trash(resource: string, offset = 0, limit = 50, search = "") {
    return this.request<TrashPage>(`/trash?${new URLSearchParams({ resource, offset: String(offset), limit: String(limit), search })}`);
  }

  restoreTrash(resource: string, id: string, conflict: "cancel" | "overwrite" | "rename" = "cancel") {
    return this.request<{ entry: Entry }>(`/trash/${encodeURIComponent(id)}/restore`, {
      method: "POST",
      body: JSON.stringify({ resource, conflict }),
    });
  }

  permanentlyDeleteTrash(resource: string, id: string) {
    return this.request<Record<string, never>>(`/trash/${encodeURIComponent(id)}`, {
      method: "DELETE",
      body: JSON.stringify({ resource }),
    });
  }

  async downloadArchive(resource: string, paths: string[]) {
    const response = await fetch(this.base + "/archive", {
      method: "POST",
      headers: { "Accept": "application/zip, application/json", "Content-Type": "application/json", "X-CSRF-TOKEN": this.config.csrfToken },
      credentials: "same-origin",
      body: JSON.stringify({ resource, paths }),
    });
    if (!response.ok) {
      const payload = await response.json() as ApiResponse<Record<string, never>>;
      throw new ApiError(payload.error?.message || `Request failed (${response.status})`, payload.error?.code || "archive_failed", response.status);
    }

    return response.blob();
  }

  metadata(resource: string) {
    return this.request<MetadataState>(`/metadata?${new URLSearchParams({ resource })}`);
  }

  updateMetadata(resource: string, path: string, action: "favorite" | "tags" | "touch", values: { favorite?: boolean; tags?: string[] } = {}) {
    return this.request<MetadataState>("/metadata", {
      method: "PATCH",
      body: JSON.stringify({ resource, path, action, ...values }),
    });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (!(init.body instanceof FormData) && init.body !== undefined) headers.set("Content-Type", "application/json");
    if (init.method && init.method !== "GET") headers.set("X-CSRF-TOKEN", this.config.csrfToken);
    const response = await fetch(this.base + path, { ...init, headers, credentials: "same-origin" });
    const payload = await response.json() as ApiResponse<T>;
    if (!response.ok || !payload.success || !payload.data) {
      throw new ApiError(payload.error?.message || `Request failed (${response.status})`, payload.error?.code || "request_failed", response.status);
    }
    return payload.data;
  }
}
