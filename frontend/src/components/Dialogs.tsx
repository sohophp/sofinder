import { useState } from "react";
import { Modal } from "./Modal";

export function TextDialog({ title, label, initialValue = "", maximum, extension = "", confirmLabel, cancelLabel, closeLabel, onConfirm, onClose }: {
  title: string; label: string; initialValue?: string; maximum: number; extension?: string;
  confirmLabel: string; cancelLabel: string; closeLabel: string; onConfirm: (value: string) => void; onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const length = Array.from(value + extension).length;
  const valid = value.trim() !== "" && length <= maximum && !/[\\/\u0000-\u001f]/u.test(value);
  return <Modal title={title} closeLabel={closeLabel} onClose={onClose} className="sf-form-modal" footer={<><span>{length} / {maximum}</span><button onClick={onClose}>{cancelLabel}</button><button className="primary" disabled={!valid} onClick={() => onConfirm(value.trim() + extension)}>{confirmLabel}</button></>}>
    <div className="sf-form-body"><label>{label}<span className="sf-name-input"><input autoFocus value={value} maxLength={maximum} onChange={event => setValue(event.target.value)}/>{extension && <span>{extension}</span>}</span></label>{!valid && value !== "" && <p role="alert">{length > maximum ? `${length} / ${maximum}` : label}</p>}</div>
  </Modal>;
}

export function ConfirmDialog({ title, message, detail, confirmLabel, cancelLabel, closeLabel, danger = false, onConfirm, onClose }: {
  title: string; message: string; detail?: string; confirmLabel: string; cancelLabel: string; closeLabel: string; danger?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return <Modal title={title} closeLabel={closeLabel} onClose={onClose} className="sf-confirm-modal" footer={<><span/><button onClick={onClose}>{cancelLabel}</button><button className={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</button></>}>
    <div className="sf-form-body"><p>{message}</p>{detail && <small>{detail}</small>}</div>
  </Modal>;
}
