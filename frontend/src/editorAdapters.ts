import { altForAsset, attributesForAsset, imageHtmlForAsset } from "./assetPresentation";
import { createSoFinderClient, SoFinderSdkError, type SoFinderClientOptions, type UploadTask, type UploadTaskSnapshot } from "./sdk";
import type { AssetReference, UploadConflictStrategy } from "./types";

export interface EditorAdapterOptions extends Omit<SoFinderClientOptions, "onConflict"> {
  resource: string;
  resourceRoutes?: Array<{ resource: string; mimeTypes?: string[]; extensions?: string[] }>;
  resourceRouter?: (file: File) => string;
  path?: string | (() => string);
  conflictStrategy?: UploadConflictStrategy;
  defaultAlt?: (asset: AssetReference) => string;
  locale?: string;
  sizes?: string | ((asset: AssetReference) => string);
  onConflict?: SoFinderClientOptions["onConflict"];
  onTaskChange?: (task: UploadTaskSnapshot) => void;
  onAssetReady?: (asset: AssetReference) => void;
  onError?: (error: SoFinderSdkError) => void;
  toolbarUpload?: boolean;
}

const path = (options: EditorAdapterOptions): string => typeof options.path === "function" ? options.path() : options.path ?? "";

export const resourceForUpload = (file: File, options: EditorAdapterOptions): string => {
  const custom = options.resourceRouter?.(file).trim(); if (custom) return custom;
  const mime = file.type.toLowerCase(); const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "" : "";
  return options.resourceRoutes?.find(route => route.mimeTypes?.some(value => value.toLowerCase() === mime) || route.extensions?.some(value => value.replace(/^\./, "").toLowerCase() === extension))?.resource ?? options.resource;
};

export const uploadForEditor = (file: File, options: EditorAdapterOptions, source: "input" | "paste" | "drop" = "input"): UploadTask => {
  const client = createSoFinderClient(options);
  const task = client.upload({ file, resource: resourceForUpload(file, options), path: path(options), source, conflictStrategy: options.conflictStrategy ?? "ask" });
  if (options.onTaskChange) task.subscribe(options.onTaskChange);
  void task.completion.then(asset => options.onAssetReady?.(asset)).catch(() => undefined);
  void task.completion.catch(error => { if (error instanceof SoFinderSdkError) options.onError?.(error); });
  return task;
};

export const altFor = (asset: AssetReference, options: EditorAdapterOptions): string => altForAsset(asset, options);

const embeddable = (asset: AssetReference): AssetReference => {
  if (!asset.capabilities.embeddable || asset.url === "") throw new SoFinderSdkError("asset_not_embeddable", "This resource does not provide a stable embeddable URL.", 422, false);
  return asset;
};

export const attributesFor = (asset: AssetReference, options: EditorAdapterOptions): Record<string, string> => attributesForAsset(asset, options);

export const imageHtml = (asset: AssetReference, options: EditorAdapterOptions): string => imageHtmlForAsset(asset, options);

export interface CkeditorLoader {
  file: Promise<File>;
  uploaded?: number;
  uploadTotal?: number;
}

interface Ckeditor5Editor {
  plugins: { get(name: string): any };
  model?: { schema: { extend(name: string, options: { allowAttributes: string[] }): void }; change(callback: (writer: { setAttribute(name: string, value: unknown, item: unknown): void }) => void): void };
  conversion?: { for(direction: string): { attributeToAttribute(definition: object): void } };
}

export interface Ckeditor5UploadPlugin {
  init(): void;
}

export interface Ckeditor5UploadPluginConstructor {
  readonly pluginName: "SoFinderUpload";
  new(editor: Ckeditor5Editor): Ckeditor5UploadPlugin;
}

export const ckeditorUploadResult = (asset: AssetReference, options: EditorAdapterOptions): Record<string, unknown> => {
  const urls: Record<string, string> = { default: asset.url };
  if (asset.width) urls[String(asset.width)] = asset.url;
  for (const variant of asset.variants) urls[String(variant.width)] = variant.url;
  const result: Record<string, unknown> = { urls, sofinderAlt: altFor(asset, options) };
  if (asset.assetId) result.sofinderAssetId = asset.assetId;
  if (asset.width) result.sofinderWidth = asset.width;
  if (asset.height) result.sofinderHeight = asset.height;
  return result;
};

