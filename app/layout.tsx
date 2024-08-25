import { sourceCodeFont } from "./font";
import { QueryProvider } from "@app/components/commons/providers/QueryProvider";
import "@app/styles/globals.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const ThemeProvider = dynamic(() => import("@app/components/commons/providers/ThemeProvider"), { ssr: false });

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
