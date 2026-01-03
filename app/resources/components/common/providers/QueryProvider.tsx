"use client";

import { getQueryClient } from "@app/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import * as React from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopmentEnv && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
