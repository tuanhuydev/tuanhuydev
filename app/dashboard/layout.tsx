import Sidebar from "@app/components/DashboardModule/Sidebar";
import { LocalizationParser } from "@app/components/commons/hocs/LocalizationParser";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Viewport } from "next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const QueryProvider = dynamic(() => import("@app/components/commons/providers/QueryProvider"), { ssr: false });
const GlobalProvider = dynamic(() => import("@app/components/commons/providers/GlobalProvider"), { ssr: false });
const ThemeProvider = dynamic(() => import("@app/components/commons/providers/ThemeProvider"));

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};
export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <LocalizationParser>
      <AppRouterCacheProvider>
        <QueryProvider>
          <GlobalProvider>
            <div className="w-full h-screen overflow-hidden flex justify-center flex-nowrap">
              <div className="flex w-full relative overflow-hidden">
                <Sidebar />
                <div className="motion-safe:animate-fadeIn bg-slate-50 dark:bg-gray-950 p-3 h-full flex grow flex-col">
                  {children}
                </div>
              </div>
            </div>
          </GlobalProvider>
        </QueryProvider>
      </AppRouterCacheProvider>
    </LocalizationParser>
  );
}
