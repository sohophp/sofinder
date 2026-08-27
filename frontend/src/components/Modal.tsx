import { useEffect, useRef, useState, type ReactNode } from "react";
import { UiIcon } from "./UiIcon";

export function Modal({ title, closeLabel, onClose, children, footer, className = "", maximizable = false }: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  maximizable?: boolean;
}) {
  const panel = useRef<HTMLElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
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
  return <div className="sf-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={panel} className={`sf-modal ${className}${fullscreen ? " sf-modal-fullscreen" : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId.current} onKeyDown={onKeyDown}>
      <header><h2 id={titleId.current}>{title}</h2><div className="sf-modal-header-actions">{maximizable && <button type="button" onClick={() => setFullscreen(value => !value)} aria-label={fullscreen ? fullscreenLabels.exit : fullscreenLabels.enter} title={fullscreen ? fullscreenLabels.exit : fullscreenLabels.enter}><UiIcon name={fullscreen ? "fullscreen-exit" : "fullscreen"}/></button>}<button type="button" onClick={onClose} aria-label={closeLabel}><UiIcon name="close"/></button></div></header>
      {children}
      {footer && <footer>{footer}</footer>}
    </section>
  </div>;
}
