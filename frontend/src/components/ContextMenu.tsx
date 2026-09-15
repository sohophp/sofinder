import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";

export interface MenuItem { id: string; label: string; disabled?: boolean; danger?: boolean }

export function ContextMenu({ x, y, items, onSelect, onClose }: { x: number; y: number; items: MenuItem[]; onSelect: (id: string) => void; onClose: () => void }) {
  const menu = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null);
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("pointerdown", close);
    window.addEventListener("resize", close);
    menu.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    return () => { window.removeEventListener("pointerdown", close); window.removeEventListener("resize", close); returnFocus.current?.focus(); };
  }, [onClose]);
  const onKeyDown = (event: ReactKeyboardEvent) => {
    const buttons = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
    if (event.key === "Escape" || event.key === "Tab") { if (event.key === "Escape") event.preventDefault(); onClose(); return; }
    if (!buttons.length || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Math.max(0, buttons.indexOf(document.activeElement as HTMLButtonElement));
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : event.key === "ArrowDown" ? (current + 1) % buttons.length : (current - 1 + buttons.length) % buttons.length;
    buttons[next].focus();
  };
  return <div ref={menu} className="sf-context-menu" role="menu" style={{ left: Math.max(8, Math.min(x, window.innerWidth - 220)), top: Math.max(8, Math.min(y, window.innerHeight - 320)) }} onPointerDown={event => event.stopPropagation()} onKeyDown={onKeyDown}>
    {items.map(item => <button role="menuitem" key={item.id} disabled={item.disabled} className={item.danger ? "danger" : ""} onClick={() => onSelect(item.id)}>{item.label}</button>)}
  </div>;
}
