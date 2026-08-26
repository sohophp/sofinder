import { useRef, useState } from "react";
import type { Entry } from "../types";
import { loadPageSize } from "../preferences";

export type ViewMode = "grid" | "list";
export type SortMode = "name" | "size" | "modified";

export function useBrowserState(initialResource: string, initialPath: string) {
  const [resource, setResource] = useState(initialResource);
  const [path, setPath] = useState(initialPath);
  const [resolvedPath, setResolvedPath] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"name" | "tags">("name");
  const [sort, setSort] = useState<SortMode>("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(0);
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<Array<string | null>>([]);
  const initialPageSize = useRef(loadPageSize()).current;
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageSizeDraft, setPageSizeDraft] = useState(String(initialPageSize));
  const pageSizeRef = useRef(initialPageSize);
  const [view, setView] = useState<ViewMode>(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [directoryCapabilities, setDirectoryCapabilities] = useState<Record<string, boolean>>({});
  const loadSequence = useRef(0);
  const historyReady = useRef(false);
  const restoringHistory = useRef(false);
  const searchInitialized = useRef(false);

  return { resource, setResource, path, setPath, resolvedPath, setResolvedPath, entries, setEntries, search, setSearch, searchMode, setSearchMode, sort, setSort, direction, setDirection, offset, setOffset, total, setTotal, pageCursor, setPageCursor, nextCursor, setNextCursor, cursorHistory, setCursorHistory, pageSize, setPageSize, pageSizeDraft, setPageSizeDraft, pageSizeRef, view, setView, loading, setLoading, notice, setNotice, directoryCapabilities, setDirectoryCapabilities, loadSequence, historyReady, restoringHistory, searchInitialized };
}