const installCkeditor5UploadAdapter = (editor: Ckeditor5Editor, options: EditorAdapterOptions): void => {
  const repository = editor.plugins.get("FileRepository") as { createUploadAdapter: (loader: CkeditorLoader) => { upload(): Promise<Record<string, unknown>>; abort(): void } };
  const assetAttributes = ["sofinderAssetId", "sofinderWidth", "sofinderHeight"];
  if (editor.model && editor.conversion) {
    for (const modelName of ["imageBlock", "imageInline"]) editor.model.schema.extend(modelName, { allowAttributes: assetAttributes });
    for (const key of assetAttributes) {
      const view = key === "sofinderAssetId" ? "data-sofinder-asset-id" : key.replace("sofinder", "").toLowerCase();
      editor.conversion.for("downcast").attributeToAttribute({ model: key, view });
      editor.conversion.for("upcast").attributeToAttribute({ view, model: key });
    }
    const uploadEditing = editor.plugins.get("ImageUploadEditing") as { on?: (event: string, listener: (_event: unknown, payload: { data: Record<string, unknown>; imageElement: unknown }) => void) => void };
    uploadEditing?.on?.("uploadComplete", (_event, { data, imageElement }) => editor.model?.change(writer => {
      if (typeof data.sofinderAlt === "string") writer.setAttribute("alt", data.sofinderAlt, imageElement);
      if (typeof data.sofinderAssetId === "string" && data.sofinderAssetId !== "") writer.setAttribute("sofinderAssetId", data.sofinderAssetId, imageElement);
      if (typeof data.sofinderWidth === "number") writer.setAttribute("sofinderWidth", data.sofinderWidth, imageElement);
      if (typeof data.sofinderHeight === "number") writer.setAttribute("sofinderHeight", data.sofinderHeight, imageElement);
    }));
  }
  repository.createUploadAdapter = loader => {
    let task: UploadTask | null = null;
    return {
      async upload() {
        const file = await loader.file;
        task = uploadForEditor(file, { ...options, onTaskChange: snapshot => { loader.uploaded = snapshot.progress; loader.uploadTotal = 100; options.onTaskChange?.(snapshot); } });
        const asset = embeddable(await task.completion);
        return ckeditorUploadResult(asset, options);
      },
      abort() { task?.cancel(); },
    };
  };
};

/**
 * Creates a constructible CKEditor 5 plugin for use in `plugins` or
 * `extraPlugins`. CKEditor owns construction and calls `init()` after its
 * required built-in plugins are available.
 */
export const createCkeditor5UploadPlugin = (options: EditorAdapterOptions): Ckeditor5UploadPluginConstructor => class SoFinderUpload {
  static readonly pluginName = "SoFinderUpload";

  constructor(private readonly editor: Ckeditor5Editor) {}

  init(): void {
    installCkeditor5UploadAdapter(this.editor, options);
  }
};

export const tinyMceImagesUploadHandler = (options: EditorAdapterOptions) => async (blobInfo: { blob(): Blob; filename(): string }, progress: (value: number) => void): Promise<string> => {
  const blob = blobInfo.blob();
  const file = blob instanceof File ? blob : new File([blob], blobInfo.filename(), { type: blob.type });
  const task = uploadForEditor(file, { ...options, onTaskChange: snapshot => { progress(snapshot.progress); options.onTaskChange?.(snapshot); } }, "paste");
  return embeddable(await task.completion).url;
};

/**
 * TinyMCE's native upload callback returns only a URL. This integration keeps
 * the corresponding AssetReference until TinyMCE creates the image node, then
 * applies alt, dimensions, srcset and the stable asset ID through public DOM APIs.
 */
export const createTinyMceUploadIntegration = (editor: {
  on(event: string, listener: (event: { element?: Element }) => void): void;
  dom: { getAttrib(node: Element, name: string): string; setAttrib(node: Element, name: string, value: string): void };
}, options: EditorAdapterOptions) => {
  const assets = new Map<string, AssetReference>();
  editor.on("NodeChange", event => {
    const candidates = event.element instanceof HTMLImageElement ? [event.element] : Array.from(event.element?.querySelectorAll("img") ?? []);
    for (const image of candidates) {
      const asset = assets.get(editor.dom.getAttrib(image, "src"));
      if (!asset) continue;
      for (const [name, value] of Object.entries(attributesFor(asset, options))) editor.dom.setAttrib(image, name, value);
      assets.delete(asset.url);
    }
  });
  return tinyMceImagesUploadHandler({ ...options, onAssetReady: asset => { assets.set(asset.url, asset); options.onAssetReady?.(asset); } });
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
  clipboard?: { dangerouslyPasteHTML(index: number, html: string, source: string): void };
}, options: EditorAdapterOptions): (() => void) => {
  const upload = async (file: File, source: "input" | "paste" | "drop") => {
    const asset = embeddable(await uploadForEditor(file, options, source).completion);
    const index = quill.getSelection(true)?.index ?? 0;
    if (quill.clipboard) quill.clipboard.dangerouslyPasteHTML(index, imageHtml(asset, options), "user");
    else quill.insertEmbed(index, "image", asset.url, "user");
  };
  const choose = () => { const input = document.createElement("input"); input.type = "file"; input.accept = "image/*"; input.onchange = () => { const file = input.files?.[0]; if (file) void upload(file, "input"); }; input.click(); };
  if (options.toolbarUpload !== false) quill.getModule("toolbar").addHandler("image", choose);
  const paste = (event: ClipboardEvent) => { const file = Array.from(event.clipboardData?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void upload(file, "paste"); } };
  const drop = (event: DragEvent) => { const file = Array.from(event.dataTransfer?.files ?? []).find(item => item.type.startsWith("image/")); if (file) { event.preventDefault(); void upload(file, "drop"); } };
  quill.root.addEventListener("paste", paste); quill.root.addEventListener("drop", drop);
  return () => { quill.root.removeEventListener("paste", paste); quill.root.removeEventListener("drop", drop); };
};

