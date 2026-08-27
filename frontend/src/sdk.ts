import type { AssetReference, Entry, ImageVariant, UploadConflictStrategy } from "./types";

export type UploadTaskStatus = "queued" | "uploading" | "processing" | "ready" | "failed" | "canceled";
export type UploadSource = "picker" | "input" | "paste" | "drop";
export type ConflictResolution = Exclude<UploadConflictStrategy, "ask"> | "cancel";

export interface SoFinderSdkErrorShape { code: string; message: string; retryable: boolean }

export class SoFinderSdkError extends Error {
  constructor(public readonly code: string, message: string, public readonly status = 0, public readonly retryable = status === 0 || status >= 500) {
    super(message);
    this.name = "SoFinderSdkError";
  }
}

export interface UploadTaskSnapshot {
  id: string;
  source: UploadSource;
  status: UploadTaskStatus;
  progress: number;
  file: File;
  result: AssetReference | null;
  error: SoFinderSdkErrorShape | null;
}

export interface UploadTask extends UploadTaskSnapshot {
  readonly completion: Promise<AssetReference>;
  cancel(): void;
  retry(): Promise<AssetReference>;
  subscribe(listener: (task: UploadTaskSnapshot) => void): () => void;
}

export interface SoFinderClientOptions {
  apiBase: string;
  csrfToken: string | (() => Promise<string>);
  credentials?: RequestCredentials;
  chunkThreshold?: number;
  chunkSize?: number;
  onConflict?: (file: File) => ConflictResolution | Promise<ConflictResolution>;
  conflictLabels?: Partial<{ title: string; hint: string; rename: string; overwrite: string; skip: string; cancel: string }>;
}

export interface UploadRequest {
  file: File;
  resource: string;
  path?: string;
  source?: UploadSource;
  conflictStrategy?: UploadConflictStrategy;
}

interface UploadPayload { entry: Entry; asset?: AssetReference }
interface ApiPayload<T> { success: boolean; data?: T; error?: { code?: string; message?: string } }

export interface SoFinderClient { upload(request: UploadRequest): UploadTask }

export const createSoFinderClient = (options: SoFinderClientOptions): SoFinderClient => ({
  upload(request) { return new BrowserUploadTask(options, request); },
});

class BrowserUploadTask implements UploadTask {
  readonly id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sf-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  readonly source: UploadSource;
  readonly file: File;
  status: UploadTaskStatus = "queued";
  progress = 0;
  result: AssetReference | null = null;
  error: SoFinderSdkErrorShape | null = null;
  private readonly listeners = new Set<(task: UploadTaskSnapshot) => void>();
  private controller: AbortController | null = null;
  completion: Promise<AssetReference>;

  constructor(private readonly options: SoFinderClientOptions, private readonly request: UploadRequest) {
    this.file = request.file;
    this.source = request.source ?? "input";
    this.completion = this.run();
  }

  cancel(): void {
    this.controller?.abort();
    if (this.file.size > (this.options.chunkThreshold ?? 5_000_000)) void this.discardChunkSession();
    this.status = "canceled";
    this.emit();
  }

  retry(): Promise<AssetReference> {
    if (!(["failed", "canceled"] as UploadTaskStatus[]).includes(this.status)) return this.completion;
    this.error = null; this.progress = 0; this.status = "queued";
    this.completion = this.run();
    return this.completion;
  }

