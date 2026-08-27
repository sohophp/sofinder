export const PICKER_PROTOCOL_VERSION = "1.0" as const;

export interface PickerEntry {
  resource: string;
  path: string;
  name: string;
  directory: boolean;
  size: number;
  modifiedAt: number;
  mimeType: string | null;
  url: string;
  width: number | null;
  height: number | null;
  capabilities: Record<string, boolean>;
  schemaVersion?: "1.0";
  assetId?: string | null;
  version?: string;
  downloadUrl?: string | null;
  alt?: string | null;
  altTranslations?: Record<string, string>;
  variants?: Array<{ width: number; height: number; url: string; mimeType: string }>;
}

export interface PickerOptions {
  baseUrl: string;
  kind?: "any" | "file" | "image";
  resource?: string;
  path?: string;
  language?: "en" | "zh-cn" | "zh-tw";
  tools?: "common" | "full";
  width?: number;
  height?: number;
  windowName?: string;
  defaultAlt?: (asset: PickerEntry) => string;
  sizes?: string | ((asset: PickerEntry) => string);
}

export interface PickerMessage {
  type: "sofinder:select";
  version: typeof PICKER_PROTOCOL_VERSION;
  requestId: string;
  entry: PickerEntry;
}

const requestId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `sf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export const pickerUrl = (options: PickerOptions, id = requestId()): URL => {
  const url = new URL(options.baseUrl, window.location.href);
  url.searchParams.set("select", "1");
  url.searchParams.set("uiMode", "picker");
  url.searchParams.set("selection", options.kind ?? "any");
  url.searchParams.set("pickerRequestId", id);
  url.searchParams.set("pickerOrigin", window.location.origin);
  if (options.resource) url.searchParams.set("type", options.resource);
  if (options.path) url.searchParams.set("path", options.path);
  if (options.language) url.searchParams.set("lang", options.language);
  if (options.tools) url.searchParams.set("uiTools", options.tools);
  return url;
};

/** Open a SoFinder picker and resolve with the selected entry after strict source, origin and request validation. */
export const openPicker = (options: PickerOptions): Promise<PickerEntry> => {
  const id = requestId();
  const url = pickerUrl(options, id);
  const width = Math.max(640, options.width ?? 1100);
  const height = Math.max(480, options.height ?? 760);
  const popup = window.open(url, options.windowName ?? "sofinder-picker", `popup=yes,width=${width},height=${height},resizable=yes,scrollbars=yes`);
  if (!popup) return Promise.reject(new Error("SoFinder picker was blocked by the browser."));

  return new Promise<PickerEntry>((resolve, reject) => {
    let closedTimer = 0;
    const cleanup = () => {
      window.removeEventListener("message", receive);
      if (closedTimer) window.clearInterval(closedTimer);
    };
    const receive = (event: MessageEvent<unknown>) => {
      const message = event.data as Partial<PickerMessage> | null;
      if (event.source !== popup || event.origin !== url.origin || message?.type !== "sofinder:select" || message.version !== PICKER_PROTOCOL_VERSION || message.requestId !== id || !validEntry(message.entry)) return;
      cleanup();
      resolve(message.entry);
    };
    window.addEventListener("message", receive);
    closedTimer = window.setInterval(() => {
      if (!popup.closed) return;
      cleanup();
      reject(new DOMException("The SoFinder picker was closed.", "AbortError"));
    }, 300);
  });
};

const validEntry = (value: unknown): value is PickerEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<PickerEntry>;
  return typeof entry.resource === "string" && entry.resource !== ""
    && typeof entry.path === "string" && typeof entry.name === "string"
    && entry.directory === false && typeof entry.size === "number"
    && typeof entry.modifiedAt === "number" && typeof entry.url === "string" && entry.url !== ""
    && (entry.mimeType === null || typeof entry.mimeType === "string")
    && (entry.width === null || typeof entry.width === "number")
    && (entry.height === null || typeof entry.height === "number")
    && typeof entry.capabilities === "object" && entry.capabilities !== null;
};

type EditorPickerOptions = Omit<PickerOptions, "kind">;

const pickerAlt = (entry: PickerEntry, options: PickerOptions): string => {
  const locale = options.language?.toLowerCase();
  const localized = locale && Object.prototype.hasOwnProperty.call(entry.altTranslations ?? {}, locale)
    ? entry.altTranslations?.[locale]
    : locale && Object.prototype.hasOwnProperty.call(entry.altTranslations ?? {}, locale.split("-")[0])
      ? entry.altTranslations?.[locale.split("-")[0]]
      : undefined;
  return options.defaultAlt?.(entry) ?? localized ?? entry.alt ?? entry.name.replace(/\.[^.]+$/, "");
};
const pickerAttributes = (entry: PickerEntry, options: PickerOptions): Record<string, string> => {
  const attributes: Record<string, string> = { src: entry.url, alt: pickerAlt(entry, options) };
  if (entry.assetId) attributes["data-sofinder-asset-id"] = entry.assetId;
  if (entry.width) attributes.width = String(entry.width);
  if (entry.height) attributes.height = String(entry.height);
  if (entry.variants?.length) {
    attributes.srcset = entry.variants.map(variant => `${variant.url} ${variant.width}w`).join(", ");
    attributes.sizes = typeof options.sizes === "function" ? options.sizes(entry) : options.sizes ?? (entry.width ? `(max-width: ${entry.width}px) 100vw, ${entry.width}px` : "100vw");
  }
  return attributes;
};
const pickerImageHtml = (entry: PickerEntry, options: PickerOptions): string => {
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<img ${Object.entries(pickerAttributes(entry, options)).map(([name, value]) => `${name}="${escape(value)}"`).join(" ")}>`;
};

