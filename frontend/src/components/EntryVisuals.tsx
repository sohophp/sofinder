import { useEffect, useRef, useState } from "react";

export type EntryIconKind = "folder" | "file" | "image" | "pdf" | "word" | "sheet" | "slides" | "archive" | "audio" | "video" | "code" | "text";

const extensionOf = (name: string) => name.includes(".") ? name.split(".").pop()?.toLowerCase() || "" : "";
const has = (extension: string, values: readonly string[]) => values.includes(extension);

export const entryIconKind = (name: string, mimeType: string | null = null, directory = false): EntryIconKind => {
  if (directory) return "folder";
  const extension = extensionOf(name);
  const mime = (mimeType || "").toLowerCase();
  if (extension === "pdf" || mime === "application/pdf") return "pdf";
  if (has(extension, ["doc", "docx", "odt", "rtf"]) || mime.includes("wordprocessing") || mime.includes("msword") || mime.includes("opendocument.text")) return "word";
  if (has(extension, ["xls", "xlsx", "ods", "csv", "tsv"]) || mime.includes("spreadsheet") || mime.includes("ms-excel") || mime.includes("opendocument.spreadsheet") || mime === "text/csv") return "sheet";
  if (has(extension, ["ppt", "pptx", "odp"]) || mime.includes("presentation") || mime.includes("ms-powerpoint")) return "slides";
  if (has(extension, ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "tgz"]) || mime.includes("zip") || mime.includes("compressed") || mime.includes("archive")) return "archive";
  if (mime.startsWith("image/") || has(extension, ["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "svg", "ico", "heic", "heif"])) return "image";
  if (mime.startsWith("audio/") || has(extension, ["mp3", "wav", "flac", "aac", "ogg", "m4a"])) return "audio";
  if (mime.startsWith("video/") || has(extension, ["mp4", "webm", "mov", "avi", "mkv", "m4v"])) return "video";
  if (has(extension, ["js", "jsx", "ts", "tsx", "php", "py", "rb", "go", "rs", "java", "c", "cpp", "h", "css", "scss", "html", "xml", "json", "yaml", "yml", "sh", "sql"]) || ["application/json", "application/xml"].includes(mime)) return "code";
  if (mime.startsWith("text/") || has(extension, ["txt", "md", "log", "ini", "conf"])) return "text";
  return "file";
};

const documentBadge = (label: string) => <>
  <path d="M10 5h19l9 9v29H10z" fill="currentColor" opacity=".1"/><path d="M10 5h19l9 9v29H10zM29 5v10h9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
  <rect x="6" y="27" width="36" height="14" rx="3" fill="currentColor"/><text x="24" y="37" textAnchor="middle" fontSize={8.5} fontWeight="800" fill="white" stroke="none">{label}</text>
</>;

export const EntryIcon = ({ kind, name = "", mimeType = null, directory = false }: { kind?: EntryIconKind; name?: string; mimeType?: string | null; directory?: boolean }) => {
  kind ??= entryIconKind(name, mimeType, directory);
  if (kind === "folder") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 12h15l4 5h19v23H5z" fill="currentColor" opacity=".2"/><path d="M5 12h15l4 5h19v23H5z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>;
  if (kind === "image") return <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="5" width="34" height="38" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="17" cy="16" r="4" fill="currentColor" opacity=".35"/><path d="m10 37 10-11 7 7 5-5 7 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>;
  if (kind === "pdf") return <svg className="sf-file-icon-pdf" viewBox="0 0 48 48" aria-hidden="true">{documentBadge("PDF")}</svg>;
  if (kind === "word") return <svg className="sf-file-icon-word" viewBox="0 0 48 48" aria-hidden="true">{documentBadge("DOC")}</svg>;
  if (kind === "sheet") return <svg className="sf-file-icon-sheet" viewBox="0 0 48 48" aria-hidden="true">{documentBadge("XLS")}</svg>;
  if (kind === "slides") return <svg className="sf-file-icon-slides" viewBox="0 0 48 48" aria-hidden="true">{documentBadge("PPT")}</svg>;
  if (kind === "archive") return <svg className="sf-file-icon-archive" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h19l9 9v29H10zM29 5v10h9" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M23 7h5v5h-5v5h5v5h-5v5h5" fill="none" stroke="currentColor" strokeWidth="2.5"/><rect x="20" y="28" width="11" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5"/></svg>;
  if (kind === "audio") return <svg className="sf-file-icon-audio" viewBox="0 0 48 48" aria-hidden="true"><path d="M18 36V13l20-4v22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><ellipse cx="12" cy="36" rx="7" ry="5" fill="currentColor" opacity=".75"/><ellipse cx="32" cy="31" rx="7" ry="5" fill="currentColor" opacity=".75"/></svg>;
  if (kind === "video") return <svg className="sf-file-icon-video" viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="8" width="38" height="32" rx="5" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="2.5"/><path d="m20 17 13 7-13 7z" fill="currentColor"/></svg>;
  if (kind === "code") return <svg className="sf-file-icon-code" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h19l9 9v29H10zM29 5v10h9" fill="currentColor" opacity=".08" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="m20 22-6 6 6 6m8-12 6 6-6 6m-2-15-4 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (kind === "text") return <svg className="sf-file-icon-text" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h19l9 9v29H10zM29 5v10h9" fill="currentColor" opacity=".08" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M16 22h16M16 28h16M16 34h11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
  return <svg className="sf-file-icon-generic" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h19l9 9v29H10z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M29 5v10h9" fill="none" stroke="currentColor" strokeWidth="2.5"/></svg>;
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
