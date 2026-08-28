import { useMemo, useState } from "react";
import type { UiScale, UploadConflictStrategy } from "../types";
import type { FeaturePreferences, FolderTreePlacement, ListColumnPreferences, QuickAccessScope, ToolPreferences, ViewSizePreferences } from "./SettingsDialog";

export interface PreferenceSnapshot {
  tools: ToolPreferences;
  features: FeaturePreferences;
  columns: ListColumnPreferences;
  viewSizes: ViewSizePreferences;
  folderTreePlacement: FolderTreePlacement;
  quickAccessScope: QuickAccessScope;
  scale: UiScale;
  uploadConflictStrategy: UploadConflictStrategy;
}

interface PreferenceProfile { id: string; name: string; updatedAt: number; settings: PreferenceSnapshot }
const storageKey = "sofinder.preferenceProfiles.v1";
const maximumProfiles = 10;
const profileLabels = {
  en: { title: "Preferences and presets", hint: "Restore a built-in layout preset, or save the complete current settings as a named profile.", preset: "Choose a built-in preset", standard: "Standard layout", compact: "Compact layout", spacious: "Large-screen layout", restore: "Restore preset", restored: "Built-in preset restored.", reset: "Restore system defaults", resetDone: "System defaults restored.", name: "Profile name", save: "Save current", choose: "Choose a profile", apply: "Apply", remove: "Delete profile", saved: "Preference profile saved.", applied: "Preference profile applied.", empty: "No saved profiles", maximum: "profiles maximum" },
  "zh-cn": { title: "偏好与预设", hint: "可以恢复内置布局预设，也可以把当前整套设置保存为命名方案。", preset: "选择内置预设", standard: "标准布局", compact: "紧凑布局", spacious: "大屏布局", restore: "恢复预设", restored: "已恢复内置预设。", reset: "恢复系统默认", resetDone: "已恢复系统默认设置。", name: "偏好名称", save: "保存当前设置", choose: "选择偏好方案", apply: "应用", remove: "删除方案", saved: "偏好方案已保存。", applied: "偏好方案已应用。", empty: "暂无已保存方案", maximum: "个方案上限" },
  "zh-tw": { title: "偏好與預設", hint: "可以還原內建版面預設，也可以將目前整套設定儲存為命名方案。", preset: "選擇內建預設", standard: "標準版面", compact: "緊湊版面", spacious: "大螢幕版面", restore: "還原預設", restored: "已還原內建預設。", reset: "還原系統預設", resetDone: "已還原系統預設設定。", name: "偏好名稱", save: "儲存目前設定", choose: "選擇偏好方案", apply: "套用", remove: "刪除方案", saved: "偏好方案已儲存。", applied: "偏好方案已套用。", empty: "暫無已儲存方案", maximum: "個方案上限" },
} as const;

const booleanRecord = (value: unknown, keys: string[]) => typeof value === "object" && value !== null && keys.every(key => typeof (value as Record<string, unknown>)[key] === "boolean");
const validSnapshot = (value: unknown): value is PreferenceSnapshot => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  const sizes = item.viewSizes as Record<string, unknown> | null;
  const features = item.features as Record<string, unknown> | null;
  return booleanRecord(item.tools, ["resize", "crop", "rotate", "presets", "process", "batchRename"])
    && booleanRecord(item.features, ["recent", "favorites", "tags", "archive", "trash", "folderTree", "qrCode", "autoCollapseUploads"])
    && features !== null && [features.sidebarFavorites, features.sidebarQuickAccess, features.quickAccessFiles].every(value => value === undefined || typeof value === "boolean")
    && booleanRecord(item.columns, ["size", "modified", "type"])
    && typeof sizes === "object" && sizes !== null && [sizes.grid, sizes.list].every(size => size === "small" || size === "medium" || size === "large")
    && (item.folderTreePlacement === "left" || item.folderTreePlacement === "right")
    && (item.quickAccessScope === undefined || item.quickAccessScope === "all" || item.quickAccessScope === "resource")
    && ["compact", "standard", "large", "xlarge"].includes(String(item.scale))
    && ["ask", "rename", "overwrite", "skip"].includes(String(item.uploadConflictStrategy));
};
const loadProfiles = (): PreferenceProfile[] => {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "[]") as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter((profile): profile is PreferenceProfile => typeof profile === "object" && profile !== null && typeof profile.id === "string" && typeof profile.name === "string" && profile.name.length > 0 && profile.name.length <= 40 && Number.isFinite(profile.updatedAt) && validSnapshot(profile.settings)).map(profile => ({ ...profile, settings: { ...profile.settings, features: { ...profile.settings.features, sidebarFavorites: profile.settings.features.sidebarFavorites !== false, sidebarQuickAccess: profile.settings.features.sidebarQuickAccess !== false, quickAccessFiles: false }, quickAccessScope: profile.settings.quickAccessScope === "resource" ? "resource" as const : "all" as const } })).slice(0, maximumProfiles);
  } catch { return []; }
};
const storeProfiles = (profiles: PreferenceProfile[]) => localStorage.setItem(storageKey, JSON.stringify(profiles.slice(0, maximumProfiles)));

