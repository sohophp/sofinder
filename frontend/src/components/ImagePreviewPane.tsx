import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type WheelEvent } from "react";
import type { Api } from "../api";
import { formatSize } from "../format";
import type { Entry, ImageInfo } from "../types";

type Zoom = "fit" | 25 | 50 | 100 | 200;
const zooms: Array<Exclude<Zoom, "fit">> = [25, 50, 100, 200];
const confirmationByteLimit = 25 * 1024 * 1024;
const confirmationPixelLimit = 40_000_000;

export default function ImagePreviewPane({ api, resource, entry, labels }: {
  api: Api;
  resource: string;
  entry: Entry;
  labels: {
    actual: string;
    fit: string;
    zoom: string;
    center: string;
    loading: string;
    failed: string;
    retry: string;
    warning: string;
    continue: string;
    cancel: string;
    dimensions: string;
    size: string;
  };
}) {
  const [zoom, setZoom] = useState<Zoom>("fit");
  const [info, setInfo] = useState<ImageInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [confirmedLargeOriginal, setConfirmedLargeOriginal] = useState(false);
  const [pendingZoom, setPendingZoom] = useState<Exclude<Zoom, "fit"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let active = true;
    setInfo(null); setInfoLoading(true); setZoom("fit"); setConfirmedLargeOriginal(false); setPendingZoom(null);
    void api.imageInfo(resource, entry.path).then(value => { if (active) setInfo(value); }).catch(() => undefined).finally(() => { if (active) setInfoLoading(false); });
    return () => {
      active = false;
      if (image.current) image.current.removeAttribute("src");
    };
  }, [api, resource, entry.path]);

  const largeOriginal = entry.size > confirmationByteLimit || (info !== null && info.width * info.height > confirmationPixelLimit);
  const changeZoom = (next: Zoom) => {
    if (next === "fit") { setPendingZoom(null); setZoom("fit"); return; }
    if (infoLoading) return;
    if (largeOriginal && !confirmedLargeOriginal) { setPendingZoom(next); return; }
    setPendingZoom(null); setZoom(next);
  };
  const source = zoom === "fit" ? api.thumbnailUrl(resource, entry, 512, 512) : api.contentUrl(resource, entry.path);
  const retrySource = attempt === 0 ? source : `${source}${source.includes("?") ? "&" : "?"}retry=${attempt}`;
  useEffect(() => { setLoading(true); setFailed(false); setAttempt(0); }, [source]);

  const center = () => {
    const element = viewport.current;
    if (!element) return;
    element.scrollTo({ left: Math.max(0, (element.scrollWidth - element.clientWidth) / 2), top: Math.max(0, (element.scrollHeight - element.clientHeight) / 2), behavior: "smooth" });
  };
  const stepZoom = (direction: number) => {
    const current = zoom === "fit" ? 100 : zoom;
    const next = direction > 0 ? zooms.find(value => value > current) ?? 200 : [...zooms].reverse().find(value => value < current) ?? 25;
    changeZoom(next);
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    stepZoom(event.deltaY < 0 ? 1 : -1);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "+" || event.key === "=") { event.preventDefault(); stepZoom(1); }
    else if (event.key === "-") { event.preventDefault(); stepZoom(-1); }
    else if (event.key === "0") { event.preventDefault(); changeZoom(100); }
    else if (event.key.toLowerCase() === "f") { event.preventDefault(); changeZoom("fit"); }
  };
  const imageStyle = useMemo(() => zoom === "fit" || info === null ? undefined : { width: `${Math.max(1, Math.round(info.width * zoom / 100))}px`, height: "auto" }, [info, zoom]);

  return <section className="sf-image-preview-pane">
    <div className="sf-image-preview-toolbar" role="toolbar" aria-label={labels.zoom}>
      <button type="button" className={zoom === "fit" ? "active" : ""} aria-pressed={zoom === "fit"} onClick={() => changeZoom("fit")}>{labels.fit}</button>
      {zooms.map(value => <button type="button" key={value} className={zoom === value ? "active" : ""} aria-pressed={zoom === value} disabled={infoLoading} onClick={() => changeZoom(value)}>{value === 100 ? labels.actual : `${value}%`}</button>)}
      <span className="sf-image-zoom-level" aria-live="polite">{zoom === "fit" ? labels.fit : `${zoom}%`}</span>
      <button type="button" onClick={center} disabled={zoom === "fit"}>{labels.center}</button>
    </div>
    <div ref={viewport} className={`sf-file-preview-content sf-image-preview-viewport${zoom === "fit" ? "" : " sf-image-original-size"}`} tabIndex={0} onWheel={onWheel} onKeyDown={onKeyDown} onDoubleClick={() => changeZoom(zoom === "fit" ? 100 : "fit")}>
      <div className="sf-image-original-canvas">
        {loading && !failed && <div className="sf-image-preview-state" role="status">{labels.loading}</div>}
        {failed
          ? <div className="sf-image-preview-state" role="alert"><span>{labels.failed}</span><button type="button" onClick={() => { setAttempt(value => value + 1); setLoading(true); setFailed(false); }}>{labels.retry}</button></div>
          : <img ref={image} src={retrySource} alt={entry.name} decoding="async" style={imageStyle} onLoad={event => { if (info === null) setInfo({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }); setLoading(false); }} onError={() => { setLoading(false); setFailed(true); }}/>} 
      </div>
      {pendingZoom !== null && <div className="sf-image-preview-confirm" role="alertdialog" aria-modal="true">
        <strong>{labels.warning}</strong>
        <p>{info && `${labels.dimensions}: ${info.width} × ${info.height} · `}{labels.size}: {formatSize(entry.size)}</p>
        <div><button type="button" onClick={() => setPendingZoom(null)}>{labels.cancel}</button><button type="button" className="primary" onClick={() => { setConfirmedLargeOriginal(true); setZoom(pendingZoom); setPendingZoom(null); }}>{labels.continue}</button></div>
      </div>}
    </div>
    <div className="sf-image-preview-info">{info ? `${info.width} × ${info.height}` : "—"} · {formatSize(entry.size)}</div>
  </section>;
}
