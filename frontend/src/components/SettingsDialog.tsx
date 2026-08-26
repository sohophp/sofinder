import type { MessageKey } from "../i18n";
import type { ResourceType } from "../types";
import type { UiScale } from "../types";
import { Modal } from "./Modal";

export interface ToolPreferences { resize: boolean; crop: boolean; rotate: boolean; presets: boolean; process: boolean; batchRename: boolean }
export interface FeaturePreferences { recent: boolean; favorites: boolean; tags: boolean; archive: boolean; trash: boolean; folderTree: boolean; autoCollapseUploads: boolean }
export interface ListColumnPreferences { size: boolean; modified: boolean; type: boolean }
export type EntrySize = "small" | "medium" | "large";
export interface ViewSizePreferences { grid: EntrySize; list: EntrySize }

export function SettingsDialog({ resource, tools, features, columns, viewSizes, availability, scale, translate, onToolChange, onFeatureChange, onColumnChange, onViewSizeChange, onScaleChange, onClose }: {
  resource?: ResourceType;
  tools: ToolPreferences;
  features: FeaturePreferences;
  columns: ListColumnPreferences;
  viewSizes: ViewSizePreferences;
  availability: Partial<Record<Exclude<keyof FeaturePreferences, "autoCollapseUploads">, boolean>> & {
    batchRename?: boolean;
    imageEditing?: boolean;
    imageProcessing?: boolean;
  };
  scale: UiScale;
  translate: (key: MessageKey) => string;
  onToolChange: (name: keyof ToolPreferences, enabled: boolean) => void;
  onFeatureChange: (name: keyof FeaturePreferences, enabled: boolean) => void;
  onColumnChange: (name: keyof ListColumnPreferences, enabled: boolean) => void;
  onViewSizeChange: (view: keyof ViewSizePreferences, size: EntrySize) => void;
  onScaleChange: (scale: UiScale) => void;
  onClose: () => void;
}) {
  const t = translate;
  return <Modal title={t("settings")} closeLabel={t("close")} onClose={onClose} className="sf-settings-modal" footer={<button className="primary" onClick={onClose}>{t("done")}</button>}>
    <p>{t("toolSettingsHint")}</p>
    {resource && <p className="sf-configured-limits">{t("configuredLimits")}: {t("fileName")} {resource.maxFileNameLength} · {t("folderName")} {resource.maxFolderNameLength} · {t("folderDepth")} {resource.maxFolderDepth}</p>}
    <h3>{t("interfaceScale")}</h3>
    <div className="sf-scale-options" role="radiogroup" aria-label={t("interfaceScale")}>
      {(["compact", "standard", "large", "xlarge"] as const).map(value => <label key={value}><input type="radio" name="sofinder-scale" value={value} checked={scale === value} onChange={() => onScaleChange(value)}/><span>{t(value === "compact" ? "scaleCompact" : value === "standard" ? "scaleStandard" : value === "large" ? "scaleLarge" : "scaleExtraLarge")}</span></label>)}
    </div>
    {(["grid", "list"] as const).map(view => <div key={view}>
      <h3>{t(view === "grid" ? "gridItemSize" : "listRowSize")}</h3>
      <div className="sf-scale-options" role="radiogroup" aria-label={t(view === "grid" ? "gridItemSize" : "listRowSize")}>
        {(["small", "medium", "large"] as const).map(size => <label key={size}><input type="radio" name={`sofinder-${view}-size`} value={size} checked={viewSizes[view] === size} onChange={() => onViewSizeChange(view, size)}/><span>{t(size === "small" ? "sizeSmall" : size === "medium" ? "sizeMedium" : "sizeLarge")}</span></label>)}
      </div>
    </div>)}
    <h3>{t("optionalTools")}</h3>
    {availability.batchRename !== false && <label className="sf-setting"><input type="checkbox" checked={tools.batchRename} onChange={event => onToolChange("batchRename", event.target.checked)}/><span>{t("batchRename")}</span></label>}
    {(availability.imageEditing !== false || availability.imageProcessing !== false) && <h3>{t("imageTools")}</h3>}
    {(["resize", "crop", "rotate", "presets", "process"] as const).filter(tool => tool === "process" ? availability.imageProcessing !== false : availability.imageEditing !== false).map(tool => <label className="sf-setting" key={tool}><input type="checkbox" checked={tools[tool]} onChange={event => onToolChange(tool, event.target.checked)}/><span>{t(tool === "presets" ? "preset" : tool === "rotate" ? "rotationTools" : tool === "process" ? "imageProcess" : tool)}</span></label>)}
    <h3>{t("listColumns")}</h3>
    {(["size", "modified", "type"] as const).map(column => <label className="sf-setting" key={column}><input type="checkbox" checked={columns[column]} onChange={event => onColumnChange(column, event.target.checked)}/><span>{t(column === "size" ? "showSizeColumn" : column === "modified" ? "showModifiedColumn" : "showTypeColumn")}</span></label>)}
    <h3>{t("optionalFeatures")}</h3><p>{t("featureSettingsHint")}</p>
    {(["autoCollapseUploads", "folderTree", "recent", "favorites", "tags", "archive", "trash"] as const).filter(feature => feature === "autoCollapseUploads" || availability[feature] !== false).map(feature => <label className="sf-setting" key={feature}><input type="checkbox" checked={features[feature]} disabled={feature === "trash" && resource?.storageCapabilities?.recoverableDelete === false} onChange={event => onFeatureChange(feature, event.target.checked)}/><span>{t(feature === "folderTree" ? "folderTreeFeature" : feature === "favorites" ? "favoriteFeature" : feature === "archive" ? "archiveFeature" : feature === "trash" ? "trashFeature" : feature === "tags" ? "tagsFeature" : feature === "recent" ? "recentFeature" : "autoCollapseUploads")}</span></label>)}
  </Modal>;
}
