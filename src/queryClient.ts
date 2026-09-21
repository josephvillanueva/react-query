import { MutationCache, QueryClient } from "@tanstack/react-query";
import { showToast } from "./toasts";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds, so moving between filters or
      // reopening a story within that window never waits on the network.
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
  // One place reports every failed mutation, so components only describe
  // what they changed rather than each wiring its own error handling.
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const wasOptimistic = Boolean(mutation.options.onMutate);
      const outcome = wasOptimistic
        ? "The board was rolled back."
        : "Nothing was saved.";
      showToast(`${error.message} ${outcome}`, "error");
    },
  }),
});
