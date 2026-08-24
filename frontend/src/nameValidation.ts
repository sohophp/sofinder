export type EntryNameIssue = "empty" | "tooLong" | "unsafe";

const unsafeCharacters = /[<>:"/\\|?*\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u;
const reservedWindowsName = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/iu;

export const entryNameIssue = (name: string, maximum: number): EntryNameIssue | null => {
  if (name.trim() === "") return "empty";
  if (Array.from(name).length > maximum) return "tooLong";
  if (name !== name.trim() || name.startsWith(".") || name.endsWith(".") || unsafeCharacters.test(name) || reservedWindowsName.test(name)) return "unsafe";
  return null;
};
