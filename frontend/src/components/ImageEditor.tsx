import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import type { Entry, ImageAction, ImageInfo, ImagePreset, WatermarkFont, WatermarkPosition } from "../types";
import { clampCropRect, type CropRect as Rect } from "../cropGeometry";
import { entryNameIssue } from "../nameValidation";
import { watermarkPreviewDimensions } from "../watermarkGeometry";
import { Modal } from "./Modal";
import { UiIcon } from "./UiIcon";

type Ratio = "free" | "original" | "1:1" | "4:3" | "16:9";
type Tool = "crop" | "rotate" | "resize" | "preset" | "optimize" | "watermark";
type WatermarkMode = "none" | "text" | "image";
const sameRect = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
const mimeExtensions: Record<string, string[]> = { "image/avif": ["avif"], "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"], "image/gif": ["gif"], "image/bmp": ["bmp"], "image/x-bmp": ["bmp"], "image/vnd.microsoft.icon": ["ico"], "image/x-icon": ["ico"] };
const formatExtensions: Record<string, string> = { jpeg: "jpg", png: "png", webp: "webp", avif: "avif" };
const EDIT_QUALITY = 95;
const WATERMARK_QUALITY = 100;
const watermarkFontStyles: Record<WatermarkFont, CSSProperties> = {
  interface: { fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', fontWeight: 700 },
  sans: { fontFamily: '"Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", sans-serif', fontWeight: 400 },
  serif: { fontFamily: '"Noto Serif CJK SC", "Songti SC", SimSun, serif', fontWeight: 600 },
};

export function ImageEditor({ entry, info, imageUrl, resource, watermarkUrl, presets, formats, enabledTools, maximumFileNameLength, labels, onClose, onSave }: {
  entry: Entry; info: ImageInfo; imageUrl: string; resource: string; presets: Record<string, ImagePreset>; formats: string[];
  watermarkUrl: (resource: string, path: string) => string;
  enabledTools: { crop: boolean; rotate: boolean; resize: boolean; presets: boolean; process: boolean };
  maximumFileNameLength: number; labels: Record<string, string>; onClose: () => void;
  onSave: (actions: ImageAction[], save: { mode: "copy" | "overwrite"; name?: string }) => Promise<void>;
}) {
  const originalRect = useRef<Rect>({ x: 0, y: 0, width: info.width, height: info.height }).current;
  const source = useRef<HTMLImageElement>(null), cropper = useRef<Cropper | null>(null), rectRef = useRef(originalRect), baseZoom = useRef(1), dragStart = useRef<Rect | null>(null);
  const watermarkLayer = useRef<HTMLDivElement>(null), watermarkMarker = useRef<HTMLDivElement>(null), watermarkDrag = useRef<{ clientX: number; clientY: number; x: number; y: number } | null>(null);
  const historyRef = useRef<Rect[]>([]), futureRef = useRef<Rect[]>([]);
  const availableTools: Tool[] = [...(enabledTools.crop ? ["crop" as const] : []), ...(enabledTools.rotate ? ["rotate" as const] : []), ...(enabledTools.resize ? ["resize" as const] : []), ...(enabledTools.presets ? ["preset" as const] : []), ...(enabledTools.process ? ["optimize" as const, "watermark" as const] : [])];
  const [tool, setTool] = useState<Tool>(availableTools[0] || "crop"), [rect, setRect] = useState(originalRect), [cropTouched, setCropTouched] = useState(false), [history, setHistory] = useState<Rect[]>([]), [future, setFuture] = useState<Rect[]>([]);
  const [ratio, setRatio] = useState<Ratio>("free"), [zoom, setZoom] = useState(1), [compare, setCompare] = useState(false), [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [resizeEnabled, setResizeEnabled] = useState(false), [resizeWidth, setResizeWidth] = useState(info.width), [resizeHeight, setResizeHeight] = useState(info.height), [presetName, setPresetName] = useState("");
  const [optimizeEnabled, setOptimizeEnabled] = useState(false), [quality, setQuality] = useState(82), [format, setFormat] = useState("original");
  const [watermarkMode, setWatermarkMode] = useState<WatermarkMode>("none"), [watermarkText, setWatermarkText] = useState("SoFinder"), [watermarkFont, setWatermarkFont] = useState<WatermarkFont>("interface"), [watermarkColor, setWatermarkColor] = useState("#ffffff"), [watermarkResource, setWatermarkResource] = useState(resource), [watermarkPath, setWatermarkPath] = useState("");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right"), [watermarkX, setWatermarkX] = useState(100), [watermarkY, setWatermarkY] = useState(100), [opacity, setOpacity] = useState(60), [watermarkScale, setWatermarkScale] = useState(25);
  const [watermarkBounds, setWatermarkBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [watermarkImageDimensions, setWatermarkImageDimensions] = useState({ width: 0, height: 0 });
  const [saveMode, setSaveMode] = useState<"copy" | "overwrite">("copy"), [saving, setSaving] = useState(false), [saveError, setSaveError] = useState("");
  const dot = entry.name.lastIndexOf("."), originalExtension = dot > 0 ? entry.name.slice(dot + 1) : "", supported = mimeExtensions[(entry.mimeType || "").toLowerCase()] || [];
  const lockedExtension = supported.includes(originalExtension.toLowerCase()) ? originalExtension : (supported[0] || originalExtension), extension = format === "original" ? lockedExtension : (formatExtensions[format] || format);
  const suggestedStem = `${dot > 0 ? entry.name.slice(0, dot) : entry.name}-edited`, [name, setName] = useState(suggestedStem), effectiveSaveMode = format === "original" ? saveMode : "copy";
  const copyName = extension ? `${name.trim()}.${extension}` : name.trim(), copyNameIssue = effectiveSaveMode === "copy" ? entryNameIssue(copyName, maximumFileNameLength) : null;
  const cropChanged = cropTouched, watermarkInvalid = watermarkMode === "text" ? !watermarkText.trim() : watermarkMode === "image" ? !watermarkPath.trim() : false;
  const resizeInvalid = resizeEnabled && (!Number.isInteger(resizeWidth) || !Number.isInteger(resizeHeight) || resizeWidth < 1 || resizeHeight < 1 || resizeWidth > 4096 || resizeHeight > 4096);
  const hasChanges = cropChanged || rotation !== 0 || resizeEnabled || !!presetName || optimizeEnabled || watermarkMode !== "none";
  const baseOutput = presetName ? presets[presetName] : resizeEnabled ? { width: resizeWidth, height: resizeHeight } : cropTouched ? rect : originalRect;
  const outputWidth = !presetName && !resizeEnabled && (rotation === 90 || rotation === 270) ? baseOutput.height : baseOutput.width;
  const outputHeight = !presetName && !resizeEnabled && (rotation === 90 || rotation === 270) ? baseOutput.width : baseOutput.height;
  const normalize = (value: Pick<Cropper.Data, "x" | "y" | "width" | "height">) => clampCropRect(value, info);
  const updateRect = (value: Rect) => { rectRef.current = value; setRect(value); };
  const updateHistory = (value: Rect[]) => { historyRef.current = value; setHistory(value); }, updateFuture = (value: Rect[]) => { futureRef.current = value; setFuture(value); };
  const record = (previous: Rect, next: Rect) => { if (!sameRect(previous, next)) { updateHistory([...historyRef.current.slice(-39), previous]); updateFuture([]); } };
  const applyRect = (value: Rect, remember = true) => { const next = clampCropRect(value, info); if (remember) record(rectRef.current, next); setCropTouched(true); cropper.current?.setData(next); updateRect(next); };
  const ratioValue = (value = ratio) => value === "original" ? info.width / info.height : value === "1:1" ? 1 : value === "4:3" ? 4 / 3 : value === "16:9" ? 16 / 9 : NaN;
  const positionCoordinates = (value: WatermarkPosition): [number, number] => value === "top-left" ? [0, 0] : value === "top-right" ? [100, 0] : value === "center" ? [50, 50] : value === "bottom-left" ? [0, 100] : value === "bottom-right" ? [100, 100] : [watermarkX, watermarkY];
  const changeWatermarkPosition = (value: WatermarkPosition) => { const [x, y] = positionCoordinates(value); setPosition(value); setWatermarkX(x); setWatermarkY(y); };
  const moveWatermark = (event: Pick<PointerEvent, "clientX" | "clientY"> | ReactPointerEvent<HTMLDivElement>) => {
    const drag = watermarkDrag.current, layer = watermarkLayer.current, marker = watermarkMarker.current;
    if (!drag || !layer || !marker) return;
    const availableX = Math.max(1, layer.clientWidth - marker.offsetWidth), availableY = Math.max(1, layer.clientHeight - marker.offsetHeight);
    setWatermarkX(Math.round(Math.max(0, Math.min(100, drag.x + (event.clientX - drag.clientX) * 100 / availableX))));
    setWatermarkY(Math.round(Math.max(0, Math.min(100, drag.y + (event.clientY - drag.clientY) * 100 / availableY))));
    setPosition("custom");
  };

  useEffect(() => {
    const move = (event: PointerEvent) => moveWatermark(event);
    const stop = () => { watermarkDrag.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  // The drag calculation reads mutable element/gesture refs, so one stable window listener is sufficient.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!source.current) return;
    const instance = new Cropper(source.current, { viewMode: 1, dragMode: "crop", aspectRatio: NaN, autoCropArea: 0.86, responsive: true, restore: false, background: false, guides: true, center: true, highlight: true, movable: true, cropBoxMovable: true, cropBoxResizable: true, zoomable: true, zoomOnTouch: true, zoomOnWheel: false, toggleDragModeOnDblclick: false,
      ready: event => { const active = event.currentTarget.cropper; cropper.current = active; const image = active.getImageData(); baseZoom.current = image.naturalWidth ? image.width / image.naturalWidth : 1; updateRect(normalize(active.getData(true))); },
      crop: event => updateRect(normalize(event.detail)), cropstart: () => { dragStart.current = rectRef.current; }, cropend: event => { const next = normalize(event.currentTarget.cropper.getData(true)); if (dragStart.current) record(dragStart.current, next); dragStart.current = null; setCropTouched(true); updateRect(next); },
    });
    cropper.current = instance; return () => { instance.destroy(); cropper.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, info.width, info.height]);
  useEffect(() => {
    const refresh = () => {
      const active = cropper.current;
      if (!active) return;
      const bounds = cropTouched ? active.getCropBoxData() : active.getCanvasData();
      setWatermarkBounds({ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height });
    };
    const frame = window.requestAnimationFrame(refresh);
    const canvas = source.current?.closest(".sf-editor-canvas");
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(refresh);
    if (canvas) observer?.observe(canvas);
    return () => { window.cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [cropTouched, rect, rotation, zoom]);
  const changeRatio = (next: Ratio) => { setRatio(next); setCropTouched(true); const active = cropper.current; if (!active) return; const previous = rectRef.current; active.setAspectRatio(ratioValue(next)); const value = normalize(active.getData(true)); record(previous, value); updateRect(value); };
  const undo = () => { const previous = historyRef.current.at(-1); if (!previous) return; updateHistory(historyRef.current.slice(0, -1)); updateFuture([rectRef.current, ...futureRef.current]); cropper.current?.setData(previous); updateRect(previous); };
  const redo = () => { const [next, ...rest] = futureRef.current; if (!next) return; updateFuture(rest); updateHistory([...historyRef.current, rectRef.current]); cropper.current?.setData(next); updateRect(next); };
  const resetCrop = () => { const active = cropper.current; active?.reset().setAspectRatio(NaN); setRatio("free"); setZoom(1); setCropTouched(false); updateHistory([]); updateFuture([]); if (active) updateRect(normalize(active.getData(true))); };
  const rotate = (delta: 90 | -90) => { setRotation(((rotation + delta + 360) % 360) as 0 | 90 | 180 | 270); cropper.current?.rotate(delta); };
  const resetAll = () => { if (rotation) cropper.current?.rotate(-rotation); setRotation(0); resetCrop(); setResizeEnabled(false); setPresetName(""); setOptimizeEnabled(false); setFormat("original"); setQuality(82); setWatermarkMode("none"); setPosition("bottom-right"); setWatermarkX(100); setWatermarkY(100); };
  const buildActions = (): ImageAction[] => {
    const result: ImageAction[] = [];
    if (cropChanged) result.push({ type: "crop", ...rect, quality: EDIT_QUALITY });
    if (rotation) result.push({ type: "rotate", degrees: rotation, quality: EDIT_QUALITY });
    if (presetName) result.push({ type: "preset", name: presetName }); else if (resizeEnabled) result.push({ type: "resize", width: resizeWidth, height: resizeHeight, quality: EDIT_QUALITY });
    const coordinates = position === "custom" ? { x: watermarkX, y: watermarkY } : {};
    if (watermarkMode === "text") result.push({ type: "watermarkText", text: watermarkText.trim(), font: watermarkFont, color: watermarkColor, position, ...coordinates, opacity, scale: watermarkScale, quality: WATERMARK_QUALITY });
    else if (watermarkMode === "image") result.push({ type: "watermarkImage", resource: watermarkResource.trim() || resource, path: watermarkPath.trim(), position, ...coordinates, opacity, scale: watermarkScale, quality: WATERMARK_QUALITY });
    if (optimizeEnabled) result.push({ type: "optimize", format, quality });
    return result;
  };
  const save = async () => { const actions = buildActions(); if (!actions.length) return; const saveSettings = effectiveSaveMode === "copy" ? { mode: effectiveSaveMode, ...(name === suggestedStem && format === "original" ? {} : { name: copyName }) } : { mode: effectiveSaveMode }; setSaveError(""); setSaving(true); try { await onSave(actions, saveSettings); } catch (error) { setSaveError(error instanceof Error ? error.message : String(error)); } finally { setSaving(false); } };
  const toolLabel = (value: Tool) => value === "preset" ? labels.preset : value === "optimize" ? labels.optimize : value === "watermark" ? labels.watermark : labels[value];
  const positionOptions: WatermarkPosition[] = ["top-left", "top-right", "center", "bottom-left", "bottom-right", "custom"];
  const [previewX, previewY] = positionCoordinates(position);
  const watermarkPreviewUrl = watermarkMode === "image" && watermarkPath.trim() ? watermarkUrl(watermarkResource.trim() || resource, watermarkPath.trim()) : "";
  const watermarkPreviewSize = watermarkPreviewDimensions(watermarkBounds.width, watermarkBounds.height, watermarkImageDimensions.width, watermarkImageDimensions.height, watermarkScale);

  useEffect(() => setWatermarkImageDimensions({ width: 0, height: 0 }), [watermarkPreviewUrl]);

  return <Modal title={`${labels.imageEdit}: ${entry.name}`} closeLabel={labels.close} onClose={onClose} className="sf-image-editor" maximizable footer={<><span>{labels.outputSize}: {outputWidth} × {outputHeight} px</span><button onClick={onClose}>{labels.cancel}</button><button className="primary" disabled={saving || !hasChanges || watermarkInvalid || resizeInvalid || copyNameIssue !== null} onClick={() => void save()}>{saving ? labels.saving : labels.save}</button></>}>
    <div className="sf-editor-workspace">
      <nav className="sf-editor-tools" aria-label={labels.imageTools}>{availableTools.map(value => <button key={value} className={tool === value ? "active" : ""} aria-pressed={tool === value} onClick={() => setTool(value)}><UiIcon name={value === "rotate" ? "rotate-right" : value === "crop" ? "crop" : "resize"}/><span>{toolLabel(value)}</span></button>)}</nav>
      <div className="sf-editor-main"><div className="sf-editor-toolbar"><label>{labels.zoom}<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={event => { const value = Number(event.target.value); setZoom(value); cropper.current?.zoomTo(baseZoom.current * value); }}/></label><button disabled={!history.length} onClick={undo}>{labels.undo}</button><button disabled={!future.length} onClick={redo}>{labels.redo}</button><button onClick={resetAll}>{labels.reset}</button><button onPointerDown={() => setCompare(true)} onPointerUp={() => setCompare(false)} onPointerLeave={() => setCompare(false)}>{labels.compare}</button></div>
        <div className={`sf-editor-canvas${compare ? " sf-editor-comparing" : ""}${tool !== "crop" ? " sf-editor-crop-inactive" : ""}`} tabIndex={0} onKeyDown={event => { const step = event.shiftKey ? 10 : 1, delta = event.key === "ArrowLeft" ? [-step, 0] : event.key === "ArrowRight" ? [step, 0] : event.key === "ArrowUp" ? [0, -step] : event.key === "ArrowDown" ? [0, step] : null; if (delta && tool === "crop") { event.preventDefault(); applyRect({ ...rectRef.current, x: rectRef.current.x + delta[0], y: rectRef.current.y + delta[1] }); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); } }}><img ref={source} src={imageUrl} alt=""/>{watermarkMode !== "none" && watermarkBounds.width > 0 && <div ref={watermarkLayer} className="sf-watermark-layer" style={watermarkBounds}><div ref={watermarkMarker} className={`sf-watermark-preview${tool === "watermark" ? " is-draggable" : ""}`} role={tool === "watermark" ? "button" : undefined} tabIndex={tool === "watermark" ? 0 : undefined} aria-label={labels.dragWatermark} style={{ left: `${previewX}%`, top: `${previewY}%`, transform: `translate(-${previewX}%, -${previewY}%)`, color: watermarkColor, opacity: opacity / 100, fontSize: `${Math.max(10, Math.min(watermarkBounds.width, watermarkBounds.height) * watermarkScale / 500)}px`, width: watermarkMode === "image" ? (watermarkPreviewSize ? `${watermarkPreviewSize.width}px` : `${watermarkScale}%`) : undefined, height: watermarkMode === "image" && watermarkPreviewSize ? `${watermarkPreviewSize.height}px` : undefined, ...(watermarkMode === "text" ? watermarkFontStyles[watermarkFont] : {}) }} onKeyDown={event => { const step = event.shiftKey ? 10 : 1; if (event.key === "ArrowLeft") setWatermarkX(Math.max(0, previewX - step)); else if (event.key === "ArrowRight") setWatermarkX(Math.min(100, previewX + step)); else if (event.key === "ArrowUp") setWatermarkY(Math.max(0, previewY - step)); else if (event.key === "ArrowDown") setWatermarkY(Math.min(100, previewY + step)); else return; event.preventDefault(); event.stopPropagation(); setPosition("custom"); }} onPointerDown={event => { if (tool !== "watermark") return; event.currentTarget.setPointerCapture(event.pointerId); watermarkDrag.current = { clientX: event.clientX, clientY: event.clientY, x: previewX, y: previewY }; }} onPointerMove={moveWatermark} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); watermarkDrag.current = null; }} onPointerCancel={() => { watermarkDrag.current = null; }}>{watermarkMode === "text" ? watermarkText : watermarkPreviewUrl && <img src={watermarkPreviewUrl} alt="" onLoad={event => setWatermarkImageDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}/>}</div></div>}</div></div>
      <aside className="sf-editor-panel"><h3>{toolLabel(tool)}</h3>
        {tool === "crop" && <><label>{labels.ratio}<select aria-label={labels.ratio} value={ratio} onChange={event => changeRatio(event.target.value as Ratio)}><option value="free">{labels.free}</option><option value="original">{labels.original}</option><option value="1:1">1:1</option><option value="4:3">4:3</option><option value="16:9">16:9</option></select></label><div className="sf-editor-field-grid">{(["x", "y", "width", "height"] as const).map(field => <label key={field}>{labels[field]}<input type="number" min={field === "width" || field === "height" ? 1 : 0} value={rect[field]} onChange={event => applyRect({ ...rectRef.current, [field]: Number(event.target.value) })}/></label>)}</div><small>{labels.panHint}</small></>}
        {tool === "rotate" && <><div className="sf-editor-action-row"><button onClick={() => rotate(-90)}><UiIcon name="rotate-left"/>{labels.rotateLeft}</button><button onClick={() => rotate(90)}><UiIcon name="rotate-right"/>{labels.rotateRight}</button></div><p>{labels.rotation}: {rotation}°</p></>}
        {tool === "resize" && <><label className="sf-editor-check"><input type="checkbox" checked={resizeEnabled} onChange={event => { setResizeEnabled(event.target.checked); if (event.target.checked) setPresetName(""); }}/>{labels.enableResize}</label><div className="sf-editor-field-grid"><label>{labels.width}<input type="number" min="1" max="4096" value={resizeWidth} onChange={event => setResizeWidth(Number(event.target.value))}/></label><label>{labels.height}<input type="number" min="1" max="4096" value={resizeHeight} onChange={event => setResizeHeight(Number(event.target.value))}/></label></div></>}
        {tool === "preset" && <label>{labels.preset}<select value={presetName} onChange={event => { setPresetName(event.target.value); if (event.target.value) setResizeEnabled(false); }}><option value="">{labels.noPreset}</option>{Object.entries(presets).map(([value, preset]) => <option key={value} value={value}>{value} ({preset.width}×{preset.height})</option>)}</select></label>}
        {tool === "optimize" && <><label className="sf-editor-check"><input type="checkbox" checked={optimizeEnabled} onChange={event => setOptimizeEnabled(event.target.checked)}/>{labels.enableOptimize}</label><label>{labels.outputFormat}<select value={format} onChange={event => { setFormat(event.target.value); setOptimizeEnabled(true); }}><option value="original">{labels.keepFormat}</option>{formats.map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select></label><label>{labels.quality}: {quality}<input type="range" min="1" max="100" value={quality} onChange={event => { setQuality(Number(event.target.value)); setOptimizeEnabled(true); }}/></label></>}
        {tool === "watermark" && <><label>{labels.watermarkType}<select value={watermarkMode} onChange={event => setWatermarkMode(event.target.value as WatermarkMode)}><option value="none">{labels.noWatermark}</option><option value="text">{labels.textWatermark}</option><option value="image">{labels.imageWatermark}</option></select></label>{watermarkMode === "text" && <><label>{labels.watermarkText}<input value={watermarkText} maxLength={200} onChange={event => setWatermarkText(event.target.value)}/></label><div className="sf-watermark-style-row"><label>{labels.watermarkFont}<select value={watermarkFont} onChange={event => setWatermarkFont(event.target.value as WatermarkFont)}><option value="interface">{labels.interfaceFont}</option><option value="sans">{labels.sansFont}</option><option value="serif">{labels.serifFont}</option></select></label><label className="sf-watermark-color">{labels.color}<input type="color" value={watermarkColor} onChange={event => setWatermarkColor(event.target.value)}/></label></div></>}{watermarkMode === "image" && <><label>{labels.watermarkResource}<input value={watermarkResource} onChange={event => setWatermarkResource(event.target.value)}/></label><label>{labels.watermarkPath}<input value={watermarkPath} placeholder="branding/logo.png" onChange={event => setWatermarkPath(event.target.value)}/></label></>}{watermarkMode !== "none" && <><label>{labels.position}<select value={position} onChange={event => changeWatermarkPosition(event.target.value as WatermarkPosition)}>{positionOptions.map(value => <option key={value} value={value}>{value === "custom" ? labels.freePosition : labels[value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())]}</option>)}</select></label>{position === "custom" && <div className="sf-editor-field-grid"><label>X (%)<input type="number" min="0" max="100" value={watermarkX} onChange={event => setWatermarkX(Math.max(0, Math.min(100, Number(event.target.value))))}/></label><label>Y (%)<input type="number" min="0" max="100" value={watermarkY} onChange={event => setWatermarkY(Math.max(0, Math.min(100, Number(event.target.value))))}/></label></div>}<small>{labels.dragWatermarkHint}</small><label>{labels.opacity}: {opacity}%<input type="range" min="1" max="100" value={opacity} onChange={event => setOpacity(Number(event.target.value))}/></label><label>{labels.watermarkScale}: {watermarkScale}%<input type="range" min="5" max="80" value={watermarkScale} onChange={event => setWatermarkScale(Number(event.target.value))}/></label></>}</>}
        <hr/><label>{labels.saveMode}<select value={effectiveSaveMode} disabled={format !== "original"} onChange={event => setSaveMode(event.target.value as "copy" | "overwrite")}><option value="copy">{labels.saveCopy}</option><option value="overwrite">{labels.overwrite}</option></select></label>{effectiveSaveMode === "copy" && <><label>{labels.fileName}<span className="sf-name-input"><input value={name} maxLength={maximumFileNameLength} onChange={event => setName(event.target.value)}/>{extension && <span aria-hidden="true">.{extension}</span>}</span></label><small>{Array.from(copyName).length} / {maximumFileNameLength}</small>{copyNameIssue && name && <p className="sf-warning" role="alert">{copyNameIssue === "tooLong" ? labels.fileNameTooLong.replace("{maximum}", String(maximumFileNameLength)) : labels.invalidFileName}</p>}</>}{format !== "original" && <p className="sf-configured-limits">{labels.conversionCopyHint}</p>}{effectiveSaveMode === "overwrite" && <p className="sf-warning" role="alert">{labels.overwriteWarning}</p>}{saveError && <p className="sf-warning" role="alert">{saveError}</p>}
      </aside>
    </div>
  </Modal>;
}
