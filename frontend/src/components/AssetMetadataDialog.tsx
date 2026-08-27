import { useState } from "react";
import type { AssetMetadata, AssetReference } from "../types";
import { Modal } from "./Modal";

export function AssetMetadataDialog({ asset, metadata, labels, onClose, onSave }: {
  asset: AssetReference; metadata: AssetMetadata;
  labels: { title: string; alt: string; translatedAlt: string; translatedAltHelp: string; languageCode: string; addLanguage: string; assetTitle: string; tags: string; decorative: string; unsetAlt: string; inheritAlt: string; save: string; cancel: string; locales: Record<string, string> };
  onClose: () => void; onSave: (metadata: Pick<AssetMetadata, "alt" | "altTranslations" | "title" | "tags" | "version">) => Promise<void>;
}) {
  const [alt, setAlt] = useState(metadata.alt ?? ""); const [title, setTitle] = useState(metadata.title ?? ""); const [tags, setTags] = useState(metadata.tags.join(", "));
  const [altTranslations, setAltTranslations] = useState<Record<string, string>>(metadata.altTranslations ?? {});
  const [newLocale, setNewLocale] = useState("");
  const [decorative, setDecorative] = useState(metadata.alt === ""); const [saving, setSaving] = useState(false);
  const locales = ["en", "zh-cn", "zh-tw", ...Object.keys(altTranslations).filter(locale => !["en", "zh-cn", "zh-tw"].includes(locale)).sort()];
  return <Modal title={labels.title} closeLabel={labels.cancel} onClose={onClose} className="sf-asset-metadata-modal">
    <div className="sf-form-body sf-asset-metadata"><p className="sf-asset-metadata-file" title={asset.name}>{asset.name}</p>
      <label className="sf-form-field"><span>{labels.alt}</span><input value={alt} disabled={decorative} placeholder={labels.unsetAlt} maxLength={1000} onChange={event => setAlt(event.target.value)}/></label>
      <label className="sf-asset-decorative"><input type="checkbox" checked={decorative} onChange={event => setDecorative(event.target.checked)}/><span>{labels.decorative}</span></label>
      <section className="sf-alt-translations" aria-labelledby="sf-alt-translations-title">
        <div className="sf-alt-translations-heading"><h3 id="sf-alt-translations-title">{labels.translatedAlt}</h3><small>{labels.translatedAltHelp}</small><div className="sf-alt-locale-add"><input aria-label={labels.languageCode} value={newLocale} maxLength={35} placeholder="fr-ca" onChange={event => setNewLocale(event.target.value)}/><button type="button" disabled={pregLocale(newLocale) === null || locales.includes(pregLocale(newLocale) ?? "") || locales.length >= 20} onClick={() => { const locale = pregLocale(newLocale); if (!locale) return; setAltTranslations(current => ({ ...current, [locale]: "" })); setNewLocale(""); }}>{labels.addLanguage}</button></div></div>
        <div className="sf-alt-translation-list">{locales.map(locale => <label key={locale}><span>{labels.locales[locale] ?? locale}</span><input value={altTranslations[locale] ?? ""} placeholder={labels.inheritAlt} maxLength={1000} onChange={event => setAltTranslations(current => ({ ...current, [locale]: event.target.value }))}/></label>)}</div>
      </section>
      <label className="sf-form-field"><span>{labels.assetTitle}</span><input value={title} maxLength={200} onChange={event => setTitle(event.target.value)}/></label>
      <label className="sf-form-field"><span>{labels.tags}</span><input value={tags} onChange={event => setTags(event.target.value)}/></label>
    </div>
    <div className="sf-modal-actions"><button type="button" onClick={onClose}>{labels.cancel}</button><button className="primary" type="button" disabled={saving} onClick={() => { setSaving(true); const translations = Object.fromEntries(Object.entries(altTranslations).map(([locale, value]) => [locale.toLowerCase(), value.trim()]).filter(([, value]) => value !== "")); void onSave({ alt: decorative ? "" : (alt.trim() || null), altTranslations: translations, title: title.trim() || null, tags: tags.split(/[,，]/).map(value => value.trim()).filter(Boolean), version: metadata.version }).finally(() => setSaving(false)); }}>{labels.save}</button></div>
  </Modal>;
}

const pregLocale = (value: string): string | null => {
  const locale = value.trim().toLowerCase();
  return /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(locale) ? locale : null;
};
