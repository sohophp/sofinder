import { useEffect, useState } from "react";
import { UiIcon } from "./UiIcon";
import { NotificationText } from "./NotificationText";

export interface NotificationItem { id: number; message: string; details?: string[]; kind: "info" | "success" | "warning" | "error"; createdAt: number }
export interface ToastItem { id: number; message: string; kind: NotificationItem["kind"]; expiresAt: number }

export function ToastQueue({ items, closeLabel, action, onDismiss }: { items: ToastItem[]; closeLabel: string; action?: { message: string; label: string; run: () => Promise<void>; secondary?: { label: string; run: () => Promise<void> } } | null; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timers = items.map(item => window.setTimeout(() => onDismiss(item.id), Math.max(0, item.expiresAt - Date.now())));
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, [items, onDismiss]);
  return <div className="sf-toast-queue" aria-live="polite">{items.map(item => <div key={item.id} className={`sf-toast ${item.kind}`} role="alert"><UiIcon name={item.kind === "success" ? "select" : item.kind === "info" ? "notifications" : "warning"}/><div><span><NotificationText text={item.message}/></span>{action?.message === item.message && <div className="sf-toast-actions"><button type="button" onClick={() => void action.run()}>{action.label}</button>{action.secondary && <button type="button" onClick={() => void action.secondary?.run()}>{action.secondary.label}</button>}</div>}</div><button type="button" className="sf-toast-close" onClick={() => onDismiss(item.id)} aria-label={closeLabel}><UiIcon name="close"/></button></div>)}</div>;
}

export function NotificationCenter({ items, labels, formatTime, onClear }: { items: NotificationItem[]; labels: { title: string; empty: string; clear: string; details: string; close: string }; formatTime: (timestamp: number) => string; onClear: () => void }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggleDetails = (id: number) => setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return <div className="sf-notification-center">
    {open && <section className="sf-notification-panel" aria-label={labels.title}>
      <header><strong>{labels.title}</strong><span>{items.length}</span><button type="button" disabled={items.length === 0} onClick={onClear}>{labels.clear}</button><button type="button" className="sf-icon-only" onClick={() => setOpen(false)} aria-label={labels.close}><UiIcon name="close"/></button></header>
      <div className="sf-notification-list">{items.length === 0 ? <p>{labels.empty}</p> : items.map(item => <article key={item.id} className={`sf-notification-item ${item.kind}`}>
        <i aria-hidden="true"/><div><p><NotificationText text={item.message}/></p><time dateTime={new Date(item.createdAt).toISOString()}>{formatTime(item.createdAt)}</time>{item.details && item.details.length > 0 && <><button type="button" className="sf-notification-details-toggle" aria-expanded={expanded.has(item.id)} onClick={() => toggleDetails(item.id)}>{labels.details} ({item.details.length})</button>{expanded.has(item.id) && <ul>{item.details.map((detail, index) => <li key={`${detail}-${index}`}><NotificationText text={detail}/></li>)}</ul>}</>}</div>
      </article>)}</div>
    </section>}
    <button type="button" className="sf-notification-trigger" aria-label={labels.title} title={labels.title} aria-expanded={open} onClick={() => setOpen(value => !value)}><UiIcon name="notifications"/>{items.length > 0 && <span>{Math.min(items.length, 99)}</span>}</button>
  </div>;
}
