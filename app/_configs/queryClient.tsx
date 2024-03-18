import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const DEFAULT_GC_TIME = 1000 * 60 * 60 * 24; // 24 hours
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 3 minutes

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: DEFAULT_GC_TIME,
          staleTime: DEFAULT_STALE_TIME,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          retry: false,
        },
      },
    }),
);

export default getQueryClient;
