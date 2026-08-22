import { useEffect, useRef } from "react";

export interface MenuItem { id: string; label: string; disabled?: boolean; danger?: boolean }

export function ContextMenu({ x, y, items, onSelect, onClose }: { x: number; y: number; items: MenuItem[]; onSelect: (id: string) => void; onClose: () => void }) {
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("pointerdown", close);
    window.addEventListener("resize", close);
    menu.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    return () => { window.removeEventListener("pointerdown", close); window.removeEventListener("resize", close); };
  }, [onClose]);
  return <div ref={menu} className="sf-context-menu" role="menu" style={{ left: Math.min(x, window.innerWidth - 220), top: Math.min(y, window.innerHeight - 320) }} onPointerDown={event => event.stopPropagation()} onKeyDown={event => { if (event.key === "Escape") onClose(); }}>
    {items.map(item => <button role="menuitem" key={item.id} disabled={item.disabled} className={item.danger ? "danger" : ""} onClick={() => onSelect(item.id)}>{item.label}</button>)}
  </div>;
}
