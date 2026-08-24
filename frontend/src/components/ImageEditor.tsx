import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import type { Entry, ImageAction, ImageInfo } from "../types";
import { clampCropRect, type CropRect as Rect } from "../cropGeometry";
import { Modal } from "./Modal";
import { entryNameIssue } from "../nameValidation";

type Ratio = "free" | "original" | "1:1" | "4:3" | "16:9";

const sameRect = (left: Rect, right: Rect) => left.x === right.x && left.y === right.y && left.width === right.width && left.height === right.height;
const imageExtensions: Record<string, string[]> = {
  "image/avif": ["avif"], "image/bmp": ["bmp"], "image/x-bmp": ["bmp"], "image/gif": ["gif"],
  "image/vnd.microsoft.icon": ["ico"], "image/x-icon": ["ico"], "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"], "image/webp": ["webp"],
};

export function ImageEditor({ entry, info, imageUrl, maximumFileNameLength, labels, onClose, onSave }: {
  entry: Entry; info: ImageInfo; imageUrl: string;
  maximumFileNameLength: number;
  labels: Record<string, string>;
  onClose: () => void;
  onSave: (actions: ImageAction[], save: { mode: "copy" | "overwrite"; name?: string }) => Promise<void>;
}) {
  const source = useRef<HTMLImageElement>(null);
  const cropper = useRef<Cropper | null>(null);
  const initialRect: Rect = { x: 0, y: 0, width: info.width, height: info.height };
  const rectRef = useRef<Rect>(initialRect);
  const dragStart = useRef<Rect | null>(null);
  const baseZoom = useRef(1);
  const historyRef = useRef<Rect[]>([]);
  const futureRef = useRef<Rect[]>([]);
  const [rect, setRect] = useState<Rect>(initialRect);
  const [history, setHistory] = useState<Rect[]>([]);
  const [future, setFuture] = useState<Rect[]>([]);
  const [ratio, setRatio] = useState<Ratio>("free");
  const [zoom, setZoom] = useState(1);
  const [compare, setCompare] = useState(false);
  const [saveMode, setSaveMode] = useState<"copy" | "overwrite">("copy");
  const dot = entry.name.lastIndexOf(".");
  const originalExtension = dot > 0 ? entry.name.slice(dot + 1) : "";
  const supportedExtensions = imageExtensions[(entry.mimeType || "").toLowerCase()] || [];
  const extension = supportedExtensions.includes(originalExtension.toLowerCase()) ? originalExtension : (supportedExtensions[0] || originalExtension);
  const originalStem = dot > 0 && originalExtension === extension ? entry.name.slice(0, dot) : entry.name;
  const suggestedStem = `${originalStem}-edited`;
  const [name, setName] = useState(suggestedStem);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const copyName = extension === "" ? name : `${name}.${extension}`;
  const copyNameIssue = saveMode === "copy" ? entryNameIssue(copyName, maximumFileNameLength) : null;

  const ratioValue = (value = ratio) => value === "original" ? info.width / info.height : value === "1:1" ? 1 : value === "4:3" ? 4 / 3 : value === "16:9" ? 16 / 9 : NaN;
  const normalize = (value: Pick<Cropper.Data, "x" | "y" | "width" | "height">): Rect => clampCropRect(value, info);
  const updateRect = (value: Rect) => { rectRef.current = value; setRect(value); };
  const updateHistory = (values: Rect[]) => { historyRef.current = values; setHistory(values); };
  const updateFuture = (values: Rect[]) => { futureRef.current = values; setFuture(values); };
  const record = (previous: Rect, next: Rect) => {
    if (sameRect(previous, next)) return;
    updateHistory([...historyRef.current.slice(-39), previous]);
    updateFuture([]);
  };
  const applyRect = (value: Rect, remember = true) => {
    const next = clampCropRect(value, info);
    if (remember) record(rectRef.current, next);
    cropper.current?.setData(next);
    updateRect(next);
  };

  useEffect(() => {
    const element = source.current;
    if (!element) return;
    const instance = new Cropper(element, {
      viewMode: 1,
      dragMode: "crop",
      aspectRatio: NaN,
      autoCropArea: 0.86,
      responsive: true,
      restore: false,
      background: false,
      guides: true,
      center: true,
      highlight: true,
      movable: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      zoomable: true,
      zoomOnTouch: true,
      zoomOnWheel: false,
      toggleDragModeOnDblclick: false,
      ready: event => {
        const active = event.currentTarget.cropper;
        cropper.current = active;
        const imageData = active.getImageData();
        baseZoom.current = imageData.naturalWidth > 0 ? imageData.width / imageData.naturalWidth : 1;
        updateRect(normalize(active.getData(true)));
      },
      crop: event => updateRect(normalize(event.detail)),
      cropstart: () => { dragStart.current = rectRef.current; },
      cropend: event => {
        const active = event.currentTarget.cropper;
        const next = normalize(active.getData(true));
        if (dragStart.current) record(dragStart.current, next);
        dragStart.current = null;
        updateRect(next);
      },
    });
    cropper.current = instance;
    return () => { instance.destroy(); cropper.current = null; };
  // The editor is recreated when a different image is opened.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, info.height, info.width]);

  const changeRatio = (next: Ratio) => {
    const active = cropper.current;
    setRatio(next);
    if (!active) return;
    const previous = rectRef.current;
    active.setAspectRatio(ratioValue(next));
    const value = normalize(active.getData(true));
    record(previous, value);
    updateRect(value);
  };
  const undo = () => {
    const values = historyRef.current;
    const previous = values.at(-1);
    if (!previous) return;
    updateHistory(values.slice(0, -1));
    updateFuture([rectRef.current, ...futureRef.current]);
    cropper.current?.setData(previous);
    updateRect(previous);
  };
  const redo = () => {
    const [next, ...rest] = futureRef.current;
    if (!next) return;
    updateFuture(rest);
    updateHistory([...historyRef.current, rectRef.current]);
    cropper.current?.setData(next);
    updateRect(next);
  };
  const reset = () => {
    const active = cropper.current;
    if (!active) return;
    const previous = rectRef.current;
    active.reset().setAspectRatio(ratioValue());
    const imageData = active.getImageData();
    baseZoom.current = imageData.naturalWidth > 0 ? imageData.width / imageData.naturalWidth : 1;
    setZoom(1);
    const next = normalize(active.getData(true));
    record(previous, next);
    updateRect(next);
  };
  const save = async () => {
    const crop = cropper.current ? normalize(cropper.current.getData(true)) : rectRef.current;
    const trimmedName = name.trim();
    const copyName = extension === "" ? trimmedName : `${trimmedName}.${extension}`;
    const saveSettings = saveMode === "copy"
      ? { mode: saveMode, ...(name === suggestedStem ? {} : { name: copyName }) }
      : { mode: saveMode };
    setSaveError("");
    setSaving(true);
    try { await onSave([{ type: "crop", ...crop }], saveSettings); }
    catch (error) { setSaveError(error instanceof Error ? error.message : String(error)); }
    finally { setSaving(false); }
  };

  return <Modal title={`${labels.crop}: ${entry.name}`} closeLabel={labels.close} onClose={onClose} className="sf-image-editor" footer={<><span>{rect.width} × {rect.height} px</span><button onClick={onClose}>{labels.cancel}</button><button className="primary" disabled={saving || copyNameIssue !== null} onClick={() => void save()}>{saving ? labels.saving : labels.save}</button></>}>
    <div className="sf-editor-toolbar">
      <select aria-label={labels.ratio} value={ratio} onChange={event => changeRatio(event.target.value as Ratio)}><option value="free">{labels.free}</option><option value="original">{labels.original}</option><option value="1:1">1:1</option><option value="4:3">4:3</option><option value="16:9">16:9</option></select>
      <label>{labels.zoom}<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={event => { const value = Number(event.target.value); setZoom(value); cropper.current?.zoomTo(baseZoom.current * value); }}/></label>
      <button disabled={history.length === 0} onClick={undo}>{labels.undo}</button><button disabled={future.length === 0} onClick={redo}>{labels.redo}</button>
      <button onClick={reset}>{labels.reset}</button>
      <button onPointerDown={() => setCompare(true)} onPointerUp={() => setCompare(false)} onPointerLeave={() => setCompare(false)}>{labels.compare}</button>
    </div>
    <div className={`sf-editor-canvas${compare ? " sf-editor-comparing" : ""}`} tabIndex={0} onKeyDown={event => {
      const step = event.shiftKey ? 10 : 1;
      const delta = event.key === "ArrowLeft" ? [-step, 0] : event.key === "ArrowRight" ? [step, 0] : event.key === "ArrowUp" ? [0, -step] : event.key === "ArrowDown" ? [0, step] : null;
      if (delta) { event.preventDefault(); applyRect({ ...rectRef.current, x: rectRef.current.x + delta[0], y: rectRef.current.y + delta[1] }); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
    }}><img ref={source} src={imageUrl} alt=""/></div>
    <div className="sf-editor-fields">
      {(["x", "y", "width", "height"] as const).map(field => <label key={field}>{labels[field] || field}<input type="number" min={field === "width" || field === "height" ? 1 : 0} value={rect[field]} onChange={event => applyRect({ ...rectRef.current, [field]: Number(event.target.value) })}/></label>)}
      <label>{labels.saveMode}<select value={saveMode} onChange={event => setSaveMode(event.target.value as "copy" | "overwrite")}><option value="copy">{labels.saveCopy}</option><option value="overwrite">{labels.overwrite}</option></select></label>
      {saveMode === "copy" && <><label>{labels.fileName}<span className="sf-name-input"><input value={name} maxLength={maximumFileNameLength} onChange={event => setName(event.target.value)}/>{extension && <span aria-hidden="true">.{extension}</span>}</span></label><small>{Array.from(copyName).length} / {maximumFileNameLength} · {labels.formatLocked.replace("{extension}", extension === "" ? "" : `.${extension}`)}</small>{copyNameIssue && name !== "" && <p className="sf-warning" role="alert">{copyNameIssue === "tooLong" ? labels.fileNameTooLong.replace("{maximum}", String(maximumFileNameLength)) : labels.invalidFileName}</p>}</>}
      {saveMode === "overwrite" && <p className="sf-warning" role="alert">{labels.overwriteWarning}</p>}
      {saveError && <p className="sf-warning" role="alert">{saveError}</p>}
      <small>{labels.panHint}</small>
    </div>
  </Modal>;
}
