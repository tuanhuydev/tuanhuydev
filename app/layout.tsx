import { sourceCodeFont } from "./font";
import "@app/styles/globals.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isDevelopmentEnv } from "lib/commons/constants/base";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const QueryProvider = dynamic(() => import("@app/components/commons/providers/QueryProvider"), { ssr: false });

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
        <QueryProvider>{children}</QueryProvider>
        {isDevelopmentEnv && <SpeedInsights />}
        <Analytics />
      </body>
    </html>
  );
}
