import { createSoFinderClient, SoFinderSdkError, type SoFinderClientOptions, type UploadTask, type UploadTaskSnapshot } from "./sdk";
import type { AssetReference, UploadConflictStrategy } from "./types";

export interface EditorAdapterOptions extends Omit<SoFinderClientOptions, "onConflict"> {
  resource: string;
  path?: string | (() => string);
  conflictStrategy?: UploadConflictStrategy;
  defaultAlt?: (asset: AssetReference) => string;
  sizes?: string | ((asset: AssetReference) => string);
  onConflict?: SoFinderClientOptions["onConflict"];
  onTaskChange?: (task: UploadTaskSnapshot) => void;
  onError?: (error: SoFinderSdkError) => void;
  toolbarUpload?: boolean;
}

const path = (options: EditorAdapterOptions): string => typeof options.path === "function" ? options.path() : options.path ?? "";

export const uploadForEditor = (file: File, options: EditorAdapterOptions, source: "input" | "paste" | "drop" = "input"): UploadTask => {
  const client = createSoFinderClient(options);
  const task = client.upload({ file, resource: options.resource, path: path(options), source, conflictStrategy: options.conflictStrategy ?? "ask" });
  if (options.onTaskChange) task.subscribe(options.onTaskChange);
  void task.completion.catch(error => { if (error instanceof SoFinderSdkError) options.onError?.(error); });
  return task;
};

export const altFor = (asset: AssetReference, options: EditorAdapterOptions): string => options.defaultAlt?.(asset) ?? asset.alt ?? asset.name.replace(/\.[^.]+$/, "");

const embeddable = (asset: AssetReference): AssetReference => {
  if (!asset.capabilities.embeddable || asset.url === "") throw new SoFinderSdkError("asset_not_embeddable", "This resource does not provide a stable embeddable URL.", 422, false);
  return asset;
};

export const attributesFor = (asset: AssetReference, options: EditorAdapterOptions): Record<string, string> => {
  const attributes: Record<string, string> = { src: asset.url, alt: altFor(asset, options) };
  if (asset.assetId) attributes["data-sofinder-asset-id"] = asset.assetId;
  if (asset.width) attributes.width = String(asset.width);
  if (asset.height) attributes.height = String(asset.height);
  if (asset.variants.length) {
    attributes.srcset = asset.variants.map(variant => `${variant.url} ${variant.width}w`).join(", ");
    attributes.sizes = typeof options.sizes === "function" ? options.sizes(asset) : options.sizes ?? (asset.width ? `(max-width: ${asset.width}px) 100vw, ${asset.width}px` : "100vw");
  }
  return attributes;
};

