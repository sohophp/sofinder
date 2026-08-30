export declare const PICKER_PROTOCOL_VERSION: "1.0";
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
    variants?: Array<{
        width: number;
        height: number;
        url: string;
        mimeType: string;
    }>;
}
export interface PickerOptions {
    baseUrl: string;
    kind?: "any" | "file" | "image";
    resource?: string;
    /** Lock navigation and results to `resource`; defaults to true. */
    lockResource?: boolean;
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
export declare const pickerUrl: (options: PickerOptions, id?: string) => URL;
/** Open a SoFinder picker and resolve with the selected entry after strict source, origin and request validation. */
export declare const openPicker: (options: PickerOptions) => Promise<PickerEntry>;
type EditorPickerOptions = Omit<PickerOptions, "kind">;
/** Select an image and insert it through CKEditor 5's public command API. */
interface Ckeditor5PickerEditor {
    execute(command: string, options: Record<string, unknown>): void;
    commands?: {
        get(name: string): unknown;
    };
    editing?: {
        view?: {
            focus?: () => void;
        };
    };
    model?: {
        document: {
            selection: {
                getSelectedElement(): unknown;
            };
        };
        change(callback: (writer: {
            setAttribute(name: string, value: unknown, item: unknown): void;
        }) => void): void;
    };
}
export declare const selectForCkeditor5: (editor: Ckeditor5PickerEditor, options: EditorPickerOptions) => Promise<PickerEntry>;
/** Replace the selected CKEditor 5 image while preserving a stable SoFinder relationship. */
export declare const replaceSelectedForCkeditor5: (editor: Ckeditor5PickerEditor, options: EditorPickerOptions) => Promise<PickerEntry>;
/** Register a `sofinder` toolbar button and menu item in TinyMCE. */
export declare const registerTinyMce: (tinymce: {
    PluginManager: {
        add(name: string, setup: (editor: any) => object): void;
    };
}, options: EditorPickerOptions) => void;
/** Select an image and insert it through TipTap's Image extension. */
export declare const selectForTiptap: (editor: {
    chain(): {
        focus(): {
            setImage(options: Record<string, string>): {
                run(): unknown;
            };
        };
    };
}, options: EditorPickerOptions) => Promise<PickerEntry>;
/** Install a SoFinder image handler on a Quill toolbar. */
export declare const registerQuill: (quill: {
    getModule(name: "toolbar"): {
        addHandler(name: string, handler: () => void): void;
    };
    getSelection(focus?: boolean): {
        index: number;
    } | null;
    insertEmbed(index: number, type: string, value: string, source: string): void;
    clipboard?: {
        dangerouslyPasteHTML(index: number, html: string, source: string): void;
    };
}, options: EditorPickerOptions) => void;
export type WangEditorInsertImage = (url: string, alt: string, href: string) => void;
/** Select an image and insert it through wangEditor 5's public node API. */
export declare const selectForWangEditor: (editor: {
    restoreSelection?(): void;
    insertNode(node: Record<string, unknown>): void;
    focus?(): void;
}, options: EditorPickerOptions) => Promise<PickerEntry>;
/** Create the `MENU_CONF.uploadImage` picker hook expected by wangEditor 5. */
export declare const createWangEditorPickerIntegration: (options: EditorPickerOptions) => {
    customBrowseAndUpload(insert: WangEditorInsertImage): void;
};
/** Select an image and insert a fully attributed image through Jodit's public selection API. */
export declare const selectForJodit: (editor: {
    createInside: {
        element(tagName: "img"): HTMLImageElement;
    };
    s: {
        insertImage(image: HTMLImageElement): void;
    };
}, options: EditorPickerOptions) => Promise<PickerEntry>;
/** Bind a picker result to a plain URL input and emit normal input/change events. */
export declare const selectForInput: (input: HTMLInputElement, options: PickerOptions) => Promise<PickerEntry>;
/** Insert a Markdown image or link at the current textarea selection. */
export declare const selectForMarkdown: (input: HTMLTextAreaElement, options: PickerOptions) => Promise<PickerEntry>;
export {};
