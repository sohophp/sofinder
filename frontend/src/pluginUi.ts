import type { Entry, PluginPreviewer, PluginUiAction } from "./types";
import type { Language } from "./i18n";

type RegisteredPreviewer = PluginPreviewer & { plugin: string };

export const pluginLabel = (action: PluginUiAction, language: Language) => action.label[language] || action.label.en;

export const previewerFor = (entry: Entry, previewers: RegisteredPreviewer[]) => {
  if (entry.directory) return null;
  const mime = entry.mimeType?.toLowerCase() || "";
  const extension = entry.name.includes(".") ? entry.name.split(".").pop()?.toLowerCase() || "" : "";
  return previewers.find(previewer => previewer.extensions.includes(extension) || previewer.mimeTypes.some(candidate => candidate === mime || (candidate.endsWith("/*") && mime.startsWith(candidate.slice(0, -1))))) || null;
};

export const previewerUrl = (entry: Entry, previewers: RegisteredPreviewer[], resource: string) => {
  const previewer = previewerFor(entry, previewers);
  if (!previewer) return null;
  const url = new URL(previewer.url, window.location.href);
  url.searchParams.set("resource", resource);
  url.searchParams.set("path", entry.path);
  return url.toString();
};

export const pluginActionAvailable = (action: PluginUiAction, entry: Entry | null) => {
  if (action.selection === "none") return entry === null;
  if (!entry) return false;
  if (action.selection === "file" && entry.directory) return false;
  if (action.selection === "image" && (entry.directory || !entry.mimeType?.startsWith("image/"))) return false;
  return entry.capabilities?.[action.requires] !== false;
};
