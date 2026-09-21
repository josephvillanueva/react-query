import { useState } from "react";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  STORY_POINTS,
  type Priority,
  type Status,
  type StoryPatch,
  type StoryPoints,
} from "../api/types";
import { useDeleteStory, useStory, useUpdateStory } from "../api/queries";
import { Modal } from "./Modal";

interface StoryDialogProps {
  storyId: string | null;
  onClose: () => void;
}

const updatedFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function StoryDialog({ storyId, onClose }: StoryDialogProps) {
  return (
    <Modal open={storyId !== null} onClose={onClose} labelledBy="story-title">
      {storyId && <StoryDetail id={storyId} onClose={onClose} />}
    </Modal>
  );
}

function StoryDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { data: story, isPending, isError, error, isFetching } = useStory(id);
  const update = useUpdateStory();
  const remove = useDeleteStory();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (isPending) {
    return <p className="modal__state">Loading story...</p>;
  }

  if (isError) {
    return (
      <div className="modal__state">
        <p>{error.message}</p>
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  const save = (patch: StoryPatch) => update.mutate({ id: story.id, patch });

  const handleDelete = () => {
    remove.mutate(story.id);
    // The card is already gone from the board optimistically, so there is
    // nothing to wait for here.
    onClose();
  };

  return (
    <>
      <header className="modal__header">
        <div>
          <p className="modal__eyebrow">
            {story.id} · {story.epic}
            {isFetching && (
              <span className="modal__syncing"> · refreshing</span>
            )}
          </p>
          <h2 id="story-title">{story.title}</h2>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Close story"
        >
          ×
        </button>
      </header>

      <p className="modal__description">{story.description}</p>

      <div className="modal__fields">
        <label className="field">
          <span className="field__label">Status</span>
          <select
            value={story.status}
            onChange={(e) => save({ status: e.target.value as Status })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Priority</span>
          <select
            value={story.priority}
            onChange={(e) => save({ priority: e.target.value as Priority })}
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
            value={story.points}
            onChange={(e) =>
              save({ points: Number(e.target.value) as StoryPoints })
            }
          >
            {STORY_POINTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="modal__section">
        <h3>Acceptance criteria</h3>
        <ol className="criteria">
          {story.acceptanceCriteria.map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ol>
      </section>

      <footer className="modal__footer">
        <span className="modal__updated">
          Updated {updatedFormat.format(new Date(story.updatedAt))}
        </span>
        {confirmingDelete ? (
          <div className="confirm">
            <span>Delete this story?</span>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--ghost btn--danger-text"
            onClick={() => setConfirmingDelete(true)}
          >
            Delete story
          </button>
        )}
      </footer>
    </>
  );
}
