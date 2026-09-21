import {
  EPICS,
  PRIORITIES,
  PRIORITY_LABELS,
  type Epic,
  type Priority,
  type StoryFilters,
} from "../api/types";

interface ToolbarProps {
  filters: StoryFilters;
  onChange: (filters: StoryFilters) => void;
  isRefreshing: boolean;
}

export function Toolbar({ filters, onChange, isRefreshing }: ToolbarProps) {
  const hasFilters =
    filters.search !== "" ||
    filters.priority !== "all" ||
    filters.epic !== "all";

  return (
    <div className="toolbar" role="search">
      <label className="field field--grow">
        <span className="field__label">Search</span>
        <input
          type="search"
          value={filters.search}
          placeholder="Title, ID, or description"
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field__label">Priority</span>
        <select
          value={filters.priority}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value as Priority | "all",
            })
          }
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Epic</span>
        <select
          value={filters.epic}
          onChange={(e) =>
            onChange({ ...filters, epic: e.target.value as Epic | "all" })
          }
        >
          <option value="all">All epics</option>
          {EPICS.map((epic) => (
            <option key={epic} value={epic}>
              {epic}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => onChange({ search: "", priority: "all", epic: "all" })}
        disabled={!hasFilters}
      >
        Clear filters
      </button>

      <span className="sync-indicator" aria-live="polite">
        {isRefreshing ? "Syncing with server..." : ""}
      </span>
    </div>
  );
}