export const imageHtml = (asset: AssetReference, options: EditorAdapterOptions): string => {
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<img ${Object.entries(attributesFor(asset, options)).map(([name, value]) => `${name}="${escape(value)}"`).join(" ")}>`;
};

export interface CkeditorLoader {
  file: Promise<File>;
  uploaded?: number;
  uploadTotal?: number;
}

export const createCkeditor5UploadPlugin = (options: EditorAdapterOptions) => (editor: {
  plugins: { get(name: "FileRepository"): { createUploadAdapter: (loader: CkeditorLoader) => { upload(): Promise<Record<string, string>>; abort(): void } } };
}) => {
  editor.plugins.get("FileRepository").createUploadAdapter = loader => {
    let task: UploadTask | null = null;
    return {
      async upload() {
        const file = await loader.file;
        task = uploadForEditor(file, { ...options, onTaskChange: snapshot => { loader.uploaded = snapshot.progress; loader.uploadTotal = 100; options.onTaskChange?.(snapshot); } });
        const asset = embeddable(await task.completion);
        const result: Record<string, string> = { default: asset.url };
        for (const variant of asset.variants) result[String(variant.width)] = variant.url;
        return result;
      },
      abort() { task?.cancel(); },
    };
  };
};

export const tinyMceImagesUploadHandler = (options: EditorAdapterOptions) => async (blobInfo: { blob(): Blob; filename(): string }, progress: (value: number) => void): Promise<string> => {
  const blob = blobInfo.blob();
  const file = blob instanceof File ? blob : new File([blob], blobInfo.filename(), { type: blob.type });
  const task = uploadForEditor(file, { ...options, onTaskChange: snapshot => { progress(snapshot.progress); options.onTaskChange?.(snapshot); } }, "paste");
  return embeddable(await task.completion).url;
};

export const uploadForTiptap = async (editor: { chain(): { focus(): { setImage(attributes: Record<string, string>): { run(): unknown } } } }, file: File, options: EditorAdapterOptions, source: "input" | "paste" | "drop" = "input"): Promise<AssetReference> => {
  const asset = embeddable(await uploadForEditor(file, options, source).completion);
  editor.chain().focus().setImage(attributesFor(asset, options)).run();
  return asset;
};

export const installTiptapUploads = (editor: { view: { dom: HTMLElement }; chain(): { focus(): { setImage(attributes: Record<string, string>): { run(): unknown } } } }, options: EditorAdapterOptions): (() => void) => {
  const paste = (event: ClipboardEvent) => { const file = Array.from(event.clipboardData?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void uploadForTiptap(editor, file, options, "paste"); } };
  const drop = (event: DragEvent) => { const file = Array.from(event.dataTransfer?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void uploadForTiptap(editor, file, options, "drop"); } };
  editor.view.dom.addEventListener("paste", paste); editor.view.dom.addEventListener("drop", drop);
  return () => { editor.view.dom.removeEventListener("paste", paste); editor.view.dom.removeEventListener("drop", drop); };
};

export const installQuillUploads = (quill: {
  root: HTMLElement;
  getModule(name: "toolbar"): { addHandler(name: string, handler: () => void): void };
  getSelection(focus?: boolean): { index: number } | null;
  insertEmbed(index: number, type: string, value: string, source: string): void;
}, options: EditorAdapterOptions): (() => void) => {
  const upload = async (file: File, source: "input" | "paste" | "drop") => {
    const asset = embeddable(await uploadForEditor(file, options, source).completion);
    quill.insertEmbed(quill.getSelection(true)?.index ?? 0, "image", asset.url, "user");
  };
  const choose = () => { const input = document.createElement("input"); input.type = "file"; input.accept = "image/*"; input.onchange = () => { const file = input.files?.[0]; if (file) void upload(file, "input"); }; input.click(); };
  if (options.toolbarUpload !== false) quill.getModule("toolbar").addHandler("image", choose);
  const paste = (event: ClipboardEvent) => { const file = Array.from(event.clipboardData?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void upload(file, "paste"); } };
  const drop = (event: DragEvent) => { const file = Array.from(event.dataTransfer?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void upload(file, "drop"); } };
  quill.root.addEventListener("paste", paste); quill.root.addEventListener("drop", drop);
  return () => { quill.root.removeEventListener("paste", paste); quill.root.removeEventListener("drop", drop); };
};

export const bindMarkdownUploads = (input: HTMLTextAreaElement, options: EditorAdapterOptions): (() => void) => {
  const insert = async (file: File, source: "paste" | "drop") => {
    const asset = embeddable(await uploadForEditor(file, options, source).completion);
    const markdown = `![${altFor(asset, options).replace(/([\\\[\]])/g, "\\$1")}](<${asset.url.replace(/</g, "%3C").replace(/>/g, "%3E")}>)`;
    input.setRangeText(markdown, input.selectionStart, input.selectionEnd, "end"); input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const paste = (event: ClipboardEvent) => { const file = Array.from(event.clipboardData?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void insert(file, "paste"); } };
  const drop = (event: DragEvent) => { const file = Array.from(event.dataTransfer?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void insert(file, "drop"); } };
  input.addEventListener("paste", paste); input.addEventListener("drop", drop);
  return () => { input.removeEventListener("paste", paste); input.removeEventListener("drop", drop); };
};

export const bindAssetInput = (fileInput: HTMLInputElement, output: HTMLInputElement | HTMLTextAreaElement, options: EditorAdapterOptions, outputMode: "url" | "json" = "url"): (() => void) => {
  const change = async () => { const file = fileInput.files?.[0]; if (!file) return; const asset = await uploadForEditor(file, options).completion; output.value = outputMode === "json" ? JSON.stringify(asset) : embeddable(asset).url; output.dispatchEvent(new Event("input", { bubbles: true })); output.dispatchEvent(new Event("change", { bubbles: true })); };
  fileInput.addEventListener("change", change);
  return () => fileInput.removeEventListener("change", change);
};
