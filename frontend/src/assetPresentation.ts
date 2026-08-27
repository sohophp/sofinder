export interface PresentableImageAsset {
  assetId?: string | null;
  name: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  variants?: Array<{ width: number; url: string }>;
}

export interface ImagePresentationOptions<T extends PresentableImageAsset = PresentableImageAsset> {
  defaultAlt?: (asset: T) => string;
  sizes?: string | ((asset: T) => string);
}

export const altForAsset = <T extends PresentableImageAsset>(asset: T, options: ImagePresentationOptions<T> = {}): string =>
  options.defaultAlt?.(asset) ?? asset.alt ?? asset.name.replace(/\.[^.]+$/, "");

export const attributesForAsset = <T extends PresentableImageAsset>(asset: T, options: ImagePresentationOptions<T> = {}): Record<string, string> => {
  const attributes: Record<string, string> = { src: asset.url, alt: altForAsset(asset, options) };
  if (asset.assetId) attributes["data-sofinder-asset-id"] = asset.assetId;
  if (asset.width) attributes.width = String(asset.width);
  if (asset.height) attributes.height = String(asset.height);
  if (asset.variants?.length) {
    attributes.srcset = asset.variants.map(variant => `${variant.url} ${variant.width}w`).join(", ");
    attributes.sizes = typeof options.sizes === "function"
      ? options.sizes(asset)
      : options.sizes ?? (asset.width ? `(max-width: ${asset.width}px) 100vw, ${asset.width}px` : "100vw");
  }
  return attributes;
};

const escapeHtml = (value: string): string => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const imageHtmlForAsset = <T extends PresentableImageAsset>(asset: T, options: ImagePresentationOptions<T> = {}): string =>
  `<img ${Object.entries(attributesForAsset(asset, options)).map(([name, value]) => `${name}="${escapeHtml(value)}"`).join(" ")}>`;
