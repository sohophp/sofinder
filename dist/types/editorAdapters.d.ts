import { SoFinderSdkError, type SoFinderClientOptions, type UploadTask, type UploadTaskSnapshot } from "./sdk";
import type { AssetReference, UploadConflictStrategy } from "./types";
export interface EditorAdapterOptions extends Omit<SoFinderClientOptions, "onConflict"> {
    resource: string;
    resourceRoutes?: Array<{
        resource: string;
        mimeTypes?: string[];
        extensions?: string[];
    }>;
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
export declare const resourceForUpload: (file: File, options: EditorAdapterOptions) => string;
export declare const uploadForEditor: (file: File, options: EditorAdapterOptions, source?: "input" | "paste" | "drop") => UploadTask;
export declare const altFor: (asset: AssetReference, options: EditorAdapterOptions) => string;
export declare const attributesFor: (asset: AssetReference, options: EditorAdapterOptions) => Record<string, string>;
export declare const imageHtml: (asset: AssetReference, options: EditorAdapterOptions) => string;
export interface CkeditorLoader {
    file: Promise<File>;
    uploaded?: number;
    uploadTotal?: number;
}
interface Ckeditor5Editor {
    plugins: {
        get(name: string): any;
    };
    model?: {
        schema: {
            extend(name: string, options: {
                allowAttributes: string[];
            }): void;
        };
        change(callback: (writer: {
            setAttribute(name: string, value: unknown, item: unknown): void;
        }) => void): void;
    };
    conversion?: {
        for(direction: string): {
            attributeToAttribute(definition: object): void;
        };
    };
}
export interface Ckeditor5UploadPlugin {
    init(): void;
}
export interface Ckeditor5UploadPluginConstructor {
    readonly pluginName: "SoFinderUpload";
    new (editor: Ckeditor5Editor): Ckeditor5UploadPlugin;
}
export declare const ckeditorUploadResult: (asset: AssetReference, options: EditorAdapterOptions) => Record<string, unknown>;
/**
 * Creates a constructible CKEditor 5 plugin for use in `plugins` or
 * `extraPlugins`. CKEditor owns construction and calls `init()` after its
 * required built-in plugins are available.
 */
export declare const createCkeditor5UploadPlugin: (options: EditorAdapterOptions) => Ckeditor5UploadPluginConstructor;
export declare const tinyMceImagesUploadHandler: (options: EditorAdapterOptions) => (blobInfo: {
    blob(): Blob;
    filename(): string;
}, progress: (value: number) => void) => Promise<string>;
/**
 * TinyMCE's native upload callback returns only a URL. This integration keeps
 * the corresponding AssetReference until TinyMCE creates the image node, then
 * applies alt, dimensions, srcset and the stable asset ID through public DOM APIs.
 */
export declare const createTinyMceUploadIntegration: (editor: {
    on(event: string, listener: (event: {
        element?: Element;
    }) => void): void;
    dom: {
        getAttrib(node: Element, name: string): string;
        setAttrib(node: Element, name: string, value: string): void;
    };
}, options: EditorAdapterOptions) => (blobInfo: {
    blob(): Blob;
    filename(): string;
}, progress: (value: number) => void) => Promise<string>;
export declare const uploadForTiptap: (editor: {
    chain(): {
        focus(): {
            setImage(attributes: Record<string, string>): {
                run(): unknown;
            };
        };
    };
}, file: File, options: EditorAdapterOptions, source?: "input" | "paste" | "drop") => Promise<AssetReference>;
export declare const installTiptapUploads: (editor: {
    view: {
        dom: HTMLElement;
    };
    chain(): {
        focus(): {
            setImage(attributes: Record<string, string>): {
                run(): unknown;
            };
        };
    };
}, options: EditorAdapterOptions) => (() => void);
export declare const installQuillUploads: (quill: {
    root: HTMLElement;
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
}, options: EditorAdapterOptions) => (() => void);
export type WangEditorInsertImage = (url: string, alt: string, href: string) => void;
/** Upload an image through SoFinder and insert it through wangEditor's public upload callback. */
export declare const uploadForWangEditor: (file: File, insert: WangEditorInsertImage, options: EditorAdapterOptions, source?: "input" | "paste" | "drop") => Promise<AssetReference>;
/** Create the `MENU_CONF.uploadImage` bridge expected by wangEditor 5. */
export declare const createWangEditorUploadIntegration: (options: EditorAdapterOptions) => {
    customUpload(file: File, insert: WangEditorInsertImage): Promise<void>;
};
export interface JoditEditor {
    createInside: {
        element(tagName: "img"): HTMLImageElement;
    };
    s: {
        insertImage(image: HTMLImageElement): void;
    };
}
interface JoditUploaderContext {
    j?: JoditEditor;
    jodit?: JoditEditor;
    createInside?: JoditEditor["createInside"];
    s?: JoditEditor["s"];
}
interface JoditUploadAnswer {
    success: boolean;
    data: {
        assets: AssetReference[];
    };
}
/**
 * Create the uploader configuration accepted by Jodit 4. The native image
 * dialog, paste and drop paths all use this same uploader contract.
 */
export declare const createJoditUploadIntegration: (options: EditorAdapterOptions) => {
    customUploadFunction(requestData: unknown, showProgress: (progress: number) => void): Promise<JoditUploadAnswer>;
    isSuccess(response: JoditUploadAnswer): boolean;
    process(response: JoditUploadAnswer): JoditUploadAnswer["data"];
    defaultHandlerSuccess(this: JoditUploaderContext, data: JoditUploadAnswer["data"]): void;
};
export declare const bindMarkdownUploads: (input: HTMLTextAreaElement, options: EditorAdapterOptions) => (() => void);
export declare const bindAssetInput: (fileInput: HTMLInputElement, output: HTMLInputElement | HTMLTextAreaElement, options: EditorAdapterOptions, outputMode?: "url" | "json") => (() => void);
export {};
