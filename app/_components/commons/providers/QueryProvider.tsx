"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import * as React from "react";

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const isDevelopmentEnv = process.env.NODE_ENV !== "production";

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
      {/* {isDevelopmentEnv && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}
