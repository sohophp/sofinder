import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { UiIcon } from "./UiIcon";

export type UploadStatus = "queued" | "uploading" | "done" | "skipped" | "error" | "cancelled";
export interface UploadTask { id: string; name: string; progress: number; status: UploadStatus; message?: string }

export function UploadQueue({ tasks, collapsed, labels, onToggle, onCancel, onCancelAll, onClearFinished, onRetry, onRemove }: {
  tasks: UploadTask[];
  collapsed: boolean;
  labels: { title: string; close: string; cancel: string; cancelAll: string; clearFinished: string; retry: string; remove: string; status: (status: UploadStatus) => string };
  onToggle: () => void;
  onCancel: (id: string) => void;
  onCancelAll: () => void;
  onClearFinished: () => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const panel = useRef<HTMLElement>(null);
  const drag = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const [position, setPosition] = useState<CSSProperties | null>(null);
  useEffect(() => {
    const keepInViewport = () => setPosition(current => current && panel.current ? {
      ...current,
      left: Math.max(8, Math.min(Number(current.left), window.innerWidth - panel.current.offsetWidth - 8)),
      top: Math.max(8, Math.min(Number(current.top), window.innerHeight - panel.current.offsetHeight - 8)),
    } : current);
    window.addEventListener("resize", keepInViewport);
    return () => window.removeEventListener("resize", keepInViewport);
  }, []);
  if (tasks.length === 0 || collapsed) return null;
  const active = tasks.some(task => task.status === "queued" || task.status === "uploading");
  const finished = tasks.filter(task => task.status !== "queued" && task.status !== "uploading").length;
  const beginDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    const bounds = panel.current?.getBoundingClientRect();
    if (!bounds) return;
    drag.current = { pointerId: event.pointerId, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (drag.current?.pointerId !== event.pointerId || !panel.current) return;
    const left = Math.max(8, Math.min(event.clientX - drag.current.offsetX, window.innerWidth - panel.current.offsetWidth - 8));
    const top = Math.max(8, Math.min(event.clientY - drag.current.offsetY, window.innerHeight - panel.current.offsetHeight - 8));
    setPosition({ left, top, transform: "none" });
  };
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  return <section ref={panel} className="sf-upload-panel" aria-label={labels.title} style={position ?? undefined}>
    <header className="sf-upload-header" onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
      <strong>{labels.title}</strong><span>{finished}/{tasks.length}</span>
      <div className="sf-upload-actions"><button onClick={onCancelAll} disabled={!active}>{labels.cancelAll}</button><button onClick={onClearFinished}>{labels.clearFinished}</button><button className="sf-upload-close" onClick={onToggle} title={labels.close} aria-label={labels.close}><UiIcon name="close"/></button></div>
    </header>
    <div className="sf-upload-list">{tasks.map(task => <div className={`sf-upload-task ${task.status}`} key={task.id}>
      <span className="sf-upload-name" title={task.name}>{task.name}</span><progress max="100" value={task.progress} aria-label={`${task.name}: ${task.progress}%`}/><span>{task.status === "uploading" ? `${task.progress}%` : labels.status(task.status)}</span>
      {(task.status === "queued" || task.status === "uploading") && <button onClick={() => onCancel(task.id)}>{labels.cancel}</button>}
      {(task.status === "error" || task.status === "cancelled") && <button onClick={() => onRetry(task.id)}>{labels.retry}</button>}
      <button className="sf-upload-remove" onClick={() => onRemove(task.id)} title={labels.remove} aria-label={`${labels.remove}: ${task.name}`}><UiIcon name="close"/></button>
      {task.message && <small title={task.message}>{task.message}</small>}
    </div>)}</div>
  </section>;
}
