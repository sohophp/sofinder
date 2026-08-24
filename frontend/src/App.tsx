import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Api, ApiError } from "./api";
import { translator, type Language } from "./i18n";
import type { Entry, ImageCapabilities, ImageInfo, ImagePreset, MetadataState, ResourceType, SoFinderConfig, UiScale } from "./types";
import { ConfirmDialog, TextDialog } from "./components/Dialogs";
import { ContextMenu } from "./components/ContextMenu";
import { FolderTree } from "./components/FolderTree";
import { ImageEditor } from "./components/ImageEditor";
import { Modal } from "./components/Modal";
import { TrashDialog } from "./components/TrashDialog";
import { TagsDialog } from "./components/TagsDialog";
import { UrlDialog } from "./components/UrlDialog";
import { EntryIcon as Icon, LinkIcon, ThumbnailImage } from "./components/EntryVisuals";
import { characterLength, formatSize } from "./format";
import { UploadQueue, type UploadTask } from "./components/UploadQueue";
import { DetailsPanel } from "./components/DetailsPanel";
import { SettingsDialog, type FeaturePreferences, type ToolPreferences } from "./components/SettingsDialog";
import { DestinationDialog, type DestinationState } from "./components/DestinationDialog";
import { UiIcon, type UiIconName } from "./components/UiIcon";

type ViewMode = "grid" | "list";
type SortMode = "name" | "size" | "modified";
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
const loadScale = (fallback: UiScale): UiScale => {
  const saved = localStorage.getItem("sofinder.uiScale.v1");
  return saved === "compact" || saved === "standard" || saved === "large" || saved === "xlarge" ? saved : fallback;
};

const columnLimits = { left: { initial: 220, min: 110, max: 330 }, right: { initial: 270, min: 135, max: 405 } } as const;
const loadColumnWidth = (side: "left" | "right") => {
  const limits = columnLimits[side];
  const saved = localStorage.getItem(`sofinder.column.${side}`);
  if (saved === null || saved.trim() === "") return limits.initial;
  const value = Number(saved);
  return Number.isFinite(value) ? Math.max(limits.min, Math.min(limits.max, value)) : limits.initial;
};

