"use client";

import GoogleAdsense from "./_components/GoogleAdsense";
import { QueryProvider } from "./_components/commons/providers/QueryProvider";
import { sourceCodeFont } from "./font";
import ThemeProvider from "@components/commons/providers/ThemeProvider";
import { GOOGLE_ADSENSE, GOOGLE_ANALYTIC, GOOGLE_TAG, isProductionEnv } from "@lib/configs/constants";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "@styles/globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const App = dynamic(() => import("antd/es/app"), { ssr: false });
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceCodeFont.className}>
      <head>
        {isProductionEnv && GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}
        {isProductionEnv && GOOGLE_ANALYTIC && <GoogleAnalytics gaId={GOOGLE_ANALYTIC} />}
        {isProductionEnv && GOOGLE_ADSENSE && <GoogleAdsense />}
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <App>{children}</App>
          </QueryProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
