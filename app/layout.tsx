import { sourceCodeFont } from "./font";
import "@app/styles/globals.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import { Suspense, lazy } from "react";
import { PropsWithChildren } from "react";

const QueryProvider = lazy(() => import("@app/components/commons/providers/QueryProvider"));

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1314205932976713"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <Suspense fallback={<div>Loading app...</div>}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
        {isDevelopmentEnv && <SpeedInsights />}
        <Analytics />
      </body>
    </html>
  );
}