export default function App({ config }: { config: SoFinderConfig }) {
  const api = useMemo(() => new Api(config), [config]);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("sofinder.language");
    return saved === "en" || saved === "zh-cn" || saved === "zh-tw" ? saved : config.language;
  });
  const t = useMemo(() => translator(language), [language]);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }), [language]);
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
  const [total, setTotal] = useState<number | null>(0);
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<Array<string | null>>([]);
  const [view, setView] = useState<ViewMode>(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [uploadsCollapsed, setUploadsCollapsed] = useState(false);
  const [metadata, setMetadata] = useState<MetadataState>({ favorites: [], tags: {}, recent: [] });
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [tools, setTools] = useState<ToolPreferences>(loadToolPreferences);
  const [features, setFeatures] = useState<FeaturePreferences>(() => loadPreferences("sofinder.features.v2", { ...defaultFeatures, folderTree: config.featureDefaults?.folderTree ?? false }));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const [uiScale, setUiScale] = useState<UiScale>(() => loadScale(config.uiDefaults?.scale ?? "standard"));
  const [destinationDialog, setDestinationDialog] = useState<DestinationState | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [textDialog, setTextDialog] = useState<TextDialogState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState | null>(null);
  const [trashOpen, setTrashOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; entry: Entry } | null>(null);
  const [previewEntry, setPreviewEntry] = useState<Entry | null>(null);
  const [urlDialog, setUrlDialog] = useState<{ url: string; loginRequired: boolean } | null>(null);
  const [imagePresets, setImagePresets] = useState<Record<string, ImagePreset>>({});
  const [imageCapabilities, setImageCapabilities] = useState<ImageCapabilities>({ driver: "", formats: [] });
  const [directoryCapabilities, setDirectoryCapabilities] = useState<Record<string, boolean>>({});
  const [leftWidth, setLeftWidth] = useState(() => loadColumnWidth("left"));
  const [rightWidth, setRightWidth] = useState(() => loadColumnWidth("right"));
  const uploadInput = useRef<HTMLInputElement>(null);
  const uploadControllers = useRef(new Map<string, AbortController>());
  const uploadSequence = useRef(0);
  const loadSequence = useRef(0);
  const confirmResolver = useRef<((answer: boolean) => void) | null>(null);
  const longPress = useRef<number | null>(null);
  const columnDrag = useRef<{ side: "left" | "right"; startX: number; startWidth: number; currentWidth: number } | null>(null);
  const searchInitialized = useRef(false);
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

  useEffect(() => {
    document.documentElement.dataset.sofinderScale = uiScale;
    localStorage.setItem("sofinder.uiScale.v1", uiScale);
    return () => { delete document.documentElement.dataset.sofinderScale; };
  }, [uiScale]);

  useEffect(() => {
    localStorage.setItem("sofinder.language", language);
    document.documentElement.lang = language === "zh-cn" ? "zh-CN" : language === "zh-tw" ? "zh-TW" : "en";
  }, [language]);

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
  const load = useCallback(async (nextResource = resource, nextPath = path, term = search, nextOffset = offset, nextSort = sort, nextDirection = direction, nextSearchMode = searchMode, cursor: string | null = pageCursor) => {
    if (!nextResource) return;
    const sequence = ++loadSequence.current;
    setLoading(true);
    setNotice("");
    try {
      const result = await api.list(nextResource, nextPath, term, nextSort, nextDirection, nextOffset, pageSize, nextSearchMode, cursor);
      if (sequence !== loadSequence.current) return;
      setEntries(result.entries);
      setPath(result.path);
      setOffset(result.offset);
      setTotal(result.total);
      setPageCursor(cursor);
      setNextCursor(result.nextCursor ?? null);
      setDirectoryCapabilities(result.capabilities || {});
      setSelectedPaths(new Set());
      setSelectionAnchor(null);
    } catch (error) {
      if (sequence !== loadSequence.current) return;
      setEntries([]);
      setPath(nextPath);
      setOffset(nextOffset);
      setTotal(null);
      setPageCursor(cursor);
      setNextCursor(null);
      setDirectoryCapabilities({});
      setSelectedPaths(new Set());
      setSelectionAnchor(null);
      report(error);
    } finally {
      if (sequence === loadSequence.current) setLoading(false);
    }
  }, [api, direction, offset, pageCursor, path, report, resource, search, searchMode, sort]);

  useEffect(() => {
    api.configData().then(({ resources: available, imagePresets: presets, imageCapabilities: capabilities }) => {
      setResources(available);
      setImagePresets(presets || {});
      setImageCapabilities(capabilities || { driver: "", formats: [] });
      const initial = available.some(item => item.name === config.resource) ? config.resource : available[0]?.name || "";
      setResource(initial);
      if (initial) { setCursorHistory([]); void load(initial, "", "", 0, sort, direction, "name", null); }
    }).catch(report);
  }, [api, config.resource]);

  useEffect(() => {
    const interrupted = api.pendingUploads().map(session => ({ id: `pending-${session.id}`, name: session.name, progress: 0, status: "error" as const, message: t("uploadReselectToResume") }));
    if (interrupted.length > 0) {
      setUploads(current => [...current.filter(task => !task.id.startsWith("pending-")), ...interrupted]);
      setUploadsCollapsed(false);
    }
  }, [api, t]);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }
    const timer = window.setTimeout(() => { if (resource) { setCursorHistory([]); void load(resource, path, search, 0, sort, direction, searchMode, null); } }, 250);
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
      if (uiMode === "manager" && files.length > 0 && !currentResource?.readOnly && directoryCapabilities.upload !== false) {
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
  const imageCapability = (entry: Entry) => imageCapabilities.formats.find(format => entry.mimeType !== null && format.mimes.includes(entry.mimeType.toLowerCase()));
  const canPreviewImage = (entry: Entry | null) => Boolean(entry && imageCapability(entry)?.thumbnail);
  const canEditImage = (entry: Entry | null) => Boolean(entry && imageCapability(entry)?.edit);
  const canChooseEntry = (entry: Entry | null) => Boolean(entry && !entry.directory && entry.url && (config.selectionKind !== "image" || imageCapability(entry)?.webEmbeddable));
  const openUrlDialog = (entry: Entry) => {
    if (entry.directory) return;
    setUrlDialog({
      url: new URL(entry.url || api.downloadUrl(resource, entry.path), document.baseURI).href,
      loginRequired: !entry.url,
    });
  };
  const canSelected = (operation: string) => selectedEntries.length > 0 && selectedEntries.every(entry => entry.capabilities?.[operation] !== false);

  useEffect(() => {
    setImageInfo(null);
    if (!selected || !imageCapability(selected)?.read) return;
    let active = true;
    api.imageInfo(resource, selected.path).then(info => { if (active) setImageInfo(info); }).catch(error => { if (active) report(error); });
    return () => { active = false; };
  }, [api, resource, selected?.path, selected?.mimeType, report]);

  const selectEntry = (entry: Entry, event: React.MouseEvent) => {
    if (uiMode === "picker") {
      setSelectedPaths(new Set([entry.path]));
      setSelectionAnchor(entry.path);
      return;
    }
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
    if (entry.directory) { setCursorHistory([]); void load(resource, entry.path, search, 0, sort, direction, searchMode, null); }
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
    if (uiMode !== "manager") return;
    const candidates = Array.from(files);
    const accepted = currentResource ? candidates.filter(file => characterLength(file.name) <= currentResource.maxFileNameLength) : candidates;
    if (accepted.length !== candidates.length && currentResource) {
      setNotice(`${t("fileNameTooLong")} ${currentResource.maxFileNameLength}`);
    }
    const jobs = accepted.map(file => {
      const id = `${Date.now()}-${++uploadSequence.current}`;
      const controller = new AbortController();
      uploadControllers.current.set(id, controller);
      const pending = api.findPendingUpload(resource, targetPath, file, false);
      return { id, file, controller, pendingId: pending ? `pending-${pending.id}` : null };
    });
    if (jobs.length === 0) return;
    setUploadsCollapsed(false);
    const resumedIds = new Set(jobs.map(job => job.pendingId).filter((id): id is string => id !== null));
    setUploads(current => [...current.filter(task => !resumedIds.has(task.id)), ...jobs.map(({ id, file, pendingId }) => ({ id, name: file.name, progress: 0, status: "queued" as const, message: pendingId ? t("uploadResuming") : undefined }))]);

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
    if (selectedEntries.length === 0 || !await ask({ title: t("remove"), message: selectedEntries.length === 1 ? t("confirmDelete") : `${t("confirmDeleteMany")} ${selectedEntries.length}`, detail: currentResource?.storageCapabilities?.recoverableDelete === false ? t("permanentDeleteWarning") : t("trashRetention"), danger: true })) return;
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
    if (!canChooseEntry(entry)) {
      if (entry && config.selectionKind === "image") setNotice(t("webImageUnsupported"));
      return;
    }
    if (!entry?.url) return;
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
    if (!selected || !canEditImage(selected)) return;
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
    else if (command === "download" && target && !target.directory) window.location.assign(target.url || api.downloadUrl(resource, target.path));
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

    if (uiMode === "manager" && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
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
    if (uiMode === "manager" && event.key === "Delete" && canSelected("delete") && !currentResource?.readOnly) {
      event.preventDefault();
      void remove();
      return;
    }
    if (uiMode === "manager" && event.key === "F2" && selectedEntries.length === 1 && canSelected("rename") && !currentResource?.readOnly) {
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
  const uploadActive = uploads.some(task => task.status === "queued" || task.status === "uploading");
  const uiMode = config.uiDefaults.mode ?? (config.selectMode ? "picker" : "manager");
  const recoverableDelete = currentResource?.storageCapabilities?.recoverableDelete !== false;
  const showSidebar = resources.length > 1 || features.folderTree || features.recent || Boolean(currentResource?.readOnly || currentResource?.quotaBytes);
  const showDetails = uiMode === "manager" && selectedEntries.length > 0;
  const iconButton = (name: UiIconName, label: string) => <><UiIcon name={name}/><span>{label}</span></>;
  const resetAndLoad = (nextResource: string, nextPath: string, term = search) => {
    setCursorHistory([]);
    void load(nextResource, nextPath, term, 0, sort, direction, searchMode, null);
  };
  const previousPage = () => {
    if (cursorHistory.length === 0) return;
    const history = cursorHistory.slice(0, -1);
    const cursor = cursorHistory[cursorHistory.length - 1] ?? null;
    setCursorHistory(history);
    void load(resource, path, search, Math.max(0, offset - pageSize), sort, direction, searchMode, cursor);
  };
  const followingPage = () => {
    if (nextCursor === null) return;
    setCursorHistory(current => [...current, pageCursor]);
    void load(resource, path, search, offset + pageSize, sort, direction, searchMode, nextCursor);
  };

  return <main className={`sf-app sf-mode-${uiMode}${showSidebar ? "" : " sf-no-sidebar"}${showDetails ? "" : " sf-no-details"}`} onKeyDown={handleKeyDown} onDragOver={event => { if (uiMode === "manager") event.preventDefault(); }} onDrop={event => { if (uiMode !== "manager") return; event.preventDefault(); if (event.dataTransfer.files.length) void upload(event.dataTransfer.files); }}>
    {config.uiDefaults.header && <header className="sf-header"><div className="sf-brand">{config.uiDefaults.logo && <span className="sf-brand-mark">S</span>}<strong>SoFinder</strong></div></header>}
    <div className="sf-commandbar">
      <nav className="sf-breadcrumb" aria-label="Breadcrumb">
        <button onClick={() => resetAndLoad(resource, "")}>{t("home")}</button>
        {crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => resetAndLoad(resource, crumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}
      </nav>
      {config.uiDefaults.search !== false && <div className="sf-search"><UiIcon name="search"/><select value={searchMode} onChange={event => { const next = event.target.value as "name" | "tags"; setSearchMode(next); setOffset(0); }} aria-label={t("searchScope")}><option value="name" disabled={currentResource?.storageCapabilities?.search === false}>{t("name")}</option><option value="tags">{t("tags")}</option></select><input disabled={searchMode === "name" && currentResource?.storageCapabilities?.search === false} value={search} onChange={e => setSearch(e.target.value)} placeholder={searchMode === "tags" ? t("searchTags") : t("search")} aria-label={searchMode === "tags" ? t("searchTags") : t("search")}/></div>}
      {config.uiDefaults.viewSwitcher !== false && <div className="sf-view-toggle" role="group" aria-label={`${t("grid")} / ${t("list")}`}>
        <button className={view === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} title={t("grid")} aria-label={t("grid")}><UiIcon name="grid"/></button>
        <button className={view === "list" ? "active" : ""} onClick={() => setViewMode("list")} title={t("list")} aria-label={t("list")}><UiIcon name="list"/></button>
      </div>}
      <div className="sf-utility">
        <button className="sf-icon-only" onClick={() => setUtilityOpen(open => !open)} aria-expanded={utilityOpen} title={t("moreActions")} aria-label={t("moreActions")}><UiIcon name="more"/></button>
        {utilityOpen && <div className="sf-utility-menu" role="menu">
          {config.uiDefaults.languageSwitcher !== false && <label><span>{t("language")}</span><select value={language} onChange={event => setLanguage(event.target.value as Language)} aria-label={t("language")}><option value="zh-cn">简中</option><option value="zh-tw">繁中</option><option value="en">EN</option></select></label>}
          <label><span>{t("sort")}</span><select value={sort} disabled={currentResource?.storageCapabilities?.sort === false} onChange={event => { const next = event.target.value as SortMode; setSort(next); setCursorHistory([]); void load(resource, path, search, 0, next, direction, searchMode, null); }}><option value="name">{t("name")}</option><option value="size">{t("size")}</option><option value="modified">{t("modified")}</option></select></label>
          <button role="menuitem" disabled={currentResource?.storageCapabilities?.sort === false} onClick={() => { const next = direction === "asc" ? "desc" : "asc"; setDirection(next); setCursorHistory([]); void load(resource, path, search, 0, sort, next, searchMode, null); }}>{iconButton("sort", t("direction"))}</button>
          <button role="menuitem" onClick={() => { setUtilityOpen(false); void load(); }}>{iconButton("refresh", t("refresh"))}</button>
          <button role="menuitem" onClick={() => { setUtilityOpen(false); setSettingsOpen(true); }}>{iconButton("settings", t("settings"))}</button>
          {uiMode === "manager" && features.trash && recoverableDelete && <button role="menuitem" onClick={() => { setUtilityOpen(false); setTrashOpen(true); }}>{iconButton("trash", t("trash"))}</button>}
        </div>}
      </div>
    </div>
    {uiMode === "manager" && <div className="sf-toolbar" role="toolbar" aria-label={t("fileActions")} title={t("keyboardHelp")}>
      <button onClick={createFolder} disabled={currentResource?.readOnly || directoryCapabilities.create_folder === false || (currentResource !== undefined && currentDepth >= currentResource.maxFolderDepth)} title={currentResource && currentDepth >= currentResource.maxFolderDepth ? t("folderDepthReached") : undefined}>{iconButton("add-folder", t("newFolder"))}</button>
      <button className={`primary sf-upload-trigger${uploadActive ? " is-active" : ""}`} aria-busy={uploadActive} onClick={() => uploadInput.current?.click()} disabled={currentResource?.readOnly || directoryCapabilities.upload === false}>{iconButton("upload", `${t("upload")}${uploadActive ? ` (${uploads.filter(task => task.status === "queued" || task.status === "uploading").length})` : ""}`)}</button>
      <input ref={uploadInput} type="file" multiple hidden onChange={event => { if (event.target.files) void upload(event.target.files); event.target.value = ""; }}/>
      {selectedEntries.length > 0 && <><span className="sf-separator"/><div className="sf-context-actions">
      <button onClick={toggleSelectAll} disabled={entries.length === 0}>{iconButton("select", selectedPaths.size === entries.length && entries.length > 0 ? t("clearSelection") : t("selectAll"))}</button>
      <button onClick={rename} disabled={selectedEntries.length !== 1 || !canSelected("rename") || currentResource?.readOnly}>{iconButton("rename", t("rename"))}</button>
      <button onClick={() => void browseDestination("copy", path)} disabled={!canSelected("copy") || currentResource?.readOnly}>{iconButton("copy", t("copy"))}</button>
      <button onClick={() => void browseDestination("move", path)} disabled={!canSelected("move") || currentResource?.readOnly}>{iconButton("move", t("move"))}</button>
      {features.archive && <button onClick={() => void downloadArchive()}>{iconButton("archive", t("downloadZip"))}</button>}
      {features.favorites && <button onClick={() => void toggleFavorite()} disabled={!selected}>{iconButton("favorite", t("favorite"))}</button>}
      {features.tags && <button onClick={() => void editTags()} disabled={!selected}>{iconButton("tags", t("tags"))}</button>}
      <button className="danger" onClick={remove} disabled={!canSelected("delete") || currentResource?.readOnly}>{iconButton("delete", `${t("remove")}${selectedEntries.length > 1 ? ` (${selectedEntries.length})` : ""}`)}</button>
      {tools.rotate && <><button onClick={() => void editImage(270)} disabled={!canEditImage(selected) || currentResource?.readOnly}>{iconButton("rotate-left", t("rotateLeft"))}</button><button onClick={() => void editImage(90)} disabled={!canEditImage(selected) || currentResource?.readOnly}>{iconButton("rotate-right", t("rotateRight"))}</button></>}
      {tools.resize && <button onClick={resizeImage} disabled={!canEditImage(selected) || currentResource?.readOnly}>{iconButton("resize", t("resize"))}</button>}
      {tools.crop && <button onClick={openCropEditor} disabled={!canEditImage(selected) || !imageInfo || currentResource?.readOnly}>{iconButton("crop", t("crop"))}</button>}
      {tools.presets && <label className="sf-sort">{t("preset")}<select value="" disabled={!canEditImage(selected) || currentResource?.readOnly || Object.keys(imagePresets).length === 0} onChange={event => { const name = event.target.value; event.target.value = ""; if (name) void applyPreset(name); }}>
        <option value="">—</option>{Object.entries(imagePresets).map(([name, preset]) => <option key={name} value={name}>{name} ({preset.width}×{preset.height})</option>)}
      </select></label>}
      </div></>}
    </div>}
    {notice && <div className="sf-notice" role="alert">{notice}<button onClick={() => setNotice("")} aria-label={t("close")}><UiIcon name="close"/></button></div>}
    <UploadQueue tasks={uploads} collapsed={uploadsCollapsed} labels={{ title: t("uploadQueue"), expand: t("expand"), collapse: t("collapse"), cancel: t("cancel"), cancelAll: t("cancelAll"), clearFinished: t("clearFinished"), remove: t("removeUploadTask"), status: status => t(status) }} onToggle={() => setUploadsCollapsed(current => !current)} onCancel={cancelUpload} onCancelAll={cancelAllUploads} onClearFinished={() => setUploads(current => current.filter(task => task.status === "queued" || task.status === "uploading"))} onRemove={removeUploadTask}/>
    <div className="sf-layout" style={{ "--sf-sidebar-width": `${leftWidth}px`, "--sf-details-width": `${rightWidth}px` } as React.CSSProperties}>
      {showSidebar && <aside className="sf-sidebar" aria-label="Resources">
        {resources.map(item => <button key={item.name} className={item.name === resource ? "active" : ""} onClick={() => { setResource(item.name); setSearch(""); setSearchMode("name"); if (item.storageCapabilities?.sort === false) { setSort("name"); setDirection("asc"); setCursorHistory([]); void load(item.name, "", "", 0, "name", "asc", "name", null); } else resetAndLoad(item.name, "", ""); }}>
          <span className="sf-resource-icon"><Icon kind={item.name.toLowerCase().includes("image") ? "image" : "folder"}/></span>
          {item.name.toLowerCase().includes("image") ? t("images") : item.name.toLowerCase() === "files" ? t("files") : item.name}
        </button>)}
        {features.folderTree && resource && (
          <FolderTree api={api} resource={resource} currentPath={path} rootLabel={t("home")} onNavigate={next => resetAndLoad(resource, next, "")}/>
        )}
        {currentResource && <div className="sf-resource-status">
          {currentResource.readOnly && <strong>{t("readOnly")}</strong>}
          {currentResource.quotaBytes > 0 && <><span>{t("storageUsage")}: {formatSize(currentResource.usedBytes)} / {formatSize(currentResource.quotaBytes)}</span><progress max={currentResource.quotaBytes} value={Math.min(currentResource.usedBytes, currentResource.quotaBytes)}/></>}
        </div>}
        {features.recent && metadata.recent.length > 0 && <div className="sf-recent"><header><strong>{t("recent")}</strong><span>{metadata.recent.length}</span></header>{metadata.recent.slice(0, 8).map(item => <button key={item.path} title={item.path} onClick={() => void openRecent(item.path)}><span className="sf-recent-icon"><UiIcon name="history"/></span><span><b>{item.path.split("/").pop()}</b><small>{item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : t("home")}</small></span></button>)}</div>}
      </aside>}
      {showSidebar && <div className="sf-column-resizer left" role="separator" tabIndex={0} aria-label={t("resizeLeftPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.left.min} aria-valuemax={columnLimits.left.max} aria-valuenow={leftWidth} onPointerDown={event => beginColumnResize("left", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("left", event)} onDoubleClick={() => setColumnWidth("left", columnLimits.left.initial, true)}/>}
      <section className="sf-content">
        {loading ? <div className="sf-state">{t("loading")}</div> : entries.length === 0 ? <div className="sf-state">{t("empty")}</div> :
          <div className={`sf-entries ${view}`} role="listbox" aria-multiselectable={uiMode === "manager"} aria-label={t("files")}>
            {view === "list" && <div className="sf-list-head" role="presentation" aria-hidden="true"><span>{t("name")}</span><span>{t("size")}</span><span>{t("modified")}</span></div>}
            {entries.map((entry, index) => {
              const image = !entry.directory && canPreviewImage(entry);
              return <button key={entry.path} data-entry-index={index} role="option" aria-selected={selectedPaths.has(entry.path)} aria-label={`${entry.name}, ${entry.directory ? t("folder") : formatSize(entry.size)}`} className={`sf-entry ${selectedPaths.has(entry.path) ? "selected" : ""}`} onClick={event => selectEntry(entry, event)} onDoubleClick={() => openEntry(entry)} onContextMenu={event => { event.preventDefault(); setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }} onPointerDown={event => { if (event.pointerType === "touch") longPress.current = window.setTimeout(() => { setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }, 550); }} onPointerUp={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onPointerCancel={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onDragOver={event => { if (uiMode === "manager" && entry.directory) event.preventDefault(); }} onDrop={event => { if (uiMode === "manager" && entry.directory && event.dataTransfer.files.length) { event.preventDefault(); void uploadTo(entry.path, event.dataTransfer.files); } }}>
                <span className="sf-entry-icon">{image ? <ThumbnailImage src={api.thumbnailUrl(resource, entry)} alt="" lazy/> : <Icon kind={entry.directory ? "folder" : "file"}/>}</span>
                <span className="sf-entry-name" title={entry.name}>{features.favorites && metadata.favorites.includes(entry.path) && <span aria-label={t("favorite")}><UiIcon name="favorite"/> </span>}{entry.name}</span>
                <span className="sf-entry-size">{entry.directory ? "—" : formatSize(entry.size)}</span>
                <time dateTime={new Date(entry.modifiedAt * 1000).toISOString()}>{dateFormatter.format(entry.modifiedAt * 1000)}</time>
              </button>;
            })}
          </div>}
        {(cursorHistory.length > 0 || nextCursor !== null) && <nav className="sf-pagination" aria-label={t("pagination")}>
          <button disabled={cursorHistory.length === 0} onClick={previousPage}><UiIcon name="chevron-left"/> {t("previous")}</button>
          <span>{t("page")} {cursorHistory.length + 1}{total !== null ? ` / ${Math.max(1, Math.ceil(total / pageSize))}` : ""}</span>
          <button disabled={nextCursor === null} onClick={followingPage}>{t("next")} <UiIcon name="chevron-right"/></button>
        </nav>}
      </section>
      {showDetails && <><div className="sf-column-resizer right" role="separator" tabIndex={0} aria-label={t("resizeRightPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.right.min} aria-valuemax={columnLimits.right.max} aria-valuenow={rightWidth} onPointerDown={event => beginColumnResize("right", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("right", event)} onDoubleClick={() => setColumnWidth("right", columnLimits.right.initial, true)}/><DetailsPanel api={api} resource={resource} selectedEntries={selectedEntries} selected={selected} imageInfo={imageInfo} metadata={metadata} showTags={features.tags} previewImage={canPreviewImage(selected)} selectMode={false} selectAllowed={canChooseEntry(selected)} labels={{ details: t("details"), selected: t("selectedCount"), type: t("type"), folder: t("folder"), file: t("file"), size: t("size"), dimensions: t("dimensions"), modified: t("modified"), location: t("location"), select: t("select"), download: t("download"), copyUrl: t("copyUrl"), unsupportedWebImage: t("webImageUnsupported") }} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} onChoose={choose} onOpenUrl={openUrlDialog}/></>}
    </div>
    {uiMode === "picker" && selected && !selected.directory && <div className="sf-picker-bar"><div><strong>{selected.name}</strong><small>{formatSize(selected.size)}</small></div>{!canChooseEntry(selected) && <span role="status">{t("webImageUnsupported")}</span>}<button className="primary" disabled={!canChooseEntry(selected)} onClick={() => choose()}>{t("select")}</button></div>}
    {settingsOpen && <SettingsDialog resource={currentResource} tools={tools} features={features} scale={uiScale} translate={t} onToolChange={updateTool} onFeatureChange={updateFeature} onScaleChange={setUiScale} onClose={() => setSettingsOpen(false)}/>}
    {destinationDialog && <DestinationDialog state={destinationDialog} unsafe={destinationUnsafe} translate={t} onBrowse={(operation, destination) => void browseDestination(operation, destination)} onConfirm={(operation, destination) => void transfer(operation, destination)} onClose={() => setDestinationDialog(null)}/>}
    {textDialog && <TextDialog title={textDialog.title} label={textDialog.label} initialValue={textDialog.initial} maximum={textDialog.maximum} extension={textDialog.extension} confirmLabel={t("confirm")} cancelLabel={t("cancel")} closeLabel={t("close")} onConfirm={value => void submitTextDialog(value)} onClose={() => setTextDialog(null)}/>}
    {confirmDialog && <ConfirmDialog {...confirmDialog} confirmLabel={t("confirm")} cancelLabel={t("cancel")} closeLabel={t("close")} onConfirm={() => answerConfirm(true)} onClose={() => answerConfirm(false)}/>}
    {trashOpen && <TrashDialog
      api={api} resource={resource} locale={language}
      labels={{ title: t("trash"), close: t("close"), cancel: t("cancel"), empty: t("trashEmpty"), restore: t("restore"), permanentDelete: t("permanentDelete"), expires: t("expires"), conflict: t("restoreConflict"), overwrite: t("restoreOverwrite"), autoRename: t("restoreAutoRename"), usage: t("trashUsage"), items: t("items"), previous: t("previous"), next: t("next"), search: t("searchTrash") }}
      onClose={() => setTrashOpen(false)} onChanged={() => void load()}
    />}
    {tagsOpen && selected && <TagsDialog
      initial={metadata.tags[selected.path] || []}
      suggestions={Array.from(new Set(Object.values(metadata.tags).flat())).sort((left, right) => left.localeCompare(right, language))}
      labels={{ title: t("tags"), close: t("close"), cancel: t("cancel"), save: t("save"), input: t("tagInput"), hint: t("tagInputHint"), maximum: t("tagMaximum") }}
      onClose={() => setTagsOpen(false)}
      onSave={tags => { setTagsOpen(false); void api.updateMetadata(resource, selected.path, "tags", { tags }).then(setMetadata).catch(report); }}
    />}
    {previewEntry && <Modal
      title={previewEntry.name}
      closeLabel={t("close")}
      onClose={() => setPreviewEntry(null)}
      className="sf-file-preview-modal"
      footer={<><button type="button" className="sf-icon-button" onClick={() => openUrlDialog(previewEntry)} title={t("copyUrl")} aria-label={t("copyUrl")}><LinkIcon/></button><a className="sf-preview-download" href={previewEntry.url || api.downloadUrl(resource, previewEntry.path)}>{t("download")}</a><button className="primary" onClick={() => setPreviewEntry(null)}>{t("close")}</button></>}
    >
      <div className="sf-file-preview-body">
        <div className="sf-file-preview-content">
          {canPreviewImage(previewEntry)
            ? <ThumbnailImage src={api.thumbnailUrl(resource, previewEntry, 512, 512)} alt={previewEntry.name}/>
            : <div className="sf-file-preview-fallback"><Icon kind="file"/><p>{t("previewUnavailable")}</p></div>}
        </div>
        <dl className="sf-file-preview-meta"><dt>{t("type")}</dt><dd>{previewEntry.mimeType || t("file")}</dd><dt>{t("size")}</dt><dd>{formatSize(previewEntry.size)}</dd><dt>{t("modified")}</dt><dd><time dateTime={new Date(previewEntry.modifiedAt * 1000).toISOString()}>{dateFormatter.format(previewEntry.modifiedAt * 1000)}</time></dd><dt>{t("location")}</dt><dd>{previewEntry.path}</dd></dl>
      </div>
    </Modal>}
    {urlDialog && <UrlDialog url={urlDialog.url} loginRequired={urlDialog.loginRequired} labels={{ title: t("fileUrl"), close: t("close"), copied: t("urlCopied"), failed: t("copyUrlFailed"), hint: t("clickUrlToCopy"), loginRequired: t("loginRequired") }} onClose={() => setUrlDialog(null)}/>}
    {cropOpen && selected && imageInfo && <ImageEditor
      entry={selected}
      info={imageInfo}
      imageUrl={api.contentUrl(resource, selected.path)}
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
      ...(uiMode === "picker" && !contextMenu.entry.directory ? [{ id: "select", label: t("select"), disabled: !canChooseEntry(contextMenu.entry) }] : []),
      { id: "download", label: t("download"), disabled: contextMenu.entry.directory },
      ...(uiMode === "manager" ? [
        { id: "rename", label: t("rename"), disabled: contextMenu.entry.capabilities?.rename === false },
        { id: "copy", label: t("copy"), disabled: contextMenu.entry.capabilities?.copy === false },
        { id: "move", label: t("move"), disabled: contextMenu.entry.capabilities?.move === false },
        { id: "delete", label: t("remove"), disabled: contextMenu.entry.capabilities?.delete === false, danger: true },
      ] : []),
    ]}/>}
    <div className="sf-sr-only" aria-live="polite">{selectedEntries.length > 0 ? `${selectedEntries.length} ${t("selectedCount")}` : notice}</div>
  </main>;
}
