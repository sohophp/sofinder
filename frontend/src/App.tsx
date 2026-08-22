import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Api, ApiError } from "./api";
import { translator } from "./i18n";
import type { Entry, ImageInfo, ImagePreset, MetadataState, ResourceType, SoFinderConfig } from "./types";
import { ConfirmDialog, TextDialog } from "./components/Dialogs";
import { ContextMenu } from "./components/ContextMenu";
import { FolderTree } from "./components/FolderTree";
import { ImageEditor } from "./components/ImageEditor";
import { Modal } from "./components/Modal";
import { TrashDialog } from "./components/TrashDialog";
import { TagsDialog } from "./components/TagsDialog";

type ViewMode = "grid" | "list";
type SortMode = "name" | "size" | "modified";
type UploadStatus = "queued" | "uploading" | "done" | "error" | "cancelled";
interface UploadTask { id: string; name: string; progress: number; status: UploadStatus; message?: string }
interface ToolPreferences { resize: boolean; crop: boolean; rotate: boolean; presets: boolean }
interface FeaturePreferences { recent: boolean; favorites: boolean; tags: boolean; archive: boolean; trash: boolean; folderTree: boolean; autoCollapseUploads: boolean }
interface DestinationDialog { operation: "copy" | "move"; path: string; folders: Entry[]; loading: boolean }
interface TextDialogState { kind: "folder" | "rename" | "resize"; title: string; label: string; initial: string; maximum: number; extension?: string }
interface ConfirmState { title: string; message: string; detail?: string; danger?: boolean }

const defaultTools: ToolPreferences = { resize: false, crop: false, rotate: false, presets: false };
const defaultFeatures: FeaturePreferences = { recent: false, favorites: false, tags: false, archive: false, trash: true, folderTree: false, autoCollapseUploads: true };
const loadPreferences = <T extends object>(key: string, defaults: T): T => {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "{}") as Record<string, unknown>;
    return Object.fromEntries(Object.entries(defaults).map(([name, fallback]) => [name, typeof saved[name] === "boolean" ? saved[name] : fallback])) as T;
  } catch { return defaults; }
};
const loadToolPreferences = (): ToolPreferences => {
  return loadPreferences("sofinder.imageTools.v2", defaultTools);
};

const Icon = ({ kind }: { kind: "folder" | "file" | "image" }) => {
  if (kind === "folder") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 12h15l4 5h19v23H5z" fill="currentColor" opacity=".2"/><path d="M5 12h15l4 5h19v23H5z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>;
  if (kind === "image") return <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="5" width="34" height="38" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="17" cy="16" r="4" fill="currentColor" opacity=".35"/><path d="m10 37 10-11 7 7 5-5 7 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h19l9 9v29H10z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M29 5v10h9" fill="none" stroke="currentColor" strokeWidth="2.5"/></svg>;
};

const ThumbnailImage = ({ src, alt, lazy = false }: { src: string; alt: string; lazy?: boolean }) => {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const retryTimer = useRef<number | null>(null);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
    return () => {
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    };
  }, [src]);

  if (failed) return <Icon kind="image"/>;
  const retrySrc = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return <img
    src={retrySrc}
    alt={alt}
    loading={lazy ? "lazy" : undefined}
    decoding="async"
    onError={() => {
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
      if (attempt >= 2) {
        setFailed(true);
        return;
      }
      retryTimer.current = window.setTimeout(() => setAttempt(current => current + 1), 700 * (attempt + 1));
    }}
  />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};
const characterLength = (value: string) => Array.from(value).length;
const columnLimits = { left: { initial: 220, min: 110, max: 330 }, right: { initial: 270, min: 135, max: 405 } } as const;
const loadColumnWidth = (side: "left" | "right") => {
  const value = Number(localStorage.getItem(`sofinder.column.${side}`));
  const limits = columnLimits[side];
  return Number.isFinite(value) ? Math.max(limits.min, Math.min(limits.max, value)) : limits.initial;
};

