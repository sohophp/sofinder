import { useEffect, useRef, useState } from "react";

export const EntryIcon = ({ kind }: { kind: "folder" | "file" | "image" }) => {
  if (kind === "folder") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 12h15l4 5h19v23H5z" fill="currentColor" opacity=".2"/><path d="M5 12h15l4 5h19v23H5z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>;
  if (kind === "image") return <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="5" width="34" height="38" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="17" cy="16" r="4" fill="currentColor" opacity=".35"/><path d="m10 37 10-11 7 7 5-5 7 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h19l9 9v29H10z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M29 5v10h9" fill="none" stroke="currentColor" strokeWidth="2.5"/></svg>;
};

export const LinkIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 14.5 14.5 9M7.8 17.2l-1.1 1.1a3.5 3.5 0 0 1-5-5l3.6-3.6a3.5 3.5 0 0 1 5 0M16.2 6.8l1.1-1.1a3.5 3.5 0 1 1 5 5l-3.6 3.6a3.5 3.5 0 0 1-5 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;

export const ThumbnailImage = ({ src, alt, lazy = false }: { src: string; alt: string; lazy?: boolean }) => {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const retryTimer = useRef<number | null>(null);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
    return () => { if (retryTimer.current !== null) window.clearTimeout(retryTimer.current); };
  }, [src]);

  if (failed) return <EntryIcon kind="image"/>;
  const retrySrc = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return <img src={retrySrc} alt={alt} loading={lazy ? "lazy" : undefined} decoding="async" onError={() => {
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    if (attempt >= 2) { setFailed(true); return; }
    retryTimer.current = window.setTimeout(() => setAttempt(current => current + 1), 700 * (attempt + 1));
  }}/>;
};
