import { useState } from "react";
import { Modal } from "./Modal";
import { entryNameIssue } from "../nameValidation";
import type { UploadConflictStrategy } from "../types";

export function TextDialog({ title, label, initialValue = "", maximum, extension = "", invalidNameLabel, confirmLabel, cancelLabel, closeLabel, onConfirm, onClose }: {
  title: string; label: string; initialValue?: string; maximum: number; extension?: string;
  invalidNameLabel: string; confirmLabel: string; cancelLabel: string; closeLabel: string; onConfirm: (value: string) => void; onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const completeName = value + extension;
  const length = Array.from(completeName).length;
  const issue = entryNameIssue(completeName, maximum);
  const valid = issue === null;
  return <Modal title={title} closeLabel={closeLabel} onClose={onClose} className="sf-form-modal" footer={<><span>{length} / {maximum}</span><button onClick={onClose}>{cancelLabel}</button><button className="primary" disabled={!valid} onClick={() => onConfirm(value.trim() + extension)}>{confirmLabel}</button></>}>
    <div className="sf-form-body"><label>{label}<span className="sf-name-input"><input autoFocus value={value} maxLength={maximum} onChange={event => setValue(event.target.value)}/>{extension && <span>{extension}</span>}</span></label>{!valid && value !== "" && <p role="alert">{issue === "tooLong" ? `${length} / ${maximum}` : invalidNameLabel}</p>}</div>
  </Modal>;
}

export function ConfirmDialog({ title, message, detail, confirmLabel, cancelLabel, closeLabel, danger = false, onConfirm, onClose }: {
  title: string; message: string; detail?: string; confirmLabel: string; cancelLabel: string; closeLabel: string; danger?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return <Modal title={title} closeLabel={closeLabel} onClose={onClose} className="sf-confirm-modal" footer={<><span/><button onClick={onClose}>{cancelLabel}</button><button className={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</button></>}>
    <div className="sf-form-body"><p>{message}</p>{detail && <small>{detail}</small>}</div>
  </Modal>;
}

export function UploadConflictDialog({ fileName, title, renameLabel, overwriteLabel, skipLabel, closeLabel, onChoose }: {
  fileName: string;
  title: string;
  renameLabel: string;
  overwriteLabel: string;
  skipLabel: string;
  closeLabel: string;
  onChoose: (strategy: Exclude<UploadConflictStrategy, "ask">) => void;
}) {
  return <Modal title={title} closeLabel={closeLabel} onClose={() => onChoose("skip")} className="sf-confirm-modal" footer={<><button onClick={() => onChoose("skip")}>{skipLabel}</button><button className="primary" onClick={() => onChoose("rename")}>{renameLabel}</button><button className="danger" onClick={() => onChoose("overwrite")}>{overwriteLabel}</button></>}>
    <div className="sf-form-body"><p>{fileName}</p></div>
  </Modal>;
}
