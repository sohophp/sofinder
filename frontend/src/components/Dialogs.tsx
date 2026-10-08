import { useId, useState } from "react";
import { Modal } from "./Modal";
import { UiIcon } from "./UiIcon";
import { entryNameIssue } from "../nameValidation";
import type { UploadConflictStrategy } from "../types";

export function TextDialog({ title, label, initialValue = "", maximum, extension = "", invalidNameLabel, confirmLabel, cancelLabel, closeLabel, onConfirm, onClose }: {
  title: string; label: string; initialValue?: string; maximum: number; extension?: string;
  invalidNameLabel: string; confirmLabel: string; cancelLabel: string; closeLabel: string; onConfirm: (value: string) => void; onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const formId = useId();
  const completeName = value + extension;
  const length = Array.from(completeName).length;
  const issue = entryNameIssue(completeName, maximum);
  const valid = issue === null;
  return <Modal title={title} closeLabel={closeLabel} onClose={onClose} className="sf-form-modal" footer={<><span>{length} / {maximum}</span><button type="button" onClick={onClose}>{cancelLabel}</button><button type="submit" form={formId} className="primary" disabled={!valid}>{confirmLabel}</button></>}>
    <form id={formId} className="sf-form-body" onSubmit={event => { event.preventDefault(); if (valid) onConfirm(value.trim() + extension); }}><label>{label}<span className="sf-name-input"><input autoFocus value={value} maxLength={maximum} onChange={event => setValue(event.target.value)} onKeyDown={event => {
      // Enter choosing an IME candidate must not submit the dialog (including Safari's 229 key code).
      if (event.key === "Enter" && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229 || event.repeat)) event.preventDefault();
    }}/>{extension && <span>{extension}</span>}</span></label>{!valid && value !== "" && <p role="alert">{issue === "tooLong" ? `${length} / ${maximum}` : invalidNameLabel}</p>}</form>
  </Modal>;
}

export function ConfirmDialog({ title, message, detail, confirmLabel, cancelLabel, closeLabel, danger = false, onConfirm, onClose }: {
  title: string; message: string; detail?: string; confirmLabel: string; cancelLabel: string; closeLabel: string; danger?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return <Modal title={title} closeLabel={closeLabel} onClose={onClose} className="sf-confirm-modal" footer={<><span/><button onClick={onClose}>{cancelLabel}</button><button className={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</button></>}>
    <div className="sf-form-body"><p>{message}</p>{detail && <small>{detail}</small>}</div>
  </Modal>;
}

export function UploadConflictDialog({ fileName, title, renameLabel, overwriteLabel, skipLabel, rememberLabel, closeLabel, onChoose }: {
  fileName: string;
  title: string;
  renameLabel: string;
  overwriteLabel: string;
  skipLabel: string;
  rememberLabel: string;
  closeLabel: string;
  onChoose: (strategy: Exclude<UploadConflictStrategy, "ask">, remember: boolean) => void;
}) {
  const [remember, setRemember] = useState(false);
  return <Modal title={title} closeLabel={closeLabel} onClose={() => onChoose("skip", false)} className="sf-confirm-modal sf-upload-conflict-modal" footer={<><button onClick={() => onChoose("skip", remember)}>{skipLabel}</button><button className="primary" onClick={() => onChoose("rename", remember)}>{renameLabel}</button><button className="danger" onClick={() => onChoose("overwrite", remember)}>{overwriteLabel}</button></>}>
    <div className="sf-form-body"><div className="sf-upload-conflict-file"><UiIcon name="file"/><span title={fileName}>{fileName}</span></div><label className="sf-upload-conflict-remember"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)}/><span>{rememberLabel}</span></label></div>
  </Modal>;
}
