import { useCallback, useEffect, useState } from "react";
import type { Api } from "../api";
import type { Entry } from "../types";
import { UiIcon } from "./UiIcon";

interface NodeState { loading: boolean; loaded: boolean; expanded: boolean; children: Entry[] }

export function FolderTree({ api, resource, currentPath, rootLabel, onNavigate }: {
  api: Api; resource: string; currentPath: string; rootLabel: string; onNavigate: (path: string) => void;
}) {
  const [nodes, setNodes] = useState<Record<string, NodeState>>({ "": { loading: false, loaded: false, expanded: true, children: [] } });
  const load = useCallback(async (path: string, expand = true) => {
    setNodes(current => ({ ...current, [path]: { ...(current[path] || { children: [], loaded: false }), loading: true, expanded: expand } }));
    try {
      const result = await api.list(resource, path, "", "name", "asc", 0, 500);
      setNodes(current => ({ ...current, [path]: { loading: false, loaded: true, expanded: expand, children: result.entries.filter(entry => entry.directory) } }));
    } catch {
      setNodes(current => ({ ...current, [path]: { ...(current[path] || { children: [], loaded: false }), loading: false, expanded: expand } }));
    }
  }, [api, resource]);

  useEffect(() => {
    setNodes({ "": { loading: false, loaded: false, expanded: true, children: [] } });
    void load("");
  }, [load, resource]);

  useEffect(() => {
    const parts = currentPath === "" ? [] : currentPath.split("/");
    parts.forEach((_, index) => {
      const ancestor = parts.slice(0, index + 1).join("/");
      if (!nodes[ancestor]?.loaded && !nodes[ancestor]?.loading) void load(ancestor);
    });
  }, [currentPath, load, nodes]);

  const toggle = (path: string) => {
    const state = nodes[path];
    if (!state?.loaded) { void load(path); return; }
    setNodes(current => ({ ...current, [path]: { ...current[path], expanded: !current[path].expanded } }));
  };
  const branch = (parent: string, level: number): React.ReactNode => {
    const node = nodes[parent];
    if (!node?.expanded) return null;
    return node.children.map(folder => <div key={folder.path}>
      <div className={`sf-tree-row ${currentPath === folder.path ? "active" : ""}`} style={{ paddingInlineStart: `${4 + level * 14}px` }}>
        <button className="sf-tree-toggle" onClick={() => toggle(folder.path)} aria-expanded={nodes[folder.path]?.expanded || false} aria-label={folder.name}>{nodes[folder.path]?.loading ? <span className="sf-tree-loading">…</span> : <UiIcon name={nodes[folder.path]?.expanded ? "chevron-down" : "chevron-right"}/>}</button>
        <button className="sf-tree-name" onClick={() => onNavigate(folder.path)} title={folder.path}><UiIcon name="folder"/><span>{folder.name}</span></button>
      </div>
      {branch(folder.path, level + 1)}
    </div>);
  };

  return <nav className="sf-folder-tree" aria-label={rootLabel}>
    <div className={`sf-tree-row ${currentPath === "" ? "active" : ""}`}><button className="sf-tree-toggle" onClick={() => toggle("")} aria-expanded={nodes[""]?.expanded || false} aria-label={rootLabel}>{nodes[""]?.loading ? <span className="sf-tree-loading">…</span> : <UiIcon name={nodes[""]?.expanded ? "chevron-down" : "chevron-right"}/>}</button><button className="sf-tree-name" onClick={() => onNavigate("")}><UiIcon name="folder"/><span>{rootLabel}</span></button></div>
    {branch("", 1)}
  </nav>;
}
