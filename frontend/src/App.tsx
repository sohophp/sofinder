import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Api, ApiError } from "./api";
import { loadMessages, translator, type Language, type Messages } from "./i18n";
import type { AssetMetadata, AssetReference, Entry, ImageCapabilities, ImageInfo, ImagePreset, MetadataState, PluginDescriptor, PluginUiAction, QuickAccessEntry, ResourceType, SoFinderConfig, UiScale, UploadConflictStrategy } from "./types";
import { ConfirmDialog, TextDialog, UploadConflictDialog } from "./components/Dialogs";
import { Modal } from "./components/Modal";
import { EntryIcon as Icon, ThumbnailImage } from "./components/EntryVisuals";
import { formatSize } from "./format";
import type { EntrySize, FeaturePreferences, FolderTreePlacement, ListColumnName, ListColumnPreferences, ListColumnWidths, QuickAccessScope, ToolPreferences, ViewSizePreferences } from "./components/SettingsDialog";
import { UiIcon, type UiIconName } from "./components/UiIcon";
import { SortMenu } from "./components/SortMenu";
import { ViewMenu } from "./components/ViewMenu";
import { SidebarSectionFrame, loadSidebarLayout, storeSidebarLayout, type SidebarLayout, type SidebarSectionId, type SidebarSide } from "./components/SidebarSectionFrame";
import { entryNameIssue } from "./nameValidation";
import { clampListColumnWidth, clampPageSize, columnLimits, defaultFeatures, defaultFeatureAvailability, defaultListColumns, defaultTools, defaultViewSizes, listColumnLimits, loadColumnWidth, loadFolderTreePlacement, loadListColumnWidths, loadPreferences, loadQuickAccessScope, loadScale, loadToolPreferences, loadUploadConflictStrategy, loadViewSizes, pageSizeLimits } from "./preferences";
import { useEntrySelection } from "./hooks/useEntrySelection";
import { useBrowserState, type SortMode, type ViewMode } from "./hooks/useBrowserState";
import { useBatchState } from "./hooks/useBatchState";
import { useUploads } from "./hooks/useUploads";
import { pluginActionAvailable, pluginLabel, previewerFor, previewerUrl } from "./pluginUi";
import { filterEntries, groupEntries, type EntryGroupMode, type EntryTypeFilter } from "./entryPresentation";

const ImageEditor = lazy(() => import("./components/ImageEditor").then(module => ({ default: module.ImageEditor })));
const ImageProcessDialog = lazy(() => import("./components/ImageProcessDialog").then(module => ({ default: module.ImageProcessDialog })));
const SecurityStatusDialog = lazy(() => import("./components/SecurityStatusDialog").then(module => ({ default: module.SecurityStatusDialog })));
const DocumentPreviewPane = lazy(() => import("./components/DocumentPreviewPane"));
const SettingsDialog = lazy(() => import("./components/SettingsDialog").then(module => ({ default: module.SettingsDialog })));
const DestinationDialog = lazy(() => import("./components/DestinationDialog").then(module => ({ default: module.DestinationDialog })));
const BulkRenameDialog = lazy(() => import("./components/BulkRenameDialog").then(module => ({ default: module.BulkRenameDialog })));
const TrashDialog = lazy(() => import("./components/TrashDialog").then(module => ({ default: module.TrashDialog })));
const TagsDialog = lazy(() => import("./components/TagsDialog").then(module => ({ default: module.TagsDialog })));
const FolderTree = lazy(() => import("./components/FolderTree").then(module => ({ default: module.FolderTree })));
const DetailsPanel = lazy(() => import("./components/DetailsPanel").then(module => ({ default: module.DetailsPanel })));
const ShareDialog = lazy(() => import("./components/ShareDialog"));
const FavoritesPage = lazy(() => import("./components/FavoritesPage"));
const QuickAccessPanel = lazy(() => import("./components/MetadataSidebarPanels").then(module => ({ default: module.QuickAccessPanel })));
const FavoritesPanel = lazy(() => import("./components/MetadataSidebarPanels").then(module => ({ default: module.FavoritesPanel })));
const RecentPanel = lazy(() => import("./components/MetadataSidebarPanels").then(module => ({ default: module.RecentPanel })));
const ContextMenu = lazy(() => import("./components/ContextMenu").then(module => ({ default: module.ContextMenu })));
const UploadQueue = lazy(() => import("./components/UploadQueue").then(module => ({ default: module.UploadQueue })));
const ImagePreviewPane = lazy(() => import("./components/ImagePreviewPane"));
const AssetMetadataDialog = lazy(() => import("./components/AssetMetadataDialog").then(module => ({ default: module.AssetMetadataDialog })));
const AssetSearchDialog = lazy(() => import("./components/AssetSearchDialog").then(module => ({ default: module.AssetSearchDialog })));

interface TextDialogState { kind: "folder" | "rename" | "resize"; title: string; label: string; initial: string; maximum: number; extension?: string }
interface ConfirmState { title: string; message: string; detail?: string; danger?: boolean }
const savedGroupMode = (): EntryGroupMode => { const value = localStorage.getItem("sofinder.groupMode.v1"); return value === "name" || value === "type" || value === "size" || value === "modified" || value === "tags" ? value : "none"; };
const savedTypeFilter = (): EntryTypeFilter => { const value = localStorage.getItem("sofinder.typeFilter.v1"); return value === "folder" || value === "image" || value === "document" || value === "audio" || value === "video" || value === "archive" || value === "other" ? value : "all"; };
const savedDetailsPane = (): boolean => localStorage.getItem("sofinder.detailsPane.v1") !== "hidden";

