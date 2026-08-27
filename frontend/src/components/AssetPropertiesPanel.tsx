import { useEffect, useMemo, useState } from "react";
import { ApiError, type Api } from "../api";
import type { AssetMetadata, AssetUsage, Entry } from "../types";

type Labels = {
  alt: string; translatedAlt: string; language: string; addLanguage: string; assetTitle: string; tags: string;
  decorative: string; unsetAlt: string; inheritAlt: string; save: string; loading: string; saved: string;
  unsaved: string; conflict: string; error: string; usages: string; noUsages: string;
};

export function AssetPropertiesPanel({ api, resource, entry, locales, labels, usageEnabled = true }: {
  api: Api;
  resource: string;
  entry: Entry;
  locales: Array<{ code: string; label: string }>;
  labels: Labels;
  usageEnabled?: boolean;
}) {
  const [assetId, setAssetId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [decorative, setDecorative] = useState(false);
  const [newLocale, setNewLocale] = useState("");
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "conflict" | "error">("loading");
  const [usages, setUsages] = useState<AssetUsage[]>([]);
  const [usageAvailable, setUsageAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setAssetId(null);
    setMetadata(null);
    void api.resolveAsset(resource, entry.path).then(resolved => {
      if (!resolved.asset.assetId) throw new ApiError(labels.error, "asset_catalog_unavailable", 404);
      return api.asset(resolved.asset.assetId);
    }).then(result => {
      if (!active) return;
      setAssetId(result.asset.assetId);
      setMetadata(result.metadata);
      setAlt(result.metadata.alt ?? "");
      setDecorative(result.metadata.alt === "");
      setTitle(result.metadata.title ?? "");
      setTags(result.metadata.tags.join(", "));
      setTranslations(result.metadata.altTranslations ?? {});
      setStatus("idle");
      if (usageEnabled && result.asset.assetId) void api.assetUsages(result.asset.assetId).then(value => { if (active) { setUsages(value.items); setUsageAvailable(true); } }).catch(() => { if (active) setUsageAvailable(false); });
    }).catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, [api, resource, entry.path, labels.error, usageEnabled]);

  const normalized = useMemo(() => ({
    alt: decorative ? "" : (alt.trim() || null),
    altTranslations: Object.fromEntries(Object.entries(translations).map(([locale, value]) => [locale.toLowerCase(), value.trim()]).filter(([, value]) => value !== "")),
    title: title.trim() || null,
    tags: tags.split(/[,，]/).map(value => value.trim()).filter(Boolean),
  }), [alt, decorative, tags, title, translations]);
  const dirty = metadata !== null && JSON.stringify(normalized) !== JSON.stringify({
    alt: metadata.alt,
    altTranslations: metadata.altTranslations ?? {},
    title: metadata.title,
    tags: metadata.tags,
  });
  const activeLocales = Object.keys(translations).sort();
  const availableLocales = locales.filter(locale => !activeLocales.includes(locale.code));
  const selectedLocale = availableLocales.some(locale => locale.code === newLocale) ? newLocale : (availableLocales[0]?.code ?? "");

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (status === "loading") return <div className="sf-state">{labels.loading}</div>;
  if (!metadata || !assetId) return <div className="sf-warning" role="status">{labels.error}</div>;

  const save = async () => {
    setStatus("saving");
    try {
      const result = await api.updateAssetMetadata(assetId, { ...normalized, version: metadata.version });
      setMetadata(result.metadata);
      setStatus("saved");
    } catch (error) {
      if (error instanceof ApiError && error.code === "asset_metadata_conflict") {
        try {
          const latest = await api.asset(assetId);
          setMetadata(latest.metadata);
        } catch {
          // Keep the user's unsaved fields and the original version visible.
        }
        setStatus("conflict");
      } else {
        setStatus("error");
      }
    }
  };

  return <div className="sf-asset-properties">
    <label><span>{labels.alt}</span><textarea value={alt} disabled={decorative} maxLength={1000} placeholder={labels.unsetAlt} onChange={event => { setAlt(event.target.value); setStatus("idle"); }}/></label>
    <label className="sf-asset-decorative"><input type="checkbox" checked={decorative} onChange={event => { setDecorative(event.target.checked); setStatus("idle"); }}/><span>{labels.decorative}</span></label>
    <section className="sf-property-translations"><strong>{labels.translatedAlt}</strong>
      <div className="sf-property-locale-add"><select aria-label={labels.language} value={selectedLocale} disabled={!selectedLocale} onChange={event => setNewLocale(event.target.value)}>{availableLocales.map(locale => <option key={locale.code} value={locale.code}>{locale.label}</option>)}</select><button type="button" disabled={!selectedLocale} onClick={() => { setTranslations(current => ({ ...current, [selectedLocale]: "" })); setNewLocale(""); setStatus("idle"); }}>{labels.addLanguage}</button></div>
      {activeLocales.map(locale => <label key={locale}><span>{locales.find(item => item.code === locale)?.label ?? locale}</span><textarea value={translations[locale] ?? ""} maxLength={1000} placeholder={labels.inheritAlt} onChange={event => { setTranslations(current => ({ ...current, [locale]: event.target.value })); setStatus("idle"); }}/></label>)}
    </section>
    <label><span>{labels.assetTitle}</span><input value={title} maxLength={200} onChange={event => { setTitle(event.target.value); setStatus("idle"); }}/></label>
    <label><span>{labels.tags}</span><input value={tags} onChange={event => { setTags(event.target.value); setStatus("idle"); }}/></label>
    {usageAvailable && <section className="sf-property-usages"><strong>{labels.usages} ({usages.length})</strong>{usages.length === 0 ? <small>{labels.noUsages}</small> : usages.map(usage => <a key={usage.referenceId} href={usage.url ?? undefined} target={usage.url ? "_blank" : undefined} rel="noopener noreferrer"><span>{usage.label}</span>{usage.context && <small>{usage.context}</small>}</a>)}</section>}
    <div className="sf-property-save"><span className={status === "conflict" || status === "error" ? "sf-warning" : "sf-muted"}>{status === "saving" ? labels.loading : status === "saved" && !dirty ? labels.saved : status === "conflict" ? labels.conflict : status === "error" ? labels.error : dirty ? labels.unsaved : ""}</span><button className="primary" type="button" disabled={!dirty || status === "saving"} onClick={() => void save()}>{labels.save}</button></div>
  </div>;
}
