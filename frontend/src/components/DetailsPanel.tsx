import { useState, type ReactNode } from "react";
import type { Api } from "../api";
import type { Entry, ImageInfo, MetadataState } from "../types";
import { formatSize } from "../format";
import { EntryIcon, ThumbnailImage } from "./EntryVisuals";
import { UiIcon } from "./UiIcon";
import { AssetPropertiesPanel } from "./AssetPropertiesPanel";

export function DetailsPanel({ api, resource, selectedEntries, selected, imageInfo, metadata, showTags, previewImage, selectMode, selectAllowed, assetMetadataEnabled, assetUsageEnabled, assetAltLocales = [], labels, formatDate, onChoose, onShare, onAssetMetadata, pluginActions }: {
  api: Api;
  resource: string;
  selectedEntries: Entry[];
  selected: Entry | null;
  imageInfo: ImageInfo | null;
  metadata: MetadataState;
  showTags: boolean;
  previewImage: boolean;
  selectMode: boolean;
  selectAllowed: boolean;
  assetMetadataEnabled?: boolean;
  assetUsageEnabled?: boolean;
  assetAltLocales?: Array<{ code: string; label: string }>;
  labels: { details: string; information?: string; selected: string; type: string; folder: string; file: string; size: string; dimensions: string; modified: string; location: string; select: string; download: string; share: string; assetMetadata?: string; unsupportedWebImage: string; assetAlt?: string; translatedAlt?: string; language?: string; addLanguage?: string; assetTitle?: string; tags?: string; decorative?: string; unsetAlt?: string; inheritAlt?: string; save?: string; loading?: string; saved?: string; unsaved?: string; conflict?: string; metadataError?: string; usages?: string; noUsages?: string };
  formatDate: (timestamp: number) => string;
  onChoose: () => void;
  onShare: (entry: Entry) => void;
  onAssetMetadata?: (entry: Entry) => void;
  pluginActions?: ReactNode;
}) {
  const [tab, setTab] = useState<"information" | "properties">("information");
  const canEditMetadata = Boolean(assetMetadataEnabled && selected && !selected.directory && selected.capabilities?.["metadata.update"] !== false);
  const usageLabels = labels.details === "详细信息" ? { usages: "使用位置", none: "没有已登记的使用位置" } : labels.details === "詳細資訊" ? { usages: "使用位置", none: "沒有已登記的使用位置" } : { usages: "Usages", none: "No registered usages" };
  return <aside className="sf-details">
    <div className="sf-details-tabs"><button type="button" className={tab === "information" ? "active" : ""} onClick={() => setTab("information")}>{labels.information ?? labels.details}</button>{canEditMetadata && <button type="button" className={tab === "properties" ? "active" : ""} onClick={() => setTab("properties")}>{labels.assetMetadata}</button>}</div>
    {tab === "properties" && canEditMetadata && selected ? <AssetPropertiesPanel key={`${resource}:${selected.path}`} api={api} resource={resource} entry={selected} locales={assetAltLocales} usageEnabled={assetUsageEnabled} labels={{ alt: labels.assetAlt ?? "Alt", translatedAlt: labels.translatedAlt ?? "Localized alt", language: labels.language ?? "Language", addLanguage: labels.addLanguage ?? "Add", assetTitle: labels.assetTitle ?? "Title", tags: labels.tags ?? "Tags", decorative: labels.decorative ?? "Decorative", unsetAlt: labels.unsetAlt ?? "", inheritAlt: labels.inheritAlt ?? "", save: labels.save ?? "Save", loading: labels.loading ?? "Loading…", saved: labels.saved ?? "Saved", unsaved: labels.unsaved ?? "Unsaved changes", conflict: labels.conflict ?? "Conflict", error: labels.metadataError ?? "Unable to load metadata", usages: labels.usages ?? usageLabels.usages, noUsages: labels.noUsages ?? usageLabels.none }}/> :
    selectedEntries.length > 1 ? <div className="sf-state">{selectedEntries.length} {labels.selected}</div> : selected ? <>
      <div className="sf-preview">{previewImage ? <ThumbnailImage src={api.thumbnailUrl(resource, selected, 800, 600)} alt={selected.name}/> : <EntryIcon name={selected.name} mimeType={selected.mimeType} directory={selected.directory}/>}</div>
      <h3>{selected.name}</h3>
      <dl><dt>{labels.type}</dt><dd>{selected.directory ? labels.folder : selected.mimeType || labels.file}</dd><dt>{labels.size}</dt><dd>{selected.directory ? "—" : formatSize(selected.size)}</dd>{imageInfo && <><dt>{labels.dimensions}</dt><dd>{imageInfo.width} × {imageInfo.height} px</dd></>}<dt>{labels.modified}</dt><dd><time dateTime={new Date(selected.modifiedAt * 1000).toISOString()}>{formatDate(selected.modifiedAt)}</time></dd><dt>{labels.location}</dt><dd>{selected.path}</dd></dl>
      {showTags && (metadata.tags[selected.path] || []).length > 0 && <div className="sf-tags">{metadata.tags[selected.path].map(tag => <span key={tag}>{tag}</span>)}</div>}
      {selectMode && !selected.directory && selected.url && <><button className="sf-select primary" disabled={!selectAllowed} onClick={onChoose}>{labels.select}</button>{!selectAllowed && <p className="sf-warning" role="status">{labels.unsupportedWebImage}</p>}</>}
      {!selected.directory && <div className="sf-detail-actions"><a className="sf-icon-action" href={selected.url || api.downloadUrl(resource, selected.path)} target="_blank" rel="noopener noreferrer" title={labels.download} aria-label={labels.download}><UiIcon name="download"/></a><button className="sf-icon-action" type="button" onClick={() => onShare(selected)} title={labels.share} aria-label={labels.share}><UiIcon name="share"/></button>{assetMetadataEnabled && selected.capabilities?.["metadata.update"] !== false && <button className="sf-icon-action" type="button" onClick={() => onAssetMetadata?.(selected)} title={labels.assetMetadata} aria-label={labels.assetMetadata}><UiIcon name="asset-metadata"/></button>}</div>}
      {pluginActions && <div className="sf-plugin-detail-actions">{pluginActions}</div>}
    </> : <div className="sf-state">—</div>}
  </aside>;
}
