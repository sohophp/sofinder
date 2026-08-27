import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Api, ApiError } from "./api";
import { translator, type Language } from "./i18n";
import type { Entry, ImageCapabilities, ImageInfo, ImagePreset, MetadataState, PluginDescriptor, PluginUiAction, ResourceType, SoFinderConfig, UiScale, UploadConflictStrategy } from "./types";
import { ConfirmDialog, TextDialog, UploadConflictDialog } from "./components/Dialogs";
import { ContextMenu } from "./components/ContextMenu";
import { FolderTree } from "./components/FolderTree";
import { Modal } from "./components/Modal";
import { UrlDialog } from "./components/UrlDialog";
import { EntryIcon as Icon, LinkIcon, ThumbnailImage } from "./components/EntryVisuals";
import { formatSize } from "./format";
import { UploadQueue } from "./components/UploadQueue";
import { DetailsPanel } from "./components/DetailsPanel";
import type { EntrySize, FeaturePreferences, ListColumnPreferences, ToolPreferences, ViewSizePreferences } from "./components/SettingsDialog";
import { UiIcon, type UiIconName } from "./components/UiIcon";
import { entryNameIssue } from "./nameValidation";
import { clampPageSize, columnLimits, defaultFeatures, defaultFeatureAvailability, defaultListColumns, loadColumnWidth, loadPreferences, loadScale, loadToolPreferences, loadUploadConflictStrategy, loadViewSizes, pageSizeLimits } from "./preferences";
import { useEntrySelection } from "./hooks/useEntrySelection";
import { useBrowserState, type SortMode, type ViewMode } from "./hooks/useBrowserState";
import { useBatchState } from "./hooks/useBatchState";
import { useUploads } from "./hooks/useUploads";
import { pluginActionAvailable, pluginLabel, previewerFor, previewerUrl } from "./pluginUi";

const ImageEditor = lazy(() => import("./components/ImageEditor").then(module => ({ default: module.ImageEditor })));
const ImageProcessDialog = lazy(() => import("./components/ImageProcessDialog").then(module => ({ default: module.ImageProcessDialog })));
const SecurityStatusDialog = lazy(() => import("./components/SecurityStatusDialog").then(module => ({ default: module.SecurityStatusDialog })));
const DocumentPreviewPane = lazy(() => import("./components/DocumentPreviewPane"));
const SettingsDialog = lazy(() => import("./components/SettingsDialog").then(module => ({ default: module.SettingsDialog })));
const DestinationDialog = lazy(() => import("./components/DestinationDialog").then(module => ({ default: module.DestinationDialog })));
const BulkRenameDialog = lazy(() => import("./components/BulkRenameDialog").then(module => ({ default: module.BulkRenameDialog })));
const TrashDialog = lazy(() => import("./components/TrashDialog").then(module => ({ default: module.TrashDialog })));
const TagsDialog = lazy(() => import("./components/TagsDialog").then(module => ({ default: module.TagsDialog })));

interface TextDialogState { kind: "folder" | "rename" | "resize"; title: string; label: string; initial: string; maximum: number; extension?: string }
interface ConfirmState { title: string; message: string; detail?: string; danger?: boolean }

