"use client";

import { getQueryClient } from "@app/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { useEffect, useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [isRestored, setIsRestored] = useState<boolean>(false);

  useEffect(() => {
    const restoreSession = () => {
      try {
        const token = window.localStorage.getItem("accessToken");

        if (token) {
          queryClient.setQueryData(["accessToken"], token);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        // Mark as restored so the app can start rendering
        setIsRestored(true);
      }
    };

    if (!isRestored) {
      restoreSession();
    }
  }, [isRestored, queryClient]);

  if (!isRestored) {
    return null; // or a loading spinner
  }
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopmentEnv && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
