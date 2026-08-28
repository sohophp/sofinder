import type { UiScale, UploadConflictStrategy } from "./types";
import type { EntrySize, FeaturePreferences, FolderTreePlacement, ListColumnName, ListColumnPreferences, ListColumnWidths, QuickAccessScope, ToolPreferences, ViewSizePreferences } from "./components/SettingsDialog";

export const defaultTools: ToolPreferences = { resize: false, crop: false, rotate: false, presets: false, process: false, batchRename: false };
export const defaultViewSizes: ViewSizePreferences = { grid: "medium", list: "medium" };
export const defaultFeatures: FeaturePreferences = { recent: false, favorites: false, sidebarFavorites: true, sidebarQuickAccess: true, quickAccessFiles: false, tags: false, archive: false, trash: true, folderTree: false, qrCode: false, autoCollapseUploads: true };
export const defaultListColumns: ListColumnPreferences = { size: true, modified: true, type: false };
export const defaultFeatureAvailability = { recent: true, favorites: true, quickAccess: true, quickAccessFiles: false, tags: true, archive: true, trash: true, folderTree: true, batchRename: true, imageEditing: true, imageProcessing: true, documentPreview: true, securityStatus: true, folderUpload: true, textPreview: true, checksum: true, qrCode: true } as const;

export const loadPreferences = <T extends object>(key: string, defaults: T): T => {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "{}") as Record<string, unknown>;
    return Object.fromEntries(Object.entries(defaults).map(([name, fallback]) => [name, typeof saved[name] === "boolean" ? saved[name] : fallback])) as T;
  } catch { return defaults; }
};

export const loadToolPreferences = (): ToolPreferences => loadPreferences("sofinder.tools.v3", defaultTools);

export const loadViewSizes = (): ViewSizePreferences => {
  try {
    const saved = JSON.parse(localStorage.getItem("sofinder.viewSizes.v1") || "{}") as Partial<ViewSizePreferences>;
    const valid = (value: unknown): value is EntrySize => value === "small" || value === "medium" || value === "large";
    return { grid: valid(saved.grid) ? saved.grid : defaultViewSizes.grid, list: valid(saved.list) ? saved.list : defaultViewSizes.list };
  } catch { return defaultViewSizes; }
};

export const loadScale = (fallback: UiScale): UiScale => {
  const saved = localStorage.getItem("sofinder.uiScale.v1");
  return saved === "compact" || saved === "standard" || saved === "large" || saved === "xlarge" ? saved : fallback;
};

export const loadUploadConflictStrategy = (fallback: UploadConflictStrategy): UploadConflictStrategy => {
  const saved = localStorage.getItem("sofinder.uploadConflictStrategy.v1");
  return saved === "ask" || saved === "rename" || saved === "overwrite" || saved === "skip" ? saved : fallback;
};

export const loadFolderTreePlacement = (): FolderTreePlacement => localStorage.getItem("sofinder.folderNavigation.position.v1") === "right" ? "right" : "left";
export const loadQuickAccessScope = (): QuickAccessScope => localStorage.getItem("sofinder.quickAccess.scope.v1") === "resource" ? "resource" : "all";

export const columnLimits = { left: { initial: 220, min: 110, max: 330 }, right: { initial: 270, min: 135, max: 405 } } as const;
export const listColumnLimits: Record<ListColumnName, { initial: number; min: number; max: number }> = {
  name: { initial: 360, min: 180, max: 720 },
  size: { initial: 100, min: 72, max: 180 },
  type: { initial: 160, min: 120, max: 360 },
  modified: { initial: 180, min: 150, max: 320 },
};
export const pageSizeLimits = { default: 100, min: 10, max: 500 } as const;
export const clampPageSize = (value: number) => Math.max(pageSizeLimits.min, Math.min(pageSizeLimits.max, Math.trunc(value)));

export const loadPageSize = () => {
  const saved = Number(localStorage.getItem("sofinder.pageSize.v1"));
  return Number.isFinite(saved) && saved > 0 ? clampPageSize(saved) : pageSizeLimits.default;
};

export const loadColumnWidth = (side: "left" | "right") => {
  const limits = columnLimits[side];
  const saved = localStorage.getItem(`sofinder.column.${side}`);
  if (saved === null || saved.trim() === "") return limits.initial;
  const value = Number(saved);
  return Number.isFinite(value) ? Math.max(limits.min, Math.min(limits.max, value)) : limits.initial;
};

export const clampListColumnWidth = (column: ListColumnName, value: number) => {
  const limits = listColumnLimits[column];
  return Math.round(Math.max(limits.min, Math.min(limits.max, value)));
};

export const loadListColumnWidths = (): ListColumnWidths => {
  try {
    const saved = JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}") as Partial<Record<ListColumnName, unknown>>;
    return Object.fromEntries((Object.keys(listColumnLimits) as ListColumnName[]).map(column => {
      const value = Number(saved[column]);
      return [column, Number.isFinite(value) ? clampListColumnWidth(column, value) : listColumnLimits[column].initial];
    })) as unknown as ListColumnWidths;
  } catch {
    return Object.fromEntries((Object.keys(listColumnLimits) as ListColumnName[]).map(column => [column, listColumnLimits[column].initial])) as unknown as ListColumnWidths;
  }
};
