// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { createWangEditorPickerIntegration, openPicker, pickerUrl, registerTinyMce, selectForCkeditor5, selectForInput, selectForJodit, selectForMarkdown, selectForWangEditor } from "../src/picker";

afterEach(() => vi.restoreAllMocks());

describe("picker SDK", () => {
  it("builds a reproducible picker deep link", () => {
    const url = pickerUrl({ baseUrl: "/sofinder/browser", kind: "image", resource: "Images", path: "campaign/hero", language: "zh-cn", tools: "full" }, "12345678-abcd-4321-abcd-123456789012");
    expect(url.pathname).toBe("/sofinder/browser");
    expect(url.searchParams.get("selection")).toBe("image");
    expect(url.searchParams.get("type")).toBe("Images");
    expect(url.searchParams.get("path")).toBe("campaign/hero");
    expect(url.searchParams.get("pickerRequestId")).toBe("12345678-abcd-4321-abcd-123456789012");
    expect(url.searchParams.get("pickerOrigin")).toBe(window.location.origin);
  });

  it("inserts a selected entry through the Markdown adapter", async () => {
    const popup = { closed: false } as Window;
    vi.spyOn(window, "open").mockReturnValue(popup);
    const textarea = document.createElement("textarea");
    textarea.value = "Before after";
    textarea.setSelectionRange(7, 7);
    const promise = selectForMarkdown(textarea, { baseUrl: "/sofinder/browser", kind: "image", language: "zh-cn" });
    const opened = new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]), window.location.href);
    const entry = { resource: "Images", path: "photo.png", name: "photo.png", directory: false, size: 12, modifiedAt: 1, mimeType: "image/png", url: "/files/photo.png", width: 320, height: 180, altTranslations: { "zh-cn": "产品照片" }, capabilities: {} };
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: opened.searchParams.get("pickerRequestId"), entry } }));
    await promise;
    expect(textarea.value).toBe("Before ![产品照片](</files/photo.png>)after");
  });

  it("accepts only a matching source, origin, version and request", async () => {
    const popup = { closed: false } as Window;
    vi.spyOn(window, "open").mockReturnValue(popup);
    const promise = openPicker({ baseUrl: "/sofinder/browser", kind: "file" });
    const opened = new URL(String(vi.mocked(window.open).mock.calls[0][0]), window.location.href);
    const id = opened.searchParams.get("pickerRequestId");
    const entry = { resource: "Files", path: "manual.pdf", name: "manual.pdf", directory: false, size: 12, modifiedAt: 1, mimeType: "application/pdf", url: "/files/manual.pdf", width: null, height: null, capabilities: {} };

    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: "https://attacker.invalid", data: { type: "sofinder:select", version: "1.0", requestId: id, entry } }));
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: id, entry: { ...entry, resource: "" } } }));
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: id, entry } }));

    await expect(promise).resolves.toEqual(entry);
  });

  it("provides editor and form adapters over the same picker protocol", async () => {
    const popup = { closed: false } as Window;
    vi.spyOn(window, "open").mockReturnValue(popup);
    const selectedElement = {}; const setAttribute = vi.fn();
    const editor = { execute: vi.fn(), editing: { view: { focus: vi.fn() } }, model: { document: { selection: { getSelectedElement: () => selectedElement } }, change: (callback: (writer: { setAttribute: typeof setAttribute }) => void) => callback({ setAttribute }) } };
    const promise = selectForCkeditor5(editor, { baseUrl: "/sofinder/browser" });
    const opened = new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]), window.location.href);
    const entry = { resource: "Images", path: "photo.png", name: "photo.png", directory: false, size: 12, modifiedAt: 1, mimeType: "image/png", url: "/files/photo.png", width: 320, height: 180, assetId: "00000000-0000-4000-8000-000000000001", capabilities: {} };
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: opened.searchParams.get("pickerRequestId"), entry } }));
    await promise;
    expect(editor.execute).toHaveBeenCalledWith("insertImage", { source: entry.url });
    expect(editor.execute).toHaveBeenCalledWith("imageTextAlternative", { newValue: "photo" });
    expect(setAttribute).toHaveBeenCalledWith("sofinderAssetId", entry.assetId, selectedElement);

    const input = document.createElement("input");
    const changed = vi.fn();
    input.addEventListener("change", changed);
    const inputPromise = selectForInput(input, { baseUrl: "/sofinder/browser" });
    const inputUrl = new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]), window.location.href);
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: inputUrl.searchParams.get("pickerRequestId"), entry } }));
    await inputPromise;
    expect(input.value).toBe(entry.url);
    expect(changed).toHaveBeenCalledOnce();
  });

  it("preserves a same-origin relative URL selected from a nested folder", async () => {
    const popup = { closed: false } as Window;
    vi.spyOn(window, "open").mockReturnValue(popup);
    const input = document.createElement("input");
    const promise = selectForInput(input, { baseUrl: "/sofinder/browser", kind: "image" });
    const opened = new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]), window.location.href);
    const entry = { resource: "Images", path: "campaign/summer/hero.jpg", name: "hero.jpg", directory: false, size: 12, modifiedAt: 1, mimeType: "image/jpeg", url: "/host-files/Images/hero.jpg?path=campaign%2Fsummer%2Fhero.jpg", width: 320, height: 180, capabilities: {} };
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: opened.searchParams.get("pickerRequestId"), entry } }));

    await expect(promise).resolves.toEqual(entry);
    expect(input.value).toBe(entry.url);
    expect(input.value).not.toMatch(/^https?:\/\//);
  });

  it("registers TinyMCE without importing editor internals", () => {
    const add = vi.fn();
    registerTinyMce({ PluginManager: { add } }, { baseUrl: "/sofinder/browser" });
    expect(add).toHaveBeenCalledWith("sofinder", expect.any(Function));
  });

  it("inserts a selected image through wangEditor's public node API", async () => {
    const popup = { closed: false } as Window;
    vi.spyOn(window, "open").mockReturnValue(popup);
    const editor = { restoreSelection: vi.fn(), insertNode: vi.fn(), focus: vi.fn() };
    const promise = selectForWangEditor(editor, { baseUrl: "/sofinder/browser", language: "zh-cn" });
    const opened = new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]), window.location.href);
    const entry = { resource: "Images", path: "photo.png", name: "photo.png", directory: false, size: 12, modifiedAt: 1, mimeType: "image/png", url: "/files/photo.png", width: 320, height: 180, altTranslations: { "zh-cn": "产品照片" }, capabilities: {} };
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: opened.searchParams.get("pickerRequestId"), entry } }));
    await expect(promise).resolves.toEqual(entry);
    expect(editor.restoreSelection).toHaveBeenCalledOnce();
    expect(editor.insertNode).toHaveBeenCalledWith({ type: "image", src: entry.url, alt: "产品照片", href: "", children: [{ text: "" }] });
    expect(editor.focus).toHaveBeenCalledOnce();
  });

  it("provides wangEditor's public custom picker contract", () => {
    expect(createWangEditorPickerIntegration({ baseUrl: "/sofinder/browser" }).customBrowseAndUpload).toBeTypeOf("function");
  });

  it("inserts a selected image through Jodit's public selection API", async () => {
    const popup = { closed: false } as Window;
    vi.spyOn(window, "open").mockReturnValue(popup);
    const image = document.createElement("img");
    const editor = { createInside: { element: vi.fn(() => image) }, s: { insertImage: vi.fn() } };
    const promise = selectForJodit(editor, { baseUrl: "/sofinder/browser", language: "zh-cn" });
    const opened = new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]), window.location.href);
    const entry = { resource: "Images", path: "photo.png", name: "photo.png", directory: false, size: 12, modifiedAt: 1, mimeType: "image/png", url: "/files/photo.png", width: 320, height: 180, assetId: "00000000-0000-4000-8000-000000000001", altTranslations: { "zh-cn": "产品照片" }, capabilities: {} };
    window.dispatchEvent(new MessageEvent("message", { source: popup, origin: window.location.origin, data: { type: "sofinder:select", version: "1.0", requestId: opened.searchParams.get("pickerRequestId"), entry } }));
    await expect(promise).resolves.toEqual(entry);
    expect(image.getAttribute("src")).toBe(entry.url);
    expect(image.getAttribute("alt")).toBe("产品照片");
    expect(image.getAttribute("data-sofinder-asset-id")).toBe(entry.assetId);
    expect(editor.s.insertImage).toHaveBeenCalledWith(image);
  });
});
