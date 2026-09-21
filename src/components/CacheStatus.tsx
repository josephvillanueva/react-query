import { useSyncExternalStore } from "react";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";

/** A live readout of what TanStack Query is doing, for people evaluating it. */
export function CacheStatus() {
  const client = useQueryClient();
  const cache = client.getQueryCache();
  const cachedQueries = useSyncExternalStore(
    (onChange) => cache.subscribe(onChange),
    () => cache.getAll().length,
  );
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  return (
    <dl className="cache-status" aria-label="Query cache status">
      <div>
        <dt>Cached queries</dt>
        <dd>{cachedQueries}</dd>
      </div>
      <div>
        <dt>Fetching</dt>
        <dd className={fetching ? "is-active" : undefined}>{fetching}</dd>
      </div>
      <div>
        <dt>Saving</dt>
        <dd className={mutating ? "is-active" : undefined}>{mutating}</dd>
      </div>
    </dl>
  );
}
