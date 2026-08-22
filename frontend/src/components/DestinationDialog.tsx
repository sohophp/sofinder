import type { MessageKey } from "../i18n";
import type { Entry } from "../types";
import { EntryIcon } from "./EntryVisuals";
import { Modal } from "./Modal";

export interface DestinationState { operation: "copy" | "move"; path: string; folders: Entry[]; loading: boolean }

export function DestinationDialog({ state, unsafe, translate, onBrowse, onConfirm, onClose }: {
  state: DestinationState;
  unsafe: boolean;
  translate: (key: MessageKey) => string;
  onBrowse: (operation: DestinationState["operation"], path: string) => void;
  onConfirm: (operation: DestinationState["operation"], path: string) => void;
  onClose: () => void;
}) {
  const t = translate;
  const crumbs = state.path ? state.path.split("/") : [];
  return <Modal title={state.operation === "move" ? t("moveDestination") : t("copyDestination")} closeLabel={t("close")} onClose={onClose} className="sf-folder-modal" footer={<><span>{t("currentFolder")}: /{state.path}</span><button onClick={onClose}>{t("cancel")}</button><button className="primary" disabled={state.loading || unsafe} onClick={() => onConfirm(state.operation, state.path)}>{state.operation === "move" ? t("moveHere") : t("copyHere")}</button></>}>
    <nav className="sf-folder-crumbs" aria-label={t("chooseFolder")}><button onClick={() => onBrowse(state.operation, "")}>{t("rootFolder")}</button>{crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>› <button onClick={() => onBrowse(state.operation, crumbs.slice(0, index + 1).join("/"))}>{crumb}</button></span>)}</nav>
    <div className="sf-folder-list">{state.loading ? <div className="sf-state">{t("loading")}</div> : state.folders.length === 0 ? <div className="sf-state">{t("noFolders")}</div> : state.folders.map(folder => <button key={folder.path} onDoubleClick={() => onBrowse(state.operation, folder.path)} onClick={() => onBrowse(state.operation, folder.path)}><span className="sf-folder-small"><EntryIcon kind="folder"/></span>{folder.name}<span>›</span></button>)}</div>
    {unsafe && <p className="sf-warning" role="alert">{t("unsafeDestination")}</p>}
  </Modal>;
}