  subscribe(listener: (task: UploadTaskSnapshot) => void): () => void {
    this.listeners.add(listener); listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  then<TResult1 = AssetReference, TResult2 = never>(onfulfilled?: ((value: AssetReference) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2> {
    return this.completion.then(onfulfilled, onrejected);
  }

  private async run(): Promise<AssetReference> {
    this.controller = new AbortController();
    this.status = "uploading"; this.emit();
    try {
      let strategy = this.request.conflictStrategy ?? "ask";
      let payload: UploadPayload;
      try { payload = await this.send(strategy); }
      catch (error) {
        if (error instanceof SoFinderSdkError && error.status === 409 && strategy === "skip") throw new SoFinderSdkError("upload_skipped", "A file with the same name was skipped.", 409, false);
        if (!(error instanceof SoFinderSdkError) || error.status !== 409 || strategy !== "ask") throw error;
        const resolution = await (this.options.onConflict?.(this.file) ?? defaultConflictDialog(this.file, this.options.conflictLabels));
        if (resolution === "cancel") throw new SoFinderSdkError("upload_canceled", "Upload canceled.", 0, false);
        if (resolution === "skip") throw new SoFinderSdkError("upload_skipped", "A file with the same name was skipped.", 409, false);
        strategy = resolution;
        payload = await this.send(strategy);
      }
      this.status = "processing"; this.progress = 100; this.emit();
      const asset = payload.asset ?? assetFromEntry(this.request.resource, payload.entry, this.options.apiBase);
      this.result = asset; this.status = "ready"; this.emit();
      return asset;
    } catch (error) {
      const sdkError = error instanceof SoFinderSdkError ? error : error instanceof DOMException && error.name === "AbortError"
        ? new SoFinderSdkError("upload_canceled", "Upload canceled.", 0, false)
        : new SoFinderSdkError("upload_failed", error instanceof Error ? error.message : "Upload failed.");
      this.status = sdkError.code === "upload_canceled" ? "canceled" : "failed";
      this.error = { code: sdkError.code, message: sdkError.message, retryable: sdkError.retryable };
      this.emit();
      throw sdkError;
    }
  }

  private async send(strategy: UploadConflictStrategy): Promise<UploadPayload> {
    const threshold = this.options.chunkThreshold ?? 5_000_000;
    return this.file.size > threshold ? this.sendChunks(strategy) : this.sendWhole(strategy);
  }

  private async sendWhole(strategy: UploadConflictStrategy): Promise<UploadPayload> {
    const token = await csrf(this.options.csrfToken);
    const form = uploadForm(this.request, strategy);
    return new Promise<UploadPayload>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const abort = () => xhr.abort();
      this.controller?.signal.addEventListener("abort", abort, { once: true });
      xhr.open("POST", base(this.options.apiBase) + "/uploads");
      xhr.withCredentials = this.options.credentials !== "omit";
      xhr.setRequestHeader("Accept", "application/json"); xhr.setRequestHeader("X-CSRF-TOKEN", token);
      xhr.upload.onprogress = event => { if (event.lengthComputable) { this.progress = Math.min(99, Math.round(event.loaded / event.total * 100)); this.emit(); } };
      xhr.onerror = () => reject(new SoFinderSdkError("network_error", "The upload failed because of a network error."));
      xhr.onabort = () => reject(new DOMException("Upload canceled.", "AbortError"));
      xhr.onload = () => parsePayload<UploadPayload>(xhr.responseText, xhr.status).then(resolve, reject);
      xhr.send(form);
    });
  }

  private async sendChunks(strategy: UploadConflictStrategy): Promise<UploadPayload> {
    const token = await csrf(this.options.csrfToken);
    const chunkSize = this.options.chunkSize ?? 4_000_000;
    const total = Math.ceil(this.file.size / chunkSize);
    const uploadId = this.id.replace(/[^A-Za-z0-9_-]/g, "-");
    const endpoint = `${base(this.options.apiBase)}/uploads/chunks/${encodeURIComponent(uploadId)}`;
    const received = await this.receivedChunks(endpoint);
    for (let index = 0; index < total; index++) {
      if (received.has(index)) { this.progress = Math.round((index + 1) / total * 100); this.emit(); continue; }
      const form = uploadForm(this.request, strategy, false);
      form.set("name", this.file.name); form.set("uploadId", uploadId); form.set("index", String(index)); form.set("total", String(total));
      form.set("chunk", this.file.slice(index * chunkSize, Math.min(this.file.size, (index + 1) * chunkSize)), `${this.file.name}.part`);
      const response = await fetch(base(this.options.apiBase) + "/uploads/chunks", { method: "POST", headers: { Accept: "application/json", "X-CSRF-TOKEN": token }, credentials: this.options.credentials ?? "same-origin", body: form, signal: this.controller?.signal });
      const payload = await parsePayload<{ complete: boolean; entry?: Entry; asset?: AssetReference }>(await response.text(), response.status);
      this.progress = Math.round((index + 1) / total * 100); this.emit();
      if (payload.complete && payload.entry) return { entry: payload.entry, asset: payload.asset };
    }
    throw new SoFinderSdkError("chunk_incomplete", "The chunk upload did not complete.", 500);
  }

  private async receivedChunks(endpoint: string): Promise<Set<number>> {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" }, credentials: this.options.credentials ?? "same-origin", signal: this.controller?.signal });
    if (response.status === 404) return new Set();
    const payload = await parsePayload<{ received: number[] }>(await response.text(), response.status);
    return new Set(payload.received);
  }

  private async discardChunkSession(): Promise<void> {
    const token = await csrf(this.options.csrfToken);
    const uploadId = this.id.replace(/[^A-Za-z0-9_-]/g, "-");
    await fetch(`${base(this.options.apiBase)}/uploads/chunks/${encodeURIComponent(uploadId)}`, { method: "DELETE", headers: { Accept: "application/json", "X-CSRF-TOKEN": token }, credentials: this.options.credentials ?? "same-origin", keepalive: true }).catch(() => undefined);
  }

  private snapshot(): UploadTaskSnapshot { return { id: this.id, source: this.source, status: this.status, progress: this.progress, file: this.file, result: this.result, error: this.error }; }
  private emit(): void { const snapshot = this.snapshot(); this.listeners.forEach(listener => listener(snapshot)); }
}

const base = (value: string) => value.replace(/\/config$/, "").replace(/\/$/, "");
const csrf = async (value: SoFinderClientOptions["csrfToken"]): Promise<string> => typeof value === "function" ? value() : value;

const uploadForm = (request: UploadRequest, strategy: UploadConflictStrategy, includeFile = true): FormData => {
  const form = new FormData(); form.set("resource", request.resource); form.set("path", request.path ?? "");
  if (includeFile) form.set("upload", request.file);
  if (strategy === "overwrite") form.set("overwrite", "1");
  if (strategy === "rename") form.set("autoRename", "1");
  return form;
};

const parsePayload = async <T>(text: string, status: number): Promise<T> => {
  let payload: ApiPayload<T>;
  try { payload = JSON.parse(text) as ApiPayload<T>; }
  catch { throw new SoFinderSdkError("invalid_response", `Request failed (${status}).`, status); }
  if (status < 200 || status >= 300 || !payload.success || !payload.data) throw new SoFinderSdkError(payload.error?.code ?? "upload_failed", payload.error?.message ?? `Request failed (${status}).`, status);
  return payload.data;
};

const assetFromEntry = (resource: string, entry: Entry, apiBase: string): AssetReference => ({
  schemaVersion: "1.0", assetId: null, resource, path: entry.path, name: entry.name, directory: false,
  mimeType: entry.mimeType, size: entry.size, modifiedAt: entry.modifiedAt, version: `${entry.modifiedAt}-${entry.size}`,
  url: entry.url ?? "", downloadUrl: `${base(apiBase)}/download?${new URLSearchParams({ resource, path: entry.path })}`,
  width: null, height: null, alt: null, variants: [] as ImageVariant[],
  capabilities: { ...entry.capabilities, embeddable: Boolean(entry.url), responsiveImages: false, assetMetadata: false },
});

const defaultConflictDialog = (file: File, custom: SoFinderClientOptions["conflictLabels"]): Promise<ConflictResolution> => {
  if (typeof document === "undefined") return Promise.resolve("cancel");
  return new Promise(resolve => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const language = document.documentElement.lang.toLowerCase();
    const copy = language.startsWith("zh-tw") || language.startsWith("zh-hk")
      ? { title: `「${file.name}」已存在`, hint: "請選擇 SoFinder 處理此次上傳的方式。", rename: "自動改名", overwrite: "覆寫", skip: "略過", cancel: "取消" }
      : language.startsWith("zh")
        ? { title: `“${file.name}”已存在`, hint: "请选择 SoFinder 处理本次上传的方式。", rename: "自动改名", overwrite: "覆盖", skip: "跳过", cancel: "取消" }
        : { title: `“${file.name}” already exists`, hint: "Choose how SoFinder should handle this upload.", rename: "Rename", overwrite: "Overwrite", skip: "Skip", cancel: "Cancel" };
    Object.assign(copy, custom);
    const backdrop = document.createElement("div"); backdrop.setAttribute("role", "presentation");
    Object.assign(backdrop.style, { position: "fixed", inset: "0", background: "rgba(15,23,42,.45)", zIndex: "2147483647", display: "grid", placeItems: "center", padding: "20px" });
    const dialog = document.createElement("div"); dialog.setAttribute("role", "dialog"); dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-label", "Upload conflict");
    Object.assign(dialog.style, { background: "white", color: "#172033", borderRadius: "12px", padding: "20px", width: "min(440px,100%)", boxShadow: "0 20px 60px rgba(0,0,0,.25)" });
    const title = document.createElement("strong"); title.textContent = copy.title;
    const hint = document.createElement("p"); hint.textContent = copy.hint;
    const actions = document.createElement("div"); Object.assign(actions.style, { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" });
    const finish = (value: ConflictResolution) => { backdrop.remove(); previousFocus?.focus(); resolve(value); };
    ([[copy.rename, 'rename'], [copy.overwrite, 'overwrite'], [copy.skip, 'skip'], [copy.cancel, 'cancel']] as Array<[string, ConflictResolution]>).forEach(([label, value]) => { const button = document.createElement("button"); button.type = "button"; button.textContent = label; button.onclick = () => finish(value); actions.append(button); });
    dialog.append(title, hint, actions); backdrop.append(dialog); document.body.append(backdrop); (actions.firstElementChild as HTMLButtonElement | null)?.focus();
    backdrop.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); finish("cancel"); return; }
      if (event.key !== "Tab") return;
      const buttons = Array.from(actions.querySelectorAll("button")); if (!buttons.length) return;
      const first = buttons[0]; const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  });
};
