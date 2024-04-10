"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { compress, decompress } from "lz-string";
import * as React from "react";

const DEFAULT_STALE_TIME = 1000 * 60 * 3; // 3 minutes
const DEFAULT_GC_TIME = DEFAULT_STALE_TIME * 24 * 7; // 7 days
export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: DEFAULT_GC_TIME,
            staleTime: DEFAULT_STALE_TIME,
            refetchInterval: false,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
        },
      }),
  );
  queryClient.setQueryDefaults(["accessToken"], { staleTime: Infinity });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decompress(data)),
  });

  const isDevelopmentEnv = process.env.NODE_ENV === "development";

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
      {isDevelopmentEnv && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
