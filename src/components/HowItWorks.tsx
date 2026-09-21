const POINTS = [
  {
    title: "Cached per filter",
    body: "Each search, priority, and epic combination is its own cache entry. Switch back to a filter you used in the last 30 seconds and it renders instantly, with no request.",
  },
  {
    title: "Optimistic updates",
    body: "Moving a story or changing its priority updates the board immediately, then saves in the background. Turn on simulated failures to watch a rejected save roll the board back.",
  },
  {
    title: "Prefetch on intent",
    body: "Hovering or tabbing onto a card fetches its details early, and the dialog opens from cached board data, so it appears without a spinner.",
  },
  {
    title: "Background refresh",
    body: "Stale data refetches when you return to the tab, and the previous results stay on screen while a new filter loads instead of flashing empty.",
  },
  {
    title: "Pessimistic where it matters",
    body: "Creating a story waits for the server, because the server assigns the ID. Choosing optimistic or pessimistic per action is a product decision as much as a technical one.",
  },
];

export function HowItWorks() {
  return (
    <details className="how">
      <summary>How this demo works</summary>
      <div className="how__grid">
        {POINTS.map((point) => (
          <div key={point.title} className="how__item">
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </div>
        ))}
      </div>
      <p className="how__note">
        The backend is simulated in the browser with 350 to 1100 ms of latency
        and saves to local storage, so the demo deploys as a static site. Open
        the Query Devtools to inspect every cache entry live.
      </p>
    </details>
  );
}
