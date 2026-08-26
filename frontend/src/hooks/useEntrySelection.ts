import { useCallback, useMemo, useState, type MouseEvent } from "react";
import type { Entry } from "../types";

export function useEntrySelection(entries: Entry[], picker: boolean, onTouch: (entry: Entry) => void) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(() => new Set());
  const [selectionAnchor, setSelectionAnchor] = useState<string | null>(null);
  const selectedEntries = useMemo(() => entries.filter(entry => selectedPaths.has(entry.path)), [entries, selectedPaths]);
  const selected = selectedEntries.length === 1 ? selectedEntries[0] : null;

  const selectEntry = useCallback((entry: Entry, event: MouseEvent) => {
    if (picker) {
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
    onTouch(entry);
  }, [entries, onTouch, picker, selectionAnchor]);

  return { selectedPaths, setSelectedPaths, selectionAnchor, setSelectionAnchor, selectedEntries, selected, selectEntry };
}
