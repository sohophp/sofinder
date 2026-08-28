import { useState, type MouseEvent, type ReactNode } from "react";
import { UiIcon } from "./UiIcon";
import type { QuickAccessEntry } from "../types";

export interface QuickAccessLink extends QuickAccessEntry { resource: string }
export interface RecentLink { path: string; touchedAt: number }

export function RecentPanel({ variant, items, labels, onOpen }: { variant: "sidebar" | "mobile"; items: RecentLink[]; labels: { title: string; empty: string; home: string }; onOpen: (path: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  if (variant === "sidebar") return <div className={`sf-recent sf-recent-sidebar${collapsed ? " collapsed" : ""}`}>
    <SectionHeader title={labels.title} count={items.length} collapsed={collapsed} onToggle={() => setCollapsed(value => !value)}/>
    <SectionContent collapsed={collapsed}>{items.length === 0 ? <p className="sf-recent-empty">{labels.empty}</p> : items.slice(0, 8).map(item => <button key={item.path} title={item.path} onClick={() => onOpen(item.path)}><span className="sf-recent-icon"><UiIcon name="history"/></span><span><b>{item.path.split("/").pop()}</b><small>{parent(item.path, labels.home)}</small></span></button>)}</SectionContent>
  </div>;
  return <div className={`sf-recent sf-recent-${variant}`}>
    <header><strong>{labels.title}</strong><span>{items.length}</span></header>
    {items.length === 0 ? <p className="sf-recent-empty">{labels.empty}</p> : items.slice(0, 8).map(item => <button key={item.path} title={item.path} onClick={() => onOpen(item.path)}><span className="sf-recent-icon"><UiIcon name="history"/></span><span><b>{item.path.split("/").pop()}</b><small>{parent(item.path, labels.home)}</small></span></button>)}
  </div>;
}

interface MetadataSidebarProps {
  favorites: string[];
  quickAccessByResource: Record<string, QuickAccessEntry[]>;
  resources: Array<{ name: string }>;
  currentResource: string;
  quickAccessScope: "all" | "resource";
  showFavorites: boolean;
  showQuickAccess: boolean;
  favoritesActive: boolean;
  labels: { favorites: string; favoritesEmpty: string; quickAccess: string; quickAccessEmpty: string; home: string; more: string; missing: string };
  onOpenFavorites: () => void;
  onOpenFavorite: (path: string) => void;
  onOpenQuickAccess: (link: QuickAccessLink) => void;
  onQuickAccessContext: (link: QuickAccessLink, event: MouseEvent<HTMLButtonElement>) => void;
  onFavoriteContext: (path: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export function QuickAccessPanel({ quickAccessByResource, resources, currentResource, quickAccessScope, labels, onOpenQuickAccess, onQuickAccessContext }: MetadataSidebarProps) {
  const [quickCollapsed, setQuickCollapsed] = useState(false);
  const quickAccess: QuickAccessLink[] = quickAccessScope === "resource"
    ? (quickAccessByResource[currentResource] || []).map(entry => ({ resource: currentResource, ...entry }))
    : resources.flatMap(item => (quickAccessByResource[item.name] || []).map(entry => ({ resource: item.name, ...entry })));
  const pinnedFolders = quickAccess.filter(link => link.directory !== false);
  return <div className={`sf-recent sf-recent-sidebar${quickCollapsed ? " collapsed" : ""}`}>
    <SectionHeader title={labels.quickAccess} count={pinnedFolders.length} collapsed={quickCollapsed} onToggle={() => setQuickCollapsed(value => !value)}/>
    <SectionContent collapsed={quickCollapsed}>
    {pinnedFolders.length === 0 ? <p className="sf-recent-empty">{labels.quickAccessEmpty}</p> : pinnedFolders.slice(0, 12).map(link => <button className={link.exists ? "" : "missing"} key={`${link.resource}:${link.path}`} title={link.exists ? `${link.resource}: ${link.path}` : labels.missing} onClick={() => onOpenQuickAccess(link)} onContextMenu={event => onQuickAccessContext(link, event)}><span className="sf-recent-icon"><UiIcon name={!link.exists ? "warning" : "folder"}/></span><span><b>{link.name}</b><small>{link.exists ? (quickAccessScope === "all" ? `${link.resource} · ${parent(link.path, labels.home)}` : parent(link.path, labels.home)) : labels.missing}</small></span></button>)}
    {pinnedFolders.length > 12 && <small className="sf-sidebar-overflow">+{pinnedFolders.length - 12} {labels.more}</small>}
    </SectionContent>
  </div>;
}

export function FavoritesPanel({ favorites, currentResource, favoritesActive, labels, onOpenFavorites, onOpenFavorite, onFavoriteContext }: MetadataSidebarProps) {
  const [favoritesCollapsed, setFavoritesCollapsed] = useState(false);
  const favoritesUrl = new URL(window.location.href);
  favoritesUrl.searchParams.set("type", currentResource);
  favoritesUrl.searchParams.set("collection", "favorites");
  const favoritesHref = `${favoritesUrl.pathname}${favoritesUrl.search}${favoritesUrl.hash}`;
  return <div className={`sf-recent sf-recent-sidebar${favoritesCollapsed ? " collapsed" : ""}`}>
      <SectionHeader title={labels.favorites} count={favorites.length} collapsed={favoritesCollapsed} onToggle={() => setFavoritesCollapsed(value => !value)}/>
      <SectionContent collapsed={favoritesCollapsed}>
      {favorites.length === 0 ? <p className="sf-recent-empty">{labels.favoritesEmpty}</p> : favorites.slice(0, 8).map(path => <button key={path} title={path} onClick={() => onOpenFavorite(path)} onContextMenu={event => onFavoriteContext(path, event)}><span className="sf-recent-icon"><UiIcon name="favorite"/></span><span><b>{path.split("/").pop()}</b><small>{parent(path, labels.home)}</small></span></button>)}
      {favorites.length > 8 && <small className="sf-sidebar-overflow">+{favorites.length - 8} {labels.more}</small>}
      <a className={`sf-sidebar-section-link${favoritesActive ? " active" : ""}`} href={favoritesHref} onClick={event => { event.preventDefault(); onOpenFavorites(); }}><span>{labels.favorites}</span><UiIcon name="chevron-right"/></a>
      </SectionContent>
    </div>;
}

export default function MetadataSidebarPanels(props: MetadataSidebarProps) {
  return <>
    {props.showQuickAccess && <QuickAccessPanel {...props}/>}
    {props.showFavorites && <FavoritesPanel {...props}/>}
  </>;
}

function SectionHeader({ title, count, collapsed, onToggle }: { title: string; count: number; collapsed: boolean; onToggle: () => void }) {
  return <header><button type="button" className="sf-sidebar-section-toggle" aria-label={title} aria-expanded={!collapsed} onClick={onToggle}><strong>{title}</strong><span>{count}<UiIcon name="chevron-down"/></span></button></header>;
}

function SectionContent({ children, collapsed }: { children: ReactNode; collapsed: boolean }) {
  return <div className="sf-sidebar-section-content" aria-hidden={collapsed} inert={collapsed}><div>{children}</div></div>;
}

const parent = (path: string, home: string) => path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : home;
