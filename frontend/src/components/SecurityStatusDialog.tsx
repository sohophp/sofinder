import { useEffect, useState } from "react";
import type { Api } from "../api";
import type { SecurityStatus } from "../types";
import { formatSize } from "../format";
import { Modal } from "./Modal";

export function SecurityStatusDialog({ api, labels, formatDate, onClose }: {
  api: Api;
  labels: { title: string; close: string; loading: string; enabled: string; disabled: string; provider: string; service: string; scans: string; passed: string; quarantined: string; failed: string; pending: string; recent: string; none: string };
  formatDate: (timestamp: number) => string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.securityStatus().then(value => { if (active) setStatus(value); }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : String(reason)); });
    return () => { active = false; };
  }, [api]);

  const scan = status?.malwareScanning;
  return <Modal title={labels.title} closeLabel={labels.close} onClose={onClose} className="sf-security-modal" footer={<button className="primary" onClick={onClose}>{labels.close}</button>}>
    {error ? <p className="sf-warning" role="alert">{error}</p> : !scan ? <div className="sf-state">{labels.loading}</div> : <>
      <section className={`sf-security-summary sf-security-${scan.status}`}>
        <span className="sf-security-indicator" aria-hidden="true"/>
        <div><strong>{scan.enabled ? labels.enabled : labels.disabled}</strong><small>{scan.message}</small></div>
        <dl><dt>{labels.provider}</dt><dd>{scan.provider ?? "—"}</dd><dt>{labels.service}</dt><dd>{scan.status}</dd></dl>
      </section>
      <div className="sf-security-counts" aria-label={labels.scans}>
        <span><b>{scan.counts.passed}</b>{labels.passed}</span><span><b>{scan.counts.quarantined}</b>{labels.quarantined}</span><span><b>{scan.counts.failed}</b>{labels.failed}</span><span><b>{scan.counts.pending}</b>{labels.pending}</span>
      </div>
      <h3>{labels.recent}</h3>
      {scan.recent.length === 0 ? <div className="sf-state">{labels.none}</div> : <div className="sf-security-history">
        {scan.recent.map(item => <article key={item.id}><span className={`sf-scan-status sf-scan-${item.status}`}>{item.status}</span><div><strong>{item.fileName}</strong><small>{item.resource} · {formatSize(item.bytes)} · {formatDate(item.finishedAt ?? item.startedAt)}{item.durationMilliseconds !== null ? ` · ${item.durationMilliseconds} ms` : ""}</small></div>{item.code && <code>{item.code}</code>}</article>)}
      </div>}
    </>}
  </Modal>;
}
