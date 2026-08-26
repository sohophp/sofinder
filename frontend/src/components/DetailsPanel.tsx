import type { ReactNode } from "react";
import type { Api } from "../api";
import type { Entry, ImageInfo, MetadataState } from "../types";
import { formatSize } from "../format";
import { EntryIcon, LinkIcon, ThumbnailImage } from "./EntryVisuals";

export function DetailsPanel({ api, resource, selectedEntries, selected, imageInfo, metadata, showTags, previewImage, selectMode, selectAllowed, labels, formatDate, onChoose, onOpenUrl, pluginActions }: {
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
  labels: { details: string; selected: string; type: string; folder: string; file: string; size: string; dimensions: string; modified: string; location: string; select: string; download: string; copyUrl: string; unsupportedWebImage: string };
  formatDate: (timestamp: number) => string;
  onChoose: () => void;
  onOpenUrl: (entry: Entry) => void;
  pluginActions?: ReactNode;
}) {
  return <aside className="sf-details">
    <h2>{labels.details}</h2>
    {selectedEntries.length > 1 ? <div className="sf-state">{selectedEntries.length} {labels.selected}</div> : selected ? <>
      <div className="sf-preview">{previewImage ? <ThumbnailImage src={api.thumbnailUrl(resource, selected, 800, 600)} alt={selected.name}/> : <EntryIcon name={selected.name} mimeType={selected.mimeType} directory={selected.directory}/>}</div>
      <h3>{selected.name}</h3>
      <dl><dt>{labels.type}</dt><dd>{selected.directory ? labels.folder : selected.mimeType || labels.file}</dd><dt>{labels.size}</dt><dd>{selected.directory ? "—" : formatSize(selected.size)}</dd>{imageInfo && <><dt>{labels.dimensions}</dt><dd>{imageInfo.width} × {imageInfo.height} px</dd></>}<dt>{labels.modified}</dt><dd><time dateTime={new Date(selected.modifiedAt * 1000).toISOString()}>{formatDate(selected.modifiedAt)}</time></dd><dt>{labels.location}</dt><dd>{selected.path}</dd></dl>
      {showTags && (metadata.tags[selected.path] || []).length > 0 && <div className="sf-tags">{metadata.tags[selected.path].map(tag => <span key={tag}>{tag}</span>)}</div>}
      {selectMode && !selected.directory && selected.url && <><button className="sf-select primary" disabled={!selectAllowed} onClick={onChoose}>{labels.select}</button>{!selectAllowed && <p className="sf-warning" role="status">{labels.unsupportedWebImage}</p>}</>}
      {!selected.directory && <div className="sf-detail-actions"><a className="sf-download" href={selected.url || api.downloadUrl(resource, selected.path)}>{labels.download}</a><button type="button" className="sf-icon-button" onClick={() => onOpenUrl(selected)} title={labels.copyUrl} aria-label={labels.copyUrl}><LinkIcon/></button></div>}
      {pluginActions && <div className="sf-plugin-detail-actions">{pluginActions}</div>}
    </> : <div className="sf-state">—</div>}
  </aside>;
}
