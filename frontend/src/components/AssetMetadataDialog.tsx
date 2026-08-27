import { useState } from "react";
import type { AssetMetadata, AssetReference } from "../types";
import { Modal } from "./Modal";

export function AssetMetadataDialog({ asset, metadata, labels, onClose, onSave }: {
  asset: AssetReference; metadata: AssetMetadata;
  labels: { title: string; alt: string; assetTitle: string; tags: string; decorative: string; unsetAlt: string; save: string; cancel: string };
  onClose: () => void; onSave: (metadata: Pick<AssetMetadata, "alt" | "title" | "tags" | "version">) => Promise<void>;
}) {
  const [alt, setAlt] = useState(metadata.alt ?? ""); const [title, setTitle] = useState(metadata.title ?? ""); const [tags, setTags] = useState(metadata.tags.join(", "));
  const [decorative, setDecorative] = useState(metadata.alt === ""); const [saving, setSaving] = useState(false);
  return <Modal title={labels.title} closeLabel={labels.cancel} onClose={onClose}>
    <div className="sf-form-body sf-asset-metadata"><p><strong>{asset.name}</strong></p>
      <label>{labels.alt}<input value={alt} disabled={decorative} placeholder={labels.unsetAlt} maxLength={1000} onChange={event => setAlt(event.target.value)}/></label>
      <label className="sf-setting"><input type="checkbox" checked={decorative} onChange={event => setDecorative(event.target.checked)}/><span>{labels.decorative}</span></label>
      <label>{labels.assetTitle}<input value={title} maxLength={200} onChange={event => setTitle(event.target.value)}/></label>
      <label>{labels.tags}<input value={tags} onChange={event => setTags(event.target.value)}/></label>
    </div>
    <div className="sf-modal-actions"><button type="button" onClick={onClose}>{labels.cancel}</button><button className="primary" type="button" disabled={saving} onClick={() => { setSaving(true); void onSave({ alt: decorative ? "" : (alt.trim() || null), title: title.trim() || null, tags: tags.split(/[,，]/).map(value => value.trim()).filter(Boolean), version: metadata.version }).finally(() => setSaving(false)); }}>{labels.save}</button></div>
  </Modal>;
}
