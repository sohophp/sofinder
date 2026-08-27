import { useMemo, useState } from "react";
import type { Api } from "../api";
import type { AssetSearchOptions, AssetSearchResult } from "../types";
import { formatSize } from "../format";
import { Modal } from "./Modal";
import { EntryIcon } from "./EntryVisuals";
import { UiIcon } from "./UiIcon";

type Scope = "directory" | "resource" | "all";
type Field = "name" | "title" | "alt" | "tags";
interface SavedSearch { keyword: string; scope: Scope; type: NonNullable<AssetSearchOptions["type"]>; tags: string; extensions: string }

const storageKey = "sofinder.assetSearch.recent.v1";
const recentSearches = (): SavedSearch[] => {
  try { const value = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(value) ? value.slice(0, 5) : []; } catch { return []; }
};
const csv = (value: string) => value.split(/[,，]/).map(item => item.trim()).filter(Boolean);
const startOfDay = (value: string): number | undefined => value ? Math.floor(new Date(`${value}T00:00:00`).getTime() / 1000) : undefined;
const endOfDay = (value: string): number | undefined => value ? Math.floor(new Date(`${value}T23:59:59`).getTime() / 1000) : undefined;

export function AssetSearchDialog({ api, resources, currentResource, currentPath, labels, formatDate, onOpen, onClose }: {
  api: Api;
  resources: string[];
  currentResource: string;
  currentPath: string;
  labels: Record<string, string>;
  formatDate: (timestamp: number) => string;
  onOpen: (resource: string, path: string) => void;
  onClose: () => void;
}) {
  const params = new URL(window.location.href).searchParams;
  const [keyword, setKeyword] = useState(params.get("asset_q") ?? "");
  const [scope, setScope] = useState<Scope>((params.get("asset_scope") as Scope) || "all");
  const [type, setType] = useState<NonNullable<AssetSearchOptions["type"]>>((params.get("asset_type") as NonNullable<AssetSearchOptions["type"]>) || "all");
  const [tags, setTags] = useState(params.get("asset_tags") ?? "");
  const [extensions, setExtensions] = useState(params.get("asset_ext") ?? "");
  const [minimumSize, setMinimumSize] = useState("");
  const [maximumSize, setMaximumSize] = useState("");
  const [modifiedAfter, setModifiedAfter] = useState("");
  const [modifiedBefore, setModifiedBefore] = useState("");
  const [fields, setFields] = useState<Set<Field>>(new Set(["name", "title", "alt", "tags"]));
  const [result, setResult] = useState<AssetSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState(recentSearches);
  const filters = useMemo(() => [keyword, type !== "all" ? labels[type || "all"] : "", ...csv(tags), ...csv(extensions).map(value => `.${value}`), modifiedAfter, modifiedBefore].filter(Boolean), [keyword, type, tags, extensions, modifiedAfter, modifiedBefore, labels]);

  const execute = async (offset = 0, saved?: SavedSearch) => {
    const values = saved ?? { keyword, scope, type, tags, extensions };
    if (saved) { setKeyword(saved.keyword); setScope(saved.scope); setType(saved.type); setTags(saved.tags); setExtensions(saved.extensions); }
    const selectedFields = Array.from(fields);
    if (selectedFields.length === 0) return;
    setLoading(true); setError("");
    const options: AssetSearchOptions = {
      keyword: values.keyword, resources: values.scope === "all" ? resources : [currentResource], path: values.scope === "directory" ? currentPath : "", fields: selectedFields,
      tags: csv(values.tags), extensions: csv(values.extensions).map(value => value.replace(/^\./, "").toLowerCase()), type: values.type,
      minimumSize: minimumSize ? Math.round(Number(minimumSize) * 1024 * 1024) : undefined, maximumSize: maximumSize ? Math.round(Number(maximumSize) * 1024 * 1024) : undefined,
      modifiedAfter: startOfDay(modifiedAfter), modifiedBefore: endOfDay(modifiedBefore), offset, limit: 50,
    };
    try {
      const response = await api.searchAssets(options); setResult(response);
      const next: SavedSearch = values;
      const updated = [next, ...recent.filter(item => JSON.stringify(item) !== JSON.stringify(next))].slice(0, 5);
      setRecent(updated); localStorage.setItem(storageKey, JSON.stringify(updated));
      const url = new URL(window.location.href); url.searchParams.set("asset_q", values.keyword); url.searchParams.set("asset_scope", values.scope); url.searchParams.set("asset_type", values.type || "all");
      values.tags ? url.searchParams.set("asset_tags", values.tags) : url.searchParams.delete("asset_tags"); values.extensions ? url.searchParams.set("asset_ext", values.extensions) : url.searchParams.delete("asset_ext"); history.replaceState(history.state, "", url);
    } catch (reason) { setError(reason instanceof Error ? reason.message : labels.searchFailed); }
    finally { setLoading(false); }
  };
  const close = () => { const url = new URL(window.location.href); ["asset_q", "asset_scope", "asset_type", "asset_tags", "asset_ext"].forEach(key => url.searchParams.delete(key)); history.replaceState(history.state, "", url); onClose(); };

  return <Modal title={labels.advancedSearch} closeLabel={labels.close} onClose={close} className="sf-asset-search-modal" footer={<button type="button" onClick={close}>{labels.close}</button>}>
    <div className="sf-asset-search-body">
      <form onSubmit={event => { event.preventDefault(); void execute(); }}>
        <label className="sf-search-query"><span>{labels.keywords}</span><input autoFocus value={keyword} maxLength={200} onChange={event => setKeyword(event.target.value)} placeholder={labels.searchAssets}/></label>
        <div className="sf-asset-search-grid">
          <label><span>{labels.scope}</span><select value={scope} onChange={event => setScope(event.target.value as Scope)}><option value="directory">{labels.currentDirectory}</option><option value="resource">{labels.currentResource}</option><option value="all">{labels.allResources}</option></select></label>
          <label><span>{labels.type}</span><select value={type} onChange={event => setType(event.target.value as NonNullable<AssetSearchOptions["type"]>)}><option value="all">{labels.allTypes}</option><option value="image">{labels.image}</option><option value="document">{labels.document}</option><option value="audio">{labels.audio}</option><option value="video">{labels.video}</option><option value="archive">{labels.archive}</option><option value="other">{labels.other}</option></select></label>
          <label><span>{labels.tags}</span><input value={tags} onChange={event => setTags(event.target.value)} placeholder={labels.commaSeparated}/></label>
          <label><span>{labels.extensions}</span><input value={extensions} onChange={event => setExtensions(event.target.value)} placeholder="jpg, pdf, docx"/></label>
          <label><span>{labels.minimumSize}</span><input type="number" min="0" step="0.1" value={minimumSize} onChange={event => setMinimumSize(event.target.value)}/></label>
          <label><span>{labels.maximumSize}</span><input type="number" min="0" step="0.1" value={maximumSize} onChange={event => setMaximumSize(event.target.value)}/></label>
          <label><span>{labels.modifiedAfter}</span><input type="date" value={modifiedAfter} onChange={event => setModifiedAfter(event.target.value)}/></label>
          <label><span>{labels.modifiedBefore}</span><input type="date" value={modifiedBefore} onChange={event => setModifiedBefore(event.target.value)}/></label>
        </div>
        <fieldset><legend>{labels.searchFields}</legend>{(["name", "title", "alt", "tags"] as Field[]).map(field => <label key={field}><input type="checkbox" checked={fields.has(field)} onChange={event => setFields(current => { const next = new Set(current); event.target.checked ? next.add(field) : next.delete(field); return next; })}/><span>{labels[field]}</span></label>)}</fieldset>
        <button className="primary sf-run-asset-search" type="submit" disabled={loading || fields.size === 0}><UiIcon name="search"/>{loading ? labels.searching : labels.search}</button>
      </form>
      {recent.length > 0 && <section className="sf-recent-searches"><h3>{labels.recentSearches}</h3><div>{recent.map((item, index) => <button type="button" key={`${item.keyword}-${index}`} onClick={() => void execute(0, item)}>{item.keyword || labels.filteredAssets}</button>)}</div></section>}
      {filters.length > 0 && <div className="sf-search-filter-chips">{filters.map((filter, index) => <span key={`${filter}-${index}`}>{filter}</span>)}</div>}
      {error && <p className="sf-warning" role="alert">{error}</p>}
      {result && <section className="sf-asset-search-results"><header><strong>{labels.results.replace("{count}", String(result.total))}</strong><small>{labels.scanned.replace("{count}", String(result.scanned))}{result.truncated ? ` · ${labels.truncated}` : ""}</small></header>{result.items.length === 0 ? <p>{labels.noResults}</p> : <div>{result.items.map(item => <button type="button" key={`${item.resource}:${item.entry.path}`} onClick={() => { close(); onOpen(item.resource, item.entry.path); }}><EntryIcon name={item.entry.name} mimeType={item.entry.mimeType} directory={false}/><span><strong>{item.entry.name}</strong><small>{item.resource} · {item.entry.path}</small>{item.metadata.title && <small>{item.metadata.title}</small>}<span>{item.metadata.tags.map(tag => <i key={tag}>{tag}</i>)}</span></span><time dateTime={new Date(item.entry.modifiedAt * 1000).toISOString()}>{formatDate(item.entry.modifiedAt)}</time><b>{formatSize(item.entry.size)}</b></button>)}</div>}{result.total > result.limit && <nav><button type="button" disabled={result.offset === 0 || loading} onClick={() => void execute(Math.max(0, result.offset - result.limit))}>{labels.previous}</button><span>{result.offset + 1}–{Math.min(result.total, result.offset + result.limit)} / {result.total}</span><button type="button" disabled={result.offset + result.limit >= result.total || loading} onClick={() => void execute(result.offset + result.limit)}>{labels.next}</button></nav>}</section>}
    </div>
  </Modal>;
}
