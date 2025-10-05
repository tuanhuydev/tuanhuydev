import Loader from "@app/components/commons/Loader";
import { LocalizationParser } from "@app/components/commons/hocs/LocalizationParser";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { PropsWithChildren, Suspense, lazy } from "react";

const GlobalProvider = lazy(() => import("@app/components/commons/providers/GlobalProvider"));
const ThemeProvider = lazy(() => import("@app/components/commons/providers/ThemeProvider"));

// Force all dashboard pages to be dynamic
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<Loader />}>
      <ThemeProvider>
        <LocalizationParser>
          <AppRouterCacheProvider>
            <GlobalProvider>{children}</GlobalProvider>
          </AppRouterCacheProvider>
        </LocalizationParser>
      </ThemeProvider>
    </Suspense>
  );
}
