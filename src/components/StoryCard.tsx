import {
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type Status,
  type Story,
} from "../api/types";
import { usePrefetchStory, useUpdateStory } from "../api/queries";

interface StoryCardProps {
  story: Story;
  onOpen: (id: string) => void;
}

export function StoryCard({ story, onOpen }: StoryCardProps) {
  const prefetch = usePrefetchStory();
  const update = useUpdateStory();
  // Pending state for this card only, so one slow save does not dim the board.
  const isSaving = update.isPending;

  return (
    <article
      className={`card${isSaving ? " is-saving" : ""}`}
      onMouseEnter={() => prefetch(story.id)}
      onFocus={() => prefetch(story.id)}
    >
      <div className="card__meta">
        <span className="card__id">{story.id}</span>
        <span className={`badge badge--${story.priority}`}>
          {PRIORITY_LABELS[story.priority]}
        </span>
      </div>

      <h3 className="card__title">
        <button type="button" onClick={() => onOpen(story.id)}>
          {story.title}
        </button>
      </h3>

      <div className="card__footer">
        <span className="tag">{story.epic}</span>
        <span className="points" title="Story points">
          {story.points} pt{story.points === 1 ? "" : "s"}
        </span>
      </div>

      <label className="card__move">
        <span className="visually-hidden">Move {story.id} to</span>
        <select
          value={story.status}
          onChange={(e) =>
            update.mutate({
              id: story.id,
              patch: { status: e.target.value as Status },
            })
          }
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}
