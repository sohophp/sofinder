import { SoFinderSdkError, type SoFinderClientOptions, type UploadTask, type UploadTaskSnapshot } from "./sdk";
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
export declare const uploadForEditor: (file: File, options: EditorAdapterOptions, source?: "input" | "paste" | "drop") => UploadTask;
export declare const altFor: (asset: AssetReference, options: EditorAdapterOptions) => string;
export declare const attributesFor: (asset: AssetReference, options: EditorAdapterOptions) => Record<string, string>;
export declare const imageHtml: (asset: AssetReference, options: EditorAdapterOptions) => string;
export interface CkeditorLoader {
    file: Promise<File>;
    uploaded?: number;
    uploadTotal?: number;
}
export declare const createCkeditor5UploadPlugin: (options: EditorAdapterOptions) => (editor: {
    plugins: {
        get(name: "FileRepository"): {
            createUploadAdapter: (loader: CkeditorLoader) => {
                upload(): Promise<Record<string, string>>;
                abort(): void;
            };
        };
    };
}) => void;
export declare const tinyMceImagesUploadHandler: (options: EditorAdapterOptions) => (blobInfo: {
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
}, options: EditorAdapterOptions) => (() => void);
export declare const bindMarkdownUploads: (input: HTMLTextAreaElement, options: EditorAdapterOptions) => (() => void);
export declare const bindAssetInput: (fileInput: HTMLInputElement, output: HTMLInputElement | HTMLTextAreaElement, options: EditorAdapterOptions, outputMode?: "url" | "json") => (() => void);
