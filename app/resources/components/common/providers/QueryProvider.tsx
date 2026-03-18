"use client";

import { getQueryClient } from "@app/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { useEffect } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  // Restore session state without blocking initial render
  // This prevents hydration mismatches and layout shifts
  useEffect(() => {
    try {
      const token = window.localStorage.getItem("accessToken");
      if (token) {
        queryClient.setQueryData(["accessToken"], token);
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopmentEnv && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
