export interface PresentableImageAsset {
  assetId?: string | null;
  name: string;
  url: string;
  alt?: string | null;
  altTranslations?: Record<string, string>;
  width?: number | null;
  height?: number | null;
  variants?: Array<{ width: number; url: string }>;
}

export interface ImagePresentationOptions<T extends PresentableImageAsset = PresentableImageAsset> {
  defaultAlt?: (asset: T) => string;
  locale?: string;
  sizes?: string | ((asset: T) => string);
}

const localizedAlt = (asset: PresentableImageAsset, locale?: string): string | null | undefined => {
  if (!locale) return undefined;
  const normalized = locale.trim().toLowerCase();
  if (!normalized) return undefined;
  if (Object.prototype.hasOwnProperty.call(asset.altTranslations ?? {}, normalized)) return asset.altTranslations?.[normalized];
  const language = normalized.split("-")[0];
  return Object.prototype.hasOwnProperty.call(asset.altTranslations ?? {}, language) ? asset.altTranslations?.[language] : undefined;
};

export const altForAsset = <T extends PresentableImageAsset>(asset: T, options: ImagePresentationOptions<T> = {}): string =>
  options.defaultAlt?.(asset) ?? localizedAlt(asset, options.locale) ?? asset.alt ?? asset.name.replace(/\.[^.]+$/, "");

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