export default function App({ config }: { config: SoFinderConfig }) {
  const pageSizeOptionsId = useId();
  const api = useMemo(() => new Api(config), [config]);
  const uiMode = config.uiDefaults.mode ?? (config.selectMode ? "picker" : "manager");
  const featureAvailability = config.featureAvailability ?? defaultFeatureAvailability;
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("sofinder.language");
    return saved === "en" || saved === "zh-cn" || saved === "zh-tw" ? saved : config.language;
  });
  const t = useMemo(() => translator(language), [language]);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }), [language]);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const { resource, setResource, path, setPath, resolvedPath, setResolvedPath, entries, setEntries, search, setSearch, searchMode, setSearchMode, sort, setSort, direction, setDirection, offset, setOffset, total, setTotal, pageCursor, setPageCursor, nextCursor, setNextCursor, cursorHistory, setCursorHistory, pageSize, setPageSize, pageSizeDraft, setPageSizeDraft, pageSizeRef, view, setView, loading, setLoading, notice, setNotice, directoryCapabilities, setDirectoryCapabilities, loadSequence, historyReady, restoringHistory, searchInitialized } = useBrowserState(config.resource, config.initialPath || "");
  const [metadata, setMetadata] = useState<MetadataState>({ favorites: [], tags: {}, recent: [] });
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [tools, setTools] = useState<ToolPreferences>(() => config.uiDefaults.fullTools ? { resize: true, crop: true, rotate: true, presets: true, process: true, batchRename: true } : loadToolPreferences());
  const [features, setFeatures] = useState<FeaturePreferences>(() => {
    const loaded = loadPreferences("sofinder.features.v2", { ...defaultFeatures, folderTree: config.featureDefaults?.folderTree ?? false });
    return {
      ...loaded,
      folderTree: featureAvailability.folderTree !== false && loaded.folderTree,
      recent: featureAvailability.recent !== false && loaded.recent,
      favorites: featureAvailability.favorites !== false && loaded.favorites,
      tags: featureAvailability.tags !== false && loaded.tags,
      archive: featureAvailability.archive !== false && loaded.archive,
      trash: featureAvailability.trash !== false && loaded.trash,
    };
  });
  const [listColumns, setListColumns] = useState<ListColumnPreferences>(() => loadPreferences("sofinder.listColumns.v1", defaultListColumns));
  const [viewSizes, setViewSizes] = useState<ViewSizePreferences>(loadViewSizes);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [securityStatusOpen, setSecurityStatusOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const [uiScale, setUiScale] = useState<UiScale>(() => loadScale(config.uiDefaults?.scale ?? "standard"));
  const [uploadConflictStrategy, setUploadConflictStrategy] = useState<UploadConflictStrategy>(() => loadUploadConflictStrategy(config.uiDefaults.uploadConflictStrategy ?? "ask"));
  const { destinationDialog, setDestinationDialog, bulkRenameOpen, setBulkRenameOpen } = useBatchState();
  const [cropOpen, setCropOpen] = useState(false);
  const [imageProcessOpen, setImageProcessOpen] = useState(false);
  const [textDialog, setTextDialog] = useState<TextDialogState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState | null>(null);
  const [uploadConflictFile, setUploadConflictFile] = useState<string | null>(null);
  const [trashOpen, setTrashOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; entry: Entry } | null>(null);
  const [previewEntry, setPreviewEntry] = useState<Entry | null>(null);
  const [textPreview, setTextPreview] = useState<{ path: string; content: string; truncated: boolean } | null>(null);
  const [checksum, setChecksum] = useState<{ path: string; value: string } | null>(null);
  const [urlDialog, setUrlDialog] = useState<{ url: string; loginRequired: boolean; expiresAt?: number } | null>(null);
  const [imagePresets, setImagePresets] = useState<Record<string, ImagePreset>>({});
  const [imageCapabilities, setImageCapabilities] = useState<ImageCapabilities>({ driver: "", formats: [] });
  const [plugins, setPlugins] = useState<PluginDescriptor[]>([]);
  const [signedUrls, setSignedUrls] = useState({ enabled: false, defaultTtlSeconds: 300, maxTtlSeconds: 3600 });
  const [leftWidth, setLeftWidth] = useState(() => loadColumnWidth("left"));
  const [rightWidth, setRightWidth] = useState(() => loadColumnWidth("right"));
  const confirmResolver = useRef<((answer: boolean) => void) | null>(null);
  const uploadConflictResolver = useRef<((strategy: Exclude<UploadConflictStrategy, "ask">) => void) | null>(null);
  const longPress = useRef<number | null>(null);
  const columnDrag = useRef<{ side: "left" | "right"; startX: number; startWidth: number; currentWidth: number; element: HTMLDivElement } | null>(null);
  const utility = useRef<HTMLDivElement>(null);
  const utilityButton = useRef<HTMLButtonElement>(null);

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
    localStorage.setItem("sofinder.uploadConflictStrategy.v1", uploadConflictStrategy);
  }, [uploadConflictStrategy]);

  useEffect(() => {
    localStorage.setItem("sofinder.language", language);
    document.documentElement.lang = language === "zh-cn" ? "zh-CN" : language === "zh-tw" ? "zh-TW" : "en";
  }, [language]);

  useEffect(() => {
    if (!utilityOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !utility.current?.contains(event.target)) setUtilityOpen(false);
    };
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setUtilityOpen(false);
      utilityButton.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [utilityOpen]);

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
  const chooseUploadConflict = useCallback((fileName: string) => new Promise<Exclude<UploadConflictStrategy, "ask">>(resolve => {
    uploadConflictResolver.current?.("skip");
    uploadConflictResolver.current = resolve;
    setUploadConflictFile(fileName);
  }), []);
  const answerUploadConflict = (strategy: Exclude<UploadConflictStrategy, "ask">) => {
    const resolve = uploadConflictResolver.current;
    uploadConflictResolver.current = null;
    setUploadConflictFile(null);
    resolve?.(strategy);
  };
  const load = useCallback(async (nextResource = resource, nextPath = path, term = search, nextOffset = offset, nextSort = sort, nextDirection = direction, nextSearchMode = searchMode, cursor: string | null = pageCursor) => {
    if (!nextResource) return;
    const sequence = ++loadSequence.current;
    setLoading(true);
    setNotice("");
    try {
      const result = await api.list(nextResource, nextPath, term, nextSort, nextDirection, nextOffset, pageSizeRef.current, nextSearchMode, cursor);
      if (sequence !== loadSequence.current) return;
      setEntries(result.entries);
      setPath(result.path);
      setResolvedPath(result.path);
      setOffset(result.offset);
      setTotal(result.total);
      setPageCursor(cursor);
      setNextCursor(result.nextCursor ?? null);
      setDirectoryCapabilities(result.capabilities || {});
      setSelectedPaths(new Set());
      setSelectionAnchor(null);
    } catch (error) {
      if (sequence !== loadSequence.current) return;
      if (error instanceof ApiError && error.code === "not_found" && nextPath !== "") {
        try {
          const fallback = await api.list(nextResource, "", "", nextSort, nextDirection, 0, pageSizeRef.current, "name", null);
          if (sequence !== loadSequence.current) return;
          setEntries(fallback.entries);
          setPath(fallback.path);
          setResolvedPath(fallback.path);
          setOffset(fallback.offset);
          setTotal(fallback.total);
          setPageCursor(null);
          setNextCursor(fallback.nextCursor ?? null);
          setDirectoryCapabilities(fallback.capabilities || {});
          setSelectedPaths(new Set());
          setSelectionAnchor(null);
          setCursorHistory([]);
          setNotice(t("missingPathFallback"));
          return;
        } catch (fallbackError) {
          error = fallbackError;
        }
      }
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
  }, [api, direction, offset, pageCursor, path, report, resource, search, searchMode, sort, t]);

  const currentResource = resources.find(item => item.name === resource);
  const currentDepth = path === "" ? 0 : path.split("/").length;
  const { uploads, uploadsCollapsed, setUploadsCollapsed, uploadInput, directoryUploadInput, upload, uploadTo, uploadDirectory, cancelUpload, cancelAllUploads, removeUploadTask, retryUpload, clearFinishedUploads } = useUploads({
    api, resource, path, currentResource, currentDepth, autoCollapse: features.autoCollapseUploads, conflictStrategy: uploadConflictStrategy, t, ask, chooseConflict: chooseUploadConflict, reload: async () => { await load(); }, setNotice, report,
  });

  useEffect(() => {
    api.configData().then(({ resources: available, plugins: activePlugins, imagePresets: presets, imageCapabilities: capabilities, signedUrls: signedUrlCapabilities }) => {
      setResources(available);
      setPlugins(activePlugins || []);
      setImagePresets(presets || {});
      setImageCapabilities(capabilities || { driver: "", formats: [] });
      setSignedUrls(signedUrlCapabilities || { enabled: false, defaultTtlSeconds: 300, maxTtlSeconds: 3600 });
      const initial = available.some(item => item.name === config.resource) ? config.resource : available[0]?.name || "";
      setResource(initial);
      if (initial) { setCursorHistory([]); void load(initial, config.initialPath || "", "", 0, sort, direction, "name", null); }
    }).catch(report);
  }, [api, config.initialPath, config.resource]);

  useEffect(() => {
    const restore = () => {
      const url = new URL(window.location.href);
      const nextResource = url.searchParams.get("type") || config.resource;
      const nextPath = url.searchParams.get("path") || "";
      restoringHistory.current = true;
      setResource(nextResource);
      setSearch("");
      setSearchMode("name");
      setCursorHistory([]);
      void load(nextResource, nextPath, "", 0, "name", "asc", "name", null);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [config.resource, load]);

  useEffect(() => {
    if (!resource || loading) return;
    const url = new URL(window.location.href);
    const currentResource = url.searchParams.get("type") || "";
    const currentPath = url.searchParams.get("path") || "";
    if (currentResource === resource && currentPath === path) {
      historyReady.current = true;
      restoringHistory.current = false;
      return;
    }
    url.searchParams.set("type", resource);
    if (path) url.searchParams.set("path", path); else url.searchParams.delete("path");
    const state = { ...(window.history.state || {}), sofinder: { resource, path } };
    if (!historyReady.current || restoringHistory.current) window.history.replaceState(state, "", url);
    else window.history.pushState(state, "", url);
    historyReady.current = true;
    restoringHistory.current = false;
  }, [loading, path, resource]);

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
  const touchRecent = useCallback((entry: Entry) => {
    if (features.recent) void api.updateMetadata(resource, entry.path, "touch").then(setMetadata).catch(report);
  }, [api, features.recent, report, resource]);
  const { selectedPaths, setSelectedPaths, selectionAnchor, setSelectionAnchor, selectedEntries, selected, selectEntry } = useEntrySelection(entries, uiMode === "picker", touchRecent);
  const imageCapability = (entry: Entry) => imageCapabilities.formats.find(format => entry.mimeType !== null && format.mimes.includes(entry.mimeType.toLowerCase()));
  const canPreviewImage = (entry: Entry | null) => Boolean(entry && imageCapability(entry)?.thumbnail);
  const canEditImage = (entry: Entry | null) => Boolean(entry && imageCapability(entry)?.edit);
  const editableSelectedImages = selectedEntries.filter(entry => canEditImage(entry));
  const canChooseEntry = (entry: Entry | null) => Boolean(entry && !entry.directory && entry.url && (config.selectionKind !== "image" || imageCapability(entry)?.webEmbeddable));
  const openUrlDialog = async (entry: Entry) => {
    if (entry.directory) return;
    if (currentResource?.entryUrlConfigured && entry.url) {
      setUrlDialog({ url: new URL(entry.url, document.baseURI).href, loginRequired: true });
      return;
    }
    if (signedUrls.enabled && currentResource?.deliveryMode === "proxy") {
      try {
        const result = await api.signedUrl(resource, entry.path, signedUrls.defaultTtlSeconds);
        setUrlDialog({ url: result.url, loginRequired: false, expiresAt: result.expiresAt });
      } catch (error) { report(error); }
      return;
    }
    setUrlDialog({
      url: new URL(entry.url || api.downloadUrl(resource, entry.path), document.baseURI).href,
      loginRequired: !entry.url,
    });
  };
  const canSelected = (operation: string) => selectedEntries.length > 0 && selectedEntries.every(entry => entry.capabilities?.[operation] !== false);
  const pluginActions = useMemo(() => plugins.flatMap(plugin => (plugin.uiActions || []).map(action => ({ ...action, plugin: plugin.name }))), [plugins]);
  const pluginPreviewers = useMemo(() => plugins.flatMap(plugin => (plugin.previewers || []).map(previewer => ({ ...previewer, plugin: plugin.name }))), [plugins]);
  const openPluginAction = (action: PluginUiAction, entry: Entry | null) => {
    if (!pluginActionAvailable(action, entry)) return;
    const url = new URL(action.url, document.baseURI);
    url.searchParams.set("resource", resource);
    url.searchParams.set("directory", path);
    if (entry) url.searchParams.set("path", entry.path);
    window.open(url, "_blank", "noopener");
  };

  useEffect(() => {
    setImageInfo(null);
    if (!selected || !imageCapability(selected)?.read) return;
    let active = true;
    api.imageInfo(resource, selected.path).then(info => { if (active) setImageInfo(info); }).catch(error => { if (active) report(error); });
    return () => { active = false; };
  }, [api, resource, selected?.path, selected?.mimeType, report]);

  useEffect(() => {
    setTextPreview(null);
    setChecksum(null);
    if (featureAvailability.textPreview === false || !previewEntry || !isTextPreviewMime(previewEntry.mimeType)) return;
    let active = true;
    api.textPreview(resource, previewEntry.path).then(result => {
      if (active) setTextPreview({ path: previewEntry.path, content: result.content, truncated: result.truncated });
    }).catch(error => { if (active) report(error); });
    return () => { active = false; };
  }, [api, featureAvailability.textPreview, previewEntry?.path, previewEntry?.mimeType, report, resource]);

  const openEntry = (entry: Entry) => {
    if (entry.directory) { setCursorHistory([]); void load(resource, entry.path, search, 0, sort, direction, searchMode, null); }
    else void choose(entry);
  };

  const createFolder = async () => {
    if (!currentResource) return;
    setTextDialog({ kind: "folder", title: t("newFolder"), label: t("folderName"), initial: "", maximum: currentResource.maxFolderNameLength });
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
      await load();
      setNotice(result.purgedItems > 0 ? `${summary} · ${t("trashAutoPurged")} ${result.purgedItems} ${t("items")} (${formatSize(result.purgedBytes)})` : summary);
    } catch (error) { report(error); }
  };

  const batchRename = async (renames: Array<{ path: string; name: string }>) => {
    setBulkRenameOpen(false);
    try {
      const result = await api.batchRename(resource, renames);
      await load();
      setNotice(result.failed === 0 ? `${result.succeeded} ${t("completed")}` : `${result.succeeded} ${t("completed")}, ${result.failed} ${t("failed")}`);
    } catch (error) { report(error); }
  };

  const transfer = async (operation: "copy" | "move", destination: string) => {
    try {
      const result = await api.batch(operation, resource, selectedEntries.map(entry => entry.path), destination);
      setDestinationDialog(null);
      await load();
      setNotice(result.failed === 0 ? `${result.succeeded} ${t("completed")}` : `${result.succeeded} ${t("completed")}, ${result.failed} ${t("failed")}`);
    } catch (error) { report(error); }
  };

  const browseDestination = async (operation: "copy" | "move", destination: string) => {
    setDestinationDialog({ operation, path: destination, folders: [], loading: true });
    try {
      const result = await api.list(resource, destination, "", "name", "asc", 0, 500);
      setDestinationDialog({ operation, path: result.path, folders: result.entries.filter(entry => entry.directory), loading: false });
    } catch (error) {
      if (error instanceof ApiError && error.code === "not_found" && destination !== "") {
        try {
          const fallback = await api.list(resource, "", "", "name", "asc", 0, 500);
          setDestinationDialog({ operation, path: fallback.path, folders: fallback.entries.filter(entry => entry.directory), loading: false });
          setNotice(t("missingDestinationFallback"));
          return;
        } catch (fallbackError) {
          error = fallbackError;
        }
      }
      setDestinationDialog(current => current ? { ...current, loading: false } : null);
      report(error);
    }
  };

  const choose = async (entry = selected) => {
    if (!canChooseEntry(entry)) {
      if (entry && config.selectionKind === "image") setNotice(t("webImageUnsupported"));
      return;
    }
    if (!entry?.url) return;
    let dimensions = entry === selected ? imageInfo : null;
    if (imageCapability(entry)?.read && dimensions === null) {
      try { dimensions = await api.imageInfo(resource, entry.path); }
      catch { dimensions = null; }
    }
    const pickerEntry = { ...entry, resource, url: entry.url, width: dimensions?.width ?? null, height: dimensions?.height ?? null };
    if (config.ckeditorFunction > 0) {
      const target = window.opener || window.parent;
      const ckeditor = (target as Window & { CKEDITOR?: { tools?: { callFunction?: (id: number, url: string) => void } } }).CKEDITOR;
      ckeditor?.tools?.callFunction?.(config.ckeditorFunction, entry.url);
      window.close();
      return;
    }
    if (config.pickerRequestId && config.pickerOrigin) {
      const target = window.opener || (window.parent !== window ? window.parent : null);
      target?.postMessage({ type: "sofinder:select", version: "1.0", requestId: config.pickerRequestId, entry: pickerEntry }, config.pickerOrigin);
      if (window.opener) window.close();
      return;
    }
    window.dispatchEvent(new CustomEvent("sofinder:select", { detail: pickerEntry }));
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
      localStorage.setItem("sofinder.tools.v3", JSON.stringify(next));
      return next;
    });
  };

  const updateFeature = (name: keyof FeaturePreferences, enabled: boolean) => {
    if (name !== "autoCollapseUploads" && featureAvailability[name] === false) return;
    setFeatures(current => {
      const next = { ...current, [name]: enabled };
      localStorage.setItem("sofinder.features.v2", JSON.stringify(next));
      return next;
    });
  };

  const updateListColumn = (name: keyof ListColumnPreferences, enabled: boolean) => {
    setListColumns(current => {
      const next = { ...current, [name]: enabled };
      localStorage.setItem("sofinder.listColumns.v1", JSON.stringify(next));
      return next;
    });
  };

  const updateViewSize = (viewName: keyof ViewSizePreferences, size: EntrySize) => {
    setViewSizes(current => {
      const next = { ...current, [viewName]: size };
      localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify(next));
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
    const name = recentPath.split("/").pop() || recentPath;
    try {
      const result = await api.list(resource, directory, name, "name", "asc", 0, 500);
      if (!result.entries.some(entry => entry.path === recentPath)) {
        setMetadata(await api.updateMetadata(resource, recentPath, "forget"));
        setNotice(t("recentMissing"));
        return;
      }
      await load(resource, directory, "", 0);
      setSelectedPaths(new Set([recentPath]));
    } catch (error) {
      if (error instanceof ApiError && error.code === "not_found") {
        try { setMetadata(await api.updateMetadata(resource, recentPath, "forget")); }
        catch (metadataError) { report(metadataError); return; }
        setNotice(t("recentMissing"));
        return;
      }
      report(error);
    }
  };

  const setViewMode = (mode: ViewMode) => { setView(mode); localStorage.setItem("sofinder.view", mode); };

  const runContextCommand = (command: string) => {
    const target = contextMenu?.entry ?? null;
    setContextMenu(null);
    if (command.startsWith("plugin:")) {
      const action = pluginActions.find(item => `plugin:${item.plugin}:${item.id}` === command);
      if (action) openPluginAction(action, target);
      return;
    }
    if (command === "open" && target?.directory) openEntry(target);
    else if (command === "preview" && target && !target.directory) setPreviewEntry(target);
    else if (command === "select" && target) void choose(target);
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
    event.currentTarget.classList.add("is-resizing");
    const startWidth = side === "left" ? leftWidth : rightWidth;
    columnDrag.current = { side, startX: event.clientX, startWidth, currentWidth: startWidth, element: event.currentTarget };
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
    if (active) {
      active.element.classList.remove("is-resizing");
      setColumnWidth(active.side, active.currentWidth, true);
    }
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
  const fullTools = config.uiDefaults.fullTools === true;
  const hasLogo = config.uiDefaults.logo !== false;
  const recoverableDelete = currentResource?.storageCapabilities?.recoverableDelete !== false;
  const showSidebar = resources.length > 1 || features.folderTree || features.recent || Boolean(currentResource?.readOnly || currentResource?.quotaBytes);
  const recentPanel = (variant: "sidebar" | "mobile") => features.recent ? <div className={`sf-recent sf-recent-${variant}`}>
    <header><strong>{t("recent")}</strong><span>{metadata.recent.length}</span></header>
    {metadata.recent.length === 0
      ? <p className="sf-recent-empty">{t("recentEmpty")}</p>
      : metadata.recent.slice(0, 8).map(item => <button key={item.path} title={item.path} onClick={() => void openRecent(item.path)}><span className="sf-recent-icon"><UiIcon name="history"/></span><span><b>{item.path.split("/").pop()}</b><small>{item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : t("home")}</small></span></button>)}
  </div> : null;
  const showDetails = (uiMode === "manager" || fullTools) && selectedEntries.length > 0;
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
  const commitPageSize = () => {
    const requested = Number(pageSizeDraft);
    if (!Number.isFinite(requested) || requested <= 0) {
      setPageSizeDraft(String(pageSize));
      return;
    }
    const next = clampPageSize(requested);
    setPageSizeDraft(String(next));
    if (next === pageSize) return;
    pageSizeRef.current = next;
    setPageSize(next);
    localStorage.setItem("sofinder.pageSize.v1", String(next));
    setCursorHistory([]);
    void load(resource, path, search, 0, sort, direction, searchMode, null);
  };

  return <main className={`sf-app sf-mode-${uiMode}${showSidebar ? "" : " sf-no-sidebar"}${showDetails ? "" : " sf-no-details"}${(uiMode === "manager" || fullTools) && selectedEntries.length > 0 ? " sf-has-selection-actions" : ""}`} onKeyDown={handleKeyDown} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (event.dataTransfer.files.length) void upload(event.dataTransfer.files); }}>
    <div className={`sf-commandbar ${hasLogo ? "sf-has-brand" : "sf-no-brand"}`}>
      {hasLogo ? <div className="sf-brand" title="SoFinder"><span className="sf-brand-mark" aria-hidden="true">S</span>{config.uiDefaults.header === true ? <strong>SoFinder</strong> : <span className="sf-sr-only">SoFinder</span>}</div> : <nav className="sf-breadcrumb sf-command-breadcrumb" aria-label="Breadcrumb">
        <button onClick={() => resetAndLoad(resource, "")}>{t("home")}</button>
        {crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => resetAndLoad(resource, crumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}
      </nav>}
      {config.uiDefaults.search !== false && <div className="sf-search"><UiIcon name="search"/><select value={searchMode} onChange={event => { const next = event.target.value as "name" | "tags"; setSearchMode(next); setOffset(0); }} aria-label={t("searchScope")}><option value="name" disabled={currentResource?.storageCapabilities?.search === false}>{t("name")}</option><option value="tags">{t("tags")}</option></select><input disabled={searchMode === "name" && currentResource?.storageCapabilities?.search === false} value={search} onChange={e => setSearch(e.target.value)} placeholder={searchMode === "tags" ? t("searchTags") : t("search")} aria-label={searchMode === "tags" ? t("searchTags") : t("search")}/></div>}
      <div className="sf-command-actions">
      {config.uiDefaults.viewSwitcher !== false && <div className="sf-view-toggle" role="group" aria-label={`${t("grid")} / ${t("list")}`}>
        <button className={view === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} title={t("grid")} aria-label={t("grid")}><UiIcon name="grid"/></button>
        <button className={view === "list" ? "active" : ""} onClick={() => setViewMode("list")} title={t("list")} aria-label={t("list")}><UiIcon name="list"/></button>
      </div>}
      <div ref={utility} className="sf-utility">
        <button ref={utilityButton} className="sf-icon-only" onClick={() => setUtilityOpen(open => !open)} aria-expanded={utilityOpen} title={t("moreActions")} aria-label={t("moreActions")}><UiIcon name="more"/></button>
        {utilityOpen && <div className="sf-utility-menu" role="menu">
          {config.uiDefaults.languageSwitcher !== false && <label><span>{t("language")}</span><select value={language} onChange={event => setLanguage(event.target.value as Language)} aria-label={t("language")}><option value="zh-cn">简中</option><option value="zh-tw">繁中</option><option value="en">EN</option></select></label>}
          <label><span>{t("sort")}</span><select value={sort} disabled={currentResource?.storageCapabilities?.sort === false} onChange={event => { const next = event.target.value as SortMode; setSort(next); setCursorHistory([]); void load(resource, path, search, 0, next, direction, searchMode, null); }}><option value="name">{t("name")}</option><option value="size">{t("size")}</option><option value="modified">{t("modified")}</option></select></label>
          <button role="menuitem" disabled={currentResource?.storageCapabilities?.sort === false} onClick={() => { const next = direction === "asc" ? "desc" : "asc"; setDirection(next); setCursorHistory([]); void load(resource, path, search, 0, sort, next, searchMode, null); }}>{iconButton("sort", t("direction"))}</button>
          <button role="menuitem" onClick={() => { setUtilityOpen(false); void load(); }}>{iconButton("refresh", t("refresh"))}</button>
          <button role="menuitem" onClick={() => { setUtilityOpen(false); setSettingsOpen(true); }}>{iconButton("settings", t("settings"))}</button>
          {(uiMode === "manager" || fullTools) && config.securityStatusAvailable !== false && <button role="menuitem" onClick={() => { setUtilityOpen(false); setSecurityStatusOpen(true); }}>{iconButton("security", t("securityStatus"))}</button>}
          {(uiMode === "manager" || fullTools) && features.trash && recoverableDelete && <button role="menuitem" onClick={() => { setUtilityOpen(false); setTrashOpen(true); }}>{iconButton("trash", t("trash"))}</button>}
          {(uiMode === "manager" || fullTools) && pluginActions.filter(action => action.slot === "utility" && pluginActionAvailable(action, null)).map(action => <button role="menuitem" key={`${action.plugin}:${action.id}`} onClick={() => { setUtilityOpen(false); openPluginAction(action, null); }}>{pluginLabel(action, language)}</button>)}
        </div>}
      </div>
      </div>
    </div>
    <div className="sf-toolbar" role="toolbar" aria-label={t("fileActions")} title={t("keyboardHelp")}>
      <button onClick={createFolder} disabled={currentResource?.readOnly || directoryCapabilities.create_folder === false || (currentResource !== undefined && currentDepth >= currentResource.maxFolderDepth)} title={currentResource && currentDepth >= currentResource.maxFolderDepth ? t("folderDepthReached") : undefined}>{iconButton("add-folder", t("newFolder"))}</button>
      <button className={`primary sf-upload-trigger${uploadActive ? " is-active" : ""}`} aria-busy={uploadActive} onClick={() => uploadInput.current?.click()} disabled={currentResource?.readOnly || directoryCapabilities.upload === false}>{iconButton("upload", `${t("upload")}${uploadActive ? ` (${uploads.filter(task => task.status === "queued" || task.status === "uploading").length})` : ""}`)}</button>
      <input ref={uploadInput} type="file" multiple hidden onChange={event => { if (event.target.files) void upload(event.target.files); event.target.value = ""; }}/>
      {featureAvailability.folderUpload !== false && <><button onClick={() => directoryUploadInput.current?.click()} disabled={currentResource?.readOnly || directoryCapabilities.upload === false}>{iconButton("add-folder", t("uploadFolder"))}</button>
      <input ref={element => { directoryUploadInput.current = element; element?.setAttribute("webkitdirectory", ""); }} type="file" multiple hidden onChange={event => { if (event.target.files) void uploadDirectory(event.target.files); event.target.value = ""; }}/></>}
      {(uiMode === "manager" || fullTools) && selectedEntries.length > 0 && <><span className="sf-separator"/><div className="sf-context-actions">
      <button onClick={toggleSelectAll} disabled={entries.length === 0}>{iconButton("select", selectedPaths.size === entries.length && entries.length > 0 ? t("clearSelection") : t("selectAll"))}</button>
      <button onClick={rename} disabled={selectedEntries.length !== 1 || !canSelected("rename") || currentResource?.readOnly}>{iconButton("rename", t("rename"))}</button>
      {featureAvailability.batchRename !== false && tools.batchRename && <button onClick={() => setBulkRenameOpen(true)} disabled={selectedEntries.length < 2 || !canSelected("rename") || currentResource?.readOnly}>{iconButton("rename", t("batchRename"))}</button>}
      <button onClick={() => void browseDestination("copy", path)} disabled={!canSelected("copy") || currentResource?.readOnly}>{iconButton("copy", t("copy"))}</button>
      <button onClick={() => void browseDestination("move", path)} disabled={!canSelected("move") || currentResource?.readOnly}>{iconButton("move", t("move"))}</button>
      {features.archive && <button onClick={() => void downloadArchive()}>{iconButton("archive", t("downloadZip"))}</button>}
      {features.favorites && <button onClick={() => void toggleFavorite()} disabled={!selected}>{iconButton("favorite", t("favorite"))}</button>}
      {features.tags && <button onClick={() => void editTags()} disabled={!selected}>{iconButton("tags", t("tags"))}</button>}
      <button className="danger" onClick={remove} disabled={!canSelected("delete") || currentResource?.readOnly}>{iconButton("delete", `${t("remove")}${selectedEntries.length > 1 ? ` (${selectedEntries.length})` : ""}`)}</button>
      {featureAvailability.imageEditing !== false && tools.rotate && <><button onClick={() => void editImage(270)} disabled={!canEditImage(selected) || currentResource?.readOnly}>{iconButton("rotate-left", t("rotateLeft"))}</button><button onClick={() => void editImage(90)} disabled={!canEditImage(selected) || currentResource?.readOnly}>{iconButton("rotate-right", t("rotateRight"))}</button></>}
      {featureAvailability.imageEditing !== false && tools.resize && <button onClick={resizeImage} disabled={!canEditImage(selected) || currentResource?.readOnly}>{iconButton("resize", t("resize"))}</button>}
      {featureAvailability.imageEditing !== false && tools.crop && <button onClick={openCropEditor} disabled={!canEditImage(selected) || !imageInfo || currentResource?.readOnly}>{iconButton("crop", t("crop"))}</button>}
      {featureAvailability.imageProcessing !== false && tools.process && <button onClick={() => setImageProcessOpen(true)} disabled={editableSelectedImages.length === 0 || editableSelectedImages.length !== selectedEntries.length || currentResource?.readOnly}>{iconButton("resize", t("imageProcess"))}</button>}
      {featureAvailability.imageEditing !== false && tools.presets && <label className="sf-sort">{t("preset")}<select value="" disabled={!canEditImage(selected) || currentResource?.readOnly || Object.keys(imagePresets).length === 0} onChange={event => { const name = event.target.value; event.target.value = ""; if (name) void applyPreset(name); }}>
        <option value="">—</option>{Object.entries(imagePresets).map(([name, preset]) => <option key={name} value={name}>{name} ({preset.width}×{preset.height})</option>)}
      </select></label>}
      {selected && pluginActions.filter(action => action.slot === "toolbar" && pluginActionAvailable(action, selected)).map(action => <button key={`${action.plugin}:${action.id}`} onClick={() => openPluginAction(action, selected)}>{pluginLabel(action, language)}</button>)}
      </div></>}
    </div>
    {notice && <div className="sf-notice" role="alert">{notice}<button onClick={() => setNotice("")} aria-label={t("close")}><UiIcon name="close"/></button></div>}
    <UploadQueue tasks={uploads} collapsed={uploadsCollapsed} labels={{ title: t("uploadQueue"), expand: t("expand"), collapse: t("collapse"), cancel: t("cancel"), cancelAll: t("cancelAll"), clearFinished: t("clearFinished"), retry: t("retryUpload"), remove: t("removeUploadTask"), status: status => t(status) }} onToggle={() => setUploadsCollapsed(current => !current)} onCancel={cancelUpload} onCancelAll={cancelAllUploads} onClearFinished={clearFinishedUploads} onRetry={retryUpload} onRemove={removeUploadTask}/>
    <div className="sf-layout" style={{ "--sf-sidebar-width": `${leftWidth}px`, "--sf-details-width": `${rightWidth}px` } as React.CSSProperties}>
      {showSidebar && <aside className="sf-sidebar" aria-label="Resources">
        {resources.map(item => <button key={item.name} className={item.name === resource ? "active" : ""} onClick={() => { setResource(item.name); setSearch(""); setSearchMode("name"); if (item.storageCapabilities?.sort === false) { setSort("name"); setDirection("asc"); setCursorHistory([]); void load(item.name, "", "", 0, "name", "asc", "name", null); } else resetAndLoad(item.name, "", ""); }}>
          <span className="sf-resource-icon"><Icon kind={item.name.toLowerCase().includes("image") ? "image" : "folder"}/></span>
          {item.name.toLowerCase().includes("image") ? t("images") : item.name.toLowerCase() === "files" ? t("files") : item.name}
        </button>)}
        {features.folderTree && resource && (
          <FolderTree api={api} resource={resource} currentPath={resolvedPath} rootLabel={t("home")} onNavigate={next => resetAndLoad(resource, next, "")}/>
        )}
        {currentResource && <div className="sf-resource-status">
          {currentResource.readOnly && <strong>{t("readOnly")}</strong>}
          {currentResource.quotaBytes > 0 && <><span>{t("storageUsage")}: {formatSize(currentResource.usedBytes)} / {formatSize(currentResource.quotaBytes)}</span><progress max={currentResource.quotaBytes} value={Math.min(currentResource.usedBytes, currentResource.quotaBytes)}/></>}
        </div>}
        {recentPanel("sidebar")}
      </aside>}
      {showSidebar && <div className="sf-column-resizer left" role="separator" tabIndex={0} aria-label={t("resizeLeftPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.left.min} aria-valuemax={columnLimits.left.max} aria-valuenow={leftWidth} onPointerDown={event => beginColumnResize("left", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("left", event)} onDoubleClick={() => setColumnWidth("left", columnLimits.left.initial, true)}/>}
      <section className="sf-content">
        {recentPanel("mobile")}
        {hasLogo && <nav className="sf-breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => resetAndLoad(resource, "")}>{t("home")}</button>
          {crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => resetAndLoad(resource, crumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}
        </nav>}
        {loading ? <div className="sf-state">{t("loading")}</div> : entries.length === 0 ? <div className="sf-state">{t("empty")}</div> :
          <div className={`sf-entries ${view} sf-grid-size-${viewSizes.grid} sf-list-size-${viewSizes.list}${view === "list" && listColumns.size ? " sf-list-has-size" : ""}`} style={view === "list" ? { "--sf-list-columns": ["minmax(220px, 1fr)", ...(listColumns.size ? ["100px"] : []), ...(listColumns.type ? ["160px"] : []), ...(listColumns.modified ? ["180px"] : [])].join(" ") } as React.CSSProperties : undefined} role="listbox" aria-multiselectable={uiMode === "manager"} aria-label={t("files")}>
            {view === "list" && <div className="sf-list-head" role="presentation" aria-hidden="true"><span>{t("name")}</span>{listColumns.size && <span className="sf-list-size">{t("size")}</span>}{listColumns.type && <span className="sf-list-type">{t("type")}</span>}{listColumns.modified && <span className="sf-list-modified">{t("modified")}</span>}</div>}
            {entries.map((entry, index) => {
              const image = !entry.directory && canPreviewImage(entry);
              return <button key={entry.path} data-entry-index={index} role="option" aria-selected={selectedPaths.has(entry.path)} aria-label={`${entry.name}, ${entry.directory ? t("folder") : formatSize(entry.size)}`} className={`sf-entry ${selectedPaths.has(entry.path) ? "selected" : ""}`} onClick={event => selectEntry(entry, event)} onDoubleClick={() => openEntry(entry)} onContextMenu={event => { event.preventDefault(); setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }} onPointerDown={event => { if (event.pointerType === "touch") longPress.current = window.setTimeout(() => { setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }, 550); }} onPointerUp={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onPointerCancel={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onDragOver={event => { if (entry.directory) event.preventDefault(); }} onDrop={event => { if (entry.directory && event.dataTransfer.files.length) { event.preventDefault(); void uploadTo(entry.path, event.dataTransfer.files); } }}>
                <span className="sf-entry-icon">{image ? <ThumbnailImage src={api.thumbnailUrl(resource, entry)} alt="" lazy/> : <Icon name={entry.name} mimeType={entry.mimeType} directory={entry.directory}/>}</span>
                <span className="sf-entry-name" title={entry.name}>{features.favorites && metadata.favorites.includes(entry.path) && <span aria-label={t("favorite")}><UiIcon name="favorite"/> </span>}{entry.name}</span>
                {listColumns.size && <span className="sf-entry-size">{entry.directory ? "—" : formatSize(entry.size)}</span>}
                {listColumns.type && <span className="sf-entry-type">{entry.directory ? t("folder") : entry.mimeType || t("file")}</span>}
                {listColumns.modified && <time className="sf-entry-modified" dateTime={new Date(entry.modifiedAt * 1000).toISOString()}>{dateFormatter.format(entry.modifiedAt * 1000)}</time>}
              </button>;
            })}
          </div>}
        <nav className="sf-pagination" aria-label={t("pagination")}>
          <div className="sf-page-navigation">
            <button disabled={cursorHistory.length === 0} onClick={previousPage}><UiIcon name="chevron-left"/> {t("previous")}</button>
            <span>{t("page")} {cursorHistory.length + 1}{total !== null ? ` / ${Math.max(1, Math.ceil(total / pageSize))}` : ""}</span>
            <button disabled={nextCursor === null} onClick={followingPage}>{t("next")} <UiIcon name="chevron-right"/></button>
          </div>
          <label className="sf-page-size">
            <span>{t("itemsPerPage")} ({pageSizeLimits.min}–{pageSizeLimits.max})</span>
            <input type="number" min={pageSizeLimits.min} max={pageSizeLimits.max} step="10" list={pageSizeOptionsId} value={pageSizeDraft} onChange={event => setPageSizeDraft(event.target.value)} onBlur={commitPageSize} onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }}/>
          </label>
          <datalist id={pageSizeOptionsId}>{[20, 50, 100, 200, 500].map(value => <option key={value} value={value}/>)}</datalist>
        </nav>
      </section>
      {showDetails && <><div className="sf-column-resizer right" role="separator" tabIndex={0} aria-label={t("resizeRightPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.right.min} aria-valuemax={columnLimits.right.max} aria-valuenow={rightWidth} onPointerDown={event => beginColumnResize("right", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("right", event)} onDoubleClick={() => setColumnWidth("right", columnLimits.right.initial, true)}/><DetailsPanel api={api} resource={resource} selectedEntries={selectedEntries} selected={selected} imageInfo={imageInfo} metadata={metadata} showTags={features.tags} previewImage={canPreviewImage(selected)} selectMode={false} selectAllowed={canChooseEntry(selected)} labels={{ details: t("details"), selected: t("selectedCount"), type: t("type"), folder: t("folder"), file: t("file"), size: t("size"), dimensions: t("dimensions"), modified: t("modified"), location: t("location"), select: t("select"), download: t("download"), copyUrl: t("copyUrl"), unsupportedWebImage: t("webImageUnsupported") }} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} onChoose={choose} onOpenUrl={openUrlDialog} pluginActions={selected && pluginActions.filter(action => action.slot === "details" && pluginActionAvailable(action, selected)).map(action => <button key={`${action.plugin}:${action.id}`} onClick={() => openPluginAction(action, selected)}>{pluginLabel(action, language)}</button>)}/></>}
    </div>
    {uiMode === "picker" && selected && !selected.directory && <div className="sf-picker-bar"><div><strong>{selected.name}</strong><small>{formatSize(selected.size)}</small></div>{!canChooseEntry(selected) && <span role="status">{t("webImageUnsupported")}</span>}<button className="primary" disabled={!canChooseEntry(selected)} onClick={() => void choose()}>{t("select")}</button></div>}
    {settingsOpen && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><SettingsDialog resource={currentResource} tools={tools} features={features} columns={listColumns} viewSizes={viewSizes} availability={featureAvailability} scale={uiScale} uploadConflictStrategy={uploadConflictStrategy} translate={t} onToolChange={updateTool} onFeatureChange={updateFeature} onColumnChange={updateListColumn} onViewSizeChange={updateViewSize} onScaleChange={setUiScale} onUploadConflictStrategyChange={setUploadConflictStrategy} onClose={() => setSettingsOpen(false)}/></Suspense>}
    {securityStatusOpen && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><SecurityStatusDialog api={api} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} labels={{ title: t("securityStatus"), close: t("close"), loading: t("loading"), enabled: t("malwareScanningEnabled"), disabled: t("malwareScanningDisabled"), provider: t("scanProvider"), service: t("serviceStatus"), scans: t("scanHistory"), passed: t("scanPassed"), quarantined: t("scanQuarantined"), failed: t("scanFailed"), pending: t("scanPending"), recent: t("recentScans"), none: t("noScans") }} onClose={() => setSecurityStatusOpen(false)}/></Suspense>}
    {destinationDialog && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><DestinationDialog state={destinationDialog} unsafe={destinationUnsafe} translate={t} onBrowse={(operation, destination) => void browseDestination(operation, destination)} onConfirm={(operation, destination) => void transfer(operation, destination)} onClose={() => setDestinationDialog(null)}/></Suspense>}
    {bulkRenameOpen && featureAvailability.batchRename !== false && tools.batchRename && currentResource && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><BulkRenameDialog entries={selectedEntries} maximum={currentResource.maxFileNameLength} labels={{ title: t("batchRename"), pattern: t("renamePattern"), hint: t("renamePatternHint"), oldName: t("oldName"), newName: t("newName"), invalid: t("invalidEntryName"), duplicate: t("duplicateRename"), cancel: t("cancel"), save: t("rename"), close: t("close") }} onClose={() => setBulkRenameOpen(false)} onSave={renames => void batchRename(renames)}/></Suspense>}
    {textDialog && <TextDialog title={textDialog.title} label={textDialog.label} initialValue={textDialog.initial} maximum={textDialog.maximum} extension={textDialog.extension} invalidNameLabel={t("invalidEntryName")} confirmLabel={t("confirm")} cancelLabel={t("cancel")} closeLabel={t("close")} onConfirm={value => void submitTextDialog(value)} onClose={() => setTextDialog(null)}/>}
    {confirmDialog && <ConfirmDialog {...confirmDialog} confirmLabel={t("confirm")} cancelLabel={t("cancel")} closeLabel={t("close")} onConfirm={() => answerConfirm(true)} onClose={() => answerConfirm(false)}/>}
    {uploadConflictFile && <UploadConflictDialog
      fileName={uploadConflictFile}
      title={t("replaceFile")}
      renameLabel={t("uploadConflictRename")}
      overwriteLabel={t("uploadConflictOverwrite")}
      skipLabel={t("uploadConflictSkip")}
      closeLabel={t("close")}
      onChoose={answerUploadConflict}
    />}
    {trashOpen && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><TrashDialog
      api={api} resource={resource} locale={language}
      labels={{ title: t("trash"), close: t("close"), cancel: t("cancel"), empty: t("trashEmpty"), restore: t("restore"), permanentDelete: t("permanentDelete"), expires: t("expires"), conflict: t("restoreConflict"), overwrite: t("restoreOverwrite"), autoRename: t("restoreAutoRename"), usage: t("trashUsage"), items: t("items"), previous: t("previous"), next: t("next"), search: t("searchTrash") }}
      onClose={() => setTrashOpen(false)} onChanged={() => void load()}
    /></Suspense>}
    {tagsOpen && selected && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><TagsDialog
      initial={metadata.tags[selected.path] || []}
      suggestions={Array.from(new Set(Object.values(metadata.tags).flat())).sort((left, right) => left.localeCompare(right, language))}
      labels={{ title: t("tags"), close: t("close"), cancel: t("cancel"), save: t("save"), input: t("tagInput"), hint: t("tagInputHint"), maximum: t("tagMaximum") }}
      onClose={() => setTagsOpen(false)}
      onSave={tags => { setTagsOpen(false); void api.updateMetadata(resource, selected.path, "tags", { tags }).then(setMetadata).catch(report); }}
    /></Suspense>}
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
            : featureAvailability.textPreview !== false && textPreview?.path === previewEntry.path
              ? <><pre className="sf-text-preview">{textPreview.content}</pre>{textPreview.truncated && <p className="sf-warning">{t("previewTruncated")}</p>}</>
            : previewerFor(previewEntry, pluginPreviewers)?.plugin === "document-preview"
              ? <Suspense fallback={<div className="sf-state">{t("previewPreparing")}</div>}><DocumentPreviewPane api={api} resource={resource} entry={previewEntry} labels={{ preparing: t("previewPreparing"), failed: t("previewFailed"), retry: t("previewRetry") }}/></Suspense>
            : previewerUrl(previewEntry, pluginPreviewers, resource)
              ? <iframe className="sf-document-preview" src={previewerUrl(previewEntry, pluginPreviewers, resource) || undefined} title={previewEntry.name}/>
              : <div className="sf-file-preview-fallback"><Icon kind="file"/><p>{t("previewUnavailable")}</p></div>}
        </div>
        <dl className="sf-file-preview-meta"><dt>{t("type")}</dt><dd>{previewEntry.mimeType || t("file")}</dd><dt>{t("size")}</dt><dd>{formatSize(previewEntry.size)}</dd><dt>{t("modified")}</dt><dd><time dateTime={new Date(previewEntry.modifiedAt * 1000).toISOString()}>{dateFormatter.format(previewEntry.modifiedAt * 1000)}</time></dd><dt>{t("location")}</dt><dd>{previewEntry.path}</dd>{featureAvailability.checksum !== false && <><dt>SHA-256</dt><dd>{checksum?.path === previewEntry.path ? <code className="sf-checksum">{checksum.value}</code> : <button onClick={() => void api.checksum(resource, previewEntry.path).then(result => setChecksum({ path: previewEntry.path, value: result.checksum })).catch(report)}>{t("calculateChecksum")}</button>}</dd></>}</dl>
      </div>
    </Modal>}
    {urlDialog && <UrlDialog url={urlDialog.url} loginRequired={urlDialog.loginRequired} expiresAt={urlDialog.expiresAt} labels={{ title: urlDialog.expiresAt ? t("temporaryFileUrl") : t("fileUrl"), close: t("close"), copied: t("urlCopied"), failed: t("copyUrlFailed"), hint: t("clickUrlToCopy"), loginRequired: t("loginRequired"), expires: t("linkExpires") }} onClose={() => setUrlDialog(null)}/>}
    {imageProcessOpen && featureAvailability.imageProcessing !== false && editableSelectedImages.length > 0 && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><ImageProcessDialog
      entries={editableSelectedImages}
      resource={resource}
      formats={imageCapabilities.formats.filter(item => item.edit && ["jpeg", "png", "webp", "avif"].includes(item.format)).map(item => item.format)}
      labels={{ title: t("imageProcess"), close: t("close"), cancel: t("cancel"), apply: t("applyImageProcess"), processing: t("processingImages"), selected: t("processingSelected"), operation: t("operation"), optimize: t("optimizeImage"), textWatermark: t("textWatermark"), imageWatermark: t("imageWatermark"), outputFormat: t("outputFormat"), keepFormat: t("keepFormat"), watermarkText: t("watermarkText"), color: t("color"), watermarkResource: t("watermarkResource"), watermarkPath: t("watermarkPath"), position: t("position"), topLeft: t("topLeft"), topRight: t("topRight"), center: t("center"), bottomLeft: t("bottomLeft"), bottomRight: t("bottomRight"), opacity: t("opacity"), scale: t("watermarkScale"), quality: t("quality"), saveMode: t("saveMode"), saveCopy: t("saveCopy"), overwrite: t("overwrite"), conversionCopyHint: t("conversionCopyHint"), overwriteWarning: t("confirmImageOverwrite") }}
      onClose={() => setImageProcessOpen(false)}
      onApply={async (actions, save) => {
        if (editableSelectedImages.length === 1) {
          await api.applyImageActions(resource, editableSelectedImages[0].path, actions, save);
          setNotice(`${t("completed")}: 1`);
        } else {
          const result = await api.applyImageBatch(resource, editableSelectedImages.map(entry => entry.path), actions, save);
          setNotice(`${t("completed")}: ${result.succeeded} · ${t("failed")}: ${result.failed}`);
        }
        setImageProcessOpen(false);
        await load();
      }}
    /></Suspense>}
    {cropOpen && selected && imageInfo && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><ImageEditor
      entry={selected}
      info={imageInfo}
      imageUrl={api.contentUrl(resource, selected.path)}
      maximumFileNameLength={currentResource?.maxFileNameLength ?? 120}
      labels={{ crop: t("crop"), close: t("close"), cancel: t("cancel"), save: t("save"), saving: t("saving"), ratio: t("ratio"), free: t("freeRatio"), original: t("originalRatio"), zoom: t("zoom"), undo: t("undo"), redo: t("redo"), reset: t("reset"), compare: t("compare"), x: "X", y: "Y", width: t("width"), height: t("height"), saveMode: t("saveMode"), saveCopy: t("saveCopy"), overwrite: t("overwrite"), fileName: t("fileName"), fileNameTooLong: t("fileNameTooLongMaximum"), invalidFileName: t("invalidEntryName"), formatLocked: t("imageFormatLocked"), overwriteWarning: t("confirmImageOverwrite"), panHint: t("panHint") }}
      onClose={() => setCropOpen(false)}
      onSave={async (actions, save) => {
        const result = await api.applyImageActions(resource, selected.path, actions, save);
        setCropOpen(false);
        setNotice(`${t("imageCreated")}: ${result.entry.name} · ${result.result.width} × ${result.result.height} px`);
        await load();
      }}
    /></Suspense>}
    {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onSelect={runContextCommand} items={[
      { id: contextMenu.entry.directory ? "open" : "preview", label: contextMenu.entry.directory ? t("open") : t("preview") },
      ...(uiMode === "picker" && !contextMenu.entry.directory ? [{ id: "select", label: t("select"), disabled: !canChooseEntry(contextMenu.entry) }] : []),
      { id: "download", label: t("download"), disabled: contextMenu.entry.directory },
      ...(uiMode === "manager" ? [
        { id: "rename", label: t("rename"), disabled: contextMenu.entry.capabilities?.rename === false },
        { id: "copy", label: t("copy"), disabled: contextMenu.entry.capabilities?.copy === false },
        { id: "move", label: t("move"), disabled: contextMenu.entry.capabilities?.move === false },
        { id: "delete", label: t("remove"), disabled: contextMenu.entry.capabilities?.delete === false, danger: true },
        ...pluginActions.filter(action => action.slot === "context").map(action => ({ id: `plugin:${action.plugin}:${action.id}`, label: pluginLabel(action, language), disabled: !pluginActionAvailable(action, contextMenu.entry) })),
      ] : []),
    ]}/>}
    <div className="sf-sr-only" aria-live="polite">{selectedEntries.length > 0 ? `${selectedEntries.length} ${t("selectedCount")}` : notice}</div>
  </main>;
}

const isTextPreviewMime = (mime: string | null) => Boolean(mime && (mime.startsWith("text/") || ["application/json", "application/ld+json", "application/xml", "application/x-yaml", "application/yaml"].includes(mime) || mime.endsWith("+json") || mime.endsWith("+xml")));
