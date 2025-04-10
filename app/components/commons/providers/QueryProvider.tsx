"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { compress, decompress } from "lz-string";
import * as React from "react";

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = DEFAULT_STALE_TIME * 6; // 30 minutes

export default function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: DEFAULT_GC_TIME,
            staleTime: DEFAULT_STALE_TIME,
            refetchInterval: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );
  queryClient.setQueryDefaults(["accessToken"], { staleTime: Infinity });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "tuanhuydev",
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => {
      try {
        return JSON.parse(decompress(data));
      } catch (error) {
        console.error("Failed to deserialize persisted data:", error);
        return {};
      }
    },
  });

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
      {isDevelopmentEnv && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
