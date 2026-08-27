import type { Entry } from "./types";

export type EntryTypeFilter = "all" | "folder" | "image" | "document" | "audio" | "video" | "archive" | "other";
export type EntryGroupMode = "none" | "name" | "type" | "size" | "modified" | "tags";
export type EntryCategory = Exclude<EntryTypeFilter, "all">;
export interface EntryGroup { key: string; label: string; entries: Entry[] }

const office = new Set(["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "rtf", "pdf"]);
const archives = new Set(["zip", "rar", "7z", "tar", "gz", "bz2", "xz"]);
const extension = (entry: Entry) => entry.name.includes(".") ? entry.name.split(".").pop()!.toLowerCase() : "";

export function entryCategory(entry: Entry): EntryCategory {
  if (entry.directory) return "folder";
  const mime = (entry.mimeType || "").toLowerCase();
  const ext = extension(entry);
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("text/") || mime.includes("document") || mime.includes("sheet") || mime.includes("presentation") || office.has(ext)) return "document";
  if (mime.includes("zip") || mime.includes("compressed") || mime.includes("archive") || archives.has(ext)) return "archive";
  return "other";
}

export function filterEntries(entries: Entry[], filter: EntryTypeFilter): Entry[] {
  return filter === "all" ? entries : entries.filter(entry => entryCategory(entry) === filter);
}

export function groupEntries(entries: Entry[], mode: EntryGroupMode, tags: Record<string, string[]>, now = Date.now()): EntryGroup[] {
  if (mode === "none") return [{ key: "all", label: "", entries }];
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const [key, label] = groupKey(entry, mode, tags, now);
    const id = `${key}\0${label}`;
    groups.set(id, [...(groups.get(id) || []), entry]);
  }
  return Array.from(groups, ([id, items]) => {
    const [key, label] = id.split("\0");
    return { key, label, entries: items };
  });
}

function groupKey(entry: Entry, mode: Exclude<EntryGroupMode, "none">, tags: Record<string, string[]>, now: number): [string, string] {
  if (mode === "type") { const value = entryCategory(entry); return [value, value]; }
  if (mode === "name") {
    const first = entry.name.trim().charAt(0).toUpperCase();
    if (/^[A-H]$/.test(first)) return ["name-a-h", "A–H"];
    if (/^[I-P]$/.test(first)) return ["name-i-p", "I–P"];
    if (/^[Q-Z]$/.test(first)) return ["name-q-z", "Q–Z"];
    if (/^[0-9]$/.test(first)) return ["name-number", "0–9"];
    return ["name-other", "#"];
  }
  if (mode === "size") {
    if (entry.directory) return ["folder", "folder"];
    if (entry.size === 0) return ["empty-size", "emptySize"];
    if (entry.size < 1_048_576) return ["small", "smallFiles"];
    if (entry.size < 104_857_600) return ["medium", "mediumFiles"];
    return ["large", "largeFiles"];
  }
  if (mode === "tags") {
    const tag = tags[entry.path]?.[0];
    return tag ? [`tag-${tag.toLocaleLowerCase()}`, tag] : ["untagged", "untagged"];
  }
  const age = Math.max(0, now - entry.modifiedAt * 1000);
  if (age < 86_400_000) return ["today", "today"];
  if (age < 604_800_000) return ["this-week", "thisWeek"];
  if (age < 2_678_400_000) return ["this-month", "thisMonth"];
  return ["earlier", "earlier"];
}
