export interface CropRect { x: number; y: number; width: number; height: number }
export interface CropBounds { width: number; height: number }

const limit = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(value, maximum));

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