/** Select an image and insert it through CKEditor 5's public command API. */
interface Ckeditor5PickerEditor {
  execute(command: string, options: Record<string, unknown>): void;
  commands?: { get(name: string): unknown };
  editing?: { view?: { focus?: () => void } };
  model?: { document: { selection: { getSelectedElement(): unknown } }; change(callback: (writer: { setAttribute(name: string, value: unknown, item: unknown): void }) => void): void };
}

const applyCkeditorAsset = (editor: Ckeditor5PickerEditor, entry: PickerEntry): void => {
  const element = editor.model?.document.selection.getSelectedElement(); if (!element || !editor.model) return;
  editor.model.change(writer => {
    writer.setAttribute("url", entry.url, element);
    if (entry.assetId) writer.setAttribute("sofinderAssetId", entry.assetId, element);
    if (entry.width) writer.setAttribute("sofinderWidth", entry.width, element);
    if (entry.height) writer.setAttribute("sofinderHeight", entry.height, element);
  });
};

export const selectForCkeditor5 = async (editor: Ckeditor5PickerEditor, options: EditorPickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker({ ...options, kind: "image" });
  editor.execute("insertImage", { source: entry.url });
  applyCkeditorAsset(editor, entry);
  if (!editor.commands || editor.commands.get("imageTextAlternative")) editor.execute("imageTextAlternative", { newValue: pickerAlt(entry, options) });
  editor.editing?.view?.focus?.();
  return entry;
};

/** Replace the selected CKEditor 5 image while preserving a stable SoFinder relationship. */
export const replaceSelectedForCkeditor5 = async (editor: Ckeditor5PickerEditor, options: EditorPickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker({ ...options, kind: "image" });
  const selected = editor.model?.document.selection.getSelectedElement();
  if (selected && editor.model) applyCkeditorAsset(editor, entry); else editor.execute("insertImage", { source: entry.url });
  if (!editor.commands || editor.commands.get("imageTextAlternative")) editor.execute("imageTextAlternative", { newValue: pickerAlt(entry, options) });
  editor.editing?.view?.focus?.(); return entry;
};

/** Register a `sofinder` toolbar button and menu item in TinyMCE. */
export const registerTinyMce = (tinymce: { PluginManager: { add(name: string, setup: (editor: any) => object): void } }, options: EditorPickerOptions): void => {
  tinymce.PluginManager.add("sofinder", editor => {
    const choose = async () => {
      const entry = await openPicker({ ...options, kind: "image" });
      editor.insertContent(pickerImageHtml(entry, options));
    };
    editor.ui.registry.addButton("sofinder", { text: "Files", tooltip: "Choose from SoFinder", onAction: choose });
    editor.ui.registry.addMenuItem("sofinder", { text: "Choose from SoFinder", onAction: choose });
    return { getMetadata: () => ({ name: "SoFinder", url: "https://sofinder.sohophp.app/" }) };
  });
};

/** Select an image and insert it through TipTap's Image extension. */
export const selectForTiptap = async (editor: { chain(): { focus(): { setImage(options: Record<string, string>): { run(): unknown } } } }, options: EditorPickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker({ ...options, kind: "image" });
  editor.chain().focus().setImage(pickerAttributes(entry, options)).run();
  return entry;
};

/** Install a SoFinder image handler on a Quill toolbar. */
export const registerQuill = (quill: { getModule(name: "toolbar"): { addHandler(name: string, handler: () => void): void }; getSelection(focus?: boolean): { index: number } | null; insertEmbed(index: number, type: string, value: string, source: string): void; clipboard?: { dangerouslyPasteHTML(index: number, html: string, source: string): void } }, options: EditorPickerOptions): void => {
  quill.getModule("toolbar").addHandler("image", () => {
    void openPicker({ ...options, kind: "image" }).then(entry => {
      const range = quill.getSelection(true);
      if (quill.clipboard) quill.clipboard.dangerouslyPasteHTML(range?.index ?? 0, pickerImageHtml(entry, options), "user");
      else quill.insertEmbed(range?.index ?? 0, "image", entry.url, "user");
    });
  });
};

/** Bind a picker result to a plain URL input and emit normal input/change events. */
export const selectForInput = async (input: HTMLInputElement, options: PickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker(options);
  input.value = entry.url;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return entry;
};

/** Insert a Markdown image or link at the current textarea selection. */
export const selectForMarkdown = async (input: HTMLTextAreaElement, options: PickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker(options);
  const image = options.kind === "image" || entry.mimeType?.startsWith("image/") === true;
  const label = (image ? pickerAlt(entry, options) : entry.name).replace(/([\\\[\]])/g, "\\$1");
  const destination = entry.url.replace(/</g, "%3C").replace(/>/g, "%3E");
  const markdown = `${image ? "!" : ""}[${label}](<${destination}>)`;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  input.setRangeText(markdown, start, end, "end");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  input.focus();
  return entry;
};
