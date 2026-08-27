import { describe, expect, it, vi } from "vitest";
import { attributesFor, createCkeditor5UploadPlugin, imageHtml } from "../src/editorAdapters";
import type { AssetReference } from "../src/types";

const asset: AssetReference = { schemaVersion: "1.0", assetId: "00000000-0000-4000-8000-000000000001", resource: "Images", path: "photo.jpg", name: "photo.jpg", directory: false, mimeType: "image/jpeg", size: 10, modifiedAt: 1, version: "1-10", url: "/images/photo.jpg", downloadUrl: "/api/download", width: 1200, height: 800, alt: "A photo", variants: [{ width: 320, height: 213, url: "/variant/320", mimeType: "image/webp" }, { width: 640, height: 427, url: "/variant/640", mimeType: "image/webp" }], capabilities: { embeddable: true } };

describe("editor adapters", () => {
  it("creates consistent responsive insertion attributes", () => {
    expect(attributesFor(asset, { apiBase: "/api", csrfToken: "token", resource: "Images" })).toMatchObject({ src: "/images/photo.jpg", alt: "A photo", width: "1200", height: "800", srcset: "/variant/320 320w, /variant/640 640w", "data-sofinder-asset-id": asset.assetId });
    expect(imageHtml(asset, { apiBase: "/api", csrfToken: "token", resource: "Images" })).toContain('alt="A photo"');
  });

  it("registers a CKEditor 5 public upload adapter factory", () => {
    const repository = { createUploadAdapter: vi.fn() }; const editor = { plugins: { get: vi.fn(() => repository) } };
    createCkeditor5UploadPlugin({ apiBase: "/api", csrfToken: "token", resource: "Images" })(editor);
    expect(editor.plugins.get).toHaveBeenCalledWith("FileRepository"); expect(repository.createUploadAdapter).toBeTypeOf("function");
  });
});