export type WangEditorInsertImage = (url: string, alt: string, href: string) => void;

/** Upload an image through SoFinder and insert it through wangEditor's public upload callback. */
export const uploadForWangEditor = async (file: File, insert: WangEditorInsertImage, options: EditorAdapterOptions, source: "input" | "paste" | "drop" = "input"): Promise<AssetReference> => {
  const asset = embeddable(await uploadForEditor(file, options, source).completion);
  insert(asset.url, altFor(asset, options), "");
  return asset;
};

/** Create the `MENU_CONF.uploadImage` bridge expected by wangEditor 5. */
export const createWangEditorUploadIntegration = (options: EditorAdapterOptions): { customUpload(file: File, insert: WangEditorInsertImage): Promise<void> } => ({
  async customUpload(file, insert) {
    await uploadForWangEditor(file, insert, options);
  },
});

export interface JoditEditor {
  createInside: { element(tagName: "img"): HTMLImageElement };
  s: { insertImage(image: HTMLImageElement): void };
}

interface JoditUploaderContext {
  j?: JoditEditor;
  jodit?: JoditEditor;
  createInside?: JoditEditor["createInside"];
  s?: JoditEditor["s"];
}

interface JoditUploadAnswer {
  success: boolean;
  data: { assets: AssetReference[] };
}

const insertForJodit = (editor: JoditEditor, asset: AssetReference, options: EditorAdapterOptions): void => {
  const image = editor.createInside.element("img");
  for (const [name, value] of Object.entries(attributesFor(asset, options))) image.setAttribute(name, value);
  editor.s.insertImage(image);
};

const joditFiles = (requestData: unknown): File[] => {
  if (typeof FormData !== "undefined" && requestData instanceof FormData) {
    return Array.from(requestData.values()).filter((value): value is File => typeof File !== "undefined" && value instanceof File);
  }
  if (Array.isArray(requestData)) return requestData.filter((value): value is File => typeof File !== "undefined" && value instanceof File);
  return typeof File !== "undefined" && requestData instanceof File ? [requestData] : [];
};

/**
 * Create the uploader configuration accepted by Jodit 4. The native image
 * dialog, paste and drop paths all use this same uploader contract.
 */
export const createJoditUploadIntegration = (options: EditorAdapterOptions) => ({
  async customUploadFunction(requestData: unknown, showProgress: (progress: number) => void): Promise<JoditUploadAnswer> {
    const files = joditFiles(requestData);
    if (files.length === 0) throw new Error("Jodit did not provide a file to upload.");
    const assets: AssetReference[] = [];
    for (let index = 0; index < files.length; index += 1) {
      const task = uploadForEditor(files[index], {
        ...options,
        onTaskChange: snapshot => {
          showProgress(Math.round(((index + snapshot.progress / 100) / files.length) * 100));
          options.onTaskChange?.(snapshot);
        },
      });
      assets.push(embeddable(await task.completion));
    }
    showProgress(100);
    return { success: true, data: { assets } };
  },
  isSuccess(response: JoditUploadAnswer): boolean { return response.success; },
  process(response: JoditUploadAnswer): JoditUploadAnswer["data"] { return response.data; },
  defaultHandlerSuccess(this: JoditUploaderContext, data: JoditUploadAnswer["data"]): void {
    const editor = this.j ?? this.jodit ?? this;
    if (!editor.createInside || !editor.s) throw new Error("Jodit uploader context does not expose an editor instance.");
    for (const asset of data.assets) insertForJodit(editor as JoditEditor, asset, options);
  },
});

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