export default function App({ config, initialMessages }: { config: SoFinderConfig; initialMessages: Messages }) {
  const pageSizeOptionsId = useId();
  const api = useMemo(() => new Api(config), [config]);
  const uiMode = config.uiDefaults.mode ?? (config.selectMode ? "picker" : "manager");
  const featureAvailability = config.featureAvailability ?? defaultFeatureAvailability;
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("sofinder.language");
    return saved === "en" || saved === "zh-cn" || saved === "zh-tw" ? saved : config.language;
  });
  const [messages, setMessages] = useState(initialMessages);
  const t = useMemo(() => translator(messages), [messages]);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }), [language]);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const { resource, setResource, path, setPath, resolvedPath, setResolvedPath, entries, setEntries, search, setSearch, searchMode, setSearchMode, sort, setSort, direction, setDirection, offset, setOffset, total, setTotal, pageCursor, setPageCursor, nextCursor, setNextCursor, cursorHistory, setCursorHistory, pageSize, setPageSize, pageSizeDraft, setPageSizeDraft, pageSizeRef, view, setView, loading, setLoading, notice, setNotice, directoryCapabilities, setDirectoryCapabilities, loadSequence, historyReady, restoringHistory, searchInitialized } = useBrowserState(config.resource, config.initialPath || "");
  const [metadata, setMetadata] = useState<MetadataState>({ favorites: [], quickAccess: [], quickAccessEntries: [], tags: {}, recent: [] });
  const [quickAccessByResource, setQuickAccessByResource] = useState<Record<string, QuickAccessEntry[]>>({});
  const [collectionView, setCollectionView] = useState<"favorites" | null>(() => new URL(window.location.href).searchParams.get("collection") === "favorites" ? "favorites" : null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [tools, setTools] = useState<ToolPreferences>(() => config.uiDefaults.fullTools ? { resize: true, crop: true, rotate: true, presets: true, process: true, batchRename: true } : loadToolPreferences());
  const [features, setFeatures] = useState<FeaturePreferences>(() => {
    const loaded = loadPreferences("sofinder.features.v2", { ...defaultFeatures, folderTree: config.featureDefaults?.folderTree ?? false });
    return {
      ...loaded,
      folderTree: featureAvailability.folderTree !== false && loaded.folderTree,
      recent: featureAvailability.recent !== false && loaded.recent,
      favorites: featureAvailability.favorites !== false && loaded.favorites,
      quickAccessFiles: false,
      tags: featureAvailability.tags !== false && loaded.tags,
      archive: featureAvailability.archive !== false && loaded.archive,
      trash: featureAvailability.trash !== false && loaded.trash,
      qrCode: featureAvailability.qrCode !== false && loaded.qrCode,
    };
  });
  const [listColumns, setListColumns] = useState<ListColumnPreferences>(() => loadPreferences("sofinder.listColumns.v1", defaultListColumns));
  const [listColumnWidths, setListColumnWidths] = useState<ListColumnWidths>(loadListColumnWidths);
  const [viewSizes, setViewSizes] = useState<ViewSizePreferences>(loadViewSizes);
  const [sidebarLayout, setSidebarLayout] = useState<SidebarLayout>(() => loadSidebarLayout(loadFolderTreePlacement()));
  const [draggedSidebarSection, setDraggedSidebarSection] = useState<SidebarSectionId | null>(null);
  const folderTreePlacement: FolderTreePlacement = sidebarLayout.right.includes("folderNavigation") ? "right" : "left";
  const [detailsPaneVisible, setDetailsPaneVisible] = useState(savedDetailsPane);
  const [quickAccessScope, setQuickAccessScope] = useState<QuickAccessScope>(loadQuickAccessScope);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [securityStatusOpen, setSecurityStatusOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const [selectionMenuOpen, setSelectionMenuOpen] = useState(false);
  const [selectionMenuPosition, setSelectionMenuPosition] = useState({ left: 0, top: 0 });
  const [groupMode, setGroupMode] = useState<EntryGroupMode>(savedGroupMode);
  const [typeFilter, setTypeFilter] = useState<EntryTypeFilter>(savedTypeFilter);
  const [uiScale, setUiScale] = useState<UiScale>(() => loadScale(config.uiDefaults?.scale ?? "standard"));
  const [uploadConflictStrategy, setUploadConflictStrategy] = useState<UploadConflictStrategy>(() => loadUploadConflictStrategy(config.uiDefaults.uploadConflictStrategy ?? "ask"));
  const lowercaseUploadExtensions = config.uiDefaults.lowercaseUploadExtensions ?? true;
  const { destinationDialog, setDestinationDialog, bulkRenameOpen, setBulkRenameOpen } = useBatchState();
  const [cropOpen, setCropOpen] = useState(false);
  const [imageEditorVersion, setImageEditorVersion] = useState(0);
  const [imageProcessOpen, setImageProcessOpen] = useState(false);
  const [textDialog, setTextDialog] = useState<TextDialogState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState | null>(null);
  const [uploadConflictFile, setUploadConflictFile] = useState<string | null>(null);
  const [trashOpen, setTrashOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; entry: Entry } | null>(null);
  const [sidebarMenu, setSidebarMenu] = useState<{ x: number; y: number; link: { resource: string; path: string }; favorite?: boolean } | null>(null);
  const [previewEntry, setPreviewEntry] = useState<Entry | null>(null);
  const [textPreview, setTextPreview] = useState<{ path: string; content: string; truncated: boolean } | null>(null);
  const [checksum, setChecksum] = useState<{ path: string; value: string } | null>(null);
  const [shareDialog, setShareDialog] = useState<{ url: string; fileName: string; loginRequired: boolean; expiresAt?: number } | null>(null);
  const [imagePresets, setImagePresets] = useState<Record<string, ImagePreset>>({});
  const [imageCapabilities, setImageCapabilities] = useState<ImageCapabilities>({ driver: "", formats: [] });
  const [plugins, setPlugins] = useState<PluginDescriptor[]>([]);
  const [signedUrls, setSignedUrls] = useState({ enabled: false, defaultTtlSeconds: 300, maxTtlSeconds: 3600 });
  const [assetCatalogEnabled, setAssetCatalogEnabled] = useState(false);
  const [assetAltLocales, setAssetAltLocales] = useState(["en", "zh-cn", "zh-tw"]);
  const [assetSearchEnabled, setAssetSearchEnabled] = useState(false);
  const [assetUsageEnabled, setAssetUsageEnabled] = useState(false);
  const [assetSearchOpen, setAssetSearchOpen] = useState(() => new URL(window.location.href).searchParams.has("asset_q"));
  const [assetMetadataDialog, setAssetMetadataDialog] = useState<{ asset: AssetReference; metadata: AssetMetadata } | null>(null);
  const [leftWidth, setLeftWidth] = useState(() => loadColumnWidth("left"));
  const [rightWidth, setRightWidth] = useState(() => loadColumnWidth("right"));
  const confirmResolver = useRef<((answer: boolean) => void) | null>(null);
  const uploadConflictResolver = useRef<((strategy: Exclude<UploadConflictStrategy, "ask">) => void) | null>(null);
  const longPress = useRef<number | null>(null);
  const columnDrag = useRef<{ side: "left" | "right"; startX: number; startWidth: number; currentWidth: number; element: HTMLDivElement } | null>(null);
  const listColumnDrag = useRef<{ column: ListColumnName; startX: number; startWidth: number; currentWidth: number; element: HTMLDivElement } | null>(null);
  const entriesList = useRef<HTMLDivElement>(null);
  const utility = useRef<HTMLDivElement>(null);
  const utilityButton = useRef<HTMLButtonElement>(null);
  const selectionMenu = useRef<HTMLDivElement>(null);
  const selectionMenuPopup = useRef<HTMLDivElement>(null);
  const activeResource = useRef(resource);
  const metadataSequence = useRef<Record<string, number>>({});
  const metadataMutations = useRef<Record<string, number>>({});
  const metadataChannel = useRef<BroadcastChannel | null>(null);

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
    let active = true;
    void loadMessages(language).then(value => { if (active) setMessages(value); });
    return () => { active = false; };
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

  useEffect(() => {
    if (!selectionMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !selectionMenu.current?.contains(event.target) && !selectionMenuPopup.current?.contains(event.target)) setSelectionMenuOpen(false);
    };
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setSelectionMenuOpen(false);
      selectionMenu.current?.querySelector<HTMLButtonElement>(":scope > button")?.focus();
    };
    const closeOnViewportChange = () => setSelectionMenuOpen(false);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithKeyboard);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithKeyboard);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [selectionMenuOpen]);

  const toggleSelectionMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectionMenuOpen) { setSelectionMenuOpen(false); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const width = 180;
    setSelectionMenuPosition({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: rect.bottom + 7,
    });
    setSelectionMenuOpen(true);
  };

  const report = useCallback((error: unknown) => setNotice(error instanceof Error ? error.message : t("error")), [t]);
  const applyMetadata = useCallback((targetResource: string, value: MetadataState, sequence: number) => {
    if ((metadataSequence.current[targetResource] || 0) !== sequence) return false;
    if (activeResource.current === targetResource) setMetadata(value);
    setQuickAccessByResource(current => ({ ...current, [targetResource]: value.quickAccessEntries }));
    return true;
  }, []);
  const fetchMetadata = useCallback(async (targetResource: string, force = false) => {
    if (!targetResource || (!force && (metadataMutations.current[targetResource] || 0) > 0)) return null;
    const sequence = (metadataSequence.current[targetResource] || 0) + 1;
    metadataSequence.current[targetResource] = sequence;
    const value = await api.metadata(targetResource);
    applyMetadata(targetResource, value, sequence);
    return value;
  }, [api, applyMetadata]);
  const mutateMetadata = useCallback(async (targetResource: string, targetPath: string, action: "favorite" | "quick_access" | "tags" | "touch" | "forget", values: { favorite?: boolean; pinned?: boolean; tags?: string[] } = {}) => {
    const sequence = (metadataSequence.current[targetResource] || 0) + 1;
    metadataSequence.current[targetResource] = sequence;
    metadataMutations.current[targetResource] = (metadataMutations.current[targetResource] || 0) + 1;
    try {
      const value = await api.updateMetadata(targetResource, targetPath, action, values);
      applyMetadata(targetResource, value, sequence);
      metadataChannel.current?.postMessage({ resource: targetResource });
      return value;
    } finally {
      metadataMutations.current[targetResource] = Math.max(0, (metadataMutations.current[targetResource] || 1) - 1);
      if (metadataMutations.current[targetResource] === 0 && (metadataSequence.current[targetResource] || 0) !== sequence) void fetchMetadata(targetResource, true).catch(report);
    }
  }, [api, applyMetadata, fetchMetadata, report]);

  useEffect(() => { activeResource.current = resource; }, [resource]);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return;
    let channel: BroadcastChannel;
    try {
      channel = new BroadcastChannel("sofinder-metadata-v1");
    } catch {
      return;
    }
    metadataChannel.current = channel;
    channel.onmessage = event => {
      const targetResource = typeof event.data?.resource === "string" ? event.data.resource : "";
      if (targetResource) void fetchMetadata(targetResource).catch(report);
    };
    return () => { metadataChannel.current = null; channel.close(); };
  }, [fetchMetadata, report]);
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
    if (!nextResource) return "error" as const;
    const sequence = ++loadSequence.current;
    setLoading(true);
    setNotice("");
    try {
      const result = await api.list(nextResource, nextPath, term, nextSort, nextDirection, nextOffset, pageSizeRef.current, nextSearchMode, cursor);
      if (sequence !== loadSequence.current) return "stale" as const;
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
      return "ok" as const;
    } catch (error) {
      if (sequence !== loadSequence.current) return "stale" as const;
      if (error instanceof ApiError && error.code === "not_found" && nextPath !== "") {
        try {
          const fallback = await api.list(nextResource, "", "", nextSort, nextDirection, 0, pageSizeRef.current, "name", null);
          if (sequence !== loadSequence.current) return "stale" as const;
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
          return "not_found" as const;
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
      return "error" as const;
    } finally {
      if (sequence === loadSequence.current) setLoading(false);
    }
  }, [api, direction, offset, pageCursor, path, report, resource, search, searchMode, sort, t]);

  const currentResource = resources.find(item => item.name === resource);
  const currentDepth = path === "" ? 0 : path.split("/").length;
  const { uploads, uploadsCollapsed, setUploadsCollapsed, uploadInput, directoryUploadInput, upload, uploadTo, uploadDirectory, cancelUpload, cancelAllUploads, removeUploadTask, retryUpload, clearFinishedUploads } = useUploads({
    api, resource, path, currentResource, currentDepth, autoCollapse: features.autoCollapseUploads, conflictStrategy: uploadConflictStrategy, lowercaseExtensions: lowercaseUploadExtensions, t, ask, chooseConflict: chooseUploadConflict, reload: async () => { await load(); }, setNotice, report,
  });

  useEffect(() => {
    api.configData().then(({ resources: available, plugins: activePlugins, imagePresets: presets, imageCapabilities: capabilities, signedUrls: signedUrlCapabilities, assetCatalog, assetSearch, assetUsage }) => {
      setResources(available);
      setPlugins(activePlugins || []);
      setAssetCatalogEnabled(assetCatalog?.enabled === true);
      setAssetAltLocales(assetCatalog?.altLocales?.length ? assetCatalog.altLocales : ["en", "zh-cn", "zh-tw"]);
      setAssetSearchEnabled(assetSearch?.enabled === true);
      setAssetUsageEnabled(assetUsage?.enabled === true);
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
      const nextCollection = url.searchParams.get("collection") === "favorites" ? "favorites" : null;
      restoringHistory.current = true;
      setResource(nextResource);
      setCollectionView(nextCollection);
      setSearch("");
      setSearchMode("name");
      setCursorHistory([]);
      if (nextCollection === null) void load(nextResource, nextPath, "", 0, "name", "asc", "name", null);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [config.resource, load]);

  useEffect(() => {
    if (!resource || loading) return;
    const url = new URL(window.location.href);
    const currentResource = url.searchParams.get("type") || "";
    const currentPath = url.searchParams.get("path") || "";
    const currentCollection = url.searchParams.get("collection") === "favorites" ? "favorites" : null;
    if (currentResource === resource && currentPath === path && currentCollection === collectionView) {
      historyReady.current = true;
      restoringHistory.current = false;
      return;
    }
    url.searchParams.set("type", resource);
    if (path) url.searchParams.set("path", path); else url.searchParams.delete("path");
    if (collectionView) url.searchParams.set("collection", collectionView); else url.searchParams.delete("collection");
    const state = { ...(window.history.state || {}), sofinder: { resource, path, collection: collectionView } };
    if (!historyReady.current || restoringHistory.current) window.history.replaceState(state, "", url);
    else window.history.pushState(state, "", url);
    historyReady.current = true;
    restoringHistory.current = false;
  }, [collectionView, loading, path, resource]);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }
    if (collectionView) return;
    const timer = window.setTimeout(() => { if (resource) { setCursorHistory([]); void load(resource, path, search, 0, sort, direction, searchMode, null); } }, 250);
    return () => window.clearTimeout(timer);
  }, [search, searchMode]);

  useEffect(() => {
    if (!resource) return;
    if (!features.recent && !features.favorites && featureAvailability.quickAccess === false && !features.tags) {
      setMetadata({ favorites: [], quickAccess: [], quickAccessEntries: [], tags: {}, recent: [] });
      return;
    }
    void fetchMetadata(resource).catch(report);
  }, [featureAvailability.quickAccess, features.favorites, features.recent, features.tags, fetchMetadata, report, resource]);

  useEffect(() => {
    if (featureAvailability.quickAccess === false || !features.sidebarQuickAccess || quickAccessScope !== "all") return;
    void Promise.all(resources.filter(item => item.name !== resource).map(item => fetchMetadata(item.name))).catch(report);
  }, [featureAvailability.quickAccess, features.sidebarQuickAccess, fetchMetadata, quickAccessScope, report, resource, resources]);

  useEffect(() => {
    if (featureAvailability.quickAccess === false || !features.sidebarQuickAccess) return;
    const refresh = () => Object.entries(quickAccessByResource).forEach(([targetResource, links]) => {
      if (links.length > 0) void fetchMetadata(targetResource).catch(report);
    });
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [featureAvailability.quickAccess, features.sidebarQuickAccess, fetchMetadata, quickAccessByResource, report]);

  useEffect(() => {
    if (!features.favorites && collectionView === "favorites") setCollectionView(null);
  }, [collectionView, features.favorites]);

  useEffect(() => {
    const paste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files || []);
      if (files.length > 0 && collectionView === null && !currentResource?.readOnly && directoryCapabilities.upload !== false) {
        event.preventDefault();
        void upload(files);
      }
    };
    window.addEventListener("paste", paste);
    return () => window.removeEventListener("paste", paste);
  }, [collectionView, currentResource?.readOnly, directoryCapabilities.upload, upload]);

  const crumbs = useMemo(() => path === "" ? [] : path.split("/"), [path]);
  const touchRecent = useCallback((entry: Entry) => {
    if (features.recent) void mutateMetadata(resource, entry.path, "touch").catch(report);
  }, [features.recent, mutateMetadata, report, resource]);
  const filteredEntries = useMemo(() => filterEntries(entries, typeFilter), [entries, typeFilter]);
  const presentationGroupMode: EntryGroupMode = groupMode === "tags" && !features.tags ? "none" : groupMode;
  const entryGroups = useMemo(() => groupEntries(filteredEntries, presentationGroupMode, metadata.tags), [filteredEntries, presentationGroupMode, metadata.tags]);
  const displayedEntries = useMemo(() => entryGroups.flatMap(group => group.entries), [entryGroups]);
  const { selectedPaths, setSelectedPaths, selectionAnchor, setSelectionAnchor, selectedEntries, selected, selectEntry } = useEntrySelection(displayedEntries, uiMode === "picker", touchRecent);
  const imageCapability = (entry: Entry) => imageCapabilities.formats.find(format => entry.mimeType !== null && format.mimes.includes(entry.mimeType.toLowerCase()));
  const canPreviewImage = (entry: Entry | null) => Boolean(entry && imageCapability(entry)?.thumbnail);
  const canEditImage = (entry: Entry | null) => Boolean(entry && imageCapability(entry)?.edit);
  const editableSelectedImages = selectedEntries.filter(entry => canEditImage(entry));
  const canChooseEntry = (entry: Entry | null) => Boolean(entry && !entry.directory && entry.url && (config.selectionKind !== "image" || imageCapability(entry)?.webEmbeddable));
  const resolveEntryUrl = async (entry: Entry): Promise<{ url: string; loginRequired: boolean; expiresAt?: number } | null> => {
    if (entry.directory) return null;
    if (currentResource?.entryUrlConfigured && entry.url) {
      return { url: new URL(entry.url, document.baseURI).href, loginRequired: true };
    }
    if (signedUrls.enabled && currentResource?.deliveryMode === "proxy") {
      const result = await api.signedUrl(resource, entry.path, signedUrls.defaultTtlSeconds);
      return { url: result.url, loginRequired: false, expiresAt: result.expiresAt };
    }
    return {
      url: new URL(entry.url || api.downloadUrl(resource, entry.path), document.baseURI).href,
      loginRequired: !entry.url,
    };
  };
  const openShare = async (entry: Entry) => {
    try { const value = await resolveEntryUrl(entry); if (value) setShareDialog({ ...value, fileName: entry.name }); }
    catch (error) { report(error); }
  };
  const openAssetMetadata = async (entry: Entry) => {
    try {
      const resolved = await api.resolveAsset(resource, entry.path);
      if (!resolved.asset.assetId) return;
      setAssetMetadataDialog(await api.asset(resolved.asset.assetId));
    } catch (error) { report(error); }
  };
  const canSelected = (operation: string) => selectedEntries.length > 0 && selectedEntries.every(entry => entry.capabilities?.[operation] !== false);
  const canFavorite = (entry: Entry | null): entry is Entry => Boolean(entry && !entry.directory);
  const canQuickAccess = (entry: Entry | null): entry is Entry => Boolean(entry?.directory);
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
    if (selectedEntries.length === 0) return;
    let usageDetail = "";
    if (assetUsageEnabled) {
      try {
        const check = await api.checkAssetDeletion(resource, selectedEntries.map(entry => entry.path));
        if (check.complete === false) usageDetail = t("assetDeleteCheckIncomplete");
        else if (!check.safe) usageDetail = `${t("assetUsedWarning").replace("{count}", String(check.total))} ${check.assets.flatMap(asset => asset.usages.slice(0, 3).map(usage => usage.label)).slice(0, 3).join("、")}`;
      } catch (error) { report(error); return; }
    }
    const retentionDetail = currentResource?.storageCapabilities?.recoverableDelete === false ? t("permanentDeleteWarning") : t("trashRetention");
    if (!await ask({ title: t("remove"), message: selectedEntries.length === 1 ? t("confirmDelete") : `${t("confirmDeleteMany")} ${selectedEntries.length}`, detail: usageDetail ? `${usageDetail}\n${retentionDetail}` : retentionDetail, danger: true })) return;
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
    let pickerEntry = { ...entry, resource, url: entry.url, width: dimensions?.width ?? null, height: dimensions?.height ?? null };
    if (assetCatalogEnabled) {
      try { pickerEntry = { ...pickerEntry, ...(await api.resolveAsset(resource, entry.path)).asset }; }
      catch { /* The legacy picker result remains usable if optional asset metadata is unavailable. */ }
    }
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

  const selectAll = () => {
    setSelectedPaths(new Set(displayedEntries.map(entry => entry.path)));
    setSelectionAnchor(null);
  };
  const clearSelection = () => { setSelectedPaths(new Set()); setSelectionAnchor(null); };
  const invertSelection = () => {
    setSelectedPaths(current => new Set(displayedEntries.filter(entry => !current.has(entry.path)).map(entry => entry.path)));
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
    setImageEditorVersion(Date.now());
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
    if (name !== "autoCollapseUploads" && name !== "sidebarFavorites" && name !== "sidebarQuickAccess" && featureAvailability[name] === false) return;
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
  const commitSidebarLayout = (change: (current: SidebarLayout) => SidebarLayout) => {
    setSidebarLayout(current => {
      const next = change(current);
      storeSidebarLayout(next);
      localStorage.setItem("sofinder.folderNavigation.position.v1", next.right.includes("folderNavigation") ? "right" : "left");
      return next;
    });
  };
  const moveSidebarSection = (id: SidebarSectionId, side: SidebarSide, target: SidebarSectionId | null = null, after = true) => {
    commitSidebarLayout(current => {
      const next: SidebarLayout = { left: current.left.filter(item => item !== id), right: current.right.filter(item => item !== id) };
      const targetIndex = target === null ? -1 : next[side].indexOf(target);
      const index = targetIndex < 0 ? next[side].length : targetIndex + (after ? 1 : 0);
      next[side].splice(index, 0, id);
      return next;
    });
  };
  const moveSidebarSectionWithKeyboard = (id: SidebarSectionId, key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Home" | "End") => {
    commitSidebarLayout(current => {
      const sourceSide: SidebarSide = current.right.includes(id) ? "right" : "left";
      if (key === "ArrowLeft" || key === "ArrowRight") {
        const destination: SidebarSide = key === "ArrowLeft" ? "left" : "right";
        if (destination === sourceSide) return current;
        const next: SidebarLayout = { left: current.left.filter(item => item !== id), right: current.right.filter(item => item !== id) };
        next[destination].push(id);
        return next;
      }
      const list = [...current[sourceSide]];
      const index = list.indexOf(id);
      const destination = key === "Home" ? 0 : key === "End" ? list.length - 1 : key === "ArrowUp" ? Math.max(0, index - 1) : Math.min(list.length - 1, index + 1);
      if (index < 0 || destination === index) return current;
      list.splice(index, 1);
      list.splice(destination, 0, id);
      return { ...current, [sourceSide]: list };
    });
  };
  const updateFolderTreePlacement = (placement: FolderTreePlacement) => {
    moveSidebarSection("folderNavigation", placement);
  };
  const updateDetailsPane = (visible: boolean) => {
    setDetailsPaneVisible(visible);
    localStorage.setItem("sofinder.detailsPane.v1", visible ? "visible" : "hidden");
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

  const toggleFavorite = async (entry = selected) => {
    if (!canFavorite(entry)) return;
    try {
      await mutateMetadata(resource, entry.path, "favorite", { favorite: !metadata.favorites.includes(entry.path) });
    } catch (error) { report(error); }
  };

  const toggleQuickAccess = async (entry = selected) => {
    if (!canQuickAccess(entry)) return;
    try {
      await mutateMetadata(resource, entry.path, "quick_access", { pinned: !metadata.quickAccess.includes(entry.path) });
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
        await mutateMetadata(resource, recentPath, "forget");
        setNotice(t("recentMissing"));
        return;
      }
      await load(resource, directory, "", 0);
      setSelectedPaths(new Set([recentPath]));
    } catch (error) {
      if (error instanceof ApiError && error.code === "not_found") {
        try { await mutateMetadata(resource, recentPath, "forget"); }
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
    else if (command === "favorite" && target) void toggleFavorite(target);
    else if (command === "quick-access" && target) void toggleQuickAccess(target);
    else if (command === "download" && target && !target.directory) window.open(target.url || api.downloadUrl(resource, target.path), "_blank", "noopener,noreferrer");
    else if (command === "share" && target && !target.directory) void openShare(target);
    else if (command === "asset-metadata" && target && !target.directory) void openAssetMetadata(target);
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

  const setListColumnWidth = (column: ListColumnName, value: number, persist = false) => {
    const width = clampListColumnWidth(column, value);
    setListColumnWidths(current => {
      const next = { ...current, [column]: width };
      if (persist) localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(next));
      return next;
    });
  };
  const beginListColumnResize = (column: ListColumnName, event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-resizing");
    const startWidth = listColumnWidths[column];
    listColumnDrag.current = { column, startX: event.clientX, startWidth, currentWidth: startWidth, element: event.currentTarget };
  };
  const moveListColumnResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const active = listColumnDrag.current;
    if (!active) return;
    active.currentWidth = clampListColumnWidth(active.column, active.startWidth + event.clientX - active.startX);
    setListColumnWidth(active.column, active.currentWidth);
  };
  const endListColumnResize = () => {
    const active = listColumnDrag.current;
    listColumnDrag.current = null;
    if (!active) return;
    active.element.classList.remove("is-resizing");
    setListColumnWidth(active.column, active.currentWidth, true);
  };
  const resizeListColumnWithKeyboard = (column: ListColumnName, event: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    if (direction === 0) return;
    event.preventDefault();
    event.stopPropagation();
    setListColumnWidth(column, listColumnWidths[column] + direction * 10, true);
  };
  const autoFitListColumn = (column: ListColumnName) => {
    const root = entriesList.current;
    if (!root) return;
    const selector = column === "name" ? ".sf-entry-name" : column === "size" ? ".sf-entry-size" : column === "type" ? ".sf-entry-type" : ".sf-entry-modified";
    const cells = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const heading = root.querySelector<HTMLElement>(`.sf-list-heading-${column} button`);
    const contentWidth = (element: HTMLElement | null) => {
      if (!element) return 0;
      const range = document.createRange();
      range.selectNodeContents(element);
      return Math.ceil(range.getBoundingClientRect().width);
    };
    const desired = Math.max(contentWidth(heading), ...cells.map(contentWidth)) + 24;
    setListColumnWidth(column, desired, true);
  };

  const resetPreferences = () => {
    const resetTools = config.uiDefaults.fullTools ? { resize: true, crop: true, rotate: true, presets: true, process: true, batchRename: true } : defaultTools;
    (Object.keys(resetTools) as Array<keyof ToolPreferences>).forEach(name => updateTool(name, resetTools[name]));
    const resetFeatures = { ...defaultFeatures, folderTree: config.featureDefaults?.folderTree ?? false };
    (Object.keys(resetFeatures) as Array<keyof FeaturePreferences>).forEach(name => updateFeature(name, resetFeatures[name]));
    (Object.keys(defaultListColumns) as Array<keyof ListColumnPreferences>).forEach(name => updateListColumn(name, defaultListColumns[name]));
    (Object.keys(defaultViewSizes) as Array<keyof ViewSizePreferences>).forEach(name => updateViewSize(name, defaultViewSizes[name]));
    const widths = Object.fromEntries((Object.keys(listColumnLimits) as ListColumnName[]).map(name => [name, listColumnLimits[name].initial])) as unknown as ListColumnWidths;
    setListColumnWidths(widths); localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(widths));
    setColumnWidth("left", columnLimits.left.initial, true); setColumnWidth("right", columnLimits.right.initial, true);
    const defaultSidebarLayout: SidebarLayout = { left: ["folderNavigation", "quickAccess", "favorites", "recent"], right: [] };
    setSidebarLayout(defaultSidebarLayout); storeSidebarLayout(defaultSidebarLayout); localStorage.setItem("sofinder.folderNavigation.position.v1", "left");
    updateDetailsPane(true); setQuickAccessScope("all"); localStorage.setItem("sofinder.quickAccess.scope.v1", "all");
    setUiScale(config.uiDefaults.scale ?? "standard"); setUploadConflictStrategy(config.uiDefaults.uploadConflictStrategy ?? "ask");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const isEntry = target.matches("button.sf-entry");
    if (target.isContentEditable || (["INPUT", "SELECT", "TEXTAREA", "BUTTON", "A"].includes(target.tagName) && !isEntry)) return;

    if (uiMode === "manager" && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      selectAll();
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
    if (delta !== 0 && displayedEntries.length > 0) {
      event.preventDefault();
      const activePath = selectionAnchor || selectedEntries[0]?.path;
      const activeIndex = activePath ? displayedEntries.findIndex(entry => entry.path === activePath) : (delta > 0 ? -1 : displayedEntries.length);
      const nextIndex = Math.max(0, Math.min(displayedEntries.length - 1, activeIndex + delta));
      const next = displayedEntries[nextIndex];
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
  const quickAccessEnabled = featureAvailability.quickAccess !== false;
  const hasQuickAccess = quickAccessScope === "resource" ? metadata.quickAccessEntries.length > 0 : Object.values(quickAccessByResource).some(items => items.length > 0);
  const sidebarSectionVisible = (id: SidebarSectionId) => id === "folderNavigation"
    ? features.folderTree && Boolean(resource)
    : id === "quickAccess"
      ? quickAccessEnabled && features.sidebarQuickAccess && hasQuickAccess
      : id === "favorites"
        ? features.favorites && features.sidebarFavorites
        : features.recent;
  const leftSidebarSections = sidebarLayout.left.filter(sidebarSectionVisible);
  const rightSidebarSections = sidebarLayout.right.filter(sidebarSectionVisible);
  const showSidebar = resources.length > 1 || leftSidebarSections.length > 0 || Boolean(currentResource?.readOnly || currentResource?.quotaBytes) || draggedSidebarSection !== null;
  const recentPanel = (variant: "sidebar" | "mobile") => features.recent ? <Suspense fallback={null}><RecentPanel variant={variant} items={metadata.recent} labels={{ title: t("recent"), empty: t("recentEmpty"), home: t("home") }} onOpen={item => void openRecent(item)}/></Suspense> : null;
  const detailsPaneAvailable = uiMode === "manager" || fullTools;
  const showDetails = detailsPaneVisible && detailsPaneAvailable && selectedEntries.length > 0;
  const showRightPanel = showDetails || rightSidebarSections.length > 0 || draggedSidebarSection !== null;
  const iconButton = (name: UiIconName, label: string) => <><UiIcon name={name}/><span>{label}</span></>;
  const resetAndLoad = (nextResource: string, nextPath: string, term = search) => {
    setCollectionView(null);
    setCursorHistory([]);
    void load(nextResource, nextPath, term, 0, sort, direction, searchMode, null);
  };
  const openAssetSearchResult = async (nextResource: string, targetPath: string) => {
    const parent = targetPath.includes("/") ? targetPath.slice(0, targetPath.lastIndexOf("/")) : "";
    setAssetSearchOpen(false); setSearch(""); setSearchMode("name"); setResource(nextResource); setPath(parent); setCursorHistory([]);
    await load(nextResource, parent, "", 0, sort, direction, "name", null);
    setSelectedPaths(new Set([targetPath])); setSelectionAnchor(targetPath);
  };
  const openFavorites = () => {
    setSelectedPaths(new Set());
    setSelectionAnchor(null);
    setSearch("");
    setSearchMode("name");
    setCollectionView("favorites");
  };
  const sidebarPath = async (targetResource: string, targetPath: string, kind: "favorite" | "quick_access", knownExists?: boolean) => {
    const parent = targetPath.includes("/") ? targetPath.slice(0, targetPath.lastIndexOf("/")) : "";
    const name = targetPath.split("/").pop() || targetPath;
    try {
      if (knownExists === false) throw new ApiError(t("quickAccessRemoved"), "not_found", 404);
      const result = await api.list(targetResource, parent, name, "name", "asc", 0, 500);
      const entry = result.entries.find(item => item.path === targetPath);
      if (!entry) throw new ApiError(t("favoriteMissing"), "not_found", 404);
      setCollectionView(null);
      setResource(targetResource);
      if (entry.directory) {
        setCursorHistory([]);
        const outcome = await load(targetResource, entry.path, "", 0, sort, direction, "name", null);
        if (outcome === "not_found") throw new ApiError(t("quickAccessRemoved"), "not_found", 404);
      }
      else { await load(targetResource, parent, "", 0); setSelectedPaths(new Set([entry.path])); }
    } catch (error) {
      if (error instanceof ApiError && error.code === "not_found") {
        try {
          await mutateMetadata(targetResource, targetPath, kind, kind === "favorite" ? { favorite: false } : { pinned: false });
        } catch (metadataError) {
          report(metadataError);
          return;
        }
        setNotice(t(kind === "favorite" ? "favoriteMissing" : "quickAccessRemoved"));
      } else report(error);
    }
  };
  const unpinQuickAccess = async (link: { resource: string; path: string }) => {
    try {
      await mutateMetadata(link.resource, link.path, "quick_access", { pinned: false });
    } catch (error) { report(error); }
  };
  const removeFavorite = async (targetPath: string) => {
    try { await mutateMetadata(resource, targetPath, "favorite", { favorite: false }); }
    catch (error) { report(error); }
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
  const changeSort = (nextSort: SortMode, toggleCurrent: boolean) => {
    const nextDirection = toggleCurrent && sort === nextSort ? (direction === "asc" ? "desc" : "asc") : "asc";
    setSort(nextSort);
    setDirection(nextDirection);
    setCursorHistory([]);
    void load(resource, path, search, 0, nextSort, nextDirection, searchMode, null);
  };
  const setSortDirection = (nextDirection: "asc" | "desc") => {
    if (nextDirection === direction) return;
    setDirection(nextDirection);
    setCursorHistory([]);
    void load(resource, path, search, 0, sort, nextDirection, searchMode, null);
  };
  const changeGroup = (value: EntryGroupMode) => {
    setGroupMode(value);
    localStorage.setItem("sofinder.groupMode.v1", value);
  };
  const visibleListColumns: ListColumnName[] = ["name", ...(listColumns.size ? ["size" as const] : []), ...(listColumns.type ? ["type" as const] : []), ...(listColumns.modified ? ["modified" as const] : [])];
  const listGridTemplate = `${visibleListColumns.map(column => `${listColumnWidths[column]}px`).join(" ")} minmax(0, 1fr)`;
  const columnLabel = (column: ListColumnName) => t(column === "modified" ? "modified" : column);
  const columnClass = (column: ListColumnName) => column === "name" ? "" : `sf-list-${column}`;
  const sortHeading = (mode: SortMode, label: string, className = "", resizable = false) => {
    const active = sort === mode;
    const directionLabel = t(direction === "asc" ? "ascending" : "descending");
    return <div key={mode} className={`sf-list-heading sf-list-heading-${mode}`}><button type="button" className={`${className}${active ? " active" : ""}`} disabled={currentResource?.storageCapabilities?.sort === false} aria-pressed={active} aria-label={active ? `${label}, ${directionLabel}` : label} onClick={() => changeSort(mode, true)}><span>{label}</span>{active && <UiIcon name={direction === "asc" ? "sort-asc" : "sort-desc"}/>}</button>{resizable && <div className="sf-list-column-resizer" role="separator" tabIndex={0} aria-label={`${t("resizeListColumn")}: ${label}`} title={t("autoFitListColumn")} aria-orientation="vertical" aria-valuemin={listColumnLimits[mode].min} aria-valuemax={listColumnLimits[mode].max} aria-valuenow={listColumnWidths[mode]} onPointerDown={event => beginListColumnResize(mode, event)} onPointerMove={moveListColumnResize} onPointerUp={endListColumnResize} onPointerCancel={endListColumnResize} onKeyDown={event => resizeListColumnWithKeyboard(mode, event)} onDoubleClick={event => { event.preventDefault(); event.stopPropagation(); autoFitListColumn(mode); }}/>}</div>;
  };
  const groupLabel = (label: string) => {
    const keys: Record<string, Parameters<typeof t>[0]> = { folder: "folder", image: "images", document: "documents", audio: "audio", video: "video", archive: "archives", other: "other", emptySize: "emptySize", smallFiles: "smallFiles", mediumFiles: "mediumFiles", largeFiles: "largeFiles", untagged: "untagged", today: "today", thisWeek: "thisWeek", thisMonth: "thisMonth", earlier: "earlier" };
    return keys[label] ? t(keys[label]) : label;
  };
  const metadataSidebarProps = {
    favorites: metadata.favorites,
    quickAccessByResource,
    resources,
    currentResource: resource,
    quickAccessScope,
    showFavorites: features.favorites && features.sidebarFavorites,
    showQuickAccess: quickAccessEnabled && features.sidebarQuickAccess && hasQuickAccess,
    favoritesActive: collectionView === "favorites",
    labels: { favorites: t("favorites"), favoritesEmpty: t("favoritesEmpty"), quickAccess: t("quickAccess"), quickAccessEmpty: t("quickAccessEmpty"), home: t("home"), more: t("moreItems"), missing: t("quickAccessMissing") },
    onOpenFavorites: openFavorites,
    onOpenFavorite: (item: string) => void sidebarPath(resource, item, "favorite"),
    onOpenQuickAccess: (link: { resource: string; path: string; exists: boolean }) => void sidebarPath(link.resource, link.path, "quick_access", link.exists),
    onQuickAccessContext: (link: { resource: string; path: string }, event: React.MouseEvent<HTMLButtonElement>) => { event.preventDefault(); setSidebarMenu({ x: event.clientX, y: event.clientY, link }); },
    onFavoriteContext: (item: string, event: React.MouseEvent<HTMLButtonElement>) => { event.preventDefault(); setSidebarMenu({ x: event.clientX, y: event.clientY, link: { resource, path: item }, favorite: true }); },
  };
  const sidebarSectionTitle = (id: SidebarSectionId) => id === "folderNavigation" ? t("folderNavigation") : id === "quickAccess" ? t("quickAccess") : id === "favorites" ? t("favorites") : t("recent");
  const renderSidebarSection = (id: SidebarSectionId, side: SidebarSide) => {
    const content = id === "folderNavigation"
      ? <section className={`sf-folder-navigation-section${side === "right" ? " sf-folder-navigation-right" : ""}`}><h2>{t("folderNavigation")}</h2><Suspense fallback={<div className="sf-state">{t("loading")}</div>}><FolderTree api={api} resource={resource} currentPath={resolvedPath} rootLabel={t("home")} onNavigate={next => resetAndLoad(resource, next, "")}/></Suspense></section>
      : id === "quickAccess"
        ? <Suspense fallback={null}><QuickAccessPanel {...metadataSidebarProps}/></Suspense>
        : id === "favorites"
          ? <Suspense fallback={null}><FavoritesPanel {...metadataSidebarProps}/></Suspense>
          : recentPanel("sidebar");
    return <SidebarSectionFrame key={id} id={id} side={side} title={`${t("moveSidebarSection")}: ${sidebarSectionTitle(id)}`} dragging={draggedSidebarSection === id} onDragStart={setDraggedSidebarSection} onDragEnd={() => setDraggedSidebarSection(null)} onDrop={(target, destination, after) => { if (draggedSidebarSection) moveSidebarSection(draggedSidebarSection, destination, target, after); setDraggedSidebarSection(null); }} onKeyboardMove={moveSidebarSectionWithKeyboard}>{content}</SidebarSectionFrame>;
  };
  const sidebarSections = (side: SidebarSide, sections: SidebarSectionId[]) => <div className={`sf-sidebar-sections sf-sidebar-sections-${side}${draggedSidebarSection ? " is-dragging" : ""}`} data-sidebar-dropzone={side} onDragOver={event => { if (draggedSidebarSection) { event.preventDefault(); event.stopPropagation(); } }} onDrop={event => { if (!draggedSidebarSection) return; event.preventDefault(); event.stopPropagation(); moveSidebarSection(draggedSidebarSection, side); setDraggedSidebarSection(null); }}>
    {sections.map(id => renderSidebarSection(id, side))}
    {draggedSidebarSection && <div className="sf-sidebar-drop-end" aria-hidden="true"/>}
  </div>;

  return <main className={`sf-app sf-mode-${uiMode}${showSidebar ? "" : " sf-no-sidebar"}${showRightPanel ? "" : " sf-no-details"}${(uiMode === "manager" || fullTools) && selectedEntries.length > 0 ? " sf-has-selection-actions" : ""}`} onKeyDown={handleKeyDown} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (collectionView === null && event.dataTransfer.files.length) void upload(event.dataTransfer.files); }}>
    <div className={`sf-commandbar ${hasLogo ? "sf-has-brand" : "sf-no-brand"}`}>
      {hasLogo ? <div className="sf-brand" title="SoFinder"><span className="sf-brand-mark" aria-hidden="true">S</span>{config.uiDefaults.header === true ? <strong>SoFinder</strong> : <span className="sf-sr-only">SoFinder</span>}</div> : <nav className="sf-breadcrumb sf-command-breadcrumb" aria-label="Breadcrumb">
        <button onClick={() => resetAndLoad(resource, "")}>{t("home")}</button>
        {collectionView === "favorites" ? <span>› <strong>{t("favorites")}</strong></span> : crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => resetAndLoad(resource, crumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}
      </nav>}
      {config.uiDefaults.search !== false && <div className="sf-search"><UiIcon name="search"/><select value={searchMode} disabled={collectionView !== null} onChange={event => { const next = event.target.value as "name" | "tags"; setSearchMode(next); setOffset(0); }} aria-label={t("searchScope")}><option value="name" disabled={currentResource?.storageCapabilities?.search === false}>{t("name")}</option><option value="tags">{t("tags")}</option></select><input disabled={collectionView === null && searchMode === "name" && currentResource?.storageCapabilities?.search === false} value={search} onChange={e => setSearch(e.target.value)} placeholder={collectionView === "favorites" ? t("searchFavorites") : searchMode === "tags" ? t("searchTags") : t("search")} aria-label={collectionView === "favorites" ? t("searchFavorites") : searchMode === "tags" ? t("searchTags") : t("search")}/>{assetSearchEnabled && <button className="sf-advanced-search-trigger" type="button" onClick={() => setAssetSearchOpen(true)} title={t("advancedSearch")} aria-label={t("advancedSearch")}><UiIcon name="filter"/></button>}</div>}
      <div className="sf-command-actions">
      {(config.workspace?.options?.length ?? 0) > 1 && <label className="sf-workspace-switcher"><span className="sf-sr-only">{t("workspace")}</span><select aria-label={t("workspace")} value={config.workspace?.id} disabled={uploadActive} title={uploadActive ? t("workspaceUploadBlocked") : t("workspace")} onChange={event => { const option = config.workspace?.options?.find(item => item.id === event.target.value); if (option) window.location.assign(option.url); }}>{config.workspace?.options?.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>}
      <SortMenu sort={sort} direction={direction} group={presentationGroupMode} available={collectionView === null && currentResource?.storageCapabilities?.sort !== false} groupingAvailable={collectionView === null} tagsEnabled={features.tags} labels={{ sort: t("sort"), name: t("name"), modified: t("modified"), type: t("type"), size: t("size"), ascending: t("ascending"), descending: t("descending"), groupBy: t("groupBy"), groupNone: t("groupNone"), tags: t("tags") }} onSortChange={mode => changeSort(mode, false)} onDirectionChange={setSortDirection} onGroupChange={changeGroup} onOpen={() => setUtilityOpen(false)}/>
      {config.uiDefaults.viewSwitcher !== false && <ViewMenu
        view={view}
        viewAvailable={collectionView === null}
        viewSizes={viewSizes}
        scale={uiScale}
        folderNavigation={features.folderTree}
        folderNavigationAvailable={featureAvailability.folderTree !== false}
        detailsPane={detailsPaneVisible}
        detailsPaneAvailable={detailsPaneAvailable}
        columns={listColumns}
        labels={{ view: t("view"), largeIcons: t("largeIcons"), mediumIcons: t("mediumIcons"), smallIcons: t("smallIcons"), list: t("list"), detailsView: t("detailsView"), contentView: t("contentView"), compactView: t("compactView"), show: t("show"), folderNavigation: t("folderNavigation"), detailsPane: t("detailsPane"), showSizeColumn: t("showSizeColumn"), showTypeColumn: t("showTypeColumn"), showModifiedColumn: t("showModifiedColumn") }}
        onViewChange={setViewMode}
        onViewSizeChange={updateViewSize}
        onCompactChange={enabled => setUiScale(enabled ? "compact" : "standard")}
        onFolderNavigationChange={enabled => updateFeature("folderTree", enabled)}
        onDetailsPaneChange={updateDetailsPane}
        onColumnChange={updateListColumn}
        onOpen={() => setUtilityOpen(false)}
      />}
      <div ref={utility} className="sf-utility">
        <button ref={utilityButton} className="sf-icon-only" onClick={() => setUtilityOpen(open => !open)} aria-expanded={utilityOpen} title={t("moreActions")} aria-label={t("moreActions")}><UiIcon name="more"/></button>
        {utilityOpen && <div className="sf-utility-menu" role="menu">
          {config.uiDefaults.languageSwitcher !== false && <label><span>{t("language")}</span><select value={language} onChange={event => setLanguage(event.target.value as Language)} aria-label={t("language")}><option value="zh-cn">简中</option><option value="zh-tw">繁中</option><option value="en">EN</option></select></label>}
          <label><span>{t("filterType")}</span><select value={typeFilter} disabled={collectionView !== null} aria-label={t("filterType")} onChange={event => { const value = event.target.value as EntryTypeFilter; setTypeFilter(value); localStorage.setItem("sofinder.typeFilter.v1", value); clearSelection(); }}><option value="all">{t("allTypes")}</option><option value="folder">{t("folder")}</option><option value="image">{t("images")}</option><option value="document">{t("documents")}</option><option value="audio">{t("audio")}</option><option value="video">{t("video")}</option><option value="archive">{t("archives")}</option><option value="other">{t("other")}</option></select></label>
          <button role="menuitem" onClick={() => { setUtilityOpen(false); if (collectionView === "favorites") void fetchMetadata(resource, true).catch(report); else void load(); }}>{iconButton("refresh", t("refresh"))}</button>
          <button role="menuitem" onClick={() => { setUtilityOpen(false); setSettingsOpen(true); }}>{iconButton("settings", t("settings"))}</button>
          {(uiMode === "manager" || fullTools) && config.securityStatusAvailable !== false && <button role="menuitem" onClick={() => { setUtilityOpen(false); setSecurityStatusOpen(true); }}>{iconButton("security", t("securityStatus"))}</button>}
          {(uiMode === "manager" || fullTools) && features.trash && recoverableDelete && <button role="menuitem" onClick={() => { setUtilityOpen(false); setTrashOpen(true); }}>{iconButton("trash", t("trash"))}</button>}
          {(uiMode === "manager" || fullTools) && features.favorites && <button role="menuitem" onClick={() => { setUtilityOpen(false); openFavorites(); }}>{iconButton("favorite", t("favorites"))}</button>}
          {(uiMode === "manager" || fullTools) && pluginActions.filter(action => action.slot === "utility" && pluginActionAvailable(action, null)).map(action => <button role="menuitem" key={`${action.plugin}:${action.id}`} onClick={() => { setUtilityOpen(false); openPluginAction(action, null); }}>{pluginLabel(action, language)}</button>)}
        </div>}
      </div>
      </div>
    </div>
    <div className="sf-toolbar" role="toolbar" aria-label={t("fileActions")} title={t("keyboardHelp")}>
      <button onClick={createFolder} disabled={collectionView !== null || currentResource?.readOnly || directoryCapabilities.create_folder === false || (currentResource !== undefined && currentDepth >= currentResource.maxFolderDepth)} title={currentResource && currentDepth >= currentResource.maxFolderDepth ? t("folderDepthReached") : undefined}>{iconButton("add-folder", t("newFolder"))}</button>
      <button className={`primary sf-upload-trigger${uploadActive ? " is-active" : ""}`} aria-busy={uploadActive} onClick={() => uploadInput.current?.click()} disabled={collectionView !== null || currentResource?.readOnly || directoryCapabilities.upload === false}>{iconButton("upload", `${t("upload")}${uploadActive ? ` (${uploads.filter(task => task.status === "queued" || task.status === "uploading").length})` : ""}`)}</button>
      <input ref={uploadInput} type="file" multiple hidden onChange={event => { if (event.target.files) void upload(event.target.files); event.target.value = ""; }}/>
      {featureAvailability.folderUpload !== false && <><button onClick={() => directoryUploadInput.current?.click()} disabled={collectionView !== null || currentResource?.readOnly || directoryCapabilities.upload === false}>{iconButton("add-folder", t("uploadFolder"))}</button>
      <input ref={element => { directoryUploadInput.current = element; element?.setAttribute("webkitdirectory", ""); }} type="file" multiple hidden onChange={event => { if (event.target.files) void uploadDirectory(event.target.files); event.target.value = ""; }}/></>}
      {(uiMode === "manager" || fullTools) && <div ref={selectionMenu} className="sf-utility sf-selection-menu"><button onClick={toggleSelectionMenu} aria-expanded={selectionMenuOpen} aria-haspopup="menu">{iconButton("select", t("selection"))}</button></div>}
      {(uiMode === "manager" || fullTools) && selectedEntries.length > 0 && <><span className="sf-separator"/><div className="sf-context-actions">
      <button onClick={rename} disabled={selectedEntries.length !== 1 || !canSelected("rename") || currentResource?.readOnly}>{iconButton("rename", t("rename"))}</button>
      {featureAvailability.batchRename !== false && tools.batchRename && <button onClick={() => setBulkRenameOpen(true)} disabled={selectedEntries.length < 2 || !canSelected("rename") || currentResource?.readOnly}>{iconButton("rename", t("batchRename"))}</button>}
      <button onClick={() => void browseDestination("copy", path)} disabled={!canSelected("copy") || currentResource?.readOnly}>{iconButton("copy", t("copy"))}</button>
      <button onClick={() => void browseDestination("move", path)} disabled={!canSelected("move") || currentResource?.readOnly}>{iconButton("move", t("move"))}</button>
      {features.archive && <button onClick={() => void downloadArchive()}>{iconButton("archive", t("downloadZip"))}</button>}
      {features.favorites && canFavorite(selected) && <button onClick={() => void toggleFavorite()}>{iconButton("favorite", t("favorite"))}</button>}
      {quickAccessEnabled && features.sidebarQuickAccess && canQuickAccess(selected) && <button onClick={() => void toggleQuickAccess()}>{iconButton("pin", selected && metadata.quickAccess.includes(selected.path) ? t("unpinQuickAccess") : t("pinQuickAccess"))}</button>}
      {features.tags && <button onClick={() => void editTags()} disabled={!selected}>{iconButton("tags", t("tags"))}</button>}
      <button className="danger" onClick={remove} disabled={!canSelected("delete") || currentResource?.readOnly}>{iconButton("delete", `${t("remove")}${selectedEntries.length > 1 ? ` (${selectedEntries.length})` : ""}`)}</button>
      {((featureAvailability.imageEditing !== false && (tools.rotate || tools.resize || tools.crop || tools.presets)) || (featureAvailability.imageProcessing !== false && tools.process)) && selectedEntries.length === 1 && <button onClick={openCropEditor} disabled={!canEditImage(selected) || !imageInfo || currentResource?.readOnly}>{iconButton("crop", t("imageEdit"))}</button>}
      {featureAvailability.imageProcessing !== false && tools.process && selectedEntries.length > 1 && <button onClick={() => setImageProcessOpen(true)} disabled={editableSelectedImages.length === 0 || editableSelectedImages.length !== selectedEntries.length || currentResource?.readOnly}>{iconButton("resize", t("imageProcess"))}</button>}
      {selected && pluginActions.filter(action => action.slot === "toolbar" && pluginActionAvailable(action, selected)).map(action => <button key={`${action.plugin}:${action.id}`} onClick={() => openPluginAction(action, selected)}>{pluginLabel(action, language)}</button>)}
      </div></>}
    </div>
    {selectionMenuOpen && createPortal(<div ref={selectionMenuPopup} className="sf-utility-menu sf-selection-menu-popup" role="menu" style={selectionMenuPosition}><button role="menuitem" disabled={displayedEntries.length === 0} onClick={() => { selectAll(); setSelectionMenuOpen(false); }}>{t("selectAll")}</button><button role="menuitem" disabled={selectedPaths.size === 0} onClick={() => { clearSelection(); setSelectionMenuOpen(false); }}>{t("clearSelection")}</button><button role="menuitem" disabled={displayedEntries.length === 0} onClick={() => { invertSelection(); setSelectionMenuOpen(false); }}>{t("invertSelection")}</button></div>, document.body)}
    {notice && <div className="sf-notice" role="alert">{notice}<button onClick={() => setNotice("")} aria-label={t("close")}><UiIcon name="close"/></button></div>}
    {uploads.length > 0 && <Suspense fallback={null}><UploadQueue tasks={uploads} collapsed={uploadsCollapsed} labels={{ title: t("uploadQueue"), expand: t("expand"), collapse: t("collapse"), cancel: t("cancel"), cancelAll: t("cancelAll"), clearFinished: t("clearFinished"), retry: t("retryUpload"), remove: t("removeUploadTask"), status: status => t(status) }} onToggle={() => setUploadsCollapsed(current => !current)} onCancel={cancelUpload} onCancelAll={cancelAllUploads} onClearFinished={clearFinishedUploads} onRetry={retryUpload} onRemove={removeUploadTask}/></Suspense>}
    <div className="sf-layout" style={{ "--sf-sidebar-width": `${leftWidth}px`, "--sf-details-width": `${rightWidth}px` } as React.CSSProperties}>
      {showSidebar && <aside className="sf-sidebar" aria-label="Resources">
        {resources.map(item => <button key={item.name} className={item.name === resource && collectionView === null ? "active" : ""} onClick={() => { setCollectionView(null); setResource(item.name); setSearch(""); setSearchMode("name"); if (item.storageCapabilities?.sort === false) { setSort("name"); setDirection("asc"); setCursorHistory([]); void load(item.name, "", "", 0, "name", "asc", "name", null); } else resetAndLoad(item.name, "", ""); }}>
          <span className="sf-resource-icon"><Icon kind={item.name.toLowerCase().includes("image") ? "image" : "folder"}/></span>
          {item.name.toLowerCase().includes("image") ? t("images") : item.name.toLowerCase() === "files" ? t("files") : item.name}
        </button>)}
        {currentResource && (currentResource.readOnly || currentResource.quotaBytes > 0) && <div className="sf-resource-status">
          {currentResource.readOnly && <strong>{t("readOnly")}</strong>}
          {currentResource.quotaBytes > 0 && <><span>{t("storageUsage")}: {formatSize(currentResource.usedBytes)} / {formatSize(currentResource.quotaBytes)}</span><progress max={currentResource.quotaBytes} value={Math.min(currentResource.usedBytes, currentResource.quotaBytes)}/></>}
        </div>}
        {sidebarSections("left", leftSidebarSections)}
      </aside>}
      {showSidebar && <div className="sf-column-resizer left" role="separator" tabIndex={0} aria-label={t("resizeLeftPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.left.min} aria-valuemax={columnLimits.left.max} aria-valuenow={leftWidth} onPointerDown={event => beginColumnResize("left", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("left", event)} onDoubleClick={() => setColumnWidth("left", columnLimits.left.initial, true)}/>}
      <section className="sf-content">
        {recentPanel("mobile")}
        {hasLogo && <nav className="sf-breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => resetAndLoad(resource, "")}>{t("home")}</button>
          {collectionView === "favorites" ? <span>› <strong>{t("favorites")}</strong></span> : crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => resetAndLoad(resource, crumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}
        </nav>}
        {collectionView === "favorites" ? <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><FavoritesPage paths={metadata.favorites} search={search} locale={language} labels={{ title: t("favorites"), hint: t("favoritesPageHint"), empty: t("favoritesEmpty"), noMatch: t("filterEmpty"), home: t("home"), open: t("open"), remove: t("removeFavorite") }} onOpen={item => void sidebarPath(resource, item, "favorite")} onRemove={item => void removeFavorite(item)}/></Suspense> : loading ? <div className="sf-state">{t("loading")}</div> : displayedEntries.length === 0 ? <div className="sf-state">{entries.length === 0 ? t("empty") : t("filterEmpty")}</div> :
          <div ref={entriesList} className={`sf-entries ${view} sf-grid-size-${viewSizes.grid} sf-list-size-${viewSizes.list}${view === "list" && listColumns.size ? " sf-list-has-size" : ""}`} style={view === "list" ? { "--sf-list-columns": listGridTemplate } as React.CSSProperties : undefined} role="listbox" aria-multiselectable={uiMode === "manager"} aria-label={t("files")}>
            {view === "list" && <div className="sf-list-head">{visibleListColumns.map(column => sortHeading(column, columnLabel(column), columnClass(column), true))}</div>}
            {entryGroups.flatMap(group => [
              ...(presentationGroupMode !== "none" ? [<div key={`group-${group.key}`} className="sf-entry-group"><strong>{groupLabel(group.label)}</strong><span>{group.entries.length}</span></div>] : []),
              ...group.entries.map(entry => {
              const index = displayedEntries.findIndex(item => item.path === entry.path);
              const image = !entry.directory && canPreviewImage(entry);
              return <button key={entry.path} data-entry-index={index} role="option" aria-selected={selectedPaths.has(entry.path)} aria-label={`${entry.name}, ${entry.directory ? t("folder") : formatSize(entry.size)}`} className={`sf-entry ${selectedPaths.has(entry.path) ? "selected" : ""}`} onClick={event => selectEntry(entry, event)} onDoubleClick={() => openEntry(entry)} onContextMenu={event => { event.preventDefault(); setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }} onPointerDown={event => { if (event.pointerType === "touch") longPress.current = window.setTimeout(() => { setSelectedPaths(new Set([entry.path])); setSelectionAnchor(entry.path); setContextMenu({ x: event.clientX, y: event.clientY, entry }); }, 550); }} onPointerUp={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onPointerCancel={() => { if (longPress.current !== null) window.clearTimeout(longPress.current); longPress.current = null; }} onDragOver={event => { if (entry.directory) event.preventDefault(); }} onDrop={event => { if (entry.directory && event.dataTransfer.files.length) { event.preventDefault(); void uploadTo(entry.path, event.dataTransfer.files); } }}>
                <span className="sf-entry-icon">{image ? <ThumbnailImage src={api.thumbnailUrl(resource, entry)} alt="" lazy/> : <Icon name={entry.name} mimeType={entry.mimeType} directory={entry.directory}/>}</span>
                <span className="sf-entry-name" title={entry.name}>{features.favorites && metadata.favorites.includes(entry.path) && <span aria-label={t("favorite")}><UiIcon name="favorite"/> </span>}{entry.name}</span>
                {listColumns.size && <span className="sf-entry-size">{entry.directory ? "—" : formatSize(entry.size)}</span>}
                {listColumns.type && <span className="sf-entry-type">{entry.directory ? t("folder") : entry.mimeType || t("file")}</span>}
                {listColumns.modified && <time className="sf-entry-modified" dateTime={new Date(entry.modifiedAt * 1000).toISOString()}>{dateFormatter.format(entry.modifiedAt * 1000)}</time>}
              </button>;
            })])}
          </div>}
        {collectionView === null && <nav className="sf-pagination" aria-label={t("pagination")}>
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
        </nav>}
      </section>
      {showRightPanel && <>
        <div className="sf-column-resizer right" role="separator" tabIndex={0} aria-label={t("resizeRightPanel")} aria-orientation="vertical" aria-valuemin={columnLimits.right.min} aria-valuemax={columnLimits.right.max} aria-valuenow={rightWidth} onPointerDown={event => beginColumnResize("right", event)} onPointerMove={moveColumnResize} onPointerUp={endColumnResize} onPointerCancel={endColumnResize} onKeyDown={event => resizeColumnWithKeyboard("right", event)} onDoubleClick={() => setColumnWidth("right", columnLimits.right.initial, true)}/>
        <aside className="sf-right-panel" aria-label={t("rightSidebar")}>
          {sidebarSections("right", rightSidebarSections)}
          {showDetails && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><DetailsPanel api={api} resource={resource} selectedEntries={selectedEntries} selected={selected} imageInfo={imageInfo} metadata={metadata} showTags={features.tags} previewImage={canPreviewImage(selected)} selectMode={false} selectAllowed={canChooseEntry(selected)} assetMetadataEnabled={assetCatalogEnabled} assetAltLocales={assetAltLocales.map(code => ({ code, label: ({ en: t("languageEnglish"), "zh-cn": t("languageZhCn"), "zh-tw": t("languageZhTw") } as Record<string, string>)[code] ?? code }))} labels={{ details: t("details"), information: t("information"), selected: t("selectedCount"), type: t("type"), folder: t("folder"), file: t("file"), size: t("size"), dimensions: t("dimensions"), modified: t("modified"), location: t("location"), select: t("select"), download: t("download"), share: t("share"), assetMetadata: t("assetMetadata"), assetAlt: t("assetAlt"), translatedAlt: t("translatedAlt"), language: t("languageCode"), addLanguage: t("addLanguage"), assetTitle: t("assetTitle"), tags: t("tags"), decorative: t("decorativeImage"), unsetAlt: t("assetAltUnset"), inheritAlt: t("inheritAlt"), save: t("save"), loading: t("loading"), saved: t("assetMetadataSaved"), unsaved: t("unsavedChanges"), conflict: t("assetMetadataConflict"), metadataError: t("assetMetadataError"), unsupportedWebImage: t("webImageUnsupported") }} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} onChoose={choose} onShare={openShare} onAssetMetadata={entry => void openAssetMetadata(entry)} pluginActions={selected && pluginActions.filter(action => action.slot === "details" && pluginActionAvailable(action, selected)).map(action => <button key={`${action.plugin}:${action.id}`} onClick={() => openPluginAction(action, selected)}>{pluginLabel(action, language)}</button>)}/></Suspense>}
        </aside>
      </>}
    </div>
    {uiMode === "picker" && selected && !selected.directory && <div className="sf-picker-bar"><div><strong>{selected.name}</strong><small>{formatSize(selected.size)}</small></div>{!canChooseEntry(selected) && <span role="status">{t("webImageUnsupported")}</span>}<button className="primary" disabled={!canChooseEntry(selected)} onClick={() => void choose()}>{t("select")}</button></div>}
    {settingsOpen && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><SettingsDialog resource={currentResource} tools={tools} features={features} columns={listColumns} viewSizes={viewSizes} folderTreePlacement={folderTreePlacement} quickAccessScope={quickAccessScope} availability={featureAvailability} scale={uiScale} uploadConflictStrategy={uploadConflictStrategy} translate={t} onToolChange={updateTool} onFeatureChange={updateFeature} onColumnChange={updateListColumn} onViewSizeChange={updateViewSize} onFolderTreePlacementChange={updateFolderTreePlacement} onQuickAccessScopeChange={scope => { setQuickAccessScope(scope); localStorage.setItem("sofinder.quickAccess.scope.v1", scope); }} onScaleChange={setUiScale} onUploadConflictStrategyChange={setUploadConflictStrategy} onReset={resetPreferences} onClose={() => setSettingsOpen(false)}/></Suspense>}
    {securityStatusOpen && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><SecurityStatusDialog api={api} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} labels={{ title: t("securityStatus"), close: t("close"), loading: t("loading"), enabled: t("malwareScanningEnabled"), disabled: t("malwareScanningDisabled"), provider: t("scanProvider"), service: t("serviceStatus"), scans: t("scanHistory"), passed: t("scanPassed"), quarantined: t("scanQuarantined"), failed: t("scanFailed"), pending: t("scanPending"), recent: t("recentScans"), none: t("noScans"), document: t("documentPreviewStatus"), mode: t("previewMode"), converter: t("previewConverter"), version: t("previewVersion"), cache: t("previewCache"), writable: t("previewCacheWritable"), readOnly: t("previewCacheReadOnly"), jobs: t("previewJobs"), lastSuccess: t("previewLastSuccess"), never: t("previewNever"), running: t("previewRunning"), ready: t("previewReady") }} onClose={() => setSecurityStatusOpen(false)}/></Suspense>}
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
      onSave={tags => { setTagsOpen(false); void mutateMetadata(resource, selected.path, "tags", { tags }).catch(report); }}
    /></Suspense>}
    {assetSearchOpen && assetSearchEnabled && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><AssetSearchDialog api={api} resources={resources.map(item => item.name)} currentResource={resource} currentPath={path} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} labels={{ advancedSearch: t("advancedSearch"), close: t("close"), keywords: t("keywords"), searchAssets: t("searchAssets"), scope: t("searchScope"), currentDirectory: t("currentDirectory"), currentResource: t("currentResource"), allResources: t("allResources"), type: t("type"), allTypes: t("allTypes"), image: t("images"), document: t("documents"), audio: t("audio"), video: t("video"), archive: t("archives"), other: t("other"), tags: t("tags"), extensions: t("extensions"), commaSeparated: t("commaSeparated"), minimumSize: t("minimumSizeMb"), maximumSize: t("maximumSizeMb"), modifiedAfter: t("modifiedAfter"), modifiedBefore: t("modifiedBefore"), searchFields: t("searchFields"), name: t("name"), title: t("assetTitle"), alt: t("assetAlt"), searching: t("searching"), search: t("search"), recentSearches: t("recentSearches"), filteredAssets: t("filteredAssets"), searchFailed: t("searchFailed"), results: t("searchResultCount"), scanned: t("searchScannedCount"), truncated: t("searchTruncated"), noResults: t("filterEmpty"), previous: t("previous"), next: t("next") }} onOpen={(nextResource, targetPath) => void openAssetSearchResult(nextResource, targetPath)} onClose={() => setAssetSearchOpen(false)}/></Suspense>}
    {assetMetadataDialog && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><AssetMetadataDialog asset={assetMetadataDialog.asset} metadata={assetMetadataDialog.metadata} locales={assetAltLocales.map(code => ({ code, label: ({ en: t("languageEnglish"), "zh-cn": t("languageZhCn"), "zh-tw": t("languageZhTw") } as Record<string, string>)[code] ?? code }))} labels={{ title: t("assetMetadata"), alt: t("assetAlt"), translatedAlt: t("translatedAlt"), translatedAltHelp: t("translatedAltHelp"), language: t("languageCode"), addLanguage: t("addLanguage"), assetTitle: t("assetTitle"), tags: t("tags"), decorative: t("decorativeImage"), unsetAlt: t("assetAltUnset"), inheritAlt: t("inheritAlt"), save: t("save"), cancel: t("cancel") }} onClose={() => setAssetMetadataDialog(null)} onSave={async value => { await api.updateAssetMetadata(assetMetadataDialog.asset.assetId || "", value); setAssetMetadataDialog(null); setNotice(t("assetMetadataSaved")); }}/></Suspense>}
    {previewEntry && <Modal
      title={previewEntry.name}
      closeLabel={t("close")}
      maximizable
      onClose={() => setPreviewEntry(null)}
      className="sf-file-preview-modal"
      footer={<><a className="sf-icon-action" href={previewEntry.url || api.downloadUrl(resource, previewEntry.path)} target="_blank" rel="noopener noreferrer" title={t("download")} aria-label={t("download")}><UiIcon name="download"/></a><button className="sf-icon-action" type="button" onClick={() => void openShare(previewEntry)} title={t("share")} aria-label={t("share")}><UiIcon name="share"/></button>{assetCatalogEnabled && previewEntry.capabilities?.["metadata.update"] !== false && <button className="sf-icon-action" type="button" onClick={() => void openAssetMetadata(previewEntry)} title={t("assetMetadata")} aria-label={t("assetMetadata")}><UiIcon name="asset-metadata"/></button>}<button className="primary" onClick={() => setPreviewEntry(null)}>{t("close")}</button></>}
    >
      <div className="sf-file-preview-body">
        {canPreviewImage(previewEntry)
          ? <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><ImagePreviewPane api={api} resource={resource} entry={previewEntry} labels={{ actual: t("actualSize"), fit: t("fitToWindow"), zoom: t("zoomLevel"), center: t("centerImage"), loading: t("loadingOriginalImage"), failed: t("imagePreviewFailed"), retry: t("retryImagePreview"), warning: t("largeOriginalImageWarning"), continue: t("continueOriginalImage"), cancel: t("cancel"), dimensions: t("dimensions"), size: t("size") }}/></Suspense>
          : <div className="sf-file-preview-content">
          {featureAvailability.textPreview !== false && textPreview?.path === previewEntry.path
              ? <><pre className="sf-text-preview">{textPreview.content}</pre>{textPreview.truncated && <p className="sf-warning">{t("previewTruncated")}</p>}</>
            : previewerFor(previewEntry, pluginPreviewers)?.plugin === "document-preview"
              ? <Suspense fallback={null}><DocumentPreviewPane api={api} resource={resource} entry={previewEntry} labels={{ submitting: t("previewSubmitting"), queued: t("previewQueued"), converting: t("previewConverting"), loading: t("previewLoading"), failed: t("previewFailed"), retry: t("previewRetry"), elapsed: seconds => t("previewElapsed").replace("{seconds}", String(seconds)) }}/></Suspense>
            : previewerUrl(previewEntry, pluginPreviewers, resource)
              ? <iframe className="sf-document-preview" src={previewerUrl(previewEntry, pluginPreviewers, resource) || undefined} title={previewEntry.name}/>
              : <div className="sf-file-preview-fallback"><Icon kind="file"/><p>{t("previewUnavailable")}</p></div>}
        </div>}
        <dl className="sf-file-preview-meta"><dt>{t("type")}</dt><dd>{previewEntry.mimeType || t("file")}</dd><dt>{t("size")}</dt><dd>{formatSize(previewEntry.size)}</dd><dt>{t("modified")}</dt><dd><time dateTime={new Date(previewEntry.modifiedAt * 1000).toISOString()}>{dateFormatter.format(previewEntry.modifiedAt * 1000)}</time></dd><dt>{t("location")}</dt><dd>{previewEntry.path}</dd>{featureAvailability.checksum !== false && <><dt>SHA-256</dt><dd>{checksum?.path === previewEntry.path ? <code className="sf-checksum">{checksum.value}</code> : <button onClick={() => void api.checksum(resource, previewEntry.path).then(result => setChecksum({ path: previewEntry.path, value: result.checksum })).catch(report)}>{t("calculateChecksum")}</button>}</dd></>}</dl>
      </div>
    </Modal>}
    {shareDialog && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><ShareDialog {...shareDialog} showQrCode={features.qrCode && featureAvailability.qrCode !== false} labels={{ title: t("share"), close: t("close"), copyUrl: t("copyUrl"), copied: t("urlCopied"), copyFailed: t("copyUrlFailed"), downloadQr: t("downloadQrCode"), loginRequired: t("loginRequired"), expires: t("linkExpires"), hint: t("shareHint"), qrCode: t("qrCode"), qrFailed: t("qrCodeFailed") }} formatDate={timestamp => dateFormatter.format(timestamp * 1000)} onClose={() => setShareDialog(null)}/></Suspense>}
    {imageProcessOpen && featureAvailability.imageProcessing !== false && editableSelectedImages.length > 0 && <Suspense fallback={<div className="sf-state">{t("loading")}</div>}><ImageProcessDialog
      entries={editableSelectedImages}
      resource={resource}
      formats={imageCapabilities.formats.filter(item => item.edit && ["jpeg", "png", "webp", "avif"].includes(item.format)).map(item => item.format)}
      labels={{ title: t("imageProcess"), close: t("close"), cancel: t("cancel"), apply: t("applyImageProcess"), processing: t("processingImages"), selected: t("processingSelected"), operation: t("operation"), optimize: t("optimizeImage"), textWatermark: t("textWatermark"), imageWatermark: t("imageWatermark"), outputFormat: t("outputFormat"), keepFormat: t("keepFormat"), watermarkText: t("watermarkText"), watermarkFont: t("watermarkFont"), interfaceFont: t("interfaceFont"), sansFont: t("sansFont"), serifFont: t("serifFont"), color: t("color"), watermarkResource: t("watermarkResource"), watermarkPath: t("watermarkPath"), position: t("position"), topLeft: t("topLeft"), topRight: t("topRight"), center: t("center"), bottomLeft: t("bottomLeft"), bottomRight: t("bottomRight"), opacity: t("opacity"), scale: t("watermarkScale"), quality: t("quality"), saveMode: t("saveMode"), saveCopy: t("saveCopy"), overwrite: t("overwrite"), conversionCopyHint: t("conversionCopyHint"), overwriteWarning: t("confirmImageOverwrite") }}
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
      imageUrl={`${api.contentUrl(resource, selected.path)}&v=${selected.modifiedAt}-${selected.size}-${imageEditorVersion}`}
      resource={resource}
      watermarkUrl={(watermarkResource, watermarkPath) => api.contentUrl(watermarkResource, watermarkPath)}
      presets={imagePresets}
      formats={imageCapabilities.formats.filter(item => item.edit && ["jpeg", "png", "webp", "avif"].includes(item.format)).map(item => item.format)}
      enabledTools={{ crop: tools.crop && featureAvailability.imageEditing !== false, rotate: tools.rotate && featureAvailability.imageEditing !== false, resize: tools.resize && featureAvailability.imageEditing !== false, presets: tools.presets && featureAvailability.imageEditing !== false, process: tools.process && featureAvailability.imageProcessing !== false }}
      maximumFileNameLength={currentResource?.maxFileNameLength ?? 120}
      labels={{ imageEdit: t("imageEdit"), imageTools: t("imageTools"), crop: t("crop"), rotate: t("rotationTools"), resize: t("resize"), preset: t("preset"), optimize: t("optimizeImage"), watermark: t("watermark"), close: t("close"), cancel: t("cancel"), save: t("save"), saving: t("saving"), ratio: t("ratio"), free: t("freeRatio"), original: t("originalRatio"), zoom: t("zoom"), undo: t("undo"), redo: t("redo"), reset: t("reset"), compare: t("compare"), x: "X", y: "Y", width: t("width"), height: t("height"), outputSize: t("outputSize"), rotation: t("rotation"), rotateLeft: t("rotateLeft"), rotateRight: t("rotateRight"), enableResize: t("enableResize"), noPreset: t("noPreset"), enableOptimize: t("enableOptimize"), outputFormat: t("outputFormat"), keepFormat: t("keepFormat"), quality: t("quality"), watermarkType: t("watermarkType"), noWatermark: t("noWatermark"), textWatermark: t("textWatermark"), imageWatermark: t("imageWatermark"), watermarkText: t("watermarkText"), watermarkFont: t("watermarkFont"), interfaceFont: t("interfaceFont"), sansFont: t("sansFont"), serifFont: t("serifFont"), color: t("color"), watermarkResource: t("watermarkResource"), watermarkPath: t("watermarkPath"), position: t("position"), topLeft: t("topLeft"), topRight: t("topRight"), center: t("center"), bottomLeft: t("bottomLeft"), bottomRight: t("bottomRight"), freePosition: t("freePosition"), dragWatermark: t("dragWatermark"), dragWatermarkHint: t("dragWatermarkHint"), opacity: t("opacity"), watermarkScale: t("watermarkScale"), saveMode: t("saveMode"), saveCopy: t("saveCopy"), overwrite: t("overwrite"), fileName: t("fileName"), fileNameTooLong: t("fileNameTooLongMaximum"), invalidFileName: t("invalidEntryName"), overwriteWarning: t("confirmImageOverwrite"), panHint: t("panHint"), conversionCopyHint: t("conversionCopyHint") }}
      onClose={() => setCropOpen(false)}
      onSave={async (actions, save) => {
        const result = await api.applyImageActions(resource, selected.path, actions, save);
        setCropOpen(false);
        setNotice(`${t("imageCreated")}: ${result.entry.name} · ${result.result.width} × ${result.result.height} px`);
        await load();
        setSelectedPaths(new Set([result.entry.path]));
        setSelectionAnchor(result.entry.path);
        setImageEditorVersion(Date.now());
      }}
    /></Suspense>}
    <Suspense fallback={null}>
    {sidebarMenu && (
      <ContextMenu
        x={sidebarMenu.x}
        y={sidebarMenu.y}
        onClose={() => setSidebarMenu(null)}
        onSelect={() => {
          setSidebarMenu(null);
          void (sidebarMenu.favorite ? removeFavorite(sidebarMenu.link.path) : unpinQuickAccess(sidebarMenu.link));
        }}
        items={[{ id: "remove", label: t(sidebarMenu.favorite ? "removeFavorite" : "unpinQuickAccess") }]}
      />
    )}
    {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onSelect={runContextCommand} items={[
      { id: contextMenu.entry.directory ? "open" : "preview", label: contextMenu.entry.directory ? t("open") : t("preview") },
      ...(uiMode === "picker" && !contextMenu.entry.directory ? [{ id: "select", label: t("select"), disabled: !canChooseEntry(contextMenu.entry) }] : []),
      { id: "download", label: t("download"), disabled: contextMenu.entry.directory },
      { id: "share", label: t("share"), disabled: contextMenu.entry.directory },
      ...(uiMode === "manager" ? [
        ...(features.favorites && canFavorite(contextMenu.entry) ? [{ id: "favorite", label: metadata.favorites.includes(contextMenu.entry.path) ? t("removeFavorite") : t("favorite") }] : []),
        ...(quickAccessEnabled && features.sidebarQuickAccess && canQuickAccess(contextMenu.entry) ? [{ id: "quick-access", label: metadata.quickAccess.includes(contextMenu.entry.path) ? t("unpinQuickAccess") : t("pinQuickAccess") }] : []),
        ...(assetCatalogEnabled && !contextMenu.entry.directory && contextMenu.entry.capabilities?.["metadata.update"] !== false ? [{ id: "asset-metadata", label: t("assetMetadata") }] : []),
        { id: "rename", label: t("rename"), disabled: contextMenu.entry.capabilities?.rename === false },
        { id: "copy", label: t("copy"), disabled: contextMenu.entry.capabilities?.copy === false },
        { id: "move", label: t("move"), disabled: contextMenu.entry.capabilities?.move === false },
        { id: "delete", label: t("remove"), disabled: contextMenu.entry.capabilities?.delete === false, danger: true },
        ...pluginActions.filter(action => action.slot === "context").map(action => ({ id: `plugin:${action.plugin}:${action.id}`, label: pluginLabel(action, language), disabled: !pluginActionAvailable(action, contextMenu.entry) })),
      ] : []),
    ]}/>}
    </Suspense>
    <div className="sf-sr-only" aria-live="polite">{selectedEntries.length > 0 ? `${selectedEntries.length} ${t("selectedCount")}` : notice}</div>
  </main>;
}

const isTextPreviewMime = (mime: string | null) => Boolean(mime && (mime.startsWith("text/") || ["application/json", "application/ld+json", "application/xml", "application/x-yaml", "application/yaml"].includes(mime) || mime.endsWith("+json") || mime.endsWith("+xml")));
