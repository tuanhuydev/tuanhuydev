import Sidebar from "@app/components/DashboardModule/Sidebar";
import { LocalizationParser } from "@app/components/commons/hocs/LocalizationParser";
import ThemeProvider from "@app/components/commons/providers/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Suspense, lazy } from "react";
import { PropsWithChildren } from "react";
import { userPermissionAction } from "server/actions/authActions";

const GlobalProvider = lazy(() => import("@app/components/commons/providers/GlobalProvider"));

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const userPermission: Record<string, any>[] = await userPermissionAction();

  return (
    <ThemeProvider>
      <LocalizationParser>
        <AppRouterCacheProvider>
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <GlobalProvider>
              <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
                <div className="flex w-full relative overflow-hidden">
                  <Sidebar permissions={userPermission} />
                  <div className="motion-safe:animate-fadeIn bg-slate-50 dark:bg-gray-950 p-3 h-full flex grow flex-col">
                    {children}
                  </div>
                </div>
              </div>
            </GlobalProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </LocalizationParser>
    </ThemeProvider>
  );
}
