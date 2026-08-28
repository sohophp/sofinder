import { useEffect, useRef, useState } from "react";
import type { UiScale } from "../types";
import type { EntrySize, ListColumnPreferences, ViewSizePreferences } from "./SettingsDialog";
import { UiIcon } from "./UiIcon";

type ViewMode = "grid" | "list";

export function ViewMenu({ view, viewAvailable, viewSizes, scale, folderNavigation, folderNavigationAvailable, detailsPane, detailsPaneAvailable, columns, labels, onViewChange, onViewSizeChange, onCompactChange, onFolderNavigationChange, onDetailsPaneChange, onColumnChange, onOpen }: {
  view: ViewMode;
  viewAvailable: boolean;
  viewSizes: ViewSizePreferences;
  scale: UiScale;
  folderNavigation: boolean;
  folderNavigationAvailable: boolean;
  detailsPane: boolean;
  detailsPaneAvailable: boolean;
  columns: ListColumnPreferences;
  labels: Record<"view" | "largeIcons" | "mediumIcons" | "smallIcons" | "list" | "detailsView" | "contentView" | "compactView" | "show" | "folderNavigation" | "detailsPane" | "showSizeColumn" | "showTypeColumn" | "showModifiedColumn", string>;
  onViewChange: (view: ViewMode) => void;
  onViewSizeChange: (view: keyof ViewSizePreferences, size: EntrySize) => void;
  onCompactChange: (enabled: boolean) => void;
  onFolderNavigationChange: (enabled: boolean) => void;
  onDetailsPaneChange: (enabled: boolean) => void;
  onColumnChange: (column: keyof ListColumnPreferences, enabled: boolean) => void;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [open]);

  const chooseGridSize = (size: EntrySize) => {
    onViewSizeChange("grid", size);
    onViewChange("grid");
    setOpen(false);
  };
  const chooseListSize = (size: EntrySize) => {
    onViewSizeChange("list", size);
    onViewChange("list");
    setOpen(false);
  };
  const mark = (selected: boolean) => <span className="sf-view-menu-mark" aria-hidden="true">{selected ? "✓" : ""}</span>;
  const toggle = (label: string, checked: boolean, disabled: boolean, change: (checked: boolean) => void) => <button type="button" role="menuitemcheckbox" aria-checked={checked} disabled={disabled} onClick={() => change(!checked)}>{mark(checked)}<span>{label}</span></button>;

  return <div ref={root} className="sf-view-menu sf-utility">
    <button ref={trigger} type="button" className="sf-view-menu-trigger" aria-label={labels.view} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(current => { const next = !current; if (next) onOpen?.(); return next; })}><UiIcon name={view === "grid" ? "grid" : "list"}/><span>{labels.view}</span><UiIcon name="chevron-down"/></button>
    {open && <div className="sf-utility-menu sf-view-menu-popup" role="menu" aria-label={labels.view}>
      <div className="sf-view-menu-section">
        <button type="button" role="menuitemradio" disabled={!viewAvailable} aria-checked={view === "grid" && viewSizes.grid === "large"} onClick={() => chooseGridSize("large")}>{mark(view === "grid" && viewSizes.grid === "large")}<UiIcon name="grid"/><span>{labels.largeIcons}</span></button>
        <button type="button" role="menuitemradio" disabled={!viewAvailable} aria-checked={view === "grid" && viewSizes.grid === "medium"} onClick={() => chooseGridSize("medium")}>{mark(view === "grid" && viewSizes.grid === "medium")}<UiIcon name="grid"/><span>{labels.mediumIcons}</span></button>
        <button type="button" role="menuitemradio" disabled={!viewAvailable} aria-checked={view === "grid" && viewSizes.grid === "small"} onClick={() => chooseGridSize("small")}>{mark(view === "grid" && viewSizes.grid === "small")}<UiIcon name="grid"/><span>{labels.smallIcons}</span></button>
        <button type="button" role="menuitemradio" disabled={!viewAvailable} aria-checked={view === "list" && viewSizes.list === "small"} onClick={() => chooseListSize("small")}>{mark(view === "list" && viewSizes.list === "small")}<UiIcon name="list"/><span>{labels.list}</span></button>
        <button type="button" role="menuitemradio" disabled={!viewAvailable} aria-checked={view === "list" && viewSizes.list === "medium"} onClick={() => chooseListSize("medium")}>{mark(view === "list" && viewSizes.list === "medium")}<UiIcon name="list"/><span>{labels.detailsView}</span></button>
        <button type="button" role="menuitemradio" disabled={!viewAvailable} aria-checked={view === "list" && viewSizes.list === "large"} onClick={() => chooseListSize("large")}>{mark(view === "list" && viewSizes.list === "large")}<UiIcon name="list"/><span>{labels.contentView}</span></button>
      </div>
      <div className="sf-view-menu-section">
        {toggle(labels.compactView, scale === "compact", false, onCompactChange)}
      </div>
      <div className="sf-view-menu-section" aria-label={labels.show}>
        <strong>{labels.show}</strong>
        {toggle(labels.folderNavigation, folderNavigation, !folderNavigationAvailable, onFolderNavigationChange)}
        {toggle(labels.detailsPane, detailsPane, !detailsPaneAvailable, onDetailsPaneChange)}
        {toggle(labels.showSizeColumn, columns.size, false, enabled => onColumnChange("size", enabled))}
        {toggle(labels.showTypeColumn, columns.type, false, enabled => onColumnChange("type", enabled))}
        {toggle(labels.showModifiedColumn, columns.modified, false, enabled => onColumnChange("modified", enabled))}
      </div>
    </div>}
  </div>;
}
