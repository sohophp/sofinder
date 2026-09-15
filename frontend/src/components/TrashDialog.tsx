import { useCallback, useEffect, useState } from "react";
import type { Api } from "../api";
import type { TrashItem, TrashPage } from "../types";
import { Modal } from "./Modal";
import { UiIcon } from "./UiIcon";

export function TrashDialog({ api, resource, locale, labels, onClose, onChanged }: {
  api: Api; resource: string; locale: string;
  labels: { title: string; close: string; cancel: string; empty: string; restore: string; permanentDelete: string; confirmPermanentDelete: string; typeNameToConfirm: string; deleting: string; expires: string; conflict: string; overwrite: string; autoRename: string; usage: string; items: string; previous: string; next: string; search: string };
  onClose: () => void; onChanged: () => void;
}) {
  const [page, setPage] = useState<TrashPage>({ items: [], total: 0, offset: 0, limit: 50, usedItems: 0, usedBytes: 0, maxItems: 0, maxBytes: 0 });
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conflictItem, setConflictItem] = useState<TrashItem | null>(null);
  const [purgeItem, setPurgeItem] = useState<TrashItem | null>(null);
  const [purgeInput, setPurgeInput] = useState("");
  const [purging, setPurging] = useState(false);
  const load = useCallback((requestedOffset = offset) => {
    setLoading(true);
    setError("");
    api.trash(resource, requestedOffset, 50, search).then(data => { setPage(data); setOffset(data.offset); }).catch(reason => setError(reason instanceof Error ? reason.message : String(reason))).finally(() => setLoading(false));
  }, [api, offset, resource, search]);
  useEffect(() => { const timer = window.setTimeout(() => load(offset), 200); return () => window.clearTimeout(timer); }, [load, offset]);
  const restore = async (item: TrashItem) => {
    try {
      await api.restoreTrash(resource, item.id, "cancel");
      load(offset); onChanged();
    } catch (reason) {
      if (reason instanceof Error && "code" in reason && reason.code === "conflict") {
        setConflictItem(item); return;
      }
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  };
  const resolveConflict = async (strategy: "overwrite" | "rename") => {
    if (!conflictItem) return;
    try {
      await api.restoreTrash(resource, conflictItem.id, strategy);
      setConflictItem(null); load(offset); onChanged();
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  };
  const requestPurge = (item: TrashItem) => { setPurgeItem(item); setPurgeInput(""); };
  const purge = async () => {
    if (!purgeItem || purgeInput !== purgeItem.path.split("/").pop() || purging) return;
    setPurging(true);
    try {
      await api.permanentlyDeleteTrash(resource, purgeItem.id);
      setPurgeItem(null); setPurgeInput(""); load(offset);
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setPurging(false); }
  };
  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1024 ** 3 ? `${(bytes / 1024 ** 2).toFixed(1)} MB` : `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  const first = page.total === 0 ? 0 : page.offset + 1;
  const last = Math.min(page.offset + page.items.length, page.total);
  return <><Modal title={labels.title} closeLabel={labels.close} onClose={onClose} inactive={conflictItem !== null || purgeItem !== null} className="sf-trash-modal" footer={<button className="primary" onClick={onClose}>{labels.close}</button>}>
    {error && <div className="sf-notice" role="alert">{error}</div>}
    <div className="sf-trash-usage"><div><strong>{labels.usage}</strong><span>{formatSize(page.usedBytes)} / {formatSize(page.maxBytes)} · {page.usedItems} / {page.maxItems} {labels.items}</span></div><progress max={Math.max(1, page.maxBytes)} value={Math.min(page.usedBytes, page.maxBytes)}/></div>
    <div className="sf-trash-search"><UiIcon name="search"/><input value={search} onChange={event => { setSearch(event.target.value); setOffset(0); }} placeholder={labels.search} aria-label={labels.search}/>{search && <button onClick={() => setSearch("")} aria-label={labels.close}><UiIcon name="close"/></button>}</div>
    <div className="sf-trash-list">{loading ? <p>…</p> : page.items.length === 0 ? <p>{labels.empty}</p> : page.items.map(item => <article key={item.id}>
      <div><strong>{item.path.split("/").pop()}</strong><small title={item.path}>{item.path}</small><small>{item.directory ? labels.items : formatSize(item.size)} · {labels.expires}: {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(item.expiresAt * 1000)}</small></div>
      <button onClick={() => void restore(item)}>{labels.restore}</button><button className="danger" onClick={() => requestPurge(item)}>{labels.permanentDelete}</button>
    </article>)}</div>
    {page.total > page.limit && <nav className="sf-trash-pagination" aria-label={labels.title}><button disabled={page.offset === 0 || loading} onClick={() => setOffset(Math.max(0, page.offset - page.limit))}><UiIcon name="chevron-left"/> {labels.previous}</button><span>{first}–{last} / {page.total}</span><button disabled={page.offset + page.limit >= page.total || loading} onClick={() => setOffset(page.offset + page.limit)}>{labels.next} <UiIcon name="chevron-right"/></button></nav>}
  </Modal>
    {conflictItem && <Modal title={labels.conflict} closeLabel={labels.close} onClose={() => setConflictItem(null)} className="sf-confirm-modal" footer={<><button onClick={() => setConflictItem(null)}>{labels.cancel}</button><button onClick={() => void resolveConflict("rename")}>{labels.autoRename}</button><button className="danger" onClick={() => void resolveConflict("overwrite")}>{labels.overwrite}</button></>}><div className="sf-form-body"><p>{conflictItem.path}</p></div></Modal>}
    {purgeItem && <Modal title={labels.permanentDelete} closeLabel={labels.close} onClose={() => { if (!purging) setPurgeItem(null); }} className="sf-confirm-modal" footer={<><span/><button disabled={purging} onClick={() => setPurgeItem(null)}>{labels.cancel}</button><button className="danger" disabled={purging || purgeInput !== purgeItem.path.split("/").pop()} onClick={() => void purge()}>{purging ? labels.deleting : labels.permanentDelete}</button></>}>
      <div className="sf-form-body"><p role="alert">{labels.confirmPermanentDelete}</p><strong>{purgeItem.path}</strong><label>{labels.typeNameToConfirm.replace("{name}", purgeItem.path.split("/").pop() || purgeItem.path)}<input autoFocus value={purgeInput} disabled={purging} onChange={event => setPurgeInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter") void purge(); }}/></label></div>
    </Modal>}
  </>;
}
