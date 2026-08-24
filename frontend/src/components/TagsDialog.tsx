import { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { UiIcon } from "./UiIcon";

export function TagsDialog({ initial, suggestions, labels, onSave, onClose }: {
  initial: string[];
  suggestions: string[];
  labels: { title: string; close: string; cancel: string; save: string; input: string; hint: string; maximum: string };
  onSave: (tags: string[]) => void;
  onClose: () => void;
}) {
  const [tags, setTags] = useState(() => initial.slice(0, 10));
  const [value, setValue] = useState("");
  const normalized = useMemo(() => new Set(tags.map(tag => tag.toLocaleLowerCase())), [tags]);
  const available = suggestions.filter(tag => !normalized.has(tag.toLocaleLowerCase()) && (value.trim() === "" || tag.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()))).slice(0, 8);
  const add = (candidate = value) => {
    const next = candidate.trim().replace(/^[,，]+|[,，]+$/gu, "");
    if (next === "" || Array.from(next).length > 30 || tags.length >= 10 || normalized.has(next.toLocaleLowerCase())) return;
    setTags(current => [...current, next]);
    setValue("");
  };
  const remove = (tag: string) => setTags(current => current.filter(item => item !== tag));

  return <Modal title={labels.title} closeLabel={labels.close} onClose={onClose} className="sf-tags-modal" footer={<><span>{tags.length} / 10</span><button onClick={onClose}>{labels.cancel}</button><button className="primary" onClick={() => onSave(tags)}>{labels.save}</button></>}>
    <div className="sf-tags-editor">
      <div className="sf-tags-input" onClick={event => event.currentTarget.querySelector("input")?.focus()}>
        {tags.map(tag => <span key={tag}>{tag}<button type="button" onClick={() => remove(tag)} aria-label={`${labels.close}: ${tag}`}><UiIcon name="close"/></button></span>)}
        <input autoFocus value={value} maxLength={30} disabled={tags.length >= 10} placeholder={tags.length === 0 ? labels.input : ""} onChange={event => {
          const next = event.target.value;
          if (/[,，]$/u.test(next)) add(next); else setValue(next);
        }} onKeyDown={event => {
          if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(); }
          if (event.key === "Backspace" && value === "" && tags.length > 0) remove(tags.at(-1) || "");
        }} onBlur={() => add()}/>
      </div>
      {available.length > 0 && <div className="sf-tag-suggestions">{available.map(tag => <button type="button" key={tag} onMouseDown={event => event.preventDefault()} onClick={() => add(tag)}><UiIcon name="add"/> {tag}</button>)}</div>}
      <small>{labels.hint} · {labels.maximum}</small>
    </div>
  </Modal>;
}
