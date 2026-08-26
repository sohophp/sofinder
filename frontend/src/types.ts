export interface SoFinderConfig {
  apiBase: string;
  csrfToken: string;
  language: "en" | "zh-cn" | "zh-tw";
  resource: string;
  initialPath: string;
  selectMode: boolean;
  selectionKind: "any" | "file" | "image";
  ckeditorFunction: number;
  pickerRequestId: string;
  pickerOrigin: string;
  theme: {
    accent: string;
    background: string;
    panel: string;
    text: string;
    muted: string;
    danger: string;
    radius: string;
  };
  featureDefaults: { folderTree: boolean };
  featureAvailability?: {
    folderTree: boolean;
    recent: boolean;
    favorites: boolean;
    tags: boolean;
    archive: boolean;
    trash: boolean;
  };
  uiDefaults: {
    scale: UiScale;
    mode?: "manager" | "picker";
    header?: boolean;
    logo?: boolean;
    search?: boolean;
    languageSwitcher?: boolean;
    viewSwitcher?: boolean;
    fullTools?: boolean;
  };
}

export type UiScale = "compact" | "standard" | "large" | "xlarge";

export interface PluginDescriptor {
  name: string;
  version: string;
  capabilities: string[];
  uiActions?: PluginUiAction[];
}

export interface PluginUiAction {
  id: string;
  label: { en: string; "zh-cn"?: string; "zh-tw"?: string };
  slot: "utility" | "toolbar" | "context";
  url: string;
  selection: "none" | "any" | "file" | "image";
  requires: string;
  plugin?: string;
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

export interface ImagePreset { width: number; height: number; quality: number }
export type ImageAction =
  | { type: "crop"; x: number; y: number; width: number; height: number; quality?: number }
  | { type: "rotate"; degrees: 0 | 90 | 180 | 270; quality?: number }
  | { type: "resize"; width: number; height: number; quality?: number }
  | { type: "preset"; name: string };

export interface ImageEditResult {
  entry: Entry;
  original: ImageInfo & { size: number };
  result: ImageInfo & { size: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
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
    error?: { code: string; message: string };
  }>;
}

export interface MetadataState {
  favorites: string[];
  tags: Record<string, string[]>;
  recent: Array<{ path: string; touchedAt: number }>;
}

export interface ImageInfo {
  width: number;
  height: number;
}
