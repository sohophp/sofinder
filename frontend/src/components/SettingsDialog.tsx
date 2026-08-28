import type { MessageKey } from "../i18n";
import type { ResourceType } from "../types";
import type { UiScale, UploadConflictStrategy } from "../types";
import { Modal } from "./Modal";
import { PreferenceProfiles, type PreferenceSnapshot } from "./PreferenceProfiles";

export interface ToolPreferences { resize: boolean; crop: boolean; rotate: boolean; presets: boolean; process: boolean; batchRename: boolean }
export interface FeaturePreferences { recent: boolean; favorites: boolean; sidebarFavorites: boolean; sidebarQuickAccess: boolean; quickAccessFiles: boolean; tags: boolean; archive: boolean; trash: boolean; folderTree: boolean; qrCode: boolean; autoCollapseUploads: boolean }
export interface ListColumnPreferences { size: boolean; modified: boolean; type: boolean }
export type ListColumnName = "name" | "size" | "type" | "modified";
export type ListColumnWidths = Record<ListColumnName, number>;
export type EntrySize = "small" | "medium" | "large";
export interface ViewSizePreferences { grid: EntrySize; list: EntrySize }
export type FolderTreePlacement = "left" | "right";
export type QuickAccessScope = "all" | "resource";

export function SettingsDialog({ resource, tools, features, columns, viewSizes, folderTreePlacement, quickAccessScope, availability, scale, uploadConflictStrategy, translate, onToolChange, onFeatureChange, onColumnChange, onViewSizeChange, onFolderTreePlacementChange, onQuickAccessScopeChange, onScaleChange, onUploadConflictStrategyChange, onReset, onClose }: {
  resource?: ResourceType;
  tools: ToolPreferences;
  features: FeaturePreferences;
  columns: ListColumnPreferences;
  viewSizes: ViewSizePreferences;
  folderTreePlacement: FolderTreePlacement;
  quickAccessScope: QuickAccessScope;
  availability: Partial<Record<Exclude<keyof FeaturePreferences, "autoCollapseUploads">, boolean>> & {
    batchRename?: boolean;
    imageEditing?: boolean;
    imageProcessing?: boolean;
    quickAccess?: boolean;
  };
  scale: UiScale;
  uploadConflictStrategy: UploadConflictStrategy;
  translate: (key: MessageKey) => string;
  onToolChange: (name: keyof ToolPreferences, enabled: boolean) => void;
  onFeatureChange: (name: keyof FeaturePreferences, enabled: boolean) => void;
  onColumnChange: (name: keyof ListColumnPreferences, enabled: boolean) => void;
  onViewSizeChange: (view: keyof ViewSizePreferences, size: EntrySize) => void;
  onFolderTreePlacementChange: (placement: FolderTreePlacement) => void;
  onQuickAccessScopeChange: (scope: QuickAccessScope) => void;
  onScaleChange: (scale: UiScale) => void;
  onUploadConflictStrategyChange: (strategy: UploadConflictStrategy) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const t = translate;
  const documentLanguage = document.documentElement.lang.toLowerCase();
  const quickAccessLabels = documentLanguage === "zh-tw" ? { title: "固定資料夾顯示範圍", all: "全部根目錄", resource: "目前根目錄" } : documentLanguage.startsWith("zh") ? { title: "固定文件夹显示范围", all: "全部根目录", resource: "当前根目录" } : { title: "Pinned folder scope", all: "All storage roots", resource: "Current storage root" };
  const sidebarLabels = documentLanguage === "zh-tw" ? { title: "側邊欄內容", favorites: "顯示收藏檔案", quick: "顯示固定資料夾" } : documentLanguage.startsWith("zh") ? { title: "侧边栏内容", favorites: "显示收藏文件", quick: "显示固定文件夹" } : { title: "Sidebar content", favorites: "Show favorite files", quick: "Show pinned folders" };
  const sectionLabels = documentLanguage === "zh-tw" ? { appearance: "外觀", operations: "檔案操作", list: "清單", features: "功能與側邊欄" } : documentLanguage.startsWith("zh") ? { appearance: "外观", operations: "文件操作", list: "列表", features: "功能与侧边栏" } : { appearance: "Appearance", operations: "File operations", list: "List", features: "Features and sidebar" };
  return <Modal title={t("settings")} closeLabel={t("close")} onClose={onClose} className="sf-settings-modal" footer={<button className="primary" onClick={onClose}>{t("done")}</button>}>
    <p>{t("toolSettingsHint")}</p>
    {resource && <p className="sf-configured-limits">{t("configuredLimits")}: {t("fileName")} {resource.maxFileNameLength} · {t("folderName")} {resource.maxFolderNameLength} · {t("folderDepth")} {resource.maxFolderDepth}</p>}
    <PreferenceProfiles
      current={{ tools, features, columns, viewSizes, folderTreePlacement, quickAccessScope, scale, uploadConflictStrategy }}
      onReset={onReset}
      onApply={(settings: PreferenceSnapshot) => {
        (Object.keys(settings.tools) as Array<keyof ToolPreferences>).forEach(name => onToolChange(name, settings.tools[name]));
        (Object.keys(settings.features) as Array<keyof FeaturePreferences>).forEach(name => onFeatureChange(name, settings.features[name]));
        (Object.keys(settings.columns) as Array<keyof ListColumnPreferences>).forEach(name => onColumnChange(name, settings.columns[name]));
        (Object.keys(settings.viewSizes) as Array<keyof ViewSizePreferences>).forEach(name => onViewSizeChange(name, settings.viewSizes[name]));
        onFolderTreePlacementChange(settings.folderTreePlacement); onQuickAccessScopeChange(settings.quickAccessScope); onScaleChange(settings.scale); onUploadConflictStrategyChange(settings.uploadConflictStrategy);
      }}
    />
    <section className="sf-settings-section"><h2>{sectionLabels.appearance}</h2><h3>{t("interfaceScale")}</h3>
    <div className="sf-scale-options" role="radiogroup" aria-label={t("interfaceScale")}>
      {(["compact", "standard", "large", "xlarge"] as const).map(value => <label key={value}><input type="radio" name="sofinder-scale" value={value} checked={scale === value} onChange={() => onScaleChange(value)}/><span>{t(value === "compact" ? "scaleCompact" : value === "standard" ? "scaleStandard" : value === "large" ? "scaleLarge" : "scaleExtraLarge")}</span></label>)}
    </div>
    {(["grid", "list"] as const).map(view => <div key={view}>
      <h3>{t(view === "grid" ? "gridItemSize" : "listRowSize")}</h3>
      <div className="sf-scale-options" role="radiogroup" aria-label={t(view === "grid" ? "gridItemSize" : "listRowSize")}>
        {(["small", "medium", "large"] as const).map(size => <label key={size}><input type="radio" name={`sofinder-${view}-size`} value={size} checked={viewSizes[view] === size} onChange={() => onViewSizeChange(view, size)}/><span>{t(size === "small" ? "sizeSmall" : size === "medium" ? "sizeMedium" : "sizeLarge")}</span></label>)}
      </div>
    </div>)}</section>
    <section className="sf-settings-section"><h2>{sectionLabels.operations}</h2><h3>{t("uploadConflictSetting")}</h3>
    <div className="sf-scale-options" role="radiogroup" aria-label={t("uploadConflictSetting")}>
      {(["ask", "rename", "overwrite", "skip"] as const).map(strategy => <label key={strategy}><input type="radio" name="sofinder-upload-conflict" value={strategy} checked={uploadConflictStrategy === strategy} onChange={() => onUploadConflictStrategyChange(strategy)}/><span>{t(strategy === "ask" ? "uploadConflictAsk" : strategy === "rename" ? "uploadConflictRename" : strategy === "overwrite" ? "uploadConflictOverwrite" : "uploadConflictSkip")}</span></label>)}
    </div><h3>{t("optionalTools")}</h3>
    {availability.batchRename !== false && <label className="sf-setting"><input type="checkbox" checked={tools.batchRename} onChange={event => onToolChange("batchRename", event.target.checked)}/><span>{t("batchRename")}</span></label>}
    {(availability.imageEditing !== false || availability.imageProcessing !== false) && <h3>{t("imageTools")}</h3>}
    {(["resize", "crop", "rotate", "presets", "process"] as const).filter(tool => tool === "process" ? availability.imageProcessing !== false : availability.imageEditing !== false).map(tool => <label className="sf-setting" key={tool}><input type="checkbox" checked={tools[tool]} onChange={event => onToolChange(tool, event.target.checked)}/><span>{t(tool === "presets" ? "preset" : tool === "rotate" ? "rotationTools" : tool === "process" ? "imageProcess" : tool)}</span></label>)}</section>
    <section className="sf-settings-section"><h2>{sectionLabels.list}</h2><h3>{t("listColumns")}</h3>
    {(["size", "modified", "type"] as const).map(column => <label className="sf-setting" key={column}><input type="checkbox" checked={columns[column]} onChange={event => onColumnChange(column, event.target.checked)}/><span>{t(column === "size" ? "showSizeColumn" : column === "modified" ? "showModifiedColumn" : "showTypeColumn")}</span></label>)}</section>
    <section className="sf-settings-section"><h2>{sectionLabels.features}</h2><h3>{t("optionalFeatures")}</h3><p>{t("featureSettingsHint")}</p>
    {(["autoCollapseUploads", "folderTree", "recent", "favorites", "tags", "archive", "trash", "qrCode"] as const).filter(feature => feature === "autoCollapseUploads" || availability[feature] !== false).map(feature => <label className="sf-setting" key={feature}><input type="checkbox" checked={features[feature]} disabled={feature === "trash" && resource?.storageCapabilities?.recoverableDelete === false} onChange={event => onFeatureChange(feature, event.target.checked)}/><span>{t(feature === "folderTree" ? "folderTreeFeature" : feature === "favorites" ? "favoriteFeature" : feature === "archive" ? "archiveFeature" : feature === "trash" ? "trashFeature" : feature === "tags" ? "tagsFeature" : feature === "recent" ? "recentFeature" : feature === "qrCode" ? "qrCodeFeature" : "autoCollapseUploads")}</span></label>)}
    {features.folderTree && availability.folderTree !== false && <><h3>{t("folderNavigationPosition")}</h3><div className="sf-scale-options" role="radiogroup" aria-label={t("folderNavigationPosition")}>{(["left", "right"] as const).map(placement => <label key={placement}><input type="radio" name="sofinder-folder-navigation-position" value={placement} checked={folderTreePlacement === placement} onChange={() => onFolderTreePlacementChange(placement)}/><span>{t(placement === "left" ? "leftSidebar" : "rightSidebar")}</span></label>)}</div></>}
    {(features.favorites && availability.favorites !== false || availability.quickAccess !== false) && <><h3>{sidebarLabels.title}</h3>{availability.quickAccess !== false && <label className="sf-setting"><input type="checkbox" checked={features.sidebarQuickAccess} onChange={event => onFeatureChange("sidebarQuickAccess", event.target.checked)}/><span>{sidebarLabels.quick}</span></label>}{features.favorites && availability.favorites !== false && <label className="sf-setting"><input type="checkbox" checked={features.sidebarFavorites} onChange={event => onFeatureChange("sidebarFavorites", event.target.checked)}/><span>{sidebarLabels.favorites}</span></label>}{availability.quickAccess !== false && features.sidebarQuickAccess && <><h3>{quickAccessLabels.title}</h3><div className="sf-scale-options" role="radiogroup" aria-label={quickAccessLabels.title}>{(["all", "resource"] as const).map(scope => <label key={scope}><input type="radio" name="sofinder-quick-access-scope" value={scope} checked={quickAccessScope === scope} onChange={() => onQuickAccessScopeChange(scope)}/><span>{scope === "all" ? quickAccessLabels.all : quickAccessLabels.resource}</span></label>)}</div></>}</>}</section>
  </Modal>;
}
