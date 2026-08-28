import type { DragEvent, KeyboardEvent, ReactNode } from "react";
import { UiIcon } from "./UiIcon";

export type SidebarSide = "left" | "right";
export type SidebarSectionId = "folderNavigation" | "quickAccess" | "favorites" | "recent";
export type SidebarLayout = Record<SidebarSide, SidebarSectionId[]>;

const sectionIds: SidebarSectionId[] = ["folderNavigation", "quickAccess", "favorites", "recent"];
const storageKey = "sofinder.sidebarLayout.v1";

export const loadSidebarLayout = (folderPlacement: SidebarSide): SidebarLayout => {
  const fallback: SidebarLayout = folderPlacement === "right"
    ? { left: ["quickAccess", "favorites", "recent"], right: ["folderNavigation"] }
    : { left: [...sectionIds], right: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<SidebarLayout> | null;
    if (!saved || !Array.isArray(saved.left) || !Array.isArray(saved.right)) return fallback;
    const seen = new Set<SidebarSectionId>();
    const clean = (items: unknown[]): SidebarSectionId[] => {
      const result: SidebarSectionId[] = [];
      for (const item of items) {
        if (!sectionIds.includes(item as SidebarSectionId) || seen.has(item as SidebarSectionId)) continue;
        seen.add(item as SidebarSectionId);
        result.push(item as SidebarSectionId);
      }
      return result;
    };
    const left = clean(saved.left);
    const right = clean(saved.right);
    for (const id of sectionIds) if (!seen.has(id)) left.push(id);
    return { left, right };
  } catch {
    return fallback;
  }
};

export const storeSidebarLayout = (layout: SidebarLayout) => localStorage.setItem(storageKey, JSON.stringify(layout));

export function SidebarSectionFrame({ id, side, title, dragging, children, onDragStart, onDragEnd, onDrop, onKeyboardMove }: {
  id: SidebarSectionId;
  side: SidebarSide;
  title: string;
  dragging: boolean;
  children: ReactNode;
  onDragStart: (id: SidebarSectionId) => void;
  onDragEnd: () => void;
  onDrop: (target: SidebarSectionId, side: SidebarSide, after: boolean) => void;
  onKeyboardMove: (id: SidebarSectionId, key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Home" | "End") => void;
}) {
  const dragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.dataset.dropPosition = event.clientY >= bounds.top + bounds.height / 2 ? "after" : "before";
  };
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const after = event.currentTarget.dataset.dropPosition === "after";
    delete event.currentTarget.dataset.dropPosition;
    onDrop(id, side, after);
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    onKeyboardMove(id, event.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Home" | "End");
  };
  return <div className={`sf-sidebar-section-frame${dragging ? " dragging" : ""}`} data-sidebar-section={id} data-sidebar-side={side} onDragOver={dragOver} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) delete event.currentTarget.dataset.dropPosition; }} onDrop={drop}>
    <button className="sf-sidebar-drag-handle" type="button" draggable title={title} aria-label={title} onDragStart={event => { event.stopPropagation(); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", id); onDragStart(id); }} onDragEnd={onDragEnd} onKeyDown={keyDown}><UiIcon name="grip"/></button>
    {children}
  </div>;
}
