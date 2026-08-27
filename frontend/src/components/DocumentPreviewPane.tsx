import { useEffect, useRef, useState } from "react";
import type { Api } from "../api";
import type { DocumentPreviewJob, Entry } from "../types";

export default function DocumentPreviewPane({ api, resource, entry, labels }: {
  api: Api;
  resource: string;
  entry: Entry;
  labels: { submitting: string; queued: string; converting: string; loading: string; failed: string; retry: string; elapsed: (seconds: number) => string };
}) {
  const [job, setJob] = useState<DocumentPreviewJob | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());
  const openedAt = useRef(Date.now());

  useEffect(() => {
    openedAt.current = Date.now(); setNow(Date.now()); setShowProgress(false); setFrameLoaded(false);
    const delay = window.setTimeout(() => setShowProgress(true), 180);
    return () => window.clearTimeout(delay);
  }, [attempt, entry.path, resource]);
  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(clock);
  }, []);

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

  if (job?.status === "ready" && job.previewUrl) return <div className="sf-document-preview-frame"><iframe className="sf-document-preview" src={job.previewUrl} title={entry.name} onLoad={() => setFrameLoaded(true)}/>{!frameLoaded && <div className="sf-document-preview-progress" role="status">{labels.loading}</div>}</div>;
  if (error || job?.status === "failed" || job?.status === "expired") return <div className="sf-file-preview-fallback"><p className="sf-warning" role="alert">{job?.error?.message || error || labels.failed}</p><button onClick={() => { setError(""); setJob(null); setAttempt(value => value + 1); }}>{labels.retry}</button></div>;
  if (!showProgress) return null;
  const phase = job?.status === "queued" ? labels.queued : job?.status === "running" ? labels.converting : labels.submitting;
  const elapsed = Math.max(0, Math.floor(now / 1000 - (job?.createdAt || openedAt.current / 1000)));
  return <div className="sf-state sf-document-preview-progress" role="status"><span>{phase}</span>{elapsed > 0 && <small>{labels.elapsed(elapsed)}</small>}</div>;
}
