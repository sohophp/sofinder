export interface WatermarkDimensions {
  width: number;
  height: number;
}

/** Mirrors the GD/Imagick watermark sizing algorithm used by the API. */
export function watermarkPreviewDimensions(
  imageWidth: number,
  imageHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  scale: number,
): WatermarkDimensions | null {
  if (imageWidth <= 0 || imageHeight <= 0 || watermarkWidth <= 0 || watermarkHeight <= 0) return null;

  let width = Math.max(1, imageWidth * scale / 100);
  let height = Math.max(1, watermarkHeight * width / watermarkWidth);
  if (height > imageHeight) {
    height = imageHeight;
    width = Math.max(1, watermarkWidth * height / watermarkHeight);
  }

  return { width, height };
}
