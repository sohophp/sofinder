import { describe, expect, it, vi } from "vitest";
import { attributesFor, ckeditorUploadResult, createCkeditor5UploadPlugin, createJoditUploadIntegration, createWangEditorUploadIntegration, imageHtml, resourceForUpload } from "../src/editorAdapters";
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

  it("selects localized alt before the default and preserves localized decorative text", () => {
    const localized = { ...asset, altTranslations: { en: "English photo", "zh-cn": "中文照片", "zh-tw": "" } };
    expect(altForAsset(localized, { locale: "zh-CN" })).toBe("中文照片");
    expect(altForAsset(localized, { locale: "zh-TW" })).toBe("");
    expect(altForAsset(localized, { locale: "fr-FR" })).toBe("A photo");
  });

  it("registers a CKEditor 5 public upload adapter factory", () => {
    const repository = { createUploadAdapter: vi.fn() }; const editor = { plugins: { get: vi.fn(() => repository) } };
    const Plugin = createCkeditor5UploadPlugin({ apiBase: "/api", csrfToken: "token", resource: "Images" });
    expect(Plugin.pluginName).toBe("SoFinderUpload");
    const plugin = new Plugin(editor);
    expect(editor.plugins.get).not.toHaveBeenCalled();
    plugin.init();
    expect(editor.plugins.get).toHaveBeenCalledWith("FileRepository"); expect(repository.createUploadAdapter).toBeTypeOf("function");
  });

  it("returns CKEditor responsive URLs with asset metadata for uploadComplete", () => {
    expect(ckeditorUploadResult(asset, { apiBase: "/api", csrfToken: "token", resource: "Images" })).toEqual({
      urls: { default: "/images/photo.jpg", "1200": "/images/photo.jpg", "320": "/variant/320", "640": "/variant/640" }, sofinderAlt: "A photo",
      sofinderAssetId: asset.assetId, sofinderWidth: 1200, sofinderHeight: 800,
    });
  });

  it("routes direct editor uploads by inspected MIME or extension with a safe fallback", () => {
    const options = { apiBase: "/api", csrfToken: "token", resource: "Files", resourceRoutes: [{ resource: "Images", mimeTypes: ["image/png"] }, { resource: "Documents", extensions: ["pdf"] }] };
    expect(resourceForUpload(new File(["x"], "photo.bin", { type: "image/png" }), options)).toBe("Images");
    expect(resourceForUpload(new File(["x"], "manual.PDF"), options)).toBe("Documents");
    expect(resourceForUpload(new File(["x"], "archive.zip"), options)).toBe("Files");
  });

  it("provides wangEditor 5's public custom upload contract", () => {
    const integration = createWangEditorUploadIntegration({ apiBase: "/api", csrfToken: "token", resource: "Images" });
    expect(integration.customUpload).toBeTypeOf("function");
  });

  it("provides Jodit's public custom uploader contract", () => {
    const integration = createJoditUploadIntegration({ apiBase: "/api", csrfToken: "token", resource: "Images" });
    expect(integration.customUploadFunction).toBeTypeOf("function");
    expect(integration.isSuccess({ success: true, data: { assets: [] } })).toBe(true);
    expect(integration.process({ success: true, data: { assets: [asset] } })).toEqual({ assets: [asset] });
    const image = { setAttribute: vi.fn() } as unknown as HTMLImageElement;
    const editor = { createInside: { element: vi.fn(() => image) }, s: { insertImage: vi.fn() } };
    integration.defaultHandlerSuccess.call({ j: editor }, { assets: [asset] });
    expect(image.setAttribute).toHaveBeenCalledWith("alt", "A photo");
    expect(image.setAttribute).toHaveBeenCalledWith("data-sofinder-asset-id", asset.assetId);
    expect(editor.s.insertImage).toHaveBeenCalledWith(image);
  });
});
