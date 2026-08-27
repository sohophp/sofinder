export const normalizeUploadExtension = (name: string, lowercase: boolean): string => {
  if (!lowercase) return name;
  const separator = name.lastIndexOf(".");
  return separator > 0 && separator < name.length - 1
    ? name.slice(0, separator + 1) + name.slice(separator + 1).toLowerCase()
    : name;
};
