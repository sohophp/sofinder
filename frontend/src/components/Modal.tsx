import { useEffect, useRef, useState, type ReactNode } from "react";
import { UiIcon } from "./UiIcon";

export function Modal({ title, closeLabel, onClose, children, footer, className = "", maximizable = false, inactive = false }: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  maximizable?: boolean;
  /** Marks a parent dialog inactive while a nested confirmation owns focus. */
  inactive?: boolean;
}) {
  const panel = useRef<HTMLElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; minX: number; maxX: number; minY: number; maxY: number } | null>(null);
  const language = document.documentElement.lang.toLowerCase();
  const fullscreenLabels = language === "zh-tw" ? { enter: "全螢幕", exit: "退出全螢幕" } : language.startsWith("zh") ? { enter: "全屏", exit: "退出全屏" } : { enter: "Full screen", exit: "Exit full screen" };
  const titleId = useRef(`sf-dialog-${Math.random().toString(36).slice(2)}`);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = panel.current?.querySelector<HTMLElement>("[autofocus],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])");
    focusable?.focus();
    return () => previous?.focus();
  }, []);
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); if (fullscreen) setFullscreen(false); else onClose(); return; }
    if (event.key !== "Tab" || !panel.current) return;
    const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const beginDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (fullscreen || event.button !== 0 || (event.target instanceof Element && event.target.closest("button")) || !panel.current) return;
    const rect = panel.current.getBoundingClientRect();
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y, minX: position.x - rect.left, maxX: position.x + window.innerWidth - rect.right, minY: position.y - rect.top, maxY: position.y + window.innerHeight - rect.bottom };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    setPosition({ x: Math.max(current.minX, Math.min(current.maxX, current.originX + event.clientX - current.startX)), y: Math.max(current.minY, Math.min(current.maxY, current.originY + event.clientY - current.startY)) });
  };
  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="sf-modal-backdrop" role="presentation" aria-hidden={inactive || undefined} inert={inactive || undefined} onMouseDown={event => { if (!inactive && event.target === event.currentTarget) onClose(); }}>
    <section ref={panel} className={`sf-modal ${className}${fullscreen ? " sf-modal-fullscreen" : ""}`} style={fullscreen ? undefined : { transform: `translate(${position.x}px, ${position.y}px)` }} role="dialog" aria-modal="true" aria-labelledby={titleId.current} onKeyDown={onKeyDown}>
      <header onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}><h2 id={titleId.current}>{title}</h2><div className="sf-modal-header-actions">{maximizable && <button type="button" onClick={() => setFullscreen(value => !value)} aria-label={fullscreen ? fullscreenLabels.exit : fullscreenLabels.enter} title={fullscreen ? fullscreenLabels.exit : fullscreenLabels.enter}><UiIcon name={fullscreen ? "fullscreen-exit" : "fullscreen"}/></button>}<button type="button" onClick={onClose} aria-label={closeLabel}><UiIcon name="close"/></button></div></header>
      {children}
      {footer && <footer>{footer}</footer>}
    </section>
  </div>;
}
