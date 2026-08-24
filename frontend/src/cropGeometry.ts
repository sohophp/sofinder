export interface CropRect { x: number; y: number; width: number; height: number }
export interface CropPoint { x: number; y: number }
export interface CropBounds { width: number; height: number }
export type CropResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const limit = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(value, maximum));

export function cropCursorFor(handle: CropResizeHandle | null, inside: boolean): string {
  if (handle === "nw" || handle === "se") return "nwse-resize";
  if (handle === "ne" || handle === "sw") return "nesw-resize";
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  return inside ? "move" : "crosshair";
}

export function clampCropRect(value: CropRect, bounds: CropBounds): CropRect {
  const x = limit(Math.round(value.x), 0, Math.max(0, bounds.width - 1));
  const y = limit(Math.round(value.y), 0, Math.max(0, bounds.height - 1));
  return {
    x,
    y,
    width: limit(Math.round(value.width), 1, Math.max(1, bounds.width - x)),
    height: limit(Math.round(value.height), 1, Math.max(1, bounds.height - y)),
  };
}

/**
 * Resize a crop box like Cropper.js: corners change both dimensions around a
 * fixed opposite corner, while edge handles change a single axis. When an
 * aspect ratio is active, the secondary axis grows from its centre.
 */
export function resizeCropRect(original: CropRect, handle: CropResizeHandle, pointer: CropPoint, bounds: CropBounds, aspectRatio = 0): CropRect {
  const left = original.x;
  const top = original.y;
  const right = left + original.width;
  const bottom = top + original.height;
  const west = handle.includes("w");
  const east = handle.includes("e");
  const north = handle.includes("n");
  const south = handle.includes("s");

  if (aspectRatio <= 0) {
    const nextLeft = west ? limit(pointer.x, 0, right - 1) : left;
    const nextRight = east ? limit(pointer.x, left + 1, bounds.width) : right;
    const nextTop = north ? limit(pointer.y, 0, bottom - 1) : top;
    const nextBottom = south ? limit(pointer.y, top + 1, bounds.height) : bottom;
    return clampCropRect({ x: nextLeft, y: nextTop, width: nextRight - nextLeft, height: nextBottom - nextTop }, bounds);
  }

  if ((west || east) && (north || south)) {
    const anchorX = west ? right : left;
    const anchorY = north ? bottom : top;
    const maxWidth = west ? anchorX : bounds.width - anchorX;
    const maxHeight = north ? anchorY : bounds.height - anchorY;
    const rawWidth = limit(Math.abs(pointer.x - anchorX), 1, maxWidth);
    const rawHeight = limit(Math.abs(pointer.y - anchorY), 1, maxHeight);
    let width: number;
    let height: number;
    if (rawWidth / rawHeight >= aspectRatio) {
      width = rawWidth;
      height = width / aspectRatio;
    } else {
      height = rawHeight;
      width = height * aspectRatio;
    }
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    width *= scale;
    height *= scale;
    const roundedWidth = Math.max(1, Math.round(width));
    const roundedHeight = Math.max(1, Math.round(height));
    return clampCropRect({
      x: west ? anchorX - roundedWidth : anchorX,
      y: north ? anchorY - roundedHeight : anchorY,
      width: roundedWidth,
      height: roundedHeight,
    }, bounds);
  }

  if (west || east) {
    const anchorX = west ? right : left;
    const maxWidth = west ? anchorX : bounds.width - anchorX;
    const centreY = top + original.height / 2;
    const maxHeight = 2 * Math.min(centreY, bounds.height - centreY);
    const width = Math.min(limit(Math.abs(pointer.x - anchorX), 1, maxWidth), maxHeight * aspectRatio);
    const height = width / aspectRatio;
    return clampCropRect({ x: west ? anchorX - width : anchorX, y: centreY - height / 2, width, height }, bounds);
  }

  const anchorY = north ? bottom : top;
  const maxHeight = north ? anchorY : bounds.height - anchorY;
  const centreX = left + original.width / 2;
  const maxWidth = 2 * Math.min(centreX, bounds.width - centreX);
  const height = Math.min(limit(Math.abs(pointer.y - anchorY), 1, maxHeight), maxWidth / aspectRatio);
  const width = height * aspectRatio;
  return clampCropRect({ x: centreX - width / 2, y: north ? anchorY - height : anchorY, width, height }, bounds);
}
