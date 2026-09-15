import type { ReactNode } from "react";

/** Render the usage title as a link; its parenthesized URL is only the destination. */
export function NotificationText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let offset = 0;
  for (const match of text.matchAll(/[（(]((?:https?:\/\/|\/(?!\/))[^\s<>"']+?)[)）]/gi)) {
    const href = match[1];
    if (!href || /[\\\u0000-\u001f\u007f]/.test(href)) continue;
    try {
      const url = new URL(href, window.location.href);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) continue;
    } catch { continue; }
    const before = text.slice(offset, match.index);
    const titleStart = Math.max(...[":", "：", ";", "；", "\n"].map(separator => before.lastIndexOf(separator))) + 1;
    const title = before.slice(titleStart).trim();
    if (!title) continue;
    const whitespace = before.slice(titleStart).match(/^\s*/)?.[0] ?? "";
    parts.push(before.slice(0, titleStart) + whitespace);
    parts.push(<a key={match.index} className="sf-notification-reference" href={href} target="_blank" rel="noopener noreferrer">{title}</a>);
    offset = match.index + match[0].length;
  }
  parts.push(text.slice(offset));
  return <>{parts}</>;
}
