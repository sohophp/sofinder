import { describe, expect, it, vi } from "vitest";
import { attributesFor, ckeditorUploadResult, createCkeditor5UploadPlugin, imageHtml } from "../src/editorAdapters";
import { altForAsset, attributesForAsset, imageHtmlForAsset } from "../src/assetPresentation";
import type { AssetReference } from "../src/types";

const asset: AssetReference = { schemaVersion: "1.0", assetId: "00000000-0000-4000-8000-000000000001", resource: "Images", path: "photo.jpg", name: "photo.jpg", directory: false, mimeType: "image/jpeg", size: 10, modifiedAt: 1, version: "1-10", url: "/images/photo.jpg", downloadUrl: "/api/download", width: 1200, height: 800, alt: "A photo", variants: [{ width: 320, height: 213, url: "/variant/320", mimeType: "image/webp" }, { width: 640, height: 427, url: "/variant/640", mimeType: "image/webp" }], capabilities: { embeddable: true } };

describe("editor adapters", () => {
  it("creates consistent responsive insertion attributes", () => {
    expect(attributesFor(asset, { apiBase: "/api", csrfToken: "token", resource: "Images" })).toMatchObject({ src: "/images/photo.jpg", alt: "A photo", width: "1200", height: "800", srcset: "/variant/320 320w, /variant/640 640w", "data-sofinder-asset-id": asset.assetId });
    expect(imageHtml(asset, { apiBase: "/api", csrfToken: "token", resource: "Images" })).toContain('alt="A photo"');
  });

  it("preserves explicit decorative alt and falls back only when alt is unset", () => {
    expect(altForAsset({ ...asset, alt: "" })).toBe("");
    expect(altForAsset({ ...asset, alt: null })).toBe("photo");
    expect(attributesForAsset(asset)).toMatchObject({ alt: "A photo", srcset: "/variant/320 320w, /variant/640 640w", sizes: "(max-width: 1200px) 100vw, 1200px" });
    expect(imageHtmlForAsset({ ...asset, alt: 'A <photo> & "caption"' })).toContain('alt="A &lt;photo&gt; &amp; &quot;caption&quot;"');
  });

  it("registers a CKEditor 5 public upload adapter factory", () => {
    const repository = { createUploadAdapter: vi.fn() }; const editor = { plugins: { get: vi.fn(() => repository) } };
    createCkeditor5UploadPlugin({ apiBase: "/api", csrfToken: "token", resource: "Images" })(editor);
    expect(editor.plugins.get).toHaveBeenCalledWith("FileRepository"); expect(repository.createUploadAdapter).toBeTypeOf("function");
  });

  it("returns CKEditor responsive URLs with asset metadata for uploadComplete", () => {
    expect(ckeditorUploadResult(asset, { apiBase: "/api", csrfToken: "token", resource: "Images" })).toEqual({
      urls: { default: "/images/photo.jpg", "1200": "/images/photo.jpg", "320": "/variant/320", "640": "/variant/640" }, sofinderAlt: "A photo",
      sofinderAssetId: asset.assetId, sofinderWidth: 1200, sofinderHeight: 800,
    });
  });
});
