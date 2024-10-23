import Transition from "./components/commons/Transition";
import { sourceCodeFont } from "./font";
import "@app/styles/globals.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Viewport } from "next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const QueryProvider = dynamic(() => import("@app/components/commons/providers/QueryProvider"), { ssr: false });
const ThemeProvider = dynamic(() => import("@app/components/commons/providers/ThemeProvider"), { ssr: false });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <body>
        <ThemeProvider>
          <AppRouterCacheProvider>
            <QueryProvider>
              <Transition>{children}</Transition>
            </QueryProvider>
            <SpeedInsights />
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
