import { useCallback, useEffect, useRef, useState } from "react";
import type { Entry, ImageAction, ImageInfo } from "../types";
import { Modal } from "./Modal";

interface Rect { x: number; y: number; width: number; height: number }
type Ratio = "free" | "original" | "1:1" | "4:3" | "16:9";
type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export function ImageEditor({ entry, info, imageUrl, labels, onClose, onSave }: {
  entry: Entry; info: ImageInfo; imageUrl: string;
  labels: Record<string, string>;
  onClose: () => void;
  onSave: (actions: ImageAction[], save: { mode: "copy" | "overwrite"; name?: string }) => Promise<void>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement | null>(null);
  const drag = useRef<{ mode: "select" | "move" | "resize" | "pan"; handle?: string; startX: number; startY: number; original: Rect; panX: number; panY: number } | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: info.width, height: info.height });
  const [history, setHistory] = useState<Rect[]>([]);
  const [future, setFuture] = useState<Rect[]>([]);
  const [ratio, setRatio] = useState<Ratio>("free");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [compare, setCompare] = useState(false);
  const [saveMode, setSaveMode] = useState<"copy" | "overwrite">("copy");
  const dot = entry.name.lastIndexOf(".");
  const suggested = dot > 0 ? `${entry.name.slice(0, dot)}-edited${entry.name.slice(dot)}` : `${entry.name}-edited`;
  const [name, setName] = useState(suggested);
  const [saving, setSaving] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [cursor, setCursor] = useState("crosshair");

  const geometry = useCallback(() => {
    const target = canvas.current;
    if (!target) return { scale: 1, left: 0, top: 0 };
    const fit = Math.min(target.width / info.width, target.height / info.height);
    const scale = fit * zoom;
    return { scale, left: (target.width - info.width * scale) / 2 + pan.x, top: (target.height - info.height * scale) / 2 + pan.y };
  }, [info.height, info.width, pan.x, pan.y, zoom]);

  const draw = useCallback(() => {
    const target = canvas.current;
    const source = image.current;
    if (!target || !source) return;
    const context = target.getContext("2d");
    if (!context) return;
    const { scale, left, top } = geometry();
    context.clearRect(0, 0, target.width, target.height);
    context.fillStyle = "#18202c"; context.fillRect(0, 0, target.width, target.height);
    context.drawImage(source, left, top, info.width * scale, info.height * scale);
    if (compare) return;
    const x = left + rect.x * scale, y = top + rect.y * scale, width = rect.width * scale, height = rect.height * scale;
    context.save();
    context.fillStyle = "rgb(0 0 0 / 55%)";
    context.beginPath(); context.rect(left, top, info.width * scale, info.height * scale); context.rect(x, y, width, height); context.fill("evenodd");
    context.strokeStyle = "#fff"; context.lineWidth = 2; context.strokeRect(x, y, width, height);
    context.setLineDash([5, 5]); context.lineWidth = 1;
    for (let i = 1; i < 3; i++) { context.beginPath(); context.moveTo(x + width * i / 3, y); context.lineTo(x + width * i / 3, y + height); context.stroke(); context.beginPath(); context.moveTo(x, y + height * i / 3); context.lineTo(x + width, y + height * i / 3); context.stroke(); }
    context.setLineDash([]); context.fillStyle = "#fff"; context.strokeStyle = "#276ef1"; context.lineWidth = 2;
    [[x + width / 2, y], [x, y + height / 2], [x + width, y + height / 2], [x + width / 2, y + height]].forEach(([hx, hy]) => context.fillRect(hx - 4, hy - 4, 8, 8));
    [[x, y], [x + width, y], [x + width, y + height], [x, y + height]].forEach(([hx, hy]) => { context.beginPath(); context.arc(hx, hy, 8, 0, Math.PI * 2); context.fill(); context.stroke(); });
    context.restore();
  }, [compare, geometry, info.height, info.width, rect]);

  useEffect(() => {
    const source = new Image();
    source.onload = () => { image.current = source; setImageReady(true); };
    source.src = imageUrl;
    return () => { source.src = ""; image.current = null; setImageReady(false); };
  }, [imageUrl]);
  useEffect(() => { if (imageReady) draw(); }, [draw, imageReady]);

  const ratioValue = () => ratio === "original" ? info.width / info.height : ratio === "1:1" ? 1 : ratio === "4:3" ? 4 / 3 : ratio === "16:9" ? 16 / 9 : 0;
  const clamp = (value: Rect): Rect => ({
    x: Math.max(0, Math.min(Math.round(value.x), info.width - 1)),
    y: Math.max(0, Math.min(Math.round(value.y), info.height - 1)),
    width: Math.max(1, Math.min(Math.round(value.width), info.width - Math.max(0, value.x))),
    height: Math.max(1, Math.min(Math.round(value.height), info.height - Math.max(0, value.y))),
  });
  const commit = (next: Rect) => { setHistory(current => [...current.slice(-39), rect]); setFuture([]); setRect(clamp(next)); };
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const { scale, left, top } = geometry();
    return { x: (event.clientX - bounds.left) * event.currentTarget.width / bounds.width / scale - left / scale, y: (event.clientY - bounds.top) * event.currentTarget.height / bounds.height / scale - top / scale };
  };
  const hitHandle = (current: { x: number; y: number }, pointerType = "mouse"): ResizeHandle | null => {
    const { scale } = geometry();
    const cornerTolerance = (pointerType === "touch" ? 24 : 18) / scale;
    const edgeTolerance = (pointerType === "touch" ? 18 : 10) / scale;
    const corners: Array<[ResizeHandle, number, number]> = [
      ["nw", rect.x, rect.y], ["ne", rect.x + rect.width, rect.y],
      ["se", rect.x + rect.width, rect.y + rect.height], ["sw", rect.x, rect.y + rect.height],
    ];
    const corner = corners.find(([, x, y]) => Math.hypot(current.x - x, current.y - y) <= cornerTolerance);
    if (corner) return corner[0];
    const withinX = current.x >= rect.x - edgeTolerance && current.x <= rect.x + rect.width + edgeTolerance;
    const withinY = current.y >= rect.y - edgeTolerance && current.y <= rect.y + rect.height + edgeTolerance;
    if (withinX && Math.abs(current.y - rect.y) <= edgeTolerance) return "n";
    if (withinY && Math.abs(current.x - rect.x - rect.width) <= edgeTolerance) return "e";
    if (withinX && Math.abs(current.y - rect.y - rect.height) <= edgeTolerance) return "s";
    if (withinY && Math.abs(current.x - rect.x) <= edgeTolerance) return "w";
    return null;
  };
  const cursorFor = (handle: ResizeHandle | null, inside: boolean) => handle === "nw" || handle === "se" ? "nwse-resize" : handle === "ne" || handle === "sw" ? "nesw-resize" : handle === "n" || handle === "s" ? "ns-resize" : handle === "e" || handle === "w" ? "ew-resize" : inside ? "move" : "crosshair";
  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = point(event);
    const handle = hitHandle(current, event.pointerType);
    const inside = current.x >= rect.x && current.x <= rect.x + rect.width && current.y >= rect.y && current.y <= rect.y + rect.height;
    drag.current = { mode: event.altKey || event.button === 1 ? "pan" : handle ? "resize" : inside ? "move" : "select", handle: handle || undefined, startX: current.x, startY: current.y, original: rect, panX: pan.x, panY: pan.y };
    setCursor(event.altKey || event.button === 1 ? "grabbing" : cursorFor(handle, inside));
    setHistory(values => [...values.slice(-39), rect]); setFuture([]);
  };
  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) {
      const current = point(event);
      const inside = current.x >= rect.x && current.x <= rect.x + rect.width && current.y >= rect.y && current.y <= rect.y + rect.height;
      setCursor(cursorFor(hitHandle(current, event.pointerType), inside));
      return;
    }
    const current = point(event), active = drag.current;
    if (active.mode === "pan") { const { scale } = geometry(); setPan({ x: active.panX + (current.x - active.startX) * scale, y: active.panY + (current.y - active.startY) * scale }); return; }
    if (active.mode === "move") { setRect(clamp({ ...active.original, x: active.original.x + current.x - active.startX, y: active.original.y + current.y - active.startY })); return; }
    if (active.mode === "resize") {
      let left = active.original.x, top = active.original.y, right = left + active.original.width, bottom = top + active.original.height;
      if (active.handle?.includes("w")) left = current.x;
      if (active.handle?.includes("e")) right = current.x;
      if (active.handle?.includes("n")) top = current.y;
      if (active.handle?.includes("s")) bottom = current.y;
      if (right < left) [left, right] = [right, left];
      if (bottom < top) [top, bottom] = [bottom, top];
      const locked = ratioValue();
      if (locked > 0) {
        const width = Math.max(1, right - left), height = Math.max(1, bottom - top);
        if (width / height > locked) right = left + height * locked;
        else bottom = top + width / locked;
      }
      setRect(clamp({ x: left, y: top, width: right - left, height: bottom - top }));
      return;
    }
    let width = Math.abs(current.x - active.startX), height = Math.abs(current.y - active.startY);
    const locked = ratioValue();
    if (locked > 0) height = width / locked;
    setRect(clamp({ x: Math.min(active.startX, current.x), y: Math.min(active.startY, current.y), width, height }));
  };
  const undo = () => { const previous = history.at(-1); if (!previous) return; setHistory(history.slice(0, -1)); setFuture([rect, ...future]); setRect(previous); };
  const redo = () => { const next = future[0]; if (!next) return; setFuture(future.slice(1)); setHistory([...history, rect]); setRect(next); };
  const save = async () => { setSaving(true); try { await onSave([{ type: "crop", ...rect }], { mode: saveMode, ...(saveMode === "copy" ? { name } : {}) }); } finally { setSaving(false); } };

  return <Modal title={`${labels.crop}: ${entry.name}`} closeLabel={labels.close} onClose={onClose} className="sf-image-editor" footer={<><span>{rect.width} × {rect.height} px</span><button onClick={onClose}>{labels.cancel}</button><button className="primary" disabled={saving || (saveMode === "copy" && name.trim() === "")} onClick={() => void save()}>{saving ? labels.saving : labels.save}</button></>}>
    <div className="sf-editor-toolbar">
      <label>{labels.ratio}<select value={ratio} onChange={event => { const next = event.target.value as Ratio; setRatio(next); const value = next === "original" ? info.width / info.height : next === "1:1" ? 1 : next === "4:3" ? 4 / 3 : next === "16:9" ? 16 / 9 : 0; if (value > 0) commit({ ...rect, height: Math.min(info.height - rect.y, rect.width / value) }); }}><option value="free">{labels.free}</option><option value="original">{labels.original}</option><option value="1:1">1:1</option><option value="4:3">4:3</option><option value="16:9">16:9</option></select></label>
      <label>{labels.zoom}<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={event => setZoom(Number(event.target.value))}/></label>
      <button disabled={history.length === 0} onClick={undo}>{labels.undo}</button><button disabled={future.length === 0} onClick={redo}>{labels.redo}</button>
      <button onClick={() => { commit({ x: 0, y: 0, width: info.width, height: info.height }); setZoom(1); setPan({ x: 0, y: 0 }); }}>{labels.reset}</button>
      <button onPointerDown={() => setCompare(true)} onPointerUp={() => setCompare(false)} onPointerLeave={() => setCompare(false)}>{labels.compare}</button>
    </div>
    <div className="sf-editor-canvas"><canvas ref={canvas} width="900" height="560" style={{ cursor }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerLeave={() => { if (!drag.current) setCursor("crosshair"); }} onPointerUp={() => { drag.current = null; setCursor("crosshair"); }} onPointerCancel={() => { drag.current = null; setCursor("crosshair"); }} tabIndex={0} onKeyDown={event => {
      const step = event.shiftKey ? 10 : 1;
      const delta = event.key === "ArrowLeft" ? [-step, 0] : event.key === "ArrowRight" ? [step, 0] : event.key === "ArrowUp" ? [0, -step] : event.key === "ArrowDown" ? [0, step] : null;
      if (delta) { event.preventDefault(); commit({ ...rect, x: rect.x + delta[0], y: rect.y + delta[1] }); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
    }}/></div>
    <div className="sf-editor-fields">
      {(["x", "y", "width", "height"] as const).map(field => <label key={field}>{labels[field] || field}<input type="number" min={field === "width" || field === "height" ? 1 : 0} value={rect[field]} onChange={event => commit({ ...rect, [field]: Number(event.target.value) })}/></label>)}
      <label>{labels.saveMode}<select value={saveMode} onChange={event => setSaveMode(event.target.value as "copy" | "overwrite")}><option value="copy">{labels.saveCopy}</option><option value="overwrite">{labels.overwrite}</option></select></label>
      {saveMode === "copy" && <label>{labels.fileName}<input value={name} onChange={event => setName(event.target.value)}/></label>}
      {saveMode === "overwrite" && <p className="sf-warning" role="alert">{labels.overwriteWarning}</p>}
      <small>{labels.panHint}</small>
    </div>
  </Modal>;
}
