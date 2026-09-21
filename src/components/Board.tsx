import { STATUSES, STATUS_LABELS, type Story } from "../api/types";
import { StoryCard } from "./StoryCard";

interface BoardProps {
  stories: Story[];
  onOpen: (id: string) => void;
}

export function Board({ stories, onOpen }: BoardProps) {
  return (
    <div className="board">
      {STATUSES.map((status) => {
        const column = stories.filter((story) => story.status === status);
        const points = column.reduce((sum, story) => sum + story.points, 0);
        const headingId = `column-${status}`;

        return (
          <section
            key={status}
            className={`column column--${status}`}
            aria-labelledby={headingId}
          >
            <header className="column__header">
              <h2 id={headingId}>{STATUS_LABELS[status]}</h2>
              <span className="column__stats">
                {column.length} {column.length === 1 ? "story" : "stories"} ·{" "}
                {points} pts
              </span>
            </header>

            <div className="column__cards">
              {column.length === 0 ? (
                <p className="column__empty">Nothing here yet.</p>
              ) : (
                column.map((story) => (
                  <StoryCard key={story.id} story={story} onOpen={onOpen} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
