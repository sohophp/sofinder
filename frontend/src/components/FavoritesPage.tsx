import { UiIcon } from "./UiIcon";

export default function FavoritesPage({ paths, search, locale, labels, onOpen, onRemove }: {
  paths: string[];
  search: string;
  locale: string;
  labels: { title: string; hint: string; empty: string; noMatch: string; home: string; open: string; remove: string };
  onOpen: (path: string) => void;
  onRemove: (path: string) => void;
}) {
  const term = search.trim().toLocaleLowerCase(locale);
  const filtered = paths.filter(path => term === "" || path.toLocaleLowerCase(locale).includes(term));

  return <section className="sf-favorites-page" aria-labelledby="sf-favorites-title">
    <header><div><span className="sf-favorites-mark"><UiIcon name="favorite"/></span><div><h2 id="sf-favorites-title">{labels.title}</h2><p>{labels.hint}</p></div></div><span>{filtered.length} / {paths.length}</span></header>
    {filtered.length === 0 ? <div className="sf-state">{paths.length === 0 ? labels.empty : labels.noMatch}</div> : <div className="sf-favorites-links">
      {filtered.map(path => <article key={path}><button className="sf-favorite-open" title={path} onClick={() => onOpen(path)}><span className="sf-favorites-mark"><UiIcon name="favorite"/></span><span><b>{path.split("/").pop()}</b><small>{path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : labels.home}</small></span><span className="sf-favorite-open-label">{labels.open}</span></button><button className="sf-favorite-remove" aria-label={`${labels.remove}: ${path}`} title={labels.remove} onClick={() => onRemove(path)}><UiIcon name="close"/></button></article>)}
    </div>}
  </section>;
}
