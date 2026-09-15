import { useEffect, useRef, useState } from "react";
import { Api, ApiError } from "../api";
import type { UploadTask } from "../components/UploadQueue";
import type { MessageKey } from "../i18n";
import { entryNameIssue } from "../nameValidation";
import type { ResourceType, UploadConflictStrategy } from "../types";
import { normalizeUploadExtension } from "../uploadNaming";

interface Confirmation { title: string; message: string; detail?: string; danger?: boolean }

const uploadFileWithName = (file: File, name: string): File => name === file.name
  ? file
  : new File([file], name, { type: file.type, lastModified: file.lastModified });

export function useUploads({ api, resource, path, currentResource, currentDepth, autoCollapse, conflictStrategy, lowercaseExtensions, t, ask, chooseConflict, reload, setNotice, report, onComplete }: {
  api: Api;
  resource: string;
  path: string;
  currentResource?: ResourceType;
  currentDepth: number;
  autoCollapse: boolean;
  conflictStrategy: UploadConflictStrategy;
  lowercaseExtensions: boolean;
  t: (key: MessageKey) => string;
  ask: (confirmation: Confirmation) => Promise<boolean>;
  chooseConflict: (fileName: string) => Promise<{ strategy: Exclude<UploadConflictStrategy, "ask">; remember: boolean }>;
  reload: () => Promise<void>;
  setNotice: (notice: string, details?: string[], kind?: "info" | "success" | "warning" | "error") => void;
  report: (error: unknown) => void;
  onComplete?: (summary: { total: number; completed: number; failed: number; details: string[] }) => void;
}) {
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [uploadsCollapsed, setUploadsCollapsed] = useState(false);
  const uploadInput = useRef<HTMLInputElement>(null);
  const directoryUploadInput = useRef<HTMLInputElement>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const retryData = useRef(new Map<string, { file: File; targetPath: string }>());
  const sequence = useRef(0);
  const conflictQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const interrupted = api.pendingUploads().map(session => ({ id: `pending-${session.id}`, name: session.name, progress: 0, status: "error" as const, message: t("uploadReselectToResume") }));
    if (interrupted.length > 0) {
      setUploads(current => [...current.filter(task => !task.id.startsWith("pending-")), ...interrupted]);
      setUploadsCollapsed(false);
    }
  }, [api, t]);

  useEffect(() => {
    if (!autoCollapse || uploads.length === 0 || uploads.some(task => task.status === "queued" || task.status === "uploading")) return;
    const timer = window.setTimeout(() => setUploadsCollapsed(true), 1200);
    return () => window.clearTimeout(timer);
  }, [autoCollapse, uploads]);

  const update = (id: string, values: Partial<UploadTask>) => {
    setUploads(current => current.map(task => task.id === id ? { ...task, ...values } : task));
  };

  const upload = async (files: FileList | File[], targetPath = path, notifyCompletion = true, batchPreference = { strategy: null as Exclude<UploadConflictStrategy, "ask"> | null }) => {
    const candidates = Array.from(files).map(file => uploadFileWithName(file, normalizeUploadExtension(file.name, lowercaseExtensions)));
    const validNames = currentResource ? candidates.filter(file => entryNameIssue(file.name, currentResource.maxFileNameLength) === null) : candidates;
    if (validNames.length !== candidates.length && currentResource) {
      const issues = candidates.map(file => entryNameIssue(file.name, currentResource.maxFileNameLength)).filter(issue => issue !== null);
      setNotice(issues.includes("tooLong") ? `${t("fileNameTooLong")} ${currentResource.maxFileNameLength}` : t("invalidEntryName"));
    }
    const allowedExtensions = new Set((currentResource?.allowedExtensions || []).map(extension => extension.toLowerCase().replace(/^\./, "")));
    const accepted = validNames.filter(file => {
      const dot = file.name.lastIndexOf(".");
      const extension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "";
      return extension !== "" && (allowedExtensions.size === 0 || allowedExtensions.has(extension));
    });
    const rejectedExtensions = validNames.filter(file => !accepted.includes(file));
    if (rejectedExtensions.length > 0) {
      setNotice(t("uploadUnsupportedFiles").replace("{count}", String(rejectedExtensions.length)), rejectedExtensions.map(file => file.name), "warning");
    }
    const jobs = accepted.map(file => {
      const id = `${Date.now()}-${++sequence.current}`;
      const controller = new AbortController();
      controllers.current.set(id, controller);
      retryData.current.set(id, { file, targetPath });
      const pending = api.findPendingUpload(resource, targetPath, file, false);
      return { id, file, controller, pendingId: pending ? `pending-${pending.id}` : null };
    });
    const resolveConflict = (fileName: string): Promise<Exclude<UploadConflictStrategy, "ask">> => {
      if (conflictStrategy !== "ask") return Promise.resolve(conflictStrategy);
      const choice = conflictQueue.current.then(async () => {
        if (batchPreference.strategy !== null) return batchPreference.strategy;
        const answer = await chooseConflict(fileName);
        if (answer.remember) batchPreference.strategy = answer.strategy;
        return answer.strategy;
      });
      conflictQueue.current = choice.then(() => undefined, () => undefined);
      return choice;
    };
    if (jobs.length === 0) return;
    setUploadsCollapsed(false);
    const resumedIds = new Set(jobs.map(job => job.pendingId).filter((id): id is string => id !== null));
    setUploads(current => [...current.filter(task => !resumedIds.has(task.id)), ...jobs.map(({ id, file, pendingId }) => ({ id, name: file.name, progress: 0, status: "queued" as const, message: pendingId ? t("uploadResuming") : undefined }))]);

    let cursor = 0;
    const results = new Map<string, string>();
    const worker = async () => {
      while (cursor < jobs.length) {
        const job = jobs[cursor++];
        if (job.controller.signal.aborted) { controllers.current.delete(job.id); continue; }
        update(job.id, { status: "uploading", progress: 0, message: undefined });
        let overwrite = conflictStrategy === "overwrite";
        let autoRename = conflictStrategy === "rename";
        try {
          for (;;) {
            try {
              await api.upload(resource, targetPath, job.file, { overwrite, autoRename, signal: job.controller.signal, onProgress: progress => update(job.id, { progress }) });
              update(job.id, { status: "done", progress: 100 });
              results.set(job.id, `${job.file.name}: ${t("done")}`);
              break;
            } catch (error) {
              if (error instanceof ApiError && error.code === "conflict" && !overwrite && !autoRename) {
                const strategy = await resolveConflict(job.file.name);
                if (strategy === "skip") {
                  update(job.id, { status: "skipped", progress: 0, message: undefined });
                  results.set(job.id, `${job.file.name}: ${t("skipped")}`);
                  break;
                }
                overwrite = strategy === "overwrite";
                autoRename = strategy === "rename";
                update(job.id, { progress: 0 });
                continue;
              }
              throw error;
            }
          }
        } catch (error) {
          const failed = !(error instanceof DOMException && error.name === "AbortError");
          const message = error instanceof ApiError && error.code === "invalid_extension"
            ? t("uploadExtensionRejected")
            : error instanceof ApiError && error.code === "invalid_mime_type"
            ? t("uploadMimeRejected")
            : error instanceof ApiError && ["invalid_image", "unsupported_image"].includes(error.code)
            ? t("uploadImageRejected")
            : error instanceof ApiError && error.code === "malware_detected" ? t("uploadMalwareRejected")
            : error instanceof Error ? error.message : t("error");
          update(job.id, error instanceof DOMException && error.name === "AbortError"
            ? { status: "cancelled", message: t("cancelled") }
            : { status: "error", message });
          results.set(job.id, `${job.file.name}: ${failed ? message : t("cancelled")}`);
        } finally { controllers.current.delete(job.id); }
      }
    };
    await Promise.all(Array.from({ length: Math.min(3, jobs.length) }, () => worker()));
    await reload();
    const details = jobs.map(job => results.get(job.id) || `${job.file.name}: ${t("cancelled")}`);
    const failed = details.filter(detail => !detail.endsWith(`: ${t("done")}`)).length;
    const summary = { total: jobs.length, completed: jobs.length - failed, failed, details };
    if (notifyCompletion) onComplete?.(summary);
    return summary;
  };

  const uploadDirectory = async (files: FileList) => {
    if (!currentResource) return;
    const candidates = Array.from(files);
    if (candidates.length > 500) { setNotice(t("folderUploadTooMany")); return; }
    const directories = new Set<string>();
    const groups = new Map<string, File[]>();
    for (const file of candidates) {
      const relative = file.webkitRelativePath.replace(/\\/g, "/").split("/").filter(Boolean);
      if (relative.length < 2 || relative.some(segment => entryNameIssue(segment, segment === relative.at(-1) ? currentResource.maxFileNameLength : currentResource.maxFolderNameLength) !== null)) { setNotice(t("invalidEntryName")); return; }
      const folderSegments = relative.slice(0, -1);
      if (currentDepth + folderSegments.length > currentResource.maxFolderDepth) { setNotice(t("folderDepthReached")); return; }
      folderSegments.forEach((_segment, index) => directories.add(folderSegments.slice(0, index + 1).join("/")));
      const target = [path, ...folderSegments].filter(Boolean).join("/");
      groups.set(target, [...(groups.get(target) || []), file]);
    }
    const roots = Array.from(directories).filter(directory => !directory.includes("/")).slice(0, 5);
    if (!await ask({ title: t("uploadFolder"), message: `${candidates.length} ${t("files")} · ${directories.size} ${t("folder")}`, detail: `${t("folderUploadPreview")}: ${roots.join(", ")}${Array.from(directories).filter(directory => !directory.includes("/")).length > roots.length ? "…" : ""}` })) return;
    try {
      for (const relative of Array.from(directories).sort((left, right) => left.split("/").length - right.split("/").length || left.localeCompare(right))) {
        const segments = relative.split("/");
        const name = segments.pop() || "";
        const parent = [path, ...segments].filter(Boolean).join("/");
        try { await api.createFolder(resource, parent, name); }
        catch (error) { if (!(error instanceof ApiError) || error.code !== "conflict") throw error; }
      }
      const summaries = [];
      const batchPreference = { strategy: null as Exclude<UploadConflictStrategy, "ask"> | null };
      for (const [target, group] of groups) {
        const summary = await upload(group, target, false, batchPreference);
        if (summary) summaries.push(summary);
      }
      if (summaries.length > 0) onComplete?.({
        total: summaries.reduce((sum, item) => sum + item.total, 0),
        completed: summaries.reduce((sum, item) => sum + item.completed, 0),
        failed: summaries.reduce((sum, item) => sum + item.failed, 0),
        details: summaries.flatMap(item => item.details),
      });
    } catch (error) { report(error); }
  };

  const cancelUpload = (id: string) => { controllers.current.get(id)?.abort(); update(id, { status: "cancelled", message: t("cancelled") }); };
  const cancelAllUploads = () => {
    controllers.current.forEach(controller => controller.abort());
    setUploads(current => current.map(task => task.status === "queued" || task.status === "uploading" ? { ...task, status: "cancelled", message: t("cancelled") } : task));
  };
  const removeUploadTask = (id: string) => {
    controllers.current.get(id)?.abort(); controllers.current.delete(id); retryData.current.delete(id);
    setUploads(current => current.filter(task => task.id !== id));
  };
  const retryUpload = (id: string) => {
    const retry = retryData.current.get(id);
    if (!retry) return;
    removeUploadTask(id);
    void upload([retry.file], retry.targetPath);
  };
  const clearFinishedUploads = () => {
    const activeIds = new Set(uploads.filter(task => task.status === "queued" || task.status === "uploading").map(task => task.id));
    retryData.current.forEach((_value, id) => { if (!activeIds.has(id)) retryData.current.delete(id); });
    setUploads(current => current.filter(task => task.status === "queued" || task.status === "uploading"));
  };

  return { uploads, uploadsCollapsed, setUploadsCollapsed, uploadInput, directoryUploadInput, upload, uploadTo: (targetPath: string, files: FileList | File[]) => upload(files, targetPath), uploadDirectory, cancelUpload, cancelAllUploads, removeUploadTask, retryUpload, clearFinishedUploads };
}
