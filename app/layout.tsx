import { sourceCodeFont } from "./font";
import "@app/styles/globals.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const QueryProvider = dynamic(
  () => import("@app/components/commons/providers/QueryProvider").then((module) => module.QueryProvider),
  { ssr: false },
);

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <body>
        <AppRouterCacheProvider>
          <QueryProvider>{children}</QueryProvider>
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