export function PreferenceProfiles({ current, onApply, onReset }: {
  current: PreferenceSnapshot;
  onApply: (settings: PreferenceSnapshot) => void;
  onReset: () => void;
}) {
  const documentLanguage = document.documentElement.lang.toLowerCase();
  const labels = profileLabels[documentLanguage === "zh-tw" ? "zh-tw" : documentLanguage.startsWith("zh") ? "zh-cn" : "en"];
  const [profiles, setProfiles] = useState(loadProfiles);
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [presetId, setPresetId] = useState<"standard" | "compact" | "spacious">("standard");
  const [status, setStatus] = useState("");
  const selected = useMemo(() => profiles.find(profile => profile.id === selectedId), [profiles, selectedId]);
  const save = () => {
    const normalized = name.trim().slice(0, 40);
    if (!normalized) return;
    const existing = profiles.find(profile => profile.name.toLocaleLowerCase() === normalized.toLocaleLowerCase());
    const profile: PreferenceProfile = { id: existing?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: normalized, updatedAt: Date.now(), settings: structuredClone(current) };
    const next = [profile, ...profiles.filter(item => item.id !== profile.id)].slice(0, maximumProfiles);
    setProfiles(next); storeProfiles(next); setSelectedId(profile.id); setName(""); setStatus(labels.saved);
  };
  const apply = () => { if (selected) { onApply(structuredClone(selected.settings)); setStatus(labels.applied); } };
  const restorePreset = () => {
    const compact = presetId === "compact";
    const spacious = presetId === "spacious";
    onApply({ ...structuredClone(current), scale: compact ? "compact" : spacious ? "large" : "standard", viewSizes: { grid: compact ? "small" : spacious ? "large" : "medium", list: compact ? "small" : spacious ? "large" : "medium" }, columns: { size: true, modified: !compact, type: spacious } });
    setStatus(labels.restored);
  };
  const remove = () => {
    if (!selected) return;
    const next = profiles.filter(profile => profile.id !== selected.id);
    setProfiles(next); storeProfiles(next); setSelectedId(""); setStatus("");
  };
  return <section className="sf-preference-profiles">
    <h3>{labels.title}</h3><p>{labels.hint}</p>
    <div className="sf-preference-presets"><select value={presetId} aria-label={labels.preset} onChange={event => setPresetId(event.target.value as typeof presetId)}><option value="standard">{labels.standard}</option><option value="compact">{labels.compact}</option><option value="spacious">{labels.spacious}</option></select><button type="button" onClick={restorePreset}>{labels.restore}</button><button type="button" onClick={() => { onReset(); setStatus(labels.resetDone); }}>{labels.reset}</button></div>
    <div className="sf-preference-save"><input value={name} maxLength={40} placeholder={labels.name} aria-label={labels.name} onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); save(); } }}/><button type="button" disabled={name.trim() === ""} onClick={save}>{labels.save}</button></div>
    <div className="sf-preference-apply"><select value={selectedId} aria-label={labels.choose} onChange={event => { setSelectedId(event.target.value); setStatus(""); }}><option value="">{profiles.length === 0 ? labels.empty : labels.choose}</option>{profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select><button type="button" className="primary" disabled={!selected} onClick={apply}>{labels.apply}</button><button type="button" className="danger" disabled={!selected} onClick={remove}>{labels.remove}</button></div>
    <div className="sf-preference-meta"><small>{profiles.length} / {maximumProfiles} {labels.maximum}</small><span role="status" aria-live="polite">{status}</span></div>
  </section>;
}
