export interface PresentableImageAsset {
    assetId?: string | null;
    name: string;
    url: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
    variants?: Array<{
        width: number;
        url: string;
    }>;
}
export interface ImagePresentationOptions<T extends PresentableImageAsset = PresentableImageAsset> {
    defaultAlt?: (asset: T) => string;
    sizes?: string | ((asset: T) => string);
}
export declare const altForAsset: <T extends PresentableImageAsset>(asset: T, options?: ImagePresentationOptions<T>) => string;
export declare const attributesForAsset: <T extends PresentableImageAsset>(asset: T, options?: ImagePresentationOptions<T>) => Record<string, string>;
export declare const imageHtmlForAsset: <T extends PresentableImageAsset>(asset: T, options?: ImagePresentationOptions<T>) => string;
