import type { MessageKey } from "../i18n";
import type { ResourceType } from "../types";
import type { UiScale } from "../types";
import { Modal } from "./Modal";

export interface ToolPreferences { resize: boolean; crop: boolean; rotate: boolean; presets: boolean }
export interface FeaturePreferences { recent: boolean; favorites: boolean; tags: boolean; archive: boolean; trash: boolean; folderTree: boolean; autoCollapseUploads: boolean }

export function SettingsDialog({ resource, tools, features, scale, translate, onToolChange, onFeatureChange, onScaleChange, onClose }: {
  resource?: ResourceType;
  tools: ToolPreferences;
  features: FeaturePreferences;
  scale: UiScale;
  translate: (key: MessageKey) => string;
  onToolChange: (name: keyof ToolPreferences, enabled: boolean) => void;
  onFeatureChange: (name: keyof FeaturePreferences, enabled: boolean) => void;
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
    <h3>{t("imageTools")}</h3>
    {(["resize", "crop", "rotate", "presets"] as const).map(tool => <label className="sf-setting" key={tool}><input type="checkbox" checked={tools[tool]} onChange={event => onToolChange(tool, event.target.checked)}/><span>{t(tool === "presets" ? "preset" : tool === "rotate" ? "rotationTools" : tool)}</span></label>)}
    <h3>{t("optionalFeatures")}</h3><p>{t("featureSettingsHint")}</p>
    {(["autoCollapseUploads", "folderTree", "recent", "favorites", "tags", "archive", "trash"] as const).map(feature => <label className="sf-setting" key={feature}><input type="checkbox" checked={features[feature]} onChange={event => onFeatureChange(feature, event.target.checked)}/><span>{t(feature === "folderTree" ? "folderTreeFeature" : feature === "favorites" ? "favoriteFeature" : feature === "archive" ? "archiveFeature" : feature === "trash" ? "trashFeature" : feature === "tags" ? "tagsFeature" : feature === "recent" ? "recentFeature" : "autoCollapseUploads")}</span></label>)}
  </Modal>;
}
