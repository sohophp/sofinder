import { useState } from "react";
import type { Entry, ImageAction, WatermarkPosition } from "../types";
import { Modal } from "./Modal";

type Mode = "optimize" | "text" | "image";

export function ImageProcessDialog({ entries, resource, formats, labels, onClose, onApply }: {
  entries: Entry[];
  resource: string;
  formats: string[];
  labels: Record<string, string>;
  onClose: () => void;
  onApply: (actions: ImageAction[], save: { mode: "copy" | "overwrite" }) => Promise<void>;
}) {
  const [mode, setMode] = useState<Mode>("optimize");
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState("original");
  const [text, setText] = useState("SoFinder");
  const [color, setColor] = useState("#ffffff");
  const [watermarkResource, setWatermarkResource] = useState(resource);
  const [watermarkPath, setWatermarkPath] = useState("");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState(60);
  const [scale, setScale] = useState(25);
  const [saveMode, setSaveMode] = useState<"copy" | "overwrite">("copy");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const effectiveSaveMode = mode === "optimize" && format !== "original" ? "copy" : saveMode;
  const invalid = entries.length === 0 || (mode === "text" && text.trim() === "") || (mode === "image" && watermarkPath.trim() === "");

  const submit = async () => {
    const common = { position, opacity, scale, quality };
    const action: ImageAction = mode === "optimize"
      ? { type: "optimize", format, quality }
      : mode === "text"
        ? { type: "watermarkText", text: text.trim(), color, ...common }
        : { type: "watermarkImage", resource: watermarkResource.trim() || resource, path: watermarkPath.trim(), ...common };
    setWorking(true);
    setError("");
    try { await onApply([action], { mode: effectiveSaveMode }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setWorking(false); }
  };

  return <Modal title={labels.title} closeLabel={labels.close} onClose={onClose} className="sf-image-process-modal" footer={<><span>{labels.selected.replace("{count}", String(entries.length))}</span><button onClick={onClose}>{labels.cancel}</button><button className="primary" disabled={working || invalid} onClick={() => void submit()}>{working ? labels.processing : labels.apply}</button></>}>
    <div className="sf-image-process-grid">
      <label>{labels.operation}<select value={mode} onChange={event => setMode(event.target.value as Mode)}><option value="optimize">{labels.optimize}</option><option value="text">{labels.textWatermark}</option><option value="image">{labels.imageWatermark}</option></select></label>
      {mode === "optimize" && <label>{labels.outputFormat}<select value={format} onChange={event => setFormat(event.target.value)}><option value="original">{labels.keepFormat}</option>{formats.map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select></label>}
      {mode === "text" && <><label className="sf-process-wide">{labels.watermarkText}<input value={text} maxLength={200} onChange={event => setText(event.target.value)}/></label><label>{labels.color}<input type="color" value={color} onChange={event => setColor(event.target.value)}/></label></>}
      {mode === "image" && <><label>{labels.watermarkResource}<input value={watermarkResource} onChange={event => setWatermarkResource(event.target.value)}/></label><label className="sf-process-wide">{labels.watermarkPath}<input value={watermarkPath} placeholder="branding/logo.png" onChange={event => setWatermarkPath(event.target.value)}/></label></>}
      {mode !== "optimize" && <><label>{labels.position}<select value={position} onChange={event => setPosition(event.target.value as WatermarkPosition)}><option value="top-left">{labels.topLeft}</option><option value="top-right">{labels.topRight}</option><option value="center">{labels.center}</option><option value="bottom-left">{labels.bottomLeft}</option><option value="bottom-right">{labels.bottomRight}</option></select></label><label>{labels.opacity}: {opacity}%<input type="range" min="1" max="100" value={opacity} onChange={event => setOpacity(Number(event.target.value))}/></label><label>{labels.scale}: {scale}%<input type="range" min="5" max="80" value={scale} onChange={event => setScale(Number(event.target.value))}/></label></>}
      <label>{labels.quality}: {quality}<input type="range" min="1" max="100" value={quality} onChange={event => setQuality(Number(event.target.value))}/></label>
      <label>{labels.saveMode}<select value={effectiveSaveMode} disabled={mode === "optimize" && format !== "original"} onChange={event => setSaveMode(event.target.value as "copy" | "overwrite")}><option value="copy">{labels.saveCopy}</option><option value="overwrite">{labels.overwrite}</option></select></label>
    </div>
    {mode === "optimize" && format !== "original" && <p className="sf-configured-limits">{labels.conversionCopyHint}</p>}
    {effectiveSaveMode === "overwrite" && <p className="sf-warning">{labels.overwriteWarning}</p>}
    {error && <p className="sf-warning" role="alert">{error}</p>}
  </Modal>;
}
