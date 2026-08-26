import { useMemo, useState } from "react";
import type { Entry } from "../types";
import { entryNameIssue } from "../nameValidation";
import { Modal } from "./Modal";

const applyPattern = (entry: Entry, pattern: string, index: number) => {
  const dot = entry.directory ? -1 : entry.name.lastIndexOf(".");
  const extension = dot > 0 ? entry.name.slice(dot) : "";
  const stem = extension ? entry.name.slice(0, dot) : entry.name;
  return pattern.replaceAll("{name}", stem).replaceAll("{ext}", extension).replaceAll("{n}", String(index + 1));
};

export function BulkRenameDialog({ entries, maximum, labels, onClose, onSave }: {
  entries: Entry[];
  maximum: number;
  labels: { title: string; pattern: string; hint: string; oldName: string; newName: string; invalid: string; duplicate: string; cancel: string; save: string; close: string };
  onClose: () => void;
  onSave: (renames: Array<{ path: string; name: string }>) => void;
}) {
  const [pattern, setPattern] = useState("{name}-{n}{ext}");
  const renames = useMemo(() => entries.map((entry, index) => ({ path: entry.path, name: applyPattern(entry, pattern, index) })), [entries, pattern]);
  const names = renames.map(item => item.name.toLocaleLowerCase());
  const duplicate = new Set(names).size !== names.length;
  const invalid = renames.some((item, index) => entryNameIssue(item.name, maximum) !== null || (!entries[index].directory && item.name.slice(item.name.lastIndexOf(".")) !== entries[index].name.slice(entries[index].name.lastIndexOf("."))));
  return <Modal title={labels.title} closeLabel={labels.close} onClose={onClose} className="sf-bulk-rename-modal" footer={<><button onClick={onClose}>{labels.cancel}</button><button className="primary" disabled={invalid || duplicate || pattern.trim() === ""} onClick={() => onSave(renames)}>{labels.save}</button></>}>
    <label className="sf-field"><span>{labels.pattern}</span><input autoFocus value={pattern} onChange={event => setPattern(event.target.value)} maxLength={maximum}/><small>{labels.hint}</small></label>
    {invalid && <p className="sf-warning" role="alert">{labels.invalid}</p>}{duplicate && <p className="sf-warning" role="alert">{labels.duplicate}</p>}
    <div className="sf-rename-preview"><table><thead><tr><th>{labels.oldName}</th><th>{labels.newName}</th></tr></thead><tbody>{entries.map((entry, index) => <tr key={entry.path}><td>{entry.name}</td><td>{renames[index].name}</td></tr>)}</tbody></table></div>
  </Modal>;
}
