export type UploadStatus = "queued" | "uploading" | "done" | "error" | "cancelled";
export interface UploadTask { id: string; name: string; progress: number; status: UploadStatus; message?: string }

export function UploadQueue({ tasks, collapsed, labels, onToggle, onCancel, onCancelAll, onClearFinished, onRetry, onRemove }: {
  tasks: UploadTask[];
  collapsed: boolean;
  labels: { title: string; expand: string; collapse: string; cancel: string; cancelAll: string; clearFinished: string; retry: string; remove: string; status: (status: UploadStatus) => string };
  onToggle: () => void;
  onCancel: (id: string) => void;
  onCancelAll: () => void;
  onClearFinished: () => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (tasks.length === 0) return null;
  const active = tasks.some(task => task.status === "queued" || task.status === "uploading");
  const finished = tasks.filter(task => task.status !== "queued" && task.status !== "uploading").length;

  return <section className={`sf-upload-panel${collapsed ? " collapsed" : ""}`} aria-label={labels.title}>
    <header><button className="sf-upload-collapse" onClick={onToggle} aria-expanded={!collapsed} title={collapsed ? labels.expand : labels.collapse}><UiIcon name={collapsed ? "chevron-right" : "chevron-down"}/></button><strong>{labels.title}</strong><span>{finished}/{tasks.length}</span><button onClick={onCancelAll} disabled={!active}>{labels.cancelAll}</button><button onClick={onClearFinished}>{labels.clearFinished}</button></header>
    {!collapsed && <div className="sf-upload-list">{tasks.map(task => <div className={`sf-upload-task ${task.status}`} key={task.id}>
      <span className="sf-upload-name" title={task.name}>{task.name}</span><progress max="100" value={task.progress} aria-label={`${task.name}: ${task.progress}%`}/><span>{task.status === "uploading" ? `${task.progress}%` : labels.status(task.status)}</span>
      {(task.status === "queued" || task.status === "uploading") && <button onClick={() => onCancel(task.id)}>{labels.cancel}</button>}
      {(task.status === "error" || task.status === "cancelled") && <button onClick={() => onRetry(task.id)}>{labels.retry}</button>}
      <button className="sf-upload-remove" onClick={() => onRemove(task.id)} title={labels.remove} aria-label={`${labels.remove}: ${task.name}`}><UiIcon name="close"/></button>
      {task.message && <small title={task.message}>{task.message}</small>}
    </div>)}</div>}
  </section>;
}
import { UiIcon } from "./UiIcon";
