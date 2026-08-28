import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { EntryGroupMode } from "../entryPresentation";
import type { SortMode } from "../hooks/useBrowserState";
import { UiIcon } from "./UiIcon";

type Direction = "asc" | "desc";
type SubmenuLayout = { side: "left" | "right"; width: number };

const SUBMENU_WIDTH = 160;
const MINIMUM_SUBMENU_WIDTH = 96;
const SUBMENU_GAP = 6;
const VIEWPORT_MARGIN = 12;

export function SortMenu({ sort, direction, group, available, groupingAvailable, tagsEnabled, labels, onSortChange, onDirectionChange, onGroupChange, onOpen }: {
  sort: SortMode;
  direction: Direction;
  group: EntryGroupMode;
  available: boolean;
  groupingAvailable: boolean;
  tagsEnabled: boolean;
  labels: Record<"sort" | "name" | "modified" | "type" | "size" | "ascending" | "descending" | "groupBy" | "groupNone" | "tags", string>;
  onSortChange: (sort: SortMode) => void;
  onDirectionChange: (direction: Direction) => void;
  onGroupChange: (group: EntryGroupMode) => void;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [submenuLayout, setSubmenuLayout] = useState<SubmenuLayout>({ side: "right", width: SUBMENU_WIDTH });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const groupTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) { setOpen(false); setGroupOpen(false); }
    };
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (groupOpen) { setGroupOpen(false); groupTrigger.current?.focus(); return; }
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [groupOpen, open]);

  useLayoutEffect(() => {
    if (!groupOpen) return;
    const placeSubmenu = () => {
      const bounds = groupTrigger.current?.getBoundingClientRect();
      if (!bounds) return;
      const rightSpace = Math.max(0, window.innerWidth - bounds.right - SUBMENU_GAP - VIEWPORT_MARGIN);
      const leftSpace = Math.max(0, bounds.left - SUBMENU_GAP - VIEWPORT_MARGIN);
      const side = rightSpace >= MINIMUM_SUBMENU_WIDTH ? "right" : leftSpace >= MINIMUM_SUBMENU_WIDTH ? "left" : rightSpace >= leftSpace ? "right" : "left";
      const width = Math.min(SUBMENU_WIDTH, Math.floor(side === "right" ? rightSpace : leftSpace));
      setSubmenuLayout(current => current.side === side && current.width === width ? current : { side, width });
    };
    placeSubmenu();
    window.addEventListener("resize", placeSubmenu);
    return () => window.removeEventListener("resize", placeSubmenu);
  }, [groupOpen]);

  const mark = (selected: boolean) => <span className="sf-sort-menu-mark" aria-hidden="true">{selected ? "✓" : ""}</span>;
  const chooseSort = (value: SortMode) => { onSortChange(value); setOpen(false); setGroupOpen(false); };
  const chooseDirection = (value: Direction) => { onDirectionChange(value); setOpen(false); setGroupOpen(false); };
  const chooseGroup = (value: EntryGroupMode) => { onGroupChange(value); setOpen(false); setGroupOpen(false); };
  const sortOption = (value: SortMode, label: string) => <button type="button" role="menuitemradio" disabled={!available} aria-checked={sort === value} onClick={() => chooseSort(value)}>{mark(sort === value)}<span>{label}</span></button>;
  const groupOption = (value: EntryGroupMode, label: string) => <button type="button" role="menuitemradio" aria-checked={group === value} onClick={() => chooseGroup(value)}>{mark(group === value)}<span>{label}</span></button>;
  return <div ref={root} className="sf-sort-menu sf-utility">
    <button ref={trigger} type="button" className="sf-sort-menu-trigger" aria-label={labels.sort} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(current => { const next = !current; if (next) onOpen?.(); else setGroupOpen(false); return next; })}><UiIcon name="sort"/><span>{labels.sort}</span><UiIcon name="chevron-down"/></button>
    {open && <div className="sf-utility-menu sf-sort-menu-popup" role="menu" aria-label={labels.sort}>
      <div className="sf-sort-menu-section">
        {sortOption("name", labels.name)}
        {sortOption("modified", labels.modified)}
        {sortOption("type", labels.type)}
        {sortOption("size", labels.size)}
      </div>
      <div className="sf-sort-menu-section">
        <button type="button" className="sf-sort-direction-option" role="menuitemradio" disabled={!available} aria-checked={direction === "asc"} onClick={() => chooseDirection("asc")}>{mark(direction === "asc")}<UiIcon name="sort-asc"/><span>{labels.ascending}</span></button>
        <button type="button" className="sf-sort-direction-option" role="menuitemradio" disabled={!available} aria-checked={direction === "desc"} onClick={() => chooseDirection("desc")}>{mark(direction === "desc")}<UiIcon name="sort-desc"/><span>{labels.descending}</span></button>
      </div>
      <div className="sf-sort-menu-section sf-sort-group">
        <button ref={groupTrigger} type="button" role="menuitem" disabled={!groupingAvailable} aria-haspopup="menu" aria-expanded={groupOpen} onClick={() => setGroupOpen(current => !current)}><span className="sf-sort-menu-mark" aria-hidden="true">{group !== "none" ? "•" : ""}</span><span>{labels.groupBy}</span><UiIcon name="chevron-right"/></button>
        {groupOpen && <div className={`sf-utility-menu sf-sort-submenu opens-${submenuLayout.side}`} style={{ width: `${submenuLayout.width}px` }} role="menu" aria-label={labels.groupBy}>
          {groupOption("none", labels.groupNone)}
          {groupOption("name", labels.name)}
          {groupOption("modified", labels.modified)}
          {groupOption("type", labels.type)}
          {groupOption("size", labels.size)}
          {tagsEnabled && groupOption("tags", labels.tags)}
        </div>}
      </div>
    </div>}
  </div>;
}
