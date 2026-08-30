export interface SoFinderConfig {
    apiBase: string;
    csrfToken: string;
    language: "en" | "zh-cn" | "zh-tw";
    resource: string;
    /** Non-null when picker navigation and results are confined to one resource. */
    pickerResource?: string | null;
    initialPath: string;
    selectMode: boolean;
    selectionKind: "any" | "file" | "image";
    ckeditorFunction: number;
    pickerRequestId: string;
    pickerOrigin: string;
    workspace?: {
        id: string;
        resources: string[];
        options?: Array<{
            id: string;
            label: string;
            url: string;
        }>;
    } | null;
    theme: {
        accent: string;
        background: string;
        panel: string;
        text: string;
        muted: string;
        danger: string;
        radius: string;
    };
    featureDefaults: {
        folderTree: boolean;
    };
    featureAvailability?: {
        folderTree: boolean;
        recent: boolean;
        favorites: boolean;
        quickAccess?: boolean;
        quickAccessFiles?: boolean;
        tags: boolean;
        archive: boolean;
        trash: boolean;
        batchRename: boolean;
        imageEditing: boolean;
        imageProcessing: boolean;
        documentPreview: boolean;
        securityStatus: boolean;
        folderUpload: boolean;
        textPreview: boolean;
        checksum: boolean;
        qrCode: boolean;
    };
    securityStatusAvailable?: boolean;
    uiDefaults: {
        scale: UiScale;
        mode?: "manager" | "picker";
        header?: boolean;
        logo?: boolean;
        search?: boolean;
        languageSwitcher?: boolean;
        viewSwitcher?: boolean;
        fullTools?: boolean;
        uploadConflictStrategy?: UploadConflictStrategy;
        lowercaseUploadExtensions?: boolean;
    };
}
export type UiScale = "compact" | "standard" | "large" | "xlarge";
export type UploadConflictStrategy = "ask" | "rename" | "overwrite" | "skip";
export interface PluginDescriptor {
    name: string;
    version: string;
    capabilities: string[];
    uiActions?: PluginUiAction[];
    previewers?: PluginPreviewer[];
}
export interface PluginUiAction {
    id: string;
    label: {
        en: string;
        "zh-cn"?: string;
        "zh-tw"?: string;
    };
    slot: "utility" | "toolbar" | "context" | "details";
    url: string;
    selection: "none" | "any" | "file" | "image";
    requires: string;
    plugin?: string;
}
export interface PluginPreviewer {
    id: string;
    mimeTypes: string[];
    extensions: string[];
    url: string;
}
export interface MalwareScanEvent {
    id: string;
    fileName: string;
    resource: string;
    bytes: number;
    status: "pending" | "passed" | "quarantined" | "failed";
    code: string | null;
    startedAt: number;
    finishedAt: number | null;
    durationMilliseconds: number | null;
}
export interface SecurityStatus {
    malwareScanning: {
        enabled: boolean;
        provider: "clamav" | null;
        status: "disabled" | "ready" | "degraded" | "down";
        message: string;
        counts: {
            pending: number;
            passed: number;
            quarantined: number;
            failed: number;
        };
        recent: MalwareScanEvent[];
        mode?: "local" | "shared";
        lastSuccessfulAt?: number | null;
    };
    documentPreview: null | {
        pdfEnabled: boolean;
        officeEnabled: boolean;
        available: boolean;
        binary: string;
        version: string | null;
        cacheWritable: boolean;
        cacheCount: number;
        lastSuccessfulAt: number | null;
        configuredMode: "auto" | "inline" | "messenger";
        effectiveMode: "inline" | "messenger";
        queueAvailable: boolean;
        counts: {
            queued: number;
            running: number;
            ready: number;
            failed: number;
            expired: number;
        };
    };
}
export interface DocumentPreviewJob {
    id: string;
    status: "queued" | "running" | "ready" | "failed" | "expired";
    retryAfter: number;
    error: {
        code: string;
        message: string;
    } | null;
    source: "pdf" | "office";
    key: string;
    resource: string;
    path: string;
    previewUrl: string | null;
    mode: "inline" | "messenger";
    cached: boolean;
    createdAt: number;
    startedAt: number | null;
    updatedAt: number;
    finishedAt: number | null;
    durationMilliseconds: number | null;
}
export interface ImageFormatCapability {
    format: string;
    extensions: string[];
    mimes: string[];
    processor: "" | "gd" | "imagick";
    read: boolean;
    edit: boolean;
    thumbnail: boolean;
    webEmbeddable: boolean;
}
export interface ImageCapabilities {
    driver: "" | "auto" | "gd" | "imagick";
    formats: ImageFormatCapability[];
}
export interface ResourceType {
    name: string;
    publicUrl: string;
    allowedExtensions: string[];
    maxSize: number;
    readOnly: boolean;
    quotaBytes: number;
    usedBytes: number;
    maxFileNameLength: number;
    maxFolderNameLength: number;
    maxFolderDepth: number;
    deliveryMode: "public" | "proxy";
    entryUrlConfigured?: boolean;
    storageCapabilities?: StorageCapabilities;
}
export interface StorageCapabilities {
    search: boolean;
    sort: boolean;
    cursorPagination: boolean;
    atomicMove: boolean;
    nativeCopy: boolean;
    recoverableDelete: boolean;
    publicUrl: boolean;
}
export interface Entry {
    path: string;
    name: string;
    directory: boolean;
    size: number;
    modifiedAt: number;
    mimeType: string | null;
    url: string | null;
    capabilities: Record<string, boolean>;
}
export interface ImageVariant {
    width: number;
    height: number;
    url: string;
    mimeType: string;
}
/** Stable, editor-facing representation returned alongside legacy Entry payloads. */
export interface AssetReference {
    schemaVersion: "1.0";
    assetId: string | null;
    resource: string;
    path: string;
    name: string;
    directory: false;
    mimeType: string | null;
    size: number;
    modifiedAt: number;
    version: string;
    url: string;
    downloadUrl: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
    altTranslations?: Record<string, string>;
    variants: ImageVariant[];
    capabilities: Record<string, boolean>;
}
export interface AssetMetadata {
    alt: string | null;
    altTranslations?: Record<string, string>;
    title: string | null;
    tags: string[];
    version: number;
    updatedAt: number;
}
export interface AssetSearchOptions {
    keyword?: string;
    resources?: string[];
    path?: string;
    fields?: Array<"name" | "title" | "alt" | "tags">;
    tags?: string[];
    extensions?: string[];
    type?: "all" | "image" | "document" | "audio" | "video" | "archive" | "other";
    minimumSize?: number;
    maximumSize?: number;
    modifiedAfter?: number;
    modifiedBefore?: number;
    offset?: number;
    limit?: number;
}
export interface AssetSearchResult {
    items: Array<{
        resource: string;
        entry: Entry;
        assetId: string | null;
        metadata: AssetMetadata;
    }>;
    total: number;
    offset: number;
    limit: number;
    scanned: number;
    truncated: boolean;
    facets: {
        resources: Record<string, number>;
        types: Record<string, number>;
        extensions: Record<string, number>;
    };
}
export interface AssetUsage {
    referenceId: string;
    label: string;
    url: string | null;
    context: string | null;
    updatedAt: number;
}
export interface AssetDeleteCheck {
    safe: boolean;
    complete?: boolean;
    total: number;
    assets: Array<{
        assetId: string;
        path: string;
        usages: AssetUsage[];
        total: number;
    }>;
}
export interface TrashItem {
    id: string;
    resource: string;
    path: string;
    directory: boolean;
    size: number;
    deletedAt: number;
    expiresAt: number;
}
export interface TrashPage {
    items: TrashItem[];
    total: number;
    offset: number;
    limit: number;
    usedItems: number;
    usedBytes: number;
    maxItems: number;
    maxBytes: number;
}
export interface ImagePreset {
    width: number;
    height: number;
    quality: number;
}
export type ImageAction = {
    type: "crop";
    x: number;
    y: number;
    width: number;
    height: number;
    quality?: number;
} | {
    type: "rotate";
    degrees: 0 | 90 | 180 | 270;
    quality?: number;
} | {
    type: "resize";
    width: number;
    height: number;
    quality?: number;
} | {
    type: "preset";
    name: string;
} | {
    type: "optimize";
    format: "original" | string;
    quality: number;
} | {
    type: "watermarkText";
    text: string;
    font?: WatermarkFont;
    position: WatermarkPosition;
    x?: number;
    y?: number;
    opacity: number;
    scale: number;
    color: string;
    quality: number;
} | {
    type: "watermarkImage";
    resource: string;
    path: string;
    position: WatermarkPosition;
    x?: number;
    y?: number;
    opacity: number;
    scale: number;
    quality: number;
};
export type WatermarkPosition = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right" | "custom";
export type WatermarkFont = "interface" | "sans" | "serif";
export interface ImageBatchResult {
    total: number;
    succeeded: number;
    failed: number;
    items: Array<{
        path: string;
        success: boolean;
        entry?: Entry;
        error?: {
            code: string;
            message: string;
        };
    }>;
}
export interface ImageEditResult {
    entry: Entry;
    original: ImageInfo & {
        size: number;
    };
    result: ImageInfo & {
        size: number;
    };
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}
export interface BatchResult {
    operation: "copy" | "move" | "delete" | "rename";
    total: number;
    succeeded: number;
    failed: number;
    purgedItems: number;
    purgedBytes: number;
    results: Array<{
        path: string;
        success: boolean;
        entry?: Entry;
        error?: {
            code: string;
            message: string;
        };
    }>;
}
export interface MetadataState {
    favorites: string[];
    quickAccess: string[];
    quickAccessEntries: QuickAccessEntry[];
    tags: Record<string, string[]>;
    recent: Array<{
        path: string;
        touchedAt: number;
    }>;
}
export interface QuickAccessEntry {
    path: string;
    name: string;
    directory: boolean | null;
    mimeType: string | null;
    exists: boolean;
}
export interface ImageInfo {
    width: number;
    height: number;
}
