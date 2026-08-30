import { UiIcon } from "./UiIcon";
import type { RecentLink } from "./MetadataSidebarPanels";

export default function RecentPage({ items, search, locale, labels, onOpen }: {
  items: RecentLink[];
  search: string;
  locale: string;
  labels: { title: string; hint: string; empty: string; noMatch: string; home: string; open: string };
  onOpen: (path: string) => void;
}) {
  const term = search.trim().toLocaleLowerCase(locale);
  const filtered = items.filter(item => term === "" || item.path.toLocaleLowerCase(locale).includes(term));

  return <section className="sf-favorites-page" aria-labelledby="sf-recent-title">
    <header><div><span className="sf-favorites-mark"><UiIcon name="history"/></span><div><h2 id="sf-recent-title">{labels.title}</h2><p>{labels.hint}</p></div></div><span>{filtered.length} / {items.length}</span></header>
    {filtered.length === 0 ? <div className="sf-state">{items.length === 0 ? labels.empty : labels.noMatch}</div> : <div className="sf-favorites-links">
      {filtered.map(item => <article key={item.path}><button className="sf-favorite-open" title={item.path} onClick={() => onOpen(item.path)}><span className="sf-favorites-mark"><UiIcon name="history"/></span><span><b>{item.path.split("/").pop()}</b><small>{item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : labels.home}</small></span><span className="sf-favorite-open-label">{labels.open}</span></button></article>)}
    </div>}
  </section>;
}