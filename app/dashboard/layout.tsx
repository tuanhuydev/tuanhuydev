"use client";

import Loader from "@app/components/commons/Loader";
import { LocalizationParser } from "@app/components/commons/hocs/LocalizationParser";
import ThemeProvider from "@app/components/commons/providers/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { PropsWithChildren, Suspense, lazy } from "react";

const GlobalProvider = lazy(() => import("@app/components/commons/providers/GlobalProvider"));

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <LocalizationParser>
        <AppRouterCacheProvider>
          <Suspense fallback={<Loader />}>
            <GlobalProvider>{children}</GlobalProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </LocalizationParser>
    </ThemeProvider>
  );
}
