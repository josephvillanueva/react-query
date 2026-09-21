import { useState, type FormEvent } from "react";
import {
  EPICS,
  PRIORITIES,
  PRIORITY_LABELS,
  STORY_POINTS,
  type Epic,
  type Priority,
  type StoryPoints,
} from "../api/types";
import { useCreateStory } from "../api/queries";
import { Modal } from "./Modal";

interface NewStoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewStoryDialog({ open, onClose }: NewStoryDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="new-story-title">
      <NewStoryForm onClose={onClose} />
    </Modal>
  );
}

function NewStoryForm({ onClose }: { onClose: () => void }) {
  const create = useCreateStory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    "As a ..., I want ..., so that ...",
  );
  const [criteria, setCriteria] = useState("");
  const [epic, setEpic] = useState<Epic>("Checkout");
  const [priority, setPriority] = useState<Priority>("medium");
  const [points, setPoints] = useState<StoryPoints>(3);

  const acceptanceCriteria = criteria
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const canSubmit = title.trim().length > 0 && acceptanceCriteria.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    create.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        acceptanceCriteria,
        epic,
        priority,
        points,
        status: "backlog",
      },
      // Unlike the optimistic paths, this waits for the server to confirm
      // before the form closes, because the server assigns the story ID.
      { onSuccess: onClose },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <header className="modal__header">
        <h2 id="new-story-title">New story</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </header>

      <label className="field">
        <span className="field__label">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </label>

      <label className="field">
        <span className="field__label">User story</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </label>

      <label className="field">
        <span className="field__label">
          Acceptance criteria <span className="field__hint">one per line</span>
        </span>
        <textarea
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          rows={4}
          placeholder="Given ..., when ..., then ..."
          required
        />
      </label>

      <div className="modal__fields">
        <label className="field">
          <span className="field__label">Epic</span>
          <select
            value={epic}
            onChange={(e) => setEpic(e.target.value as Epic)}
          >
            {EPICS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Story points</span>
          <select
            value={points}
            onChange={(e) => setPoints(Number(e.target.value) as StoryPoints)}
          >
            {STORY_POINTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <footer className="modal__footer">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={!canSubmit || create.isPending}
        >
          {create.isPending ? "Saving..." : "Add to backlog"}
        </button>
      </footer>
    </form>
  );
}
