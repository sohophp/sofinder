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
  if (options.resource) url.searchParams.set("type", options.resource);
  if (options.path) url.searchParams.set("path", options.path);
  if (options.language) url.searchParams.set("lang", options.language);
  if (options.tools) url.searchParams.set("uiTools", options.tools);
  return url;
};

/** Open a same-origin SoFinder picker and resolve with the selected entry. */
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

/** Select an image and insert it through CKEditor 5's public command API. */
export const selectForCkeditor5 = async (editor: { execute(command: string, options: { source: string }): void; editing?: { view?: { focus?: () => void } } }, options: EditorPickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker({ ...options, kind: "image" });
  editor.execute("insertImage", { source: entry.url });
  editor.editing?.view?.focus?.();
  return entry;
};

/** Register a `sofinder` toolbar button and menu item in TinyMCE. */
export const registerTinyMce = (tinymce: { PluginManager: { add(name: string, setup: (editor: any) => object): void } }, options: EditorPickerOptions): void => {
  tinymce.PluginManager.add("sofinder", editor => {
    const choose = async () => {
      const entry = await openPicker({ ...options, kind: "image" });
      editor.insertContent(`<img src="${editor.dom.encode(entry.url)}" alt="${editor.dom.encode(entry.name)}">`);
    };
    editor.ui.registry.addButton("sofinder", { text: "Files", tooltip: "Choose from SoFinder", onAction: choose });
    editor.ui.registry.addMenuItem("sofinder", { text: "Choose from SoFinder", onAction: choose });
    return { getMetadata: () => ({ name: "SoFinder", url: "https://sofinder.sohophp.app/" }) };
  });
};

/** Select an image and insert it through TipTap's Image extension. */
export const selectForTiptap = async (editor: { chain(): { focus(): { setImage(options: { src: string; alt: string }): { run(): unknown } } } }, options: EditorPickerOptions): Promise<PickerEntry> => {
  const entry = await openPicker({ ...options, kind: "image" });
  editor.chain().focus().setImage({ src: entry.url, alt: entry.name }).run();
  return entry;
};

/** Install a SoFinder image handler on a Quill toolbar. */
export const registerQuill = (quill: { getModule(name: "toolbar"): { addHandler(name: string, handler: () => void): void }; getSelection(focus?: boolean): { index: number } | null; insertEmbed(index: number, type: string, value: string, source: string): void }, options: EditorPickerOptions): void => {
  quill.getModule("toolbar").addHandler("image", () => {
    void openPicker({ ...options, kind: "image" }).then(entry => {
      const range = quill.getSelection(true);
      quill.insertEmbed(range?.index ?? 0, "image", entry.url, "user");
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
