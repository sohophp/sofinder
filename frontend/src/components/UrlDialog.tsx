import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";

export function UrlDialog({ url, loginRequired, expiresAt, labels, onClose }: {
  url: string;
  loginRequired: boolean;
  expiresAt?: number;
  labels: { title: string; close: string; copied: string; failed: string; hint: string; loginRequired: string; expires: string };
  onClose: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"" | "copied" | "failed">("");

  useEffect(() => input.current?.select(), []);

  const copy = async () => {
    input.current?.focus();
    input.current?.select();
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return <Modal title={labels.title} closeLabel={labels.close} onClose={onClose} className="sf-url-modal" footer={<button className="primary" onClick={onClose}>{labels.close}</button>}>
    <div className="sf-url-dialog-body">
      <p>{labels.hint}</p>
      <input ref={input} autoFocus readOnly value={url} aria-label={labels.title} onFocus={event => event.currentTarget.select()} onClick={() => void copy()}/>
      {loginRequired && <small>{labels.loginRequired}</small>}
      {expiresAt && <small>{labels.expires}: <time dateTime={new Date(expiresAt * 1000).toISOString()}>{new Date(expiresAt * 1000).toLocaleString()}</time></small>}
      <span role="status" aria-live="polite">{status === "copied" ? labels.copied : status === "failed" ? labels.failed : ""}</span>
    </div>
  </Modal>;
}
