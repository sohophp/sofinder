import { useEffect, useRef, type ReactNode } from "react";

export function Modal({ title, closeLabel, onClose, children, footer, className = "" }: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const panel = useRef<HTMLElement>(null);
  const titleId = useRef(`sf-dialog-${Math.random().toString(36).slice(2)}`);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = panel.current?.querySelector<HTMLElement>("[autofocus],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])");
    focusable?.focus();
    return () => previous?.focus();
  }, []);
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
    if (event.key !== "Tab" || !panel.current) return;
    const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <div className="sf-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={panel} className={`sf-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId.current} onKeyDown={onKeyDown}>
      <header><h2 id={titleId.current}>{title}</h2><button type="button" onClick={onClose} aria-label={closeLabel}>×</button></header>
      {children}
      {footer && <footer>{footer}</footer>}
    </section>
  </div>;
}
