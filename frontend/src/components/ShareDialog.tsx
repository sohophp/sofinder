import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Modal } from "./Modal";

export default function ShareDialog({ url, fileName, loginRequired, expiresAt, showQrCode, labels, formatDate, onClose }: {
  url: string;
  fileName: string;
  loginRequired: boolean;
  expiresAt?: number;
  showQrCode: boolean;
  labels: { title: string; close: string; copyUrl: string; copied: string; copyFailed: string; downloadQr: string; loginRequired: string; expires: string; hint: string; qrCode: string; qrFailed: string };
  formatDate: (timestamp: number) => string;
  onClose: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState<"" | "copied" | "failed">("");
  const [image, setImage] = useState("");
  const [qrFailed, setQrFailed] = useState(false);
  useEffect(() => {
    if (!showQrCode) return;
    let active = true;
    QRCode.toDataURL(url, { width: 320, margin: 2, errorCorrectionLevel: "M", color: { dark: "#111827", light: "#ffffff" } })
      .then(value => { if (active) setImage(value); })
      .catch(() => { if (active) setQrFailed(true); });
    return () => { active = false; };
  }, [showQrCode, url]);
  const copy = async () => {
    input.current?.focus(); input.current?.select();
    try { await navigator.clipboard.writeText(url); setCopyStatus("copied"); }
    catch { setCopyStatus("failed"); }
  };
  const safeName = fileName.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 100) || "file";
  return <Modal title={labels.title} closeLabel={labels.close} onClose={onClose} className="sf-share-modal" footer={<button className="primary" onClick={onClose}>{labels.close}</button>}>
    <p className="sf-share-hint">{labels.hint}</p>
    <div className={`sf-share-layout${showQrCode ? " has-qr" : ""}`}>
      <section className="sf-share-url">
        <h3>{labels.copyUrl}</h3>
        <input ref={input} readOnly value={url} aria-label={labels.copyUrl} onFocus={event => event.currentTarget.select()}/>
        <button className="primary" onClick={() => void copy()}>{labels.copyUrl}</button>
        <span role="status" aria-live="polite">{copyStatus === "copied" ? labels.copied : copyStatus === "failed" ? labels.copyFailed : ""}</span>
        {(loginRequired || expiresAt) && <dl className="sf-share-meta">{loginRequired && <><dt>{labels.loginRequired}</dt><dd>✓</dd></>}{expiresAt && <><dt>{labels.expires}</dt><dd><time dateTime={new Date(expiresAt * 1000).toISOString()}>{formatDate(expiresAt)}</time></dd></>}</dl>}
      </section>
      {showQrCode && <section className="sf-share-qr"><h3>{labels.qrCode}</h3><div className="sf-qr-code">{qrFailed ? <p className="sf-warning" role="alert">{labels.qrFailed}</p> : image ? <img src={image} alt={labels.qrCode}/> : <div className="sf-state">…</div>}</div><a className="sf-download" href={image || undefined} download={`${safeName}-qr.png`} aria-disabled={!image}>{labels.downloadQr}</a></section>}
    </div>
  </Modal>;
}