export default function App({ config }: { config: SoFinderConfig }) {
  const api = useMemo(() => new Api(config), [config]);
  const t = useMemo(() => translator(config.language), [config.language]);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [resource, setResource] = useState(config.resource);
  const [path, setPath] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(() => new Set());
  const [selectionAnchor, setSelectionAnchor] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"name" | "tags">("name");
  const [sort, setSort] = useState<SortMode>("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<ViewMode>(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [copyStatus, setCopyStatus] = useState<"" | "copied" | "manual">("");
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [uploadsCollapsed, setUploadsCollapsed] = useState(false);
  const [metadata, setMetadata] = useState<MetadataState>({ favorites: [], tags: {}, recent: [] });
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [tools, setTools] = useState<ToolPreferences>(loadToolPreferences);
  const [features, setFeatures] = useState<FeaturePreferences>(() => loadPreferences("sofinder.features.v2", { ...defaultFeatures, folderTree: config.featureDefaults?.folderTree ?? false }));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [destinationDialog, setDestinationDialog] = useState<DestinationDialog | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [textDialog, setTextDialog] = useState<TextDialogState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState | null>(null);
  const [trashOpen, setTrashOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; entry: Entry } | null>(null);
  const [previewEntry, setPreviewEntry] = useState<Entry | null>(null);
  const [imagePresets, setImagePresets] = useState<Record<string, ImagePreset>>({});
  const [directoryCapabilities, setDirectoryCapabilities] = useState<Record<string, boolean>>({});
  const [leftWidth, setLeftWidth] = useState(() => loadColumnWidth("left"));
  const [rightWidth, setRightWidth] = useState(() => loadColumnWidth("right"));
  const uploadInput = useRef<HTMLInputElement>(null);
  const uploadControllers = useRef(new Map<string, AbortController>());
  const uploadSequence = useRef(0);
  const confirmResolver = useRef<((answer: boolean) => void) | null>(null);
  const longPress = useRef<number | null>(null);
  const fileUrlInput = useRef<HTMLInputElement>(null);
  const columnDrag = useRef<{ side: "left" | "right"; startX: number; startWidth: number; currentWidth: number } | null>(null);
  const pageSize = 100;

  useEffect(() => {
    const variableNames = {
      accent: "--sf-accent",
      background: "--sf-bg",
      panel: "--sf-panel",
      text: "--sf-text",
      muted: "--sf-muted",
      danger: "--sf-danger",
      radius: "--sf-radius",
    } as const;
    const root = document.documentElement;
    const previous = Object.values(variableNames).map(name => [name, root.style.getPropertyValue(name)] as const);
    Object.entries(variableNames).forEach(([key, name]) => root.style.setProperty(name, config.theme[key as keyof typeof config.theme]));
    return () => previous.forEach(([name, value]) => value ? root.style.setProperty(name, value) : root.style.removeProperty(name));
  }, [config.theme]);

  const report = useCallback((error: unknown) => setNotice(error instanceof Error ? error.message : t("error")), [t]);
  const ask = useCallback((state: ConfirmState) => new Promise<boolean>(resolve => {
    confirmResolver.current?.(false);
    confirmResolver.current = resolve;
    setConfirmDialog(state);
  }), []);
  const answerConfirm = (answer: boolean) => {
    const resolve = confirmResolver.current;
    confirmResolver.current = null;
    setConfirmDialog(null);
    resolve?.(answer);
  };
  const load = useCallback(async (nextResource = resource, nextPath = path, term = search, nextOffset = offset, nextSort = sort, nextDirection = direction, nextSearchMode = searchMode) => {
    if (!nextResource) return;
    setLoading(true);
    setNotice("");
    try {
      const result = await api.list(nextResource, nextPath, term, nextSort, nextDirection, nextOffset, pageSize, nextSearchMode);
      setEntries(result.entries);
      setPath(result.path);
      setOffset(result.offset);
      setTotal(result.total);
      setDirectoryCapabilities(result.capabilities || {});
      setSelectedPaths(new Set());
      setSelectionAnchor(null);
    } catch (error) { report(error); }
    finally { setLoading(false); }
  }, [api, direction, offset, path, report, resource, search, searchMode, sort]);

  useEffect(() => {
    api.configData().then(({ resources: available, imagePresets: presets }) => {
      setResources(available);
      setImagePresets(presets || {});
      const initial = available.some(item => item.name === config.resource) ? config.resource : available[0]?.name || "";
      setResource(initial);
      if (initial) void load(initial, "", "", 0);
    }).catch(report);
  }, [api, config.resource]);

  useEffect(() => {
    const timer = window.setTimeout(() => { if (resource) void load(resource, path, search, 0); }, 250);
    return () => window.clearTimeout(timer);
  }, [search, searchMode]);

  useEffect(() => {
    if (!resource) return;
    if (!features.recent && !features.favorites && !features.tags) {
      setMetadata({ favorites: [], tags: {}, recent: [] });
      return;
    }
    api.metadata(resource).then(setMetadata).catch(report);
  }, [api, features.favorites, features.recent, features.tags, report, resource]);

  useEffect(() => {
    if (!features.autoCollapseUploads || uploads.length === 0 || uploads.some(task => task.status === "queued" || task.status === "uploading")) return;
    const timer = window.setTimeout(() => setUploadsCollapsed(true), 1200);
    return () => window.clearTimeout(timer);
  }, [features.autoCollapseUploads, uploads]);

  useEffect(() => {
    const paste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files || []);
      if (files.length > 0 && !currentResource?.readOnly && directoryCapabilities.upload !== false) {
        event.preventDefault();
        void upload(files);
      }
    };
    window.addEventListener("paste", paste);
    return () => window.removeEventListener("paste", paste);
  });

  const crumbs = useMemo(() => path === "" ? [] : path.split("/"), [path]);
  const currentResource = resources.find(item => item.name === resource);
  const currentDepth = path === "" ? 0 : path.split("/").length;
  const selectedEntries = useMemo(() => entries.filter(entry => selectedPaths.has(entry.path)), [entries, selectedPaths]);
  const selected = selectedEntries.length === 1 ? selectedEntries[0] : null;
  const selectedFileUrl = useMemo(() => {
    if (!selected || selected.directory) return "";
    return new URL(selected.url || api.downloadUrl(resource, selected.path), document.baseURI).href;
  }, [api, resource, selected]);
  const canSelected = (operation: string) => selectedEntries.length > 0 && selectedEntries.every(entry => entry.capabilities?.[operation] !== false);

  useEffect(() => {
    setCopyStatus("");
    setImageInfo(null);
    if (!selected?.mimeType?.startsWith("image/")) return;
    let active = true;
    api.imageInfo(resource, selected.path).then(info => { if (active) setImageInfo(info); }).catch(error => { if (active) report(error); });
    return () => { active = false; };
  }, [api, resource, selected?.path, selected?.mimeType, report]);

  const copyFileUrl = async () => {
    if (!selectedFileUrl) return;
    try {
      await navigator.clipboard.writeText(selectedFileUrl);
      setCopyStatus("copied");
    } catch {
      fileUrlInput.current?.focus();
      fileUrlInput.current?.select();
      setCopyStatus("manual");
    }
  };

  const selectEntry = (entry: Entry, event: React.MouseEvent) => {
    if (event.shiftKey && selectionAnchor) {
      const anchorIndex = entries.findIndex(item => item.path === selectionAnchor);
      const entryIndex = entries.findIndex(item => item.path === entry.path);
      if (anchorIndex >= 0 && entryIndex >= 0) {
        const [start, end] = anchorIndex < entryIndex ? [anchorIndex, entryIndex] : [entryIndex, anchorIndex];
        setSelectedPaths(new Set(entries.slice(start, end + 1).map(item => item.path)));
        return;
      }
    }
    if (event.ctrlKey || event.metaKey) {
      setSelectedPaths(current => {
        const next = new Set(current);
        if (next.has(entry.path)) next.delete(entry.path); else next.add(entry.path);
        return next;
      });
    } else {
      setSelectedPaths(new Set([entry.path]));
    }
    setSelectionAnchor(entry.path);
    if (features.recent) void api.updateMetadata(resource, entry.path, "touch").then(setMetadata).catch(() => undefined);
  };

  const openEntry = (entry: Entry) => {
    if (entry.directory) void load(resource, entry.path, search, 0);
    else choose(entry);
  };

  const createFolder = async () => {
    if (!currentResource) return;
    setTextDialog({ kind: "folder", title: t("newFolder"), label: t("folderName"), initial: "", maximum: currentResource.maxFolderNameLength });
  };

  const updateUpload = (id: string, values: Partial<UploadTask>) => {
    setUploads(current => current.map(task => task.id === id ? { ...task, ...values } : task));
  };

  const upload = async (files: FileList | File[], targetPath = path) => {
    const candidates = Array.from(files);
    const accepted = currentResource ? candidates.filter(file => characterLength(file.name) <= currentResource.maxFileNameLength) : candidates;
    if (accepted.length !== candidates.length && currentResource) {
      setNotice(`${t("fileNameTooLong")} ${currentResource.maxFileNameLength}`);
    }
    const jobs = accepted.map(file => {
      const id = `${Date.now()}-${++uploadSequence.current}`;
      const controller = new AbortController();
      uploadControllers.current.set(id, controller);
      return { id, file, controller };
    });
    if (jobs.length === 0) return;
    setUploadsCollapsed(false);
    setUploads(current => [...current, ...jobs.map(({ id, file }) => ({ id, name: file.name, progress: 0, status: "queued" as const }))]);

    let cursor = 0;
    const worker = async () => {
      while (cursor < jobs.length) {
        const job = jobs[cursor++];
        if (job.controller.signal.aborted) {
          uploadControllers.current.delete(job.id);
          continue;
        }
        updateUpload(job.id, { status: "uploading", progress: 0, message: undefined });
        let overwrite = false;
        try {
          for (;;) {
            try {
              await api.upload(resource, targetPath, job.file, {
                overwrite,
                signal: job.controller.signal,
                onProgress: progress => updateUpload(job.id, { progress }),
              });
              updateUpload(job.id, { status: "done", progress: 100 });
              break;
            } catch (error) {
              if (error instanceof ApiError && error.code === "conflict" && !overwrite && await ask({ title: t("replaceFile"), message: job.file.name, detail: t("confirmImageOverwrite") })) {
                overwrite = true;
                updateUpload(job.id, { progress: 0 });
                continue;
              }
              throw error;
            }
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            updateUpload(job.id, { status: "cancelled", message: t("cancelled") });
          } else {
            updateUpload(job.id, { status: "error", message: error instanceof Error ? error.message : t("error") });
          }
        } finally {
          uploadControllers.current.delete(job.id);
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(3, jobs.length) }, () => worker()));
    await load();
  };
  const uploadTo = (targetPath: string, files: FileList | File[]) => upload(files, targetPath);

  const cancelUpload = (id: string) => {
    uploadControllers.current.get(id)?.abort();
    updateUpload(id, { status: "cancelled", message: t("cancelled") });
  };

  const cancelAllUploads = () => {
    uploadControllers.current.forEach(controller => controller.abort());
    setUploads(current => current.map(task => task.status === "queued" || task.status === "uploading" ? { ...task, status: "cancelled", message: t("cancelled") } : task));
  };

  const removeUploadTask = (id: string) => {
    uploadControllers.current.get(id)?.abort();
    uploadControllers.current.delete(id);
    setUploads(current => current.filter(task => task.id !== id));
  };

  const rename = async () => {
    if (!selected || !currentResource) return;
    const extensionAt = selected.directory ? -1 : selected.name.lastIndexOf(".");
    const extension = extensionAt > 0 ? selected.name.slice(extensionAt) : "";
    const currentName = extension ? selected.name.slice(0, extensionAt) : selected.name;
    const maximum = selected.directory ? currentResource.maxFolderNameLength : currentResource.maxFileNameLength;
    setTextDialog({ kind: "rename", title: t("rename"), label: extension ? t("newBaseName") : t("newName"), initial: currentName, maximum, extension });
  };

  const remove = async () => {
    if (selectedEntries.length === 0 || !await ask({ title: t("remove"), message: selectedEntries.length === 1 ? t("confirmDelete") : `${t("confirmDeleteMany")} ${selectedEntries.length}`, detail: t("trashRetention"), danger: true })) return;
    try {
      const result = await api.batch("delete", resource, selectedEntries.map(entry => entry.path));
      const summary = result.failed === 0 ? `${result.succeeded} ${t("completed")}` : `${result.succeeded} ${t("completed")}, ${result.failed} ${t("failed")}`;
      setNotice(result.purgedItems > 0 ? `${summary} · ${t("trashAutoPurged")} ${result.purgedItems} ${t("items")} (${formatSize(result.purgedBytes)})` : summary);
      await load();
    } catch (error) { report(error); }
  };

  const transfer = async (operation: "copy" | "move", destination: string) => {
    try {
      const result = await api.batch(operation, resource, selectedEntries.map(entry => entry.path), destination);
      setDestinationDialog(null);
      setNotice(result.failed === 0 ? `${result.succeeded} ${t("completed")}` : `${result.succeeded} ${t("completed")}, ${result.failed} ${t("failed")}`);
      await load();
    } catch (error) { report(error); }
  };

  const browseDestination = async (operation: "copy" | "move", destination: string) => {
    setDestinationDialog({ operation, path: destination, folders: [], loading: true });
    try {
      const result = await api.list(resource, destination, "", "name", "asc", 0, 500);
      setDestinationDialog({ operation, path: result.path, folders: result.entries.filter(entry => entry.directory), loading: false });
    } catch (error) {
      setDestinationDialog(null);
      report(error);
    }
  };

  const choose = (entry = selected) => {
    if (!entry || entry.directory || !entry.url) return;
    if (config.ckeditorFunction > 0) {
      const target = window.opener || window.parent;
      const ckeditor = (target as Window & { CKEDITOR?: { tools?: { callFunction?: (id: number, url: string) => void } } }).CKEDITOR;
      ckeditor?.tools?.callFunction?.(config.ckeditorFunction, entry.url);
      window.close();
      return;
    }
    window.dispatchEvent(new CustomEvent("sofinder:select", { detail: entry }));
  };

  const toggleSelectAll = () => {
    setSelectedPaths(current => current.size === entries.length ? new Set() : new Set(entries.map(entry => entry.path)));
    setSelectionAnchor(null);
  };

  const editImage = async (rotation: number, width = 0, height = 0) => {
    if (!selected || !selected.mimeType?.startsWith("image/")) return;
    setLoading(true);
    try {
      const actions = rotation !== 0
        ? [{ type: "rotate" as const, degrees: rotation as 90 | 180 | 270 }]
        : [{ type: "resize" as const, width, height }];
      const updated = await api.applyImageActions(resource, selected.path, actions, { mode: "copy" });
      setNotice(`${t("imageCreated")}: ${updated.entry.name} · ${updated.result.width} × ${updated.result.height} px`);
      await load();
    } catch (error) {
      report(error);
      setLoading(false);
    }
  };

  const resizeImage = () => {
    if (!selected) return;
    setTextDialog({ kind: "resize", title: t("resize"), label: t("resizePrompt"), initial: "1200x1200", maximum: 9 });
  };

  const openCropEditor = () => {
    if (!selected || !imageInfo) return;
    setCropOpen(true);
  };

  const updateTool = (name: keyof ToolPreferences, enabled: boolean) => {
    setTools(current => {
      const next = { ...current, [name]: enabled };
      localStorage.setItem("sofinder.imageTools.v2", JSON.stringify(next));
      return next;
    });
  };

  const updateFeature = (name: keyof FeaturePreferences, enabled: boolean) => {
    setFeatures(current => {
      const next = { ...current, [name]: enabled };
      localStorage.setItem("sofinder.features.v2", JSON.stringify(next));
      return next;
    });
  };

  const downloadArchive = async () => {
    if (selectedEntries.length === 0) return;
    try {
      const blob = await api.downloadArchive(resource, selectedEntries.map(entry => entry.path));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "sofinder-download.zip";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      report(error);
    }
  };

  const toggleFavorite = async () => {
    if (!selected) return;
    try {
      setMetadata(await api.updateMetadata(resource, selected.path, "favorite", { favorite: !metadata.favorites.includes(selected.path) }));
    } catch (error) { report(error); }
  };

  const editTags = async () => {
    if (!selected) return;
    setTagsOpen(true);
  };

  const submitTextDialog = async (value: string) => {
    const dialog = textDialog;
    setTextDialog(null);
    if (!dialog) return;
    try {
      if (dialog.kind === "folder") await api.createFolder(resource, path, value);
      else if (dialog.kind === "rename" && selected && value !== selected.name) await api.rename(resource, selected.path, value);
      else if (dialog.kind === "resize") {
        const match = /^(\d{1,4})[x×](\d{1,4})$/i.exec(value.replace(/\s/g, ""));
        if (!match) { setNotice(t("invalidDimensions")); return; }
        await editImage(0, Number(match[1]), Number(match[2]));
      }
      if (dialog.kind === "folder" || dialog.kind === "rename") await load();
    } catch (error) { report(error); }
  };

  const openRecent = async (recentPath: string) => {
    const directory = recentPath.includes("/") ? recentPath.slice(0, recentPath.lastIndexOf("/")) : "";
    await load(resource, directory, "", 0);
    setSelectedPaths(new Set([recentPath]));
  };

  const setViewMode = (mode: ViewMode) => { setView(mode); localStorage.setItem("sofinder.view", mode); };

  const runContextCommand = (command: string) => {
    const target = contextMenu?.entry ?? null;
    setContextMenu(null);
    if (command === "open" && target?.directory) openEntry(target);
    else if (command === "preview" && target && !target.directory) setPreviewEntry(target);
    else if (command === "select" && target) choose(target);
    else if (command === "rename") void rename();
    else if (command === "copy") void browseDestination("copy", path);
    else if (command === "move") void browseDestination("move", path);
    else if (command === "delete") void remove();
    else if (command === "download" && target && !target.directory) window.location.assign(api.downloadUrl(resource, target.path));
  };

  const applyPreset = async (name: string) => {
    if (!selected) return;
    try {
      const result = await api.applyImageActions(resource, selected.path, [{ type: "preset", name }], { mode: "copy" });
      setNotice(`${t("imageCreated")}: ${result.entry.name} · ${result.result.width} × ${result.result.height} px`);
      await load();
    } catch (error) { report(error); }
  };

  const focusEntry = (index: number) => {
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`button.sf-entry[data-entry-index="${index}"]`)?.focus();
    });
  };

  const setColumnWidth = (side: "left" | "right", value: number, persist = false) => {
    const limits = columnLimits[side];
    const width = Math.round(Math.max(limits.min, Math.min(limits.max, value)));
    if (side === "left") setLeftWidth(width); else setRightWidth(width);
    if (persist) localStorage.setItem(`sofinder.column.${side}`, String(width));
  };
  const beginColumnResize = (side: "left" | "right", event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const startWidth = side === "left" ? leftWidth : rightWidth;
    columnDrag.current = { side, startX: event.clientX, startWidth, currentWidth: startWidth };
  };
  const moveColumnResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const active = columnDrag.current;
    if (!active) return;
    const delta = event.clientX - active.startX;
    const limits = columnLimits[active.side];
    active.currentWidth = Math.round(Math.max(limits.min, Math.min(limits.max, active.startWidth + (active.side === "left" ? delta : -delta))));
    setColumnWidth(active.side, active.currentWidth);
  };
  const endColumnResize = () => {
    const active = columnDrag.current;
    columnDrag.current = null;
    if (active) setColumnWidth(active.side, active.currentWidth, true);
  };
  const resizeColumnWithKeyboard = (side: "left" | "right", event: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    if (direction === 0) return;
    event.preventDefault();
    const current = side === "left" ? leftWidth : rightWidth;
    setColumnWidth(side, current + (side === "left" ? direction : -direction) * 10, true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const isEntry = target.matches("button.sf-entry");
    if (target.isContentEditable || (["INPUT", "SELECT", "TEXTAREA", "BUTTON", "A"].includes(target.tagName) && !isEntry)) return;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      toggleSelectAll();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setSelectedPaths(new Set());
      setSelectionAnchor(null);
      return;
    }
    if (event.key === "Delete" && canSelected("delete") && !currentResource?.readOnly) {
      event.preventDefault();
      void remove();
      return;
    }
    if (event.key === "F2" && selectedEntries.length === 1 && canSelected("rename") && !currentResource?.readOnly) {
      event.preventDefault();
      void rename();
      return;
    }
    if (event.key === "Enter" && selectedEntries.length === 1) {
      event.preventDefault();
      openEntry(selectedEntries[0]);
      return;
    }
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : 0;
    if (delta !== 0 && entries.length > 0) {
      event.preventDefault();
      const activePath = selectionAnchor || selectedEntries[0]?.path;
      const activeIndex = activePath ? entries.findIndex(entry => entry.path === activePath) : (delta > 0 ? -1 : entries.length);
      const nextIndex = Math.max(0, Math.min(entries.length - 1, activeIndex + delta));
      const next = entries[nextIndex];
      setSelectedPaths(new Set([next.path]));
      setSelectionAnchor(next.path);
      focusEntry(nextIndex);
    }
  };

  const destinationUnsafe = destinationDialog !== null && selectedEntries.some(entry => {
    const parent = entry.path.includes("/") ? entry.path.slice(0, entry.path.lastIndexOf("/")) : "";
    const destinationDepth = destinationDialog.path === "" ? 0 : destinationDialog.path.split("/").length;
    return (destinationDialog.operation === "move" && destinationDialog.path === parent)
      || (entry.directory && currentResource !== undefined && destinationDepth >= currentResource.maxFolderDepth)
      || (entry.directory && (destinationDialog.path === entry.path || destinationDialog.path.startsWith(`${entry.path}/`)));
  });
  const destinationCrumbs = destinationDialog?.path ? destinationDialog.path.split("/") : [];
  const uploadActive = uploads.some(task => task.status === "queued" || task.status === "uploading");
  const uploadFinished = uploads.filter(task => task.status !== "queued" && task.status !== "uploading").length;

  return <main className="sf-app" onKeyDown={handleKeyDown} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (event.dataTransfer.files.length) void upload(event.dataTransfer.files); }}>
    <header className="sf-header">
      <div className="sf-brand"><span className="sf-brand-mark">S</span><strong>SoFinder</strong></div>
      <div className="sf-search"><span aria-hidden="true">⌕</span><select value={searchMode} onChange={event => { const next = event.target.value as "name" | "tags"; setSearchMode(next); setOffset(0); }} aria-label={t("searchScope")}><option value="name">{t("name")}</option><option value="tags" disabled={!features.tags}>{t("tags")}</option></select><input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchMode === "tags" ? t("searchTags") : t("search")} aria-label={searchMode === "tags" ? t("searchTags") : t("search")}/></div>
      <div className="sf-view-toggle" role="group">
        <button className={view === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} title={t("grid")}>▦</button>
        <button className={view === "list" ? "active" : ""} onClick={() => setViewMode("list")} title={t("list")}>☷</button>
      </div>
    </header>
    <div className="sf-toolbar" role="toolbar" aria-label={t("fileActions")} title={t("keyboardHelp")}>
      <button onClick={createFolder} disabled={currentResource?.readOnly || directoryCapabilities.create_folder === false || (currentResource !== undefined && currentDepth >= currentResource.maxFolderDepth)} title={currentResource && currentDepth >= currentResource.maxFolderDepth ? t("folderDepthReached") : undefined}>＋ {t("newFolder")}</button>
      <button className={`primary sf-upload-trigger${uploadActive ? " is-active" : ""}`} aria-busy={uploadActive} onClick={() => uploadInput.current?.click()} disabled={currentResource?.readOnly || directoryCapabilities.upload === false}>↑ {t("upload")}{uploadActive ? ` (${uploads.filter(task => task.status === "queued" || task.status === "uploading").length})` : ""}</button>
      <input ref={uploadInput} type="file" multiple hidden onChange={event => { if (event.target.files) void upload(event.target.files); event.target.value = ""; }}/>
      <span className="sf-separator"/>
      <button onClick={toggleSelectAll} disabled={entries.length === 0}>☑ {selectedPaths.size === entries.length && entries.length > 0 ? t("clearSelection") : t("selectAll")}</button>
      <button onClick={rename} disabled={selectedEntries.length !== 1 || !canSelected("rename") || currentResource?.readOnly}>✎ {t("rename")}</button>
      <button onClick={() => void browseDestination("copy", path)} disabled={!canSelected("copy") || currentResource?.readOnly}>▣ {t("copy")}</button>
      <button onClick={() => void browseDestination("move", path)} disabled={!canSelected("move") || currentResource?.readOnly}>↗ {t("move")}</button>
      {features.archive && <button onClick={() => void downloadArchive()} disabled={selectedEntries.length === 0}>⇩ {t("downloadZip")}</button>}
      {features.favorites && <button onClick={() => void toggleFavorite()} disabled={!selected}>{selected && metadata.favorites.includes(selected.path) ? "★" : "☆"} {t("favorite")}</button>}
      {features.tags && <button onClick={() => void editTags()} disabled={!selected}># {t("tags")}</button>}
      <button className="danger" onClick={remove} disabled={!canSelected("delete") || currentResource?.readOnly}>× {t("remove")}{selectedEntries.length > 1 ? ` (${selectedEntries.length})` : ""}</button>
      {features.trash && <button onClick={() => setTrashOpen(true)}>♲ {t("trash")}</button>}
      {tools.rotate && <><button onClick={() => void editImage(270)} disabled={!selected?.mimeType?.startsWith("image/") || currentResource?.readOnly}>↶ {t("rotateLeft")}</button>
      <button onClick={() => void editImage(90)} disabled={!selected?.mimeType?.startsWith("image/") || currentResource?.readOnly}>↷ {t("rotateRight")}</button></>}
      {tools.resize && <button onClick={resizeImage} disabled={!selected?.mimeType?.startsWith("image/") || currentResource?.readOnly}>↔ {t("resize")}</button>}
      {tools.crop && <button onClick={openCropEditor} disabled={!selected?.mimeType?.startsWith("image/") || !imageInfo || currentResource?.readOnly}>▣ {t("crop")}</button>}
      {tools.presets && <label className="sf-sort">{t("preset")}<select value="" disabled={!selected?.mimeType?.startsWith("image/") || currentResource?.readOnly || Object.keys(imagePresets).length === 0} onChange={event => { const name = event.target.value; event.target.value = ""; if (name) void applyPreset(name); }}>
        <option value="">—</option>{Object.entries(imagePresets).map(([name, preset]) => <option key={name} value={name}>{name} ({preset.width}×{preset.height})</option>)}
      </select></label>}
      <button onClick={() => setSettingsOpen(true)} title={t("settings")}>⚙ {t("settings")}</button>
      <button onClick={() => void load()}>↻ {t("refresh")}</button>
      <span className="sf-separator"/>
      <label className="sf-sort">{t("sort")}<select value={sort} onChange={event => { const next = event.target.value as SortMode; setSort(next); void load(resource, path, search, 0, next, direction); }}>
        <option value="name">{t("name")}</option><option value="size">{t("size")}</option><option value="modified">{t("modified")}</option>
      </select></label>
      <button onClick={() => { const next = direction === "asc" ? "desc" : "asc"; setDirection(next); void load(resource, path, search, 0, sort, next); }} title={t("direction")}>{direction === "asc" ? "↑" : "↓"}</button>
    </div>
    {notice && <div className="sf-notice" role="alert">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {uploads.length > 0 && <section className={`sf-upload-panel${uploadsCollapsed ? " collapsed" : ""}`} aria-label={t("uploadQueue")}>
      <header><button className="sf-upload-collapse" onClick={() => setUploadsCollapsed(current => !current)} aria-expanded={!uploadsCollapsed} title={uploadsCollapsed ? t("expand") : t("collapse")}>{uploadsCollapsed ? "›" : "⌄"}</button><strong>{t("uploadQueue")}</strong><span>{uploadFinished}/{uploads.length}</span><button onClick={cancelAllUploads} disabled={!uploadActive}>{t("cancelAll")}</button><button onClick={() => setUploads(current => current.filter(task => task.status === "queued" || task.status === "uploading"))}>{t("clearFinished")}</button></header>
      {!uploadsCollapsed && <div className="sf-upload-list">{uploads.map(task => <div className={`sf-upload-task ${task.status}`} key={task.id}>
        <span className="sf-upload-name" title={task.name}>{task.name}</span><progress max="100" value={task.progress} aria-label={`${task.name}: ${task.progress}%`}/><span>{task.status === "uploading" ? `${task.progress}%` : t(task.status)}</span>
        {(task.status === "queued" || task.status === "uploading") && <button onClick={() => cancelUpload(task.id)}>{t("cancel")}</button>}
        <button className="sf-upload-remove" onClick={() => removeUploadTask(task.id)} title={t("removeUploadTask")} aria-label={`${t("removeUploadTask")}: ${task.name}`}>×</button>
        {task.message && <small title={task.message}>{task.message}</small>}
      </div>)}</div>}
    </section>}
    <div className="sf-layout" style={{ "--sf-sidebar-width": `${leftWidth}px`, "--sf-details-width": `${rightWidth}px` } as React.CSSProperties}>
      <aside className="sf-sidebar" aria-label="Resources">
        <div className="sf-side-title">SoFinder</div>
        {resources.map(item => <button key={item.name} className={item.name === resource ? "active" : ""} onClick={() => { setResource(item.name); void load(item.name, "", "", 0); }}>
          <span className="sf-resource-icon"><Icon kind={item.name.toLowerCase().includes("image") ? "image" : "folder"}/></span>
          {item.name.toLowerCase().includes("image") ? t("images") : item.name.toLowerCase() === "files" ? t("files") : item.name}
        </button>)}
        {features.folderTree && resource && <FolderTree api={api} resource={resource} currentPath={path} rootLabel={t("home")} onNavigate={next => void load(resource, next, "", 0)}/>}
        {currentResource && <div className="sf-resource-status">
          {currentResource.readOnly && <strong>{t("readOnly")}</strong>}
          {currentResource.quotaBytes > 0 && <><span>{t("storageUsage")}: {formatSize(currentResource.usedBytes)} / {formatSize(currentResource.quotaBytes)}</span><progress max={currentResource.quotaBytes} value={Math.min(currentResource.usedBytes, currentResource.quotaBytes)}/></>}
        </div>}
        {features.recent && metadata.recent.length > 0 && <div className="sf-recent"><header><strong>{t("recent")}</strong><span>{metadata.recent.length}</span></header>{metadata.recent.slice(0, 8).map(item => <button key={item.path} title={item.path} onClick={() => void openRecent(item.path)}><span className="sf-recent-icon" aria-hidden="true">↺</span><span><b>{item.path.split("/").pop()}</b><small>{item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : t("home")}</small></span></button>)}</div>}
      </aside>
      <div className="sf-column-resizer left" role="separator" tabIndex={0} aria-label={t("resizeLeftPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.left.min} aria-valuemax={columnLimits.left.max} aria-valuenow={leftWidth} onPointerDown={event => beginColumnResize("left", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("left", event)} onDoubleClick={() => setColumnWidth("left", columnLimits.left.initial, true)}/>
      <section className="sf-content">
        <nav className="sf-breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => void load(resource, "", search, 0)}>{t("home")}</button>
          {crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => void load(resource, crumbs.slice(0, index + 1).join("/"), search, 0)}>{crumb}</button></span>)}
        </nav>
        {loading ? <div className="sf-state">{t("loading")}</div> : entries.length === 0 ? <div className="sf-state">{t("empty")}</div> :
          <div className={`sf-entries ${view}`} role="listbox" aria-multiselectable="true" aria-label={t("files")}>
            {view === "list" && <div className="sf-list-head" role="presentation" aria-hidden="true"><span>{t("name")}</span><span>{t("size")}</span><span>{t("modified")}</span></div>}
            {entries.map((entry, index) => {
              const image = !entry.directory && entry.mimeType?.startsWith("image/");
              return <button key={entry.path} data-entry-index={index} role="option" aria-selected={selectedPaths.has(entry.path)} aria-label={`${entry.name}, ${entry.directory ? t("folder") : formatSize(entry.size)}`} className={`sf-entry ${selectedPaths.has(entry.path) ? "selected" : ""}`} onClick={event => selectEntry(entry, event)} onDoubleClick={() => openEntry(entry)} onContextMenu={event => { event.preventDefault(); setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }} onPointerDown={event => { if (event.pointerType === "touch") longPress.current = window.setTimeout(() => { setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }, 550); }} onPointerUp={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onPointerCancel={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onDragOver={event => { if (entry.directory) event.preventDefault(); }} onDrop={event => { if (entry.directory && event.dataTransfer.files.length) { event.preventDefault(); void uploadTo(entry.path, event.dataTransfer.files); } }}>
                <span className="sf-entry-icon">{image ? <ThumbnailImage src={api.thumbnailUrl(resource, entry)} alt="" lazy/> : <Icon kind={entry.directory ? "folder" : "file"}/>}</span>
                <span className="sf-entry-name" title={entry.name}>{features.favorites && metadata.favorites.includes(entry.path) && <span aria-label={t("favorite")}>★ </span>}{entry.name}</span>
                <span className="sf-entry-size">{entry.directory ? "—" : formatSize(entry.size)}</span>
                <time dateTime={new Date(entry.modifiedAt * 1000).toISOString()}>{new Intl.DateTimeFormat(config.language, { dateStyle: "medium", timeStyle: "short" }).format(entry.modifiedAt * 1000)}</time>
              </button>;
            })}
          </div>}
        {total > pageSize && <nav className="sf-pagination" aria-label={t("pagination")}>
          <button disabled={offset === 0} onClick={() => void load(resource, path, search, Math.max(0, offset - pageSize))}>‹ {t("previous")}</button>
          <span>{Math.floor(offset / pageSize) + 1} / {Math.ceil(total / pageSize)}</span>
          <button disabled={offset + pageSize >= total} onClick={() => void load(resource, path, search, offset + pageSize)}>{t("next")} ›</button>
        </nav>}
      </section>
      <div className="sf-column-resizer right" role="separator" tabIndex={0} aria-label={t("resizeRightPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.right.min} aria-valuemax={columnLimits.right.max} aria-valuenow={rightWidth} onPointerDown={event => beginColumnResize("right", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("right", event)} onDoubleClick={() => setColumnWidth("right", columnLimits.right.initial, true)}/>
      <aside className="sf-details">
        <h2>{t("details")}</h2>
        {selectedEntries.length > 1 ? <div className="sf-state">{selectedEntries.length} {t("selectedCount")}</div> : selected ? <>
          <div className="sf-preview">{selected.mimeType?.startsWith("image/") ? <ThumbnailImage src={api.thumbnailUrl(resource, selected, 800, 600)} alt={selected.name}/> : <Icon kind={selected.directory ? "folder" : "file"}/>}</div>
          <h3>{selected.name}</h3>
          <dl><dt>{t("type")}</dt><dd>{selected.directory ? t("folder") : selected.mimeType || t("file")}</dd><dt>{t("size")}</dt><dd>{selected.directory ? "—" : formatSize(selected.size)}</dd>{imageInfo && <><dt>{t("dimensions")}</dt><dd>{imageInfo.width} × {imageInfo.height} px</dd></>}<dt>{t("location")}</dt><dd>{selected.path}</dd></dl>
          {features.tags && (metadata.tags[selected.path] || []).length > 0 && <div className="sf-tags">{metadata.tags[selected.path].map(tag => <span key={tag}>{tag}</span>)}</div>}
          {config.selectMode && !selected.directory && selected.url && <button className="sf-select primary" onClick={() => choose()}>{t("select")}</button>}
          {!selected.directory && <div className="sf-file-url">
            <label htmlFor="sf-file-url-value">{t("fileUrl")}</label>
            <div><input ref={fileUrlInput} id="sf-file-url-value" readOnly value={selectedFileUrl} onFocus={event => event.currentTarget.select()}/><button type="button" onClick={() => void copyFileUrl()}>{t("copyUrl")}</button></div>
            {currentResource?.deliveryMode === "proxy" && <small>{t("loginRequired")}</small>}
            <span role="status" aria-live="polite">{copyStatus === "copied" ? t("urlCopied") : copyStatus === "manual" ? t("copyUrlFailed") : ""}</span>
          </div>}
          {!selected.directory && <a className="sf-download" href={api.downloadUrl(resource, selected.path)}>{t("download")}</a>}
        </> : <div className="sf-state">—</div>}
      </aside>
    </div>
    {settingsOpen && <Modal title={t("settings")} closeLabel={t("close")} onClose={() => setSettingsOpen(false)} className="sf-settings-modal" footer={<button className="primary" onClick={() => setSettingsOpen(false)}>{t("done")}</button>}>
      <p>{t("toolSettingsHint")}</p>
      {currentResource && <p className="sf-configured-limits">{t("configuredLimits")}: {t("fileName")} {currentResource.maxFileNameLength} · {t("folderName")} {currentResource.maxFolderNameLength} · {t("folderDepth")} {currentResource.maxFolderDepth}</p>}
      <h3>{t("imageTools")}</h3>
      {(["resize", "crop", "rotate", "presets"] as const).map(tool => <label className="sf-setting" key={tool}><input type="checkbox" checked={tools[tool]} onChange={event => updateTool(tool, event.target.checked)}/><span>{t(tool === "presets" ? "preset" : tool === "rotate" ? "rotationTools" : tool)}</span></label>)}
      <h3>{t("optionalFeatures")}</h3><p>{t("featureSettingsHint")}</p>
      {(["autoCollapseUploads", "folderTree", "recent", "favorites", "tags", "archive", "trash"] as const).map(feature => <label className="sf-setting" key={feature}><input type="checkbox" checked={features[feature]} onChange={event => { updateFeature(feature, event.target.checked); if (feature === "tags" && !event.target.checked && searchMode === "tags") setSearchMode("name"); }}/><span>{t(feature === "autoCollapseUploads" ? "autoCollapseUploads" : feature === "folderTree" ? "folderTreeFeature" : feature === "favorites" ? "favoriteFeature" : feature === "archive" ? "archiveFeature" : feature === "trash" ? "trashFeature" : feature === "tags" ? "tagsFeature" : "recentFeature")}</span></label>)}
    </Modal>}
    {destinationDialog && <Modal title={destinationDialog.operation === "move" ? t("moveDestination") : t("copyDestination")} closeLabel={t("close")} onClose={() => setDestinationDialog(null)} className="sf-folder-modal" footer={<><span>{t("currentFolder")}: /{destinationDialog.path}</span><button onClick={() => setDestinationDialog(null)}>{t("cancel")}</button><button className="primary" disabled={destinationDialog.loading || destinationUnsafe} onClick={() => void transfer(destinationDialog.operation, destinationDialog.path)}>{destinationDialog.operation === "move" ? t("moveHere") : t("copyHere")}</button></>}>
      <nav className="sf-folder-crumbs" aria-label={t("chooseFolder")}><button onClick={() => void browseDestination(destinationDialog.operation, "")}>{t("rootFolder")}</button>{destinationCrumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => void browseDestination(destinationDialog.operation, destinationCrumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}</nav>
      <div className="sf-folder-list">{destinationDialog.loading ? <div className="sf-state">{t("loading")}</div> : destinationDialog.folders.length === 0 ? <div className="sf-state">{t("noFolders")}</div> : destinationDialog.folders.map(folder => <button key={folder.path} onDoubleClick={() => void browseDestination(destinationDialog.operation, folder.path)} onClick={() => void browseDestination(destinationDialog.operation, folder.path)}><span className="sf-folder-small"><Icon kind="folder"/></span>{folder.name}<span>›</span></button>)}</div>
      {destinationUnsafe && <p className="sf-warning" role="alert">{t("unsafeDestination")}</p>}
    </Modal>}
    {textDialog && <TextDialog title={textDialog.title} label={textDialog.label} initialValue={textDialog.initial} maximum={textDialog.maximum} extension={textDialog.extension} confirmLabel={t("confirm")} cancelLabel={t("cancel")} closeLabel={t("close")} onConfirm={value => void submitTextDialog(value)} onClose={() => setTextDialog(null)}/>}
    {confirmDialog && <ConfirmDialog {...confirmDialog} confirmLabel={t("confirm")} cancelLabel={t("cancel")} closeLabel={t("close")} onConfirm={() => answerConfirm(true)} onClose={() => answerConfirm(false)}/>}
    {trashOpen && <TrashDialog
      api={api} resource={resource} locale={config.language}
      labels={{ title: t("trash"), close: t("close"), empty: t("trashEmpty"), restore: t("restore"), permanentDelete: t("permanentDelete"), expires: t("expires"), conflict: t("restoreConflict"), usage: t("trashUsage"), items: t("items"), previous: t("previous"), next: t("next"), search: t("searchTrash") }}
      onClose={() => setTrashOpen(false)} onChanged={() => void load()}
    />}
    {tagsOpen && selected && <TagsDialog
      initial={metadata.tags[selected.path] || []}
      suggestions={Array.from(new Set(Object.values(metadata.tags).flat())).sort((left, right) => left.localeCompare(right, config.language))}
      labels={{ title: t("tags"), close: t("close"), cancel: t("cancel"), save: t("save"), input: t("tagInput"), hint: t("tagInputHint"), maximum: t("tagMaximum") }}
      onClose={() => setTagsOpen(false)}
      onSave={tags => { setTagsOpen(false); void api.updateMetadata(resource, selected.path, "tags", { tags }).then(setMetadata).catch(report); }}
    />}
    {previewEntry && <Modal
      title={previewEntry.name}
      closeLabel={t("close")}
      onClose={() => setPreviewEntry(null)}
      className="sf-file-preview-modal"
      footer={<><a className="sf-preview-download" href={api.downloadUrl(resource, previewEntry.path)}>{t("download")}</a><button className="primary" onClick={() => setPreviewEntry(null)}>{t("close")}</button></>}
    >
      <div className="sf-file-preview-content">
        {previewEntry.mimeType?.startsWith("image/")
          ? <ThumbnailImage src={previewEntry.url || api.contentUrl(resource, previewEntry.path)} alt={previewEntry.name}/>
          : <div className="sf-file-preview-fallback"><Icon kind="file"/><p>{t("previewUnavailable")}</p></div>}
      </div>
      <dl className="sf-file-preview-meta"><dt>{t("type")}</dt><dd>{previewEntry.mimeType || t("file")}</dd><dt>{t("size")}</dt><dd>{formatSize(previewEntry.size)}</dd><dt>{t("location")}</dt><dd>{previewEntry.path}</dd></dl>
    </Modal>}
    {cropOpen && selected && imageInfo && <ImageEditor
      entry={selected}
      info={imageInfo}
      imageUrl={api.thumbnailUrl(resource, selected, 512, 512)}
      labels={{ crop: t("crop"), close: t("close"), cancel: t("cancel"), save: t("save"), saving: t("saving"), ratio: t("ratio"), free: t("freeRatio"), original: t("originalRatio"), zoom: t("zoom"), undo: t("undo"), redo: t("redo"), reset: t("reset"), compare: t("compare"), x: "X", y: "Y", width: t("width"), height: t("height"), saveMode: t("saveMode"), saveCopy: t("saveCopy"), overwrite: t("overwrite"), fileName: t("fileName"), overwriteWarning: t("confirmImageOverwrite"), panHint: t("panHint") }}
      onClose={() => setCropOpen(false)}
      onSave={async (actions, save) => {
        const result = await api.applyImageActions(resource, selected.path, actions, save);
        setCropOpen(false);
        setNotice(`${t("imageCreated")}: ${result.entry.name} · ${result.result.width} × ${result.result.height} px`);
        await load();
      }}
    />}
    {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onSelect={runContextCommand} items={[
      { id: contextMenu.entry.directory ? "open" : "preview", label: contextMenu.entry.directory ? t("open") : t("preview") },
      ...(config.selectMode && !contextMenu.entry.directory ? [{ id: "select", label: t("select"), disabled: !contextMenu.entry.url }] : []),
      { id: "download", label: t("download"), disabled: contextMenu.entry.directory },
      { id: "rename", label: t("rename"), disabled: contextMenu.entry.capabilities?.rename === false },
      { id: "copy", label: t("copy"), disabled: contextMenu.entry.capabilities?.copy === false },
      { id: "move", label: t("move"), disabled: contextMenu.entry.capabilities?.move === false },
      { id: "delete", label: t("remove"), disabled: contextMenu.entry.capabilities?.delete === false, danger: true },
    ]}/>}
    <div className="sf-sr-only" aria-live="polite">{selectedEntries.length > 0 ? `${selectedEntries.length} ${t("selectedCount")}` : notice}</div>
  </main>;
}
