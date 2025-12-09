"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
            retry: 1, // Only retry once to prevent excessive requests
          },
        },
      }),
  );
  queryClient.setQueryDefaults(["accessToken"], { staleTime: Infinity });

  // Fix for hydration error - Use useEffect to ensure client-side only execution
  const [persister, setPersister] = React.useState<any>(null);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPersister(
        createSyncStoragePersister({
          storage: window.localStorage,
          key: "tuanhuydev",
          throttleTime: 1000, // Only persist every second at most
          serialize: (data) => compress(JSON.stringify(data)),
          deserialize: (data) => {
            try {
              return JSON.parse(decompress(data));
            } catch (error) {
              console.error("Failed to deserialize persisted data:", error);
              return {};
            }
          },
        }),
      );
    }
  }, []);

  // Return consistent output for both server and client initial render
  return (
    <QueryClientProvider client={queryClient}>
      {persister ? (
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
          {isDevelopmentEnv && <ReactQueryDevtools initialIsOpen={false} />}
        </PersistQueryClientProvider>
      ) : (
        // While persister is loading on client, provide a simpler provider structure
        // This ensures the same component tree shape on both server and client
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </QueryClientProvider>
  );
}
