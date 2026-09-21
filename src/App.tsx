import { lazy, Suspense, useDeferredValue, useState } from "react";
import { useStories, useResetStories } from "./api/queries";
import { networkSettings } from "./api/mockApi";
import type { StoryFilters } from "./api/types";
import { Board } from "./components/Board";
import { CacheStatus } from "./components/CacheStatus";
import { HowItWorks } from "./components/HowItWorks";
import { NewStoryDialog } from "./components/NewStoryDialog";
import { StoryDialog } from "./components/StoryDialog";
import { Toasts } from "./components/Toasts";
import { Toolbar } from "./components/Toolbar";
import { showToast } from "./toasts";

// Loaded only when a visitor asks for it, so it adds nothing to the initial
// bundle of the production site.
const QueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

const FAILURE_RATE = 0.4;

export default function App() {
  const [filters, setFilters] = useState<StoryFilters>({
    search: "",
    priority: "all",
    epic: "all",
  });
  // Typing stays responsive while the query key trails slightly behind.
  const deferredFilters = useDeferredValue(filters);
  const { data: stories, isPending, isError, error, isFetching, refetch } =
    useStories(deferredFilters);

  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [failuresOn, setFailuresOn] = useState(false);
  const [showDevtools, setShowDevtools] = useState(false);
  const reset = useResetStories();

  const toggleFailures = (on: boolean) => {
    networkSettings.failureRate = on ? FAILURE_RATE : 0;
    setFailuresOn(on);
  };

  return (
    <>
      <a className="skip-link" href="#board">
        Skip to board
      </a>

      <header className="app-header">
        <div className="app-header__intro">
          <p className="eyebrow">TanStack Query demo</p>
          <h1>Backlog Board</h1>
          <p className="byline">
            Built by{" "}
            <a href="https://joseph-villanueva-portfolio.vercel.app">
              Joseph Villanueva
            </a>
          </p>
        </div>

        <div className="app-header__actions">
          <label className="switch">
            <input
              type="checkbox"
              checked={failuresOn}
              onChange={(e) => toggleFailures(e.target.checked)}
            />
            <span className="switch__track" aria-hidden="true" />
            <span>Simulate failures</span>
          </label>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setShowDevtools((v) => !v)}
            aria-pressed={showDevtools}
          >
            {showDevtools ? "Hide" : "Open"} Query Devtools
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() =>
              reset.mutate(undefined, {
                onSuccess: () => showToast("Demo data restored.", "info"),
              })
            }
            disabled={reset.isPending}
          >
            {reset.isPending ? "Resetting..." : "Reset demo data"}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setCreating(true)}
          >
            New story
          </button>
        </div>
      </header>

      <main id="board" className="app-main">
        <HowItWorks />

        <div className="board-bar">
          <Toolbar
            filters={filters}
            onChange={setFilters}
            isRefreshing={isFetching && !isPending}
          />
          <CacheStatus />
        </div>

        {isPending ? (
          <p className="board-state">Loading backlog...</p>
        ) : isError ? (
          <div className="board-state">
            <p>Could not load the backlog: {error.message}</p>
            <button type="button" className="btn" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        ) : stories.length === 0 ? (
          <p className="board-state">No stories match these filters.</p>
        ) : (
          <Board stories={stories} onOpen={setOpenStoryId} />
        )}
      </main>

      <StoryDialog storyId={openStoryId} onClose={() => setOpenStoryId(null)} />
      <NewStoryDialog open={creating} onClose={() => setCreating(false)} />
      <Toasts />

      {showDevtools && (
        <Suspense fallback={null}>
          <QueryDevtools initialIsOpen buttonPosition="bottom-left" />
        </Suspense>
      )}
    </>
  );
}
