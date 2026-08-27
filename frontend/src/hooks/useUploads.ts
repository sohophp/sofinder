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

export function useUploads({ api, resource, path, currentResource, currentDepth, autoCollapse, conflictStrategy, lowercaseExtensions, t, ask, chooseConflict, reload, setNotice, report }: {
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
  chooseConflict: (fileName: string) => Promise<Exclude<UploadConflictStrategy, "ask">>;
  reload: () => Promise<void>;
  setNotice: (notice: string) => void;
  report: (error: unknown) => void;
}) {
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [uploadsCollapsed, setUploadsCollapsed] = useState(false);
  const uploadInput = useRef<HTMLInputElement>(null);
  const directoryUploadInput = useRef<HTMLInputElement>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const retryData = useRef(new Map<string, { file: File; targetPath: string }>());
  const sequence = useRef(0);
  const conflictQueue = useRef<Promise<void>>(Promise.resolve());

  const resolveConflict = (fileName: string): Promise<Exclude<UploadConflictStrategy, "ask">> => {
    if (conflictStrategy !== "ask") return Promise.resolve(conflictStrategy);
    const choice = conflictQueue.current.then(() => chooseConflict(fileName));
    conflictQueue.current = choice.then(() => undefined, () => undefined);
    return choice;
  };

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

  const upload = async (files: FileList | File[], targetPath = path) => {
    const candidates = Array.from(files).map(file => uploadFileWithName(file, normalizeUploadExtension(file.name, lowercaseExtensions)));
    const accepted = currentResource ? candidates.filter(file => entryNameIssue(file.name, currentResource.maxFileNameLength) === null) : candidates;
    if (accepted.length !== candidates.length && currentResource) {
      const issues = candidates.map(file => entryNameIssue(file.name, currentResource.maxFileNameLength)).filter(issue => issue !== null);
      setNotice(issues.includes("tooLong") ? `${t("fileNameTooLong")} ${currentResource.maxFileNameLength}` : t("invalidEntryName"));
    }
    const jobs = accepted.map(file => {
      const id = `${Date.now()}-${++sequence.current}`;
      const controller = new AbortController();
      controllers.current.set(id, controller);
      retryData.current.set(id, { file, targetPath });
      const pending = api.findPendingUpload(resource, targetPath, file, false);
      return { id, file, controller, pendingId: pending ? `pending-${pending.id}` : null };
    });
    if (jobs.length === 0) return;
    setUploadsCollapsed(false);
    const resumedIds = new Set(jobs.map(job => job.pendingId).filter((id): id is string => id !== null));
    setUploads(current => [...current.filter(task => !resumedIds.has(task.id)), ...jobs.map(({ id, file, pendingId }) => ({ id, name: file.name, progress: 0, status: "queued" as const, message: pendingId ? t("uploadResuming") : undefined }))]);

    let cursor = 0;
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
              break;
            } catch (error) {
              if (error instanceof ApiError && error.code === "conflict" && !overwrite && !autoRename) {
                const strategy = await resolveConflict(job.file.name);
                if (strategy === "skip") {
                  update(job.id, { status: "skipped", progress: 0, message: t("uploadConflictSkip") });
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
          update(job.id, error instanceof DOMException && error.name === "AbortError"
            ? { status: "cancelled", message: t("cancelled") }
            : { status: "error", message: error instanceof Error ? error.message : t("error") });
        } finally { controllers.current.delete(job.id); }
      }
    };
    await Promise.all(Array.from({ length: Math.min(3, jobs.length) }, () => worker()));
    await reload();
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
      for (const [target, group] of groups) await upload(group, target);
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
