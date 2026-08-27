import type english from "./locales/en";

export type MessageKey = keyof typeof english;
export type Language = "en" | "zh-cn" | "zh-tw";
export type Messages = Record<MessageKey, string>;

const loaders: Record<Language, () => Promise<{ default: Messages }>> = {
  en: () => import("./locales/en"),
  "zh-cn": () => import("./locales/zh-cn"),
  "zh-tw": () => import("./locales/zh-tw"),
};

export const loadMessages = async (language: Language): Promise<Messages> => (await loaders[language]()).default;
export const translator = (messages: Messages) => (key: MessageKey): string => messages[key];
export const preferredLanguage = (fallback: Language): Language => {
  const saved = localStorage.getItem("sofinder.language");
  return saved === "en" || saved === "zh-cn" || saved === "zh-tw" ? saved : fallback;
};
