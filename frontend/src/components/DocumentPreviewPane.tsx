import { useEffect, useState } from "react";
import type { Api } from "../api";
import type { DocumentPreviewJob, Entry } from "../types";

export default function DocumentPreviewPane({ api, resource, entry, labels }: {
  api: Api;
  resource: string;
  entry: Entry;
  labels: { preparing: string; failed: string; retry: string };
}) {
  const [job, setJob] = useState<DocumentPreviewJob | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;
    const poll = async (current: DocumentPreviewJob) => {
      if (!active || current.status === "ready" || current.status === "failed" || current.status === "expired") return;
      timer = window.setTimeout(async () => {
        try {
          const next = await api.documentPreviewJob(current.id);
          if (!active) return;
          setJob(next);
          void poll(next);
        } catch (reason) {
          if (active) setError(reason instanceof Error ? reason.message : String(reason));
        }
      }, Math.max(500, current.retryAfter * 1000));
    };
    api.prepareDocumentPreview(resource, entry.path, attempt > 0).then(next => {
      if (!active) return;
      setJob(next);
      void poll(next);
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : String(reason)); });
    return () => { active = false; if (timer !== undefined) window.clearTimeout(timer); };
  }, [api, attempt, entry.path, resource]);

  if (job?.status === "ready" && job.previewUrl) return <iframe className="sf-document-preview" src={job.previewUrl} title={entry.name}/>;
  if (error || job?.status === "failed" || job?.status === "expired") return <div className="sf-file-preview-fallback"><p className="sf-warning" role="alert">{job?.error?.message || error || labels.failed}</p><button onClick={() => { setError(""); setJob(null); setAttempt(value => value + 1); }}>{labels.retry}</button></div>;
  return <div className="sf-state" role="status">{labels.preparing}</div>;
}
