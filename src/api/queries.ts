import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { showToast } from "../toasts";
import { api } from "./mockApi";
import type { NewStory, Story, StoryFilters, StoryPatch } from "./types";

/**
 * Query keys are built from one factory so every read, write, and invalidation
 * agrees on the shape. Lists are keyed by their filters, so each filter
 * combination is cached separately and revisiting one is instant.
 */
export const storyKeys = {
  all: ["stories"] as const,
  lists: () => [...storyKeys.all, "list"] as const,
  list: (filters: StoryFilters) => [...storyKeys.lists(), filters] as const,
  details: () => [...storyKeys.all, "detail"] as const,
  detail: (id: string) => [...storyKeys.details(), id] as const,
};

function findInLists(client: QueryClient, id: string) {
  for (const [, stories] of client.getQueriesData<Story[]>({
    queryKey: storyKeys.lists(),
  })) {
    const match = stories?.find((story) => story.id === id);
    if (match) return match;
  }
  return undefined;
}

export function useStories(filters: StoryFilters) {
  return useQuery({
    queryKey: storyKeys.list(filters),
    queryFn: () => api.listStories(filters),
    // Keep showing the previous results while a new filter loads, instead of
    // flashing an empty board.
    placeholderData: keepPreviousData,
  });
}

export function useStory(id: string | null) {
  const client = useQueryClient();
  return useQuery({
    queryKey: storyKeys.detail(id ?? ""),
    queryFn: () => api.getStory(id!),
    enabled: id !== null,
    // Seed the detail view from the board's cached list so it opens instantly,
    // then refetch in the background because the list copy may be stale.
    initialData: () => (id ? findInLists(client, id) : undefined),
    initialDataUpdatedAt: 0,
  });
}

export function usePrefetchStory() {
  const client = useQueryClient();
  return (id: string) =>
    client.prefetchQuery({
      queryKey: storyKeys.detail(id),
      queryFn: () => api.getStory(id),
      staleTime: 10_000,
    });
}

type ListSnapshot = [readonly unknown[], Story[] | undefined][];

/**
 * Optimistic update: apply the change to every cached list and the detail
 * entry immediately, keep a snapshot, and restore it if the server rejects
 * the change. The refetch in onSettled reconciles with the server either way.
 */
export function useUpdateStory() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: StoryPatch }) =>
      api.updateStory(id, patch),

    onMutate: async ({ id, patch }) => {
      await client.cancelQueries({ queryKey: storyKeys.all });

      const lists: ListSnapshot = client.getQueriesData<Story[]>({
        queryKey: storyKeys.lists(),
      });
      const detail = client.getQueryData<Story>(storyKeys.detail(id));

      client.setQueriesData<Story[]>({ queryKey: storyKeys.lists() }, (old) =>
        old?.map((story) => (story.id === id ? { ...story, ...patch } : story)),
      );
      if (detail) {
        client.setQueryData<Story>(storyKeys.detail(id), {
          ...detail,
          ...patch,
        });
      }

      return { lists, detail };
    },

    onError: (_error, { id }, context) => {
      context?.lists.forEach(([key, data]) => client.setQueryData(key, data));
      if (context?.detail) {
        client.setQueryData(storyKeys.detail(id), context.detail);
      }
    },

    onSettled: (_data, _error, { id }) => {
      client.invalidateQueries({ queryKey: storyKeys.lists() });
      client.invalidateQueries({ queryKey: storyKeys.detail(id) });
    },
  });
}

/** Optimistic delete with the same snapshot and rollback approach. */
export function useDeleteStory() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteStory(id),

    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: storyKeys.lists() });
      const lists: ListSnapshot = client.getQueriesData<Story[]>({
        queryKey: storyKeys.lists(),
      });
      client.setQueriesData<Story[]>({ queryKey: storyKeys.lists() }, (old) =>
        old?.filter((story) => story.id !== id),
      );
      return { lists };
    },

    onError: (_error, _id, context) => {
      context?.lists.forEach(([key, data]) => client.setQueryData(key, data));
    },

    // Hook-level callbacks run even after the calling component unmounts,
    // unlike callbacks passed to mutate(), and the dialog closes immediately.
    onSuccess: (_data, id) => {
      client.removeQueries({ queryKey: storyKeys.detail(id) });
      showToast(`${id} deleted.`, "success");
    },

    onSettled: () => {
      client.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

/**
 * Creating is deliberately not optimistic: the server assigns the ID, so the
 * form waits for confirmation. This contrasts with the optimistic paths above.
 */
export function useCreateStory() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: NewStory) => api.createStory(input),
    onSuccess: (story) => {
      client.setQueryData(storyKeys.detail(story.id), story);
      showToast(`${story.id} added to the backlog.`, "success");
      return client.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

export function useResetStories() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => api.resetStories(),
    onSuccess: () => client.resetQueries({ queryKey: storyKeys.all }),
  });
}
