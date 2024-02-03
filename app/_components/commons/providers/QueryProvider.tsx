import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import Script from "next/script";
import React, { PropsWithChildren, useEffect, useState } from "react";

const DEFAULT_STALE = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC = 1000 * 60 * 60 * 24; // 24 hours

let localStoragePersister;

export default function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: DEFAULT_STALE,
            gcTime: DEFAULT_GC,
          },
        },
      }),
  );

  useEffect(() => {
    localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "queryClient",
    });

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
    });
  }, [queryClient]);

  return (
    <>
      <Script strategy="beforeInteractive" id="localStorageScript">
        {`
          window.localStorage = window.localStorage || {};
        `}
      </Script>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
